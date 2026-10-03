"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

// Clean SVG Icons for Social Media
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" className={className}>
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
      href: "https://x.com/seekhoxdance",
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
    <footer className="border-t border-neutral-200/70 dark:border-white/[0.06] bg-neutral-50/70 dark:bg-[#0A0A0D] text-neutral-600 dark:text-[#8E8E98] text-xs pt-5 pb-2.5 sm:py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
        
        {/* Brand & Socials Section */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          
          {/* Brand Lockup (Exact match to Top Navbar) */}
          <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 group shrink-0 active:scale-95 transition-all">
            {/* Stylized Dynamic Emblem */}
            <div className="relative">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 dark:bg-neutral-900 border border-amber-200/60 dark:border-neutral-800 shadow-md ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-105 group-hover:-rotate-1 group-active:scale-95 transition-all duration-300 relative overflow-hidden flex items-center justify-center p-0.5">
                <Image
                  src="/logo.png"
                  alt="Seekho Dance Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover rounded-[13px] sm:rounded-[14px]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/15 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>

            {/* Brand Typography */}
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-[15px] sm:text-[17px] tracking-tight text-neutral-950 dark:text-white leading-none">
                Seekho
              </span>
              <span className="font-bold text-[15px] sm:text-[17px] tracking-tight bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent leading-none">
                Dance
              </span>
            </div>
          </Link>

          {/* Social Media Circular Buttons (Instagram, X, YouTube) */}
          <div className="flex items-center justify-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all duration-200 shadow-xs hover:shadow-md active:scale-90 ${social.hoverClass}`}
                >
                  <Icon />
                </a>
              );
            })}
          </div>

        </div>

        {/* Copyright Bar — Clean without divider line, centered */}
        <div className="pt-0.5 text-center text-[11px] text-neutral-500 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} Seekho Dance. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
