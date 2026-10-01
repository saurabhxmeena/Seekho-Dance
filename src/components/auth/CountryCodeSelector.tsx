"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

export interface CountryCode {
  code: string;
  dial: string;
  name: string;
  flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: "IN", dial: "+91", name: "India", flag: "🇮🇳" },
  { code: "US", dial: "+1", name: "United States", flag: "🇺🇸" },
  { code: "GB", dial: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", dial: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "AU", dial: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "DE", dial: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "FR", dial: "+33", name: "France", flag: "🇫🇷" },
  { code: "JP", dial: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "KR", dial: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "SG", dial: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "AE", dial: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "SA", dial: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "BD", dial: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "PK", dial: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "LK", dial: "+94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "NP", dial: "+977", name: "Nepal", flag: "🇳🇵" },
  { code: "MY", dial: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "TH", dial: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "ID", dial: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "PH", dial: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "BR", dial: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", dial: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "ZA", dial: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "NG", dial: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "KE", dial: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "IT", dial: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "ES", dial: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "NL", dial: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", dial: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", dial: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "NZ", dial: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "IE", dial: "+353", name: "Ireland", flag: "🇮🇪" },
  { code: "PT", dial: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "RU", dial: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "CN", dial: "+86", name: "China", flag: "🇨🇳" },
  { code: "HK", dial: "+852", name: "Hong Kong", flag: "🇭🇰" },
  { code: "TW", dial: "+886", name: "Taiwan", flag: "🇹🇼" },
];

interface CountryCodeSelectorProps {
  selected: CountryCode;
  onChange: (country: CountryCode) => void;
  disabled?: boolean;
}

export function CountryCodeSelector({
  selected,
  onChange,
  disabled = false,
}: CountryCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-900 dark:text-white hover:border-neutral-300 dark:hover:border-neutral-600 transition disabled:opacity-40 disabled:cursor-not-allowed min-w-[90px] cursor-pointer"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="text-xs font-semibold">{selected.dial}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-64 max-h-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search */}
          <div className="p-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-none text-xs text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:ring-1 focus:ring-orange-500/50"
              />
            </div>
          </div>

          {/* Country list */}
          <div className="max-h-56 overflow-y-auto">
            {filtered.map((country) => (
              <button
                key={country.code + country.dial}
                type="button"
                onClick={() => {
                  onChange(country);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition cursor-pointer ${
                  selected.code === country.code && selected.dial === country.dial
                    ? "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300"
                    : "text-neutral-800 dark:text-neutral-200"
                }`}
              >
                <span className="text-base leading-none">{country.flag}</span>
                <span className="flex-1 text-left font-medium">{country.name}</span>
                <span className="text-neutral-400 font-mono text-[11px]">{country.dial}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-neutral-400">
                No country found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { COUNTRY_CODES };
