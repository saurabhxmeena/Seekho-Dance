/**
 * Access Control Service Abstraction
 * 
 * Manages video / choreography access checking and permission verification.
 * 
 * ARCHITECTURE FOR FUTURE SUPABASE INTEGRATION:
 * When connecting Supabase Database:
 * - Replace `checkAccess` with a query to Supabase:
 *   e.g. `supabase.from('user_entitlements').select('*').eq('user_id', userId)...`
 * - Replace `grantAccess` with an insert to Supabase:
 *   e.g. `supabase.from('user_purchases').insert(...)`
 * 
 * The UI and video player interact ONLY with this accessService abstraction.
 */

import { FREE_ROUTINE_IDS, getProductPricing } from "@/data/pricing";
import { DANCE_ROUTINES } from "@/data/dances";

export interface AccessCheckResult {
  hasAccess: boolean;
  isFree: boolean;
  price: number;
  currency: string;
  title: string;
  reason: "free" | "studio_pass" | "purchased_routine" | "unauthorized";
}

export interface UserAccessProfile {
  userId: string;
  plan: "Free Explorer" | "Studio Pass";
  purchasedRoutineIds: string[];
  expiresAt?: string | null;
}

const ACCESS_STORAGE_PREFIX = "seekho_access_";
const ACCESS_EVENT_NAME = "seekho_access_changed";

class AccessService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key?.startsWith(ACCESS_STORAGE_PREFIX)) {
          this.notifyListeners();
        }
      });
    }
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error("[AccessService] Error in access listener:", err);
      }
    });
  }

  /**
   * Get user purchases & plan from storage
   */
  public getUserAccess(userId: string | null): UserAccessProfile {
    if (!userId || typeof window === "undefined") {
      return {
        userId: userId || "guest",
        plan: "Free Explorer",
        purchasedRoutineIds: [],
        expiresAt: null,
      };
    }

    try {
      const key = `${ACCESS_STORAGE_PREFIX}${userId}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }

      // Check legacy storage if any
      const legacyProfile = localStorage.getItem("seekho_profile");
      if (legacyProfile) {
        const parsed = JSON.parse(legacyProfile);
        if (parsed.plan === "Studio Pass") {
          return {
            userId,
            plan: "Studio Pass",
            purchasedRoutineIds: [],
            expiresAt: null,
          };
        }
      }
    } catch (e) {
      console.error("[AccessService] Failed to load user access:", e);
    }

    return {
      userId,
      plan: "Free Explorer",
      purchasedRoutineIds: [],
      expiresAt: null,
    };
  }

  /**
   * Check if a user has access to play a specific routine
   */
  public async checkAccess(userId: string | null, routineId: string): Promise<AccessCheckResult> {
    const pricing = getProductPricing(routineId);
    const routine = DANCE_ROUTINES.find((r) => r.id === routineId || r.slug === routineId);
    const isFree =
      FREE_ROUTINE_IDS.has(routineId) ||
      (routine && FREE_ROUTINE_IDS.has(routine.id)) ||
      Boolean(pricing?.isFree);

    // Free routines are accessible to everyone
    if (isFree) {
      return {
        hasAccess: true,
        isFree: true,
        price: 0,
        currency: "INR",
        title: pricing?.title || routine?.title || routineId,
        reason: "free",
      };
    }

    // If no user is logged in, protected routine requires auth
    if (!userId) {
      return {
        hasAccess: false,
        isFree: false,
        price: pricing?.displayPrice || 299,
        currency: "INR",
        title: pricing?.title || routine?.title || routineId,
        reason: "unauthorized",
      };
    }

    // Check user entitlements
    const userAccess = this.getUserAccess(userId);

    // 1. Unlimited Studio Pass
    if (userAccess.plan === "Studio Pass") {
      return {
        hasAccess: true,
        isFree: false,
        price: pricing?.displayPrice || 299,
        currency: "INR",
        title: pricing?.title || routine?.title || routineId,
        reason: "studio_pass",
      };
    }

    // 2. Individual routine purchase
    if (userAccess.purchasedRoutineIds.includes(routineId)) {
      return {
        hasAccess: true,
        isFree: false,
        price: pricing?.displayPrice || 299,
        currency: "INR",
        title: pricing?.title || routine?.title || routineId,
        reason: "purchased_routine",
      };
    }

    // 3. Fallback: Check backend verification route if needed
    try {
      const res = await fetch(
        `/api/payment/check-access?courseId=${encodeURIComponent(routineId)}&userId=${encodeURIComponent(userId)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.hasAccess) {
          // Sync locally
          this.grantAccess(userId, routineId);
          return {
            hasAccess: true,
            isFree: Boolean(data.isFree),
            price: data.price || 299,
            currency: data.currency || "INR",
            title: data.title || routine?.title || routineId,
            reason: "purchased_routine",
          };
        }
      }
    } catch {
      // Ignore network errors in local mode
    }

    // User is logged in but has not purchased this routine
    return {
      hasAccess: false,
      isFree: false,
      price: pricing?.displayPrice || 299,
      currency: "INR",
      title: pricing?.title || routine?.title || routineId,
      reason: "unauthorized",
    };
  }

  /**
   * Grant access to a user (used after payment confirmation)
   */
  public grantAccess(userId: string, productId: string): boolean {
    if (typeof window === "undefined" || !userId) return false;

    try {
      const key = `${ACCESS_STORAGE_PREFIX}${userId}`;
      const current = this.getUserAccess(userId);

      let updated: UserAccessProfile;
      if (productId === "pass-monthly" || productId === "pass-onetime" || productId === "studio-pass") {
        // Full membership pass
        updated = {
          ...current,
          plan: "Studio Pass",
        };
      } else {
        // Individual choreography unlock
        const routineIds = Array.from(new Set([...current.purchasedRoutineIds, productId]));
        updated = {
          ...current,
          purchasedRoutineIds: routineIds,
        };
      }

      localStorage.setItem(key, JSON.stringify(updated));

      // Also sync legacy storage profile for backward compatibility with existing profile page
      try {
        const legacy = localStorage.getItem("seekho_profile");
        const parsed = legacy ? JSON.parse(legacy) : {};
        if (updated.plan === "Studio Pass") {
          parsed.plan = "Studio Pass";
        }
        localStorage.setItem("seekho_profile", JSON.stringify(parsed));
      } catch {
        // Ignore fallback sync errors
      }

      this.notifyListeners();
      window.dispatchEvent(new CustomEvent(ACCESS_EVENT_NAME));
      return true;
    } catch (e) {
      console.error("[AccessService] Failed to grant access:", e);
      return false;
    }
  }

  /**
   * Reset / revoke access for testing development flows
   */
  public revokeAllAccess(userId: string) {
    if (typeof window === "undefined" || !userId) return;
    try {
      const key = `${ACCESS_STORAGE_PREFIX}${userId}`;
      localStorage.removeItem(key);

      const legacy = localStorage.getItem("seekho_profile");
      if (legacy) {
        const parsed = legacy ? JSON.parse(legacy) : {};
        parsed.plan = "Free Explorer";
        localStorage.setItem("seekho_profile", JSON.stringify(parsed));
      }

      this.notifyListeners();
      window.dispatchEvent(new CustomEvent(ACCESS_EVENT_NAME));
    } catch {
      // Ignore reset errors
    }
  }

  /**
   * Subscribe to access changes
   */
  public onAccessChange(callback: () => void): () => void {
    this.listeners.add(callback);

    const handleCustomEvent = () => callback();
    if (typeof window !== "undefined") {
      window.addEventListener(ACCESS_EVENT_NAME, handleCustomEvent);
    }

    return () => {
      this.listeners.delete(callback);
      if (typeof window !== "undefined") {
        window.removeEventListener(ACCESS_EVENT_NAME, handleCustomEvent);
      }
    };
  }
}

export const accessService = new AccessService();
