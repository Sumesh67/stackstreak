"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Flame, ArrowLeft, BookOpen, Target, Play, Share2, CheckCircle, RotateCcw, TrendingUp } from "lucide-react";
import Link from "next/link";

type Answer = string | number | null;

const QUESTIONS = [
  {
    id: 1,
    text: "How many months of expenses do you have saved?",
    type: "scale" as const,
    options: [
      { label: "None / less than 1 week", value: 0, points: 0 },
      { label: "1–4 weeks", value: 1, points: 4 },
      { label: "1–2 months", value: 2, points: 8 },
      { label: "3+ months", value: 3, points: 14 },
    ],
  },
  {
    id: 2,
    text: "Do you track your monthly spending?",
    type: "yesno" as const,
    options: [
      { label: "Yes, regularly", value: "yes", points: 8 },
      { label: "Sometimes", value: "sometimes", points: 4 },
      { label: "Not really", value: "no", points: 0 },
    ],
  },
  {
    id: 3,
    text: "Do you have high-interest debt? (credit cards, payday loans)",
    type: "yesno" as const,
    options: [
      { label: "No debt / only low-interest", value: "no", points: 12 },
      { label: "Some, working on it", value: "some", points: 4 },
      { label: "Yes, significant balance", value: "yes", points: 0 },
    ],
  },
  {
    id: 4,
    text: "How stable is your job or income right now?",
    type: "scale" as const,
    options: [
      { label: "Very stable / secure", value: "stable", points: 12 },
      { label: "Somewhat stable", value: "somewhat", points: 7 },
      { label: "Not sure", value: "unsure", points: 3 },
      { label: "Worried about it", value: "worried", points: 0 },
    ],
  },
  {
    id: 5,
    text: "Do you have multiple sources of income?",
    type: "yesno" as const,
    options: [
      { label: "Yes, 2+ income streams", value: "yes", points: 10 },
      { label: "Working on it", value: "kinda", points: 4 },
      { label: "Just one source", value: "no", points: 0 },
    ],
  },
  {
    id: 6,
    text: "Are you actively saving money each month?",
    type: "yesno" as const,
    options: [
      { label: "Yes, consistently", value: "yes", points: 8 },
      { label: "When I can", value: "sometimes", points: 3 },
      { label: "Not right now", value: "no", points: 0 },
    ],
  },
  {
    id: 7,
    text: "Do you know your exact monthly essential expenses?",
    type: "yesno" as const,
    options: [
      { label: "Yes, I know the number", value: "yes", points: 6 },
      { label: "Roughly, not exact", value: "roughly", points: 2 },
      { label: "Not really", value: "no", points: 0 },
    ],
  },
  {
    id: 8,
    text: "Have you cut unnecessary subscriptions in the last 6 months?",
    type: "yesno" as const,
    options: [
      { label: "Yes, audited and cut", value: "yes", points: 6 },
      { label: "I've thought about it", value: "kinda", points: 2 },
      { label: "No, not yet", value: "no", points: 0 },
    ],
  },
  {
    id: 9,
    text: "Do you have health insurance?",
    type: "yesno" as const,
    options: [
      { label: "Yes, covered", value: "yes", points: 8 },
      { label: "Partial / limited coverage", value: "partial", points: 3 },
      { label: "No", value: "no", points: 0 },
    ],
  },
  {
    id: 10,
    text: "Could you cover a $1,000 emergency without going into debt?",
    type: "yesno" as const,
    options: [
      { label: "Yes, comfortably", value: "yes", points: 16 },
      { label: "It would be tight", value: "tight", points: 7 },
      { label: "No, I'd need to borrow", value: "no", points: 0 },
    ],
  },
];

const MAX_SCORE = QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.points)), 0);

const TIERS = [
  {
    min: 0, max: 30,
    label: "Financially Vulnerable",
    emoji: "🔴",
    color: "text-red-400",
    bg: "from-red-900/40 to-red-800/20",
    border: "border-red-500/30",
    message: "You're starting from a tough spot — but that just means every step forward matters more. The good news: small changes stack fast.",
    actions: [
      { text: "Build a $500 emergency fund first", href: "/emergency-fund" },
      { text: "Find your biggest expense and cut it", href: "/tips" },
      { text: "Start a no-spend day challenge", href: "/missions" },
    ],
  },
  {
    min: 31, max: 55,
    label: "Getting By",
    emoji: "🟡",
    color: "text-yellow-400",
    bg: "from-yellow-900/30 to-yellow-800/10",
    border: "border-yellow-500/30",
    message: "You've got some foundation — better than most. Now it's about plugging the gaps before a crisis finds them.",
    actions: [
      { text: "Grow your emergency fund to 3 months", href: "/emergency-fund" },
      { text: "Tackle high-interest debt first", href: "/tips" },
      { text: "Add one more income source", href: "/missions" },
    ],
  },
  {
    min: 56, max: 75,
    label: "Building Resilience",
    emoji: "🟢",
    color: "text-green-400",
    bg: "from-green-900/30 to-emerald-900/10",
    border: "border-green-500/30",
    message: "Solid work. You've built real financial defenses. Level up by diversifying income and growing your savings rate.",
    actions: [
      { text: "Push for a 6-month emergency fund", href: "/emergency-fund" },
      { text: "Diversify your income streams", href: "/missions" },
      { text: "Review your inflation exposure", href: "/inflation" },
    ],
  },
  {
    min: 76, max: 100,
    label: "Recession Ready",
    emoji: "🏆",
    color: "text-orange-300",
    bg: "from-orange-900/30 to-yellow-900/10",
    border: "border-orange-500/30",
    message: "You're in the top tier. Most people never get here. Stay sharp — recessions reward the prepared.",
    actions: [
      { text: "Keep your emergency fund at 6+ months", href: "/emergency-fund" },
      { text: "Look for passive income opportunities", href: "/missions" },
      { text: "Help others — share your score", href: "#share" },
    ],
  },
];

function ScoreBar({ score, maxScore }: { score: number; maxScore: number }) {
  const [display, setDisplay] = useState(0);
  const pct = Math.round((score / maxScore) * 100);

  useEffect(() => {
    let frame = 0;
    const total = 60;
    const timer = setInterval(() => {
      frame++;
      const progress = 1 - Math.pow(1 - frame / total, 3);
      setDisplay(Math.round(pct * progress));
      if (frame >= total) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [pct]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-400">
        <span>Recession-Proof Score</span>
        <span className="font-black text-white">{display}/100</span>
      </div>
      <div className="h-4 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-none bg-gradient-to-r from-orange-500 via-yellow-400 to-green-400"
          style={{ width: `${(display / 100) * 100}%`, transition: "none" }}
        />
      </div>
    </div>
  );
}

export default function RecessionProofPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(new Array(QUESTIONS.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const score = QUESTIONS.reduce((sum, q, i) => {
    const answer = answers[i];
    if (answer === null) return sum;
    const opt = q.options.find((o) => o.value === answer);
    return sum + (opt?.points ?? 0);
  }, 0);

  const normalizedScore = Math.round((score / MAX_SCORE) * 100);
  const tier = TIERS.find((t) => normalizedScore >= t.min && normalizedScore <= t.max) ?? TIERS[0];

  const handleAnswer = (value: Answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = value;
    setAnswers(newAnswers);

    setTransitioning(true);
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setShowResult(true);
      }
      setTransitioning(false);
    }, 250);
  };

  const handleRetake = () => {
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setCurrentQ(0);
    setShowResult(false);
    setCopied(false);
  };

  const handleShare = () => {
    const text = `I scored ${normalizedScore}/100 on the Recession-Proof test. Are you ready? stackstreak-two.vercel.app/recession-proof`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const progress = ((currentQ + (answers[currentQ] !== null ? 1 : 0)) / QUESTIONS.length) * 100;
  const q = QUESTIONS[currentQ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-3xl mx-auto">
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

      <div className="max-w-3xl mx-auto px-6 py-10">
        {!showResult ? (
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-block bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-orange-400 text-sm font-semibold mb-4">
                🛡️ Recession-Proof Score
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-2">Are You Ready for a Recession?</h1>
              <p className="text-gray-400">10 questions. 2 minutes. Know exactly where you stand.</p>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className={`transition-all duration-250 ${transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-4">
                <div className="text-orange-400 text-sm font-semibold mb-3">Question {currentQ + 1}</div>
                <h2 className="text-xl md:text-2xl font-bold mb-8 leading-snug">{q.text}</h2>
                <div className="space-y-3">
                  {q.options.map((opt) => (
                    <button
                      key={String(opt.value)}
                      onClick={() => handleAnswer(opt.value)}
                      className="w-full text-left bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/40 rounded-2xl px-5 py-4 font-medium transition-all duration-150 text-gray-200 hover:text-white"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Back button */}
              {currentQ > 0 && (
                <button
                  onClick={() => setCurrentQ(currentQ - 1)}
                  className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
              )}
            </div>
          </>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Score card */}
            <div className={`bg-gradient-to-br ${tier.bg} border ${tier.border} rounded-3xl p-8 text-center`}>
              <div className="text-5xl mb-3">{tier.emoji}</div>
              <div className={`text-3xl font-black mb-1 ${tier.color}`}>{tier.label}</div>
              <div className="text-6xl font-black text-white my-4">{normalizedScore}<span className="text-2xl text-gray-400">/100</span></div>
              <div className="max-w-sm mx-auto mb-6">
                <ScoreBar score={normalizedScore} maxScore={100} />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">{tier.message}</p>
            </div>

            {/* Action items */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" /> Your Next 3 Actions
              </h3>
              <div className="space-y-3">
                {tier.actions.map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-orange-500/20 rounded-2xl px-4 py-3 transition-colors group"
                  >
                    <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center text-xs font-black text-orange-400 shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-gray-300 group-hover:text-white text-sm transition-colors">{action.text}</span>
                    <CheckCircle className="w-4 h-4 text-gray-700 group-hover:text-orange-400 ml-auto transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Share */}
            <div id="share" className="grid grid-cols-2 gap-4">
              <button
                onClick={handleShare}
                className={`py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200
                  ${copied
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-orange-500 hover:bg-orange-400 text-white"
                  }`}
              >
                {copied ? (
                  <><CheckCircle className="w-4 h-4" /> Copied!</>
                ) : (
                  <><Share2 className="w-4 h-4" /> Share My Score</>
                )}
              </button>
              <button
                onClick={handleRetake}
                className="py-4 rounded-2xl font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Retake Quiz
              </button>
            </div>

            <Link
              href="/dashboard"
              className="block w-full text-center py-4 rounded-2xl font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              Start improving on Dashboard →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
