/**
 * Authentication Service — Seekho Dance
 *
 * Centralized Supabase Auth abstraction providing:
 * - Email OTP (6-digit code verification)
 * - Email + Password (sign up, sign in, reset)
 * - Phone SMS OTP (sign in / sign up)
 * - Google OAuth
 * - Apple OAuth
 * - Session management
 * - Password management (create, update, reset)
 */

import { createClient as createSupabaseClient } from "@/lib/supabase/client";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  provider?: string;
  status: "active" | "unverified";
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}

export type AuthProvider = "google" | "apple" | "email" | "phone";

const AUTH_STORAGE_KEY = "seekho_auth_session";
const AUTH_EVENT_NAME = "seekho_auth_changed";

class AuthService {
  private currentSession: AuthSession | null = null;
  private listeners: Set<(session: AuthSession) => void> = new Set();
  private supabase = typeof window !== "undefined" ? createSupabaseClient() : null;

  constructor() {
    if (typeof window !== "undefined") {
      this.loadSessionFromStorage();

      if (this.supabase) {
        // Auto-exchange OAuth or Email confirmation ?code= if present in URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code) {
          this.supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
            if (!error && data.session) {
              this.currentSession = this.mapSupabaseSession(data.session);
              this.saveSessionToStorage(this.currentSession);
              this.notifyListeners();
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            } else if (error) {
              console.error("[AuthService] Error exchanging code:", error);
            }
          });
        }

        this.supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            this.currentSession = this.mapSupabaseSession(session);
            this.notifyListeners();
          }
        });

        this.supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            this.currentSession = this.mapSupabaseSession(session);
            this.saveSessionToStorage(this.currentSession);
          } else {
            this.currentSession = { user: null, isAuthenticated: false };
          }
          this.notifyListeners();
        });
      }

      window.addEventListener("storage", (e) => {
        if (e.key === AUTH_STORAGE_KEY) {
          this.loadSessionFromStorage();
          this.notifyListeners();
        }
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapSupabaseSession(session: any): AuthSession {
    const sbUser = session.user;
    const name =
      sbUser.user_metadata?.full_name ||
      sbUser.user_metadata?.name ||
      sbUser.email?.split("@")[0] ||
      sbUser.phone ||
      "Seekho Dancer";

    // Determine provider
    const provider =
      sbUser.app_metadata?.provider ||
      sbUser.identities?.[0]?.provider ||
      "email";

    const user: User = {
      id: sbUser.id,
      name,
      email: sbUser.email || "",
      phone: sbUser.phone || "",
      avatar: sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture,
      provider,
      status: "active",
      createdAt: sbUser.created_at || new Date().toISOString(),
    };

    return {
      user,
      isAuthenticated: true,
      token: session.access_token,
    };
  }

  private loadSessionFromStorage(): AuthSession {
    if (typeof window === "undefined") {
      return { user: null, isAuthenticated: false };
    }

    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.user) {
          this.currentSession = {
            user: parsed.user,
            isAuthenticated: true,
            token: parsed.token,
          };
          return this.currentSession;
        }
      }
    } catch (e) {
      console.error("[AuthService] Failed to load session from storage:", e);
    }

    this.currentSession = { user: null, isAuthenticated: false };
    return this.currentSession;
  }

  private saveSessionToStorage(session: AuthSession) {
    if (typeof window === "undefined") return;
    try {
      if (session.isAuthenticated && session.user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      this.currentSession = session;
      this.notifyListeners();
      window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: session }));
    } catch (e) {
      console.error("[AuthService] Failed to save session:", e);
    }
  }

  private notifyListeners() {
    const session = this.getSessionSync();
    this.listeners.forEach((cb) => {
      try {
        cb(session);
      } catch (err) {
        console.error("[AuthService] Error in auth listener:", err);
      }
    });
  }

  private ensureSupabase() {
    if (!this.supabase && typeof window !== "undefined") {
      this.supabase = createSupabaseClient();
    }
    if (!this.supabase) {
      throw new Error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }
    return this.supabase;
  }

  // ─── Session Methods ─────────────────────────────────────────

  public getSessionSync(): AuthSession {
    if (!this.currentSession) {
      return this.loadSessionFromStorage();
    }
    return this.currentSession;
  }

  public async getSession(): Promise<AuthSession> {
    if (this.supabase) {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (session?.user) {
        return this.mapSupabaseSession(session);
      }
    }
    return this.getSessionSync();
  }

  public isAuthenticated(): boolean {
    return this.getSessionSync().isAuthenticated;
  }

  public getCurrentUser(): User | null {
    return this.getSessionSync().user;
  }

  // ─── Google OAuth ─────────────────────────────────────────────

  public async signInWithGoogle(): Promise<{ user: User }> {
    const supabase = this.ensureSupabase();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) throw new Error(error.message);
    // Browser will redirect — return placeholder
    return {
      user: {
        id: "pending_oauth",
        name: "Redirecting...",
        email: "",
        status: "active",
        createdAt: new Date().toISOString(),
      },
    };
  }

  // ─── Apple OAuth ──────────────────────────────────────────────

  public async signInWithApple(): Promise<{ user: User }> {
    const supabase = this.ensureSupabase();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo },
    });
    if (error) throw new Error(error.message);
    return {
      user: {
        id: "pending_oauth",
        name: "Redirecting...",
        email: "",
        status: "active",
        createdAt: new Date().toISOString(),
      },
    };
  }

  // ─── Email OTP (Send Code) ────────────────────────────────────

  public async sendEmailOtp(email: string): Promise<{ success: boolean; message: string }> {
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    const supabase = this.ensureSupabase();

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) throw new Error(error.message);

    return {
      success: true,
      message: `Verification code sent to ${email}`,
    };
  }

  // ─── Email OTP (Verify Code) ──────────────────────────────────

  public async verifyEmailOtp(
    email: string,
    token: string
  ): Promise<{ user: User; isNewUser: boolean }> {
    const supabase = this.ensureSupabase();

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token,
      type: "email",
    });

    if (error) {
      if (error.message.toLowerCase().includes("expired")) {
        throw new Error("Verification code has expired. Please request a new one.");
      }
      if (error.message.toLowerCase().includes("invalid")) {
        throw new Error("Invalid verification code. Please check and try again.");
      }
      throw new Error(error.message);
    }

    if (data.session) {
      const session = this.mapSupabaseSession(data.session);
      this.saveSessionToStorage(session);

      // Detect new user by checking created_at vs now
      const createdAt = new Date(data.user?.created_at || "").getTime();
      const now = Date.now();
      const isNewUser = now - createdAt < 30000; // Within 30 seconds

      return { user: session.user!, isNewUser };
    }

    throw new Error("Verification failed. Please try again.");
  }

  // ─── Email + Password Sign Up ─────────────────────────────────

  public async signUp(
    email: string,
    password: string,
    name?: string
  ): Promise<{ user: User }> {
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const supabase = this.ensureSupabase();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: name?.trim() || email.split("@")[0],
        },
      },
    });

    if (error) throw new Error(error.message);

    if (data.session) {
      const session = this.mapSupabaseSession(data.session);
      this.saveSessionToStorage(session);
      return { user: session.user! };
    } else if (data.user) {
      return {
        user: {
          id: data.user.id,
          name: name?.trim() || email.split("@")[0],
          email: data.user.email || email,
          status: "unverified",
          createdAt: data.user.created_at,
        },
      };
    }

    throw new Error("Sign up failed. Please try again.");
  }

  // ─── Email + Password Sign In ─────────────────────────────────

  public async signInWithEmail(
    email: string,
    password: string
  ): Promise<{ user: User }> {
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    if (!password) {
      throw new Error("Please enter your password.");
    }

    const supabase = this.ensureSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw new Error(error.message);

    if (data.session) {
      const session = this.mapSupabaseSession(data.session);
      this.saveSessionToStorage(session);
      return { user: session.user! };
    }

    throw new Error("Sign in failed. Please check your credentials.");
  }

  // ─── Set Password (for OTP-verified users) ────────────────────

  public async updatePassword(newPassword: string): Promise<void> {
    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const supabase = this.ensureSupabase();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw new Error(error.message);
  }

  // ─── Forgot Password ─────────────────────────────────────────

  public async resetPasswordForEmail(email: string): Promise<{ success: boolean; message: string }> {
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }

    const supabase = this.ensureSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
      }
    );

    if (error) throw new Error(error.message);

    return {
      success: true,
      message: `Password reset link sent to ${email}. Check your inbox.`,
    };
  }

  // ─── Phone OTP (Send Code) ────────────────────────────────────

  public async sendPhoneOtp(phone: string): Promise<{ success: boolean; message: string }> {
    if (!phone || phone.length < 10) {
      throw new Error("Please enter a valid phone number.");
    }

    const supabase = this.ensureSupabase();
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone.trim(),
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) throw new Error(error.message);

    return {
      success: true,
      message: `Verification code sent to ${phone}`,
    };
  }

  // ─── Phone OTP (Verify Code) ──────────────────────────────────

  public async verifyPhoneOtp(
    phone: string,
    token: string
  ): Promise<{ user: User }> {
    const supabase = this.ensureSupabase();

    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone.trim(),
      token,
      type: "sms",
    });

    if (error) {
      if (error.message.toLowerCase().includes("expired")) {
        throw new Error("Verification code has expired. Please request a new one.");
      }
      if (error.message.toLowerCase().includes("invalid")) {
        throw new Error("Invalid verification code. Please check and try again.");
      }
      throw new Error(error.message);
    }

    if (data.session) {
      const session = this.mapSupabaseSession(data.session);
      this.saveSessionToStorage(session);
      return { user: session.user! };
    }

    throw new Error("Phone verification failed. Please try again.");
  }

  // ─── Sign Out ─────────────────────────────────────────────────

  public async signOut(): Promise<void> {
    if (this.supabase) {
      try {
        await this.supabase.auth.signOut();
      } catch (err) {
        console.error("[AuthService] Error in Supabase signOut:", err);
      }
    }
    this.saveSessionToStorage({ user: null, isAuthenticated: false });
  }

  // ─── Auth State Change Subscription ───────────────────────────

  public onAuthStateChange(callback: (session: AuthSession) => void): () => void {
    this.listeners.add(callback);
    callback(this.getSessionSync());

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AuthSession>;
      if (customEvent.detail) {
        callback(customEvent.detail);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener(AUTH_EVENT_NAME, handleCustomEvent);
    }

    return () => {
      this.listeners.delete(callback);
      if (typeof window !== "undefined") {
        window.removeEventListener(AUTH_EVENT_NAME, handleCustomEvent);
      }
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
