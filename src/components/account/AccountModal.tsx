"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Sparkles,
  BookMarked,
  Settings,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Shield,
  Mail,
  Phone,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { PasswordStrength } from "@/components/auth/PasswordStrength";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, signOut, updatePassword, isLoading } = useAuth();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!isOpen) return null;

  const isDark = resolvedTheme === "dark";
  const displayName = user?.name || "Seekho Dancer";
  const displayEmail = user?.email || "";
  const displayPhone = user?.phone || "";
  const displayProvider = user?.provider || "email";
  const userInitials = (displayName.slice(0, 2) || "SD").toUpperCase();

  const providerLabel =
    displayProvider === "google"
      ? "Google"
      : displayProvider === "apple"
      ? "Apple"
      : displayProvider === "phone"
      ? "Phone"
      : "Email";

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    try {
      setPasswordLoading(true);
      setPasswordError(null);
      await updatePassword(newPassword);
      setPasswordSuccess(true);
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess(false);
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update password.";
      setPasswordError(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal / Drawer Surface */}
      <div className="relative w-full max-w-md rounded-t-[32px] sm:rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-7 space-y-5 z-10 animate-in slide-in-from-bottom-4 duration-250 max-h-[92vh] overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        {/* Mobile Pull Bar */}
        <div className="sm:hidden w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto -mt-2 mb-2" />

        {/* Header & Close */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="text-base font-bold text-neutral-950 dark:text-white tracking-tight">
            Account
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition group"
        >
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-neutral-800 shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
              {userInitials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-neutral-950 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {displayName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {displayEmail && (
                <span className="text-[11px] text-neutral-400 truncate flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {displayEmail}
                </span>
              )}
              {displayPhone && !displayEmail && (
                <span className="text-[11px] text-neutral-400 truncate flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {displayPhone}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </Link>

        {/* Auth Provider Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
          <Shield className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Signed in with
          </span>
          <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
            {providerLabel}
          </span>
        </div>

        {/* Upgrade / Membership Banner */}
        <div className="p-4 rounded-2xl bg-neutral-950 text-white dark:bg-neutral-900 dark:border dark:border-neutral-700/80 shadow-md space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-400">
            <Sparkles className="w-4 h-4" />
            <span>Studio Pass</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Unlock horizontal mirror mode, 0.5x slow-motion drills, and unlimited choreographies.
          </p>
          <div className="pt-1">
            <Link
              href="/pricing"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 px-3.5 py-1.5 rounded-xl shadow-xs transition"
            >
              <span>View Membership Plans</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Menu Options */}
        <div className="space-y-1 text-xs">
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition"
          >
            <div className="flex items-center gap-3">
              <BookMarked className="w-4 h-4 text-neutral-400" />
              <span>My Profile & Saved Practice Routines</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </Link>

          {/* Change Password (only for email users) */}
          {(displayProvider === "email" || displayProvider === "magiclink") && (
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition"
            >
              <div className="flex items-center gap-3">
                <KeyRound className="w-4 h-4 text-neutral-400" />
                <span>Change Password</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${showChangePassword ? 'rotate-90' : ''}`} />
            </button>
          )}

          {/* Change Password Form */}
          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="px-3 pb-2 space-y-3 animate-in fade-in duration-150">
              {passwordError && (
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-[11px] text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Password updated successfully!
                </div>
              )}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-3 pr-9 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs outline-none focus:border-orange-500 transition"
                  disabled={passwordLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <PasswordStrength password={newPassword} />
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs outline-none focus:border-orange-500 transition"
                  disabled={passwordLoading}
                />
              </div>
              <button
                type="submit"
                disabled={passwordLoading || newPassword.length < 8 || newPassword !== confirmPassword}
                className="w-full py-2 rounded-lg bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {passwordLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Update Password</span>
              </button>
            </form>
          )}

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition"
          >
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-orange-500" />}
              <span>Appearance ({isDark ? "Dark Theme" : "Light Theme"})</span>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono uppercase">
              {isDark ? "Switch to Light" : "Switch to Dark"}
            </span>
          </button>

          <Link
            href="/pricing"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-neutral-400" />
              <span>Subscription & Billing</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </Link>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sign Out</span>
            </div>
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          </button>
        </div>

        {/* Bottom Note */}
        <div className="pt-2 text-center border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
          Seekho Dance v1.0 • Signed in as {displayEmail || displayPhone || displayName}
        </div>
      </div>
    </div>
  );
}
