/**
 * Payment Service Abstraction
 * 
 * Manages checkout flows, payment processing, and access fulfillment.
 * Supports both development test simulation (1-click unlock) and
 * real Razorpay / Stripe gateway integration.
 * 
 * ARCHITECTURE FOR FUTURE REAL PAYMENT INTEGRATION:
 * When connecting live production payments:
 * - Update `processPayment` with your production payment gateway or webhook verification
 * - After bank confirmation, call `accessService.grantAccess(...)`
 * 
 * The UI components depend ONLY on this service abstraction.
 */

import { accessService } from "./accessService";
import { loadRazorpayScript } from "@/lib/razorpay-client";

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: {
    description?: string;
  };
}

export interface PaymentOptions {
  productId: string;
  userId: string;
  userEmail: string;
  userName: string;
  courseTitle?: string;
  price?: number;
}

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  paymentId?: string;
  error?: string;
}

class PaymentService {
  /**
   * Fast Development Simulated Payment
   * Allows testing the complete end-to-end journey in development:
   * Logged out → Click video → Login modal → Sign in → Pricing appears → Fake payment succeeds → Video unlocks!
   */
  public async simulatePayment(
    productId: string,
    userId: string
  ): Promise<PaymentResult> {
    // Realistic micro-delay to show payment processing loading state
    await new Promise((resolve) => setTimeout(resolve, 800));

    const fakeOrderId = "order_sim_" + Date.now();
    const fakePaymentId = "pay_sim_" + Date.now();

    // Automatically grant access in accessService
    const granted = accessService.grantAccess(userId, productId);
    if (!granted) {
      return {
        success: false,
        error: "Failed to fulfill entitlement access.",
      };
    }

    return {
      success: true,
      orderId: fakeOrderId,
      paymentId: fakePaymentId,
    };
  }

  /**
   * Real Razorpay Payment Process
   * Connects with existing Razorpay order generation & server verification routes
   */
  public async processRazorpayPayment(
    options: PaymentOptions,
    callbacks?: {
      onStatusUpdate?: (status: string) => void;
      onSuccess?: () => void;
      onFailure?: (error: string) => void;
    }
  ): Promise<PaymentResult> {
    try {
      callbacks?.onStatusUpdate?.("Loading secure payment gateway...");
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load payment gateway SDK. Please check your internet connection.");
      }

      callbacks?.onStatusUpdate?.("Creating order with bank...");
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: options.productId,
          userId: options.userId,
          userEmail: options.userEmail,
          userName: options.userName,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order.");
      }

      if (orderData.alreadyPurchased) {
        accessService.grantAccess(options.userId, options.productId);
        callbacks?.onSuccess?.();
        return { success: true, orderId: orderData.orderId };
      }

      return new Promise<PaymentResult>((resolve) => {
        callbacks?.onStatusUpdate?.("Awaiting payment completion...");

        const rzpOptions = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Seekho Dance",
          description: options.courseTitle ? `Unlock ${options.courseTitle}` : "Seekho Dance Pass",
          image: "/logo.png",
          order_id: orderData.orderId,
          prefill: {
            name: options.userName,
            email: options.userEmail,
          },
          theme: {
            color: "#EA580C",
          },
          modal: {
            ondismiss: () => {
              callbacks?.onFailure?.("Payment was cancelled.");
              resolve({ success: false, error: "Payment was cancelled." });
            },
          },
          handler: async (response: RazorpaySuccessResponse) => {
            try {
              callbacks?.onStatusUpdate?.("Verifying cryptographic signature...");
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  courseId: options.productId,
                  userId: options.userId,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || !verifyData.success) {
                throw new Error(verifyData.error || "Server signature verification failed.");
              }

              // Access granted
              accessService.grantAccess(options.userId, options.productId);
              callbacks?.onSuccess?.();
              resolve({
                success: true,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
              });
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Payment verification failed.";
              callbacks?.onFailure?.(msg);
              resolve({ success: false, error: msg });
            }
          },
        };

        const razorpay = new (window as unknown as { Razorpay: new (opts: typeof rzpOptions) => { on: (event: string, handler: (resp: RazorpayFailureResponse) => void) => void; open: () => void } }).Razorpay(rzpOptions);
        razorpay.on("payment.failed", (response: RazorpayFailureResponse) => {
          const msg = response.error?.description || "Payment attempt failed.";
          callbacks?.onFailure?.(msg);
          resolve({ success: false, error: msg });
        });
        razorpay.open();
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to proceed with checkout.";
      callbacks?.onFailure?.(msg);
      return { success: false, error: msg };
    }
  }
}

export const paymentService = new PaymentService();
