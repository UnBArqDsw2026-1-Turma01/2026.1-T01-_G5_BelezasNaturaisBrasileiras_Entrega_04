import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const supabaseProvider = {
  provide: SupabaseClient,
  useFactory: () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    // Prefer using the service role key on the server when available for admin operations
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseKey);
  },
};
