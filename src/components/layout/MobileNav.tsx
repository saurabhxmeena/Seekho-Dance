"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, User } from "lucide-react";
import { SearchModal } from "@/components/search/SearchModal";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Library", href: "/explore", icon: Compass },
    { name: "Search", onClick: () => setIsSearchOpen(true), icon: Search, isAction: true },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Smartphone Bottom Navigation Bar (Apple-Style Frosted Glass) */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white/85 dark:bg-[#0a0a0a]/85 backdrop-blur-2xl border-t border-neutral-200/60 dark:border-neutral-800/60 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),10px)] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-none transition-all">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              !tab.isAction &&
              tab.href &&
              (pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href)));

            if (tab.isAction) {
              return (
                <button
                  key={tab.name}
                  onClick={tab.onClick}
                  className="flex-1 flex flex-col items-center justify-center py-1 px-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-transform active:scale-90"
                  aria-label={tab.name}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium tracking-tight mt-0.5">{tab.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={tab.name}
                href={tab.href || "/"}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-1 px-2 transition-all duration-200 active:scale-90 relative",
                  isActive
                    ? "text-orange-600 dark:text-orange-400 font-bold"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                <div className="relative">
                  <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110 stroke-[2.4px]")} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-600 dark:bg-orange-400" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
