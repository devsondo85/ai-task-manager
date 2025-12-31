import axios from 'axios';

// Use environment variable if provided, otherwise use relative path for dev or backend URL for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? '/api' : 'https://ai-task-manager-mauve-three.vercel.app/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Tasks API
export const tasksAPI = {
  // Get all tasks
  getAll: async (filters = {}) => {
    try {
      const { status, priority } = filters;
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);
      
      const response = await api.get(`/tasks?${params.toString()}`);
      
      // Handle different response structures
      if (response.data && response.data.tasks) {
        return response.data;
      } else if (Array.isArray(response.data)) {
        return { tasks: response.data, count: response.data.length };
      } else if (response.data && response.data.error) {
        throw new Error(response.data.error.message || response.data.error || 'Failed to fetch tasks');
      } else {
        return { tasks: [], count: 0 };
      }
    } catch (error) {
      // Re-throw with more context
      if (error.response) {
        const errorData = error.response.data;
        if (errorData?.error?.message) {
          throw new Error(errorData.error.message);
        } else if (errorData?.error) {
          throw new Error(typeof errorData.error === 'string' ? errorData.error : 'Failed to fetch tasks');
        }
      }
      throw error;
    }
  },

  // Get single task
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create task
  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  update: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

// AI API
export const aiAPI = {
  // Get task breakdown
  getBreakdown: async (description) => {
    const response = await api.post('/ai/breakdown', { description });
    return response.data;
  },

  // Get priority suggestion
  getPriority: async (description, dueDate = null) => {
    const response = await api.post('/ai/priority', { description, due_date: dueDate });
    return response.data;
  },

  // Get time estimate
  getTimeEstimate: async (description) => {
    const response = await api.post('/ai/time-estimate', { description });
    return response.data;
  },

  // Get all suggestions at once
  getAllSuggestions: async (description, dueDate = null) => {
    const response = await api.post('/ai/suggestions', { description, due_date: dueDate });
    return response.data;
  },
};

export default api;

