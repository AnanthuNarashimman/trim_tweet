# TrimTweet (X-Shortener)

![Status](https://img.shields.io/badge/status-active-green?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Platform](https://img.shields.io/badge/platform-X%20%7C%20Twitter-1DA1F2?style=for-the-badge&logo=x&logoColor=white)

AI-powered post optimizer for X (Twitter), optimizing your content to fit the 280 character limit with intelligent hashtag suggestions.

## Overview

TrimTweet uses OpenAI GPT-3.5-turbo to intelligently optimize your social media posts, ensuring they fit perfectly within X's 280-character limit without losing your voice or key message.

## Features

- ✨ **AI-Powered Optimization:** Using OpenAI GPT-3.5-turbo
- 🎯 **280 Character Limit:** Perfect for X's free tier
- 🏷️ **Smart Hashtags:** 3-5 relevant tag recommendations
- 🎨 **Beautiful UI:** Smooth sliding animations
- 📋 **One-Click Copy:** Easy clipboard integration
- 💨 **Fast Deployment:** Vercel serverless architecture

## Tech Stack

**Frontend:** React 19, Vite, Lucide React Icons, CSS3 animations  
**Backend:** Vercel Serverless Functions, OpenAI API, Node.js

## Quick Start

### 1. Installation

```bash
# Install API dependencies
cd api && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Environment Setup

**API Configuration** - Create `api/.env`:
```
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Client Configuration** - Create `client/.env.development`:
```
VITE_API_URL=http://localhost:3000/api/shorten
```

### 3. Run Development

```bash
# Use Vercel Dev (Recommended)
vercel dev

# OR run separately:
# Terminal 1 - API
cd api && npm run dev

# Terminal 2 - Client  
cd client && npm run dev
```

Visit `http://localhost:3000`

## Deployment to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Add OpenAI API key
vercel env add OPENAI_API_KEY

# Deploy
vercel --prod
```

## API Documentation

### Endpoint
`POST /api/shorten`

### Request
```json
{
  "text": "Your long post that needs optimization..."
}
```

### Response
```json
{
  "success": true,
  "data": {
    "optimizedPost": "Optimized version (max 280 chars)",
    "characterCount": 245,
    "hashtags": ["tech", "ai", "coding"],
    "hashtagsString": "#tech #ai #coding"
  }
}
```

## Project Structure

```
x-shortener/
├── api/
│   ├── shorten.js        # Serverless API function
│   └── package.json
├── client/
│   ├── src/
│   │   ├── Pages/Page.jsx     # Main component
│   │   └── PageStyles/Page.css # Animations & styles
│   └── package.json
└── vercel.json           # Deployment config
```

## Roadmap

- ✅ X (Twitter) optimization with OpenAI
- ✅ Smooth sliding animations
- ✅ Hashtag recommendations
- 🔜 LinkedIn post formatting
- 🔜 Threads support
- 🔜 Multi-platform optimization

## Technology

Built with React, powered by OpenAI GPT-3.5-turbo, and designed for seamless user experience.

---

Built with ❤️ using React, OpenAI, and Vercel
