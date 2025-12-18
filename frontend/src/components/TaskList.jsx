import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import { format } from 'date-fns';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksAPI.getAll();
      setTasks(response.tasks || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'badge badge-high';
      case 'medium':
        return 'badge badge-medium';
      case 'low':
        return 'badge badge-low';
      default:
        return 'badge badge-medium';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchTasks}
          className="btn btn-primary mt-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tasks found</p>
        <p className="text-gray-400 text-sm mt-2">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Tasks</h2>
        <span className="text-sm text-gray-500">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <span className={getPriorityBadgeClass(task.priority)}>
                    {task.priority}
                  </span>
                </div>

                {task.description && (
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="capitalize">
                    Status: <span className="font-medium">{task.status.replace('_', ' ')}</span>
                  </span>
                  {task.due_date && (
                    <span className={isOverdue(task.due_date) ? 'text-red-600 font-medium' : ''}>
                      Due: {formatDate(task.due_date)}
                      {isOverdue(task.due_date) && ' (Overdue)'}
                    </span>
                  )}
                  {task.estimated_time && (
                    <span>
                      Est: {Math.floor(task.estimated_time / 60)}h {task.estimated_time % 60}m
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

