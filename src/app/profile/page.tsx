"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Play,
  Sparkles,
  CheckCircle2,
  Flame,
  ArrowRight,
  Mail,
  Trophy,
  Sliders,
  RotateCcw,
  Calendar,
  Layers,
  Edit2,
  Check,
  X,
  Bookmark,
  Trash2,
  Zap,
  MapPin,
  Share2,
} from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getUserProfile, saveUserProfile, getSavedDances, toggleSaveDance, UserProfileData } from "@/lib/storage";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";
import { accessService } from "@/services/accessService";
import { LogOut, LogIn, ShieldCheck, UserCheck } from "lucide-react";

interface InProgressRoutine {
  routineId: string;
  currentStep: number;
  totalSteps: number;
  stepName: string;
  status: "in-progress" | "mastered";
  lastPracticed: string;
}

// Starburst Scallop Badge SVG Component
function StarburstBadge({
  number,
  color,
}: {
  number: string | number;
  color: "orange" | "purple" | "dark";
}) {
  const colorMap = {
    orange: "fill-[#F95721] text-white",
    purple: "fill-[#6C63FF] text-white",
    dark: "fill-[#1E1E24] dark:fill-[#2A2A32] text-white",
  };

  return (
    <div className="relative inline-flex items-center justify-center w-10 h-10 transition-transform hover:scale-110">
      <svg
        viewBox="0 0 40 40"
        className={cn("w-full h-full drop-shadow-sm", colorMap[color])}
      >
        <path d="M20 0 C22 4, 25 4, 28 2 C31 0, 33 2, 34 5 C35 8, 38 9, 39 12 C40 15, 39 17, 38 20 C39 23, 40 25, 39 28 C38 31, 35 32, 34 35 C33 38, 31 40, 28 38 C25 36, 22 36, 20 40 C18 36, 15 36, 12 38 C9 40, 7 38, 6 35 C5 32, 2 31, 1 28 C0 25, 1 23, 2 20 C1 17, 0 15, 1 12 C2 9, 5 8, 6 5 C7 2, 9 0, 12 2 C15 4, 18 4, 20 0 Z" />
      </svg>
      <span className="absolute font-bold text-xs tracking-tight font-sans">
        {number}
      </span>
    </div>
  );
}

// Devices Icon for Sync Across Devices benefit card (matching reference)
function DevicesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="13" height="10" x="2" y="4" rx="2" />
      <path d="M7 18h4" />
      <path d="M9 14v4" />
      <rect width="6" height="10" x="15" y="10" rx="1.5" />
      <circle cx="18" cy="17.5" r=".5" fill="currentColor" />
    </svg>
  );
}

export default function ProfilePage() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut, openAuthModal, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<"learning" | "mastered" | "saved" | "settings">("learning");

  // User profile state
  const [profile, setProfile] = useState<UserProfileData>({
    name: user?.name || "Seekho Dancer",
    email: user?.email || "dancer@seekhodance.com",
    plan: "Free Explorer",
    dailyGoalMinutes: 15,
    streakDays: 26,
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "Seekho Dancer");

  // Saved songs state
  const [savedIds, setSavedIds] = useState<string[]>(["chaleya", "natu-natu", "ghungroo"]);

  // Studio preferences state
  const [autoMirror, setAutoMirror] = useState(true);
  const [defaultSpeed, setDefaultSpeed] = useState<"0.5" | "0.75" | "1.0">("0.75");
  const [metronomeSound, setMetronomeSound] = useState(true);

  // Sync user info and access status
  useEffect(() => {
    if (user) {
      const access = accessService.getUserAccess(user.id || user.email);
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        plan: access.plan,
      }));
      setNameInput(user.name || "Seekho Dancer");
    }
    setSavedIds(getSavedDances());
  }, [user, isAuthenticated]);

  // Subscribe to access changes
  useEffect(() => {
    const unsub = accessService.onAccessChange(() => {
      if (user) {
        const access = accessService.getUserAccess(user.id || user.email);
        setProfile((prev) => ({ ...prev, plan: access.plan }));
      }
    });
    return () => unsub();
  }, [user]);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      saveUserProfile({ name: nameInput.trim() });
      setProfile((prev) => ({ ...prev, name: nameInput.trim() }));
    }
    setIsEditingName(false);
  };

  const handleRemoveSaved = (routineId: string) => {
    toggleSaveDance(routineId);
    setSavedIds(getSavedDances());
  };

  const handleTogglePlan = (newPlan: "Free Explorer" | "Studio Pass") => {
    if (!user) return;
    if (newPlan === "Studio Pass") {
      accessService.grantAccess(user.id || user.email, "pass-monthly");
    } else {
      accessService.revokeAllAccess(user.id || user.email);
    }
    setProfile((prev) => ({ ...prev, plan: newPlan }));
  };

  // Sample progress records
  const inProgressList: InProgressRoutine[] = [
    {
      routineId: "tauba-tauba",
      currentStep: 2,
      totalSteps: 6,
      stepName: "Heel-Toe Weight Shift & Jacket Flick",
      status: "in-progress",
      lastPracticed: "Today",
    },
    {
      routineId: "water",
      currentStep: 1,
      totalSteps: 5,
      stepName: "Isolations & Hip Roll Foundation",
      status: "in-progress",
      lastPracticed: "Yesterday",
    },
    {
      routineId: "seven",
      currentStep: 4,
      totalSteps: 6,
      stepName: "Full Rhythm Chorus Combo",
      status: "in-progress",
      lastPracticed: "2 days ago",
    },
  ];

  const masteredList: InProgressRoutine[] = [
    {
      routineId: "illuminati",
      currentStep: 5,
      totalSteps: 5,
      stepName: "100% Full Tempo Performance",
      status: "mastered",
      lastPracticed: "3 days ago",
    },
  ];

  const learningRoutines = inProgressList
    .map((item) => {
      const routine = DANCE_ROUTINES.find((d) => d.id === item.routineId);
      return routine ? { ...routine, progress: item } : null;
    })
    .filter(Boolean);

  const masteredRoutines = masteredList
    .map((item) => {
      const routine = DANCE_ROUTINES.find((d) => d.id === item.routineId);
      return routine ? { ...routine, progress: item } : null;
    })
    .filter(Boolean);

  const savedRoutines = savedIds
    .map((id) => DANCE_ROUTINES.find((d) => d.id === id))
    .filter(Boolean);

  const weekDays = [
    { day: "M", label: "Mon", active: true },
    { day: "T", label: "Tue", active: true },
    { day: "W", label: "Wed", active: true },
    { day: "T", label: "Thu", active: true },
    { day: "F", label: "Fri", active: true },
    { day: "S", label: "Sat", active: true },
    { day: "S", label: "Sun", active: false },
  ];

  if (!isAuthenticated) {
    return (
      <div className="w-full flex-1 flex flex-col justify-center bg-[#FAF7F2] dark:bg-[#0D0D11] text-neutral-900 dark:text-[#EDEDF0] pt-2 sm:pt-5 md:pt-8 lg:pt-10 pb-6 sm:pb-8 md:pb-12 px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Mobile View (< md): Exact approved pixel-perfect smartphone experience */}
        <div className="md:hidden w-full max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-4.5 animate-in fade-in duration-200">
          
          {/* Hero Section with Classical Dancer Illustration & Sun Disc Backdrop */}
          <div className="relative w-full pt-1 pb-1 min-h-[220px] sm:min-h-[250px] flex items-center">
            {/* Ambient Soft Glow to Seamlessly Blend Image with Page Canvas */}
            <div
              aria-hidden="true"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[240px] sm:w-[280px] h-[220px] sm:h-[260px] bg-gradient-to-l from-amber-200/35 via-orange-100/20 to-transparent dark:from-amber-600/15 dark:via-orange-500/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10"
            />

            {/* Bharatanatyam Dancer Illustration on Right */}
            <div className="absolute right-0 top-0 bottom-0 w-[205px] sm:w-[250px] pointer-events-none select-none z-0">
              <Image
                src="/profile_hero_dancer_light.png"
                alt="Bharatanatyam Dancer"
                fill
                sizes="(max-width: 640px) 205px, 250px"
                className="object-contain object-right-bottom dark:hidden drop-shadow-[0_4px_16px_rgba(235,160,90,0.12)]"
                priority
              />
              <Image
                src="/profile_hero_dancer_dark.png"
                alt="Bharatanatyam Dancer"
                fill
                sizes="(max-width: 640px) 205px, 250px"
                className="object-contain object-right-bottom hidden dark:block drop-shadow-[0_4px_24px_rgba(245,158,11,0.15)]"
                priority
              />
            </div>

            {/* Headline and Supporting Copy */}
            <div className="relative z-10 max-w-[200px] sm:max-w-xs space-y-1">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F95721] block">
                YOUR DANCE JOURNEY
              </span>
              <h1 className="text-[28px] sm:text-[35px] font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.08] pt-0.5">
                Keep your<br />
                progress<br />
                in motion.
              </h1>
              <p className="text-[12px] sm:text-[13px] text-neutral-500 dark:text-neutral-400 leading-snug pt-1">
                Save routines, track practice,<br />
                and unlock studio<br />
                breakdown tools.
              </p>
            </div>
          </div>

          {/* Elevated Auth Action Card */}
          <div className="relative z-10 rounded-[28px] bg-white dark:bg-[#16161B] border border-neutral-200/80 dark:border-white/[0.08] p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-none space-y-3">
            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full h-12 py-3 px-4 rounded-2xl bg-white dark:bg-[#1C1C22] border border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-white text-sm font-semibold flex items-center justify-center gap-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition active:scale-[0.99] shadow-2xs cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Email Login Button */}
            <button
              type="button"
              onClick={() => openAuthModal(null, "Sign in or create your Seekho Dance account")}
              className="w-full h-12 py-3 px-4 rounded-2xl bg-[#141416] dark:bg-white text-white dark:text-neutral-950 text-sm font-semibold flex items-center justify-center relative hover:bg-neutral-800 dark:hover:bg-neutral-200 transition active:scale-[0.99] shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4.5 h-4.5 shrink-0 stroke-[2.2px]" />
                <span>Continue with Email</span>
              </div>
              <ArrowRight className="w-4.5 h-4.5 shrink-0 stroke-[2.2px] absolute right-4" />
            </button>

            {/* Footnote */}
            <p className="text-[11.5px] sm:text-xs text-neutral-500 dark:text-neutral-400 text-center font-normal pt-0.5">
              Free to browse • No credit card required
            </p>
          </div>

          {/* Feature Section Header - Left Aligned */}
          <div className="space-y-2.5 pt-1">
            <h2 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white tracking-tight">
              Why create an account?
            </h2>

            {/* 2x2 Feature Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {/* Card 1: Mirror Mode & Controls */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#16161B] border border-neutral-200/70 dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none flex items-start gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FFF5EC] dark:bg-orange-950/40 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#F95721] stroke-[2.2px]" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h3 className="font-bold text-[11.5px] sm:text-xs text-neutral-950 dark:text-white leading-tight">
                    Mirror Mode & Controls
                  </h3>
                  <p className="text-[9.5px] sm:text-[10.5px] text-neutral-500 dark:text-neutral-400 leading-snug">
                    Flip videos and adjust speed to 0.5x.
                  </p>
                </div>
              </div>

              {/* Card 2: Save Practice Routines */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#16161B] border border-neutral-200/70 dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none flex items-start gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FFF5EC] dark:bg-orange-950/40 flex items-center justify-center shrink-0">
                  <Bookmark className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#F95721] stroke-[2.2px]" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h3 className="font-bold text-[11.5px] sm:text-xs text-neutral-950 dark:text-white leading-tight">
                    Save Practice Routines
                  </h3>
                  <p className="text-[9.5px] sm:text-[10.5px] text-neutral-500 dark:text-neutral-400 leading-snug">
                    Bookmark songs and continue where you left off.
                  </p>
                </div>
              </div>

              {/* Card 3: Practice Streaks */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#16161B] border border-neutral-200/70 dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none flex items-start gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FFF5EC] dark:bg-orange-950/40 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#F95721] stroke-[2.2px]" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h3 className="font-bold text-[11.5px] sm:text-xs text-neutral-950 dark:text-white leading-tight">
                    Practice Streaks
                  </h3>
                  <p className="text-[9.5px] sm:text-[10.5px] text-neutral-500 dark:text-neutral-400 leading-snug">
                    Build consistency and earn badges.
                  </p>
                </div>
              </div>

              {/* Card 4: Sync Across Devices */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#16161B] border border-neutral-200/70 dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none flex items-start gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FFF5EC] dark:bg-orange-950/40 flex items-center justify-center shrink-0">
                  <DevicesIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#F95721] stroke-[2.2px]" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h3 className="font-bold text-[11.5px] sm:text-xs text-neutral-950 dark:text-white leading-tight">
                    Sync Across Devices
                  </h3>
                  <p className="text-[9.5px] sm:text-[10.5px] text-neutral-500 dark:text-neutral-400 leading-snug">
                    Access your progress on phone, tablet, and desktop.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Desktop View (>= md): Widescreen 2-Column Experience In True Accordance With Smartphone Aesthetics */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-8 lg:gap-12 xl:gap-16 items-center w-full max-w-5xl lg:max-w-6xl mx-auto py-2 lg:py-6 animate-in fade-in duration-200">
          
          {/* Left Column: Brand Hero & Classical Dancer Artwork Showcase */}
          <div className="md:col-span-6 lg:col-span-6 space-y-5 lg:space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100/70 text-[#F95721] dark:bg-orange-950/40 dark:text-orange-400">
                YOUR DANCE JOURNEY
              </span>
              <h1 className="text-3xl lg:text-4xl xl:text-[42px] font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.12]">
                Keep your progress <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">in motion.</span>
              </h1>
              <p className="text-sm lg:text-[15px] text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-md pt-1">
                Save routines, track practice streaks, mirror tutorials, and unlock step-by-step choreographies crafted by India&apos;s top instructors.
              </p>
            </div>

            {/* Classical Dancer Artwork Container with Ambient Light Sun Disc */}
            <div className="relative w-full h-[310px] lg:h-[360px] rounded-3xl overflow-hidden bg-gradient-to-b from-amber-50/60 via-orange-50/20 to-transparent dark:from-white/[0.03] dark:via-transparent dark:to-transparent border border-neutral-200/60 dark:border-white/[0.06] p-6 flex items-end justify-center shadow-xs">
              {/* Radial Sun Disc / Ethereal Backglow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-tr from-amber-200/35 via-orange-100/20 to-transparent dark:from-amber-600/20 dark:via-orange-500/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10"
              />

              {/* Bharatanatyam Dancer Artwork */}
              <div className="relative w-full h-full pointer-events-none select-none">
                <Image
                  src="/profile_hero_dancer_light.png"
                  alt="Bharatanatyam Dancer"
                  fill
                  sizes="(min-width: 1024px) 450px, 350px"
                  className="object-contain object-bottom dark:hidden drop-shadow-[0_8px_24px_rgba(235,160,90,0.18)]"
                  priority
                />
                <Image
                  src="/profile_hero_dancer_dark.png"
                  alt="Bharatanatyam Dancer"
                  fill
                  sizes="(min-width: 1024px) 450px, 350px"
                  className="object-contain object-bottom hidden dark:block drop-shadow-[0_8px_32px_rgba(245,158,11,0.22)]"
                  priority
                />
              </div>

              {/* Floating Bottom Quality Pill */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-medium text-neutral-600 dark:text-neutral-400 bg-white/85 dark:bg-[#16161B]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-neutral-200/60 dark:border-white/[0.08] shadow-xs">
                <span className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-white">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  Bollywood • Classical • Bhangra
                </span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">50+ Routines</span>
              </div>
            </div>
          </div>

          {/* Right Column: Elevated Auth Action Card & 2x2 Feature Grid */}
          <div className="md:col-span-6 lg:col-span-6 space-y-5">
            {/* Elevated Auth Action Card */}
            <div className="rounded-[28px] bg-white dark:bg-[#16161B] border border-neutral-200/80 dark:border-white/[0.08] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-none space-y-3.5">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-neutral-950 dark:text-white">
                  Sign in or create account
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Instant access to practice bookmarks, streaks & studio tools
                </p>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="w-full h-12 py-3 px-4 rounded-2xl bg-white dark:bg-[#1C1C22] border border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-white text-sm font-semibold flex items-center justify-center gap-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition active:scale-[0.99] shadow-2xs cursor-pointer"
              >
                <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Email Login Button */}
              <button
                type="button"
                onClick={() => openAuthModal(null, "Sign in or create your Seekho Dance account")}
                className="w-full h-12 py-3 px-4 rounded-2xl bg-[#141416] dark:bg-white text-white dark:text-neutral-950 text-sm font-semibold flex items-center justify-center relative hover:bg-neutral-800 dark:hover:bg-neutral-200 transition active:scale-[0.99] shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4.5 h-4.5 shrink-0 stroke-[2.2px]" />
                  <span>Continue with Email</span>
                </div>
                <ArrowRight className="w-4.5 h-4.5 shrink-0 stroke-[2.2px] absolute right-4" />
              </button>

              {/* Footnote */}
              <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400 text-center font-normal pt-0.5">
                Free to browse • No credit card required
              </p>
            </div>

            {/* Why create an account section */}
            <div className="space-y-2.5 pt-1">
              <h2 className="text-base font-bold text-neutral-950 dark:text-white tracking-tight">
                Why create an account?
              </h2>

              {/* 2x2 Feature Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Card 1: Mirror Mode & Controls */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#16161B] border border-neutral-200/70 dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF5EC] dark:bg-orange-950/40 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-4.5 h-4.5 text-[#F95721] stroke-[2.2px]" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="font-bold text-xs text-neutral-950 dark:text-white leading-tight">
                      Mirror Mode & Controls
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                      Flip videos and adjust speed to 0.5x.
                    </p>
                  </div>
                </div>

                {/* Card 2: Save Practice Routines */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#16161B] border border-neutral-200/70 dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF5EC] dark:bg-orange-950/40 flex items-center justify-center shrink-0">
                    <Bookmark className="w-4.5 h-4.5 text-[#F95721] stroke-[2.2px]" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="font-bold text-xs text-neutral-950 dark:text-white leading-tight">
                      Save Practice Routines
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                      Bookmark songs and continue where you left off.
                    </p>
                  </div>
                </div>

                {/* Card 3: Practice Streaks */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#16161B] border border-neutral-200/70 dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF5EC] dark:bg-orange-950/40 flex items-center justify-center shrink-0">
                    <Flame className="w-4.5 h-4.5 text-[#F95721] stroke-[2.2px]" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="font-bold text-xs text-neutral-950 dark:text-white leading-tight">
                      Practice Streaks
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                      Build consistency and earn badges.
                    </p>
                  </div>
                </div>

                {/* Card 4: Sync Across Devices */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#16161B] border border-neutral-200/70 dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF5EC] dark:bg-orange-950/40 flex items-center justify-center shrink-0">
                    <DevicesIcon className="w-4.5 h-4.5 text-[#F95721] stroke-[2.2px]" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="font-bold text-xs text-neutral-950 dark:text-white leading-tight">
                      Sync Across Devices
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                      Access your progress on phone, tablet, and desktop.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0D0D11] text-neutral-900 dark:text-[#EDEDF0]">
      
      {/* 1. PORTFOLIA-INSPIRED HERO BANNER WITH AURORA GRADIENT */}
      <div className="relative w-full bg-gradient-to-b from-neutral-100 via-[#FAFAF8] to-[#FAFAF8] dark:from-[#141419] dark:via-[#0D0D11] dark:to-[#0D0D11] pt-6 sm:pt-10 pb-8 sm:pb-12 border-b border-neutral-200/60 dark:border-white/[0.06]">
        
        {/* Soft Ethereal Aurora Mesh Glow */}
        <div className="absolute top-0 inset-x-0 h-48 sm:h-64 overflow-hidden pointer-events-none">
          <div className="absolute -top-12 left-1/4 w-[600px] h-[280px] bg-gradient-to-r from-blue-400/25 via-indigo-400/20 to-purple-400/25 dark:from-indigo-600/20 dark:via-purple-600/15 dark:to-orange-500/15 rounded-full blur-3xl" />
          <div className="absolute -top-16 right-1/4 w-[500px] h-[260px] bg-gradient-to-l from-pink-300/20 via-purple-300/15 to-transparent dark:from-purple-900/25 dark:via-indigo-900/20 dark:to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-10">
            
            {/* Left: Distinct Squircle Avatar & Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              
              {/* Organic Squircle Mask Avatar */}
              <div className="relative shrink-0 group">
                <div className="w-20 h-20 sm:w-36 sm:h-36 rounded-2xl sm:rounded-[36px] overflow-hidden bg-neutral-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-[#161618] shadow-xl relative">
                  <Image
                    src="/dancer_avatar.jpg"
                    alt={profile.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>

                {/* Status Dot */}
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-600 border-2 border-white dark:border-[#161618] flex items-center justify-center text-white shadow-md"
                  title="Practice Active"
                >
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                </div>
              </div>

              {/* User Bio & Meta Details */}
              <div className="space-y-2 sm:space-y-3">
                {/* Name & PRO Badge */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {isEditingName ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                        className="text-xl sm:text-3xl font-extrabold tracking-tight bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white px-3 py-1 rounded-xl outline-none border border-neutral-300 dark:border-neutral-700 shadow-xs"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 shadow-xs active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 active:scale-95"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                        {profile.name}
                      </h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-800 active:scale-90"
                        title="Edit Name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Purchase / Access Status Badge */}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase border",
                      profile.plan === "Studio Pass"
                        ? "bg-[#6C63FF]/15 text-[#544af4] dark:text-[#8c85ff] border-[#6C63FF]/30"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300/40"
                    )}
                  >
                    <span>{profile.plan}</span>
                    {profile.plan === "Studio Pass" ? (
                      <Zap className="w-3 h-3 fill-current" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                  </span>
                </div>

                {/* Subtitle / Email & Status */}
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {profile.email}
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Account Status: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Member</strong> • Verified Dancer
                  </p>
                </div>

                {/* Location & Studio Meta */}
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-400 dark:text-neutral-500">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Seekho Dance Studio • Mumbai, India</span>
                </div>

                {/* Action Buttons: Edit, Upgrade, State Toggle, and Logout */}
                <div className="pt-1.5 sm:pt-2 flex items-center gap-2 sm:gap-3 flex-wrap">
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="px-4 sm:px-5 py-2 rounded-full text-xs font-bold bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 transition active:scale-95 shadow-sm touch-manipulation cursor-pointer"
                  >
                    Edit Profile
                  </button>

                  {profile.plan !== "Studio Pass" && (
                    <Link
                      href="/pricing"
                      className="px-4 sm:px-5 py-2 rounded-full text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white transition active:scale-95 shadow-sm shadow-orange-600/25 touch-manipulation flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 fill-current" />
                      <span>Studio Pass (₹499/mo)</span>
                    </Link>
                  )}

                  {/* Dev State Switcher Pill */}
                  <button
                    type="button"
                    onClick={() =>
                      handleTogglePlan(
                        profile.plan === "Studio Pass" ? "Free Explorer" : "Studio Pass"
                      )
                    }
                    className="px-3 py-1.5 rounded-full text-[11px] font-mono border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition active:scale-95"
                    title="Toggle between Free Explorer (Unpaid) and Studio Pass (Paid) to test playback behavior"
                  >
                    Test: Switch to {profile.plan === "Studio Pass" ? "Free Explorer (Unpaid)" : "Studio Pass (Paid)"}
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/40 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Starburst Badges & Portfolia Stats */}
            <div className="flex flex-col items-start lg:items-end gap-3 sm:gap-5 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-200/80 dark:border-neutral-800 w-full lg:w-auto">
              
              {/* 3 Colorful Starburst/Scallop Badges */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div title="26-Day Streak">
                  <StarburstBadge number="26" color="orange" />
                </div>
                <div title="6 Weekly Milestones">
                  <StarburstBadge number="6" color="purple" />
                </div>
                <div title="12 Mastered Routines">
                  <StarburstBadge number="12" color="dark" />
                </div>
              </div>

              {/* Numerical Stats Row (Mobile 3-column grid) */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-10 w-full sm:w-auto">
                <div className="p-2 sm:p-0 rounded-xl bg-white/60 dark:bg-neutral-900/60 sm:bg-transparent border border-neutral-200/60 dark:border-neutral-800 sm:border-0 space-y-0.5 text-center sm:text-left lg:text-right">
                  <span className="text-[10px] sm:text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    Practiced
                  </span>
                  <div className="text-xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                    2,985
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-mono">mins</span>
                </div>

                <div className="p-2 sm:p-0 rounded-xl bg-white/60 dark:bg-neutral-900/60 sm:bg-transparent border border-neutral-200/60 dark:border-neutral-800 sm:border-0 space-y-0.5 text-center sm:text-left lg:text-right">
                  <span className="text-[10px] sm:text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    Drilled
                  </span>
                  <div className="text-xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                    132
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-mono">measures</span>
                </div>

                <div className="p-2 sm:p-0 rounded-xl bg-white/60 dark:bg-neutral-900/60 sm:bg-transparent border border-neutral-200/60 dark:border-neutral-800 sm:border-0 space-y-0.5 text-center sm:text-left lg:text-right">
                  <span className="text-[10px] sm:text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                    Mastered
                  </span>
                  <div className="text-xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                    548
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-mono">beats</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Weekly Practice Rhythm Heatmap Strip */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              <span>Weekly Practice Rhythm:</span>
              <strong className="text-orange-600 dark:text-orange-400 font-extrabold">6 of 7 Days Active</strong>
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              You are 1 day away from completing this week&apos;s Rhythm Master streak.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {weekDays.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs font-bold font-mono transition-all",
                  item.active
                    ? "bg-orange-600 text-white shadow-xs scale-105"
                    : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-400"
                )}
                title={`${item.label}: ${item.active ? "Practiced" : "Rest day"}`}
              >
                {item.day}
              </div>
            ))}
          </div>
        </div>

        {/* 3. TABS NAVIGATION */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800 overflow-x-auto scrollbar-none gap-4">
          <div className="flex items-center gap-3 sm:gap-8 min-w-max">
            <button
              onClick={() => setActiveTab("learning")}
              className={cn(
                "pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2",
                activeTab === "learning"
                  ? "text-neutral-950 dark:text-white font-bold"
                  : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              )}
            >
              <span>Currently Learning</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold">
                {learningRoutines.length}
              </span>
              {activeTab === "learning" && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-950 dark:bg-white rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("mastered")}
              className={cn(
                "pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2",
                activeTab === "mastered"
                  ? "text-neutral-950 dark:text-white font-bold"
                  : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              )}
            >
              <span>Mastered Routines</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold">
                {masteredRoutines.length}
              </span>
              {activeTab === "mastered" && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-950 dark:bg-white rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={cn(
                "pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2",
                activeTab === "saved"
                  ? "text-neutral-950 dark:text-white font-bold"
                  : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              )}
            >
              <span>Saved Songs</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold">
                {savedRoutines.length}
              </span>
              {activeTab === "saved" && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-950 dark:bg-white rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={cn(
                "pb-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-1.5",
                activeTab === "settings"
                  ? "text-neutral-950 dark:text-white font-bold"
                  : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              )}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Studio Settings</span>
              {activeTab === "settings" && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-950 dark:bg-white rounded-full" />
              )}
            </button>
          </div>

          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white pb-3 transition shrink-0"
          >
            <span>Explore catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4. TAB CONTENTS */}
        
        {/* Tab 1: Currently Learning */}
        {activeTab === "learning" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {learningRoutines.map((routine) => {
                if (!routine) return null;
                const progressPct = Math.round(
                  (routine.progress.currentStep / routine.progress.totalSteps) * 100
                );

                return (
                  <div
                    key={routine.id}
                    className="rounded-3xl bg-white dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 p-5 flex flex-col justify-between shadow-xs hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Thumbnail */}
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={routine.coverImage}
                          alt={routine.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge
                            difficulty={routine.difficulty}
                            variant="difficulty"
                            className="text-[10px] px-2 py-0.5 bg-black/80 text-white backdrop-blur-xs border-none"
                          />
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/80 text-[10px] font-mono text-white backdrop-blur-xs">
                          {routine.bpm} BPM
                        </div>
                      </div>

                      {/* Meta Details */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase font-bold">
                          Practiced {routine.progress.lastPracticed}
                        </div>
                        <h3 className="font-bold text-base text-neutral-950 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {routine.title}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {routine.artist}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate pt-0.5">
                          Current Step: <strong className="text-neutral-700 dark:text-neutral-300">{routine.progress.stepName}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                          Step {routine.progress.currentStep} of {routine.progress.totalSteps}
                        </span>
                        <span className="font-mono text-[11px] text-neutral-500 font-bold">
                          {progressPct}% Complete
                        </span>
                      </div>

                      {/* Visual Progress Meter */}
                      <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-600 transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <div className="pt-1">
                        <Link
                          href={`/dance/${routine.id}`}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 flex items-center justify-center gap-1.5 transition active:scale-98 text-center"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Resume Step {routine.progress.currentStep}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Mastered Routines */}
        {activeTab === "mastered" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {masteredRoutines.map((routine) => {
                if (!routine) return null;
                return (
                  <div
                    key={routine.id}
                    className="rounded-3xl bg-white dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 p-5 flex flex-col justify-between shadow-xs space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={routine.coverImage}
                          alt={routine.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                          100% Mastered
                        </span>
                        <h3 className="font-bold text-base text-neutral-950 dark:text-white truncate mt-1">
                          {routine.title}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {routine.artist}
                        </p>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {routine.bpm} BPM • {routine.steps.length} Steps
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                      <Link
                        href={`/dance/${routine.id}`}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white flex items-center justify-center gap-1.5 transition active:scale-98"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Practice Full BPM Run</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Saved Songs */}
        {activeTab === "saved" && (
          <div className="space-y-4">
            {savedRoutines.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 space-y-3">
                <Bookmark className="w-8 h-8 mx-auto text-neutral-400" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">No saved routines yet</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Browse dance routines to bookmark viral songs you want to practice later.
                </p>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                >
                  Explore Dance Routines
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedRoutines.map((routine) => {
                  if (!routine) return null;
                  return (
                    <div
                      key={routine.id}
                      className="rounded-3xl bg-white dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 p-5 flex flex-col justify-between shadow-xs space-y-4 relative group"
                    >
                      <div className="space-y-3">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={routine.coverImage}
                            alt={routine.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleRemoveSaved(routine.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500 transition shadow-xs"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <Badge
                            difficulty={routine.difficulty}
                            variant="difficulty"
                            className="text-[9px] px-2 py-0.5"
                          />
                          <h3 className="font-bold text-base text-neutral-950 dark:text-white truncate">
                            {routine.title}
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {routine.artist}
                          </p>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            {routine.steps.length} Steps • {routine.bpm} BPM
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                        <Link
                          href={`/dance/${routine.id}`}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 flex items-center justify-center gap-1.5 transition active:scale-98"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start Learning Routine</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Studio Settings & Preferences */}
        {activeTab === "settings" && (
          <div className="rounded-3xl bg-white dark:bg-[#161618] border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-neutral-950 dark:text-white tracking-tight">
                Dance Studio Preferences
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Customize your default player behavior when learning routines.
              </p>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {/* Auto Mirror */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white text-sm">
                    Auto-Enable Mirror Mode
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
                    Automatically flip video horizontally so you can follow left/right directly.
                  </div>
                </div>
                <button
                  onClick={() => setAutoMirror(!autoMirror)}
                  className={cn(
                    "w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200",
                    autoMirror ? "bg-orange-600" : "bg-neutral-300 dark:bg-neutral-700"
                  )}
                >
                  <div
                    className={cn(
                      "w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform duration-200",
                      autoMirror && "translate-x-5.5"
                    )}
                  />
                </button>
              </div>

              {/* Default Speed */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white text-sm">
                    Default Practice Speed
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
                    The initial playback tempo when starting a new dance lesson.
                  </div>
                </div>
                <div className="inline-flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                  {(["0.5", "0.75", "1.0"] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setDefaultSpeed(spd)}
                      className={cn(
                        "px-3 py-1 rounded-lg font-mono text-xs font-semibold transition",
                        defaultSpeed === spd
                          ? "bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      )}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Metronome Clicks */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white text-sm">
                    8-Count Metronome Clicks
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
                    Play rhythmic audio cues on downbeats (1 and 5) during loop drills.
                  </div>
                </div>
                <button
                  onClick={() => setMetronomeSound(!metronomeSound)}
                  className={cn(
                    "w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200",
                    metronomeSound ? "bg-orange-600" : "bg-neutral-300 dark:bg-neutral-700"
                  )}
                >
                  <div
                    className={cn(
                      "w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform duration-200",
                      metronomeSound && "translate-x-5.5"
                    )}
                  />
                </button>
              </div>

              {/* Theme Toggle */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white text-sm">
                    Interface Theme
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
                    Currently set to {resolvedTheme === "dark" ? "Dark Theme" : "Light Theme"}.
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold transition cursor-pointer"
                >
                  Switch to {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </div>

              {/* Sign Out Option */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-red-600 dark:text-red-400 text-sm">
                    Sign Out of Account
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
                    Signed in as {profile.email}. You can sign back in anytime.
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-semibold transition active:scale-95 flex items-center gap-1.5 border border-red-200 dark:border-red-900/50 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
