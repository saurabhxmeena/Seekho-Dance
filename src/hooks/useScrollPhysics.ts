"use client";

import { useEffect, useRef } from "react";

/**
 * useScrollPhysics
 *
 * Lightweight, jitter-free rubber-band overscroll hook.
 */
export function useScrollPhysics<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);

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

    const updatePhysics = () => {
      const diff = targetY - currentY;
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
        if (e.cancelable) {
          e.preventDefault();
        }

        isOverscrolling = true;
        const absD = Math.abs(deltaY);
        const maxLimit = 38;
        const resistance = (absD * 0.45) / (1 + (absD * 0.45) / maxLimit);

        targetY = pullingTop ? resistance : -resistance;
        startPhysics();
      } else {
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

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      el.style.transform = "";
    };
  }, []);

  return containerRef;
}
