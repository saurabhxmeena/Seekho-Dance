"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Tag, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navTabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Style", href: "/styles", icon: Layers },
    { name: "Pricing", href: "/pricing", icon: Tag },
    { name: "Profile", href: "/profile", icon: User },
  ];

  // Active tab index for mathematically precise morphing glass lens
  const getActiveIndex = () => {
    if (pathname === "/") return 0;
    if (pathname.startsWith("/styles")) return 1;
    if (pathname.startsWith("/pricing")) return 2;
    if (pathname.startsWith("/profile")) return 3;
    return -1;
  };

  const activeIndex = getActiveIndex();

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
              className="absolute inset-y-0 w-1/4 pointer-events-none transition-transform duration-280 ease-[cubic-bezier(0.25,1,0.35,1)] flex items-center justify-center p-0.5"
              style={{
                transform: `translateX(${activeIndex * 100}%)`,
                left: 0,
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
