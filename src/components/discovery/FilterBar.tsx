"use client";

import React from "react";
import { Search, ArrowUpDown, X, RotateCcw, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (diff: string) => void;
  sortBy: "featured" | "newest" | "bpm";
  onSortChange: (sort: "featured" | "newest" | "bpm") => void;
  totalResults: number;
}

const STYLES = [
  "All",
  "Bollywood",
  "Traditional",
  "Rajasthani",
  "Haryanvi",
  "Wedding",
  "Punjabi",
];

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedStyle,
  onStyleChange,
  selectedDifficulty,
  onDifficultyChange,
  sortBy,
  onSortChange,
  totalResults,
}: FilterBarProps) {
  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedStyle !== "All" || selectedDifficulty !== "All";

  const clearFilters = () => {
    onSearchChange("");
    onStyleChange("All");
    onDifficultyChange("All");
  };

  return (
    <div className="space-y-3.5">
      {/* Top Search and Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Instant Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by song, artist, creator or style..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white dark:bg-neutral-900/90 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl placeholder-neutral-400 text-neutral-900 dark:text-neutral-50 outline-none focus:border-orange-500/80 dark:focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/10 transition shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition rounded-full"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Difficulty Pill Selector & Sort */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none shrink-0">
          {/* Difficulty Segmented Control */}
          <div className="flex items-center gap-1 bg-neutral-100/80 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-1 shrink-0">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                  selectedDifficulty === diff
                    ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold shadow-2xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as "featured" | "newest" | "bpm")}
              className="appearance-none bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl px-3.5 py-2 pr-8 text-xs font-medium text-neutral-700 dark:text-neutral-300 outline-none cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 transition shadow-2xs"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest First</option>
              <option value="bpm">Tempo (BPM)</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Style Chips & Active Results Row */}
      <div className="flex items-center justify-between gap-3 pt-0.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 flex-1">
          {STYLES.map((style) => {
            const isSelected = selectedStyle === style;
            return (
              <button
                key={style}
                onClick={() => onStyleChange(style)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                  isSelected
                    ? "bg-neutral-950 text-white border-neutral-950 dark:bg-white dark:text-neutral-950 dark:border-white shadow-2xs font-semibold"
                    : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-950 dark:hover:text-white"
                )}
              >
                {style}
              </button>
            );
          })}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40 whitespace-nowrap transition shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Results Count Summary */}
      <div className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center justify-between">
        <span>
          Showing <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">{totalResults}</strong> choreographies
        </span>
        {searchQuery && (
          <span className="text-[11px] text-neutral-400">
            Filtered by &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>
    </div>
  );
}
