# TrimTweet (X-Shortener)

![Status](https://img.shields.io/badge/status-active-green?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Platform](https://img.shields.io/badge/platform-X%20%7C%20Twitter-1DA1F2?style=for-the-badge&logo=x&logoColor=white)

AI-powered post optimizer for X (Twitter), optimizing your content to fit the 280 character limit with intelligent hashtag suggestions.

## Overview

TrimTweet uses **Google Gemini 2.5 Flash Lite** to intelligently optimize your social media posts, ensuring they fit perfectly within X's character limits while maintaining your voice and key message. The system uses word-count based optimization for better content quality.

## Features

- ✨ **AI-Powered Optimization:** Using Google Gemini 2.5 Flash Lite
- 🎯 **Word-Count Based:** 30 words (with hashtags) or 40 words (without)
- 🏷️ **Smart Hashtags:** 3-5 relevant tag recommendations
- 🎨 **Beautiful UI:** Smooth animations and professional design
- 📋 **One-Click Copy:** Easy clipboard integration
- 💨 **Fast Deployment:** Vercel serverless architecture
- 🔒 **Toggle Hashtags:** Choose whether to include hashtags or not

## Tech Stack

**Frontend:** React 19, Vite, Lucide React Icons, CSS3 animations  
**Backend:** Vercel Serverless Functions, Google Gemini API, Node.js (ES Modules)

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd x-shortener

# Install API dependencies
cd api
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

#### API Configuration
Create `api/.env`:
```env
GEMINI_API_KEY=your-gemini-api-key-here
```

**Get your Gemini API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste it into your `.env` file

#### Client Configuration
Create `client/.env.development`:
```env
VITE_API_URL=http://localhost:3000/api/shorten
```

For production, create `client/.env.production`:
```env
VITE_API_URL=https://your-backend-url.vercel.app/shorten
```

### 3. Run Development

#### Option 1: Run Backend Locally

**Terminal 1 - API Server:**
```bash
cd api
npm run dev
```
The API will start on `http://localhost:3000`

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```
Visit `http://localhost:5173` (or the port shown in terminal)

#### Option 2: Use Vercel Dev (Alternative)
```bash
# From project root
vercel dev
```

## Deployment

### Backend Deployment (Vercel)

1. **Create a new Vercel project**
   - Connect your Git repository
   - Select the `/api` folder as the root directory
   - Framework: **Other**

2. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `GEMINI_API_KEY` with your Gemini API key

3. **Deploy**
   ```bash
   git push origin master
   ```
   Vercel will auto-deploy on push

### Frontend Deployment (Vercel)

1. **Create a new Vercel project**
   - Connect your Git repository
   - Select the `/client` folder as the root directory
   - Framework: **Vite**

2. **Configure Environment Variables**
   - Add: `VITE_API_URL` with your backend URL
   - Example: `https://your-api.vercel.app/shorten`

3. **Deploy**
   ```bash
   git push origin master
   ```

## API Documentation

### Endpoint
`POST /shorten`

### Request
```json
{
  "text": "Your long post that needs optimization...",
  "includeHashtags": true
}
```

**Parameters:**
- `text` (string, required): The post content to optimize
- `includeHashtags` (boolean, optional): Whether to generate hashtags (default: `true`)
  - `true`: Optimizes to ~30 words
  - `false`: Optimizes to ~40 words

### Response
```json
{
  "success": true,
  "data": {
    "original": "Your original post...",
    "originalLength": 350,
    "originalWordCount": 58,
    "optimizedPost": "Optimized version",
    "characterCount": 245,
    "wordCount": 38,
    "wordLimit": 30,
    "includeHashtags": true,
    "remainingCharacters": 35,
    "hashtags": ["tech", "ai", "coding"],
    "hashtagsString": "#tech #ai #coding",
    "canFitHashtags": true,
    "fullPostWithHashtags": "Optimized version\n\n#tech #ai #coding"
  }
}
```

### Error Response
```json
{
  "error": "Error message describing what went wrong"
}
```

**Error Codes:**
- `400`: Invalid input (missing text, empty text)
- `405`: Method not allowed (only POST accepted)
- `429`: Rate limit exceeded (Gemini API quota)
- `500`: Server error
- `503`: Gemini service unavailable

## Project Structure

```
x-shortener/
├── api/
│   ├── shorten.js           # Serverless API function
│   ├── index.js             # Local dev server
│   ├── package.json         # API dependencies
│   ├── vercel.json          # API deployment config
│   └── .env                 # Environment variables (not in git)
│
├── client/
│   ├── src/
│   │   ├── Pages/
│   │   │   └── Page.jsx              # Main app component
│   │   ├── PageStyles/
│   │   │   └── Page.css              # Styles & animations
│   │   ├── assets/
│   │   │   └── logo.png              # App logo
│   │   └── main.jsx                  # Entry point
│   ├── package.json                  # Client dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── vercel.json                   # Frontend deployment config
│   └── .env.development              # Dev environment vars
│
└── README.md                         # This file
```

## Features Breakdown

### Word-Count Based Optimization
Instead of strictly enforcing character limits, the AI optimizes based on word count:
- **With hashtags**: ~30 words (leaves room for hashtags)
- **Without hashtags**: ~40 words (more content space)

This approach provides more natural, readable posts while staying within X's 280-character limit.

### Smart Contact Card
Click the "Contact" button to reveal social profile links with smooth animations:
- GitHub
- X (Twitter)
- LinkedIn

### Platform Support Status
- ✅ **X (Twitter)**: Fully optimized
- 🔜 **LinkedIn**: Coming soon
- 🔜 **Threads**: Coming soon

## Local Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **API Testing**: Use tools like Postman or curl to test the API directly:
   ```bash
   curl -X POST http://localhost:3000/api/shorten \
     -H "Content-Type: application/json" \
     -d '{"text":"Your test post here","includeHashtags":true}'
   ```
3. **Environment Variables**: Never commit `.env` files - they're in `.gitignore`

## Troubleshooting

### "Failed to fetch" Error
- Ensure backend is running and accessible
- Check CORS headers in API response
- Verify `VITE_API_URL` is correctly set in frontend

### Backend Not Starting
- Verify `GEMINI_API_KEY` is set in `api/.env`
- Check if port 3000 is available
- Ensure all dependencies are installed: `npm install`

### Frontend Not Connecting to Backend
- Check `VITE_API_URL` in client environment variables
- Ensure backend URL ends with `/shorten`
- Verify backend is deployed and accessible

## Roadmap

- ✅ X (Twitter) optimization with Gemini AI
- ✅ Word-count based optimization
- ✅ Toggle for hashtag inclusion
- ✅ Smooth animations and transitions
- ✅ Professional contact card
- 🔜 Usage rate limiting per IP
- 🔜 LinkedIn post formatting
- 🔜 Threads support
- 🔜 Multi-platform optimization
- 🔜 User accounts and saved posts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using React, Google Gemini AI, and Vercel
