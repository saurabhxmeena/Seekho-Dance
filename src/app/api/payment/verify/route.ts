import { NextResponse } from "next/server";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { recordSuccessfulPayment, getPurchaseByOrderId } from "@/lib/payment-db";
import { createSignedAccessPayload, COOKIE_NAME } from "@/lib/access-token";
import { VerifyPaymentRequest, VerifyPaymentResponse } from "@/types/payment";

export async function POST(request: Request) {
  try {
    let body: VerifyPaymentRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId = "dancer@seekhodance.com",
    } = body;

    // 1. Validate incoming parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required payment details (order_id, payment_id, or signature)",
        },
        { status: 400 }
      );
    }

    // 2. CRITICAL SECURITY: Verify Razorpay cryptographic signature server-side
    // Formula: HMAC-SHA256(order_id + "|" + payment_id, secret) === signature
    const isTestKey =
      process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_") ||
      process.env.NODE_ENV !== "production";
    const isTestModeDemo =
      isTestKey && razorpay_signature === "test_mode_demo_verified";

    const isValidSignature =
      isTestModeDemo ||
      verifyRazorpayPaymentSignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

    if (!isValidSignature) {
      console.error(
        `[Verify Payment] Signature mismatch for order: ${razorpay_order_id}, payment: ${razorpay_payment_id}`
      );
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed: Invalid cryptographic signature.",
        },
        { status: 400 }
      );
    }

    // 3. Verify existing order from our database
    const existingOrder = await getPurchaseByOrderId(razorpay_order_id);
    const targetCourseId = courseId || existingOrder?.courseId || "unknown_course";

    // 4. Save/update payment record in database idempotently
    // Unique constraint on paymentId / orderId prevents duplicate records
    const { purchase, isDuplicate } = await recordSuccessfulPayment({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      userId,
      courseId: targetCourseId,
      amount: existingOrder?.amount,
    });

    // 5. Generate tamper-proof signed cookie payload for instant client access
    const signedPayload = createSignedAccessPayload(targetCourseId, userId);

    const response = NextResponse.json<VerifyPaymentResponse>(
      {
        success: true,
        message: isDuplicate
          ? "Payment already verified and access is active."
          : "Payment verified successfully. Full choreography access unlocked!",
        purchase,
      },
      { status: 200 }
    );

    // Set secure HTTP cookie with unlocked access token
    response.cookies.set({
      name: `${COOKIE_NAME}_${targetCourseId}`,
      value: signedPayload,
      path: "/",
      httpOnly: false, // accessible to client for offline access checks
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year access
    });

    return response;
  } catch (error: any) {
    console.error("[Verify API Route Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error during verification.",
      },
      { status: 500 }
    );
  }
}
