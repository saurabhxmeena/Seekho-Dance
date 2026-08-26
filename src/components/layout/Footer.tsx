import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-xl bg-neutral-950 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950 font-bold text-xs shadow-xs">
                SD
              </div>
              <span className="font-bold text-sm tracking-tight text-neutral-950 dark:text-white flex items-center gap-1">
                Seekho Dance
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 inline-block" />
              </span>
            </Link>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
              Designed for dancers and fans who discover choreography on YouTube and want to learn the exact steps at their own pace.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <ThemeToggle className="border border-neutral-200 dark:border-neutral-800" />
              <span className="text-[11px] text-neutral-400">Toggle dark / light mode</span>
            </div>
          </div>

          {/* Col 2: Dance Styles */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px] mb-3">
              Dance Styles
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/explore?style=Bollywood" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Bollywood Commercial
                </Link>
              </li>
              <li>
                <Link href="/explore?style=Afro" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Afro Fusion & Bacardi
                </Link>
              </li>
              <li>
                <Link href="/explore?style=K-Pop" className="hover:text-neutral-900 dark:hover:text-white transition">
                  K-Pop Choreography
                </Link>
              </li>
              <li>
                <Link href="/explore?style=Hip-Hop" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Urban Hip-Hop
                </Link>
              </li>
              <li>
                <Link href="/explore?style=South" className="hover:text-neutral-900 dark:hover:text-white transition">
                  South Indian Fusion
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Discovery */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px] mb-3">
              Discovery
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/explore?difficulty=Beginner" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Beginner Friendly (0-to-1)
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Trending Viral Songs
                </Link>
              </li>
              <li>
                <Link href="/explore?difficulty=Advanced" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Advanced Masterclasses
                </Link>
              </li>
              <li>
                <Link href="/styles" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Style Taxonomy
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-neutral-900 dark:hover:text-white transition">
                  Studio Pricing & Membership
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-neutral-900 dark:hover:text-white transition">
                  My Profile & Learning Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: The Loop */}
          <div className="space-y-3">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px]">
              How it works
            </h4>
            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-mono text-[10px] text-orange-600 font-semibold">01</span>
                <span>Hear a song on YouTube / Reels</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-[10px] text-orange-600 font-semibold">02</span>
                <span>Search the exact track on Seekho</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-[10px] text-orange-600 font-semibold">03</span>
                <span>Learn step-by-step with mirror & loop</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} Seekho Dance. Find the dance. Learn the dance.</p>
          <div className="flex items-center gap-4">
            <span>Mirror Mode • Speed Control • 8-Count Loops</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
