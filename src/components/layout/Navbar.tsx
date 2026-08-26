"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Compass, Layers, BookOpen, User } from "lucide-react";
import { SearchModal } from "@/components/search/SearchModal";
import { AccountModal } from "@/components/account/AccountModal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Dance Styles", href: "/styles", icon: Layers },
    { name: "Beginner Picks", href: "/explore?difficulty=Beginner", icon: BookOpen },
    { name: "Pricing", href: "/pricing", icon: BookOpen },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled
            ? "bg-[#FAFAF8]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800/60 shadow-xs"
            : "bg-[#FAFAF8]/40 dark:bg-[#0a0a0a]/40 backdrop-blur-xs border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-neutral-950 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950 font-bold text-xs tracking-tighter transition-transform group-hover:scale-95 shrink-0">
                SD
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-base tracking-tight text-neutral-950 dark:text-white flex items-center gap-1">
                  Seekho Dance
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 inline-block" />
                </span>
                <span className="text-[10px] text-neutral-400 font-medium tracking-wide uppercase -mt-0.5">
                  Learn Viral Choreographies
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      isActive
                        ? "text-neutral-950 dark:text-white bg-neutral-200/60 dark:bg-neutral-800/80 font-semibold"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Search Bar & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 transition-all w-32 sm:w-52 justify-between group shadow-2xs backdrop-blur-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors" />
                <span className="truncate">Search song...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-neutral-400 bg-white/80 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle className="shrink-0" />

            {/* User Profile / Account Button */}
            <button
              onClick={() => setIsAccountOpen(true)}
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative flex items-center justify-center shrink-0"
              title="Account & Profile"
              aria-label="User Account"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Direct CTA Button */}
            <Link
              href="/explore"
              className="hidden sm:inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-xs"
            >
              Library
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    <Icon className="w-4 h-4 text-neutral-400" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {/* User Account Link in Mobile Drawer */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAccountOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-left"
              >
                <User className="w-4 h-4 text-neutral-400" />
                <span>My Account & Profile</span>
              </button>
            </div>

            {/* Theme Toggle in Mobile Drawer */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <ThemeToggle variant="full" />
            </div>

            <div className="pt-1">
              <Link
                href="/dance/tauba-tauba"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-orange-600 rounded-lg shadow-sm"
              >
                Start Tutorial: Tauba Tauba
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* User Account / Profile Modal */}
      <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
    </>
  );
}
