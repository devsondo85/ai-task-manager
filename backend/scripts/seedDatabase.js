import { supabase } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleTasks = [
  // High Priority Tasks
  {
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the AI Task Manager project including API endpoints, database schema, and user guide',
    status: 'in_progress',
    priority: 'high',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    estimated_time: 180
  },
  {
    title: 'Fix critical bug in authentication',
    description: 'Resolve security vulnerability in user authentication system that allows unauthorized access',
    status: 'todo',
    priority: 'high',
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    estimated_time: 120
  },
  {
    title: 'Deploy application to production',
    description: 'Set up production environment, configure CI/CD pipeline, and deploy the application',
    status: 'todo',
    priority: 'high',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    estimated_time: 240
  },
  {
    title: 'Review and merge pull requests',
    description: 'Review 5 pending pull requests from team members and merge approved changes',
    status: 'in_progress',
    priority: 'high',
    due_date: new Date().toISOString(), // Today
    estimated_time: 90
  },
  // Medium Priority Tasks
  {
    title: 'Implement user feedback features',
    description: 'Add features requested by users including dark mode, export functionality, and custom filters',
    status: 'todo',
    priority: 'medium',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    estimated_time: 300
  },
  {
    title: 'Optimize database queries',
    description: 'Analyze slow queries and optimize database performance for better response times',
    status: 'todo',
    priority: 'medium',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    estimated_time: 150
  },
  {
    title: 'Write unit tests',
    description: 'Create comprehensive unit tests for all API endpoints and frontend components',
    status: 'in_progress',
    priority: 'medium',
    due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    estimated_time: 200
  },
  {
    title: 'Update dependencies',
    description: 'Update all npm packages to latest versions and fix any breaking changes',
    status: 'todo',
    priority: 'medium',
    due_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    estimated_time: 120
  },
  {
    title: 'Design new dashboard UI',
    description: 'Create mockups and implement new analytics dashboard with improved visualizations',
    status: 'todo',
    priority: 'medium',
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    estimated_time: 240
  },
  {
    title: 'Set up monitoring and logging',
    description: 'Configure application monitoring, error tracking, and logging system',
    status: 'in_progress',
    priority: 'medium',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    estimated_time: 180
  },
  {
    title: 'Create API documentation',
    description: 'Generate API documentation using Swagger/OpenAPI and publish to documentation site',
    status: 'todo',
    priority: 'medium',
    due_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
    estimated_time: 150
  },
  // Low Priority Tasks
  {
    title: 'Refactor legacy code',
    description: 'Clean up old code, improve code structure, and remove unused functions',
    status: 'todo',
    priority: 'low',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    estimated_time: 180
  },
  {
    title: 'Add keyboard shortcuts',
    description: 'Implement keyboard shortcuts for common actions to improve user experience',
    status: 'todo',
    priority: 'low',
    due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
    estimated_time: 90
  },
  {
    title: 'Improve error messages',
    description: 'Make error messages more user-friendly and provide helpful guidance',
    status: 'done',
    priority: 'low',
    due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    estimated_time: 60
  },
  {
    title: 'Update README file',
    description: 'Add installation instructions, configuration guide, and contribution guidelines to README',
    status: 'done',
    priority: 'low',
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    estimated_time: 45
  },
  {
    title: 'Create tutorial videos',
    description: 'Record video tutorials explaining how to use the application features',
    status: 'todo',
    priority: 'low',
    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    estimated_time: 300
  },
  {
    title: 'Organize team meeting',
    description: 'Schedule and prepare agenda for next team meeting to discuss project progress',
    status: 'todo',
    priority: 'low',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    estimated_time: 30
  },
  {
    title: 'Backup database',
    description: 'Create automated backup system for production database',
    status: 'done',
    priority: 'low',
    due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    estimated_time: 60
  },
  {
    title: 'Review code comments',
    description: 'Go through codebase and ensure all functions have proper documentation comments',
    status: 'todo',
    priority: 'low',
    due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    estimated_time: 120
  }
];

async function seedDatabase() {
  if (!supabase) {
    console.error('❌ Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env file.');
    process.exit(1);
  }

  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing tasks (optional - comment out if you want to keep existing data)
    // const { error: deleteError } = await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // if (deleteError) throw deleteError;
    // console.log('✅ Cleared existing tasks');

    // Insert sample tasks
    const { data, error } = await supabase
      .from('tasks')
      .insert(sampleTasks)
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully inserted ${data.length} tasks!`);
    
    // Show summary
    const { data: stats } = await supabase
      .from('tasks')
      .select('status, priority');

    if (stats) {
      const statusCount = stats.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {});
      
      const priorityCount = stats.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      }, {});

      console.log('\n📊 Task Summary:');
      console.log('Status:', statusCount);
      console.log('Priority:', priorityCount);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();

