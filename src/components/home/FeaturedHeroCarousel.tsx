"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { DanceRoutine } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface FeaturedHeroCarouselProps {
  routines: DanceRoutine[];
}

export function FeaturedHeroCarousel({ routines }: FeaturedHeroCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync activeIndex on horizontal swipe / scroll with requestAnimationFrame
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    if (width <= 0) return;
    const newIndex = Math.round(el.scrollLeft / width);
    if (newIndex >= 0 && newIndex < routines.length && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, routines.length]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Smooth scroll to a specific index
  const scrollToIndex = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const targetIndex = Math.max(0, Math.min(index, routines.length - 1));
    el.scrollTo({
      left: targetIndex * el.clientWidth,
      behavior: "smooth",
    });
    setActiveIndex(targetIndex);
  };

  const handleNext = () => scrollToIndex(activeIndex + 1);
  const handlePrev = () => scrollToIndex(activeIndex - 1);

  if (!routines || routines.length === 0) return null;

  return (
    <section className="relative pt-3 sm:pt-6 pb-8 sm:pb-16 px-3.5 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* 1. Master Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="relative flex overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x scrollbar-none rounded-[28px] sm:rounded-[32px] shadow-2xl border border-neutral-800/80 bg-neutral-950 text-white"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {routines.map((routine, idx) => (
          <div
            key={routine.id}
            className="w-full shrink-0 snap-center snap-always relative overflow-hidden bg-neutral-950 h-[380px] sm:h-[400px] lg:h-[380px]"
          >
            {/* Dynamic Subtle Ambient Glow Backdrop */}
            <div
              className={cn(
                "absolute top-0 right-0 w-72 sm:w-80 h-72 sm:h-80 rounded-full blur-3xl pointer-events-none opacity-20 transition-opacity duration-500",
                idx % 3 === 0 && "bg-orange-600",
                idx % 3 === 1 && "bg-indigo-600",
                idx % 3 === 2 && "bg-emerald-600"
              )}
            />

            {/* MOBILE (< lg) FULL-BLEED CINEMATIC LAYOUT */}
            <div className="lg:hidden absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={routine.coverImage}
                alt={routine.title}
                className="w-full h-full object-cover opacity-45 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/20" />
            </div>

            {/* DESKTOP (lg+) & MOBILE CONTENT CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full relative z-10">
              
              {/* Left Info Column */}
              <div className="lg:col-span-6 p-4 sm:p-7 flex flex-col justify-between h-full z-10">
                
                {/* Top: Clean Badges & Song Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-2xs">
                        <Flame className="w-3 h-3 fill-current" />
                        <span>Featured</span>
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-neutral-200 border border-white/10 backdrop-blur-xs">
                        {routine.style}
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[10px] text-neutral-300 bg-white/5 border border-white/10">
                        {routine.difficulty}
                      </span>
                    </div>

                    {/* Mobile Slide Counter */}
                    <div className="lg:hidden flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-neutral-300 shrink-0">
                      <span>0{idx + 1}</span>
                      <span className="text-neutral-600">/</span>
                      <span className="text-neutral-400">0{routines.length}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5 pt-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight line-clamp-1">
                      {routine.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-neutral-300 truncate">
                      {routine.artist}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 pt-0.5">
                    {routine.description}
                  </p>
                </div>

                {/* Bottom: Choreographer Lockup & Action Buttons */}
                <div className="space-y-2.5 pt-2.5 border-t border-neutral-800/60">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={routine.creatorAvatar}
                      alt={routine.creator}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-orange-500/40 shrink-0"
                    />
                    <div className="min-w-0 flex items-center gap-1.5 text-xs text-neutral-300 truncate">
                      <span className="font-semibold text-white truncate">{routine.creator}</span>
                      <span className="text-neutral-600">•</span>
                      <span className="text-[11px] text-neutral-400 font-mono shrink-0">{routine.steps.length} Steps</span>
                      <span className="text-neutral-600">•</span>
                      <span className="text-[11px] text-neutral-400 font-mono shrink-0">{routine.bpm} BPM</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dance/${routine.id}`}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition shadow-md shadow-orange-600/25 active:scale-95 text-center touch-manipulation"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Step 01</span>
                    </Link>

                    <Link
                      href="/explore"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-semibold transition active:scale-95 text-center border border-white/10 touch-manipulation"
                    >
                      <span>Library</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

              </div>

              {/* Right Visual Image Column (Desktop Only) */}
              <div className="hidden lg:block lg:col-span-6 relative h-full bg-neutral-950 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={routine.coverImage}
                  alt={routine.title}
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700"
                />

                {/* Seamless Edge Gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/30 to-transparent" />

                {/* Top Slide Counter */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white shadow-xs">
                  <span>0{idx + 1}</span>
                  <span className="text-neutral-500">/</span>
                  <span className="text-neutral-400">0{routines.length}</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* 2. Sleek Bottom Navigation Bar */}
      <div className="mt-3 flex items-center justify-end gap-3 px-1">
        {/* Right Indicators & Chevron Controls */}
        <div className="flex items-center gap-3">
          
          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5 bg-neutral-200/70 dark:bg-neutral-900/80 p-1 rounded-full border border-neutral-300/50 dark:border-neutral-800">
            {routines.map((routine, idx) => (
              <button
                key={routine.id}
                onClick={() => scrollToIndex(idx)}
                aria-label={`Go to ${routine.title}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  activeIndex === idx
                    ? "w-5 bg-orange-600 dark:bg-orange-500 shadow-2xs"
                    : "w-1.5 bg-neutral-400/60 dark:bg-neutral-700 hover:bg-neutral-600 dark:hover:bg-neutral-500"
                )}
              />
            ))}
          </div>

          {/* Micro Chevron Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Previous tutorial"
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-150 active:scale-95",
                activeIndex === 0
                  ? "opacity-25 cursor-not-allowed border-neutral-200 dark:border-neutral-800 text-neutral-400"
                  : "bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 shadow-2xs"
              )}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNext}
              disabled={activeIndex === routines.length - 1}
              aria-label="Next tutorial"
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-150 active:scale-95",
                activeIndex === routines.length - 1
                  ? "opacity-25 cursor-not-allowed border-neutral-200 dark:border-neutral-800 text-neutral-400"
                  : "bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 shadow-2xs"
              )}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
