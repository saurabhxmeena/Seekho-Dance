"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "full";
}

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("w-8 h-8 rounded-full bg-neutral-200/50 dark:bg-neutral-800/50 animate-pulse", className)} />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "full") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition",
          className
        )}
        aria-label="Toggle Theme"
      >
        <span className="flex items-center gap-2">
          {isDark ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-orange-500" />}
          <span>{isDark ? "Dark Theme" : "Light Theme"}</span>
        </span>
        <span className="text-[10px] font-mono uppercase text-neutral-400">
          {isDark ? "Switch to Light" : "Switch to Dark"}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative flex items-center justify-center",
        className
      )}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Dark and Light Mode"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-neutral-200 hover:text-amber-400 transition-colors" />
      ) : (
        <Moon className="w-4 h-4 text-neutral-700 hover:text-neutral-950 transition-colors" />
      )}
    </button>
  );
}
