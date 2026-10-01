"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Mail,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { OtpInput } from "./OtpInput";
import { PasswordStrength } from "./PasswordStrength";
import { cn } from "@/lib/utils";

// ─── Google Logo SVG ─────────────────────────────────────────────
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalReason,
    targetRoutine,
    authStep,
    setAuthStep,
    authMethod,
    setAuthMethod,
    pendingEmail,
    setPendingEmail,
    isLoading,
    signInWithGoogle,
    sendEmailOtp,
    verifyEmailOtp,
    signInWithEmail,
    updatePassword,
    resetPasswordForEmail,
  } = useAuth();

  // Local form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [otpError, setOtpError] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailFlowMode, setEmailFlowMode] = useState<"otp" | "signin">("otp");
  const [, setIsNewEmailUser] = useState(false);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      setTimeout(() => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        setErrorMessage(null);
        setSuccessMessage(null);
        setOtpError(false);
        setResendCooldown(0);
        setEmailFlowMode("otp");
        setIsNewEmailUser(false);
      }, 300);
    }
  }, [isAuthModalOpen]);

  // Clear errors on step change
  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setOtpError(false);
  }, [authStep]);

  // ─── Navigation ────────────────────────────────────────────────

  const goBack = useCallback(() => {
    if (authStep === "email-input") {
      setAuthStep("choose");
      setAuthMethod(null);
    } else if (authStep === "otp") {
      setAuthStep("email-input");
    } else if (authStep === "sign-in") {
      setAuthStep("email-input");
    } else if (authStep === "forgot-password") {
      setAuthStep("sign-in");
    } else if (authStep === "create-password") {
      // Can't go back from password creation during flow — skip to success
      setAuthStep("choose");
    }
  }, [authStep, setAuthStep, setAuthMethod]);

  const getStepTitle = (): string => {
    switch (authStep) {
      case "choose":
        return authModalReason || "Sign in to continue";
      case "email-input":
        return "Continue with Email";
      case "otp":
        return "Verify your identity";
      case "create-password":
        return "Create a password";
      case "sign-in":
        return "Welcome back";
      case "forgot-password":
        return "Reset your password";
      case "success":
        return "You're in!";
      default:
        return "Sign in";
    }
  };

  const getStepSubtitle = (): string => {
    switch (authStep) {
      case "choose":
        return "Choose how you'd like to continue";
      case "email-input":
        return "Enter your email address to get started";
      case "otp":
        return `Enter the 6-digit verification code sent to ${pendingEmail || email}`;
      case "create-password":
        return "Set a secure password for your account";
      case "sign-in":
        return `Sign in to ${pendingEmail || email}`;
      case "forgot-password":
        return "We'll send you a link to reset your password";
      case "success":
        return "Your account is ready. Welcome to Seekho Dance.";
      default:
        return "";
    }
  };

  // ─── Handlers ──────────────────────────────────────────────────

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in with Google.";
      setErrorMessage(message);
    }
  };

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    try {
      setErrorMessage(null);
      setPendingEmail(cleanEmail);
      if (emailFlowMode === "otp") {
        await sendEmailOtp(cleanEmail);
        setResendCooldown(60);
        setAuthStep("otp");
      } else {
        setAuthStep("sign-in");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send verification code.";
      setErrorMessage(message);
    }
  };

  const handleOtpComplete = async (otp: string) => {
    try {
      setErrorMessage(null);
      setOtpError(false);
      const result = await verifyEmailOtp(pendingEmail || email, otp);
      if (result.isNewUser) {
        setIsNewEmailUser(true);
        setAuthStep("create-password");
      }
      // If not new user, the context handles the success flow
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed.";
      setErrorMessage(message);
      setOtpError(true);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      setErrorMessage(null);
      await sendEmailOtp(pendingEmail || email);
      setResendCooldown(60);
      setSuccessMessage("New verification code sent!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to resend code.";
      setErrorMessage(message);
    }
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }
    try {
      setErrorMessage(null);
      await signInWithEmail(pendingEmail || email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed.";
      setErrorMessage(message);
    }
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    try {
      setErrorMessage(null);
      await updatePassword(password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to set password.";
      setErrorMessage(message);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      const result = await resetPasswordForEmail(pendingEmail || email);
      setSuccessMessage(result.message);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset link.";
      setErrorMessage(message);
    }
  };

  const handleSkipPassword = () => {
    // User verified via OTP already has a session — skip password creation
    setAuthStep("success");
    setTimeout(() => closeAuthModal(), 1500);
  };

  if (!isAuthModalOpen) return null;

  // ─── Render ────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? closeAuthModal : undefined}
      />

      {/* Modal Surface */}
      <div
        className="relative w-full max-w-[420px] rounded-t-[32px] sm:rounded-[28px] bg-white dark:bg-[#16161B] border border-neutral-200/90 dark:border-neutral-800 shadow-2xl z-10 animate-in slide-in-from-bottom-5 duration-250 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Authentication"
      >
        {/* Mobile Pull Bar */}
        <div className="sm:hidden w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mt-3" />

        {/* Header */}
        <div className="px-6 sm:px-7 pt-4 sm:pt-6 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {authStep !== "choose" && authStep !== "success" && (
              <button
                onClick={goBack}
                disabled={isLoading}
                className="p-1.5 -ml-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition disabled:opacity-40"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
            )}
            {authStep === "choose" && (
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Seekho Dance
                </span>
              </div>
            )}
          </div>
          <button
            onClick={closeAuthModal}
            disabled={isLoading}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition disabled:opacity-40"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-7 pb-6 sm:pb-7 space-y-4 sm:space-y-5">
          {/* Title & Subtitle */}
          {authStep !== "success" && (
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                {getStepTitle()}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {getStepSubtitle()}
              </p>
            </div>
          )}

          {/* Target Routine Preview */}
          {authStep === "choose" && targetRoutine && (
            <div className="p-3 rounded-2xl bg-neutral-100/80 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
              {targetRoutine.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={targetRoutine.coverImage}
                  alt={targetRoutine.title}
                  className="w-14 h-11 rounded-xl object-cover shrink-0 ring-1 ring-black/5"
                />
              ) : (
                <div className="w-14 h-11 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase text-orange-600 dark:text-orange-400 font-semibold">
                  Selected Routine
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                  {targetRoutine.title}
                </h4>
                {targetRoutine.artist && (
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {targetRoutine.artist}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {/* ═══ STEP: Choose Method (100% Free Login Options) ═══ */}
          {authStep === "choose" && (
            <div className="space-y-3">
              {/* Continue with Google (Free OAuth) */}
              <button
                type="button"
                id="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-700/80 text-neutral-900 dark:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-200 active:scale-[0.98] shadow-2xs disabled:opacity-50 touch-manipulation cursor-pointer group"
              >
                <GoogleLogo className="w-4.5 h-4.5 shrink-0 group-hover:scale-105 transition-transform" />
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center py-1">
                <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                <span className="absolute px-3 bg-white dark:bg-[#16161B] text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  or
                </span>
              </div>

              {/* Continue with Email (Free OTP / Password) */}
              <button
                type="button"
                id="email-signin-btn"
                onClick={() => {
                  setAuthMethod("email");
                  setAuthStep("email-input");
                }}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-200 active:scale-[0.98] shadow-sm disabled:opacity-50 touch-manipulation cursor-pointer group"
              >
                <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-600 group-hover:scale-105 transition-transform" />
                <span>Continue with Email</span>
              </button>

              {/* Fine print */}
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 text-center pt-2 leading-relaxed">
                Free account • No credit card required
              </p>
            </div>
          )}

          {/* ═══ STEP: Email Input ═══ */}
          {authStep === "email-input" && (
            <form onSubmit={handleEmailContinue} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    autoComplete="email"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Method toggle */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEmailFlowMode("otp")}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-[11px] font-semibold text-center transition",
                    emailFlowMode === "otp"
                      ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700"
                  )}
                >
                  Email Code
                </button>
                <button
                  type="button"
                  onClick={() => setEmailFlowMode("signin")}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-[11px] font-semibold text-center transition",
                    emailFlowMode === "signin"
                      ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700"
                  )}
                >
                  Password
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <span>
                    {emailFlowMode === "otp" ? "Send Verification Code" : "Continue"}
                  </span>
                )}
              </button>
            </form>
          )}

          {/* ═══ STEP: OTP Verification ═══ */}
          {authStep === "otp" && (
            <div className="space-y-5">
              <OtpInput
                onComplete={handleOtpComplete}
                disabled={isLoading}
                error={otpError}
              />

              {isLoading && (
                <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  <span>Verifying...</span>
                </div>
              )}

              {/* Resend */}
              <div className="text-center">
                {resendCooldown > 0 ? (
                  <p className="text-[11px] text-neutral-400">
                    Resend code in{" "}
                    <span className="font-mono font-semibold text-neutral-600 dark:text-neutral-300">
                      {resendCooldown}s
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    Didn&apos;t receive the code? Resend
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ═══ STEP: Password Sign In ═══ */}
          {authStep === "sign-in" && (
            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthStep("forgot-password")}
                    className="text-[10px] text-orange-600 dark:text-orange-400 hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoFocus
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              {/* Alternative: use OTP instead */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmailFlowMode("otp");
                    setAuthStep("email-input");
                    setEmail(pendingEmail);
                  }}
                  className="text-[11px] text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  Sign in with email code instead
                </button>
              </div>
            </form>
          )}

          {/* ═══ STEP: Forgot Password ═══ */}
          {authStep === "forgot-password" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={pendingEmail || email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setPendingEmail(e.target.value);
                    }}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthStep("sign-in")}
                  className="text-[11px] text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}

          {/* ═══ STEP: Create Password ═══ */}
          {authStep === "create-password" && (
            <form onSubmit={handleCreatePassword} className="space-y-4">
              {/* Create Password */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a strong password"
                    required
                    autoFocus
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength */}
              <PasswordStrength password={password} />

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    autoComplete="new-password"
                    className={cn(
                      "w-full pl-10 pr-10 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none transition",
                      confirmPassword && confirmPassword !== password
                        ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                        : confirmPassword && confirmPassword === password
                        ? "border-emerald-300 dark:border-emerald-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                        : "border-neutral-200 dark:border-neutral-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                    )}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[10px] text-red-500 mt-1">Passwords do not match</p>
                )}
                {confirmPassword && confirmPassword === password && password.length >= 8 && (
                  <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  !password ||
                  password.length < 8 ||
                  password !== confirmPassword
                }
                className="w-full py-3 px-4 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition active:scale-[0.98] shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Setting password...</span>
                  </>
                ) : (
                  <span>Set Password & Continue</span>
                )}
              </button>

              {/* Skip password option */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSkipPassword}
                  className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  Skip for now — I&apos;ll use email codes to sign in
                </button>
              </div>
            </form>
          )}

          {/* ═══ STEP: Success ═══ */}
          {authStep === "success" && (
            <div className="py-8 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-300">
              {/* Success checkmark */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                {/* Pulse ring animation */}
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-neutral-950 dark:text-white">
                  Welcome to Seekho Dance
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Your account is ready. Let&apos;s dance!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom safe area */}
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </div>
    </div>
  );
}
