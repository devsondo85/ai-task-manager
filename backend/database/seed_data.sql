-- Seed data for AI Task Manager
-- Insert 18 sample tasks for demonstration

-- Clear existing data (optional - comment out if you want to keep existing tasks)
-- TRUNCATE TABLE subtasks CASCADE;
-- TRUNCATE TABLE tasks CASCADE;

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, due_date, estimated_time) VALUES
-- High Priority Tasks
('Complete project documentation', 'Write comprehensive documentation for the AI Task Manager project including API endpoints, database schema, and user guide', 'in_progress', 'high', CURRENT_DATE + INTERVAL '2 days', 180),
('Fix critical bug in authentication', 'Resolve security vulnerability in user authentication system that allows unauthorized access', 'todo', 'high', CURRENT_DATE + INTERVAL '1 day', 120),
('Deploy application to production', 'Set up production environment, configure CI/CD pipeline, and deploy the application', 'todo', 'high', CURRENT_DATE + INTERVAL '3 days', 240),
('Review and merge pull requests', 'Review 5 pending pull requests from team members and merge approved changes', 'in_progress', 'high', CURRENT_DATE, 90),

-- Medium Priority Tasks
('Implement user feedback features', 'Add features requested by users including dark mode, export functionality, and custom filters', 'todo', 'medium', CURRENT_DATE + INTERVAL '7 days', 300),
('Optimize database queries', 'Analyze slow queries and optimize database performance for better response times', 'todo', 'medium', CURRENT_DATE + INTERVAL '5 days', 150),
('Write unit tests', 'Create comprehensive unit tests for all API endpoints and frontend components', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '4 days', 200),
('Update dependencies', 'Update all npm packages to latest versions and fix any breaking changes', 'todo', 'medium', CURRENT_DATE + INTERVAL '6 days', 120),
('Design new dashboard UI', 'Create mockups and implement new analytics dashboard with improved visualizations', 'todo', 'medium', CURRENT_DATE + INTERVAL '10 days', 240),
('Set up monitoring and logging', 'Configure application monitoring, error tracking, and logging system', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '3 days', 180),
('Create API documentation', 'Generate API documentation using Swagger/OpenAPI and publish to documentation site', 'todo', 'medium', CURRENT_DATE + INTERVAL '8 days', 150),

-- Low Priority Tasks
('Refactor legacy code', 'Clean up old code, improve code structure, and remove unused functions', 'todo', 'low', CURRENT_DATE + INTERVAL '14 days', 180),
('Add keyboard shortcuts', 'Implement keyboard shortcuts for common actions to improve user experience', 'todo', 'low', CURRENT_DATE + INTERVAL '12 days', 90),
('Improve error messages', 'Make error messages more user-friendly and provide helpful guidance', 'done', 'low', CURRENT_DATE - INTERVAL '2 days', 60),
('Update README file', 'Add installation instructions, configuration guide, and contribution guidelines to README', 'done', 'low', CURRENT_DATE - INTERVAL '1 day', 45),
('Create tutorial videos', 'Record video tutorials explaining how to use the application features', 'todo', 'low', CURRENT_DATE + INTERVAL '15 days', 300),
('Organize team meeting', 'Schedule and prepare agenda for next team meeting to discuss project progress', 'todo', 'low', CURRENT_DATE + INTERVAL '5 days', 30),
('Backup database', 'Create automated backup system for production database', 'done', 'low', CURRENT_DATE - INTERVAL '3 days', 60),
('Review code comments', 'Go through codebase and ensure all functions have proper documentation comments', 'todo', 'low', CURRENT_DATE + INTERVAL '20 days', 120);

-- Verify the data
SELECT 
  status,
  priority,
  COUNT(*) as count
FROM tasks
GROUP BY status, priority
ORDER BY status, priority;

