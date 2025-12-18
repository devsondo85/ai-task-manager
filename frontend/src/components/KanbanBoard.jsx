import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import TaskCard from './TaskCard';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'in_progress', title: 'In Progress', status: 'in_progress' },
    { id: 'done', title: 'Done', status: 'done' },
  ];

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

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleTaskClick = (task) => {
    // Task click handler - will be enhanced in future commits with edit functionality
    console.log('Task clicked:', task);
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
        <button onClick={fetchTasks} className="btn btn-primary mt-2">
          Retry
        </button>
      </div>
    );
  }

  const totalTasks = tasks.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Kanban Board</h2>
        <span className="text-sm text-gray-500">
          {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          const taskCount = columnTasks.length;

          return (
            <div key={column.id} className="flex flex-col">
              <div className="bg-gray-50 rounded-t-lg px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700">{column.title}</h3>
                  <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                    {taskCount}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-b-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                {taskCount === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-8">
                    No tasks
                  </div>
                ) : (
                  <div>
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onUpdate={handleTaskClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;

