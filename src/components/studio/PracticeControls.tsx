"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Repeat, FlipHorizontal, Check, Circle } from "lucide-react";
import { DanceStep, DanceRoutine } from "@/types";
import { cn } from "@/lib/utils";

interface PracticeControlsProps {
  routine: DanceRoutine;
  activeStep: DanceStep;
  completedStepIds: string[];
  isLooping: boolean;
  onToggleLoop: () => void;
  isMirrored: boolean;
  onToggleMirror: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onToggleCompleteStep: (stepId: string) => void;
}

export function PracticeControls({
  routine,
  activeStep,
  completedStepIds,
  isLooping,
  onToggleLoop,
  isMirrored,
  onToggleMirror,
  onPrevStep,
  onNextStep,
  onToggleCompleteStep,
}: PracticeControlsProps) {
  const currentIndex = routine.steps.findIndex((s) => s.id === activeStep.id);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === routine.steps.length - 1;
  const isCompleted = completedStepIds.includes(activeStep.id);

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-900 text-white shadow-xl border border-neutral-800 space-y-3 sm:space-y-0">
      
      {/* Top Mobile info row / Desktop layout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Previous Step (Desktop & Mobile left) */}
        <button
          onClick={onPrevStep}
          disabled={isFirst}
          className={cn(
            "hidden sm:flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0",
            isFirst
              ? "text-neutral-600 bg-neutral-800/40 cursor-not-allowed"
              : "text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white active:scale-95"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev Step</span>
        </button>

        {/* Center: Current Step Title & Quick Actions */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left min-w-0">
          <div className="min-w-0">
            <div className="text-[11px] font-mono uppercase tracking-wider text-orange-400 font-semibold">
              Step {activeStep.stepNumber} of {routine.steps.length}
            </div>
            <div className="text-xs sm:text-sm font-semibold truncate text-neutral-100 max-w-xs sm:max-w-md">
              {activeStep.title}
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="flex items-center justify-center gap-1.5 pt-1 sm:pt-0">
            <button
              onClick={onToggleMirror}
              className={cn(
                "px-3 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition active:scale-95",
                isMirrored
                  ? "bg-orange-600 text-white font-semibold shadow-xs"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              )}
              title="Toggle Mirror"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span className="text-[11px]">Mirror</span>
            </button>

            <button
              onClick={onToggleLoop}
              className={cn(
                "px-3 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition active:scale-95",
                isLooping
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              )}
              title="Toggle Step Loop"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span className="text-[11px]">Loop</span>
            </button>

            <button
              onClick={() => onToggleCompleteStep(activeStep.id)}
              className={cn(
                "px-3 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition active:scale-95",
                isCompleted
                  ? "bg-emerald-600 text-white font-semibold shadow-xs"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              )}
              title="Mark this step completed"
            >
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{isCompleted ? "Done" : "Mark Done"}</span>
            </button>
          </div>
        </div>

        {/* Next Step (Desktop) */}
        <button
          onClick={onNextStep}
          disabled={isLast}
          className={cn(
            "hidden sm:flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0",
            isLast
              ? "text-neutral-600 bg-neutral-800/40 cursor-not-allowed"
              : "text-white bg-orange-600 hover:bg-orange-500 shadow-md shadow-orange-600/30 active:scale-95"
          )}
        >
          <span>Next Step</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile-Only Step Navigation Row */}
      <div className="grid grid-cols-2 gap-2 sm:hidden pt-1">
        <button
          onClick={onPrevStep}
          disabled={isFirst}
          className={cn(
            "w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition",
            isFirst
              ? "text-neutral-600 bg-neutral-800/40 cursor-not-allowed"
              : "text-neutral-200 bg-neutral-800 active:bg-neutral-700"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev Step</span>
        </button>

        <button
          onClick={onNextStep}
          disabled={isLast}
          className={cn(
            "w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition",
            isLast
              ? "text-neutral-600 bg-neutral-800/40 cursor-not-allowed"
              : "text-white bg-orange-600 active:bg-orange-700 shadow-md shadow-orange-600/30"
          )}
        >
          <span>Next Step</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
