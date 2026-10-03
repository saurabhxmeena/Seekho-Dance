import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Play } from "lucide-react";
import { DANCE_CATEGORIES } from "@/data/categories";
import { DANCE_ROUTINES } from "@/data/dances";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";

interface StyleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DANCE_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: StyleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = DANCE_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return { title: "Dance Style — Seekho Dance" };

  return {
    title: `${category.name} — Seekho Dance`,
    description: `${category.description} Learn choreographies tagged ${category.name}.`,
  };
}

export default async function StyleDetailPage({ params }: StyleDetailPageProps) {
  const { slug } = await params;
  const category = DANCE_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Filter routines: strictly match routines that carry this dance style's tag
  const categoryBaseName = category.name
    .replace(" Dance Videos", "")
    .replace("Mixed ", "")
    .trim()
    .toLowerCase();

  const matchingVideos = DANCE_ROUTINES.filter((routine) => {
    if (!routine.tags || routine.tags.length === 0) return false;
    return routine.tags.some((tag) => {
      const t = tag.toLowerCase();
      return (
        t === category.name.toLowerCase() ||
        t === category.slug.toLowerCase() ||
        t === categoryBaseName ||
        t.includes(categoryBaseName) ||
        category.name.toLowerCase().includes(t)
      );
    });
  });

  return (
    <div className="bg-[#FAFAF8] dark:bg-[#0D0D11] text-neutral-900 dark:text-[#EDEDF0] pb-4 sm:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 space-y-6 sm:space-y-8">

        {/* ── Top Apple-style Navigation Bar ── */}
        <div className="flex items-center justify-between">
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition group py-1 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 -translate-x-0.5 group-hover:-translate-x-1 transition-transform text-neutral-400 group-hover:text-orange-500" />
            <span>Search</span>
          </Link>
          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            {matchingVideos.length} {matchingVideos.length === 1 ? "routine" : "routines"}
          </span>
        </div>

        {/* ── Category Hero Banner (Apple Editorial Widescreen) ── */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/70 dark:border-white/[0.08] shadow-sm aspect-[16/10] sm:aspect-[21/9] flex flex-col justify-end p-5 sm:p-8 md:p-10">
          {/* Cover image banner */}
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={category.coverImage}
              alt={category.name}
              className="w-full h-full object-cover opacity-60 dark:opacity-50 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
          </div>

          <div className="relative z-10 space-y-1 sm:space-y-1.5 max-w-2xl">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-orange-400">
              Dance Style
            </p>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {category.name}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300/90 leading-relaxed line-clamp-2">
              {category.tagline || category.description}
            </p>
          </div>
        </div>

        {/* ── Choreographies Section ── */}
        <div className="space-y-3.5 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-neutral-950 dark:text-white tracking-tight">
              All Choreographies
            </h2>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
              {matchingVideos.length} {matchingVideos.length === 1 ? "video" : "videos"}
            </span>
          </div>

          {matchingVideos.length === 0 ? (
            <div className="py-12 text-center bg-white dark:bg-[#161618] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 space-y-3">
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                No videos currently tagged with &ldquo;{category.name}&rdquo;
              </p>
              <p className="text-xs text-neutral-400">
                Check back soon for new step-by-step choreographies in this style.
              </p>
              <Link
                href="/search"
                className="inline-block mt-2 px-4 py-1.5 text-xs font-semibold rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-85 transition"
              >
                Browse Other Styles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {matchingVideos.map((routine) => {
                const duration = routine.durationMinutes
                  ? routine.durationMinutes.replace(" breakdown", "")
                  : "12 min";

                // Identify the matching tag pill for this style
                const primaryStyleTag =
                  routine.tags?.find((t) => {
                    const tagLower = t.toLowerCase();
                    return (
                      tagLower === category.name.toLowerCase() ||
                      tagLower.includes(categoryBaseName) ||
                      category.name.toLowerCase().includes(tagLower)
                    );
                  }) || category.name;

                return (
                  <Link
                    key={routine.id}
                    href={`/dance/${routine.slug || routine.id}`}
                    className="group flex flex-col bg-white dark:bg-[#16161B] border border-neutral-200/70 dark:border-white/[0.08] rounded-2xl overflow-hidden hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg active:scale-[0.98] touch-manipulation shadow-2xs"
                  >
                    {/* Video Thumbnail */}
                    <div className="relative aspect-[16/10] bg-neutral-100 dark:bg-[#1D1D24] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={routine.coverImage}
                        alt={`${routine.title} dance tutorial`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Difficulty Badge (Top Right) */}
                      <div className="absolute top-2.5 right-2.5">
                        <Badge
                          difficulty={routine.difficulty}
                          variant="difficulty"
                          className="bg-black/80 text-white dark:bg-white/95 dark:text-neutral-950 backdrop-blur-md border-none text-[9px] sm:text-[10px] px-2 py-0.5 font-semibold shadow-xs"
                        />
                      </div>

                      {/* Explicit Dance Style Tag Pill (Top Left) */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-orange-600/90 backdrop-blur-md text-[9px] sm:text-[10px] font-semibold text-white shadow-xs">
                          {primaryStyleTag}
                        </span>
                      </div>

                      {/* Duration Pill (Bottom Left) */}
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[9px] sm:text-[10px] font-mono text-white/90">
                        <span>{duration}</span>
                      </div>

                      {/* Hover / Active Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-white/95 dark:bg-neutral-950/95 text-orange-600 dark:text-orange-400 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all duration-200 shadow-xl">
                          <Play className="w-4 h-4 fill-current translate-x-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Routine Details */}
                    <div className="p-3 sm:p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-[#EDEDF0] tracking-tight line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {routine.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-[#9494A0] line-clamp-1 truncate font-medium">
                          {routine.artist}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-neutral-400 dark:text-[#7A7A85] border-t border-neutral-100 dark:border-neutral-800/80">
                        <span>{routine.steps?.length || 4} steps</span>
                        <span>{routine.bpm} BPM</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
