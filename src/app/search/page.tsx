"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  X,
  Music,
  ArrowRight,
  Clock,
  Trash2,
  TrendingUp,
  Sparkles,
  Layers,
  Filter,
} from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { DANCE_CATEGORIES } from "@/data/categories";
import { DanceCard } from "@/components/discovery/DanceCard";
import { filterDances } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const POPULAR_SUGGESTIONS = [
  "Tauba Tauba",
  "Chaleya",
  "Bollywood",
  "Wedding",
  "Bhangra",
  "Beginner",
  "Rajasthani",
];
const RECENT_SEARCHES_KEY = "seekho_recent_searches";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // Sync from URL param
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    const s = searchParams.get("style") || "All";
    setSelectedStyle(s);
  }, [searchParams]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const saveRecentSearch = (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;
    try {
      const updated = Array.from(new Set([term, ...recentSearches])).slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {}
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    saveRecentSearch(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleClearQuery = () => {
    setQuery("");
    router.push("/search");
  };

  // Instant reactive filtered results
  const results = useMemo(() => {
    return filterDances(DANCE_ROUTINES, {
      query: query.trim(),
      difficulty: selectedDifficulty,
      style: selectedStyle,
      sortBy: "featured",
    });
  }, [query, selectedDifficulty, selectedStyle]);

  const hasActiveFilters = query.trim() !== "" || selectedDifficulty !== "All" || selectedStyle !== "All";

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0D0D11] text-neutral-900 dark:text-[#EDEDF0] pb-24 sm:pb-16">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        
        {/* 1. Integrated Mobile & Desktop Search Header */}
        <div className="max-w-3xl mx-auto space-y-3">
          
          {/* Headline */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-orange-600 dark:text-orange-400">
                Discover Routines
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                Search Dance Library
              </h1>
            </div>
            {query && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                {results.length} result{results.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-orange-600 dark:text-orange-500 shrink-0 pointer-events-none transition-transform group-focus-within:scale-110" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Search song, instructor, dance style or keyword..."
                className="w-full pl-12 pr-24 sm:pr-28 py-3 sm:py-3.5 text-xs sm:text-sm bg-white dark:bg-[#161618] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl placeholder-neutral-400 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm transition-all"
                autoComplete="off"
              />
              <div className="absolute right-2.5 flex items-center gap-1">
                {query && (
                  <button
                    type="button"
                    onClick={handleClearQuery}
                    className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    aria-label="Clear query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-1.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition active:scale-95 shadow-xs"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* 2. Filter Pills: Dance Styles & Difficulty (Horizontal Scrollable on Mobile) */}
          <div className="space-y-2 pt-1">
            {/* Style Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-mono uppercase text-neutral-400 shrink-0 pr-1 hidden sm:inline">
                Style:
              </span>
              {["All", "Bollywood", "Traditional", "Rajasthani", "Haryanvi", "Wedding", "Punjabi"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStyle(st)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition active:scale-95 shrink-0",
                    selectedStyle === st
                      ? "bg-orange-600 text-white font-semibold shadow-xs"
                      : "bg-white dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  )}
                >
                  {st === "All" ? "All Styles" : st}
                </button>
              ))}
            </div>

            {/* Difficulty Pills */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono uppercase text-neutral-400 shrink-0 pr-1 hidden sm:inline">
                  Level:
                </span>
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={cn(
                      "px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition active:scale-95 shrink-0",
                      selectedDifficulty === diff
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold shadow-2xs"
                        : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    )}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setQuery("");
                    setSelectedDifficulty("All");
                    setSelectedStyle("All");
                    router.push("/search");
                  }}
                  className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline shrink-0 font-medium"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* 3. Recent Searches (If any) */}
          {recentSearches.length > 0 && !query && (
            <div className="p-3 rounded-2xl bg-white dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  Recent Searches
                </span>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-[11px] text-neutral-400 hover:text-red-500 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSuggestionClick(term)}
                    className="px-2.5 py-1 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-neutral-800 transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Popular Suggestions */}
          {!query && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-orange-500" />
                Popular:
              </span>
              {POPULAR_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSuggestionClick(sug)}
                  className="px-2 py-0.5 rounded-md text-[11px] bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 transition"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. Results Section */}
        {results.length > 0 ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Showing {results.length} choreographies</span>
              {selectedStyle !== "All" && (
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Style: {selectedStyle}
                </span>
              )}
            </div>

            {/* Responsive Results Grid (2 on mobile, up to 4 on lg) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
              {results.map((routine) => (
                <DanceCard key={routine.id} routine={routine} />
              ))}
            </div>
          </div>
        ) : (
          /* 6. No Results State */
          <div className="py-14 sm:py-20 text-center bg-white dark:bg-[#161618] rounded-[28px] sm:rounded-[32px] border border-neutral-200/90 dark:border-neutral-800 p-6 sm:p-8 max-w-lg mx-auto space-y-4 shadow-sm animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
              <Music className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
                No dance tutorials match &ldquo;{query}&rdquo;
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Check for typos or try searching for instructor names (e.g. Bhavin, Team Naach, Ankan), song titles, or dance styles.
              </p>
            </div>

            {/* Quick Keyword Suggestions to Try */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
              {["Tauba Tauba", "Chaleya", "Bollywood", "Bhangra"].map((item) => (
                <button
                  key={item}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-2.5 py-1 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition"
                >
                  Try &ldquo;{item}&rdquo;
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedDifficulty("All");
                  setSelectedStyle("All");
                  router.push("/search");
                }}
                className="px-5 py-2.5 text-xs font-semibold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-xs"
              >
                Browse All Choreographies
              </button>
            </div>
          </div>
        )}

        {/* 7. Browse by Category Shortcut Rail (Shown when query is empty) */}
        {!query && (
          <div className="pt-8 border-t border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                  Browse by Dance Style
                </h3>
              </div>
              <Link
                href="/styles"
                className="text-xs font-semibold text-orange-600 hover:text-orange-500 flex items-center gap-1"
              >
                <span>View all styles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {DANCE_CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedStyle(cat.name);
                    saveRecentSearch(cat.name);
                  }}
                  className="p-3 rounded-2xl bg-white dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 hover:border-orange-500 text-left transition group active:scale-98 shadow-2xs"
                >
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                    {cat.sampleSongs.join(", ")}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading dance search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
