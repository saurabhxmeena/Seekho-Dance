"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Flame, Sparkles, Play, ArrowRight, CornerDownLeft, Music, SlidersHorizontal } from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { DanceRoutine } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_STYLES = ["Bollywood", "Afro", "K-Pop", "Hip-Hop", "South"];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "trending" | "beginner" | "advanced">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Lock scroll & focus on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setActiveFilter("all");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Compute filtered routines
  const displayRoutines = useMemo(() => {
    let list = DANCE_ROUTINES;

    if (activeFilter === "trending") {
      list = list.filter((d) => d.isTrending);
    } else if (activeFilter === "beginner") {
      list = list.filter((d) => d.difficulty === "Beginner");
    } else if (activeFilter === "advanced") {
      list = list.filter((d) => d.difficulty === "Advanced");
    }

    if (!query.trim()) {
      return list.slice(0, 6);
    }

    const q = query.toLowerCase().trim();
    return list.filter((d) => {
      return (
        d.title.toLowerCase().includes(q) ||
        d.artist.toLowerCase().includes(q) ||
        d.creator.toLowerCase().includes(q) ||
        d.style.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    });
  }, [query, activeFilter]);

  // Reset selected index when query or filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeFilter]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll<HTMLElement>("[data-search-item]");
    const activeItem = items[selectedIndex];
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (displayRoutines.length > 0 ? (prev + 1) % displayRoutines.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          displayRoutines.length > 0 ? (prev - 1 + displayRoutines.length) % displayRoutines.length : 0
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (displayRoutines[selectedIndex]) {
          handleSelectRoutine(displayRoutines[selectedIndex].id);
        } else if (query.trim()) {
          onClose();
          router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, displayRoutines, selectedIndex, query, onClose, router]);

  const handleSelectRoutine = (routineId: string) => {
    onClose();
    router.push(`/dance/${routineId}`);
  };

  const handleFilterClick = (filter: typeof activeFilter) => {
    setActiveFilter((prev) => (prev === filter ? "all" : filter));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-black/60 dark:bg-black/75 backdrop-blur-md transition-all duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#161618] border border-neutral-200/90 dark:border-neutral-800/90 rounded-[26px] shadow-2xl shadow-black/20 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="relative flex items-center px-4 sm:px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800/80 gap-3">
          <Search className="w-5 h-5 text-orange-600 dark:text-orange-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search song, dance style, or creator (e.g. Tauba Tauba, K-Pop, Tyla)..."
            className="w-full bg-transparent text-sm sm:text-base text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 outline-none font-medium"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md">
              ESC
            </kbd>
          )}
        </div>

        {/* Quick Filter Bar */}
        <div className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 bg-neutral-50/70 dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800/60 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mr-1 shrink-0">
            Filters:
          </span>
          <button
            onClick={() => setActiveFilter("all")}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition shrink-0",
              activeFilter === "all"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-2xs"
                : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700/80"
            )}
          >
            All Tutorials
          </button>
          <button
            onClick={() => handleFilterClick("trending")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition shrink-0",
              activeFilter === "trending"
                ? "bg-orange-600 text-white font-semibold shadow-2xs"
                : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700/80"
            )}
          >
            <Flame className="w-3 h-3 text-orange-500" />
            <span>Trending</span>
          </button>
          <button
            onClick={() => handleFilterClick("beginner")}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition shrink-0",
              activeFilter === "beginner"
                ? "bg-emerald-600 text-white font-semibold shadow-2xs"
                : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700/80"
            )}
          >
            Beginner Picks
          </button>
          <button
            onClick={() => handleFilterClick("advanced")}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition shrink-0",
              activeFilter === "advanced"
                ? "bg-purple-600 text-white font-semibold shadow-2xs"
                : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700/80"
            )}
          >
            Advanced
          </button>

          {/* Quick Style Chips */}
          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 shrink-0" />
          {QUICK_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => setQuery(style)}
              className="px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition shrink-0"
            >
              #{style}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 sm:p-3 space-y-1.5 flex-1 divide-y divide-neutral-100/50 dark:divide-neutral-800/30">
          {displayRoutines.length > 0 ? (
            displayRoutines.map((routine, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={routine.id}
                  data-search-item
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => handleSelectRoutine(routine.id)}
                  className={cn(
                    "flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all duration-150 group",
                    isSelected
                      ? "bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 shadow-2xs"
                      : "hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50 border border-transparent"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={routine.coverImage}
                      alt={routine.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity",
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={cn(
                          "text-sm font-bold truncate transition-colors",
                          isSelected
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-white"
                        )}
                      >
                        {routine.title}
                      </h4>
                      <Badge difficulty={routine.difficulty} variant="difficulty" className="text-[9px] sm:text-[10px] py-0 px-1.5 shrink-0" />
                      {routine.isTrending && (
                        <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-1.5 py-0.2 rounded shrink-0">
                          <Flame className="w-2.5 h-2.5" /> Trending
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {routine.artist} • {routine.style}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                      <span>By {routine.creator}</span>
                      <span>•</span>
                      <span>{routine.steps.length} Steps</span>
                      <span>•</span>
                      <span>{routine.bpm} BPM</span>
                    </div>
                  </div>

                  {/* Selection Indicator Pill */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-100/80 dark:bg-orange-900/40 px-2 py-0.5 rounded-lg">
                        <span>Open</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isSelected
                          ? "text-orange-600 dark:text-orange-400 translate-x-0.5"
                          : "text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500"
                      )}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center space-y-3 px-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  No choreographies found for &ldquo;{query}&rdquo;
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                  Try searching by original song title (e.g. Tauba Tauba, Water, Seven) or dance genre.
                </p>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {["Tauba Tauba", "Water", "Seven", "Calm Down", "Illuminati"].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setQuery(sample)}
                    className="px-3 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full transition"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-4 sm:px-5 py-2.5 bg-neutral-50 dark:bg-neutral-900/80 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-neutral-200/70 dark:bg-neutral-800 rounded font-mono text-[10px]">↑↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-neutral-200/70 dark:bg-neutral-800 rounded font-mono text-[10px]">↵</kbd>
              <span>to open</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-neutral-200/70 dark:bg-neutral-800 rounded font-mono text-[10px]">esc</kbd>
              <span>to close</span>
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              router.push(query ? `/explore?q=${encodeURIComponent(query)}` : "/explore");
            }}
            className="font-medium text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Browse library ({DANCE_ROUTINES.length} dances)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
