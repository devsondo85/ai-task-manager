import { useState, useEffect, useMemo } from 'react';
import { tasksAPI } from '../services/api';
import { getPriorityConfig } from '../utils/priorityUtils';
import { getDueDateStatus, getDueDateColor, formatDueDate } from '../utils/dateUtils';
import { applyFilters } from '../utils/filterUtils';
import TaskForm from './TaskForm';
import SearchAndFilter from './SearchAndFilter';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

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


  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedTask(null);
  };

  const handleFormSuccess = () => {
    fetchTasks(); // Refresh tasks after create/update
  };

  // Apply filters to tasks
  const filteredTasks = useMemo(() => {
    return applyFilters(tasks, { searchQuery, statusFilter, priorityFilter });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setPriorityFilter('');
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
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {filteredTasks.length} of {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
          <button
            onClick={handleCreateTask}
            className="btn btn-primary"
          >
            + New Task
          </button>
        </div>
      </div>

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onClearFilters={handleClearFilters}
      />

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks match your filters</p>
          <button
            onClick={handleClearFilters}
            className="text-primary-600 hover:text-primary-700 mt-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => {
          const priorityConfig = getPriorityConfig(task.priority);
          const dueDateStatus = getDueDateStatus(task.due_date);
          const dueDateColor = getDueDateColor(task.due_date);

          return (
            <div
              key={task.id}
              className={`card border-l-4 ${priorityConfig.borderColor} hover:shadow-md transition-shadow duration-200 cursor-pointer`}
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    <span className={priorityConfig.badgeClass}>
                      {priorityConfig.icon} {priorityConfig.label}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500 capitalize">
                      Status: <span className="font-medium">{task.status.replace('_', ' ')}</span>
                    </span>
                    {task.due_date ? (
                      <span className={dueDateColor}>
                        📅 {dueDateStatus.label}
                        {dueDateStatus.status === 'overdue' && ' ⚠️'}
                      </span>
                    ) : (
                      <span className="text-gray-400">No due date</span>
                    )}
                    {task.estimated_time && (
                      <span className="text-gray-500">
                        ⏱️ {Math.floor(task.estimated_time / 60)}h {task.estimated_time % 60}m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {showForm && (
        <TaskForm
          task={selectedTask}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default TaskList;

