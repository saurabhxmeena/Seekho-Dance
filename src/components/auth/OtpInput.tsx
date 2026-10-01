"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  length = 6,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = true,
}: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [autoFocus]);

  // Reset when error changes
  useEffect(() => {
    if (error) {
      setValues(Array(length).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 200);
    }
  }, [error, length]);

  const focusInput = useCallback((index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  }, [length]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Allow only digits
      const digit = value.replace(/\D/g, "").slice(-1);
      const newValues = [...values];
      newValues[index] = digit;
      setValues(newValues);

      if (digit && index < length - 1) {
        focusInput(index + 1);
      }

      // Check if OTP is complete
      const otp = newValues.join("");
      if (otp.length === length && !newValues.includes("")) {
        onComplete(otp);
      }
    },
    [values, length, focusInput, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newValues = [...values];
        if (values[index]) {
          newValues[index] = "";
          setValues(newValues);
        } else if (index > 0) {
          newValues[index - 1] = "";
          setValues(newValues);
          focusInput(index - 1);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [values, focusInput]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);

      if (pastedData.length === 0) return;

      const newValues = Array(length).fill("");
      for (let i = 0; i < pastedData.length; i++) {
        newValues[i] = pastedData[i];
      }
      setValues(newValues);

      // Focus last filled or next empty
      const nextIndex = Math.min(pastedData.length, length - 1);
      focusInput(nextIndex);

      if (pastedData.length === length) {
        onComplete(pastedData);
      }
    },
    [length, focusInput, onComplete]
  );

  const handleFocus = useCallback((index: number) => {
    inputRefs.current[index]?.select();
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => {
        const isFilled = Boolean(values[index]);
        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={values[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            autoComplete="one-time-code"
            className={`
              w-11 h-14 sm:w-13 sm:h-16
              text-center text-xl sm:text-2xl font-bold
              rounded-2xl border-2
              bg-neutral-50 dark:bg-neutral-900
              outline-none
              transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              ${
                error
                  ? "border-red-400 dark:border-red-500 text-red-600 dark:text-red-400 animate-shake"
                  : isFilled
                  ? "border-orange-500 dark:border-orange-400 text-neutral-950 dark:text-white shadow-sm shadow-orange-500/10"
                  : "border-neutral-200 dark:border-neutral-700 text-neutral-950 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:shadow-sm focus:shadow-orange-500/10"
              }
            `}
            aria-label={`Digit ${index + 1}`}
          />
        );
      })}
    </div>
  );
}
