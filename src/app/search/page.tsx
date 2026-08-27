"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Music, ArrowLeft, RotateCcw } from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { DanceCard } from "@/components/discovery/DanceCard";
import { filterDances } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  const results = filterDances(DANCE_ROUTINES, {
    query: query,
    difficulty: selectedDifficulty,
    sortBy: "featured",
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Navigation & Search Input Bar */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Library</span>
            </Link>
            <span className="text-xs font-mono text-neutral-400">
              {results.length} result{results.length === 1 ? "" : "s"} found
            </span>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600 dark:text-orange-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search song title, artist, or choreographer..."
              className="w-full pl-12 pr-28 py-3.5 text-base bg-white dark:bg-[#161618] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl placeholder-neutral-400 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/15 focus:border-orange-500/80 shadow-md shadow-black/5 dark:shadow-none transition"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition active:scale-95 shadow-xs"
            >
              Search
            </button>
          </form>

          {/* Difficulty Filter Chips */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-1 shrink-0">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-medium transition-all",
                    selectedDifficulty === diff
                      ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold shadow-2xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Quick Popular Picks */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <span className="text-neutral-400 font-mono text-[11px]">Suggestions:</span>
              {["Tauba Tauba", "Water", "Seven"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setQuery(item);
                    router.push(`/search?q=${encodeURIComponent(item)}`);
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 transition text-[11px]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
            {results.map((routine) => (
              <DanceCard key={routine.id} routine={routine} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white dark:bg-[#161618] rounded-[32px] border border-neutral-200/90 dark:border-neutral-800 p-8 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950 dark:text-neutral-100">
                No dance tutorials match &ldquo;{query}&rdquo;
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                Check for typos or try searching with just the song name or artist name.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedDifficulty("All");
                  router.push("/explore");
                }}
                className="px-5 py-2.5 text-xs font-semibold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-xs"
              >
                Browse All Choreographies
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
