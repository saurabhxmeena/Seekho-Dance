import fs from "fs";
import path from "path";
import { PurchaseRecord, PaymentStatus } from "@/types/payment";
import { FREE_ROUTINE_IDS } from "@/data/pricing";

// In-memory cache for fast lookups and serverless runtime survival
let memoryPurchases: PurchaseRecord[] = [];
let isLoaded = false;

// Resolve storage file path
function getStorageFilePath(): string {
  // Try project local .data directory first
  const projectDataDir = path.join(process.cwd(), ".data");
  const localFile = path.join(projectDataDir, "purchases.json");

  // On read-only Vercel serverless containers, /tmp is writable
  const tmpFile = path.join("/tmp", "seekho_purchases.json");

  try {
    if (!fs.existsSync(projectDataDir)) {
      fs.mkdirSync(projectDataDir, { recursive: true });
    }
    // Test write permission
    const testFile = path.join(projectDataDir, ".test");
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    return localFile;
  } catch {
    return tmpFile;
  }
}

// Load purchases from disk or cache
function loadPurchases(): PurchaseRecord[] {
  if (isLoaded && memoryPurchases.length > 0) {
    return memoryPurchases;
  }

  const filePath = getStorageFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      memoryPurchases = JSON.parse(data) as PurchaseRecord[];
      isLoaded = true;
      return memoryPurchases;
    }
  } catch (err) {
    console.warn("[PaymentDB] Could not read storage file, initializing empty:", err);
  }

  isLoaded = true;
  return memoryPurchases;
}

// Save purchases to disk with error tolerance
function savePurchases(records: PurchaseRecord[]): void {
  memoryPurchases = records;
  const filePath = getStorageFilePath();

  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), "utf-8");
  } catch (err) {
    console.warn("[PaymentDB] Could not persist to disk, retained in memory:", err);
  }
}

/**
 * Creates or updates an initial order record in the database.
 * Uses razorpayOrderId as an idempotency key.
 */
export async function createPurchaseRecord({
  userId,
  courseId,
  razorpayOrderId,
  amount,
  currency = "INR",
}: {
  userId: string;
  courseId: string;
  razorpayOrderId: string;
  amount: number;
  currency?: string;
}): Promise<PurchaseRecord> {
  const records = loadPurchases();

  // Check if order already recorded (idempotency)
  const existing = records.find((p) => p.razorpayOrderId === razorpayOrderId);
  if (existing) {
    return existing;
  }

  const newRecord: PurchaseRecord = {
    id: `pur_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId: userId || "guest_dancer",
    courseId,
    razorpayOrderId,
    amount,
    currency,
    status: "created",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  records.push(newRecord);
  savePurchases(records);

  return newRecord;
}

/**
 * Idempotently marks a payment as successful and grants user access.
 * Unique constraint / idempotency strategy:
 * If this paymentId or orderId is already processed and paid,
 * returns the existing record immediately without duplicating access.
 */
export async function recordSuccessfulPayment({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  userId,
  courseId,
  amount,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  userId?: string;
  courseId?: string;
  amount?: number;
}): Promise<{ purchase: PurchaseRecord; isDuplicate: boolean }> {
  const records = loadPurchases();

  // Check unique payment ID first (strict idempotency)
  const existingByPaymentId = records.find(
    (p) => p.razorpayPaymentId === razorpayPaymentId && p.status === "paid"
  );
  if (existingByPaymentId) {
    console.log(
      `[PaymentDB] Idempotent hit: payment ${razorpayPaymentId} already marked paid.`
    );
    return { purchase: existingByPaymentId, isDuplicate: true };
  }

  // Look up by Razorpay order ID
  const recordIndex = records.findIndex(
    (p) => p.razorpayOrderId === razorpayOrderId
  );

  const now = new Date().toISOString();

  if (recordIndex !== -1) {
    const current = records[recordIndex];

    // If order was already paid
    if (current.status === "paid") {
      console.log(
        `[PaymentDB] Idempotent hit: order ${razorpayOrderId} already paid.`
      );
      return { purchase: current, isDuplicate: true };
    }

    current.razorpayPaymentId = razorpayPaymentId;
    current.razorpaySignature = razorpaySignature;
    current.status = "paid";
    current.updatedAt = now;
    if (userId && current.userId === "guest_dancer") {
      current.userId = userId;
    }
    if (amount) {
      current.amount = amount;
    }

    savePurchases(records);
    return { purchase: current, isDuplicate: false };
  }

  // If order was created outside this instance (e.g. direct webhook)
  const newRecord: PurchaseRecord = {
    id: `pur_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId: userId || "guest_dancer",
    courseId: courseId || "unknown_course",
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    amount: amount || 0,
    currency: "INR",
    status: "paid",
    createdAt: now,
    updatedAt: now,
  };

  records.push(newRecord);
  savePurchases(records);
  return { purchase: newRecord, isDuplicate: false };
}

/**
 * Look up purchase by Razorpay order ID
 */
export async function getPurchaseByOrderId(
  orderId: string
): Promise<PurchaseRecord | null> {
  const records = loadPurchases();
  return records.find((p) => p.razorpayOrderId === orderId) || null;
}

/**
 * Look up purchase by Razorpay payment ID
 */
export async function getPurchaseByPaymentId(
  paymentId: string
): Promise<PurchaseRecord | null> {
  const records = loadPurchases();
  return records.find((p) => p.razorpayPaymentId === paymentId) || null;
}

/**
 * Return all purchases for a specific user
 */
export async function getUserPurchases(
  userId: string
): Promise<PurchaseRecord[]> {
  if (!userId) return [];
  const records = loadPurchases();
  return records.filter(
    (p) => (p.userId === userId || p.userId === "guest_dancer") && p.status === "paid"
  );
}

/**
 * CRITICAL ACCESS CONTROL:
 * Reusable server-side function to check if a user has purchased a routine.
 *
 * Requirements:
 * - Returns true if the course is marked free
 * - Returns true if user has a verified purchase record for this courseId
 * - Returns true if user has an active all-access Studio Pass ("pass-monthly" or "pass-onetime")
 * - Otherwise returns false
 */
export async function hasPurchased(
  userId: string,
  courseId: string
): Promise<boolean> {
  if (!courseId) return false;

  // 1. Free starter routines
  if (FREE_ROUTINE_IDS.has(courseId)) {
    return true;
  }

  const records = loadPurchases();

  // 2. Check if user purchased the specific course/routine
  const hasSpecificCourse = records.some(
    (p) =>
      p.status === "paid" &&
      p.courseId === courseId &&
      (!userId || p.userId === userId || p.userId === "guest_dancer")
  );

  if (hasSpecificCourse) {
    return true;
  }

  // 3. Check if user has an all-access Studio Pass
  const hasAllAccessPass = records.some(
    (p) =>
      p.status === "paid" &&
      (p.courseId === "pass-monthly" || p.courseId === "pass-onetime") &&
      (!userId || p.userId === userId || p.userId === "guest_dancer")
  );

  return hasAllAccessPass;
}
