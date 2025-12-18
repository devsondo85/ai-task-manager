import { getPriorityConfig } from '../utils/priorityUtils';
import { getDueDateStatus, getDueDateColor, formatDueDateShort } from '../utils/dateUtils';

const TaskCard = ({ task, onUpdate }) => {
  const priorityConfig = getPriorityConfig(task.priority);
  const dueDateStatus = getDueDateStatus(task.due_date);
  const dueDateColor = getDueDateColor(task.due_date);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-l-4 ${priorityConfig.borderColor} border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow duration-200 cursor-pointer`}
      onClick={() => onUpdate && onUpdate(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900 flex-1 pr-2">
          {task.title}
        </h4>
        <span className={priorityConfig.badgeClass}>
          {priorityConfig.icon} {priorityConfig.label}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs mt-3">
        {task.due_date ? (
          <div className="flex items-center gap-1">
            <span className={dueDateColor}>
              📅 {dueDateStatus.label}
            </span>
            {dueDateStatus.status === 'overdue' && (
              <span className="text-red-600 font-bold">⚠️</span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">No due date</span>
        )}
        {task.estimated_time && (
          <span className="text-gray-400">
            ⏱️ {Math.floor(task.estimated_time / 60)}h {task.estimated_time % 60}m
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

