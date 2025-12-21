import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { text } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid input. Please provide text in the request body.' 
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Text cannot be empty.' 
      });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API key not configured.' 
      });
    }

    // Call Gemini to optimize the post for X's free tier (280 characters)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    const prompt = `You are an expert social media content optimizer specializing in X (formerly Twitter). Your task is to:
1. Optimize posts to fit STRICTLY within X's free tier limit of 280 characters - NO EXCEPTIONS
2. Maintain the core message and tone
3. Make it engaging and impactful
4. Suggest 3-5 relevant hashtags that would increase reach

Return your response in the following JSON format:
{
  "optimizedPost": "The shortened post text (MUST be under 280 characters)",
  "characterCount": number,
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "hashtagsString": "#hashtag1 #hashtag2 #hashtag3"
}

CRITICAL RULES:
- The optimizedPost MUST be under 280 characters - this is non-negotiable
- Do NOT include hashtags in optimizedPost - keep them separate
- Count characters carefully and ensure you stay well under 280
- If the post is close to the limit, make it shorter to be safe

Optimize this post for X (Twitter) free tier:

${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)```/) || responseText.match(/```\s*([\s\S]*?)```/);
    const jsonText = jsonMatch ? jsonMatch[1] : responseText;
    const data = JSON.parse(jsonText.trim());

    // Validate and format the response
    let optimizedPost = data.optimizedPost || data.post || text.substring(0, 280);
    
    // STRICT enforcement: truncate if over 280 characters
    if (optimizedPost.length > 280) {
      optimizedPost = optimizedPost.substring(0, 277) + '...';
    }
    
    const characterCount = optimizedPost.length;
    const hashtags = data.hashtags || [];
    const hashtagsString = data.hashtagsString || hashtags.map(tag => `#${tag.replace('#', '')}`).join(' ');

    // Calculate how much space is left for hashtags
    const remainingSpace = 280 - characterCount;
    const canFitHashtags = remainingSpace > hashtagsString.length + 2; // +2 for spacing

    return res.status(200).json({
      success: true,
      data: {
        original: text,
        originalLength: text.length,
        optimizedPost,
        characterCount,
        remainingCharacters: 280 - characterCount,
        hashtags,
        hashtagsString,
        canFitHashtags,
        fullPostWithHashtags: canFitHashtags 
          ? `${optimizedPost}\n\n${hashtagsString}` 
          : optimizedPost
      }
    });

  } catch (error) {
    console.error('Error processing request:', error);

    // Handle specific Gemini API errors
    if (error.status === 401 || error.message?.includes('API key')) {
      return res.status(401).json({ 
        error: 'Invalid Gemini API key.' 
      });
    }

    if (error.status === 429 || error.message?.includes('quota')) {
      return res.status(429).json({ 
        error: 'Gemini API rate limit exceeded. Please try again later.' 
      });
    }

    if (error.status === 503) {
      return res.status(503).json({ 
        error: 'Gemini service temporarily unavailable. Please try again.' 
      });
    }

    return res.status(500).json({ 
      error: 'An error occurred while processing your request.',
      details: error.message 
    });
  }
}
