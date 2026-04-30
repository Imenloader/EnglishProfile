import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zdgyluzcfcenszqtqkrm.supabase.co';

if (supabaseUrl.includes('zdgyluzcfcenszqtkrmu')) {
  supabaseUrl = 'https://zdgyluzcfcenszqtqkrm.supabase.co';
}

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZ3lsdXpjZmNlbnN6cXRxa3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MjczNDIsImV4cCI6MjA5MzEwMzM0Mn0.W4h91ashw4TQoWzU5TU8SJhctyv3JG4Veec_lbPIMDE';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
