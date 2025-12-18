/**
 * Priority utility functions
 */

export const getPriorityConfig = (priority) => {
  const configs = {
    high: {
      label: 'High',
      color: 'red',
      icon: '🔴',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      badgeClass: 'badge badge-high',
    },
    medium: {
      label: 'Medium',
      color: 'yellow',
      icon: '🟡',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      badgeClass: 'badge badge-medium',
    },
    low: {
      label: 'Low',
      color: 'green',
      icon: '🟢',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      badgeClass: 'badge badge-low',
    },
  };

  return configs[priority] || configs.medium;
};

export const getPriorityOrder = (priority) => {
  const order = { high: 3, medium: 2, low: 1 };
  return order[priority] || 2;
};

export const sortTasksByPriority = (tasks) => {
  return [...tasks].sort((a, b) => {
    return getPriorityOrder(b.priority) - getPriorityOrder(a.priority);
  });
};

