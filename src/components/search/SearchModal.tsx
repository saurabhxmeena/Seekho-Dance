"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Music, Flame, ArrowRight, Play } from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { DanceRoutine } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DanceRoutine[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase().trim();
    const filtered = DANCE_ROUTINES.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.artist.toLowerCase().includes(q) ||
        d.creator.toLowerCase().includes(q) ||
        d.style.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query]);

  const handleSelectRoutine = (routineId: string) => {
    onClose();
    router.push(`/dance/${routineId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs transition-opacity">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-neutral-200 dark:border-neutral-800 px-4 py-3.5">
          <Search className="w-5 h-5 text-neutral-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by song name, artist, or creator... (e.g. Tauba Tauba, Tyla, Seven)"
            className="w-full bg-transparent text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none pr-8 font-normal"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
              ESC
            </kbd>
          )}
        </form>

        {/* Content Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {query.trim() === "" ? (
            <div className="space-y-4 py-2">
              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5 px-2">
                  <Flame className="w-3.5 h-3.5 text-orange-600" />
                  Trending Searches
                </div>
                <div className="flex flex-wrap gap-2 px-2">
                  {["Tauba Tauba", "Water Tyla", "Seven Jung Kook", "Calm Down", "Illuminati", "Chaleya", "Greedy"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse Quick Categories */}
              <div className="pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5 px-2">
                  Dance Styles
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-2">
                  {[
                    { name: "Bollywood", query: "Bollywood" },
                    { name: "Afro Fusion", query: "Afro" },
                    { name: "K-Pop", query: "K-Pop" },
                    { name: "Urban Hip-Hop", query: "Hip-Hop" },
                    { name: "South Fusion", query: "South Fusion" },
                    { name: "Contemporary", query: "Contemporary" },
                  ].map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        onClose();
                        router.push(`/explore?style=${encodeURIComponent(cat.query)}`);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-800/30 text-left transition"
                    >
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">{cat.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 px-2">
                Matches ({results.length})
              </div>
              {results.map((routine) => (
                <button
                  key={routine.id}
                  onClick={() => handleSelectRoutine(routine.id)}
                  className="w-full flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors text-left group"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={routine.coverImage}
                      alt={routine.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {routine.title}
                      </h4>
                      <Badge difficulty={routine.difficulty} variant="difficulty" className="text-[10px] py-0" />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {routine.artist}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                      <span>Choreo: {routine.creator}</span>
                      <span>•</span>
                      <span>{routine.steps.length} Steps</span>
                      <span>•</span>
                      <span>{routine.durationMinutes}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                </button>
              ))}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-center">
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 inline-flex items-center gap-1 py-1"
                >
                  View all results for &quot;{query}&quot; <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Music className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                No dance tutorials found for &quot;{query}&quot;
              </p>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Try searching by song name (e.g. &quot;Tauba Tauba&quot;), dance style, or creator name.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/80 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Tip: Learn dances from viral YouTube songs step-by-step</span>
          <button
            onClick={onClose}
            className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
