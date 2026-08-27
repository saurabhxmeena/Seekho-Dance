import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DANCE_CATEGORIES } from "@/data/categories";

export const metadata = {
  title: "Dance Styles & Categories | Seekho Dance",
  description: "Explore curated dance styles from Bollywood and Traditional to Rajasthani, Haryanvi, and Wedding choreography.",
};

export default function StylesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12">
        
        {/* Header (Clean & Minimal) */}
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Dance Categories
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Dance Styles
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Choose your preferred style and master verified step-by-step choreographies.
          </p>
        </div>

        {/* Styles Grid (Clean, Focused, Minimal) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DANCE_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/explore?style=${encodeURIComponent(category.name)}`}
              className="group relative rounded-3xl overflow-hidden aspect-[16/11] bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-end p-6 hover:shadow-xl hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 active:scale-98"
            >
              {/* Background Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.coverImage}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Minimal Content */}
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {category.name}
                  </h3>
                  <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs text-neutral-300 line-clamp-1">
                  {category.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
