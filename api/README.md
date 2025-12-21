# X-Shortener API

Serverless API for optimizing posts for X (Twitter) free tier with AI-powered hashtag recommendations.

## Endpoint

`POST /api/shorten`

## Request Body

```json
{
  "text": "Your long post text that needs to be optimized for X's 280 character limit..."
}
```

## Response

```json
{
  "success": true,
  "data": {
    "original": "Your original text...",
    "originalLength": 350,
    "optimizedPost": "Optimized version of your post (max 280 chars)",
    "characterCount": 245,
    "remainingCharacters": 35,
    "hashtags": ["tech", "ai", "coding"],
    "hashtagsString": "#tech #ai #coding",
    "canFitHashtags": true,
    "fullPostWithHashtags": "Optimized post text\n\n#tech #ai #coding",
    "tokensUsed": 250
  }
}
```

## Setup

1. **Install dependencies:**
   ```bash
   cd api
   npm install
   ```

2. **Configure OpenAI API Key:**
   - Create a `.env` file in the api directory
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=sk-your-api-key-here
     ```

3. **For Vercel deployment:**
   - Go to your Vercel project settings
   - Add environment variable: `OPENAI_API_KEY`
   - Set the value to your OpenAI API key

## Local Testing

You can test the API locally using curl or any HTTP client:

```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"text": "Your long post text here..."}'
```

## Features

- ✅ Optimizes posts for X's 280 character limit
- ✅ AI-powered content optimization using GPT-3.5-turbo
- ✅ Suggests 3-5 relevant hashtags
- ✅ Calculates if hashtags can fit within character limit
- ✅ Returns both post-only and post-with-hashtags versions
- ✅ CORS enabled for browser requests
- ✅ Comprehensive error handling
- ✅ Token usage tracking

## Error Responses

- `400` - Invalid input (missing or empty text)
- `401` - Invalid OpenAI API key
- `405` - Method not allowed (use POST)
- `429` - Rate limit exceeded
- `500` - Server error
- `503` - OpenAI service unavailable

## Notes

- Uses GPT-3.5-turbo for cost efficiency (free tier compatible)
- Supports CORS for frontend integration
- Includes token usage tracking to monitor API costs
- Optimized for Vercel serverless deployment
