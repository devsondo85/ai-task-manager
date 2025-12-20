import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Create Supabase client (only if credentials are provided)
export const supabase = (supabaseUrl && supabaseKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseKey !== 'your_supabase_anon_key_here')
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Test database connection
export const testConnection = async () => {
  if (!supabase) {
    return { 
      connected: false, 
      message: 'Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env file.' 
    };
  }

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

