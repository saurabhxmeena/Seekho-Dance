import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DANCE_CATEGORIES } from "@/data/categories";
import { DANCE_ROUTINES } from "@/data/dances";

export const metadata = {
  title: "Dance Styles & Taxonomies | Seekho Dance",
  description: "Explore choreography breakdowns organized by dance style and genre.",
};

export default function StylesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        
        {/* Header */}
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Taxonomy & Genres
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Curated Dance Styles
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            From the viral hooksteps of Bollywood and high-sync K-Pop to grounded African Bacardi and street Hip-Hop grooves.
          </p>
        </div>

        {/* Styles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DANCE_CATEGORIES.map((category) => {
            const routinesInStyle = DANCE_ROUTINES.filter(
              (d) => d.style.toLowerCase().includes(category.slug) || category.name.toLowerCase().includes(d.style.toLowerCase())
            );

            return (
              <div
                key={category.id}
                className="group flex flex-col justify-between rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs hover:border-neutral-400 dark:hover:border-neutral-600 transition duration-200"
              >
                {/* Visual Cover */}
                <div className="relative aspect-[16/9] bg-neutral-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.coverImage}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold text-sm">{category.name}</span>
                    <span className="font-mono text-[11px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md">
                      {routinesInStyle.length} {routinesInStyle.length === 1 ? "routine" : "routines"}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                      {category.tagline}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Sample Songs */}
                  <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Key Songs in this Style
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {category.sampleSongs.map((song) => (
                        <span
                          key={song}
                          className="px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[11px] text-neutral-700 dark:text-neutral-300 font-medium"
                        >
                          {song}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-2">
                    <Link
                      href={`/explore?style=${encodeURIComponent(category.name.split(" ")[0])}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 text-xs font-semibold text-neutral-900 dark:text-white flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Explore {category.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
