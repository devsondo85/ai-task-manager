import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  WARNING: OPENAI_API_KEY environment variable is not set. AI features will not work.');
}

// Create OpenAI client
export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

/**
 * Check if OpenAI is configured and available
 */
export const isOpenAIConfigured = () => {
  return openai !== null && process.env.OPENAI_API_KEY !== undefined;
};

/**
 * Get OpenAI model configuration
 * Defaults to gpt-3.5-turbo for cost efficiency
 */
export const getOpenAIModel = () => {
  return process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
};

/**
 * Test OpenAI connection
 */
export const testOpenAIConnection = async () => {
  if (!isOpenAIConfigured()) {
    return {
      configured: false,
      message: 'OpenAI API key is not configured'
    };
  }

  try {
    // Make a simple test request
    const response = await openai.chat.completions.create({
      model: getOpenAIModel(),
      messages: [
        { role: 'user', content: 'Test' }
      ],
      max_tokens: 5
    });

    return {
      configured: true,
      message: 'OpenAI connection successful',
      model: getOpenAIModel()
    };
  } catch (error) {
    return {
      configured: false,
      message: `OpenAI connection failed: ${error.message}`
    };
  }
};

export default openai;

