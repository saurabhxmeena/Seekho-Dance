"use client";

import React, { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  met: boolean;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements: Requirement[] = useMemo(() => {
    return [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "One uppercase letter", met: /[A-Z]/.test(password) },
      { label: "One lowercase letter", met: /[a-z]/.test(password) },
      { label: "One number", met: /\d/.test(password) },
      { label: "One special character", met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
    ];
  }, [password]);

  const metCount = requirements.filter((r) => r.met).length;
  const strength =
    metCount <= 1
      ? "weak"
      : metCount <= 3
      ? "fair"
      : metCount <= 4
      ? "good"
      : "strong";

  const strengthConfig = {
    weak: { label: "Weak", color: "bg-red-500", textColor: "text-red-600 dark:text-red-400", width: "20%" },
    fair: { label: "Fair", color: "bg-amber-500", textColor: "text-amber-600 dark:text-amber-400", width: "40%" },
    good: { label: "Good", color: "bg-blue-500", textColor: "text-blue-600 dark:text-blue-400", width: "70%" },
    strong: { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-600 dark:text-emerald-400", width: "100%" },
  };

  const config = strengthConfig[strength];

  if (!password) return null;

  return (
    <div className="space-y-2.5 animate-in fade-in duration-200">
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
            Password Strength
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${config.textColor}`}>
            {config.label}
          </span>
        </div>
        <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${config.color}`}
            style={{ width: config.width }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-1 gap-1">
        {requirements.map((req) => (
          <div
            key={req.label}
            className={`flex items-center gap-2 text-[11px] transition-colors duration-200 ${
              req.met
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-neutral-400"
            }`}
          >
            {req.met ? (
              <Check className="w-3 h-3 shrink-0" />
            ) : (
              <X className="w-3 h-3 shrink-0 opacity-40" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
