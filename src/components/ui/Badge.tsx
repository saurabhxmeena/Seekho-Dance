import React from "react";
import { cn } from "@/lib/utils";
import { Difficulty } from "@/types";

interface BadgeProps {
  children?: React.ReactNode;
  variant?: "default" | "outline" | "accent" | "difficulty" | "style";
  difficulty?: Difficulty;
  className?: string;
}

export function Badge({ children, variant = "default", difficulty, className }: BadgeProps) {
  if (variant === "difficulty" && difficulty) {
    const diffStyles = {
      Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
      Intermediate: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
      Advanced: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
    }[difficulty];

    return (
      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide border", diffStyles, className)}>
        {children || difficulty}
      </span>
    );
  }

  const baseStyles: Record<string, string> = {
    default: "bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700",
    outline: "bg-transparent text-neutral-600 border-neutral-300 dark:text-neutral-400 dark:border-neutral-700",
    accent: "bg-orange-500/10 text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-800/40",
    style: "bg-neutral-900 text-white text-[11px] font-medium tracking-wide dark:bg-neutral-100 dark:text-neutral-900",
  };

  const styleClass = baseStyles[variant] || baseStyles.default;

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium tracking-wide border", styleClass, className)}>
      {children}
    </span>
  );
}
