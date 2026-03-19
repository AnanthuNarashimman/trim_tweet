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
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { text, includeHashtags = true, tone = 'informal' } = req.body;

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

    // Determine word limit based on whether hashtags will be included
    const wordLimit = includeHashtags ? 30 : 40;
    const normalizedTone = typeof tone === 'string' && tone.toLowerCase() === 'formal'
      ? 'formal'
      : 'informal';
    const toneInstruction = normalizedTone === 'formal'
      ? 'Use a professional, polished, and formal tone. Avoid slang and keep the language business-friendly.'
      : 'Use a conversational, friendly, and informal tone. Keep it natural, approachable, and engaging.';

    // Call Gemini to optimize the post for X's free tier
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
    const prompt = `You are an expert social media content optimizer specializing in X (formerly Twitter). Your task is to:
1. Optimize posts to fit within approximately ${wordLimit} words for maximum impact
  2. Maintain the core message while adapting to the selected tone
3. Make it engaging and impactful
4. Suggest 3-5 relevant hashtags that would increase reach
  5. Apply this tone style: ${normalizedTone}

  Tone guidance:
  ${toneInstruction}

Return your response in the following JSON format:
{
  "optimizedPost": "The shortened post text (aim for around ${wordLimit} words)",
  "wordCount": number,
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "hashtagsString": "#hashtag1 #hashtag2 #hashtag3"
}

IMPORTANT RULES:
- Aim for approximately ${wordLimit} words in the optimizedPost
- Do NOT include hashtags in optimizedPost - keep them separate
- Focus on word count rather than character count
- Keep it concise and impactful

Optimize this post for X (Twitter) free tier:

${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)```/) || responseText.match(/```\s*([\s\S]*?)```/);
    const jsonText = jsonMatch ? jsonMatch[1] : responseText;
    const data = JSON.parse(jsonText.trim());

    // Validate and format the response - use LLM output as-is
    const optimizedPost = data.optimizedPost || data.post || text;
    
    const characterCount = optimizedPost.length;
    const wordCount = data.wordCount || optimizedPost.split(/\s+/).filter(word => word.length > 0).length;
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
        originalWordCount: text.split(/\s+/).filter(word => word.length > 0).length,
        optimizedPost,
        characterCount,
        wordCount,
        wordLimit,
        tone: normalizedTone,
        includeHashtags,
        remainingCharacters: 280 - characterCount,
        hashtags,
        hashtagsString,
        canFitHashtags,
        fullPostWithHashtags: includeHashtags && canFitHashtags 
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
