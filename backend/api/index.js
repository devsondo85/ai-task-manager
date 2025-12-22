// Vercel serverless function entry point
import app from '../server.js';

// Export as Vercel serverless function handler
export default async (req, res) => {
  // Handle the request through Express app
  app(req, res);
};

