import { NextResponse } from "next/server";
import { getProductPricing } from "@/data/pricing";
import { createRazorpayOrder, getRazorpayKeyId } from "@/lib/razorpay";
import { createPurchaseRecord, hasPurchased } from "@/lib/payment-db";
import { CreateOrderRequest, CreateOrderResponse } from "@/types/payment";

export async function POST(request: Request) {
  try {
    let body: CreateOrderRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const { courseId, userId = "dancer@seekhodance.com", userEmail, userName } = body;

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: "Course or routine ID is required" },
        { status: 400 }
      );
    }

    // 1. Fetch product pricing from SERVER source of truth.
    // SECURITY: Never trust any price sent by the client!
    const product = getProductPricing(courseId);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product or choreography not found" },
        { status: 404 }
      );
    }

    // 2. If the product is free, grant access immediately without payment
    if (product.isFree || product.amountPaise === 0) {
      return NextResponse.json({
        success: true,
        alreadyPurchased: true,
        courseId,
        message: "This choreography is free starter content. Enjoy practicing!",
      });
    }

    // 3. Server-side access check: check if already purchased
    const alreadyOwns = await hasPurchased(userId, courseId);
    if (alreadyOwns) {
      return NextResponse.json({
        success: true,
        alreadyPurchased: true,
        courseId,
        courseTitle: product.title,
        message: "You already own access to this choreography.",
      });
    }

    // 4. Create Razorpay Order server-side
    const keyId = getRazorpayKeyId();
    if (!keyId) {
      console.error("[Create Order] Missing Razorpay Key ID in environment.");
      return NextResponse.json(
        {
          success: false,
          error:
            "Razorpay environment configuration missing. Please ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set.",
        },
        { status: 500 }
      );
    }

    const receipt = `rcpt_${Date.now()}_${courseId.substring(0, 8)}`;

    const razorpayOrder = await createRazorpayOrder({
      amount: product.amountPaise,
      currency: product.currency,
      receipt,
      notes: {
        courseId: product.id,
        courseTitle: product.title,
        userId: userId,
        userEmail: userEmail || "",
        userName: userName || "",
      },
    });

    // 5. Record created order in server database for idempotency tracking
    await createPurchaseRecord({
      userId,
      courseId: product.id,
      razorpayOrderId: razorpayOrder.id,
      amount: product.amountPaise,
      currency: product.currency,
    });

    // 6. Return ONLY public information to the frontend.
    // SECURITY: Never return RAZORPAY_KEY_SECRET!
    const responseData: CreateOrderResponse = {
      success: true,
      orderId: razorpayOrder.id,
      amount: product.amountPaise,
      currency: product.currency,
      keyId, // Public Key ID only
      courseId: product.id,
      courseTitle: product.title,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error("[Create Order API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to create payment order. Please try again.",
      },
      { status: 500 }
    );
  }
}
