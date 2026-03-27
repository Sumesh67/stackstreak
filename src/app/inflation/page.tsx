"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { Flame, TrendingUp, Share2, ArrowLeft, BookOpen, Target, Play, CheckCircle } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { key: "groceries", label: "Groceries 🛒", rate: 0.25, default: 400, color: "text-red-400" },
  { key: "gas", label: "Gas ⛽", rate: 0.18, default: 150, color: "text-orange-400" },
  { key: "utilities", label: "Utilities 💡", rate: 0.22, default: 120, color: "text-yellow-400" },
  { key: "dining", label: "Dining Out 🍽️", rate: 0.28, default: 200, color: "text-red-500" },
  { key: "rent", label: "Housing / Rent 🏠", rate: 0.20, default: 1500, color: "text-red-400" },
  { key: "healthcare", label: "Healthcare 🏥", rate: 0.15, default: 100, color: "text-pink-400" },
  { key: "other", label: "Other 📦", rate: 0.12, default: 300, color: "text-orange-300" },
];

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  const start = useRef<number | null>(null);
  const prev = useRef(0);

  useEffect(() => {
    prev.current = value;
    start.current = null;
    if (raf.current) cancelAnimationFrame(raf.current);

    const from = prev.current;
    const animate = (ts: number) => {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

export default function InflationPage() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(CATEGORIES.map((c) => [c.key, c.default]))
  );
  const [copied, setCopied] = useState(false);

  const extras = CATEGORIES.map((c) => ({
    ...c,
    extra: Math.round(values[c.key] * c.rate),
  })).sort((a, b) => b.extra - a.extra);

  const totalMonthly = extras.reduce((s, c) => s + c.extra, 0);
  const totalYearly = totalMonthly * 12;

  const animatedMonthly = useCountUp(totalMonthly);
  const animatedYearly = useCountUp(totalYearly);

  const handleShare = () => {
    const text = `Inflation is costing me $${totalMonthly}/month extra. I'm fighting back with StackStreak. stackstreak-two.vercel.app/inflation`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-5xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Flame className="text-orange-400 w-6 h-6" />
          <span className="font-black text-lg">StackStreak</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/missions" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
            <Target className="w-4 h-4" /> Missions
          </Link>
          <Link href="/tips" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
            <BookOpen className="w-4 h-4" /> Tips
          </Link>
          <Link href="/learn" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
            <Play className="w-4 h-4" /> Learn
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-block bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 text-red-400 text-sm font-semibold mb-4">
            🔥 Inflation Reality Check
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            How Much Is Inflation<br />
            <span className="text-red-400">Costing You?</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Enter your monthly spending. See exactly how much more you're paying compared to 2023 — in real dollars.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="font-bold text-lg mb-5 text-gray-200">Your Monthly Spending</h2>
            <div className="space-y-5">
              {CATEGORIES.map((cat) => (
                <div key={cat.key}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-300">{cat.label}</label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        max={10000}
                        value={values[cat.key]}
                        onChange={(e) => setValues((v) => ({ ...v, [cat.key]: Math.max(0, Number(e.target.value)) }))}
                        className="w-24 bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:border-orange-500/50 text-white"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={cat.key === "rent" ? 5000 : 1000}
                    step={10}
                    value={values[cat.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [cat.key]: Number(e.target.value) }))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-orange-500 bg-white/10"
                  />
                  <div className="text-right text-xs text-gray-600 mt-1">
                    +{Math.round(cat.rate * 100)}% inflation rate since 2023
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-5">
            {/* Big number */}
            <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 rounded-3xl p-8 text-center">
              <p className="text-gray-300 text-sm mb-2 uppercase tracking-wide font-semibold">You're paying</p>
              <div className="text-6xl font-black text-red-400 mb-1">
                ${animatedMonthly.toLocaleString()}
              </div>
              <p className="text-gray-300 text-lg font-semibold">MORE per month than 2 years ago</p>
              <div className="mt-4 bg-red-500/10 rounded-2xl px-4 py-3 inline-block">
                <span className="text-red-300 font-bold text-xl">${animatedYearly.toLocaleString()}</span>
                <span className="text-gray-400 text-sm ml-2">more per year</span>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="font-bold mb-4 text-gray-200">What's Hitting You Hardest</h3>
              <div className="space-y-3">
                {extras.map((cat, i) => (
                  <div key={cat.key} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{cat.label.split(" ").slice(0, -1).join(" ")}</span>
                        <span className={`font-bold ${cat.color}`}>+${cat.extra}/mo</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${totalMonthly > 0 ? (cat.extra / totalMonthly) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What you can do */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/20 rounded-3xl p-6">
              <h3 className="font-bold mb-3 text-green-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> What You Can Do
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                You can&apos;t control inflation — but you can control your response. Here&apos;s where to start:
              </p>
              <div className="space-y-2">
                <Link href="/tips" className="flex items-center gap-2 text-sm text-gray-300 hover:text-green-300 transition-colors">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  Browse money-saving tips to offset inflation costs
                </Link>
                <Link href="/missions" className="flex items-center gap-2 text-sm text-gray-300 hover:text-green-300 transition-colors">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  Start a savings mission to build your buffer
                </Link>
                <Link href="/emergency-fund" className="flex items-center gap-2 text-sm text-gray-300 hover:text-green-300 transition-colors">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  Build an emergency fund to handle price shocks
                </Link>
              </div>
            </div>

            {/* Share button */}
            <button
              onClick={handleShare}
              className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200
                ${copied
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-orange-500 hover:bg-orange-400 text-white"
                }`}
            >
              {copied ? (
                <><CheckCircle className="w-4 h-4" /> Copied to clipboard!</>
              ) : (
                <><Share2 className="w-4 h-4" /> Share Your Inflation Cost</>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
