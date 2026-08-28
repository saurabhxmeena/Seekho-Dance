"use client";

import React, { useState, useEffect } from "react";
import { Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountSheetProps {
  bpm: number;
  isPlaying: boolean;
  countNotation: string;
  keyCounts: string[];
}

export function CountSheet({ bpm, isPlaying, countNotation, keyCounts }: CountSheetProps) {
  const [currentBeat, setCurrentBeat] = useState<number>(1);

  useEffect(() => {
    if (!isPlaying) {
      setCurrentBeat(1);
      return;
    }

    const intervalMs = (60 / bpm) * 1000;
    const timer = setInterval(() => {
      setCurrentBeat((prev) => (prev >= 8 ? 1 : prev + 1));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, bpm]);

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3 sm:space-y-3.5 shadow-xs transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-1 rounded-md transition-all", isPlaying && "text-orange-600 animate-pulse")}>
            <Music2 className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            8-Count Rhythm Breakdown
          </h4>
        </div>
        <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
          Tempo: <strong className="text-neutral-900 dark:text-neutral-200">{bpm} BPM</strong>
        </span>
      </div>

      {/* 8 Beat Pulse Bar */}
      <div className="grid grid-cols-8 gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((beat) => {
          const isCurrent = isPlaying && currentBeat === beat;
          const isDownbeat = beat === 1 || beat === 5;
          return (
            <div
              key={beat}
              className={cn(
                "h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-150 font-mono select-none relative overflow-hidden gpu-layer",
                isCurrent
                  ? "bg-orange-600 text-white font-bold scale-105 sm:scale-108 shadow-lg shadow-orange-600/40 z-10"
                  : isDownbeat
                  ? "bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold"
                  : "bg-neutral-100 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400"
              )}
            >
              {isCurrent && (
                <span className="absolute inset-0 bg-white/25 animate-pulse pointer-events-none" />
              )}
              <span className="text-xs sm:text-sm font-bold leading-tight relative z-10">{beat}</span>
              <span className="text-[7px] sm:text-[9px] uppercase tracking-tighter opacity-80 leading-none relative z-10 mt-0.5">
                {isDownbeat ? "hit" : "&"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Count Notation Text */}
      <div className="p-3 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200/70 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 font-mono leading-relaxed break-words shadow-2xs">
        <span className="text-orange-600 dark:text-orange-400 font-semibold mr-1.5">Notation:</span>
        {countNotation}
      </div>

      {/* Key Counts List */}
      {keyCounts && keyCounts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 pt-0.5">
          {keyCounts.map((countItem, idx) => (
            <div
              key={idx}
              className="px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-800/80 text-[10px] sm:text-[11px] text-neutral-600 dark:text-neutral-300 truncate shadow-2xs"
              title={countItem}
            >
              {countItem}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
