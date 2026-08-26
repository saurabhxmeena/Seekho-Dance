"use client";

import React from "react";
import { Search, ArrowUpDown, X } from "lucide-react";
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
  "Afro Fusion",
  "K-Pop",
  "Urban Hip-Hop",
  "South Fusion",
  "Contemporary",
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
    searchQuery !== "" || selectedStyle !== "All" || selectedDifficulty !== "All";

  const clearFilters = () => {
    onSearchChange("");
    onStyleChange("All");
    onDifficultyChange("All");
  };

  return (
    <div className="space-y-4">
      {/* Top Row: Search Input + Sort Dropdown */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by song, artist, creator or style..."
            className="w-full pl-10 pr-8 py-2.5 text-base sm:text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl placeholder-neutral-400 text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Difficulty Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1 shrink-0">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition",
                  selectedDifficulty === diff
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-2xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                {diff}
              </button>
            ))}
          </div>

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as "featured" | "newest" | "bpm")}
              className="appearance-none bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-neutral-700 dark:text-neutral-300 outline-none cursor-pointer hover:border-neutral-400 transition"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest First</option>
              <option value="bpm">Tempo (BPM)</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Second Row: Style Chips (Edge-to-edge swipeable on smartphone) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 shrink-0 mr-1">
          Styles:
        </span>
        {STYLES.map((style) => {
          const isSelected = selectedStyle === style;
          return (
            <button
              key={style}
              onClick={() => onStyleChange(style)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                isSelected
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white shadow-2xs font-semibold"
                  : "bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              {style}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-1 rounded-full text-xs font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 whitespace-nowrap transition ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Results Count Line */}
      <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-between pt-1">
        <span>
          Showing <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">{totalResults}</strong> choreographies
        </span>
      </div>
    </div>
  );
}
