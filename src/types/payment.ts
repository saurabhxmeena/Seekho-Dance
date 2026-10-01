export type PaymentStatus = "created" | "paid" | "failed";

export interface PurchaseRecord {
  id: string;
  userId: string;
  courseId: string; // Routine ID (e.g. 'tauba-tauba') or Pass ID (e.g. 'pass-monthly')
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number; // in paise (e.g. 29900 = ₹299)
  currency: string; // 'INR'
  status: PaymentStatus;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export interface CoursePricing {
  id: string; // routine slug or pass id
  title: string;
  amountPaise: number; // in paise
  displayPrice: number; // in rupees
  currency: string;
  isFree?: boolean;
  type: "routine" | "membership";
  description?: string;
}

export interface CreateOrderRequest {
  courseId: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  courseId?: string;
  courseTitle?: string;
  alreadyPurchased?: boolean;
  error?: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  courseId: string;
  userId?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  purchase?: PurchaseRecord;
  error?: string;
}

export interface CheckAccessResponse {
  hasAccess: boolean;
  isFree: boolean;
  price?: number;
  currency?: string;
  title?: string;
}
