"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, User } from "lucide-react";
import { SearchModal } from "@/components/search/SearchModal";
import { AccountModal } from "@/components/account/AccountModal";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const tabs: Array<{
    name: string;
    href?: string;
    icon: typeof Home;
    isAction?: boolean;
    onClick?: () => void;
  }> = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Search", onClick: () => setIsSearchOpen(true), icon: Search, isAction: true },
    { name: "Account", onClick: () => setIsAccountOpen(true), icon: User, isAction: true },
  ];

  return (
    <>
      {/* Fixed bottom navigation for smartphones with transparent frosted-glass effect */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAFAF8]/60 dark:bg-[#0a0a0a]/60 backdrop-blur-xl border-t border-neutral-200/50 dark:border-neutral-800/50 px-3 py-1.5 safe-area-bottom shadow-2xl transition-all">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = !tab.isAction && tab.href && (pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href)));

            if (tab.isAction) {
              const isAccountActive = tab.name === "Account" && isAccountOpen;
              return (
                <button
                  key={tab.name}
                  onClick={tab.onClick}
                  className={cn(
                    "flex flex-col items-center justify-center py-1 px-4 active:scale-95 transition",
                    isAccountActive
                      ? "text-orange-600 dark:text-orange-400 font-semibold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  )}
                  aria-label={tab.name}
                >
                  <Icon className={cn("w-5 h-5", isAccountActive && "stroke-[2.5px]")} />
                  <span className="text-[10px] font-medium mt-0.5">{tab.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={tab.name}
                href={tab.href || "/"}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-4 transition active:scale-95",
                  isActive
                    ? "text-orange-600 dark:text-orange-400 font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] font-medium mt-0.5">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* User Account / Profile Modal */}
      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
    </>
  );
}
