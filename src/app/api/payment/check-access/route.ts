import { NextResponse } from "next/server";
import { hasPurchased } from "@/lib/payment-db";
import { getProductPricing, FREE_ROUTINE_IDS } from "@/data/pricing";
import { verifySignedAccessPayload, COOKIE_NAME } from "@/lib/access-token";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const userId = searchParams.get("userId") || "dancer@seekhodance.com";

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId query parameter is required" },
        { status: 400 }
      );
    }

    const product = getProductPricing(courseId);
    const isFree = FREE_ROUTINE_IDS.has(courseId) || Boolean(product?.isFree);

    if (isFree) {
      return NextResponse.json({
        hasAccess: true,
        isFree: true,
        price: 0,
        currency: "INR",
        title: product?.title || courseId,
      });
    }

    // 1. Check server-side database
    const ownsInDb = await hasPurchased(userId, courseId);
    if (ownsInDb) {
      return NextResponse.json({
        hasAccess: true,
        isFree: false,
        price: product ? product.displayPrice : 299,
        currency: "INR",
        title: product?.title || courseId,
      });
    }

    // 2. Check signed cookie as secondary server-verified check
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get(`${COOKIE_NAME}_${courseId}`)?.value;
    if (cookieVal && verifySignedAccessPayload(cookieVal, courseId)) {
      return NextResponse.json({
        hasAccess: true,
        isFree: false,
        price: product ? product.displayPrice : 299,
        currency: "INR",
        title: product?.title || courseId,
      });
    }

    // 3. User does not have access yet
    return NextResponse.json({
      hasAccess: false,
      isFree: false,
      price: product ? product.displayPrice : 299,
      currency: "INR",
      title: product?.title || courseId,
    });
  } catch (error: any) {
    console.error("[Check Access Error]:", error);
    return NextResponse.json(
      { error: "Failed to check course access status" },
      { status: 500 }
    );
  }
}
