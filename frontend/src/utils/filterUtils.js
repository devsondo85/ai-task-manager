/**
 * Filter utility functions for tasks
 */

/**
 * Filter tasks by search query (searches title and description)
 */
export const filterBySearch = (tasks, searchQuery) => {
  if (!searchQuery.trim()) return tasks;

  const query = searchQuery.toLowerCase().trim();
  return tasks.filter((task) => {
    const titleMatch = task.title?.toLowerCase().includes(query);
    const descriptionMatch = task.description?.toLowerCase().includes(query);
    return titleMatch || descriptionMatch;
  });
};

/**
 * Filter tasks by status
 */
export const filterByStatus = (tasks, statusFilter) => {
  if (!statusFilter) return tasks;
  return tasks.filter((task) => task.status === statusFilter);
};

/**
 * Filter tasks by priority
 */
export const filterByPriority = (tasks, priorityFilter) => {
  if (!priorityFilter) return tasks;
  return tasks.filter((task) => task.priority === priorityFilter);
};

/**
 * Apply all filters to tasks
 */
export const applyFilters = (tasks, { searchQuery, statusFilter, priorityFilter }) => {
  let filteredTasks = [...tasks];

  // Apply search filter
  filteredTasks = filterBySearch(filteredTasks, searchQuery);

  // Apply status filter
  filteredTasks = filterByStatus(filteredTasks, statusFilter);

  // Apply priority filter
  filteredTasks = filterByPriority(filteredTasks, priorityFilter);

  return filteredTasks;
};

