"use client";

import React from "react";
import { CheckCircle2, Circle, Play, Flame, Sparkles, Footprints, Dumbbell, Compass, HelpCircle, Repeat } from "lucide-react";
import { DanceStep, DanceRoutine } from "@/types";
import { formatTime, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface StepLessonListProps {
  routine: DanceRoutine;
  activeStep: DanceStep;
  completedStepIds: string[];
  onSelectStep: (step: DanceStep) => void;
  onToggleCompleteStep: (stepId: string) => void;
  onPracticeStep: (step: DanceStep) => void;
}

export function StepLessonList({
  routine,
  activeStep,
  completedStepIds,
  onSelectStep,
  onToggleCompleteStep,
  onPracticeStep,
}: StepLessonListProps) {
  const totalSteps = routine.steps.length;
  const completedCount = completedStepIds.length;
  const progressPct = Math.round((completedCount / totalSteps) * 100);

  const getFocalIcon = (focalArea: string) => {
    switch (focalArea) {
      case "Footwork":
        return Footprints;
      case "Upper Body":
        return Dumbbell;
      case "Weight Shift":
        return Compass;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
      {/* Header & Overall Progress */}
      <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-50 tracking-tight">
              Syllabus & Lesson Steps
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {totalSteps} steps • {routine.durationMinutes}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-semibold text-neutral-900 dark:text-neutral-100">
              {completedCount}/{totalSteps} Completed
            </span>
            <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold block">
              {progressPct}% Mastery
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Step List Items */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
        {routine.steps.map((step) => {
          const isActive = activeStep.id === step.id;
          const isCompleted = completedStepIds.includes(step.id);
          const FocalIcon = getFocalIcon(step.focalArea);

          return (
            <div
              key={step.id}
              className={cn(
                "p-4 transition-all duration-150",
                isActive
                  ? "bg-orange-50/50 dark:bg-orange-950/20 border-l-4 border-l-orange-500 pl-3.5"
                  : "hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Completion Toggle Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCompleteStep(step.id);
                  }}
                  className="mt-0.5 text-neutral-400 hover:text-orange-500 transition-colors shrink-0"
                  aria-label={isCompleted ? "Mark incomplete" : "Mark completed"}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50 dark:fill-emerald-950/60" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-700 hover:text-neutral-500" />
                  )}
                </button>

                {/* Step Details & Main Click Target */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onSelectStep(step)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-neutral-400">
                        STEP {step.stepNumber.toString().padStart(2, "0")}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        <FocalIcon className="w-3 h-3 text-neutral-400" />
                        {step.focalArea}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] text-neutral-400">
                      {formatTime(step.timestampStart)} - {formatTime(step.timestampEnd)}
                    </span>
                  </div>

                  <h4 className={cn(
                    "text-sm font-semibold mt-1 tracking-tight",
                    isActive ? "text-orange-950 dark:text-orange-200" : "text-neutral-900 dark:text-neutral-100"
                  )}>
                    {step.title}
                  </h4>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                    {step.subtitle}
                  </p>

                  {/* Expanded Active Step Content */}
                  {isActive && (
                    <div className="mt-3 pt-3 border-t border-orange-200/50 dark:border-orange-900/40 space-y-2.5 animate-in fade-in duration-200">
                      {/* Instructor Cue Note */}
                      <div className="p-2.5 rounded-lg bg-white/80 dark:bg-neutral-900/90 border border-orange-200/60 dark:border-orange-900/40 text-xs text-neutral-700 dark:text-neutral-300">
                        <span className="font-semibold text-orange-600 dark:text-orange-400 block mb-0.5">
                          💡 Instructor Tip:
                        </span>
                        {step.instructorTip}
                      </div>

                      {/* Practice Action */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onPracticeStep(step)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 text-white hover:bg-orange-700 transition shadow-xs"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          Drill & Loop This Step
                        </button>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {step.tempoGuide}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
