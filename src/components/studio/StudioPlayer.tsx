"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  FlipHorizontal,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Gauge,
  Tv,
} from "lucide-react";
import { DanceRoutine, DanceStep } from "@/types";
import { formatTime, cn } from "@/lib/utils";

interface StudioPlayerProps {
  routine: DanceRoutine;
  activeStep: DanceStep;
  onStepChange: (step: DanceStep) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  isMirrored: boolean;
  onToggleMirror: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function StudioPlayer({
  routine,
  activeStep,
  onStepChange,
  isLooping,
  onToggleLoop,
  isMirrored,
  onToggleMirror,
  playbackSpeed,
  onSpeedChange,
  onPlayStateChange,
}: StudioPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isTheater, setIsTheater] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  // Sync speed changes to video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Sync active step change: seek to start of step
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = activeStep.timestampStart;
      setCurrentTime(activeStep.timestampStart);
    }
  }, [activeStep]);

  // Handle Loop bounds and Time update
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    // If loop is enabled for current step
    if (isLooping) {
      if (curr >= activeStep.timestampEnd || curr < activeStep.timestampStart) {
        videoRef.current.currentTime = activeStep.timestampStart;
      }
    }
  }, [isLooping, activeStep]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPlayStateChange?.(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        onPlayStateChange?.(true);
      }).catch((e) => console.log("Play error:", e));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleStepMarkerClick = (step: DanceStep) => {
    onStepChange(step);
    if (videoRef.current) {
      videoRef.current.currentTime = step.timestampStart;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
        onPlayStateChange?.(true);
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // Keyboard shortcut controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === "m") {
        onToggleMirror();
      } else if (e.key.toLowerCase() === "l") {
        onToggleLoop();
      } else if (e.key === "ArrowLeft") {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
        }
      } else if (e.key === "ArrowRight") {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(duration || 105, videoRef.current.currentTime + 5);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isLooping, isMirrored, duration]);

  const speeds = [0.5, 0.75, 1.0, 1.25];

  const [seekFeedback, setSeekFeedback] = useState<{ direction: "left" | "right"; text: string } | null>(null);
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });

  const handleVideoTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current.time;

    // Detect double-tap within 300ms
    if (timeSinceLastTap < 300) {
      if (clickX < width * 0.35) {
        // Left double-tap: rewind 5s
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
          setSeekFeedback({ direction: "left", text: "-5s" });
          setTimeout(() => setSeekFeedback(null), 600);
        }
      } else if (clickX > width * 0.65) {
        // Right double-tap: forward 5s
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(duration || 105, videoRef.current.currentTime + 5);
          setSeekFeedback({ direction: "right", text: "+5s" });
          setTimeout(() => setSeekFeedback(null), 600);
        }
      } else {
        togglePlay();
      }
    } else {
      // Single tap: toggle controls visibility or play
      setShowControls((prev) => !prev);
    }

    lastTapRef.current = { time: now, x: clickX };
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 select-none transition-all touch-manipulation",
        isTheater ? "w-full aspect-[21/9] sm:aspect-[16/9]" : "w-full aspect-[16/10] sm:aspect-[16/9]"
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* HTML5 Video Element with CSS Horizontal Mirroring */}
      <video
        ref={videoRef}
        src={routine.videoUrl}
        poster={routine.coverImage}
        className={cn(
          "w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] gpu-layer",
          isMirrored ? "-scale-x-100" : "scale-x-100"
        )}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration || 105);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          onPlayStateChange?.(false);
        }}
        playsInline
      />

      {/* Transparent Tap & Gesture Overlay */}
      <div
        onClick={handleVideoTap}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      {/* Double Tap Seek Feedback Ripples */}
      {seekFeedback && (
        <div
          className={cn(
            "absolute inset-y-0 flex items-center justify-center pointer-events-none z-30 animate-scale-in",
            seekFeedback.direction === "left" ? "left-0 w-1/3 bg-white/10" : "right-0 w-1/3 bg-white/10"
          )}
        >
          <div className="px-3 py-1.5 rounded-full bg-black/80 text-white text-xs font-mono font-bold flex items-center gap-1 shadow-lg">
            <span>{seekFeedback.text}</span>
          </div>
        </div>
      )}

      {/* Top Floating Status Badges */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {isMirrored && (
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold bg-orange-600 text-white flex items-center gap-1 shadow-md animate-scale-in">
              <FlipHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>MIRROR</span>
            </span>
          )}
          {isLooping && (
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold bg-blue-600 text-white flex items-center gap-1 shadow-md animate-scale-in">
              <Repeat className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>LOOP STEP {activeStep.stepNumber}</span>
            </span>
          )}
          {playbackSpeed !== 1.0 && (
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold bg-neutral-900/90 text-neutral-200 border border-neutral-700 backdrop-blur-xs flex items-center gap-1 animate-scale-in">
              <Gauge className="w-3 h-3 text-orange-400" />
              <span>{playbackSpeed}x</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsTheater(!isTheater)}
            className="hidden sm:flex p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs border border-white/10 transition active:scale-95"
            title="Toggle Theater Mode"
          >
            <Tv className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Big Play Button (when paused) */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 bg-black/35 backdrop-blur-[2px] flex items-center justify-center cursor-pointer z-15 transition-all duration-300"
        >
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/95 text-neutral-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]">
            <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current translate-x-0.5 sm:translate-x-1 text-orange-600" />
          </div>
        </div>
      )}

      {/* Bottom Controls Overlay */}
      <div
        className={cn(
          "absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-10 sm:pt-12 pb-2.5 sm:pb-3 px-3 sm:px-4 z-25 transition-opacity duration-200 pointer-events-auto",
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Step Marker Progress Bar */}
        <div className="space-y-1 mb-2 sm:mb-3">
          {/* Visual Step Markers Bar */}
          <div className="relative w-full h-2 bg-neutral-800/90 rounded-full overflow-hidden cursor-pointer flex">
            {routine.steps.map((step) => {
              const stepDuration = step.timestampEnd - step.timestampStart;
              const totalRoutineDur = duration || 105;
              const widthPct = (stepDuration / totalRoutineDur) * 100;
              const isActive = activeStep.id === step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => handleStepMarkerClick(step)}
                  className={cn(
                    "h-full border-r border-black/60 relative group/step transition-colors",
                    isActive ? "bg-orange-500" : "bg-neutral-600 hover:bg-neutral-400"
                  )}
                  style={{ width: `${widthPct}%` }}
                  title={`Step ${step.stepNumber}: ${step.title}`}
                >
                  {/* Tooltip on marker */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden group-hover/step:flex flex-col items-center bg-neutral-900 border border-neutral-700 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap z-30 shadow-xl pointer-events-none">
                    <span className="font-semibold">Step {step.stepNumber}: {step.title}</span>
                    <span className="text-neutral-400">{formatTime(step.timestampStart)} - {formatTime(step.timestampEnd)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Time Slider */}
          <input
            type="range"
            min={0}
            max={duration || 105}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-transparent accent-orange-500 cursor-pointer -mt-1 block py-1"
          />
        </div>

        {/* Action Controls Bar (Mobile Responsive Multi-Item Row) */}
        <div className="flex items-center justify-between text-white text-xs gap-1 sm:gap-2">
          
          {/* Left: Play/Pause, Rewind, Time */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            <button
              onClick={togglePlay}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 text-white transition active:scale-90"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = activeStep.timestampStart;
                }
              }}
              className="p-1.5 rounded-full hover:bg-white/20 text-neutral-300 hover:text-white transition active:scale-90"
              title="Restart Step"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Time Indicator */}
            <div className="font-mono text-[10px] sm:text-xs text-neutral-300">
              <span>{formatTime(currentTime)}</span>
              <span className="text-neutral-500 mx-0.5 sm:mx-1">/</span>
              <span className="text-neutral-400">{formatTime(duration || 105)}</span>
            </div>
          </div>

          {/* Center: DANCE LEARNING SUPER-CONTROLS (Mirror, Loop, Speeds) */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
            
            {/* Mirror Toggle */}
            <button
              onClick={onToggleMirror}
              className={cn(
                "flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition shadow-xs active:scale-90 shrink-0",
                isMirrored
                  ? "bg-orange-600 text-white ring-1 ring-orange-400"
                  : "bg-white/15 text-neutral-200 hover:bg-white/25 hover:text-white"
              )}
              title="Mirror Mode (M)"
            >
              <FlipHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Mirror</span>
            </button>

            {/* Loop Toggle */}
            <button
              onClick={onToggleLoop}
              className={cn(
                "flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition shadow-xs active:scale-90 shrink-0",
                isLooping
                  ? "bg-blue-600 text-white ring-1 ring-blue-400"
                  : "bg-white/15 text-neutral-200 hover:bg-white/25 hover:text-white"
              )}
              title="Loop Active Step (L)"
            >
              <Repeat className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Loop</span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center bg-white/15 rounded-lg p-0.5 border border-white/10 shrink-0">
              {speeds.map((spd) => (
                <button
                  key={spd}
                  onClick={() => onSpeedChange(spd)}
                  className={cn(
                    "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-semibold transition active:scale-95",
                    playbackSpeed === spd
                      ? "bg-white text-neutral-950 shadow-xs"
                      : "text-neutral-300 hover:text-white"
                  )}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Right: Audio & Fullscreen */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full hover:bg-white/20 text-neutral-300 hover:text-white transition active:scale-90"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-full hover:bg-white/20 text-neutral-300 hover:text-white transition active:scale-90"
              aria-label="Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
