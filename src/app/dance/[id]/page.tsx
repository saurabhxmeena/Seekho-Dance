"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { DANCE_ROUTINES } from "@/data/dances";
import { DanceStep } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { StudioPlayer } from "@/components/studio/StudioPlayer";
import { StepLessonList } from "@/components/studio/StepLessonList";
import { PracticeControls } from "@/components/studio/PracticeControls";
import { CountSheet } from "@/components/studio/CountSheet";
import { DanceCard } from "@/components/discovery/DanceCard";
import { cn } from "@/lib/utils";

interface DancePageProps {
  params: Promise<{ id: string }>;
}

export default function DanceLearningPage({ params }: DancePageProps) {
  const resolvedParams = use(params);
  const routine = DANCE_ROUTINES.find((d) => d.id === resolvedParams.id || d.slug === resolvedParams.id);

  if (!routine) {
    notFound();
  }

  // Studio Player State
  const [activeStep, setActiveStep] = useState<DanceStep>(routine.steps[0]);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isMirrored, setIsMirrored] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Studio Mobile Tab State: "steps" | "rhythm" | "notes"
  const [mobileStudioTab, setMobileStudioTab] = useState<"steps" | "rhythm" | "notes">("steps");

  const toggleCompleteStep = (stepId: string) => {
    setCompletedStepIds((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const handleStepSelect = (step: DanceStep) => {
    setActiveStep(step);
  };

  const handlePracticeStep = (step: DanceStep) => {
    setActiveStep(step);
    setIsLooping(true);
  };

  const handlePrevStep = () => {
    const currentIndex = routine.steps.findIndex((s) => s.id === activeStep.id);
    if (currentIndex > 0) {
      setActiveStep(routine.steps[currentIndex - 1]);
    }
  };

  const handleNextStep = () => {
    const currentIndex = routine.steps.findIndex((s) => s.id === activeStep.id);
    if (currentIndex < routine.steps.length - 1) {
      setActiveStep(routine.steps[currentIndex + 1]);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const relatedDances = DANCE_ROUTINES.filter(
    (d) => d.id !== routine.id && (d.style === routine.style || d.creator === routine.creator)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-50 transition-colors">
      
      {/* Studio Header Bar */}
      <div className="border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-15 sm:top-16 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2.5">
          
          {/* Back link & Song title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/explore"
              className="p-1.5 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition shrink-0 active:scale-95"
              title="Back to Explore"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-white truncate">
                  {routine.title}
                </h1>
                <Badge difficulty={routine.difficulty} variant="difficulty" className="shrink-0 text-[9px] sm:text-[10px] px-1.5 py-0" />
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {routine.style}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {routine.artist} • By <strong className="text-neutral-700 dark:text-neutral-200">{routine.creator}</strong>
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition bg-white dark:bg-neutral-900 shadow-2xs active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{copiedToast ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Top Grid: Player Area (Left) + Lesson List (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          
          {/* Left Column: Player + Practice Controls + Mobile Tabs / Count Sheet */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            
            {/* 1. Large Studio Video Player */}
            <StudioPlayer
              routine={routine}
              activeStep={activeStep}
              onStepChange={handleStepSelect}
              isLooping={isLooping}
              onToggleLoop={() => setIsLooping(!isLooping)}
              isMirrored={isMirrored}
              onToggleMirror={() => setIsMirrored(!isMirrored)}
              playbackSpeed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              onPlayStateChange={setIsPlaying}
            />

            {/* 2. Practice Controls Bar (Sticky / Primary) */}
            <PracticeControls
              routine={routine}
              activeStep={activeStep}
              completedStepIds={completedStepIds}
              isLooping={isLooping}
              onToggleLoop={() => setIsLooping(!isLooping)}
              isMirrored={isMirrored}
              onToggleMirror={() => setIsMirrored(!isMirrored)}
              onPrevStep={handlePrevStep}
              onNextStep={handleNextStep}
              onToggleCompleteStep={toggleCompleteStep}
            />

            {/* Mobile Studio Segmented Control Tabs */}
            <div className="lg:hidden flex items-center p-1 bg-neutral-200/70 dark:bg-neutral-900 border border-neutral-300/60 dark:border-neutral-800 rounded-2xl">
              <button
                onClick={() => setMobileStudioTab("steps")}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-semibold transition active:scale-95 text-center",
                  mobileStudioTab === "steps"
                    ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400"
                )}
              >
                Lesson Steps ({routine.steps.length})
              </button>
              <button
                onClick={() => setMobileStudioTab("rhythm")}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-semibold transition active:scale-95 text-center",
                  mobileStudioTab === "rhythm"
                    ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400"
                )}
              >
                8-Count Rhythm
              </button>
              <button
                onClick={() => setMobileStudioTab("notes")}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-semibold transition active:scale-95 text-center",
                  mobileStudioTab === "notes"
                    ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400"
                )}
              >
                Technique
              </button>
            </div>

            {/* MOBILE ONLY: Tab 1 Content: Step List on Mobile */}
            <div className={cn("lg:hidden", mobileStudioTab === "steps" ? "block" : "hidden")}>
              <StepLessonList
                routine={routine}
                activeStep={activeStep}
                completedStepIds={completedStepIds}
                onSelectStep={handleStepSelect}
                onToggleCompleteStep={toggleCompleteStep}
                onPracticeStep={handlePracticeStep}
              />
            </div>

            {/* Desktop & Mobile Tab 2 Content: 8-Count Metronome */}
            <div className={cn("space-y-4", mobileStudioTab !== "rhythm" && "hidden lg:block")}>
              <CountSheet
                bpm={routine.bpm}
                isPlaying={isPlaying}
                countNotation={activeStep.countNotation}
                keyCounts={activeStep.keyCounts}
              />
            </div>

            {/* Desktop & Mobile Tab 3 Content: Routine Description & Technique */}
            <div className={cn("space-y-4", mobileStudioTab !== "notes" && "hidden lg:block")}>
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    About this Routine
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {routine.description}
                  </p>
                </div>

                {/* Key Technique Callout */}
                <div className="p-3.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 text-xs text-orange-950 dark:text-orange-200">
                  <span className="font-semibold block mb-0.5">Key Technique to Focus On:</span>
                  {routine.keyTechnique}
                </div>

                {/* Choreographer Card */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={routine.creatorAvatar}
                      alt={routine.creator}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {routine.creator}
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        {routine.creatorBio}
                      </p>
                    </div>
                  </div>

                  {routine.creatorChannelUrl && (
                    <a
                      href={routine.creatorChannelUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 inline-flex items-center gap-1 font-medium shrink-0 ml-2"
                    >
                      YouTube Channel <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Step-by-Step Lesson Syllabus & Mastery (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
            <StepLessonList
              routine={routine}
              activeStep={activeStep}
              completedStepIds={completedStepIds}
              onSelectStep={handleStepSelect}
              onToggleCompleteStep={toggleCompleteStep}
              onPracticeStep={handlePracticeStep}
            />

            {/* Learning Checkpoints Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  Mastery Checkpoints
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                {routine.learningCheckpoints.map((cp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold shrink-0">•</span>
                    <span>{cp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom: Related Dances / More from Style */}
        {relatedDances.length > 0 && (
          <div className="pt-12 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
                  More in {routine.style}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Continue your dance journey with similar choreographies.
                </p>
              </div>
              <Link
                href={`/explore?style=${encodeURIComponent(routine.style)}`}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 transition"
              >
                View all in {routine.style} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDances.map((rel) => (
                <DanceCard key={rel.id} routine={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
