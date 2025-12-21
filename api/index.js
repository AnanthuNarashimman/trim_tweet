import http from 'http';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Check if Gemini API key is loaded
if (!process.env.GEMINI_API_KEY) {
  console.error('\n❌ Error: GEMINI_API_KEY not found in environment variables');
  console.error('📝 Please create api/.env file with:');
  console.error('   GEMINI_API_KEY=your-key-here\n');
  process.exit(1);
}

// Import handler after env vars are loaded
const { default: handler } = await import('./shorten.js');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only handle /api/shorten endpoint
  if (req.url !== '/api/shorten' && req.url !== '/shorten') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // Parse request body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      // Parse JSON body
      const parsedBody = body ? JSON.parse(body) : {};

      // Create mock Vercel request/response objects
      const mockReq = {
        method: req.method,
        headers: req.headers,
        body: parsedBody,
        url: req.url
      };

      const mockRes = {
        status: (code) => {
          res.statusCode = code;
          return mockRes;
        },
        json: (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data, null, 2));
        }
      };

      // Call the Vercel handler
      await handler(mockReq, mockRes);

    } catch (error) {
      console.error('Server error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Local API server running at http://localhost:${PORT}`);
  console.log(`\n📍 Endpoint: http://localhost:${PORT}/api/shorten`);
  console.log(`\n✅ Test with:\n`);
  console.log(`curl -X POST http://localhost:${PORT}/api/shorten \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d "{\\"text\\": \\"Your long post here...\\"}"\n`);
});
