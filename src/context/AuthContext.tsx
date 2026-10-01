"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { authService, User, AuthSession, AuthProvider as AuthProviderType } from "@/services/authService";

export interface TargetRoutineIntent {
  id: string;
  title: string;
  coverImage?: string;
  artist?: string;
}

/**
 * Progressive auth flow steps:
 * "choose"         → Pick method (Apple, Google, Email, Phone)
 * "email-input"    → Enter email address
 * "phone-input"    → Enter phone number
 * "otp"            → Enter 6-digit OTP
 * "create-password"→ Set password for new email accounts
 * "sign-in"        → Email + password sign-in
 * "forgot-password"→ Request password reset
 * "success"        → Verification/auth success
 */
export type AuthStep =
  | "choose"
  | "email-input"
  | "phone-input"
  | "otp"
  | "create-password"
  | "sign-in"
  | "forgot-password"
  | "success";

interface AuthContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Auth actions
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  sendEmailOtp: (email: string) => Promise<void>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ isNewUser: boolean }>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ message: string }>;
  sendPhoneOtp: (phone: string) => Promise<void>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Progressive flow state
  authStep: AuthStep;
  setAuthStep: (step: AuthStep) => void;
  authMethod: AuthProviderType | null;
  setAuthMethod: (method: AuthProviderType | null) => void;
  pendingEmail: string;
  setPendingEmail: (email: string) => void;
  pendingPhone: string;
  setPendingPhone: (phone: string) => void;

  // Modal state & intent preservation
  isAuthModalOpen: boolean;
  authModalReason: string;
  targetRoutine: TargetRoutineIntent | null;
  openAuthModal: (
    target?: TargetRoutineIntent | null,
    reason?: string,
    onAuthenticated?: () => void
  ) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>(() => {
    if (typeof window !== "undefined") {
      return authService.getSessionSync();
    }
    return { user: null, isAuthenticated: false };
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Progressive flow state
  const [authStep, setAuthStep] = useState<AuthStep>("choose");
  const [authMethod, setAuthMethod] = useState<AuthProviderType | null>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");

  // Intent preservation state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<string>("Sign in to continue watching.");
  const [targetRoutine, setTargetRoutine] = useState<TargetRoutineIntent | null>(null);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // Subscribe to auth service events
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((newSession) => {
      setSession(newSession);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openAuthModal = useCallback(
    (
      target?: TargetRoutineIntent | null,
      reason?: string,
      onAuthenticated?: () => void
    ) => {
      if (target) setTargetRoutine(target);
      if (reason) setAuthModalReason(reason);
      if (onAuthenticated) setPendingCallback(() => onAuthenticated);
      setAuthStep("choose");
      setAuthMethod(null);
      setPendingEmail("");
      setPendingPhone("");
      setIsAuthModalOpen(true);
    },
    []
  );

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    // Reset flow state after animation
    setTimeout(() => {
      setAuthStep("choose");
      setAuthMethod(null);
      setPendingEmail("");
      setPendingPhone("");
    }, 300);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setAuthStep("success");
    setTimeout(() => {
      setIsAuthModalOpen(false);
      if (pendingCallback) {
        const cb = pendingCallback;
        setPendingCallback(null);
        setTimeout(() => cb(), 100);
      }
    }, 1500);
  }, [pendingCallback]);

  // ─── Auth Actions ─────────────────────────────────────────────

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const signInWithApple = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.signInWithApple();
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const sendEmailOtp = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await authService.sendEmailOtp(email);
      setPendingEmail(email);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyEmailOtp = useCallback(
    async (email: string, token: string) => {
      setIsLoading(true);
      try {
        const result = await authService.verifyEmailOtp(email, token);
        if (!result.isNewUser) {
          handleAuthSuccess();
        }
        return { isNewUser: result.isNewUser };
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        await authService.signInWithEmail(email, password);
        handleAuthSuccess();
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const signUpAction = useCallback(
    async (email: string, password: string, name?: string) => {
      setIsLoading(true);
      try {
        await authService.signUp(email, password, name);
        handleAuthSuccess();
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const updatePassword = useCallback(
    async (newPassword: string) => {
      setIsLoading(true);
      try {
        await authService.updatePassword(newPassword);
        handleAuthSuccess();
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const resetPasswordForEmail = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const result = await authService.resetPasswordForEmail(email);
      return { message: result.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendPhoneOtp = useCallback(async (phone: string) => {
    setIsLoading(true);
    try {
      await authService.sendPhoneOtp(phone);
      setPendingPhone(phone);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyPhoneOtp = useCallback(
    async (phone: string, token: string) => {
      setIsLoading(true);
      try {
        await authService.verifyPhoneOtp(phone, token);
        handleAuthSuccess();
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        isAuthenticated: session.isAuthenticated,
        isLoading,
        signInWithGoogle,
        signInWithApple,
        sendEmailOtp,
        verifyEmailOtp,
        signInWithEmail,
        signUp: signUpAction,
        updatePassword,
        resetPasswordForEmail,
        sendPhoneOtp,
        verifyPhoneOtp,
        signOut,
        authStep,
        setAuthStep,
        authMethod,
        setAuthMethod,
        pendingEmail,
        setPendingEmail,
        pendingPhone,
        setPendingPhone,
        isAuthModalOpen,
        authModalReason,
        targetRoutine,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
