import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// ⚡ Bolt: Robustness Check
if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    console.error("❌ ERROR: Supabase is NOT connected. The build is still using placeholder values. Check Cloudflare env vars.");
  } else {
    console.log("✅ Supabase connection initialized with URL:", process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 12) + "...");
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
