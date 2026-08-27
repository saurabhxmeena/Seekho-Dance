"use client";

import React from "react";
import Link from "next/link";
import {
  Play,
  Flame,
  ArrowRight,
} from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { DANCE_CATEGORIES } from "@/data/categories";
import { DanceCard } from "@/components/discovery/DanceCard";
import { Badge } from "@/components/ui/Badge";
import { PricingSection } from "@/components/pricing/PricingSection";
import { FeaturedHeroCarousel } from "@/components/home/FeaturedHeroCarousel";
import { HorizontalScrollTrack } from "@/components/discovery/HorizontalScrollTrack";

export default function HomePage() {
  const featuredRoutines = DANCE_ROUTINES.filter((d) => d.isFeatured || d.isTrending).slice(0, 5);
  const trendingRoutines = DANCE_ROUTINES.filter((d) => d.isTrending);
  const beginnerPicks = DANCE_ROUTINES.filter((d) => d.isBeginnerPick || d.difficulty === "Beginner");

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-50 transition-colors duration-200">
      
      {/* 1. HORIZONTAL SWIPEABLE FEATURED SPOTLIGHT CAROUSEL */}
      <FeaturedHeroCarousel routines={featuredRoutines} />

      {/* 4. TRENDING DANCES SECTION (Two-Finger Swipeable) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16 sm:pb-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
              <Flame className="w-4 h-4" />
              <span>Trending Choreographies</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Trending Now.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              The viral choreographies dancers are practicing this week.
            </p>
          </div>

          <Link
            href="/explore"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1 transition self-start sm:self-auto"
          >
            Explore all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <HorizontalScrollTrack>
          {trendingRoutines.map((routine) => (
            <div key={routine.id} className="w-[270px] sm:w-[290px] shrink-0 snap-start">
              <DanceCard routine={routine} />
            </div>
          ))}
        </HorizontalScrollTrack>
      </section>

      {/* 5. DANCE STYLES TAXONOMY */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16 sm:pb-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
              Dance Styles
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Pick Your Style.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Explore step-by-step choreographies across Bollywood, Traditional, Rajasthani, Haryanvi, and Wedding dance routines.
            </p>
          </div>

          <Link
            href="/styles"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1 transition self-start sm:self-auto"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DANCE_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/explore?style=${encodeURIComponent(category.name)}`}
              className="group relative rounded-3xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-end p-5 sm:p-6 hover:shadow-xl hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 active:scale-98"
            >
              {/* Background Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.coverImage}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Minimal Content */}
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {category.name}
                  </h3>
                  <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs text-neutral-300 line-clamp-1">
                  {category.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. BEGINNER-FRIENDLY SECTION (Two-Finger Swipeable) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16 sm:pb-24">
        <div className="p-7 sm:p-10 rounded-[32px] sm:rounded-[36px] bg-neutral-100 dark:bg-[#18181A] border border-neutral-200/80 dark:border-neutral-800 space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Zero to One
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Starting Out? Zero prior dance experience needed.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              These choreographies break down weight shifts, gentle footwork, and rhythm counts step-by-step so anyone can follow along.
            </p>
          </div>

          <HorizontalScrollTrack>
            {beginnerPicks.map((routine) => (
              <div key={routine.id} className="w-[270px] sm:w-[290px] shrink-0 snap-start">
                <DanceCard routine={routine} />
              </div>
            ))}
          </HorizontalScrollTrack>
        </div>
      </section>

      {/* 7. THE SEEKHO LOOP (HOW IT WORKS) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16 sm:pb-24">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            The Seekho Loop
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
            From YouTube to muscle memory.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            No complex signups or generic lectures. Find the exact song you saw online and learn it in 15 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18181A] border border-neutral-200/90 dark:border-neutral-800/90 space-y-3 shadow-2xs">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-orange-600">01</span>
            <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white tracking-tight">
              Discover on YouTube
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              You hear a catchy song and see a creator performing a viral routine you want to learn for yourself.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18181A] border border-neutral-200/90 dark:border-neutral-800/90 space-y-3 shadow-2xs">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-orange-600">02</span>
            <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white tracking-tight">
              Search Song on Seekho
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Type the song name into the search bar to jump straight to the verified step-by-step breakdown.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18181A] border border-neutral-200/90 dark:border-neutral-800/90 space-y-3 shadow-2xs">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-orange-600">03</span>
            <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white tracking-tight">
              Master Step-by-Step
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Flip to mirror mode, slow down to 0.5x speed, loop difficult 8-counts, and drill until you have it down.
            </p>
          </div>
        </div>
      </section>

      {/* 8. LUXURY STUDIO PRICING */}
      <div id="pricing" className="border-t border-neutral-200/80 dark:border-neutral-800/80">
        <PricingSection />
      </div>
    </div>
  );
}
