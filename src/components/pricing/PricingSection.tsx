"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  FlipHorizontal,
  Gauge,
  Repeat,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  Play,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingSectionProps {
  className?: string;
}

export function PricingSection({ className }: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<"annual" | "monthly">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const perks = [
    "Unlimited access to all viral choreography breakdowns",
    "Horizontal camera mirror mode on every routine",
    "0.5x, 0.75x, and custom tempo slow-motion drills",
    "Interactive 8-count audio loop practice tools",
    "New song tutorials released weekly",
    "Stream on iPhone, iPad, Mac, and TV",
  ];

  const faqs = [
    {
      q: "How does the 7-day free trial work?",
      a: "You get instant, unlimited access to every song tutorial and studio practice feature for 7 days. If you cancel before the trial ends, you will not be charged a single penny.",
    },
    {
      q: "What is Horizontal Mirror Mode?",
      a: "In real dance studios, you learn by facing the instructor in the mirror so their right hand matches your right hand. Our 1-click mirror mode inverts the video horizontally so you never have to reverse movements in your head.",
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes. You can cancel with a single click inside your Profile settings at any time. There are no cancellation fees, contracts, or lock-ins.",
    },
    {
      q: "Do I need any prior dance experience?",
      a: "None at all. Each routine starts with slow-tempo foundational footwork and builds up step-by-step to the full BPM speed.",
    },
  ];

  return (
    <section className={cn("px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-16 sm:py-24", className)}>
      
      {/* 1. Monolithic Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 inline-block animate-pulse" />
          <span>All-Access Studio Pass</span>
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.04]">
          Unlimited Dance Training.
          <br />
          <span className="text-neutral-400 dark:text-neutral-500 font-medium">
            One All-Access Membership.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed pt-1">
          Master the choreography behind the songs you love. Practice with horizontal mirror mode, 0.5x slow-motion, and 8-count loop drillers.
        </p>
      </div>

      {/* 2. Luxury Hero Membership Pass Card */}
      <div className="max-w-3xl mx-auto rounded-[36px] bg-neutral-950 text-white dark:bg-[#18181A] border border-neutral-900 dark:border-neutral-700/80 shadow-2xl p-7 sm:p-12 relative overflow-hidden mb-16 sm:mb-20">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          
          {/* Card Top: Plan Title & Cadence Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-8 border-b border-neutral-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-orange-400">
                  Seekho Studio Pass
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-neutral-200 border border-white/15">
                  7-Day Free Trial
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                All-Access Membership
              </h3>
            </div>

            {/* Apple-style embedded toggle */}
            <div className="inline-flex items-center bg-neutral-900 dark:bg-neutral-800/90 p-1 rounded-2xl border border-neutral-800">
              <button
                onClick={() => setBillingPeriod("annual")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5",
                  billingPeriod === "annual"
                    ? "bg-white text-neutral-950 shadow-sm font-bold"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <span>Annual</span>
                <span className="text-[10px] font-mono font-bold text-orange-600 uppercase bg-orange-100 px-1.5 py-0.5 rounded">
                  Save 34%
                </span>
              </button>
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200",
                  billingPeriod === "monthly"
                    ? "bg-white text-neutral-950 shadow-sm font-bold"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Price & Value Callout */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-7xl font-bold tracking-tight text-white font-sans">
                  {billingPeriod === "annual" ? "$6.58" : "$9.99"}
                </span>
                <span className="text-sm sm:text-base text-neutral-400 font-medium">
                  / month
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                {billingPeriod === "annual"
                  ? "Billed annually at $79/year after 7-day free trial."
                  : "Billed monthly after 7-day free trial."}
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-neutral-300 font-medium">
              <div>✓ Unlimited Full Breakdown Access</div>
              <div className="text-neutral-400">✓ All Practice Studio Tools Included</div>
            </div>
          </div>

          {/* Core Feature Grid */}
          <div className="pt-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Everything included in your membership:
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm text-neutral-200">
              {perks.map((perk, idx) => (
                <li key={idx} className="flex items-start gap-3 leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action CTA & Reassurance */}
          <div className="pt-4 space-y-3">
            <Link
              href="/dance/tauba-tauba"
              className="w-full py-4 px-8 rounded-2xl text-sm sm:text-base font-bold bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center gap-2 transition shadow-xl shadow-orange-600/40 active:scale-98 text-center"
            >
              <span>Start Your 7-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-400 text-center">
              <span>✓ 7 Days Completely Free</span>
              <span>✓ Cancel Anytime in 1 Tap</span>
              <span>✓ 0 Commitments</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Three Practice Superpowers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-20 sm:mb-24">
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200/90 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-2xs">
            <FlipHorizontal className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-neutral-950 dark:text-white tracking-tight">
            Horizontal Mirror Mode
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Invert the video horizontally with 1 tap so left is left and right is right. Follow the choreographer naturally like a real studio mirror.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200/90 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-2xs">
            <Gauge className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-neutral-950 dark:text-white tracking-tight">
            0.5x Slow-Motion Tempo
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Break down complex footwork and hip grooves at half tempo before speeding up to full song speed.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200/90 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-2xs">
            <Repeat className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-neutral-950 dark:text-white tracking-tight">
            8-Count Loop Drillers
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Seamlessly loop tough measures to build automatic muscle memory without having to touch the timeline scrubber.
          </p>
        </div>
      </div>

      {/* 4. Free Explorer Plan Comparison Card */}
      <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-neutral-200/90 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-20 sm:mb-24">
        <div className="space-y-1.5 max-w-lg">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
            Free Plan
          </span>
          <h4 className="text-xl font-bold text-neutral-950 dark:text-white tracking-tight">
            Just want to explore foundational steps?
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Try our Free Explorer access. You get standard playback on beginner dance breakdowns with no credit card required.
          </p>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition shrink-0"
        >
          <span>Explore Free Tutorials</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 5. Apple-Style FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-1 mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Clear, honest answers about your Seekho Dance membership.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1C1C1E] overflow-hidden transition-all duration-200 shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full py-4.5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-neutral-950 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 text-orange-600 dark:text-orange-400"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
