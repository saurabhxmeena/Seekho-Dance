"use client";

export interface RoutineProgress {
  routineId: string;
  completedStepIds: string[];
  lastPracticedDate: string;
}

const PROGRESS_KEY = "seekho_progress";
const SAVED_KEY = "seekho_saved";
const PROFILE_KEY = "seekho_profile";

export interface UserProfileData {
  name: string;
  email: string;
  plan: "Free Explorer" | "Studio Pass";
  dailyGoalMinutes: number;
  streakDays: number;
}

export function getUserProfile(): UserProfileData {
  if (typeof window === "undefined") {
    return {
      name: "Seekho Dancer",
      email: "dancer@seekhodance.com",
      plan: "Free Explorer",
      dailyGoalMinutes: 15,
      streakDays: 5,
    };
  }

  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}

  return {
    name: "Seekho Dancer",
    email: "dancer@seekhodance.com",
    plan: "Free Explorer",
    dailyGoalMinutes: 15,
    streakDays: 5,
  };
}

export function saveUserProfile(profile: Partial<UserProfileData>) {
  if (typeof window === "undefined") return;
  try {
    const current = getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  } catch (e) {}
}

export function getSavedDances(): string[] {
  if (typeof window === "undefined") return ["chaleya", "naatu-naatu", "gimme-more"];
  try {
    const data = localStorage.getItem(SAVED_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return ["chaleya", "naatu-naatu", "gimme-more"];
}

export function toggleSaveDance(routineId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const saved = getSavedDances();
    let updated: string[];
    let isNowSaved = false;
    if (saved.includes(routineId)) {
      updated = saved.filter((id) => id !== routineId);
      isNowSaved = false;
    } else {
      updated = [...saved, routineId];
      isNowSaved = true;
    }
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    return isNowSaved;
  } catch (e) {
    return false;
  }
}
