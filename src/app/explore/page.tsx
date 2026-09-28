import React from "react";
import { LibrarySection } from "@/components/discovery/LibrarySection";

export const metadata = {
  title: "Dance Library | Seekho Dance",
  description: "Browse step-by-step breakdowns for songs across Bollywood, Traditional, Rajasthani, and more.",
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0D0D11] text-neutral-900 dark:text-[#EDEDF0]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-14">
        <LibrarySection />
      </div>
    </div>
  );
}

