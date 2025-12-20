import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tasks API
export const tasksAPI = {
  // Get all tasks
  getAll: async (filters = {}) => {
    const { status, priority } = filters;
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
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

