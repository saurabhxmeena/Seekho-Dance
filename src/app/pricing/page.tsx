import React from "react";
import { PricingSection } from "@/components/pricing/PricingSection";

export const metadata = {
  title: "Pricing | Seekho Dance",
  description: "Simple, transparent pricing to learn viral dance choreographies step-by-step.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-50 transition-colors duration-200">
      <PricingSection />
    </div>
  );
}
