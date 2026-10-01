import { NextResponse } from "next/server";
import { createRazorpayOrder, getRazorpayKeyId } from "@/lib/razorpay";
import { getProductPricing } from "@/data/pricing";
import { createPurchaseRecord } from "@/lib/payment-db";

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Determine amount and currency
    // Supports either direct { amount } (in paise) or { courseId }
    let amountInPaise: number | undefined = body.amount;
    let currency: string = body.currency || "INR";
    let receipt: string = body.receipt || `rcpt_${Date.now()}`;
    const notes: Record<string, string> = body.notes || {};

    if (body.courseId) {
      const product = getProductPricing(body.courseId);
      if (product) {
        amountInPaise = product.amountPaise;
        currency = product.currency || "INR";
        notes.courseId = product.id;
        notes.courseTitle = product.title;
      }
    }

    // Validation: amount is required and must be at least 100 paise (₹1)
    if (amountInPaise === undefined || typeof amountInPaise !== "number") {
      return NextResponse.json(
        { error: "Field 'amount' in paise is required and must be a number (minimum 100 paise)." },
        { status: 400 }
      );
    }

    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: "Amount must be at least 100 paise (₹1 INR)." },
        { status: 400 }
      );
    }

    const keyId = getRazorpayKeyId();
    if (!keyId) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured. Please set RAZORPAY_KEY_ID in .env.local" },
        { status: 401 }
      );
    }

    try {
      const order = await createRazorpayOrder({
        amount: Math.round(amountInPaise),
        currency,
        receipt,
        notes,
      });

      // Optionally record in local payment DB if courseId or userId provided
      if (body.courseId || body.userId) {
        try {
          await createPurchaseRecord({
            userId: body.userId || "guest_dancer",
            courseId: body.courseId || "standard_order",
            razorpayOrderId: order.id,
            amount: Math.round(amountInPaise),
            currency,
          });
        } catch (dbErr) {
          console.warn("[PaymentDB] Could not record purchase record:", dbErr);
        }
      }

      // Return standard response format: { order_id, amount, currency, key_id }
      return NextResponse.json(
        {
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          key_id: keyId,
          // Extra convenience fields
          id: order.id,
          receipt: order.receipt,
          status: order.status,
        },
        { status: 200 }
      );
    } catch (rzpError: any) {
      console.error("[Razorpay API Error]:", rzpError);

      if (
        rzpError?.statusCode === 401 ||
        (rzpError?.error?.code === "BAD_REQUEST_ERROR" && rzpError?.message?.includes("auth"))
      ) {
        return NextResponse.json(
          { error: "Razorpay authentication failed. Verify your API credentials.", details: rzpError.message },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          error: rzpError?.error?.description || rzpError?.message || "Razorpay API error creating order.",
          statusCode: rzpError?.statusCode || 500,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[Create Order Handler Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
