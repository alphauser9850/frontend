import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing. Please check your .env file.');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: (...args) => {
        // Add error handling for fetch operations
        return fetch(...args).catch(err => {
          console.warn('Fetch error in Supabase client:', err);
          throw err;
        });
      }
    }
  }
);

// Add a simple health check function to test connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) throw error;
    return { success: true, message: 'Connected to Supabase' };
  } catch (error) {
    console.error('Supabase connection error:', error);
    return { success: false, message: 'Failed to connect to Supabase', error };
  }
};