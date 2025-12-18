import {
  generateTaskBreakdown,
  suggestPriority,
  estimateTime
} from '../services/aiService.js';
import { isOpenAIConfigured } from '../config/openai.js';

/**
 * Generate smart breakdown of a task into subtasks
 * POST /api/ai/breakdown
 * Body: { description: string }
 */
export const getTaskBreakdown = async (req, res, next) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Task description is required'
      });
    }

    if (!isOpenAIConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'AI features are not available. Please configure OPENAI_API_KEY.'
      });
    }

    const subtasks = await generateTaskBreakdown(description.trim());

    res.json({
      success: true,
      subtasks,
      count: subtasks.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get AI-suggested priority for a task
 * POST /api/ai/priority
 * Body: { description: string, due_date?: string }
 */
export const getPrioritySuggestion = async (req, res, next) => {
  try {
    const { description, due_date } = req.body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Task description is required'
      });
    }

    if (!isOpenAIConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'AI features are not available. Please configure OPENAI_API_KEY.'
      });
    }

    const priority = await suggestPriority(description.trim(), due_date || null);

    res.json({
      success: true,
      priority,
      description: description.trim(),
      due_date: due_date || null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get AI time estimation for a task
 * POST /api/ai/time-estimate
 * Body: { description: string }
 */
export const getTimeEstimate = async (req, res, next) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Task description is required'
      });
    }

    if (!isOpenAIConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'AI features are not available. Please configure OPENAI_API_KEY.'
      });
    }

    const estimatedMinutes = await estimateTime(description.trim());

    // Convert minutes to hours and minutes for better readability
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;

    res.json({
      success: true,
      estimated_time: estimatedMinutes,
      estimated_time_display: hours > 0 
        ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim()
        : `${minutes}m`,
      description: description.trim()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all AI suggestions at once (breakdown, priority, time)
 * POST /api/ai/suggestions
 * Body: { description: string, due_date?: string }
 */
export const getAllSuggestions = async (req, res, next) => {
  try {
    const { description, due_date } = req.body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Task description is required'
      });
    }

    if (!isOpenAIConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'AI features are not available. Please configure OPENAI_API_KEY.'
      });
    }

    // Get all suggestions in parallel for better performance
    const [subtasks, priority, estimatedMinutes] = await Promise.all([
      generateTaskBreakdown(description.trim()),
      suggestPriority(description.trim(), due_date || null),
      estimateTime(description.trim())
    ]);

    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;

    res.json({
      success: true,
      subtasks,
      priority,
      estimated_time: estimatedMinutes,
      estimated_time_display: hours > 0 
        ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim()
        : `${minutes}m`,
      description: description.trim(),
      due_date: due_date || null
    });
  } catch (error) {
    next(error);
  }
};

