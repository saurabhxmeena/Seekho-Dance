import { NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { recordSuccessfulPayment } from "@/lib/payment-db";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      console.warn("[Webhook] Missing x-razorpay-signature header");
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    // 1. Verify Webhook signature server-side
    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      console.error("[Webhook] Invalid webhook signature detected");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    // 2. Parse event payload
    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const eventType = event.event;
    console.log(`[Razorpay Webhook] Received verified event: ${eventType}`);

    // 3. Handle successful payment events idempotently
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;

      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;
      const amount = paymentEntity?.amount || orderEntity?.amount;
      const courseId = paymentEntity?.notes?.courseId;
      const userId = paymentEntity?.notes?.userId || paymentEntity?.email;

      if (orderId && paymentId) {
        // Idempotent record update: if already processed, no duplicates are created
        const { isDuplicate } = await recordSuccessfulPayment({
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          userId,
          courseId,
          amount,
        });

        console.log(
          `[Webhook] Order ${orderId} / Payment ${paymentId} recorded. Duplicate: ${isDuplicate}`
        );
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error: any) {
    console.error("[Razorpay Webhook Handler Error]:", error);
    return NextResponse.json(
      { error: "Internal webhook processing error" },
      { status: 500 }
    );
  }
}
