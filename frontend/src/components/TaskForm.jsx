import { useState, useEffect } from 'react';
import { tasksAPI, aiAPI } from '../services/api';

const TaskForm = ({ task = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
    estimated_time: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  const isEditMode = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        estimated_time: task.estimated_time ? task.estimated_time.toString() : '',
      });
    }
  }, [task]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.estimated_time && (isNaN(formData.estimated_time) || formData.estimated_time < 0)) {
      newErrors.estimated_time = 'Estimated time must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleGetAISuggestions = async () => {
    if (!formData.description.trim()) {
      setErrors({ description: 'Please enter a description to get AI suggestions' });
      return;
    }

    setAiLoading(true);
    setErrors({});
    try {
      const response = await aiAPI.getAllSuggestions(
        formData.description,
        formData.due_date || null
      );
      setAiSuggestions(response);
      setShowAiSuggestions(true);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to get AI suggestions';
      setErrors({ ai: errorMessage });
      console.error('Error getting AI suggestions:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyPriority = () => {
    if (aiSuggestions?.priority) {
      setFormData((prev) => ({ ...prev, priority: aiSuggestions.priority }));
    }
  };

  const handleApplyTimeEstimate = () => {
    if (aiSuggestions?.estimated_time) {
      setFormData((prev) => ({ ...prev, estimated_time: aiSuggestions.estimated_time.toString() }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || null,
        estimated_time: formData.estimated_time ? parseInt(formData.estimated_time) : null,
      };

      if (isEditMode) {
        await tasksAPI.update(task.id, taskData);
      } else {
        await tasksAPI.create(taskData);
      }

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to save task';
      setErrors({ submit: errorMessage });
      console.error('Error saving task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter task title"
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              {!isEditMode && formData.description.trim() && (
                <button
                  type="button"
                  onClick={handleGetAISuggestions}
                  disabled={aiLoading}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  {aiLoading ? (
                    <>⏳ Getting AI suggestions...</>
                  ) : (
                    <>✨ Get AI Suggestions</>
                  )}
                </button>
              )}
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input"
              placeholder="Enter task description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            {errors.ai && (
              <p className="mt-1 text-sm text-red-600">{errors.ai}</p>
            )}
          </div>

          {/* AI Suggestions */}
          {showAiSuggestions && aiSuggestions && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-primary-900">✨ AI Suggestions</h3>
                <button
                  type="button"
                  onClick={() => setShowAiSuggestions(false)}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  Hide
                </button>
              </div>

              {/* Priority Suggestion */}
              {aiSuggestions.priority && (
                <div className="flex items-center justify-between bg-white rounded p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Suggested Priority:</p>
                    <p className="text-sm text-gray-600 capitalize">{aiSuggestions.priority}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPriority}
                    className="btn btn-primary text-xs px-3 py-1"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Time Estimate */}
              {aiSuggestions.estimated_time && (
                <div className="flex items-center justify-between bg-white rounded p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Estimated Time:</p>
                    <p className="text-sm text-gray-600">
                      {aiSuggestions.estimated_time_display} ({aiSuggestions.estimated_time} minutes)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyTimeEstimate}
                    className="btn btn-primary text-xs px-3 py-1"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Task Breakdown */}
              {aiSuggestions.subtasks && aiSuggestions.subtasks.length > 0 && (
                <div className="bg-white rounded p-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Suggested Subtasks:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {aiSuggestions.subtasks.map((subtask, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {subtask.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="estimated_time" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                id="estimated_time"
                name="estimated_time"
                value={formData.estimated_time}
                onChange={handleChange}
                min="0"
                className={`input ${errors.estimated_time ? 'border-red-500' : ''}`}
                placeholder="e.g., 60"
              />
              {errors.estimated_time && (
                <p className="mt-1 text-sm text-red-600">{errors.estimated_time}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

