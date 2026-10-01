import { createBrowserClient } from "@supabase/ssr";

const FALLBACK_SUPABASE_URL = "https://fvxeaemaubtfvqyuhbgw.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eGVhZW1hdWJ0ZnZxeXVoYmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MzQwMjYsImV4cCI6MjEwNjQxMDAyNn0.a6YoeTRsNgD6TS4S9EyemksUP8xrC9RXSVMTog9rdsU";

/**
 * Creates a browser-side Supabase client.
 * Uses environment variables when available with seamless project fallbacks
 * to guarantee auth works in all environments (localhost, Vercel, etc.).
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
