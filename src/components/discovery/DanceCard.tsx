import React from "react";
import Link from "next/link";
import { Play, Clock, Flame } from "lucide-react";
import { DanceRoutine } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface DanceCardProps {
  routine: DanceRoutine;
  featured?: boolean;
}

export function DanceCard({ routine }: DanceCardProps) {
  return (
    <Link
      href={`/dance/${routine.id}`}
      className="group flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800/90 rounded-2xl overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 hover:shadow-md"
    >
      {/* Visual Cover / Preview */}
      <div className="relative aspect-[16/10] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={routine.coverImage}
          alt={`${routine.title} dance tutorial`}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges on Image */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 text-white backdrop-blur-xs border border-white/15">
              {routine.style}
            </span>
            {routine.isTrending && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-orange-600 text-white flex items-center gap-0.5 shadow-xs">
                <Flame className="w-2.5 h-2.5" /> Trending
              </span>
            )}
          </div>
          <Badge difficulty={routine.difficulty} variant="difficulty" className="bg-white/95 text-neutral-900 border-none shadow-xs text-[10px]" />
        </div>

        {/* Hover Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/95 dark:bg-neutral-950/95 text-neutral-950 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all duration-200 shadow-xl">
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          </div>
        </div>

        {/* Bottom Bar Info on Cover */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-300" />
            {routine.steps.length} Steps • {routine.durationMinutes}
          </span>
          <span className="font-mono text-neutral-300">
            {routine.bpm} BPM
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-50 tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
            {routine.title}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
            {routine.artist}
          </p>
        </div>

        {/* Creator Info Footer */}
        <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={routine.creatorAvatar}
              alt={routine.creator}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700 shrink-0"
            />
            <span className="text-neutral-600 dark:text-neutral-300 truncate text-[11px] font-medium">
              Choreo by {routine.creator}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-900 dark:text-neutral-100 group-hover:translate-x-0.5 transition-transform shrink-0">
            Learn →
          </span>
        </div>
      </div>
    </Link>
  );
}
