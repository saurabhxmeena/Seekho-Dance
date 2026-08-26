"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Play,
  Flame,
  ArrowRight,
  FlipHorizontal,
  Gauge,
  Repeat,
  Sparkles,
  CheckCircle2,
  Zap,
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

  const superpowers = [
    {
      icon: FlipHorizontal,
      title: "Horizontal Mirror Flip",
      desc: "Never reverse left & right in your head.",
    },
    {
      icon: Gauge,
      title: "0.5x Slow-Motion Tempo",
      desc: "Isolate intricate footwork at half speed.",
    },
    {
      icon: Repeat,
      title: "8-Count Loop Drills",
      desc: "Build muscle memory with seamless beat loops.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-50 transition-colors duration-200">
      
      {/* 1. HERO SECTION (Apple / Minimalist Masterpiece) */}
      <section className="relative pt-8 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-5 sm:space-y-6">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
            <span>The choreography behind the songs you love</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.05]">
            Hear a song on YouTube.
            <br />
            <span className="text-neutral-400 dark:text-neutral-500 font-medium">
              Learn the dance in 15 minutes.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Step-by-step breakdowns for viral music. Practice with horizontal mirror mode, custom speed control, and 8-count loop drillers.
          </p>

          {/* Centered Hero Search Bar */}
          <form onSubmit={handleHeroSearch} className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center bg-white dark:bg-[#18181A] border border-neutral-300 dark:border-neutral-700 rounded-full shadow-lg shadow-black/5 dark:shadow-none focus-within:border-orange-600 dark:focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 transition-all p-1.5 pl-4 sm:pl-5">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search any song, artist, or style..."
                className="w-full text-base sm:text-sm bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none pr-3"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-xs shrink-0 active:scale-95"
              >
                Search
              </button>
            </div>

            {/* Trending Quick Links */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-neutral-500 overflow-x-auto scrollbar-none whitespace-nowrap pb-1">
              <span className="font-semibold text-neutral-400 shrink-0">Trending:</span>
              <Link
                href="/dance/tauba-tauba"
                className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium transition shrink-0 shadow-2xs"
              >
                🔥 Tauba Tauba
              </Link>
              <Link
                href="/dance/water"
                className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium transition shrink-0 shadow-2xs"
              >
                💧 Water
              </Link>
              <Link
                href="/dance/seven"
                className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium transition shrink-0 shadow-2xs"
              >
                ⚡ Seven
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* 2. THREE STUDIO PRACTICE SUPERPOWERS STRIP */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-14 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {superpowers.map((sp, idx) => {
            const Icon = sp.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#18181A] border border-neutral-200/90 dark:border-neutral-800/90 shadow-2xs flex items-center gap-4 transition hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h3 className="font-bold text-sm text-neutral-950 dark:text-white truncate">
                    {sp.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug">
                    {sp.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SPOTLIGHT ROUTINE HERO CARD */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16 sm:pb-24">
        <div className="relative rounded-[32px] sm:rounded-[36px] overflow-hidden bg-neutral-950 text-white border border-neutral-900 dark:border-neutral-800 shadow-2xl">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center relative z-10">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 p-7 sm:p-10 lg:p-12 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                    Featured Tutorial
                  </span>
                  <Badge difficulty={featuredRoutine.difficulty} variant="difficulty" className="bg-neutral-800 text-neutral-200 border-neutral-700" />
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
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
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-500/40 shrink-0"
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
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href={`/dance/${featuredRoutine.id}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-orange-600/30 active:scale-95 text-center"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Step 01 (Foundation)</span>
                </Link>

                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold transition active:scale-95 text-center border border-neutral-800"
                >
                  Browse Library
                </Link>
              </div>
            </div>

            {/* Right Visual Video Image Banner */}
            <div className="lg:col-span-7 relative h-64 sm:h-96 lg:h-[440px] bg-neutral-950 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredRoutine.coverImage}
                alt={featuredRoutine.title}
                className="w-full h-full object-cover opacity-85 hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />

              {/* Floating Studio Features Pill */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] sm:text-[11px] text-neutral-300 shadow-xl">
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

      {/* 4. TRENDING DANCES SECTION */}
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
              The choreographies dancers are practicing this week.
            </p>
          </div>

          <Link
            href="/explore"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1 transition self-start sm:self-auto"
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

      {/* 5. DANCE STYLES TAXONOMY */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16 sm:pb-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Curated Genres
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Dance Styles. Pick your vibe.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              From Bollywood hooksteps to Afro Bacardi and K-Pop routines.
            </p>
          </div>

          <Link
            href="/styles"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white inline-flex items-center gap-1 transition self-start sm:self-auto"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {DANCE_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/explore?style=${encodeURIComponent(category.name.split(" ")[0])}`}
              className="group relative rounded-3xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-end p-5 sm:p-6 hover:shadow-xl transition-all duration-300 active:scale-98"
            >
              {/* Background Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.coverImage}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-70 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 space-y-1">
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
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16 sm:pb-24">
        <div className="p-7 sm:p-12 rounded-[32px] sm:rounded-[36px] bg-neutral-100 dark:bg-[#18181A] border border-neutral-200/80 dark:border-neutral-800 space-y-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {beginnerPicks.map((routine) => (
              <DanceCard key={routine.id} routine={routine} />
            ))}
          </div>
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
