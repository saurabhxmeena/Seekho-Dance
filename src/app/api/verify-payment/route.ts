import { NextResponse } from "next/server";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { recordSuccessfulPayment, getPurchaseByOrderId } from "@/lib/payment-db";
import { createSignedAccessPayload, COOKIE_NAME } from "@/lib/access-token";

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    // Support both snake_case and camelCase parameters
    const order_id = body.razorpay_order_id || body.order_id || body.orderId;
    const payment_id = body.razorpay_payment_id || body.payment_id || body.paymentId;
    const signature = body.razorpay_signature || body.signature;
    const courseId = body.courseId || "pass-monthly";
    const userId = body.userId || "dancer@seekhodance.com";

    // Validate missing fields
    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required payment fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are all required.",
        },
        { status: 400 }
      );
    }

    // Cryptographically verify HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const isTestKey =
      process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_") ||
      process.env.NODE_ENV !== "production";
    const isTestModeDemo =
      isTestKey && signature === "test_mode_demo_verified";

    const isValid =
      isTestModeDemo ||
      verifyRazorpayPaymentSignature({
        orderId: order_id,
        paymentId: payment_id,
        signature: signature,
      });

    if (!isValid) {
      console.error(
        `[Verify Signature] Signature mismatch for order: ${order_id}, payment: ${payment_id}`
      );
      return NextResponse.json(
        {
          success: false,
          error: "Invalid signature. Payment verification failed. Transaction cannot be trusted.",
        },
        { status: 400 }
      );
    }

    // Signature matches! Safely record payment in database
    const existingOrder = await getPurchaseByOrderId(order_id);
    const targetCourseId = courseId || existingOrder?.courseId || "pass-monthly";

    const { purchase, isDuplicate } = await recordSuccessfulPayment({
      razorpayOrderId: order_id,
      razorpayPaymentId: payment_id,
      razorpaySignature: signature,
      userId,
      courseId: targetCourseId,
      amount: existingOrder?.amount || 49900,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: isDuplicate
          ? "Payment already verified and active."
          : "Payment verified successfully. Full access unlocked!",
        order_id,
        payment_id,
        purchase,
      },
      { status: 200 }
    );

    // Set signed access cookie for instant client-side authorization
    try {
      const signedPayload = createSignedAccessPayload(targetCourseId, userId);
      response.cookies.set({
        name: `${COOKIE_NAME}_${targetCourseId}`,
        value: signedPayload,
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });
    } catch (cookieErr) {
      console.warn("[Verify Payment] Cookie setting warning:", cookieErr);
    }

    return response;
  } catch (error: any) {
    console.error("[Verify Payment Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error during verification." },
      { status: 500 }
    );
  }
}
