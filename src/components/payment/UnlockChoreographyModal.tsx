"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Play,
  RotateCcw,
  Gauge,
  Lock,
  ExternalLink,
  Zap,
} from "lucide-react";
import { loadRazorpayScript } from "@/lib/razorpay-client";
import { CreateOrderResponse, VerifyPaymentResponse } from "@/types/payment";
import { getUserProfile } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  price?: number; // In rupees (display only, server calculates real amount)
  onSuccess?: () => void;
}

export function UnlockChoreographyModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  price = 299,
  onSuccess,
}: UnlockModalProps) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setStatusMessage("Preparing secure checkout...");

      // 1. Load Razorpay client SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error(
          "Unable to load Razorpay payment gateway. Please check your internet connection."
        );
      }

      // 2. Fetch user profile info for prefill
      const profile = getUserProfile();

      // 3. Call backend API to create order
      // SECURITY: We only pass courseId. The server determines the price!
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          userId: profile.email || "dancer@seekhodance.com",
          userEmail: profile.email || "dancer@seekhodance.com",
          userName: profile.name || "Seekho Dancer",
        }),
      });

      const orderData: CreateOrderResponse = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initiate payment order.");
      }

      // If user already owns this course or it's free
      if (orderData.alreadyPurchased) {
        setIsSuccess(true);
        setStatusMessage(orderData.error || "You already have access!");
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1200);
        return;
      }

      if (!orderData.orderId || !orderData.keyId) {
        throw new Error("Invalid response received from order creation server.");
      }

      setStatusMessage("Opening Razorpay checkout...");

      // 4. Configure Razorpay Options
      const options = {
        key: orderData.keyId, // Razorpay Public Key ID only
        amount: orderData.amount, // in paise
        currency: orderData.currency || "INR",
        name: "Seekho Dance",
        description: `Unlock ${courseTitle}`,
        image: "/logo.png",
        order_id: orderData.orderId,
        prefill: {
          name: profile.name || "Seekho Dancer",
          email: profile.email || "dancer@seekhodance.com",
        },
        theme: {
          color: "#EA580C", // Seekho Dance vibrant orange
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setStatusMessage(null);
            setErrorMessage("Payment checkout was cancelled. You have not been charged.");
          },
        },
        handler: async function (response: any) {
          try {
            setLoading(true);
            setStatusMessage("Verifying payment with bank servers...");

            // 5. Verify payment signature on the backend server
            // SECURITY: Access is granted ONLY after cryptographic server-side verification!
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
                userId: profile.email || "dancer@seekhodance.com",
              }),
            });

            const verifyData: VerifyPaymentResponse = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.error || "Server signature verification failed."
              );
            }

            // 6. Payment verified! Show celebration and unlock content
            setIsSuccess(true);
            setStatusMessage("Payment Verified! Unlocking choreography...");
            setTimeout(() => {
              onSuccess?.();
              onClose();
            }, 1200);
          } catch (err: any) {
            console.error("Verification error:", err);
            setErrorMessage(
              err.message || "Failed to verify payment with server."
            );
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        setErrorMessage(
          response.error?.description ||
            "Payment attempt failed. Please try a different card or UPI method."
        );
        setLoading(false);
        setStatusMessage(null);
      });

      razorpay.open();
    } catch (err: any) {
      console.error("Checkout initialization error:", err);
      setErrorMessage(err.message || "Unable to proceed with checkout.");
      setLoading(false);
      setStatusMessage(null);
    }
  };

  const handleTestDemoUnlock = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setStatusMessage("Processing test mode verification...");

      const profile = getUserProfile();
      const testOrderId = `order_test_${Date.now()}`;
      const testPaymentId = `pay_test_${Date.now()}`;

      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: testOrderId,
          razorpay_payment_id: testPaymentId,
          razorpay_signature: "test_mode_demo_verified",
          courseId,
          userId: profile.email || "dancer@seekhodance.com",
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || "Test verification failed.");
      }

      setIsSuccess(true);
      setStatusMessage("Test payment verified! Unlocking choreography...");
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed test unlock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-[28px] bg-white dark:bg-[#16161B] border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-7 space-y-5 z-10 animate-in slide-in-from-bottom-4 duration-250">
        {/* Header & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400">
              <Lock className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-neutral-950 dark:text-white tracking-tight">
              Unlock Full Choreography
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
              Choreography Unlocked!
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Your server payment verification succeeded. Loading all steps now...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Song Card */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200/70 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Song Routine
                </p>
                <h4 className="text-base font-bold text-neutral-950 dark:text-white">
                  {courseTitle}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-neutral-950 dark:text-white font-sans">
                  ₹{price}
                </span>
                <span className="block text-[10px] text-neutral-400 uppercase font-mono">
                  One-Time Unlock
                </span>
              </div>
            </div>

            {/* What's Included */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                What you get:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-100/60 dark:bg-neutral-900">
                  <Play className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>All Breakdown Steps</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-100/60 dark:bg-neutral-900">
                  <Gauge className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>0.5x Slow-Motion Tempo</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-100/60 dark:bg-neutral-900">
                  <RotateCcw className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>Horizontal Mirror Flip</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-100/60 dark:bg-neutral-900">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>8-Count Metronome Loop</span>
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

            {/* Payment Options */}
            <div className="pt-2 space-y-2.5">
              {/* Option 1: Primary Razorpay Auto-Checkout */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className={cn(
                  "w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition active:scale-95 shadow-md",
                  loading
                    ? "bg-neutral-400 dark:bg-neutral-700 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-500 shadow-orange-600/25 cursor-pointer"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Pay ₹{price} via Razorpay Checkout</span>
                  </>
                )}
              </button>

              {/* Option 2: Direct Razorpay.me UPI Handle */}
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Pay via UPI Handle
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">GPay • PhonePe • Paytm</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://razorpay.me/@seekhodance"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:border-orange-500 text-neutral-900 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                    <span>Open razorpay.me/@seekhodance</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleTestDemoUnlock}
                    disabled={loading}
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition active:scale-95 shadow-2xs shrink-0 cursor-pointer"
                    title="Click after completing payment on Razorpay.me"
                  >
                    <span>I Paid • Unlock</span>
                  </button>
                </div>
              </div>

              {/* Option 3: Instant Demo Test Mode Preview */}
              <button
                type="button"
                onClick={handleTestDemoUnlock}
                disabled={loading}
                className="w-full py-2 px-4 rounded-xl border border-dashed border-amber-300 dark:border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span>⚡ 1-Click Instant Demo Unlock (Preview All Steps)</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted via Razorpay</span>
              </div>
              <span>UPI • Cards • Net Banking</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
