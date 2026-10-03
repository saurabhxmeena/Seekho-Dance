"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ArrowRight, Layers, Play, X } from "lucide-react";
import { DANCE_CATEGORIES } from "@/data/categories";
import { DANCE_ROUTINES } from "@/data/dances";
import { cn } from "@/lib/utils";

const POPULAR_CATEGORIES = ["Bollywood", "Bhangra", "Wedding", "Rajasthani", "Haryanvi"] as const;

function SearchContent() {
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialStyle = searchParams.get("style") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialStyle || null);

  // Sync state if URL searchParams change
  useEffect(() => {
    const s = searchParams.get("style");
    const q = searchParams.get("q");
    if (s !== null) setSelectedCategory(s || null);
    if (q !== null) setQuery(q || "");
  }, [searchParams]);

  // Subtle spring-on-scroll intersection observer
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("spring-enter");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -15px 0px" }
    );

    const targets = document.querySelectorAll(".spring-scroll-target");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selectedCategory, query]);

  const handleSelectCategory = (style: string) => {
    if (selectedCategory === style) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(style);
      setQuery("");
    }
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
  };

  // Video results for selected popular / style category
  const categoryVideos = useMemo(() => {
    if (!selectedCategory) return [];
    const cat = selectedCategory.toLowerCase();
    return DANCE_ROUTINES.filter((r) => {
      const routineStyle = r.style.toLowerCase();
      if (cat === "bhangra") {
        return routineStyle.includes("punjabi") || routineStyle.includes("bhangra");
      }
      if (cat.includes("mashup") && cat.includes("traditional")) {
        return routineStyle.includes("wedding") || routineStyle.includes("traditional");
      }
      if (cat.includes("mashup")) {
        return routineStyle.includes("bollywood") || routineStyle.includes("wedding") || routineStyle.includes("punjabi");
      }
      if (cat.includes("festival")) {
        return routineStyle.includes("traditional") || routineStyle.includes("rajasthani") || r.isTrending;
      }
      return (
        routineStyle.includes(cat) ||
        r.title.toLowerCase().includes(cat) ||
        r.artist.toLowerCase().includes(cat)
      );
    });
  }, [selectedCategory]);

  // Matching routines when typing in the search bar
  const matchingRoutines = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return DANCE_ROUTINES.filter((r) => {
      const routineStyle = r.style.toLowerCase();
      const isBhangraMatch = q.includes("bhangra") && routineStyle.includes("punjabi");
      return (
        r.title.toLowerCase().includes(q) ||
        r.artist.toLowerCase().includes(q) ||
        routineStyle.includes(q) ||
        r.creator.toLowerCase().includes(q) ||
        isBhangraMatch
      );
    });
  }, [query]);

  // Categories filtered by text search
  const filteredCategories = useMemo(() => {
    if (!query.trim()) return DANCE_CATEGORIES;
    const q = query.toLowerCase();
    return DANCE_CATEGORIES.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.tagline.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.sampleSongs.some((s) => s.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="bg-[#FAFAF8] dark:bg-[#0D0D11] text-neutral-900 dark:text-[#EDEDF0] pb-2 sm:pb-6">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-5 pb-2 sm:py-8 space-y-6 sm:space-y-8">

        {/* ── Header ── */}
        <div className="max-w-2xl space-y-1 spring-scroll-target spring-enter">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-orange-600 dark:text-orange-400">
            Explore Dance Styles
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-[#EDEDF0]">
            Find Your Style
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-[#9494A0]">
            Browse dance categories or search for a specific style, song, or instructor.
          </p>
        </div>

        {/* ── Search Bar ── */}
        <div className="relative group max-w-2xl spring-scroll-target spring-enter">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 shrink-0 pointer-events-none transition-transform group-focus-within:scale-110" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value && selectedCategory) {
                setSelectedCategory(null);
              }
            }}
            placeholder="Search style, song, or instructor…"
            className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-sm bg-white dark:bg-[#161618] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl placeholder-neutral-400 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-2xs transition-all"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition active:scale-90"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ── Popular Right Now ── */}
        <div className="space-y-2.5 spring-scroll-target spring-enter">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Popular right now
            </p>
            {selectedCategory && (
              <button
                type="button"
                onClick={handleClearCategory}
                className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CATEGORIES.map((style) => {
              const isSelected = selectedCategory?.toLowerCase() === style.toLowerCase();
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleSelectCategory(style)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs transition-all active:scale-95 touch-manipulation inline-flex items-center gap-1.5 shadow-2xs",
                    isSelected
                      ? "bg-orange-600 text-white border border-orange-600 font-semibold shadow-xs"
                      : "bg-white dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-orange-500/60 hover:text-orange-600 dark:hover:text-orange-400 font-medium"
                  )}
                >
                  <span>{style}</span>
                  {isSelected && (
                    <span className="w-3.5 h-3.5 rounded-full bg-white/25 flex items-center justify-center text-[10px] leading-none">
                      ×
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Category Video Results (Direct video results from Popular Right Now or selected style) ── */}
        {selectedCategory && (
          <div className="space-y-3 spring-scroll-target spring-enter">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 fill-current" />
                <h2 className="text-sm font-bold text-neutral-950 dark:text-white">
                  {selectedCategory} Dance Videos ({categoryVideos.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClearCategory}
                className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-orange-600 dark:hover:text-orange-400 transition"
              >
                Show all styles
              </button>
            </div>

            {categoryVideos.length === 0 ? (
              <div className="py-8 text-center bg-white dark:bg-[#161618] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-4">
                <p className="text-xs text-neutral-500">No videos found for this style yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {categoryVideos.map((routine, idx) => (
                  <Link
                    key={routine.id}
                    href={`/dance/${routine.slug || routine.id}`}
                    style={{ animationDelay: `${idx * 40}ms` }}
                    className="spring-scroll-target spring-enter flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition group active:scale-[0.98] shadow-2xs"
                  >
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={routine.coverImage}
                        alt={routine.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-white/90 dark:bg-neutral-900/90 text-orange-600 flex items-center justify-center shadow-xs">
                          <Play className="w-2.5 h-2.5 fill-current translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {routine.title}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {routine.artist} · {routine.style}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400 font-mono">
                        <span>{routine.durationMinutes?.replace(" breakdown", "") || "12 min"}</span>
                        <span>•</span>
                        <span className="text-orange-600 dark:text-orange-400 font-semibold">{routine.difficulty}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 group-hover:text-orange-500 transition-colors ml-auto shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Matching Routines (shown when searching by text) ── */}
        {query && matchingRoutines.length > 0 && (
          <div className="space-y-2.5 spring-scroll-target spring-enter">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Matching Videos ({matchingRoutines.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {matchingRoutines.map((routine, idx) => (
                <Link
                  key={routine.id}
                  href={`/dance/${routine.slug || routine.id}`}
                  style={{ animationDelay: `${idx * 35}ms` }}
                  className="spring-scroll-target spring-enter flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition group active:scale-[0.98] shadow-2xs"
                >
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={routine.coverImage}
                      alt={routine.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white/90 dark:bg-neutral-900/90 text-orange-600 flex items-center justify-center shadow-xs">
                        <Play className="w-2.5 h-2.5 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {routine.title}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                      {routine.artist} · {routine.style}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400 font-mono">
                      <span>{routine.durationMinutes?.replace(" breakdown", "") || "12 min"}</span>
                      <span>•</span>
                      <span className="text-orange-600 dark:text-orange-400 font-semibold">{routine.difficulty}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 group-hover:text-orange-500 transition-colors ml-auto shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Dance Styles Grid ── */}
        <div className="space-y-3 spring-scroll-target spring-enter">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <h2 className="text-sm font-bold text-neutral-950 dark:text-white">
              {query.trim()
                ? `${filteredCategories.length} style${filteredCategories.length !== 1 ? "s" : ""} found`
                : "Browse by Dance Style"}
            </h2>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="py-12 text-center bg-white dark:bg-[#161618] rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
              <Layers className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                No styles match &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Try searching for Bollywood, Wedding, Rajasthani, or Bhangra.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-4 px-4 py-1.5 text-xs font-semibold rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-80 transition active:scale-95"
              >
                Show all styles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
              {filteredCategories.map((category, idx) => (
                <Link
                  key={category.id}
                  href={`/styles/${category.slug}`}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className="spring-scroll-target spring-enter text-left group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/11] bg-neutral-900 border border-neutral-200/70 dark:border-white/[0.08] flex flex-col justify-end p-2.5 sm:p-5 hover:shadow-xl hover:border-neutral-400 dark:hover:border-white/20 transition-all duration-300 active:scale-[0.98] touch-manipulation block"
                >
                  {/* Background Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.coverImage}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

                  {/* Content */}
                  <div className="relative z-10 space-y-0.5">
                    <div className="flex items-center justify-between gap-1.5">
                      <h3 className="text-xs sm:text-base font-bold text-white tracking-tight line-clamp-1">
                        {category.name}
                      </h3>
                      <div className="hidden sm:flex w-6 h-6 rounded-full bg-white/10 backdrop-blur-md items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-xs text-neutral-300 line-clamp-1">
                      {category.tagline}
                    </p>
                    {/* Sample songs as tiny pills — desktop only */}
                    <div className="hidden sm:flex flex-wrap gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.sampleSongs.slice(0, 2).map((song) => (
                        <span
                          key={song}
                          className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-white/80 backdrop-blur-sm"
                        >
                          {song}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-neutral-400">Loading styles…</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
