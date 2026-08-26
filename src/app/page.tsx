"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Play,
  Flame,
  ArrowRight,
} from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { DANCE_CATEGORIES } from "@/data/categories";
import { DanceCard } from "@/components/discovery/DanceCard";
import { Badge } from "@/components/ui/Badge";
import { PricingSection } from "@/components/pricing/PricingSection";

export default function HomePage() {
  const router = useRouter();
  const [heroSearch, setHeroSearch] = useState("");

  const featuredRoutine = DANCE_ROUTINES.find((d) => d.isFeatured) || DANCE_ROUTINES[0];
  const trendingRoutines = DANCE_ROUTINES.filter((d) => d.isTrending).slice(0, 4);
  const beginnerPicks = DANCE_ROUTINES.filter((d) => d.isBeginnerPick || d.difficulty === "Beginner").slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/explore?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-50 transition-colors duration-200">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-20 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl space-y-4 sm:space-y-6">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
            <span>The choreography behind the songs you love</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.1]">
            Hear a song on YouTube.
            <br />
            <span className="text-neutral-400 dark:text-neutral-500 font-medium">
              Learn the dance here.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Direct, step-by-step dance tutorials for viral songs. Practice with horizontal mirror mode, custom speed control, and 8-count loop drillers.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleHeroSearch} className="relative max-w-xl pt-1 sm:pt-2">
            <div className="relative flex items-center bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl shadow-sm focus-within:border-neutral-950 dark:focus-within:border-neutral-400 focus-within:shadow-md transition-all px-4 py-3 sm:py-3.5">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search any song, artist, or style..."
                className="w-full text-base sm:text-sm bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none"
              />
            </div>

            {/* Trending Quick Links (Smooth horizontal scroll on mobile) */}
            <div className="flex items-center gap-2 mt-3 text-xs text-neutral-500 overflow-x-auto scrollbar-none whitespace-nowrap pb-1">
              <span className="font-semibold text-neutral-500 dark:text-neutral-400 text-xs shrink-0">Trending:</span>
              <Link
                href="/dance/tauba-tauba"
                className="text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition shrink-0"
              >
                Tauba Tauba
              </Link>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <Link
                href="/dance/water"
                className="text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition shrink-0"
              >
                Water
              </Link>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <Link
                href="/dance/seven"
                className="text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition shrink-0"
              >
                Seven
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* 2. SPOTLIGHT ROUTINE HERO CARD */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-14 sm:pb-20">
        <div className="relative rounded-[28px] sm:rounded-3xl overflow-hidden bg-neutral-900 text-white border border-neutral-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 space-y-5 z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                    Featured Tutorial
                  </span>
                  <Badge difficulty={featuredRoutine.difficulty} variant="difficulty" className="bg-neutral-800 text-neutral-200 border-neutral-700" />
                </div>

                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                  {featuredRoutine.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400">
                  {featuredRoutine.artist}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3">
                {featuredRoutine.description}
              </p>

              {/* Creator & Metas */}
              <div className="flex items-center gap-3 pt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredRoutine.creatorAvatar}
                  alt={featuredRoutine.creator}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/40 shrink-0"
                />
                <div>
                  <div className="text-xs font-semibold text-white">
                    Choreographed by {featuredRoutine.creator}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {featuredRoutine.steps.length} Step Breakdown • {featuredRoutine.bpm} BPM
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <Link
                  href={`/dance/${featuredRoutine.id}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition shadow-lg shadow-orange-600/30 active:scale-95 text-center"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Step 01 (Foundation)</span>
                </Link>

                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition active:scale-95 text-center"
                >
                  Browse Library
                </Link>
              </div>
            </div>

            {/* Right Visual Video Image Banner */}
            <div className="lg:col-span-7 relative h-56 sm:h-96 lg:h-[420px] bg-neutral-950 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredRoutine.coverImage}
                alt={featuredRoutine.title}
                className="w-full h-full object-cover opacity-80 hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-900 via-neutral-900/40 to-transparent" />

              {/* Floating Studio Features Pill */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-2 bg-black/75 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-white/10 text-[10px] sm:text-[11px] text-neutral-300 shadow-md">
                <span>✓ Mirror Mode</span>
                <span>•</span>
                <span>✓ 0.5x Slow-Mo</span>
                <span>•</span>
                <span>✓ 8-Count Loop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRENDING DANCES SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-14 sm:pb-20">
        <div className="flex items-end justify-between mb-5 sm:mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
              <Flame className="w-4 h-4" />
              <span>Trending Choreographies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Most Practiced Routines
            </h2>
          </div>

          <Link
            href="/explore"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1 transition"
          >
            Explore all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingRoutines.map((routine) => (
            <DanceCard key={routine.id} routine={routine} />
          ))}
        </div>
      </section>

      {/* 4. DANCE STYLES TAXONOMY */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-14 sm:pb-20">
        <div className="flex items-end justify-between mb-5 sm:mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Curated Styles
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Explore by Dance Style
            </h2>
          </div>

          <Link
            href="/styles"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1 transition"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {DANCE_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/explore?style=${encodeURIComponent(category.name.split(" ")[0])}`}
              className="group relative rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-end p-5 sm:p-6 hover:shadow-lg transition-all active:scale-98"
            >
              {/* Background Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.coverImage}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-70 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 space-y-1 sm:space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {category.name}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-1">
                  {category.tagline}
                </p>
                <div className="pt-1.5 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-400">
                  <span className="truncate">Songs: {category.sampleSongs.join(", ")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. BEGINNER-FRIENDLY SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-14 sm:pb-20">
        <div className="p-6 sm:p-12 rounded-[28px] sm:rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="max-w-2xl mb-6 sm:mb-8 space-y-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Complete Beginners
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Never danced before? Start here.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              These choreographies break down weight shifts, rhythm, and gentle arm placement with zero prior dance experience needed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {beginnerPicks.map((routine) => (
              <DanceCard key={routine.id} routine={routine} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. THE SEEKHO LOOP (HOW IT WORKS) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12 sm:pb-16">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Designed for how you discover dance.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            No complex signups or generic courses. Find the exact song you saw online and learn it in 15 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2.5 sm:space-y-3">
            <span className="font-mono text-xl sm:text-2xl font-bold text-orange-600">01</span>
            <h3 className="font-semibold text-base text-neutral-900 dark:text-white">
              Discover on YouTube
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              You hear a catchy song and see a creator performing a viral routine you want to learn for yourself.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2.5 sm:space-y-3">
            <span className="font-mono text-xl sm:text-2xl font-bold text-orange-600">02</span>
            <h3 className="font-semibold text-base text-neutral-900 dark:text-white">
              Search Song on Seekho
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Type the song name into the search bar to jump straight to the verified step-by-step breakdown.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2.5 sm:space-y-3">
            <span className="font-mono text-xl sm:text-2xl font-bold text-orange-600">03</span>
            <h3 className="font-semibold text-base text-neutral-900 dark:text-white">
              Master Step-by-Step
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Flip to mirror mode, slow down to 0.5x speed, loop difficult 8-counts, and drill until you have it down.
            </p>
          </div>
        </div>
      </section>

      {/* 8. SIMPLE APPLE-INSPIRED PRICING */}
      <div id="pricing" className="border-t border-neutral-200/80 dark:border-neutral-800/80">
        <PricingSection />
      </div>
    </div>
  );
}
