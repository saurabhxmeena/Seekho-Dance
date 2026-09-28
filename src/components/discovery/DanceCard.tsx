import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { DanceRoutine } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface DanceCardProps {
  routine: DanceRoutine;
  featured?: boolean;
  className?: string;
}

export function DanceCard({ routine, className }: DanceCardProps) {
  const duration = routine.durationMinutes
    ? routine.durationMinutes.replace(" breakdown", "")
    : "12 min";

  return (
    <Link
      href={`/dance/${routine.id}`}
      className={cn(
        "group flex flex-col bg-white dark:bg-[#16161B] border border-neutral-200/70 dark:border-white/[0.08] rounded-2xl overflow-hidden hover:border-neutral-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-md active:scale-[0.98] touch-manipulation",
        className
      )}
    >
      {/* 1. Video Thumbnail */}
      <div className="relative aspect-[16/10] bg-neutral-100 dark:bg-[#1D1D24] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={routine.coverImage}
          alt={`${routine.title} dance tutorial`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

        {/* Difficulty Badge (Top Right) */}
        <div className="absolute top-2 right-2">
          <Badge
            difficulty={routine.difficulty}
            variant="difficulty"
            className="bg-black/80 text-white dark:bg-white/95 dark:text-neutral-950 backdrop-blur-md border-none text-[9px] sm:text-[10px] px-1.5 py-0.5 font-semibold shadow-xs"
          />
        </div>

        {/* Duration / Steps Pill (Bottom Left) */}
        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[9px] sm:text-[10px] font-mono text-white/90">
          <span>{duration}</span>
        </div>

        {/* Hover / Active Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-neutral-950/95 text-orange-600 dark:text-orange-400 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all duration-200 shadow-xl">
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* 2. Learning Content Information */}
      <div className="p-2.5 sm:p-3.5 space-y-1">
        <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-[#EDEDF0] tracking-tight line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
          {routine.title}
        </h4>

        <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-[#9494A0] line-clamp-1 truncate font-medium">
          {routine.artist}
        </p>

        {/* Learning Specs: Steps • BPM */}
        <div className="pt-0.5 flex items-center justify-between text-[10px] font-mono text-neutral-400 dark:text-[#7A7A85]">
          <span>{routine.steps?.length || 4} steps</span>
          <span>{routine.bpm} BPM</span>
        </div>
      </div>
    </Link>
  );
}
