import { CoursePricing } from "@/types/payment";
import { DANCE_ROUTINES } from "@/data/dances";

// Server-side source of truth for pricing
// Prices are stored in paise (1 INR = 100 paise) for Razorpay compliance
export const PRICING_CATALOG: Record<string, CoursePricing> = {
  // Memberships / Passes
  "pass-monthly": {
    id: "pass-monthly",
    title: "Seekho Studio Monthly Pass",
    amountPaise: 49900,
    displayPrice: 499,
    currency: "INR",
    type: "membership",
    description: "Continuous unlimited access to all 100+ dance choreographies.",
  },
  "pass-onetime": {
    id: "pass-onetime",
    title: "Seekho Studio 1-Month Pass",
    amountPaise: 79900,
    displayPrice: 799,
    currency: "INR",
    type: "membership",
    description: "30 days of full, unlimited studio access. Single payment, never auto-renews.",
  },

  // Flagship Programs — ₹999 standalone purchase
  "course-zero": {
    id: "course-zero",
    title: "Dance From Zero",
    amountPaise: 99900,
    displayPrice: 999,
    currency: "INR",
    type: "course",
    description: "Your first step into the world of dance. Built for absolute beginners to develop rhythm, body coordination, confidence, and complete routines.",
  },
  "course-creator": {
    id: "course-creator",
    title: "Create Your Dance Channel",
    amountPaise: 99900,
    displayPrice: 999,
    currency: "INR",
    type: "course",
    description: "Turn your passion for dance into a creator journey. Master filming, video editing, YouTube strategy, audience building, and ethical monetization.",
  },

  // Individual Dance Style Courses — ₹999 standalone purchase
  "course-bollywood": {
    id: "course-bollywood",
    title: "Bollywood Dance Course",
    amountPaise: 99900,
    displayPrice: 999,
    currency: "INR",
    type: "course",
    description: "Full Bollywood dance curriculum: iconic cinematic hooksteps, expressive moves, and trending choreographies from Bollywood blockbusters.",
  },
  "course-traditional": {
    id: "course-traditional",
    title: "Traditional Dance Course",
    amountPaise: 99900,
    displayPrice: 999,
    currency: "INR",
    type: "course",
    description: "Classical mudras, cultural folk routines, and timeless heritage dances with authentic footwork patterns and storytelling.",
  },
  "course-rajasthani": {
    id: "course-rajasthani",
    title: "Rajasthani Dance Course",
    amountPaise: 99900,
    displayPrice: 999,
    currency: "INR",
    type: "course",
    description: "Ghoomar, Kalbeliya, and royal folk beats — graceful twirls, rhythmic hand claps, and energetic folk steps.",
  },
  "course-haryanvi": {
    id: "course-haryanvi",
    title: "Haryanvi Dance Course",
    amountPaise: 99900,
    displayPrice: 999,
    currency: "INR",
    type: "course",
    description: "High-energy beats, thumkas, and folk swagger — upbeat desi rhythms and dynamic shoulder accents.",
  },
  "course-wedding": {
    id: "course-wedding",
    title: "Wedding & Sangeet Dance Course",
    amountPaise: 99900,
    displayPrice: 999,
    currency: "INR",
    type: "course",
    description: "Sangeet, baraat, and celebration group routines — crowd-pleasing combinations and couple routines for weddings.",
  },
  "course-punjabi": {
    id: "course-punjabi",
    title: "Punjabi & Bhangra Dance Course",
    amountPaise: 99900,
    displayPrice: 999,
    currency: "INR",
    type: "course",
    description: "High-voltage dhol beats, energetic hops, and festive swagger — infectious Punjabi folk rhythms and dynamic shoulder bounces.",
  },
};


// Base price for individual paid routines (₹299)
export const DEFAULT_ROUTINE_PRICE_PAISE = 29900;
export const DEFAULT_ROUTINE_DISPLAY_PRICE = 299;

// Free starter routines (accessible without purchase)
export const FREE_ROUTINE_IDS = new Set<string>([
  "chaleya", // Free starter sample
]);

/**
 * Server-side lookup to determine real price for any course, choreography, or membership.
 * Never trust prices sent by the client browser!
 */
export function getProductPricing(productId: string): CoursePricing | null {
  if (!productId) return null;

  // Check direct match in catalog (e.g. membership passes)
  if (PRICING_CATALOG[productId]) {
    return PRICING_CATALOG[productId];
  }

  // Check if it's a routine in DANCE_ROUTINES
  const routine = DANCE_ROUTINES.find(
    (r) => r.id === productId || r.slug === productId
  );

  if (routine) {
    const isFree = FREE_ROUTINE_IDS.has(routine.id) || FREE_ROUTINE_IDS.has(routine.slug);

    return {
      id: routine.id,
      title: `${routine.title} Choreography Breakdown`,
      amountPaise: isFree ? 0 : DEFAULT_ROUTINE_PRICE_PAISE,
      displayPrice: isFree ? 0 : DEFAULT_ROUTINE_DISPLAY_PRICE,
      currency: "INR",
      isFree,
      type: "routine",
      description: `Full access to step-by-step breakdown, 0.5x tempo, and mirror mode for ${routine.title}.`,
    };
  }

  return null;
}
