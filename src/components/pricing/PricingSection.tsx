"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Minus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingSectionProps {
  className?: string;
}

export function PricingSection({ className }: PricingSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      cadence: "Forever free",
      tagline: "Start learning foundational steps on any song.",
      buttonText: "Try Free",
      buttonHref: "/explore",
      isPrimary: false,
      features: [
        "Access to beginner dance breakdowns",
        "Interactive step syllabus & count sheet",
        "Standard playback speeds (1.0x, 0.75x)",
        "Available on iPhone, iPad, and desktop",
        "Stream on 1 device at a time",
      ],
    },
    {
      id: "monthly",
      name: "Monthly",
      price: "$9.99",
      cadence: "per month after 7-day free trial",
      tagline: "Full access to all choreographies and studio practice tools.",
      buttonText: "Try 7 Days Free",
      buttonHref: "/dance/tauba-tauba",
      isPrimary: true,
      badge: "Popular",
      features: [
        "Unlimited access to all choreography tutorials",
        "Horizontal camera mirror mode",
        "0.5x, 0.75x, and custom slow-motion",
        "8-count loop practice drillers",
        "New song choreographies added every week",
        "Available on iPhone, iPad, Mac, and desktop",
        "Cancel anytime in one tap",
      ],
    },
    {
      id: "annual",
      name: "Annual",
      price: "$79",
      cadence: "per year ($6.58/mo) after 7-day free trial",
      tagline: "Save over 30% with an annual pass for uninterrupted learning.",
      buttonText: "Try 7 Days Free",
      buttonHref: "/dance/tauba-tauba",
      isPrimary: false,
      badge: "Save 34%",
      features: [
        "Everything in Monthly",
        "Best overall value ($6.58/month)",
        "Early access to newly released song tutorials",
        "Downloadable 8-count beat sheets",
        "Priority requests for upcoming songs",
        "Cancel anytime in one tap",
      ],
    },
  ];

  const comparisonRows = [
    { feature: "Access to viral song breakdowns", free: "Beginner songs", monthly: "All songs", annual: "All songs" },
    { feature: "Horizontal mirror mode", free: false, monthly: true, annual: true },
    { feature: "Slow-motion controls (0.5x, 0.75x)", free: false, monthly: true, annual: true },
    { feature: "8-count loop practice", free: false, monthly: true, annual: true },
    { feature: "Step-by-step syllabus & notation", free: true, monthly: true, annual: true },
    { feature: "New routines added weekly", free: false, monthly: true, annual: true },
    { feature: "Multi-device streaming (Phone, Tablet, Desktop)", free: true, monthly: true, annual: true },
    { feature: "Free trial period", free: "—", monthly: "7 days free", annual: "7 days free" },
  ];

  const faqs = [
    {
      q: "How does the free trial work?",
      a: "You get 7 days of full, unlimited access to every song tutorial and studio practice feature. If you decide Seekho Dance isn't for you, cancel anytime in your account before the 7 days are up and you won't be charged.",
    },
    {
      q: "What is horizontal mirror mode?",
      a: "In real dance studios, you learn by facing the instructor in the mirror so their right hand is on your right side. Our mirror mode inverts the video horizontally with one click so you never have to reverse movements in your head.",
    },
    {
      q: "Do I need prior dance experience?",
      a: "No. Each routine is broken down step-by-step starting from foundational footwork up to the full BPM speed, specifically designed for beginners and intermediate dancers.",
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes. You can cancel with a single click in your account settings. There are no cancellation fees, contracts, or commitments.",
    },
  ];

  return (
    <section className={cn("px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-16 sm:py-24", className)}>
      
      {/* 1. Apple-Style Hero Headline */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1D1D1F] dark:text-white leading-[1.06]">
          Choose the plan that&apos;s
          <br />
          <span className="text-[#86868B] font-medium">
            right for you.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-[#6E6E73] dark:text-[#86868B] mt-4 max-w-lg mx-auto">
          Start with a 7-day free trial. Cancel anytime.
        </p>
      </div>

      {/* 2. Apple-Style 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto mb-24">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "rounded-[28px] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 relative",
              "bg-[#FFFFFF] dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#2C2C2E]",
              "shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
              plan.isPrimary && "ring-2 ring-[#0071E3] dark:ring-[#0071E3]"
            )}
          >
            <div>
              {/* Top Row: Plan Name & Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
                  {plan.name}
                </h3>
                {plan.badge && (
                  <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0071E3]/20 dark:text-[#2997FF]">
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Tagline */}
              <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed min-h-[34px]">
                {plan.tagline}
              </p>

              {/* Price */}
              <div className="mt-6 mb-6">
                <div className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1D1D1F] dark:text-white font-sans">
                  {plan.price}
                </div>
                <div className="text-xs text-[#6E6E73] dark:text-[#86868B] font-normal mt-1 leading-snug">
                  {plan.cadence}
                </div>
              </div>

              {/* Apple Action Button */}
              <Link
                href={plan.buttonHref}
                className={cn(
                  "w-full py-3.5 px-6 rounded-full text-sm font-semibold flex items-center justify-center transition-all duration-200 active:scale-98 text-center",
                  plan.isPrimary
                    ? "bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-sm"
                    : "bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] dark:bg-[#2C2C2E] dark:hover:bg-[#3A3A3C] dark:text-white"
                )}
              >
                {plan.buttonText}
              </Link>

              {/* Divider */}
              <div className="border-t border-[#E5E5EA] dark:border-[#2C2C2E] my-7" />

              {/* Feature List */}
              <ul className="space-y-3.5 text-xs sm:text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
                {plan.features.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 leading-relaxed">
                    <Check className="w-4 h-4 text-[#0071E3] dark:text-[#2997FF] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Apple-Style "Compare All Plans" Table */}
      <div className="max-w-4xl mx-auto mb-24">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-white tracking-tight">
            Compare all plans
          </h3>
        </div>

        <div className="rounded-[24px] overflow-hidden border border-[#E5E5EA] dark:border-[#2C2C2E] bg-white dark:bg-[#1C1C1E]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5EA] dark:border-[#2C2C2E] bg-[#F5F5F7]/80 dark:bg-[#2C2C2E]/60 text-[#1D1D1F] dark:text-white">
                <th className="py-4 px-4 sm:px-6 font-semibold">Features</th>
                <th className="py-4 px-3 sm:px-4 font-semibold text-center w-24 sm:w-32">Free</th>
                <th className="py-4 px-3 sm:px-4 font-semibold text-center w-24 sm:w-32 text-[#0071E3] dark:text-[#2997FF]">Monthly</th>
                <th className="py-4 px-3 sm:px-4 font-semibold text-center w-24 sm:w-32">Annual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5EA] dark:divide-[#2C2C2E]">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F5F5F7]/40 dark:hover:bg-[#2C2C2E]/30 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-center text-[#6E6E73] dark:text-[#86868B]">
                    {typeof row.free === "string" ? (
                      <span className="text-xs font-medium">{row.free}</span>
                    ) : row.free ? (
                      <Check className="w-4 h-4 mx-auto text-[#1D1D1F] dark:text-white stroke-[2.5]" />
                    ) : (
                      <Minus className="w-4 h-4 mx-auto text-[#D2D2D7] dark:text-[#48484A]" />
                    )}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-center text-[#1D1D1F] dark:text-white font-medium">
                    {typeof row.monthly === "string" ? (
                      <span className="text-xs font-medium text-[#0071E3] dark:text-[#2997FF]">{row.monthly}</span>
                    ) : row.monthly ? (
                      <Check className="w-4 h-4 mx-auto text-[#0071E3] dark:text-[#2997FF] stroke-[2.5]" />
                    ) : (
                      <Minus className="w-4 h-4 mx-auto text-[#D2D2D7] dark:text-[#48484A]" />
                    )}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-center text-[#1D1D1F] dark:text-white font-medium">
                    {typeof row.annual === "string" ? (
                      <span className="text-xs font-medium">{row.annual}</span>
                    ) : row.annual ? (
                      <Check className="w-4 h-4 mx-auto text-[#0071E3] dark:text-[#2997FF] stroke-[2.5]" />
                    ) : (
                      <Minus className="w-4 h-4 mx-auto text-[#D2D2D7] dark:text-[#48484A]" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Apple-Style Questions Accordion */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-white tracking-tight">
            Questions? We&apos;ve got answers.
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-[20px] border border-[#E5E5EA] dark:border-[#2C2C2E] bg-white dark:bg-[#1C1C1E] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full py-4.5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-semibold text-[#1D1D1F] dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-[#86868B] shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 text-[#1D1D1F] dark:text-white"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#6E6E73] dark:text-[#86868B] leading-relaxed border-t border-[#F5F5F7] dark:border-[#2C2C2E]">
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
