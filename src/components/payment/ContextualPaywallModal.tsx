"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  Zap,
  Check,
  Loader2,
  AlertCircle,
  Play,
  RotateCcw,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { paymentService } from "@/services/paymentService";
import { accessService } from "@/services/accessService";
import { cn } from "@/lib/utils";

interface ContextualPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineId: string;
  routineTitle: string;
  routinePrice?: number;
  routineCoverImage?: string;
  onSuccess: () => void;
}

export function ContextualPaywallModal({
  isOpen,
  onClose,
  routineId,
  routineTitle,
  routinePrice = 299,
  routineCoverImage,
  onSuccess,
}: ContextualPaywallModalProps) {
  const { user } = useAuth();

  const [selectedOption, setSelectedOption] = useState<"routine" | "monthly" | "onetime">("routine");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPrice =
    selectedOption === "routine"
      ? routinePrice
      : selectedOption === "monthly"
      ? 499
      : 799;

  const currentProductId =
    selectedOption === "routine"
      ? routineId
      : selectedOption === "monthly"
      ? "pass-monthly"
      : "pass-onetime";

  const handleSimulatedPayment = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setStatusMessage("Authorizing demo purchase...");

      const userId = user?.email || "dancer@seekhodance.com";
      const result = await paymentService.simulatePayment(currentProductId, userId);

      if (!result.success) {
        throw new Error(result.error || "Simulated payment failed.");
      }

      setIsSuccess(true);
      setStatusMessage("Payment Verified! Unlocking video...");

      setTimeout(() => {
        setIsSuccess(false);
        setLoading(false);
        setStatusMessage(null);
        onSuccess();
        onClose();
      }, 1100);
    } catch (err: any) {
      setErrorMessage(err.message || "Payment attempt failed.");
      setLoading(false);
      setStatusMessage(null);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setStatusMessage("Opening secure checkout...");

      const userId = user?.email || "dancer@seekhodance.com";
      const userEmail = user?.email || "dancer@seekhodance.com";
      const userName = user?.name || "Seekho Dancer";

      const result = await paymentService.processRazorpayPayment(
        {
          productId: currentProductId,
          userId,
          userEmail,
          userName,
          courseTitle: routineTitle,
          price: currentPrice,
        },
        {
          onStatusUpdate: (msg) => setStatusMessage(msg),
          onSuccess: () => {
            setIsSuccess(true);
            setStatusMessage("Payment Verified! Unlocking video...");
            setTimeout(() => {
              setIsSuccess(false);
              setLoading(false);
              onSuccess();
              onClose();
            }, 1100);
          },
          onFailure: (err) => {
            setErrorMessage(err);
            setLoading(false);
            setStatusMessage(null);
          },
        }
      );

      if (!result.success && result.error) {
        setErrorMessage(result.error);
        setLoading(false);
        setStatusMessage(null);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initialize payment.");
      setLoading(false);
      setStatusMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={!loading ? onClose : undefined}
      />

      {/* Surface: Bottom Sheet on Mobile, Dialog on sm+ */}
      <div
        className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-[28px] bg-white dark:bg-[#16161B] border border-neutral-200/90 dark:border-neutral-800 shadow-2xl p-5 sm:p-7 space-y-4 sm:space-y-5 z-10 animate-in slide-in-from-bottom-5 duration-250 max-h-[92vh] overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile Pull Indicator */}
        <div className="sm:hidden w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto -mt-1.5 mb-2" />

        {/* Header & Dismiss */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Lock className="w-4 h-4" />
            </span>
            <div className="text-xs">
              <span className="font-mono text-neutral-400 uppercase text-[10px] block">
                Protected Content
              </span>
              <span className="font-bold text-neutral-900 dark:text-white">
                Choose Access Option
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition disabled:opacity-40"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Celebration Success View */}
        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
              Access Granted!
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Returning to {routineTitle}. Video is now playing...
            </p>
          </div>
        ) : (
          <>
            {/* Target Routine Context Card */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {routineCoverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={routineCoverImage}
                    alt={routineTitle}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-black/5"
                  />
                )}
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase font-bold block">
                    Dance Lesson
                  </span>
                  <h3 className="text-sm font-bold text-neutral-950 dark:text-white truncate">
                    {routineTitle}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    Logged in as <strong className="text-neutral-700 dark:text-neutral-200">{user?.email || "Dancer"}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            {/* Status Message */}
            {statusMessage && (
              <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 flex items-center gap-2 text-xs text-orange-800 dark:text-orange-200">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Pricing Options Selector (Reusing Existing Pricing Section Structure) */}
            <div className="space-y-2.5">
              {/* Option 1: Unlock this Routine (₹299) */}
              <div
                onClick={() => setSelectedOption("routine")}
                className={cn(
                  "p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                  selectedOption === "routine"
                    ? "bg-orange-50/60 dark:bg-orange-950/20 border-orange-500 ring-1 ring-orange-500/50 shadow-xs"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                )}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition",
                        selectedOption === "routine"
                          ? "border-orange-600 bg-orange-600 text-white"
                          : "border-neutral-400"
                      )}
                    >
                      {selectedOption === "routine" && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white">
                      Unlock this Choreography
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pl-6">
                    Full breakdown steps, 0.5x tempo, and mirror mode for this song.
                  </p>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <span className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
                    ₹{routinePrice}
                  </span>
                  <span className="block text-[10px] text-neutral-400 uppercase font-mono">
                    One-Time
                  </span>
                </div>
              </div>

              {/* Option 2: Studio Monthly Pass (₹499/mo) */}
              <div
                onClick={() => setSelectedOption("monthly")}
                className={cn(
                  "p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between relative",
                  selectedOption === "monthly"
                    ? "bg-orange-50/60 dark:bg-orange-950/20 border-orange-500 ring-1 ring-orange-500/50 shadow-xs"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                )}
              >
                <span className="absolute -top-2 right-4 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-orange-600 text-white uppercase tracking-wider shadow-2xs">
                  Best Value
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition",
                        selectedOption === "monthly"
                          ? "border-orange-600 bg-orange-600 text-white"
                          : "border-neutral-400"
                      )}
                    >
                      {selectedOption === "monthly" && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white">
                      Monthly Studio Pass
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pl-6">
                    Unlimited access to all 100+ dance choreographies. Cancel anytime.
                  </p>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <span className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
                    ₹499
                  </span>
                  <span className="block text-[10px] text-neutral-400 uppercase font-mono">
                    / month
                  </span>
                </div>
              </div>

              {/* Option 3: 1-Month Pass (₹799 one-time) */}
              <div
                onClick={() => setSelectedOption("onetime")}
                className={cn(
                  "p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between",
                  selectedOption === "onetime"
                    ? "bg-orange-50/60 dark:bg-orange-950/20 border-orange-500 ring-1 ring-orange-500/50 shadow-xs"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                )}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition",
                        selectedOption === "onetime"
                          ? "border-orange-600 bg-orange-600 text-white"
                          : "border-neutral-400"
                      )}
                    >
                      {selectedOption === "onetime" && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white">
                      1-Month Pass
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pl-6">
                    30 days of full studio access. Never auto-renews.
                  </p>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <span className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
                    ₹799
                  </span>
                  <span className="block text-[10px] text-neutral-400 uppercase font-mono">
                    One-Time
                  </span>
                </div>
              </div>
            </div>

            {/* What's Included Preview */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 dark:text-neutral-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Play className="w-3 h-3 text-orange-600 shrink-0" />
                <span>All Lesson Steps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3 h-3 text-orange-600 shrink-0" />
                <span>Horizontal Mirror Mode</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3 h-3 text-orange-600 shrink-0" />
                <span>0.5x Slow Tempo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-orange-600 shrink-0" />
                <span>8-Count Beat Loops</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              {/* Primary 1-Click Instant Demo Payment (End-to-End Dev Flow Testing) */}
              <button
                type="button"
                onClick={handleSimulatedPayment}
                disabled={loading}
                className={cn(
                  "w-full py-3 sm:py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition active:scale-98 shadow-md cursor-pointer",
                  loading
                    ? "bg-neutral-400 dark:bg-neutral-700 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-500 shadow-orange-600/25"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Pay ₹{currentPrice} & Unlock Video Instantly</span>
                  </>
                )}
              </button>

              {/* Option to test via real Razorpay checkout */}
              <button
                type="button"
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="w-full py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Pay via Razorpay Gateway (UPI, Cards, NetBanking)</span>
              </button>
            </div>

            {/* Trust Footer */}
            <div className="text-center pt-1 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-[10px] text-neutral-400">
                Cancel subscription anytime in Profile settings • 100% Encrypted Checkout
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
