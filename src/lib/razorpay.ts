import crypto from "crypto";
import Razorpay from "razorpay";

export function getRazorpayKeyId(): string {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  return keyId;
}

export function getRazorpayKeySecret(): string {
  const secret = process.env.RAZORPAY_KEY_SECRET || "";
  return secret;
}

export function getRazorpayWebhookSecret(): string {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  return webhookSecret;
}

/**
 * Returns an initialized Razorpay instance.
 * Throws a descriptive error on the server if credentials are not configured.
 */
export function getRazorpayInstance(): Razorpay {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay credentials missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your Vercel or local environment variables."
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Creates a Razorpay Order server-side.
 * Amount is in paise (1 INR = 100 paise).
 */
export async function createRazorpayOrder({
  amount,
  currency = "INR",
  receipt,
  notes,
}: {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}) {
  const razorpay = getRazorpayInstance();

  const options = {
    amount, // in paise
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
    notes: notes || {},
  };

  const order = await razorpay.orders.create(options);
  return order;
}

/**
 * Server-side cryptographic verification of Razorpay payment signature.
 * Formula: HMAC-SHA256(order_id + "|" + payment_id, secret) === signature
 *
 * Razorpay security best practices state this MUST always be verified server-side.
 */
export function verifyRazorpayPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = getRazorpayKeySecret();
  if (!secret) {
    console.error("[Razorpay] Missing RAZORPAY_KEY_SECRET for signature verification");
    return false;
  }

  if (!orderId || !paymentId || !signature) {
    return false;
  }

  const payload = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  try {
    const a = Buffer.from(generatedSignature, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length !== b.length) {
      return false;
    }
    return crypto.timingSafeEqual(a, b);
  } catch (err) {
    return false;
  }
}

/**
 * Server-side verification for Razorpay Webhook signatures.
 * Formula: HMAC-SHA256(rawBody, webhookSecret) === x-razorpay-signature
 */
export function verifyRazorpayWebhookSignature({
  rawBody,
  signature,
}: {
  rawBody: string;
  signature: string;
}): boolean {
  const webhookSecret = getRazorpayWebhookSecret();
  if (!webhookSecret) {
    console.error("[Razorpay] Missing RAZORPAY_WEBHOOK_SECRET for webhook verification");
    return false;
  }

  if (!rawBody || !signature) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  try {
    const a = Buffer.from(generatedSignature, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length !== b.length) {
      return false;
    }
    return crypto.timingSafeEqual(a, b);
  } catch (err) {
    return false;
  }
}
