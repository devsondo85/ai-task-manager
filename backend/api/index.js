// Vercel serverless function entry point
import app from '../server.js';

// Export as Vercel serverless function
export default (req, res) => {
  return app(req, res);
};

