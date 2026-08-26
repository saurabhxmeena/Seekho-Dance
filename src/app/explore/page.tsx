"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List, Music, Sparkles, Filter } from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { DanceCard } from "@/components/discovery/DanceCard";
import { SongRow } from "@/components/discovery/SongRow";
import { FilterBar } from "@/components/discovery/FilterBar";
import { filterDances } from "@/lib/utils";

function ExploreContent() {
  const searchParams = useSearchParams();

  const initialStyle = searchParams.get("style") || "All";
  const initialDiff = searchParams.get("difficulty") || "All";
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDiff);
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "duration" | "bpm">("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Keep state synced with URL params when navigating
  useEffect(() => {
    if (searchParams.get("style")) {
      setSelectedStyle(searchParams.get("style") || "All");
    }
    if (searchParams.get("difficulty")) {
      setSelectedDifficulty(searchParams.get("difficulty") || "All");
    }
    if (searchParams.get("q")) {
      setSearchQuery(searchParams.get("q") || "");
    }
  }, [searchParams]);

  const filteredDances = filterDances(DANCE_ROUTINES, {
    query: searchQuery,
    style: selectedStyle,
    difficulty: selectedDifficulty,
    sortBy: sortBy,
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 block mb-1">
              Dance Library
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Explore Choreographies
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
              Browse step-by-step breakdowns for songs across Bollywood, Afrobeats, K-Pop, Urban Hip-Hop and more.
            </p>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "list"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={filteredDances.length}
        />

        {/* Content Display */}
        {filteredDances.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
              {filteredDances.map((routine) => (
                <DanceCard key={routine.id} routine={routine} />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5 pt-2">
              {filteredDances.map((routine, idx) => (
                <SongRow key={routine.id} routine={routine} index={idx} />
              ))}
            </div>
          )
        ) : (
          <div className="py-20 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8">
            <Music className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              No choreographies match your current filters
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Try choosing a different dance style, clearing search queries, or resetting difficulty filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStyle("All");
                setSelectedDifficulty("All");
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 transition"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading dance library...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
