import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const FALLBACK_SUPABASE_URL = "https://fvxeaemaubtfvqyuhbgw.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eGVhZW1hdWJ0ZnZxeXVoYmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MzQwMjYsImV4cCI6MjEwNjQxMDAyNn0.a6YoeTRsNgD6TS4S9EyemksUP8xrC9RXSVMTog9rdsU";

/**
 * Creates a server-side Supabase client with cookie management.
 * Uses environment variables when available with seamless project fallbacks.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Can happen in Server Components; safe to ignore when middleware handles refresh
        }
      },
    },
  });
}
