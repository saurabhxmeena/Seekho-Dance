import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
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
      className="group flex flex-col bg-white dark:bg-[#18181A] border border-neutral-200/90 dark:border-neutral-800/90 rounded-2xl overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] gpu-layer"
    >
      {/* 1. Video Thumbnail / Cover Image */}
      <div className="relative aspect-[16/10] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={routine.coverImage}
          alt={`${routine.title} dance tutorial`}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* 4. One Small Difficulty Badge in the Corner */}
        <div className="absolute top-3 right-3 pointer-events-none transition-transform duration-300 group-hover:scale-105">
          <Badge
            difficulty={routine.difficulty}
            variant="difficulty"
            className="bg-black/75 text-white dark:bg-white/95 dark:text-neutral-950 backdrop-blur-md border-none shadow-md text-[10px] px-2 py-0.5"
          />
        </div>

        {/* Subtle Hover Play Icon with Apple spring pop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-11 h-11 rounded-full bg-white/95 dark:bg-neutral-950/95 text-neutral-950 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-2xl">
            <Play className="w-4 h-4 fill-current translate-x-0.5 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* 2 & 3. Song Title and Artist Name */}
      <div className="p-3.5 sm:p-4 transition-colors">
        <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-50 tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200 line-clamp-1">
          {routine.title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
          {routine.artist}
        </p>
      </div>
    </Link>
  );
}
