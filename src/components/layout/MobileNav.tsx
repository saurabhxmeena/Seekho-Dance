"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Layers, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  // Navigation tabs matching top bar exactly
  const navTabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Library", href: "/explore", icon: Compass },
    { name: "Styles", href: "/styles", icon: Layers },
    { name: "Pricing", href: "/pricing", icon: Tag },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-[#FAFAF8]/85 dark:bg-[#0a0a0a]/85 backdrop-blur-xl border-t border-neutral-200/60 dark:border-neutral-800/60 px-3 pt-1.5 pb-[max(env(safe-area-inset-bottom,0px),8px)] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] transition-all">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navTabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));

          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-150 active:scale-95 touch-manipulation relative",
                isActive
                  ? "text-neutral-950 dark:text-white"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-150",
                    isActive
                      ? "text-neutral-950 dark:text-white scale-105 stroke-[2.3px]"
                      : "text-neutral-500 dark:text-neutral-400"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] tracking-tight mt-0.5",
                  isActive ? "font-bold text-neutral-950 dark:text-white" : "font-medium"
                )}
              >
                {tab.name}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-orange-600 dark:bg-orange-400 mt-0.5 shadow-xs" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
