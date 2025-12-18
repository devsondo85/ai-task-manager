import { supabase } from '../config/database.js';

/**
 * Get all tasks
 * Supports filtering by status and priority
 */
export const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    
    let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    if (priority) {
      query = query.eq('priority', priority);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      count: data.length,
      tasks: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }
      throw error;
    }
    
    res.json({
      success: true,
      task: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new task
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, due_date, estimated_time } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }
    
    // Prepare task data
    const taskData = {
      title,
      description: description || null,
      status: status || 'todo',
      priority: priority || 'medium',
      due_date: due_date || null,
      estimated_time: estimated_time || null
    };
    
    // Validate status
    if (taskData.status && !['todo', 'in_progress', 'done'].includes(taskData.status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be one of: todo, in_progress, done'
      });
    }
    
    // Validate priority
    if (taskData.priority && !['low', 'medium', 'high'].includes(taskData.priority)) {
      return res.status(400).json({
        success: false,
        error: 'Priority must be one of: low, medium, high'
      });
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date, estimated_time } = req.body;
    
    // Build update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) {
      if (!['todo', 'in_progress', 'done'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status must be one of: todo, in_progress, done'
        });
      }
      updateData.status = status;
    }
    if (priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({
          success: false,
          error: 'Priority must be one of: low, medium, high'
        });
      }
      updateData.priority = priority;
    }
    if (due_date !== undefined) updateData.due_date = due_date;
    if (estimated_time !== undefined) updateData.estimated_time = estimated_time;
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }
      throw error;
    }
    
    res.json({
      success: true,
      message: 'Task updated successfully',
      task: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // First check if task exists
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', id)
      .single();
    
    if (fetchError || !task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // Delete the task
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

