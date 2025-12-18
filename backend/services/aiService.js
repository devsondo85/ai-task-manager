import { openai, isOpenAIConfigured, getOpenAIModel } from '../config/openai.js';

/**
 * AI Service for task-related AI operations
 * Handles smart breakdown, priority suggestions, and time estimation
 */

/**
 * Generate a smart breakdown of a task into subtasks
 * @param {string} taskDescription - The task description
 * @returns {Promise<Array>} Array of subtask objects
 */
export const generateTaskBreakdown = async (taskDescription) => {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI is not configured. Please set OPENAI_API_KEY environment variable.');
  }

  try {
    const prompt = `Break down the following task into 3-5 actionable subtasks.
Task: ${taskDescription}

Return a JSON object with a "subtasks" array. Each subtask should have "title" and "description" fields.`;

    const response = await openai.chat.completions.create({
      model: getOpenAIModel(),
      messages: [
        {
          role: 'system',
          content: 'You are a helpful task management assistant. Break down tasks into clear, actionable subtasks. Always respond with valid JSON in the format: {"subtasks": [{"title": "...", "description": "..."}]}'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    // Extract subtasks from the response
    const subtasks = parsed.subtasks || [];
    
    return subtasks.map((subtask, index) => ({
      title: subtask.title || `Subtask ${index + 1}`,
      description: subtask.description || ''
    }));
  } catch (error) {
    console.error('Error generating task breakdown:', error);
    throw new Error(`Failed to generate task breakdown: ${error.message}`);
  }
};

/**
 * Suggest priority level for a task based on description
 * @param {string} taskDescription - The task description
 * @param {string} dueDate - Optional due date
 * @returns {Promise<string>} Priority level: 'low', 'medium', or 'high'
 */
export const suggestPriority = async (taskDescription, dueDate = null) => {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI is not configured. Please set OPENAI_API_KEY environment variable.');
  }

  try {
    const dueDateContext = dueDate 
      ? `Due date: ${new Date(dueDate).toLocaleDateString()}`
      : 'No due date specified';

    const prompt = `Analyze the urgency and importance of this task and suggest a priority level.
Task: ${taskDescription}
${dueDateContext}

Respond with only one word: "low", "medium", or "high".`;

    const response = await openai.chat.completions.create({
      model: getOpenAIModel(),
      messages: [
        {
          role: 'system',
          content: 'You are a task prioritization assistant. Analyze tasks and suggest priority levels based on urgency and importance. Respond with only one word: low, medium, or high.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });

    const priority = response.choices[0].message.content.trim().toLowerCase();
    
    // Validate response
    if (['low', 'medium', 'high'].includes(priority)) {
      return priority;
    }
    
    // Default to medium if response is invalid
    return 'medium';
  } catch (error) {
    console.error('Error suggesting priority:', error);
    throw new Error(`Failed to suggest priority: ${error.message}`);
  }
};

/**
 * Estimate time to complete a task
 * @param {string} taskDescription - The task description
 * @returns {Promise<number>} Estimated time in minutes
 */
export const estimateTime = async (taskDescription) => {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI is not configured. Please set OPENAI_API_KEY environment variable.');
  }

  try {
    const prompt = `Estimate how long it will take to complete this task in minutes.
Consider the complexity, typical work pace, and task type.
Task: ${taskDescription}

Respond with only a number representing minutes (e.g., 30, 60, 120).`;

    const response = await openai.chat.completions.create({
      model: getOpenAIModel(),
      messages: [
        {
          role: 'system',
          content: 'You are a time estimation assistant. Estimate task completion time in minutes. Respond with only a number.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });

    const content = response.choices[0].message.content.trim();
    const minutes = parseInt(content.match(/\d+/)?.[0] || '60', 10);
    
    // Clamp between 5 minutes and 8 hours (480 minutes)
    return Math.max(5, Math.min(480, minutes));
  } catch (error) {
    console.error('Error estimating time:', error);
    throw new Error(`Failed to estimate time: ${error.message}`);
  }
};

