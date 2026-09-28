"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  X,
  LayoutGrid,
  List,
  Music,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { DanceCard } from "@/components/discovery/DanceCard";
import { SongRow } from "@/components/discovery/SongRow";
import { filterDances } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface LibrarySectionProps {
  id?: string;
  className?: string;
  showHeading?: boolean;
}

const YOUTUBE_TOPIC_PILLS = [
  "All",
  "Trending",
  "Bollywood",
  "Traditional",
  "Rajasthani",
  "Wedding",
  "Haryanvi",
  "Punjabi",
  "Beginner",
];

function LibraryContent({
  id = "library",
  className,
  showHeading = true,
}: LibrarySectionProps) {
  const searchParams = useSearchParams();

  const initialStyle = searchParams?.get("style") || "All";
  const initialDiff = searchParams?.get("difficulty") || "All";
  const initialQuery = searchParams?.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTopic, setSelectedTopic] = useState(initialStyle);
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDiff);
  const [sortBy, setSortBy] = useState<"featured" | "newest" | "bpm">("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Keep state synced with URL params when navigating
  useEffect(() => {
    if (searchParams?.get("style")) {
      setSelectedTopic(searchParams.get("style") || "All");
    }
    if (searchParams?.get("difficulty")) {
      setSelectedDifficulty(searchParams.get("difficulty") || "All");
    }
    if (searchParams?.get("q")) {
      setSearchQuery(searchParams.get("q") || "");
    }
  }, [searchParams]);

  // Listen for custom filter events
  useEffect(() => {
    const handleFilterEvent = (e: CustomEvent<string>) => {
      if (e.detail) {
        setSelectedTopic(e.detail);
        const elem = document.getElementById(id);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    window.addEventListener("seekho:filter-style" as any, handleFilterEvent);
    return () => {
      window.removeEventListener("seekho:filter-style" as any, handleFilterEvent);
    };
  }, [id]);

  // Determine effective filter values based on selectedTopic
  const isTrendingFilter = selectedTopic === "Trending";
  const isBeginnerFilter = selectedTopic === "Beginner";
  const effectiveStyle = isTrendingFilter || isBeginnerFilter ? "All" : selectedTopic;
  const effectiveDifficulty = isBeginnerFilter ? "Beginner" : selectedDifficulty;

  const filteredDances = filterDances(DANCE_ROUTINES, {
    query: searchQuery,
    style: effectiveStyle,
    difficulty: effectiveDifficulty,
    sortBy: sortBy,
  }).filter((routine) => {
    if (isTrendingFilter) return routine.isTrending;
    return true;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTopic("All");
    setSelectedDifficulty("All");
  };

  return (
    <div id={id} className={cn("space-y-6 sm:space-y-8 scroll-mt-20", className)}>
      {/* 1. YouTube-style Header & Search Bar */}
      {showHeading && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 block mb-1">
                Step-by-Step Choreographies
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                Dance Library
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Explore tutorials with mirror mode, loop practice, and tempo control.
              </p>
            </div>

            {/* View Mode & Sort Controls */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {/* Sort Selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "featured" | "newest" | "bpm")
                  }
                  className="appearance-none bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-xl px-2.5 py-1.5 pr-7 text-xs font-medium text-neutral-700 dark:text-neutral-300 outline-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 transition shadow-2xs"
                  aria-label="Sort videos by"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="bpm">BPM</option>
                </select>
                <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400 pointer-events-none" />
              </div>

              {/* Grid / List Switcher */}
              <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-xl p-1 shadow-2xs">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-lg transition active:scale-95",
                    viewMode === "grid"
                      ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                  )}
                  title="Grid View"
                  aria-label="Switch to Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-lg transition active:scale-95",
                    viewMode === "list"
                      ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                  )}
                  title="List View"
                  aria-label="Switch to List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. YouTube-style Search Box */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search song, creator, style, or hookstep..."
          className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white dark:bg-neutral-900/90 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl placeholder-neutral-400 text-neutral-900 dark:text-neutral-50 outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition rounded-full"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. YouTube-style Horizontal Topic Pills (Chips) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        {YOUTUBE_TOPIC_PILLS.map((topic) => {
          const isSelected = selectedTopic === topic;
          return (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 touch-manipulation active:scale-95",
                isSelected
                  ? "bg-neutral-950 text-white border-neutral-950 dark:bg-white dark:text-neutral-950 dark:border-white shadow-2xs scale-102"
                  : "bg-neutral-100 dark:bg-neutral-850/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-transparent"
              )}
            >
              {topic}
            </button>
          );
        })}

        {/* Reset Filter Button if active */}
        {(selectedTopic !== "All" || searchQuery) && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-orange-200 dark:border-orange-900/40 whitespace-nowrap transition shrink-0 active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 4. CONTENT DISPLAY */}
      <div className="space-y-4 pt-1 sm:pt-2">
        {/* Results summary when filtered */}
        {(selectedTopic !== "All" || searchQuery) && (
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>
              Showing{" "}
              <strong className="text-neutral-950 dark:text-white font-semibold">
                {filteredDances.length}
              </strong>{" "}
              choreographies {selectedTopic !== "All" && `in ${selectedTopic}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>

            <button
              onClick={resetFilters}
              className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}

        {filteredDances.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredDances.map((routine) => (
                <DanceCard key={routine.id} routine={routine} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDances.map((routine, idx) => (
                <SongRow key={routine.id} routine={routine} index={idx} />
              ))}
            </div>
          )
        ) : (
            <div className="py-16 sm:py-20 text-center bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-2xs">
              <Music className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                No choreographies match your current filters
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Try choosing a different dance style, clearing search queries, or resetting filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-xl hover:bg-neutral-800 transition active:scale-95 shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

export function LibrarySection(props: LibrarySectionProps) {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-neutral-400">
          Loading dance library...
        </div>
      }
    >
      <LibraryContent {...props} />
    </Suspense>
  );
}
