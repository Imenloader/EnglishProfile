import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug logging (will show in browser console)
if (typeof window !== 'undefined') {
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    console.warn("⚠️ Supabase URL is missing or invalid. Check your .env.local file.");
  }
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
