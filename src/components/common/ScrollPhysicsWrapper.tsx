"use client";

import React, { useEffect, useRef } from "react";

/**
 * ScrollPhysicsWrapper
 *
 * Ultra-smooth, native-grade rubber-band overscroll physics:
 * 1. Zero jump/snap: touchStartY continuously tracks finger while inside normal scroll bounds,
 *    ensuring overscroll delta always begins at exactly 0px.
 * 2. Zero browser-fighting: uses { passive: false } to cancel conflicting native browser overscroll
 *    ONLY when at boundaries, eliminating all jitter and double-bouncing.
 * 3. 100% native normal scroll: completely untethered when within page bounds.
 * 4. Continuous RAF Lerp interpolation: smooth 60fps/120fps low-pass filtered spring.
 * 5. Respects prefers-reduced-motion.
 */
export function ScrollPhysicsWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let targetY = 0;
    let currentY = 0;
    let rafId: number | null = null;
    let touchStartY = 0;
    let isOverscrolling = false;

    const isAtTop = () => window.scrollY <= 0.5;
    const isAtBottom = () => {
      const scrollPos = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      return scrollPos >= docHeight - 2;
    };

    // 120Hz/60Hz continuous RAF physics loop
    const updatePhysics = () => {
      const diff = targetY - currentY;
      // Exponential smoothing factor: 0.18 provides snappy, organic, jitter-free response
      currentY += diff * 0.18;

      if (Math.abs(diff) > 0.05 || Math.abs(currentY) > 0.05) {
        el.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0)`;
        rafId = requestAnimationFrame(updatePhysics);
      } else {
        currentY = 0;
        targetY = 0;
        el.style.transform = "";
        rafId = null;
      }
    };

    const startPhysics = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updatePhysics);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      isOverscrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const currentTouchY = e.touches[0].clientY;
      const deltaY = currentTouchY - touchStartY;

      const pullingTop = isAtTop() && deltaY > 0;
      const pullingBottom = isAtBottom() && deltaY < 0;

      if (pullingTop || pullingBottom) {
        // Cancel browser native overscroll to eliminate thread fighting and jitter
        if (e.cancelable) {
          e.preventDefault();
        }

        isOverscrolling = true;

        // Apple logarithmic rubberband resistance curve
        const absD = Math.abs(deltaY);
        const maxLimit = 38; // subtle, non-exaggerated premium boundary
        const resistance = (absD * 0.45) / (1 + (absD * 0.45) / maxLimit);

        targetY = pullingTop ? resistance : -resistance;
        startPhysics();
      } else {
        // While within normal scroll range, continuously anchor touchStartY
        // so that if an edge is reached, delta starts seamlessly at 0px!
        touchStartY = currentTouchY;
        if (isOverscrolling) {
          isOverscrolling = false;
          targetY = 0;
          startPhysics();
        }
      }
    };

    const handleTouchEnd = () => {
      isOverscrolling = false;
      targetY = 0;
      startPhysics();
    };

    // Trackpad / Mouse wheel overscroll
    let wheelDebounce: ReturnType<typeof setTimeout> | null = null;
    const handleWheel = (e: WheelEvent) => {
      const overscrollUp = isAtTop() && e.deltaY < -1;
      const overscrollDown = isAtBottom() && e.deltaY > 1;

      if (overscrollUp || overscrollDown) {
        if (e.cancelable) {
          e.preventDefault();
        }

        const sign = overscrollUp ? 1 : -1;
        const add = Math.min(5, Math.abs(e.deltaY) * 0.12);
        targetY = Math.max(-26, Math.min(26, targetY + sign * add));
        startPhysics();

        if (wheelDebounce) clearTimeout(wheelDebounce);
        wheelDebounce = setTimeout(() => {
          targetY = 0;
          startPhysics();
        }, 70);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (wheelDebounce) clearTimeout(wheelDebounce);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("wheel", handleWheel);
      el.style.transform = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col w-full will-change-transform [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
    >
      {children}
    </div>
  );
}
