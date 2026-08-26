"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Sparkles,
  CheckCircle2,
  Flame,
  ArrowRight,
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
} from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getUserProfile, saveUserProfile, getSavedDances, toggleSaveDance, UserProfileData } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface InProgressRoutine {
  routineId: string;
  currentStep: number;
  totalSteps: number;
  stepName: string;
  status: "in-progress" | "mastered";
  lastPracticed: string;
}

export default function ProfilePage() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"learning" | "mastered" | "saved" | "settings">("learning");

  // User profile state
  const [profile, setProfile] = useState<UserProfileData>({
    name: "Seekho Dancer",
    email: "dancer@seekhodance.com",
    plan: "Free Explorer",
    dailyGoalMinutes: 15,
    streakDays: 5,
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("Seekho Dancer");

  // Saved songs state
  const [savedIds, setSavedIds] = useState<string[]>(["chaleya", "naatu-naatu", "gimme-more"]);

  // Studio preferences state
  const [autoMirror, setAutoMirror] = useState(true);
  const [defaultSpeed, setDefaultSpeed] = useState<"0.5" | "0.75" | "1.0">("0.75");
  const [metronomeSound, setMetronomeSound] = useState(true);

  useEffect(() => {
    const loadedProfile = getUserProfile();
    setProfile(loadedProfile);
    setNameInput(loadedProfile.name);
    setSavedIds(getSavedDances());
  }, []);

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
    { day: "T", label: "Thu", active: false },
    { day: "F", label: "Fri", active: true },
    { day: "S", label: "Sat", active: true },
    { day: "S", label: "Sun", active: false },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-50 transition-colors duration-200 py-8 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* 1. HERO PROFILE & MILESTONE HEADER */}
        <div className="p-6 sm:p-9 rounded-[32px] bg-white dark:bg-[#1C1C1E] border border-neutral-200/90 dark:border-neutral-800/90 shadow-sm space-y-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            
            {/* User Avatar & Info */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md shrink-0 ring-4 ring-orange-500/20">
                  {profile.name.slice(0, 2).toUpperCase() || "SD"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1C1C1E] flex items-center justify-center text-white shadow-xs" title="5-Day Streak Active">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              <div className="space-y-1 min-w-0">
                {/* Editable Name */}
                <div className="flex items-center gap-2 flex-wrap">
                  {isEditingName ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                        className="text-lg sm:text-2xl font-bold tracking-tight bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white px-2.5 py-0.5 rounded-lg outline-none border border-neutral-300 dark:border-neutral-700"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-500"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
                        {profile.name}
                      </h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition"
                        title="Edit Dancer Name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300">
                    {profile.plan}
                  </span>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {profile.email} • Member since 2026
                </p>
              </div>
            </div>

            {/* Upgrade to Studio Pass CTA */}
            <div>
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 transition shadow-sm active:scale-95 text-center"
              >
                <Sparkles className="w-4 h-4 text-amber-400 dark:text-orange-600" />
                <span>Get Studio Pass ($9/mo)</span>
              </Link>
            </div>
          </div>

          {/* 4 Stat Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Learning</span>
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white tracking-tight mt-1">
                {learningRoutines.length}
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5 truncate">
                Routines in progress
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Mastered</span>
                <Trophy className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight mt-1">
                {masteredRoutines.length}
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5 truncate">
                Full tempo ready
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Streak</span>
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 tracking-tight mt-1">
                {profile.streakDays} Days
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5 truncate">
                Daily practice streak
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Steps Drilled</span>
                <Layers className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white tracking-tight mt-1">
                14
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5 truncate">
                8-count steps cleared
              </div>
            </div>
          </div>

          {/* Weekly Practice Heatmap Rhythm Strip */}
          <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span>Weekly Rhythm:</span>
                <strong className="text-orange-600 dark:text-orange-400">5 of 7 Days Active</strong>
              </span>
              <p className="text-[11px] text-neutral-400">
                You&apos;re 2 days away from unlocking the 7-day Rhythm Master badge.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {weekDays.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-semibold font-mono transition-transform",
                    item.active
                      ? "bg-orange-600 text-white shadow-xs scale-105"
                      : "bg-neutral-200/70 dark:bg-neutral-800 text-neutral-400"
                  )}
                  title={`${item.label}: ${item.active ? "Practiced" : "Rest day"}`}
                >
                  {item.day}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. TABS NAVIGATION */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto scrollbar-none gap-2">
          <div className="flex items-center gap-2 sm:gap-6 min-w-max">
            <button
              onClick={() => setActiveTab("learning")}
              className={cn(
                "pb-3.5 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2",
                activeTab === "learning"
                  ? "text-neutral-950 dark:text-white font-bold"
                  : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              )}
            >
              <span>Currently Learning</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {learningRoutines.length}
              </span>
              {activeTab === "learning" && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-950 dark:bg-white rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("mastered")}
              className={cn(
                "pb-3.5 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2",
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
                "pb-3.5 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2",
                activeTab === "saved"
                  ? "text-neutral-950 dark:text-white font-bold"
                  : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              )}
            >
              <span>Saved Songs</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {savedRoutines.length}
              </span>
              {activeTab === "saved" && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-950 dark:bg-white rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={cn(
                "pb-3.5 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-1.5",
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
            href="/explore"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white pb-3.5 transition shrink-0"
          >
            <span>Explore catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3. CONTENT AREA */}
        
        {/* Tab 1: Currently Learning */}
        {activeTab === "learning" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {learningRoutines.map((routine) => {
                if (!routine) return null;
                const progressPct = Math.round(
                  (routine.progress.currentStep / routine.progress.totalSteps) * 100
                );

                return (
                  <div
                    key={routine.id}
                    className="rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200/90 dark:border-neutral-800/90 p-5 flex flex-col justify-between shadow-xs hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-5 group"
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={routine.coverImage}
                          alt={routine.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-1.5 left-1.5">
                          <Badge
                            difficulty={routine.difficulty}
                            variant="difficulty"
                            className="text-[9px] px-1.5 py-0.5 bg-black/80 text-white backdrop-blur-xs border-none"
                          />
                        </div>
                      </div>

                      {/* Meta Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase font-semibold">
                          Practiced {routine.progress.lastPracticed}
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-neutral-950 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {routine.title}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {routine.artist}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate pt-0.5">
                          Current: <strong className="text-neutral-700 dark:text-neutral-300">{routine.progress.stepName}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                          Step {routine.progress.currentStep} of {routine.progress.totalSteps}
                        </span>
                        <span className="font-mono text-[11px] text-neutral-500 font-bold">
                          {progressPct}% Complete
                        </span>
                      </div>

                      {/* Visual Progress Meter */}
                      <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-600 transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <div className="pt-1 flex items-center gap-2">
                        <Link
                          href={`/dance/${routine.id}`}
                          className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center gap-1.5 transition shadow-sm active:scale-98"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {masteredRoutines.map((routine) => {
                if (!routine) return null;
                return (
                  <div
                    key={routine.id}
                    className="rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200/90 dark:border-neutral-800/90 p-5 flex flex-col justify-between shadow-xs space-y-5"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={routine.coverImage}
                          alt={routine.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                          100% Mastered
                        </span>
                        <h3 className="font-bold text-base sm:text-lg text-neutral-950 dark:text-white truncate mt-1">
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

                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      <Link
                        href={`/dance/${routine.id}`}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white flex items-center justify-center gap-1.5 transition active:scale-98"
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
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200/80 dark:border-neutral-800 space-y-3">
                <Bookmark className="w-8 h-8 mx-auto text-neutral-400" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">No saved routines yet</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Browse the library to bookmark viral songs you want to practice later.
                </p>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                >
                  Explore Dance Library
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {savedRoutines.map((routine) => {
                  if (!routine) return null;
                  return (
                    <div
                      key={routine.id}
                      className="rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200/90 dark:border-neutral-800/90 p-5 flex flex-col justify-between shadow-xs space-y-4 relative group"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={routine.coverImage}
                            alt={routine.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <Badge
                              difficulty={routine.difficulty}
                              variant="difficulty"
                              className="text-[9px] px-2 py-0.5"
                            />
                            <button
                              onClick={() => handleRemoveSaved(routine.id)}
                              className="text-neutral-400 hover:text-red-500 p-1 transition"
                              title="Remove from saved"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h3 className="font-bold text-base sm:text-lg text-neutral-950 dark:text-white truncate">
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

                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <Link
                          href={`/dance/${routine.id}`}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 flex items-center justify-center gap-1.5 transition active:scale-98"
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
          <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200/90 dark:border-neutral-800/90 p-6 sm:p-8 space-y-6">
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
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold transition"
                >
                  Switch to {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
