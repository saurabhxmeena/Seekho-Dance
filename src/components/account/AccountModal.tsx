"use client";

import React from "react";
import Link from "next/link";
import { X, User, Sparkles, BookMarked, Settings, LogOut, CheckCircle2, ChevronRight, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal / Drawer Surface */}
      <div className="relative w-full max-w-md rounded-t-[32px] sm:rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-7 space-y-5 z-10 animate-in slide-in-from-bottom-4 duration-250">
        
        {/* Header & Close */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="text-base font-bold text-neutral-950 dark:text-white tracking-tight">
            Account & Studio Profile
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
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800">
          <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            SD
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-neutral-950 dark:text-white truncate">
                Seekho Dancer
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold">
                Free Explorer
              </span>
            </div>
            <span className="text-xs text-neutral-400 truncate block">
              dancer@seekhodance.com
            </span>
          </div>
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
            href="/explore"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition"
          >
            <div className="flex items-center gap-3">
              <BookMarked className="w-4 h-4 text-neutral-400" />
              <span>Saved Practice Routines</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </Link>

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
        </div>

        {/* Bottom Note */}
        <div className="pt-2 text-center border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
          Seekho Dance v1.0 • Signed in
        </div>
      </div>
    </div>
  );
}
