import crypto from "crypto";
import { getRazorpayKeySecret } from "./razorpay";

const COOKIE_NAME = "seekho_unlocked_courses";

/**
 * Creates a tamper-proof signed payload for an unlocked course or pass.
 * Format: courseId:timestamp:signature
 */
export function createSignedAccessPayload(courseId: string, userId: string = "user"): string {
  const secret = getRazorpayKeySecret() || "seekho_dance_fallback_signing_secret";
  const timestamp = Date.now().toString();
  const data = `${userId}:${courseId}:${timestamp}`;
  const hmac = crypto.createHmac("sha256", secret).update(data).digest("hex");
  return `${data}:${hmac}`;
}

/**
 * Verifies if a given signed access payload is valid for a course.
 */
export function verifySignedAccessPayload(
  payload: string,
  targetCourseId: string
): boolean {
  if (!payload || !targetCourseId) return false;

  const parts = payload.split(":");
  if (parts.length !== 4) return false;

  const [userId, courseId, timestamp, signature] = parts;

  // Check if course matches directly or is an all-access pass
  const isMatch = courseId === targetCourseId || courseId === "pass-monthly" || courseId === "pass-onetime";
  if (!isMatch) return false;

  const secret = getRazorpayKeySecret() || "seekho_dance_fallback_signing_secret";
  const expectedData = `${userId}:${courseId}:${timestamp}`;
  const expectedHmac = crypto.createHmac("sha256", secret).update(expectedData).digest("hex");

  try {
    const a = Buffer.from(expectedHmac, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
