import crypto from "crypto";
import { getProductPricing, DEFAULT_ROUTINE_PRICE_PAISE } from "../src/data/pricing";
import {
  createPurchaseRecord,
  recordSuccessfulPayment,
  hasPurchased,
  getUserPurchases,
} from "../src/lib/payment-db";
import {
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature,
} from "../src/lib/razorpay";
import { createSignedAccessPayload, verifySignedAccessPayload } from "../src/lib/access-token";

// Set environment test keys
process.env.RAZORPAY_KEY_ID = "rzp_test_mock_key_12345";
process.env.RAZORPAY_KEY_SECRET = "test_secret_key_mock_67890";
process.env.RAZORPAY_WEBHOOK_SECRET = "webhook_secret_mock_abcde";

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName} - ${detail || ""}`);
    failCount++;
  }
}

async function runTests() {
  console.log("=================================================");
  console.log("   SEEKHO DANCE RAZORPAY INTEGRATION TEST SUITE   ");
  console.log("=================================================\n");

  const testUserId = `test_dancer_${Date.now()}@seekhodance.com`;
  const testCourseId = "tauba-tauba";
  const unpaidCourseId = "water";

  // TEST 1: Server-Determined Pricing & Price Manipulation Protection
  console.log("[Test 1] Price Tampering Protection & Server Pricing Source of Truth");
  const product = getProductPricing(testCourseId);
  assert(
    product !== null && product.amountPaise === DEFAULT_ROUTINE_PRICE_PAISE,
    "Server determines authentic product price in paise",
    `Expected ${DEFAULT_ROUTINE_PRICE_PAISE}, got ${product?.amountPaise}`
  );
  assert(
    product?.displayPrice === 299,
    "Product display price is ₹299",
    `Expected 299, got ${product?.displayPrice}`
  );

  // Free starter routine pricing
  const freeRoutine = getProductPricing("chaleya");
  assert(
    freeRoutine?.isFree === true && freeRoutine.amountPaise === 0,
    "Starter routine 'chaleya' is recognized as free"
  );

  // TEST 2: User Access Check on Unpaid Choreography
  console.log("\n[Test 2] Access Control: Unpaid User Access Check");
  const initialAccess = await hasPurchased(testUserId, unpaidCourseId);
  assert(
    initialAccess === false,
    "Unpaid user is denied full access to locked choreography"
  );

  // Free routine access check
  const freeAccess = await hasPurchased(testUserId, "chaleya");
  assert(
    freeAccess === true,
    "Free starter choreography is accessible without payment"
  );

  // TEST 3: Cryptographic Signature Verification (HMAC-SHA256)
  console.log("\n[Test 3] Server Cryptographic Signature Verification");
  const orderId = `order_${Date.now()}`;
  const paymentId = `pay_${Date.now()}`;

  // Valid signature generation
  const validSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const isSignatureValid = verifyRazorpayPaymentSignature({
    orderId,
    paymentId,
    signature: validSignature,
  });
  assert(isSignatureValid === true, "Valid Razorpay payment signature verified");

  // Invalid / Tampered signature
  const isSignatureRejected = verifyRazorpayPaymentSignature({
    orderId,
    paymentId,
    signature: "tampered_fake_signature_abc123",
  });
  assert(
    isSignatureRejected === false,
    "Tampered / invalid signature is strictly rejected"
  );

  // TEST 4: Successful Payment Recording & Access Granting
  console.log("\n[Test 4] Successful Payment & Database Access Record");
  // 1. Initial order creation record
  await createPurchaseRecord({
    userId: testUserId,
    courseId: testCourseId,
    razorpayOrderId: orderId,
    amount: product!.amountPaise,
  });

  // 2. Verified payment record
  const { purchase, isDuplicate: firstTime } = await recordSuccessfulPayment({
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    razorpaySignature: validSignature,
    userId: testUserId,
    courseId: testCourseId,
    amount: product!.amountPaise,
  });

  assert(
    purchase.status === "paid" && firstTime === false,
    "Payment successfully recorded with status 'paid'"
  );

  // 3. Re-check hasPurchased access control
  const postPaymentAccess = await hasPurchased(testUserId, testCourseId);
  assert(
    postPaymentAccess === true,
    "User has verified access to choreography after server verification"
  );

  // TEST 5: Duplicate Payment Callback / Idempotency
  console.log("\n[Test 5] Duplicate Payment Verification Request (Idempotency)");
  const { purchase: dupPurchase, isDuplicate } = await recordSuccessfulPayment({
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    razorpaySignature: validSignature,
    userId: testUserId,
    courseId: testCourseId,
  });

  assert(isDuplicate === true, "Duplicate payment verification detected as duplicate");
  assert(
    dupPurchase.razorpayPaymentId === paymentId,
    "Idempotent response returns existing purchase record without duplicate creation"
  );

  // Check database purchases count for this order
  const userPurchases = await getUserPurchases(testUserId);
  const matchingPurchases = userPurchases.filter((p) => p.razorpayOrderId === orderId);
  assert(
    matchingPurchases.length === 1,
    "Unique constraint prevents duplicate purchase records for same order"
  );

  // TEST 6: Page Refresh & Tamper-Proof Signed Access Tokens
  console.log("\n[Test 6] Client Refresh & Tamper-Proof Signed Cookie Verification");
  const signedToken = createSignedAccessPayload(testCourseId, testUserId);
  const isTokenValid = verifySignedAccessPayload(signedToken, testCourseId);
  assert(isTokenValid === true, "Signed access cookie verified across serverless requests");

  const tamperedToken = signedToken.replace(testCourseId, "other-course");
  const isTamperedTokenRejected = verifySignedAccessPayload(tamperedToken, "other-course");
  assert(
    isTamperedTokenRejected === false,
    "Tampered client cookie is rejected by server crypto verification"
  );

  // TEST 7: Webhook Signature Verification & Idempotent Handling
  console.log("\n[Test 7] Webhook Handling & Webhook Replay Protection");
  const webhookOrderId = `order_wh_${Date.now()}`;
  const webhookPaymentId = `pay_wh_${Date.now()}`;
  const webhookPayload = JSON.stringify({
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: webhookPaymentId,
          order_id: webhookOrderId,
          amount: 29900,
          currency: "INR",
          notes: {
            courseId: "seven",
            userId: testUserId,
          },
        },
      },
    },
  });

  // Generate valid webhook signature
  const validWebhookSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(webhookPayload)
    .digest("hex");

  const isWebhookValid = verifyRazorpayWebhookSignature({
    rawBody: webhookPayload,
    signature: validWebhookSignature,
  });
  assert(isWebhookValid === true, "Valid webhook signature verified");

  const isFakeWebhookRejected = verifyRazorpayWebhookSignature({
    rawBody: webhookPayload,
    signature: "invalid_webhook_signature",
  });
  assert(isFakeWebhookRejected === false, "Invalid webhook signature rejected");

  // First webhook execution
  const whResult1 = await recordSuccessfulPayment({
    razorpayOrderId: webhookOrderId,
    razorpayPaymentId: webhookPaymentId,
    userId: testUserId,
    courseId: "seven",
    amount: 29900,
  });
  assert(whResult1.purchase.status === "paid", "Webhook processes payment and grants access");

  // Webhook replay / retry execution
  const whResult2 = await recordSuccessfulPayment({
    razorpayOrderId: webhookOrderId,
    razorpayPaymentId: webhookPaymentId,
    userId: testUserId,
    courseId: "seven",
    amount: 29900,
  });
  assert(whResult2.isDuplicate === true, "Webhook replay handled idempotently without error");

  // TEST 8: All-Access Membership Pass Grants Universal Access
  console.log("\n[Test 8] Studio Pass Universal Access Verification");
  const passOrderId = `order_pass_${Date.now()}`;
  const passPaymentId = `pay_pass_${Date.now()}`;
  await recordSuccessfulPayment({
    razorpayOrderId: passOrderId,
    razorpayPaymentId: passPaymentId,
    userId: testUserId,
    courseId: "pass-monthly",
    amount: 49900,
  });

  // Verify that an all-access pass unlocks any routine (e.g. "greedy")
  const greedyAccessWithPass = await hasPurchased(testUserId, "greedy");
  assert(
    greedyAccessWithPass === true,
    "Studio Pass (Monthly) grants access to all library routines"
  );

  console.log("\n=================================================");
  console.log(`TEST RESULTS: ${passCount} Passed, ${failCount} Failed`);
  console.log("=================================================\n");

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
