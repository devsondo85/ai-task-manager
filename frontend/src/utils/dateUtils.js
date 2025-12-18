import { format, differenceInDays, isPast, isToday, isTomorrow } from 'date-fns';

/**
 * Date utility functions for task due dates
 */

export const formatDueDate = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch {
    return null;
  }
};

export const formatDueDateShort = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return format(date, 'MMM dd');
  } catch {
    return null;
  }
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  try {
    return isPast(new Date(dateString)) && !isToday(new Date(dateString));
  } catch {
    return false;
  }
};

export const getDueDateStatus = (dateString) => {
  if (!dateString) return { status: 'none', label: 'No due date', urgency: 0 };

  try {
    const date = new Date(dateString);
    const daysUntil = differenceInDays(date, new Date());

    if (isPast(date) && !isToday(date)) {
      return {
        status: 'overdue',
        label: 'Overdue',
        urgency: 3,
        days: Math.abs(daysUntil),
      };
    }

    if (isToday(date)) {
      return {
        status: 'today',
        label: 'Due today',
        urgency: 2,
        days: 0,
      };
    }

    if (isTomorrow(date)) {
      return {
        status: 'tomorrow',
        label: 'Due tomorrow',
        urgency: 1,
        days: 1,
      };
    }

    if (daysUntil <= 7) {
      return {
        status: 'soon',
        label: `Due in ${daysUntil} days`,
        urgency: 1,
        days: daysUntil,
      };
    }

    return {
      status: 'upcoming',
      label: formatDueDate(dateString),
      urgency: 0,
      days: daysUntil,
    };
  } catch {
    return { status: 'none', label: 'Invalid date', urgency: 0 };
  }
};

export const getDueDateColor = (dateString) => {
  const status = getDueDateStatus(dateString);
  
  switch (status.status) {
    case 'overdue':
      return 'text-red-600 font-semibold';
    case 'today':
      return 'text-orange-600 font-semibold';
    case 'tomorrow':
    case 'soon':
      return 'text-yellow-600 font-medium';
    default:
      return 'text-gray-500';
  }
};

export const sortTasksByDueDate = (tasks) => {
  return [...tasks].sort((a, b) => {
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    
    // Overdue tasks first
    if (isOverdue(a.due_date) && !isOverdue(b.due_date)) return -1;
    if (!isOverdue(a.due_date) && isOverdue(b.due_date)) return 1;
    
    return dateA - dateB;
  });
};

