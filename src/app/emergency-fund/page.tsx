"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Flame, ArrowLeft, BookOpen, Target, Play, CheckCircle, Shield, Zap, Trophy } from "lucide-react";
import Link from "next/link";

const TIPS = [
  { icon: "🛍️", title: "Sell unused stuff", desc: "List 5 items on Facebook Marketplace or eBay this weekend. Most people have $200–500 sitting in their closet." },
  { icon: "📱", title: "Cut one subscription", desc: "Cancel one $15–20/month subscription today. That's $180–240/year added to your fund." },
  { icon: "🍳", title: "Cook 3 meals at home", desc: "Replace 3 restaurant meals per week with home cooking. Save $60–120/month on average." },
  { icon: "💸", title: "Automate $10/week", desc: "Set up an automatic $10 weekly transfer to a separate savings account. You won't miss what you don't see." },
  { icon: "🚗", title: "Reduce one big expense", desc: "Negotiate your car insurance, phone bill, or internet. One 20-minute call can save $30–80/month." },
];

const BADGES = [
  { label: "First $100", emoji: "🌱", threshold: 100 },
  { label: "First $500", emoji: "🌿", threshold: 500 },
  { label: "1-Month Fund", emoji: "🏆", threshold: 1, isMonths: true },
  { label: "3-Month Fund", emoji: "💎", threshold: 3, isMonths: true },
];

function JarFill({ percent }: { percent: number }) {
  const clampedPct = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="relative w-28 h-40 mx-auto">
      {/* Jar body */}
      <div className="absolute inset-0 border-2 border-white/20 rounded-b-3xl rounded-t-lg overflow-hidden bg-white/5">
        {/* Water fill */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-600 to-orange-400 transition-all duration-700 ease-out"
          style={{ height: `${clampedPct}%` }}
        >
          {/* Wave effect */}
          <div className="absolute -top-2 left-0 right-0 h-4 opacity-60">
            <svg viewBox="0 0 100 10" className="w-full h-full" preserveAspectRatio="none">
              <path d="M0,5 Q25,0 50,5 Q75,10 100,5 L100,10 L0,10 Z" fill="rgb(234,88,12)" />
            </svg>
          </div>
        </div>
        {/* Percent label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-black text-lg drop-shadow">{Math.round(clampedPct)}%</span>
        </div>
      </div>
      {/* Jar lid */}
      <div className="absolute -top-2 left-2 right-2 h-4 bg-white/20 border border-white/30 rounded-t-lg" />
    </div>
  );
}

export default function EmergencyFundPage() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(2500);
  const [weeklySavings, setWeeklySavings] = useState(50);
  const [currentSaved, setCurrentSaved] = useState(0);
  const [started, setStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const target1Month = monthlyExpenses;
  const target3Month = monthlyExpenses * 3;
  const target6Month = monthlyExpenses * 6;

  const weeksTo1Month = Math.ceil(target1Month / weeklySavings);
  const weeksTo3Month = Math.ceil(target3Month / weeklySavings);

  const getTargetDate = (weeks: number) => {
    const d = new Date();
    d.setDate(d.getDate() + weeks * 7);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const fillPercent = target1Month > 0 ? (currentSaved / target1Month) * 100 : 0;

  const earnedBadges = BADGES.filter((b) => {
    if (b.isMonths) return currentSaved >= monthlyExpenses * b.threshold;
    return currentSaved >= b.threshold;
  });

  const handleStart = () => {
    setStarted(true);
    setActiveStep(2);
  };

  // Animate jar when currentSaved changes
  const [displaySaved, setDisplaySaved] = useState(0);
  useEffect(() => {
    const diff = currentSaved - displaySaved;
    if (diff === 0) return;
    const step = Math.ceil(Math.abs(diff) / 20);
    const timer = setInterval(() => {
      setDisplaySaved((prev) => {
        const next = prev + (diff > 0 ? step : -step);
        if ((diff > 0 && next >= currentSaved) || (diff < 0 && next <= currentSaved)) {
          clearInterval(timer);
          return currentSaved;
        }
        return next;
      });
    }, 16);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSaved]);

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
          <div className="inline-block bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-orange-400 text-sm font-semibold mb-4">
            🏦 Emergency Fund Challenge
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Your Safety Net Starts<br />
            <span className="text-orange-400">with One Week</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            56% of Americans can&apos;t cover a $1,000 emergency. You&apos;re about to be different. Let&apos;s build your fund — one week at a time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Steps */}
          <div className="space-y-5">
            {/* Step 1 */}
            <div className={`bg-white/5 border rounded-3xl p-6 transition-colors ${activeStep === 1 ? "border-orange-500/40" : "border-white/10"}`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${activeStep >= 1 ? "bg-orange-500 text-white" : "bg-white/10 text-gray-500"}`}>1</div>
                <h2 className="font-bold text-lg">What are your monthly essentials?</h2>
              </div>
              <div className="space-y-2 mb-5">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-400">Total monthly essential expenses</label>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      min={500}
                      max={20000}
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(Math.max(500, Number(e.target.value)))}
                      className="w-28 bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:border-orange-500/50 text-white"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={500}
                  max={10000}
                  step={50}
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-orange-500 bg-white/10"
                />
                <p className="text-xs text-gray-500">Include: rent, utilities, groceries, transport, insurance</p>
              </div>
              {/* Targets */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "1-Month Target", amount: target1Month, color: "text-orange-400" },
                  { label: "3-Month Target", amount: target3Month, color: "text-yellow-400" },
                  { label: "6-Month Target", amount: target6Month, color: "text-green-400" },
                ].map((t) => (
                  <div key={t.label} className="bg-white/5 rounded-xl p-3 text-center">
                    <div className={`font-black text-lg ${t.color}`}>${t.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{t.label}</div>
                  </div>
                ))}
              </div>
              {activeStep === 1 && (
                <button
                  onClick={() => setActiveStep(2)}
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-400 py-3 rounded-xl font-bold text-sm transition-colors"
                >
                  Next: Set savings rate →
                </button>
              )}
            </div>

            {/* Step 2 */}
            <div className={`bg-white/5 border rounded-3xl p-6 transition-colors ${activeStep === 2 ? "border-orange-500/40" : "border-white/10"}`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${activeStep >= 2 ? "bg-orange-500 text-white" : "bg-white/10 text-gray-500"}`}>2</div>
                <h2 className="font-bold text-lg">How much can you save per week?</h2>
              </div>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-400">Weekly savings</label>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 text-sm">$</span>
                    <span className="font-black text-orange-400 text-xl">{weeklySavings}</span>
                    <span className="text-gray-500 text-sm">/week</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={10}
                  max={200}
                  step={5}
                  value={weeklySavings}
                  onChange={(e) => setWeeklySavings(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-orange-500 bg-white/10"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>$10</span><span>$200</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white/5 rounded-2xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">📅 Your Timeline</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Shield className="w-4 h-4 text-orange-400" />
                    1-month fund
                  </div>
                  <div className="text-right">
                    <div className="text-orange-300 font-semibold text-sm">{getTargetDate(weeksTo1Month)}</div>
                    <div className="text-gray-600 text-xs">{weeksTo1Month} weeks away</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    3-month fund
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-300 font-semibold text-sm">{getTargetDate(weeksTo3Month)}</div>
                    <div className="text-gray-600 text-xs">{weeksTo3Month} weeks away</div>
                  </div>
                </div>
              </div>

              {!started && activeStep === 2 && (
                <button
                  onClick={handleStart}
                  className="mt-4 w-full bg-orange-500 hover:bg-orange-400 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Start This Challenge
                </button>
              )}
            </div>

            {/* Step 3 - progress tracker */}
            {started && (
              <div className="bg-white/5 border border-orange-500/30 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black bg-orange-500 text-white">3</div>
                  <h2 className="font-bold text-lg">Track Your Progress</h2>
                </div>
                <p className="text-gray-400 text-sm mb-4">Simulate your savings journey below:</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-400">Amount saved so far</label>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        min={0}
                        max={target6Month}
                        value={currentSaved}
                        onChange={(e) => setCurrentSaved(Math.max(0, Number(e.target.value)))}
                        className="w-28 bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:border-orange-500/50 text-white"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={target3Month}
                    step={10}
                    value={currentSaved}
                    onChange={(e) => setCurrentSaved(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-orange-500 bg-white/10"
                  />
                </div>

                {/* Milestones */}
                <div className="space-y-2">
                  {[
                    { label: "First $100", done: currentSaved >= 100 },
                    { label: "First $500", done: currentSaved >= 500 },
                    { label: `1-Month Fund ($${target1Month.toLocaleString()})`, done: currentSaved >= target1Month },
                    { label: `3-Month Fund ($${target3Month.toLocaleString()})`, done: currentSaved >= target3Month },
                  ].map((m) => (
                    <div key={m.label} className={`flex items-center gap-3 text-sm py-2 px-3 rounded-xl transition-colors ${m.done ? "bg-green-500/10 text-green-300" : "text-gray-500"}`}>
                      <CheckCircle className={`w-4 h-4 shrink-0 ${m.done ? "text-green-400" : "text-gray-700"}`} />
                      {m.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Visual + Tips */}
          <div className="space-y-5">
            {/* Jar animation */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
              <h3 className="font-bold text-gray-200 mb-4">Your Emergency Fund Jar</h3>
              <JarFill percent={started ? (displaySaved / target1Month) * 100 : 0} />
              <div className="mt-4">
                <div className="text-3xl font-black text-orange-400">${started ? displaySaved.toLocaleString() : "0"}</div>
                <div className="text-gray-500 text-sm">of ${target1Month.toLocaleString()} goal (1-month)</div>
              </div>

              {/* Badges */}
              {earnedBadges.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {earnedBadges.map((b) => (
                    <div key={b.label} className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1.5 text-xs font-semibold text-yellow-300 flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> {b.emoji} {b.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Motivational stat */}
            <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/20 rounded-3xl p-5">
              <p className="text-orange-300 font-bold text-sm mb-1">💡 Did you know?</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                At ${weeklySavings}/week, you&apos;ll save <span className="text-orange-400 font-bold">${(weeklySavings * 52).toLocaleString()}</span> in a year. That&apos;s more than most Americans have saved in a decade.
              </p>
            </div>

            {/* Tips */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="font-bold text-gray-200 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" /> 5 Ways to Build Faster
              </h3>
              <div className="space-y-3">
                {TIPS.map((tip) => (
                  <div key={tip.title} className="flex gap-3">
                    <span className="text-xl shrink-0 mt-0.5">{tip.icon}</span>
                    <div>
                      <div className="font-semibold text-sm text-gray-200">{tip.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tip.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            {!started && (
              <button
                onClick={() => { setActiveStep(2); }}
                className="w-full bg-orange-500 hover:bg-orange-400 py-4 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" /> Start Building Your Emergency Fund
              </button>
            )}
            {started && (
              <Link
                href="/dashboard"
                className="w-full bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 py-4 rounded-2xl font-bold text-sm text-green-400 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Challenge started! View Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
