"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  GraduationCap,
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Crown,
  Layers,
  Video,
  Smartphone,
  TrendingUp,
  Footprints,
  Repeat,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { FLAGSHIP_COURSES, FlagshipCourse, CourseChapter } from "@/data/flagshipCourses";
import { UnlockChoreographyModal } from "@/components/payment/UnlockChoreographyModal";
import { accessService } from "@/services/accessService";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Access & Membership State Hooks
// ─────────────────────────────────────────────
function useHasStudioPass(userId: string | null) {
  const [hasPass, setHasPass] = useState(false);
  useEffect(() => {
    if (!userId) {
      setHasPass(false);
      return;
    }
    const profile = accessService.getUserAccess(userId);
    setHasPass(profile.plan === "Studio Pass");
    const unsub = accessService.onAccessChange(() => {
      const updated = accessService.getUserAccess(userId);
      setHasPass(updated.plan === "Studio Pass");
    });
    return unsub;
  }, [userId]);
  return hasPass;
}

function useHasCourse(courseId: string, userId: string | null) {
  const [hasCourse, setHasCourse] = useState(false);
  useEffect(() => {
    if (!userId) {
      setHasCourse(false);
      return;
    }
    const profile = accessService.getUserAccess(userId);
    const hasIt =
      profile.plan === "Studio Pass" ||
      profile.purchasedRoutineIds.includes(courseId);
    setHasCourse(hasIt);
    const unsub = accessService.onAccessChange(() => {
      const updated = accessService.getUserAccess(userId);
      setHasCourse(
        updated.plan === "Studio Pass" ||
          updated.purchasedRoutineIds.includes(courseId)
      );
    });
    return unsub;
  }, [courseId, userId]);
  return hasCourse;
}

// ─────────────────────────────────────────────
// Milestone Journey Data (Reflecting the 2 Programs)
// ─────────────────────────────────────────────
interface MilestoneItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

const ZERO_MILESTONES: MilestoneItem[] = [
  {
    number: "01",
    title: "Rhythm & Foundational Movement",
    subtitle: "Finding comfort with zero experience",
    description: "Internalize musical pulse, recognize the universal 8-count beat, and release body stiffness with simple weight transfers.",
  },
  {
    number: "02",
    title: "Choreography & Combinations",
    subtitle: "Connecting steps with real music",
    description: "Chain footwork and upper-body movements into smooth combinations using slow-motion tempo control and horizontal mirror flip.",
  },
  {
    number: "03",
    title: "Your First Dance Video",
    subtitle: "Recording your first milestone",
    description: "Learn clean smartphone framing, natural lighting, and camera presence to record your very first 30-second dance performance.",
  },
];

const CREATOR_MILESTONES: MilestoneItem[] = [
  {
    number: "01",
    title: "Niche & Channel Architecture",
    subtitle: "Defining your unique creator identity",
    description: "Identify your dance style niche, design cohesive visual branding, and set up an optimized YouTube channel structure.",
  },
  {
    number: "02",
    title: "Smartphone Filming & Lighting",
    subtitle: "Studio-grade quality with your phone",
    description: "Master 4K/60fps camera settings, professional 3-point dance lighting, clean audio sync, and safe music copyright handling.",
  },
  {
    number: "03",
    title: "Editing & Audience Growth",
    subtitle: "Packaging, retention & discovery",
    description: "Structure high-retention dance Shorts, design high-CTR thumbnails, and build a consistent publishing rhythm without burnout.",
  },
  {
    number: "04",
    title: "Ethical Monetization",
    subtitle: "Building long-term creator income",
    description: "Navigate the YouTube Partner Program, music label choreography deals, brand sponsorships, and private online workshops.",
  },
];

// ─────────────────────────────────────────────
// Chapter Accordion Item
// ─────────────────────────────────────────────
interface ChapterRowProps {
  chapter: CourseChapter;
  isOpen: boolean;
  onToggle: () => void;
  hasAccess: boolean;
}

function ChapterRow({ chapter, isOpen, onToggle, hasAccess }: ChapterRowProps) {
  const isInteractive = chapter.statusBadge === "Interactive Practice";
  const isCapstone = chapter.statusBadge === "Capstone Project";

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300 border overflow-hidden",
        isOpen
          ? "bg-white dark:bg-[#15151B] border-neutral-300/80 dark:border-white/[0.12] shadow-sm"
          : "bg-white/60 dark:bg-[#121217]/60 border-neutral-200/70 dark:border-white/[0.05] hover:border-neutral-300 dark:hover:border-white/[0.1]"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <span
            className={cn(
              "w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-mono font-medium transition-colors shrink-0",
              isOpen
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700"
            )}
          >
            {chapter.chapterNumber < 10 ? `0${chapter.chapterNumber}` : chapter.chapterNumber}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm sm:text-base font-semibold text-neutral-950 dark:text-white tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {chapter.title.replace(/^Chapter \d+ — /, "")}
              </h4>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase",
                  isInteractive
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/30"
                    : isCapstone
                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/30"
                    : "bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400"
                )}
              >
                {chapter.statusBadge}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
              {chapter.subtitle}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200",
            isOpen && "rotate-180 text-neutral-900 dark:text-white"
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-0 border-t border-neutral-100 dark:border-neutral-800/60 animate-in fade-in duration-200">
          <div className="pt-4 space-y-4">
            {/* Topic checklist */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Core Topics
              </span>
              <ul className="space-y-2">
                {chapter.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-2" />
                    <span className="leading-relaxed">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practice note */}
            {chapter.practiceNote && (
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#1A1A22] border border-neutral-200/60 dark:border-white/[0.04] text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 mr-1.5">
                  Hands-on Exercise:
                </span>
                {chapter.practiceNote}
              </div>
            )}

            {/* If interactive studio routine linked */}
            {chapter.routineLink && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-orange-500/[0.06] dark:bg-orange-500/[0.08] border border-orange-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-neutral-950 dark:text-white">
                      Practice Routine: {chapter.routineLink.title}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block sm:inline sm:ml-1.5">
                      ({chapter.routineLink.artist})
                    </span>
                  </div>
                </div>
                <Link
                  href={`/dance/${chapter.routineLink.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white transition active:scale-95 shrink-0"
                >
                  <span>Open Studio Practice</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Redesigned Courses Page
// ─────────────────────────────────────────────
export default function CoursesPage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const userId = user?.id || user?.email || null;
  const hasStudioPass = useHasStudioPass(userId);

  // Active flagship course selection (default to Course 01)
  const [activeCourseId, setActiveCourseId] = useState<"course-zero" | "course-creator">("course-zero");
  const activeCourse = FLAGSHIP_COURSES.find((c) => c.id === activeCourseId) || FLAGSHIP_COURSES[0];

  // Check if user owns the currently active course
  const hasActiveCourse = useHasCourse(activeCourse.id, userId);
  const isUnlocked = hasStudioPass || hasActiveCourse;

  // Selected course for checkout modal
  const [checkoutCourse, setCheckoutCourse] = useState<FlagshipCourse | null>(null);

  // Accordion state: open chapter ID
  const [openChapterId, setOpenChapterId] = useState<string>("zero-ch1");

  // Ref to curriculum section for smooth scroll
  const curriculumRef = useRef<HTMLDivElement>(null);

  // Sync open chapter when changing course
  const handleSelectCourse = (id: "course-zero" | "course-creator") => {
    setActiveCourseId(id);
    const target = FLAGSHIP_COURSES.find((c) => c.id === id);
    if (target?.chapters[0]) {
      setOpenChapterId(target.chapters[0].id);
    }
  };

  const handleBuyCourse = (course: FlagshipCourse) => {
    if (!isAuthenticated) {
      openAuthModal(null, `Sign in to enroll in ${course.title}.`, () => {
        setCheckoutCourse(course);
      });
      return;
    }
    setCheckoutCourse(course);
  };

  const handleGetMembership = () => {
    if (!isAuthenticated) {
      openAuthModal(null, "Sign in to activate your Studio Pass.");
      return;
    }
    window.location.href = "/pricing";
  };

  const handlePurchaseSuccess = () => {
    if (checkoutCourse && userId) {
      accessService.grantAccess(userId, checkoutCourse.id);
    }
    setCheckoutCourse(null);
  };

  const activeMilestones = activeCourseId === "course-zero" ? ZERO_MILESTONES : CREATOR_MILESTONES;
  const otherCourseId = activeCourseId === "course-zero" ? "course-creator" : "course-zero";
  const otherCourse = FLAGSHIP_COURSES.find((c) => c.id === otherCourseId) || FLAGSHIP_COURSES[1];

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0B0B0E] text-neutral-900 dark:text-[#EDEDF0] selection:bg-orange-500/20 pb-6 sm:pb-12">

      {/* ──────────────────────────────────────────
          1. HERO — Editorial, Minimal, Restrained
      ────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 pb-8 sm:pb-14 overflow-hidden border-b border-neutral-200/50 dark:border-white/[0.04]">
        {/* Soft Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] rounded-full bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent blur-3xl opacity-60 dark:opacity-40" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/[0.05] border border-neutral-200/80 dark:border-white/[0.08] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
            <span className="text-[11px] font-medium tracking-[0.16em] uppercase text-neutral-600 dark:text-neutral-300">
              Seekho Dance Programs
            </span>
          </div>

          {/* Apple-Caliber Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] text-neutral-950 dark:text-white leading-[1.06]">
              Master the movement.
              <br />
              <span className="text-neutral-400 dark:text-neutral-500 font-normal">
                Or share it with the world.
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed font-normal">
              Two focused programs designed for real outcomes. Learn dance from ground zero, or launch a thriving creator channel.
            </p>
          </div>

          {/* Refined Segmented Control */}
          <div className="pt-3 flex justify-center">
            <div className="inline-flex p-1.5 rounded-full bg-neutral-200/70 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-300/60 dark:border-white/[0.08] shadow-2xs max-w-full overflow-x-auto">
              {FLAGSHIP_COURSES.map((course) => {
                const isActive = activeCourseId === course.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => handleSelectCourse(course.id)}
                    className={cn(
                      "px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 whitespace-nowrap",
                      isActive
                        ? "bg-white dark:bg-[#1E1E24] text-neutral-950 dark:text-white shadow-sm font-semibold"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[10px] font-mono px-1.5 py-0.5 rounded-md transition-colors",
                        isActive
                          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                      )}
                    >
                      {course.number}
                    </span>
                    <span>{course.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          2. COURSE SPOTLIGHT CANVAS
      ────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 space-y-12 sm:space-y-16">

        {/* Masthead Banner */}
        <section className="relative rounded-[28px] sm:rounded-[36px] bg-white dark:bg-[#131318] border border-neutral-200/80 dark:border-white/[0.07] p-6 sm:p-10 lg:p-12 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  {activeCourse.pill}
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                  {activeCourse.chapters.length} Structured Modules
                </span>
                {isUnlocked && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked</span>
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-neutral-950 dark:text-white leading-[1.08]">
                  {activeCourse.title}
                </h2>
                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
                  {activeCourse.subtitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                {activeCourse.overview}
              </p>

              {/* Price & Action Row */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                      ₹{activeCourse.price}
                    </span>
                    <span className="text-xs text-neutral-400">lifetime</span>
                  </div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    or included with ₹499/mo Studio Pass
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleBuyCourse(activeCourse)}
                    disabled={isUnlocked}
                    className={cn(
                      "px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer",
                      isUnlocked
                        ? "bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default"
                        : "bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 shadow-sm"
                    )}
                  >
                    {isUnlocked ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Enrolled & Ready</span>
                      </>
                    ) : (
                      <>
                        <span>Enroll Now — ₹{activeCourse.price}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => curriculumRef.current?.scrollIntoView({ behavior: "smooth" })}
                    className="px-4 py-3 rounded-full text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition cursor-pointer"
                  >
                    View Curriculum ↓
                  </button>
                </div>
              </div>
            </div>

            {/* Right Media Preview */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/[0.08] shadow-md group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeCourse.coverImage}
                  alt={activeCourse.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-orange-400 font-semibold">
                    Course {activeCourse.number}
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-white/95 leading-snug">
                    {activeCourse.headline}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ──────────────────────────────────────────
            3. THE PROGRESSIVE LEARNING JOURNEY
        ────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-orange-600 dark:text-orange-400">
              The Journey Arc
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-neutral-950 dark:text-white">
              {activeCourseId === "course-zero"
                ? "From your first step to your first recorded video."
                : "From channel concept to audience and monetization."}
            </h3>
          </div>

          <div
            className={cn(
              "grid gap-4 sm:gap-6",
              activeMilestones.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            )}
          >
            {activeMilestones.map((m, idx) => (
              <div
                key={m.number}
                className="relative rounded-2xl sm:rounded-3xl bg-white dark:bg-[#131318] border border-neutral-200/70 dark:border-white/[0.06] p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-neutral-300 dark:hover:border-white/[0.12] transition-colors shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-orange-600 dark:text-orange-400">
                      Step {m.number}
                    </span>
                    {idx < activeMilestones.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 hidden md:block" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-neutral-950 dark:text-white tracking-tight">
                      {m.title}
                    </h4>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                      {m.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────
            4. STRUCTURED CURRICULUM BREAKDOWN
        ────────────────────────────────────────── */}
        <section ref={curriculumRef} className="space-y-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200/60 dark:border-white/[0.06] pb-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-orange-600 dark:text-orange-400">
                Curriculum Structure
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-neutral-950 dark:text-white mt-0.5">
                6 Structured Chapters
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Detailed step-by-step breakdown & interactive practice
            </p>
          </div>

          <div className="space-y-2.5">
            {activeCourse.chapters.map((chapter) => (
              <ChapterRow
                key={chapter.id}
                chapter={chapter}
                isOpen={openChapterId === chapter.id}
                onToggle={() =>
                  setOpenChapterId(openChapterId === chapter.id ? "" : chapter.id)
                }
                hasAccess={isUnlocked}
              />
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────
            5. ACCESS & ENROLLMENT (Clean, Apple-Style)
        ────────────────────────────────────────── */}
        <section className="space-y-6 pt-4">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-orange-600 dark:text-orange-400">
              Clear & Transparent Access
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-neutral-950 dark:text-white">
              Choose how you want to learn.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Purchase this course individually with lifetime ownership, or unlock everything with the monthly Studio Pass.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

            {/* Path 1: Standalone Course Lifetime Access */}
            <div className="rounded-[28px] bg-white dark:bg-[#131318] border border-neutral-200/80 dark:border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-neutral-300 dark:hover:border-white/[0.14] transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Individual Course
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    Lifetime Access
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                      ₹{activeCourse.price}
                    </span>
                    <span className="text-xs text-neutral-400">one-time payment</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Permanent access to {activeCourse.title}. No renewals or recurring charges.
                  </p>
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-800/80 pt-4 space-y-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>All 6 chapters of {activeCourse.title} unlocked</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>Permanent lifetime access — never expires</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>Secure server-verified checkout with Razorpay</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleBuyCourse(activeCourse)}
                disabled={isUnlocked}
                className={cn(
                  "w-full py-3.5 px-5 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer",
                  isUnlocked
                    ? "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-400 cursor-default"
                    : "bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 shadow-sm"
                )}
              >
                {isUnlocked ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Course Unlocked</span>
                  </>
                ) : (
                  <>
                    <span>Buy Course — ₹{activeCourse.price}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Path 2: Seekho Studio Pass Membership */}
            <div className="rounded-[28px] bg-white dark:bg-[#131318] border-2 border-orange-500/40 dark:border-orange-500/40 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-600 text-white uppercase tracking-wider">
                  Full Studio Access
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    Seekho Studio Pass
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                      ₹499
                    </span>
                    <span className="text-xs text-neutral-400">/ month</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Continuous access to <strong>both</strong> courses plus the complete 100+ song routine library.
                  </p>
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-800/80 pt-4 space-y-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>Includes <strong>Dance From Zero</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>Includes <strong>Create Your Dance Channel</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>100+ Bollywood & folk routine breakdowns</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>Mirror flip mode, 0.5x tempo slow-mo & loop tools</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                    <span>Cancel anytime online — no lock-in</span>
                  </div>
                </div>
              </div>

              {hasStudioPass ? (
                <div className="w-full py-3.5 px-5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Studio Pass Active</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGetMembership}
                  className="w-full py-3.5 px-5 rounded-full text-xs sm:text-sm font-semibold bg-orange-600 hover:bg-orange-500 text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Activate Studio Pass — ₹499/mo</span>
                </button>
              )}
            </div>

          </div>
        </section>

        {/* ──────────────────────────────────────────
            6. SUBTLE CROSS-LINK TO THE OTHER PROGRAM
        ────────────────────────────────────────── */}
        <section className="pt-4">
          <div className="rounded-2xl sm:rounded-3xl bg-neutral-100/70 dark:bg-[#121217] border border-neutral-200/60 dark:border-white/[0.05] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Alternative Program
              </span>
              <h4 className="text-sm sm:text-base font-semibold text-neutral-950 dark:text-white">
                Looking for Course {otherCourse.number}: {otherCourse.title}?
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {otherCourse.subtitle}
              </p>
            </div>

            <button
              onClick={() => {
                handleSelectCourse(otherCourse.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition cursor-pointer active:scale-95 shrink-0"
            >
              <span>Switch to {otherCourse.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

      </main>

      {/* ──────────────────────────────────────────
          CHECKOUT MODAL (Preserved Razorpay Flow)
      ────────────────────────────────────────── */}
      {checkoutCourse && (
        <UnlockChoreographyModal
          isOpen={Boolean(checkoutCourse)}
          onClose={() => setCheckoutCourse(null)}
          courseId={checkoutCourse.id}
          courseTitle={checkoutCourse.title}
          price={checkoutCourse.price}
          onSuccess={handlePurchaseSuccess}
        />
      )}

    </div>
  );
}
