import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DanceRoutine } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function filterDances(
  dances: DanceRoutine[],
  options: {
    query?: string;
    style?: string;
    difficulty?: string;
    sortBy?: 'featured' | 'newest' | 'bpm';
  }
): DanceRoutine[] {
  return dances.filter((dance) => {
    if (options.query) {
      const q = options.query.toLowerCase().trim();
      const matchTitle = dance.title.toLowerCase().includes(q);
      const matchArtist = dance.artist.toLowerCase().includes(q);
      const matchCreator = dance.creator.toLowerCase().includes(q);
      const matchStyle = dance.style.toLowerCase().includes(q);
      const matchTag = dance.description.toLowerCase().includes(q);
      if (!matchTitle && !matchArtist && !matchCreator && !matchStyle && !matchTag) {
        return false;
      }
    }

    if (options.style && options.style !== 'All') {
      if (!dance.style.toLowerCase().includes(options.style.toLowerCase())) {
        return false;
      }
    }

    if (options.difficulty && options.difficulty !== 'All') {
      if (dance.difficulty.toLowerCase() !== options.difficulty.toLowerCase()) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (options.sortBy === 'featured') {
      const scoreA = (a.isFeatured ? 2 : 0) + (a.isTrending ? 1 : 0);
      const scoreB = (b.isFeatured ? 2 : 0) + (b.isTrending ? 1 : 0);
      return scoreB - scoreA;
    }
    if (options.sortBy === 'newest') {
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    }
    if (options.sortBy === 'bpm') {
      return a.bpm - b.bpm;
    }
    return 0;
  });
}
