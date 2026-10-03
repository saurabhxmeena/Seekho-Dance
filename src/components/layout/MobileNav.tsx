"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navTabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Courses", href: "/styles", icon: GraduationCap },
    { name: "Profile", href: "/profile", icon: User },
  ];

  // Active tab index for mathematically precise morphing glass lens (strictly 4 items)
  const getActiveIndex = () => {
    if (pathname === "/") return 0;
    if (pathname.startsWith("/search") || (pathname.startsWith("/styles/") && pathname !== "/styles")) return 1;
    if (pathname.startsWith("/styles")) return 2;
    if (pathname.startsWith("/profile")) return 3;
    return -1;
  };

  const activeIndex = getActiveIndex();

  // Track whether the lens has been shown at least once to avoid animating on mount
  const isFirstRender = useRef(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      // Defer enabling animation until after first paint so the
      // lens renders in the correct initial position instantly.
      const id = requestAnimationFrame(() => {
        setShouldAnimate(true);
        isFirstRender.current = false;
      });
      return () => cancelAnimationFrame(id);
    }
  }, []);

  return (
    <div className="sm:hidden fixed bottom-[calc(0.85rem+env(safe-area-inset-bottom,0px))] inset-x-0 z-50 pointer-events-none flex justify-center px-4">
      <nav
        aria-label="Mobile Bottom Navigation"
        className="pointer-events-auto relative w-[280px] h-[50px] rounded-full p-1 liquid-glass-dock select-none flex items-center justify-center"
      >
        {/* Strict 4-Column Equal-Width Grid (272px total: 4 x 68px equal slots) */}
        <div className="relative w-full h-full grid grid-cols-4">
          {/* Apple Liquid Glass Morphing Active Lens - Bound strictly to 25% column slot */}
          {activeIndex >= 0 && (
            <div
              aria-hidden="true"
              className="absolute inset-y-0 w-1/4 pointer-events-none flex items-center justify-center p-0.5"
              style={{
                transform: `translateX(${activeIndex * 100}%)`,
                left: 0,
                // GPU-composited transition using transform only.
                // On first render no transition so the lens snaps to the
                // correct position without sliding in from the left.
                transition: shouldAnimate
                  ? "transform 280ms cubic-bezier(0.25, 1, 0.35, 1)"
                  : "none",
                willChange: "transform",
              }}
            >
              <div className="w-full h-full rounded-full liquid-glass-lens" />
            </div>
          )}

          {/* 4 Identical Navigation Destination Tabs */}
          {navTabs.map((tab, idx) => {
            const isActive = activeIndex === idx;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="relative z-10 flex flex-col items-center justify-center w-full h-full rounded-full touch-manipulation group active:scale-95 transition-transform duration-100"
              >
                {/* Standardized 20x20 Icon Box for optically identical icon centering */}
                <div className="flex items-center justify-center w-[20px] h-[20px]">
                  <Icon
                    className={cn(
                      "w-[17px] h-[17px] transition-colors duration-300",
                      isActive
                        ? "text-orange-500 stroke-[2.1px]"
                        : "text-neutral-700 dark:text-neutral-300 stroke-[1.75px] group-hover:text-neutral-950 dark:group-hover:text-white"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[9.5px] tracking-tight leading-none mt-1 transition-colors duration-300 select-none",
                    isActive
                      ? "font-semibold text-orange-500"
                      : "font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-950 dark:group-hover:text-white"
                  )}
                >
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
