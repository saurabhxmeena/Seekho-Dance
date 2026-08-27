import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// Clean SVG Icons for Social Media
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function Footer() {
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com/seekhodance",
      icon: InstagramIcon,
      hoverClass: "hover:text-pink-500 hover:border-pink-500/40 dark:hover:border-pink-500/40",
    },
    {
      name: "X (Twitter)",
      href: "https://x.com/Seekho_Dance",
      icon: TwitterXIcon,
      hoverClass: "hover:text-sky-500 hover:border-sky-500/40 dark:hover:border-sky-500/40",
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@SeekhoDance",
      icon: YouTubeIcon,
      hoverClass: "hover:text-red-500 hover:border-red-500/40 dark:hover:border-red-500/40",
    },
  ];

  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 text-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        
        {/* Main Row: Brand & Clickable Social Media Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          
          {/* Brand Lockup */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xs group-hover:scale-105 transition-transform flex items-center justify-center bg-amber-50 dark:bg-neutral-900 p-0.5">
                <Image
                  src="/logo.png"
                  alt="Seekho Dance Logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-cover rounded-[7px]"
                />
              </div>
              <span className="font-bold text-sm tracking-tight text-neutral-950 dark:text-white flex items-center gap-1">
                Seekho Dance
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 inline-block" />
              </span>
            </Link>
            <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:inline">
              Learn viral choreographies from YouTube and Instagram step-by-step.
            </p>
          </div>

          {/* Clickable Social Media Links */}
          <div className="flex items-center gap-2.5">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 transition-all duration-200 shadow-2xs active:scale-95 ${social.hoverClass}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>

        </div>

        {/* Bottom Minimal Bar */}
        <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between gap-4 text-[11px] text-neutral-400 dark:text-neutral-500">
          <p>© {new Date().getFullYear()} Seekho Dance. All rights reserved.</p>
          <ThemeToggle className="scale-85" />
        </div>

      </div>
    </footer>
  );
}
