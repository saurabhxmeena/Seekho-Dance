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

export default function ProfilePage() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"learning" | "mastered" | "saved" | "settings">("learning");

  // User profile state
  const [profile, setProfile] = useState<UserProfileData>({
    name: "Saurabh Meena",
    email: "dancer@seekhodance.com",
    plan: "Studio Pass",
    dailyGoalMinutes: 15,
    streakDays: 26,
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("Saurabh Meena");

  // Saved songs state
  const [savedIds, setSavedIds] = useState<string[]>(["chaleya", "natu-natu", "ghungroo"]);

  // Studio preferences state
  const [autoMirror, setAutoMirror] = useState(true);
  const [defaultSpeed, setDefaultSpeed] = useState<"0.5" | "0.75" | "1.0">("0.75");
  const [metronomeSound, setMetronomeSound] = useState(true);

  useEffect(() => {
    const loadedProfile = getUserProfile();
    if (loadedProfile?.name) {
      setProfile(loadedProfile);
      setNameInput(loadedProfile.name);
    }
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
    { day: "T", label: "Thu", active: true },
    { day: "F", label: "Fri", active: true },
    { day: "S", label: "Sat", active: true },
    { day: "S", label: "Sun", active: false },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-50 transition-colors duration-200">
      
      {/* 1. PORTFOLIA-INSPIRED HERO BANNER WITH AURORA GRADIENT */}
      <div className="relative w-full bg-gradient-to-b from-neutral-100 via-[#FAFAF8] to-[#FAFAF8] dark:from-[#141419] dark:via-[#0a0a0a] dark:to-[#0a0a0a] pt-6 sm:pt-10 pb-8 sm:pb-12 border-b border-neutral-200/60 dark:border-neutral-800/60">
        
        {/* Soft Ethereal Aurora Mesh Glow */}
        <div className="absolute top-0 inset-x-0 h-48 sm:h-64 overflow-hidden pointer-events-none">
          <div className="absolute -top-12 left-1/4 w-[600px] h-[280px] bg-gradient-to-r from-blue-400/25 via-indigo-400/20 to-purple-400/25 dark:from-indigo-600/20 dark:via-purple-600/15 dark:to-orange-500/15 rounded-full blur-3xl" />
          <div className="absolute -top-16 right-1/4 w-[500px] h-[260px] bg-gradient-to-l from-pink-300/20 via-purple-300/15 to-transparent dark:from-purple-900/25 dark:via-indigo-900/20 dark:to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-10">
            
            {/* Left: Distinct Squircle Avatar & Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              
              {/* Organic Squircle Mask Avatar */}
              <div className="relative shrink-0 group">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[36px] overflow-hidden bg-neutral-200 dark:bg-neutral-800 ring-4 ring-white dark:ring-[#161618] shadow-xl relative">
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
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-orange-600 border-2 border-white dark:border-[#161618] flex items-center justify-center text-white shadow-md"
                  title="Practice Active"
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              {/* User Bio & Meta Details */}
              <div className="space-y-3">
                {/* Name & PRO Badge */}
                <div className="flex items-center gap-3 flex-wrap">
                  {isEditingName ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                        className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white px-3 py-1 rounded-xl outline-none border border-neutral-300 dark:border-neutral-700 shadow-xs"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                        {profile.name}
                      </h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-800"
                        title="Edit Name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* PRO / Studio Pass Pill Badge */}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#6C63FF]/15 text-[#544af4] dark:text-[#8c85ff] border border-[#6C63FF]/30 tracking-wide uppercase">
                    <span>PRO</span>
                    <Zap className="w-3 h-3 fill-current" />
                  </span>
                </div>

                {/* Subtitle / Bio */}
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300 max-w-md leading-relaxed">
                  Viral Choreo Explorer & Performer
                  <span className="text-neutral-400 dark:text-neutral-500 block sm:inline sm:before:content-['•'] sm:before:mx-2">
                    Bollywood, Hip-Hop & Afrobeat
                  </span>
                </p>

                {/* Location & Studio Meta */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Seekho Dance Studio • Mumbai, India</span>
                </div>

                {/* Action Buttons (Follow / Get in touch style) */}
                <div className="pt-2 flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 transition active:scale-98 shadow-sm"
                  >
                    Edit Profile
                  </button>
                  <Link
                    href="/pricing"
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300/80 dark:border-neutral-700 transition active:scale-98 shadow-2xs"
                  >
                    Studio Pass (₹499/mo)
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Starburst Badges & Massive Portfolia-Style Stats */}
            <div className="flex flex-col items-start lg:items-end gap-5 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-200/80 dark:border-neutral-800">
              
              {/* 3 Colorful Starburst/Scallop Badges */}
              <div className="flex items-center gap-3">
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

              {/* Numerical Stats Row */}
              <div className="flex items-center gap-8 sm:gap-10">
                <div className="space-y-0.5 text-left lg:text-right">
                  <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Practiced
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                    2,985
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-mono">mins</span>
                </div>

                <div className="space-y-0.5 text-left lg:text-right">
                  <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Steps Drilled
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
                    132
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-mono">measures</span>
                </div>

                <div className="space-y-0.5 text-left lg:text-right">
                  <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Mastered
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-sans">
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
            href="/explore"
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
