import { getPriorityConfig } from '../utils/priorityUtils';
import { getDueDateStatus, getDueDateColor, formatDueDateShort } from '../utils/dateUtils';

const TaskCard = ({ task, onUpdate }) => {
  const priorityConfig = getPriorityConfig(task.priority);
  const dueDateStatus = getDueDateStatus(task.due_date);
  const dueDateColor = getDueDateColor(task.due_date);

  // Get border gradient based on status
  const getStatusBorder = () => {
    switch (task.status) {
      case 'todo':
        return 'border-t-4 border-t-green-500';
      case 'in_progress':
        return 'border-t-4 border-t-orange-500';
      case 'done':
        return 'border-t-4 border-t-purple-500';
      default:
        return 'border-t-4 border-t-gray-300';
    }
  };

  // Get priority badge styling
  const getPriorityBadgeClass = () => {
    switch (task.priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get due date badge styling
  const getDueDateBadgeClass = () => {
    if (!task.due_date) return 'bg-gray-100 text-gray-500';
    const status = getDueDateStatus(task.due_date);
    switch (status.status) {
      case 'overdue':
        return 'bg-red-100 text-red-700';
      case 'today':
        return 'bg-orange-100 text-orange-700';
      case 'tomorrow':
      case 'soon':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm ${getStatusBorder()} border border-gray-200 p-4 mb-3 hover:shadow-md transition-all duration-200 cursor-pointer group`}
      onClick={() => onUpdate && onUpdate(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-bold text-gray-900 flex-1 pr-2 leading-tight">
          {task.title}
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdate && onUpdate(task);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass()}`}>
            {priorityConfig.label}
          </span>
          {task.due_date && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getDueDateBadgeClass()}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {dueDateStatus.status === 'overdue' ? (
                <span className="flex items-center gap-1">
                  <span>Overdue</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
              ) : (
                <span>{dueDateStatus.label}</span>
              )}
            </span>
          )}
        </div>
        {task.estimated_time && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {Math.floor(task.estimated_time / 60)}h {task.estimated_time % 60}m
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

