import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL environment variable is required');
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_ANON_KEY environment variable is required');
}

// Create Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test database connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('tasks').select('count').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (expected initially)
      throw error;
    }
    
    return { 
      connected: true, 
      message: 'Database connection successful' 
    };
  } catch (error) {
    console.error('Database connection error:', error.message);
    return { 
      connected: false, 
      message: error.message 
    };
  }
};

export default supabase;

