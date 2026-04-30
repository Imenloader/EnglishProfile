import { createClient } from '@supabase/supabase-js';

// ⚡ Bolt: Production Credentials
// These are public keys and are safe to include in the client-side bundle for a Supabase app.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zdgyluzcfcenszqtqkrm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZ3lsdXpjZmNlbnN6cXRxa3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MjczNDIsImV4cCI6MjA5MzEwMzM0Mn0.W4h91ashw4TQoWzU5TU8SJhctyv3JG4Veec_lbPIMDE';

// ⚡ Bolt: Robustness Check
if (typeof window !== 'undefined') {
  console.log("✅ Supabase connection initialized for Linguaplanet.");
  console.log("📍 Supabase URL:", supabaseUrl);
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
