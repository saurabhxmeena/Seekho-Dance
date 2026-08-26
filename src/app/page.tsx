"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Play,
  Flame,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  Layers,
  ChevronRight,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { DANCE_CATEGORIES } from "@/data/categories";
import { DanceCard } from "@/components/discovery/DanceCard";
import { SongRow } from "@/components/discovery/SongRow";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [heroSearch, setHeroSearch] = useState("");

  const featuredRoutine = DANCE_ROUTINES.find((d) => d.isFeatured) || DANCE_ROUTINES[0];
  const trendingRoutines = DANCE_ROUTINES.filter((d) => d.isTrending).slice(0, 4);
  const popularSongs = DANCE_ROUTINES.slice(0, 6);
  const beginnerPicks = DANCE_ROUTINES.filter((d) => d.isBeginnerPick || d.difficulty === "Beginner").slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl space-y-6">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span>The choreography behind the songs you love</span>
          </div>

          {/* Main Confident Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.08]">
            Hear a song on YouTube.
            <br />
            <span className="text-neutral-400 dark:text-neutral-500 font-medium">
              Learn the dance here.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Direct, step-by-step dance tutorials for viral songs. Practice with horizontal mirror mode, custom speed control, and 8-count loop drillers.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleHeroSearch} className="relative max-w-xl pt-2">
            <div className="relative flex items-center bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl shadow-sm focus-within:border-neutral-950 dark:focus-within:border-neutral-400 focus-within:shadow-md transition-all p-1.5">
              <Search className="w-5 h-5 text-neutral-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search by song name (e.g. Tauba Tauba, Water, Seven)..."
                className="w-full px-3 py-2 text-sm bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shrink-0"
              >
                Find Dance
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex items-center gap-2 mt-3 text-xs text-neutral-500 overflow-x-auto pb-1">
              <span className="font-medium shrink-0">Try searching:</span>
              {["Tauba Tauba", "Water Tyla", "Jung Kook Seven", "Illuminati", "Chaleya"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => router.push(`/search?q=${encodeURIComponent(item)}`)}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] whitespace-nowrap transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* 2. SPOTLIGHT ROUTINE HERO CARD */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white border border-neutral-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 space-y-6 z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                    Featured Tutorial
                  </span>
                  <Badge difficulty={featuredRoutine.difficulty} variant="difficulty" className="bg-neutral-800 text-neutral-200 border-neutral-700" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {featuredRoutine.title}
                </h2>
                <p className="text-sm text-neutral-400">
                  {featuredRoutine.artist}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3">
                {featuredRoutine.description}
              </p>

              {/* Creator & Metas */}
              <div className="flex items-center gap-3 pt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredRoutine.creatorAvatar}
                  alt={featuredRoutine.creator}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/40"
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
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href={`/dance/${featuredRoutine.id}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition shadow-lg shadow-orange-600/30"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Step 01 (Foundation)</span>
                </Link>

                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition"
                >
                  Browse All
                </Link>
              </div>
            </div>

            {/* Right Visual Video Image Banner */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[420px] bg-neutral-950 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredRoutine.coverImage}
                alt={featuredRoutine.title}
                className="w-full h-full object-cover opacity-80 hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-900 via-neutral-900/40 to-transparent" />

              {/* Floating Studio Features Pill */}
              <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-neutral-300">
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
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
              <Flame className="w-4 h-4" />
              <span>Trending Right Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Most Practiced Choreographies
            </h2>
          </div>

          <Link
            href="/explore"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition"
          >
            Explore all {DANCE_ROUTINES.length} dances <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingRoutines.map((routine) => (
            <DanceCard key={routine.id} routine={routine} />
          ))}
        </div>
      </section>

      {/* 4. BROWSE BY POPULAR SONG */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Track-First Discovery
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Popular Songs
            </h2>
          </div>

          <Link
            href="/explore"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1 transition"
          >
            View all songs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {popularSongs.map((routine, idx) => (
            <SongRow key={routine.id} routine={routine} index={idx} />
          ))}
        </div>
      </section>

      {/* 5. DANCE STYLES TAXONOMY */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="flex items-end justify-between mb-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DANCE_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/explore?style=${encodeURIComponent(category.name.split(" ")[0])}`}
              className="group relative rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-end p-6 hover:shadow-lg transition-all"
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
              <div className="relative z-10 space-y-1.5">
                <span className="text-[11px] font-mono font-medium text-orange-400">
                  {category.routineCount} Tutorials
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {category.name}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-1">
                  {category.tagline}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <span>Songs: {category.sampleSongs.join(", ")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. BEGINNER-FRIENDLY ZERO-TO-ONE SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="max-w-2xl mb-8 space-y-2">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {beginnerPicks.map((routine) => (
              <DanceCard key={routine.id} routine={routine} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. THE SEEKHO LOOP (MINIMAL HOW IT WORKS) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Designed for how you discover dance.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            No complex signups or generic courses. Find the exact song you saw online and learn it in 15 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="font-mono text-2xl font-bold text-orange-600">01</span>
            <h3 className="font-semibold text-base text-neutral-900 dark:text-white">
              Discover on YouTube
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              You hear a catchy song and see a creator performing a viral routine you want to learn for yourself.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="font-mono text-2xl font-bold text-orange-600">02</span>
            <h3 className="font-semibold text-base text-neutral-900 dark:text-white">
              Search Song on Seekho
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Type the song name into the search bar to jump straight to the verified step-by-step breakdown.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="font-mono text-2xl font-bold text-orange-600">03</span>
            <h3 className="font-semibold text-base text-neutral-900 dark:text-white">
              Master Step-by-Step
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Flip to mirror mode, slow down to 0.5x speed, loop difficult 8-counts, and drill until you have it down.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
