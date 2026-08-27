"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HorizontalScrollTrackProps {
  children: React.ReactNode;
  className?: string;
  itemWidth?: number;
}

export function HorizontalScrollTrack({
  children,
  className,
}: HorizontalScrollTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/track">
      {/* Horizontal Two-Finger Trackpad Swipeable Container */}
      <div
        ref={containerRef}
        className={cn(
          "flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0",
          className
        )}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>

      {/* Floating Left/Right Nav Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scrollByAmount("left")}
          aria-label="Scroll left"
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-20"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scrollByAmount("right")}
          aria-label="Scroll right"
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-20"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
