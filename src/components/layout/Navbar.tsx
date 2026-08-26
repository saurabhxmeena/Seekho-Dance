"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Compass, Layers, BookOpen, User, Sparkles, Tag } from "lucide-react";
import { SearchModal } from "@/components/search/SearchModal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getUserProfile } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userName, setUserName] = useState("Seekho Dancer");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Load profile name for avatar
    const profile = getUserProfile();
    if (profile?.name) setUserName(profile.name);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Dance Styles", href: "/styles", icon: Layers },
    { name: "Beginner Picks", href: "/explore?difficulty=Beginner", icon: BookOpen },
    { name: "Pricing", href: "/pricing", icon: Tag },
  ];

  const userInitials = (userName.slice(0, 2) || "SD").toUpperCase();

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled
            ? "bg-[#FAFAF8]/75 dark:bg-[#0a0a0a]/75 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-xs"
            : "bg-[#FAFAF8]/40 dark:bg-[#0a0a0a]/40 backdrop-blur-xs border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* 1. Left: Brand & Nav Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* High-Craft Brand Logo Lockup */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              {/* Stylized Dynamic Emblem */}
              <div className="relative">
                <div className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold text-sm tracking-tighter shadow-md ring-1 ring-black/10 dark:ring-white/20 group-hover:scale-105 group-hover:-rotate-2 group-active:scale-95 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 font-mono tracking-tight font-extrabold text-[13px] sm:text-sm">
                    SD
                  </span>
                </div>
                {/* Live Activity Pulsing Orb */}
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-600 border border-white dark:border-[#0a0a0a]" />
                </span>
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-[17px] tracking-tight text-neutral-950 dark:text-white leading-none">
                    Seekho
                  </span>
                  <span className="font-bold text-base sm:text-[17px] tracking-tight bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent leading-none">
                    Dance
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500 font-medium mt-0.5">
                  Viral Choreography Studio
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
                      isActive
                        ? "text-neutral-950 dark:text-white bg-neutral-200/70 dark:bg-neutral-800/80 font-semibold shadow-2xs"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 2. Right: Search, Theme, Profile & Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 transition-all w-32 sm:w-56 justify-between group shadow-2xs backdrop-blur-xs active:scale-98"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors shrink-0" />
                <span className="truncate">Search song, style...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle className="shrink-0" />

            {/* Profile Avatar Pill Button */}
            <Link
              href="/profile"
              className={cn(
                "flex items-center gap-2 p-1 pl-1 pr-2.5 sm:pr-3 rounded-full border transition-all duration-200 group shadow-2xs backdrop-blur-xs active:scale-95 shrink-0",
                pathname === "/profile"
                  ? "bg-orange-50 dark:bg-orange-950/40 border-orange-500/40 dark:border-orange-500/40"
                  : "bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-neutral-200/80 dark:border-neutral-800"
              )}
              title="My Profile & Progress"
              aria-label="User Profile"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 text-white flex items-center justify-center font-bold text-[11px] shadow-xs ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-105 transition-transform">
                {userInitials}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
                Profile
              </span>
            </Link>

            {/* Mobile Navigation Drawer Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-xl">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition",
                      isActive
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    )}
                  >
                    <Icon className="w-4 h-4 text-neutral-400" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {/* Profile Link in Drawer */}
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition",
                  pathname === "/profile"
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                )}
              >
                <User className="w-4 h-4 text-neutral-400" />
                <span>My Profile & Progress</span>
              </Link>
            </div>

            {/* Theme Switcher in Drawer */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <ThemeToggle variant="full" />
            </div>

            {/* Direct Studio CTA */}
            <div className="pt-1">
              <Link
                href="/dance/tauba-tauba"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-sm transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Featured Routine: Tauba Tauba</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
