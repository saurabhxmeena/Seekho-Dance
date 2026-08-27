"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ArrowRight,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingSectionProps {
  className?: string;
}

export function PricingSection({ className }: PricingSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const perksMonthly = [
    "Full access to 100+ viral song choreographies",
    "Horizontal mirror flip (left matches left, right matches right)",
    "0.5x and custom tempo slow-motion footwork drills",
    "8-count audio loop practice tools",
    "New viral choreography tutorials added weekly",
    "Stream on iPhone, iPad, Mac, and Smart TV",
  ];

  const perksOneTime = [
    "30 days of full, unlimited studio access",
    "Single payment • Never auto-renews",
    "Horizontal mirror mode & slow-motion controls",
    "8-count loop practice tools",
    "Ideal for learning an event, wedding, or party routine",
    "No credit card saved or future charges",
  ];

  const comparisonRows = [
    {
      feature: "Choreography Library",
      free: "Select Starter Picks",
      monthly: "All 100+ Routines",
    },
    {
      feature: "Horizontal Mirror Mode",
      free: false,
      monthly: true,
    },
    {
      feature: "0.5x Slow-Motion Tempo",
      free: false,
      monthly: true,
    },
    {
      feature: "8-Count Beat Loop Drillers",
      free: false,
      monthly: true,
    },
    {
      feature: "Step Breakdown Access",
      free: "Step 01 (Foundation only)",
      monthly: "Full Routine (Start to Finish)",
    },
    {
      feature: "Weekly New Song Drops",
      free: false,
      monthly: true,
    },
    {
      feature: "Device Sync & Practice Tracking",
      free: true,
      monthly: true,
    },
  ];

  const faqs = [
    {
      q: "How does the Monthly Subscription work?",
      a: "The Monthly Subscription gives you continuous, unlimited access to all 100+ song tutorials, horizontal mirror mode, custom speed controls, and 8-count loop drillers for ₹499/month. It auto-renews monthly and can be cancelled with a single tap at any time in Profile settings.",
    },
    {
      q: "What is the difference between the Monthly Plan and 1-Month Pass?",
      a: "The Monthly Plan (₹499/mo) is a flexible subscription that renews monthly until cancelled. The 1-Month Pass (₹799) is a single, one-time payment providing 30 days of full studio access — ideal for learning a specific wedding, party, or event routine without saving a card or auto-renewing.",
    },
    {
      q: "Can I cancel my subscription anytime? Are there any hidden fees?",
      a: "Yes. You can cancel your subscription with a single tap in your Profile settings whenever you wish. You will retain full access until the end of your current billing period, with zero cancellation fees or lock-ins.",
    },
    {
      q: "What is Horizontal Mirror Mode, and why is it essential?",
      a: "In standard dance videos, the instructor's right arm appears on your left side, forcing you to mentally reverse movements. Our 1-tap mirror flip horizontally inverts the dancer so their movements match yours naturally, exactly like standing in front of a real studio mirror.",
    },
    {
      q: "Do I need any prior dance experience to learn?",
      a: "None at all. Each routine begins with foundational counts and 0.5x slow-motion footwork drills before progressively building up to full track tempo, making every song accessible to complete beginners.",
    },
    {
      q: "Which devices are supported for practice?",
      a: "Seekho Dance runs seamlessly on iPhone, iPad, Android smartphones, Mac, Windows laptops, and can be cast to your Smart TV or AirPlay screen for full living-room practice.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We support all major payment options including UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay), and Net Banking via encrypted secure processing.",
    },
  ];

  return (
    <section className={cn("px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-16 sm:py-24", className)}>
      
      {/* 1. Apple Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 sm:mb-18">
        <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
          Seekho Studio Pass
        </p>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-950 dark:text-white leading-tight">
          Choose the plan that&apos;s right for you.
        </h2>

        <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          Simple, transparent pricing. Cancel anytime.
        </p>
      </div>

      {/* 2. Apple Side-by-Side Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-20 sm:mb-28 items-stretch">
        
        {/* Plan 1: Monthly Subscription */}
        <div className="rounded-3xl bg-neutral-100/70 dark:bg-[#1C1C1E] border border-neutral-200/80 dark:border-neutral-800 p-8 sm:p-10 flex flex-col justify-between shadow-xs">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Subscription
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                Monthly Pass
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Continuous access to all choreographies.
              </p>
            </div>

            {/* Price */}
            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white font-sans">
                  ₹499
                </span>
                <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                  / month
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Auto-renews monthly. Cancel anytime in Settings.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/dance/tauba-tauba"
                className="w-full py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 flex items-center justify-center gap-2 transition active:scale-98 text-center shadow-xs"
              >
                <span>Get Monthly Pass</span>
              </Link>
            </div>

            {/* Feature List */}
            <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-800 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
                Includes:
              </p>
              <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                {perksMonthly.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <Check className="w-4 h-4 text-neutral-950 dark:text-white shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
            Cancel anytime in Profile settings.
          </div>
        </div>

        {/* Plan 2: 1-Month One-Time Pass */}
        <div className="rounded-3xl bg-neutral-100/70 dark:bg-[#1C1C1E] border border-neutral-200/80 dark:border-neutral-800 p-8 sm:p-10 flex flex-col justify-between shadow-xs">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                One-Time Payment
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                1-Month Pass
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Full studio access for 30 days. No recurring charges.
              </p>
            </div>

            {/* Price */}
            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white font-sans">
                  ₹799
                </span>
                <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
                  one-time
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Single payment. Expires in 30 days.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/dance/tauba-tauba"
                className="w-full py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white flex items-center justify-center gap-2 transition active:scale-98 text-center"
              >
                <span>Buy 1-Month Pass</span>
              </Link>
            </div>

            {/* Feature List */}
            <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-800 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
                Includes:
              </p>
              <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                {perksOneTime.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <Check className="w-4 h-4 text-neutral-950 dark:text-white shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
            Never charges again automatically.
          </div>
        </div>

      </div>

      {/* 3. Apple-Style Comparison Table: Free Plan vs Monthly Subscription */}
      <div className="max-w-4xl mx-auto mb-20 sm:mb-28">
        <div className="text-center mb-10 space-y-1">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Compare Free Plan vs. Monthly Subscription
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            See everything included with your All-Access Monthly Pass.
          </p>
        </div>

        <div className="rounded-3xl bg-neutral-100/50 dark:bg-[#1C1C1E] border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
          <div className="grid grid-cols-12 p-5 sm:p-6 border-b border-neutral-200/80 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <div className="col-span-6 sm:col-span-6">Features</div>
            <div className="col-span-3 sm:col-span-3 text-center">Free Explorer</div>
            <div className="col-span-3 sm:col-span-3 text-center text-neutral-950 dark:text-white">Monthly (₹499/mo)</div>
          </div>

          <div className="divide-y divide-neutral-200/70 dark:divide-neutral-800/70 text-xs sm:text-sm">
            {comparisonRows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-neutral-200/30 dark:hover:bg-neutral-800/40 transition">
                <div className="col-span-6 sm:col-span-6 font-medium text-neutral-950 dark:text-neutral-100">
                  {row.feature}
                </div>

                <div className="col-span-3 sm:col-span-3 text-center text-neutral-500 dark:text-neutral-400">
                  {typeof row.free === "boolean" ? (
                    row.free ? (
                      <Check className="w-4 h-4 text-neutral-950 dark:text-white mx-auto stroke-[2.5]" />
                    ) : (
                      <Minus className="w-4 h-4 text-neutral-300 dark:text-neutral-600 mx-auto" />
                    )
                  ) : (
                    <span className="text-[11px] sm:text-xs font-mono">{row.free}</span>
                  )}
                </div>

                <div className="col-span-3 sm:col-span-3 text-center font-semibold text-neutral-950 dark:text-white">
                  {typeof row.monthly === "boolean" ? (
                    row.monthly ? (
                      <Check className="w-4 h-4 text-orange-600 dark:text-orange-400 mx-auto stroke-[2.5]" />
                    ) : (
                      <Minus className="w-4 h-4 text-neutral-300 dark:text-neutral-600 mx-auto" />
                    )
                  ) : (
                    <span className="text-[11px] sm:text-xs font-mono text-orange-600 dark:text-orange-400 font-semibold">{row.monthly}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* 5. Apple FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-6 mb-16">
        <div className="text-center space-y-1.5 mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Questions & Answers
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Everything you need to know about plans, billing, and studio practice.
          </p>
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-4 sm:py-5 transition-colors">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left flex items-center justify-between gap-4 text-sm sm:text-base font-semibold text-neutral-950 dark:text-white group"
                  aria-expanded={isOpen}
                >
                  <span className="group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {faq.q}
                  </span>
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all",
                    isOpen 
                      ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" 
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200"
                  )}>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="pt-3 pr-6 sm:pr-10 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Have more questions? Reach out to our team at{" "}
            <a href="mailto:support@seekhodance.com" className="text-orange-600 dark:text-orange-400 underline underline-offset-2 hover:opacity-80">
              support@seekhodance.com
            </a>
          </p>
        </div>
      </div>



    </section>
  );
}
