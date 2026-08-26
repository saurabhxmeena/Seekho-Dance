import React from "react";
import Link from "next/link";
import { Play, Sparkles, Disc3, ArrowRight, User } from "lucide-react";
import { DanceRoutine } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";

interface SongRowProps {
  routine: DanceRoutine;
  index: number;
}

export function SongRow({ routine, index }: SongRowProps) {
  return (
    <Link
      href={`/dance/${routine.id}`}
      className="group flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-150 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40"
    >
      {/* Left: Index & Thumbnail & Titles */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
        <span className="font-mono text-xs font-semibold text-neutral-400 w-4 sm:w-6 text-center shrink-0">
          {(index + 1).toString().padStart(2, "0")}
        </span>

        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={routine.coverImage}
            alt={routine.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {routine.title}
            </h4>
            <Badge difficulty={routine.difficulty} variant="difficulty" className="hidden sm:inline-flex text-[10px] py-0" />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
            {routine.artist}
          </p>
        </div>
      </div>

      {/* Middle: Choreographer & Style (hidden on very small screens) */}
      <div className="hidden md:flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1.5 min-w-[130px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={routine.creatorAvatar}
            alt={routine.creator}
            className="w-4 h-4 rounded-full object-cover"
          />
          <span className="truncate">{routine.creator}</span>
        </div>
        <span className="w-20 text-neutral-400">{routine.style}</span>
        <span className="font-mono text-[11px] text-neutral-400">{routine.bpm} BPM</span>
      </div>

      {/* Right: CTA & Steps info */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
            {routine.steps.length} Steps
          </div>
          <div className="text-[11px] text-neutral-400">{routine.durationMinutes}</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 group-hover:bg-neutral-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-950 flex items-center justify-center transition-colors">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
