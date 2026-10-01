import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error("[AuthCallback] Error exchanging code for session:", error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  }

  // If code exchange failed or no code, redirect to error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
