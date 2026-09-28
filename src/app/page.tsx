"use client";

import React from "react";
import Link from "next/link";
import { Flame, Sparkles, ArrowRight } from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { DanceCard } from "@/components/discovery/DanceCard";
import { FeaturedHeroCarousel } from "@/components/home/FeaturedHeroCarousel";
import { HorizontalScrollTrack } from "@/components/discovery/HorizontalScrollTrack";

export default function HomePage() {
  const featuredRoutines = DANCE_ROUTINES.filter((d) => d.isFeatured || d.isTrending).slice(0, 5);
  const trendingRoutines = DANCE_ROUTINES.filter((d) => d.isTrending);
  const beginnerPicks = DANCE_ROUTINES.filter((d) => d.isBeginnerPick || d.difficulty === "Beginner");
  const celebrationRoutines = DANCE_ROUTINES.filter(
    (d) =>
      d.style.toLowerCase().includes("wedding") ||
      d.style.toLowerCase().includes("punjabi")
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0D0D11] text-neutral-900 dark:text-[#EDEDF0]">
      
      {/* 1. HERO SPOTLIGHT CAROUSEL */}
      <FeaturedHeroCarousel routines={featuredRoutines} />

      {/* 2. TRENDING CHOREOGRAPHIES RAIL (2 cards visible on mobile) */}
      <section className="px-3.5 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-10 sm:pb-20">
        <div className="flex items-end justify-between gap-3 mb-3.5 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-0.5">
              <Flame className="w-3.5 h-3.5" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-[#EDEDF0]">
              Trending Choreographies
            </h2>
            <p className="text-xs text-neutral-500 dark:text-[#9494A0] mt-0.5">
              Viral songs dancers are practicing this week
            </p>
          </div>

          <Link
            href="/explore"
            className="text-xs font-semibold text-neutral-600 dark:text-[#9E9EA8] hover:text-orange-600 dark:hover:text-orange-400 inline-flex items-center gap-1 transition shrink-0 py-1"
          >
            <span>Explore all</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <HorizontalScrollTrack className="gap-2.5 sm:gap-4">
          {trendingRoutines.map((routine) => (
            <div
              key={routine.id}
              className="w-[calc(50vw-22px)] min-w-[145px] max-w-[210px] sm:w-[240px] shrink-0 snap-start"
            >
              <DanceCard routine={routine} />
            </div>
          ))}
        </HorizontalScrollTrack>
      </section>

      {/* 3. BEGINNER ESSENTIALS RAIL (2 cards visible on mobile) */}
      <section className="px-3.5 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-10 sm:pb-20">
        <div className="p-4 sm:p-8 rounded-3xl bg-neutral-100/80 dark:bg-[#16161B] border border-neutral-200/70 dark:border-white/[0.08] space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-0.5 max-w-xl">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 inline-block mb-1">
                Zero to One
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-[#EDEDF0]">
                Beginner Friendly
              </h2>
              <p className="text-xs text-neutral-600 dark:text-[#9494A0]">
                Zero prior experience needed • Gentle footwork and step-by-step weight shifts
              </p>
            </div>

            <Link
              href="/explore?difficulty=Beginner"
              className="text-xs font-semibold text-neutral-600 dark:text-[#9E9EA8] hover:text-orange-600 dark:hover:text-orange-400 inline-flex items-center gap-1 transition shrink-0 self-start sm:self-auto py-1"
            >
              <span>All Beginner</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <HorizontalScrollTrack className="gap-2.5 sm:gap-4">
            {beginnerPicks.map((routine) => (
              <div
                key={routine.id}
                className="w-[calc(50vw-30px)] min-w-[145px] max-w-[210px] sm:w-[240px] shrink-0 snap-start"
              >
                <DanceCard routine={routine} />
              </div>
            ))}
          </HorizontalScrollTrack>
        </div>
      </section>

      {/* 4. CELEBRATION & SANGEET RAIL (2 cards visible on mobile) */}
      {celebrationRoutines.length > 0 && (
        <section className="px-3.5 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-10 sm:pb-20">
          <div className="flex items-end justify-between gap-3 mb-3.5 sm:mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Celebration Ready</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-[#EDEDF0]">
                Wedding & Sangeet Hits
              </h2>
              <p className="text-xs text-neutral-500 dark:text-[#9494A0] mt-0.5">
                High-energy group combinations and crowd favourites
              </p>
            </div>

            <Link
              href="/explore?style=Wedding"
              className="text-xs font-semibold text-neutral-600 dark:text-[#9E9EA8] hover:text-orange-600 dark:hover:text-orange-400 inline-flex items-center gap-1 transition shrink-0 py-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <HorizontalScrollTrack className="gap-2.5 sm:gap-4">
            {celebrationRoutines.map((routine) => (
              <div
                key={routine.id}
                className="w-[calc(50vw-22px)] min-w-[145px] max-w-[210px] sm:w-[240px] shrink-0 snap-start"
              >
                <DanceCard routine={routine} />
              </div>
            ))}
          </HorizontalScrollTrack>
        </section>
      )}
    </div>
  );
}
