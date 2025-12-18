import { format } from 'date-fns';

const TaskCard = ({ task, onUpdate }) => {
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
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM dd');
    } catch {
      return null;
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onUpdate && onUpdate(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900 flex-1 pr-2">
          {task.title}
        </h4>
        <span className={getPriorityBadgeClass(task.priority)}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
        {task.due_date && (
          <span className={isOverdue(task.due_date) ? 'text-red-600 font-medium' : ''}>
            {formatDate(task.due_date)}
            {isOverdue(task.due_date) && ' ⚠️'}
          </span>
        )}
        {task.estimated_time && (
          <span className="text-gray-400">
            {Math.floor(task.estimated_time / 60)}h {task.estimated_time % 60}m
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

