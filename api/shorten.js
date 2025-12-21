import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured.' 
      });
    }

    // Call OpenAI to optimize the post for X's free tier (280 characters)
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert social media content optimizer specializing in X (formerly Twitter). Your task is to:
1. Optimize posts to fit within X's free tier limit of 280 characters
2. Maintain the core message and tone
3. Make it engaging and impactful
4. Suggest 3-5 relevant hashtags that would increase reach

Return your response in the following JSON format:
{
  "optimizedPost": "The shortened post text (max 280 characters)",
  "characterCount": number,
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "hashtagsString": "#hashtag1 #hashtag2 #hashtag3"
}

IMPORTANT: The optimizedPost should NOT include hashtags. Keep hashtags separate. Ensure the optimizedPost is under 280 characters.`
        },
        {
          role: 'user',
          content: `Optimize this post for X (Twitter) free tier:\n\n${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0].message.content;
    const result = JSON.parse(responseText);

    // Validate and format the response
    const optimizedPost = result.optimizedPost || result.post || text.substring(0, 280);
    const characterCount = optimizedPost.length;
    const hashtags = result.hashtags || [];
    const hashtagsString = result.hashtagsString || hashtags.map(tag => `#${tag.replace('#', '')}`).join(' ');

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
          : optimizedPost,
        tokensUsed: completion.usage?.total_tokens || 0
      }
    });

  } catch (error) {
    console.error('Error processing request:', error);

    // Handle specific OpenAI errors
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key.' 
      });
    }

    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'OpenAI API rate limit exceeded. Please try again later.' 
      });
    }

    if (error.status === 503) {
      return res.status(503).json({ 
        error: 'OpenAI service temporarily unavailable. Please try again.' 
      });
    }

    return res.status(500).json({ 
      error: 'An error occurred while processing your request.',
      details: error.message 
    });
  }
}
