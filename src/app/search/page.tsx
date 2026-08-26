"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, Music } from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { DanceCard } from "@/components/discovery/DanceCard";
import { filterDances } from "@/lib/utils";

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
    }
  };

  const results = filterDances(DANCE_ROUTINES, {
    query: query,
    difficulty: selectedDifficulty,
    sortBy: "featured",
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        
        {/* Search Bar Container */}
        <div className="max-w-2xl mx-auto space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by song name, original artist, or dance creator..."
              className="w-full pl-12 pr-24 py-3.5 text-base bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl placeholder-neutral-400 text-neutral-900 dark:text-white outline-none focus:border-neutral-950 dark:focus:border-neutral-400 shadow-sm"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-14 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-3.5 py-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl text-xs font-semibold hover:bg-neutral-800 transition"
            >
              Search
            </button>
          </form>

          {/* Quick tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-center">
            <span className="text-xs text-neutral-400 shrink-0">Popular:</span>
            {["Tauba Tauba", "Water Tyla", "Jung Kook Seven", "Illuminati", "Chaleya", "Greedy"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  router.push(`/search?q=${encodeURIComponent(item)}`);
                }}
                className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs whitespace-nowrap transition"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
              {query ? (
                <>
                  Results for &ldquo;<span className="text-orange-600 dark:text-orange-400">{query}</span>&rdquo;
                </>
              ) : (
                "All Available Dances"
              )}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Found {results.length} tutorial{results.length === 1 ? "" : "s"}
            </p>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1 text-xs">
            {["All", "Beginner", "Intermediate", "Advanced"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedDifficulty === diff
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((routine) => (
              <DanceCard key={routine.id} routine={routine} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8">
            <Music className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              No dance tutorials matched &ldquo;{query}&rdquo;
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Check for typos or try searching with just the song name or artist name.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedDifficulty("All");
                router.push("/explore");
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 transition"
            >
              Browse All Choreographies
            </button>
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
