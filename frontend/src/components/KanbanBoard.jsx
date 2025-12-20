import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { tasksAPI } from '../services/api';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import SearchAndFilter from './SearchAndFilter';
import { applyFilters } from '../utils/filterUtils';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const columns = [
    { 
      id: 'todo', 
      title: 'To Do', 
      status: 'todo',
      subtitle: 'Ready to start',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green'
    },
    { 
      id: 'in_progress', 
      title: 'In Progress', 
      status: 'in_progress',
      subtitle: 'Currently working',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'orange'
    },
    { 
      id: 'done', 
      title: 'Done', 
      status: 'done',
      subtitle: 'Completed tasks',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: 'purple'
    },
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

  // Apply filters to tasks
  const filteredTasks = useMemo(() => {
    return applyFilters(tasks, { searchQuery, statusFilter, priorityFilter });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const getTasksByStatus = (status) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setPriorityFilter('');
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

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the task being moved
    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    // Get the new status from the destination column
    const destinationColumn = columns.find((col) => col.id === destination.droppableId);
    if (!destinationColumn) return;

    const newStatus = destinationColumn.status;

    // If status hasn't changed, just reorder (we'll handle reordering in future)
    if (task.status === newStatus) {
      return;
    }

    // Optimistically update the UI
    const updatedTasks = tasks.map((t) =>
      t.id === draggableId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    // Update task status in the backend
    try {
      await tasksAPI.update(draggableId, { status: newStatus });
    } catch (err) {
      console.error('Error updating task status:', err);
      // Revert on error
      setTasks(tasks);
      setError('Failed to update task status. Please try again.');
    }
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
  const filteredCount = filteredTasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Kanban Board</h2>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {totalTasks} Tasks
              </span>
              <span className="px-3 py-1.5 bg-white text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                {progressPercentage}% Progress
              </span>
            </div>
            <button
              onClick={handleCreateTask}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 flex-1 sm:flex-none justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.status);
            const taskCount = columnTasks.length;
            const colorClasses = {
              green: 'bg-green-100 text-green-700 border-green-200',
              orange: 'bg-orange-100 text-orange-700 border-orange-200',
              purple: 'bg-purple-100 text-purple-700 border-purple-200'
            };
            const iconBgClasses = {
              green: 'bg-green-500',
              orange: 'bg-orange-500',
              purple: 'bg-purple-500'
            };

            return (
              <div key={column.id} className="flex flex-col">
                <div className={`bg-white rounded-lg px-4 py-3 border-b-2 ${colorClasses[column.color].split(' ')[2]}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`${iconBgClasses[column.color]} rounded-lg p-1.5 text-white`}>
                        {column.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{column.title}</h3>
                        <p className="text-xs text-gray-500">{column.subtitle}</p>
                      </div>
                    </div>
                    <span className={`${colorClasses[column.color].split(' ')[0]} ${colorClasses[column.color].split(' ')[1]} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                      {taskCount}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`bg-gray-50 rounded-b-lg p-3 sm:p-4 min-h-[300px] sm:min-h-[400px] max-h-[500px] sm:max-h-[600px] overflow-y-auto transition-colors ${
                  snapshot.isDraggingOver ? 'bg-gray-100' : ''
                }`}
              >
                      {taskCount === 0 ? (
                        <div className="text-center text-gray-400 text-sm py-8">
                          {snapshot.isDraggingOver ? 'Drop here' : 'No tasks'}
                        </div>
                      ) : (
                        <div>
                          {columnTasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={
                                    snapshot.isDragging
                                      ? 'opacity-75 transform rotate-2'
                                      : ''
                                  }
                                >
                                  <TaskCard
                                    task={task}
                                    onUpdate={handleTaskClick}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <TaskForm
          task={selectedTask}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </DragDropContext>
  );
};

export default KanbanBoard;

