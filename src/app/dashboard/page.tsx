"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Flame, Trophy, Plus, CheckCircle, Zap, TrendingUp, LogOut, BookOpen, Target, Play, Video, Tag, Image as ImageIcon, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Challenge = {
  id: string;
  name: string;
  type: string;
  current_streak: number;
  longest_streak: number;
  total_saved: number;
  target_amount: number;
  started_at: string;
  last_checkin_at: string | null;
  status: string;
  icon?: string;
};

const CHALLENGE_ICONS: Record<string, string> = {
  "52week": "🌱",
  nospend: "🧊",
  "1k90": "🚀",
  custom: "⭐",
};

const PRESET_CHALLENGES = [
  { id: "52week", name: "52-Week Classic", description: "Save $1→$52 each week. Total: $1,378", icon: "🌱", target: 1378 },
  { id: "nospend", name: "No-Spend Month", description: "30 days of no unnecessary spending", icon: "🧊", target: 0 },
  { id: "1k90", name: "$1K in 90 Days", description: "Save $11.11/day for 90 days", icon: "🚀", target: 1000 },
];

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showNewChallenge, setShowNewChallenge] = useState(false);
  const [aiTip, setAiTip] = useState("");
  const [loadingTip, setLoadingTip] = useState(false);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [startingChallenge, setStartingChallenge] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{ challengeName: string; amount: number; streak: number } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }
      setUser(user);
      fetchChallenges(user.id);
      fetchDailyTip(user.id);
    };
    getUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChallenges = async (userId: string) => {
    const { data } = await supabase
      .from("user_challenges")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (data) {
      setChallenges(data);
      if (data.length === 0) setShowNewChallenge(true);
    }
  };

  const fetchDailyTip = async (userId: string) => {
    setLoadingTip(true);
    try {
      const res = await fetch("/api/tip", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
      const data = await res.json();
      if (data.tip) setAiTip(data.tip);
    } catch {
      setAiTip("Every dollar saved today is a dollar working for your future. Keep going! 💪");
    }
    setLoadingTip(false);
  };

  const startChallenge = async (preset: typeof PRESET_CHALLENGES[0]) => {
    if (!user) return;
    setStartingChallenge(preset.id);
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      setStartingChallenge(null);
      return;
    }

    const durationMap: Record<string, number> = { "52week": 364, nospend: 30, "1k90": 90 };

    const { data, error } = await supabase.from("user_challenges").insert({
      user_id: authUser.id,
      name: preset.name,
      type: preset.id,
      target_amount: preset.target,
      target_end_at: new Date(Date.now() + durationMap[preset.id] * 86400000).toISOString(),
    }).select().single();

    if (!error && data) {
      setChallenges(prev => [data, ...prev]);
      setShowNewChallenge(false);
    }
    setStartingChallenge(null);
  };

  const checkIn = async (challenge: Challenge) => {
    if (!user) return;
    setCheckingIn(challenge.id);
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    const today = new Date().toDateString();
    const lastCheckin = challenge.last_checkin_at ? new Date(challenge.last_checkin_at).toDateString() : null;
    if (lastCheckin === today) { setCheckingIn(null); return; }

    // Calculate amount for 52-week
    let amount = 0;
    if (challenge.type === "52week") {
      const weekNum = Math.floor((Date.now() - new Date(challenge.started_at).getTime()) / (7 * 86400000)) + 1;
      amount = Math.min(weekNum, 52);
    } else if (challenge.type === "1k90") {
      amount = 11.11;
    }

    const newStreak = challenge.current_streak + 1;
    await supabase.from("checkins").insert({
      user_id: authUser.id,
      challenge_id: challenge.id,
      amount_saved: amount,
      week_number: challenge.type === "52week" ? Math.floor((Date.now() - new Date(challenge.started_at).getTime()) / (7 * 86400000)) + 1 : null,
    });

    await supabase.from("user_challenges").update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, challenge.longest_streak),
      total_saved: challenge.total_saved + amount,
      last_checkin_at: new Date().toISOString(),
    }).eq("id", challenge.id);

    setChallenges(prev => prev.map(c => c.id === challenge.id ? {
      ...c,
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, c.longest_streak),
      total_saved: c.total_saved + amount,
      last_checkin_at: new Date().toISOString(),
    } : c));

    setCelebration({ challengeName: challenge.name, amount, streak: newStreak });
    setTimeout(() => setCelebration(null), 4500);
    setCheckingIn(null);
  };

  const hasCheckedInToday = (challenge: Challenge) => {
    if (!challenge.last_checkin_at) return false;
    return new Date(challenge.last_checkin_at).toDateString() === new Date().toDateString();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-400 w-6 h-6" />
          <span className="font-black text-lg">StackStreak</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/missions" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
            <Target className="w-4 h-4" /> Missions
          </Link>
          <Link href="/tips" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
            <BookOpen className="w-4 h-4" /> Tips
          </Link>
          <Link href="/learn" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
            <Play className="w-4 h-4" /> Learn
          </Link>
          <Link href="/scripts" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
            <Video className="w-4 h-4" /> Scripts
          </Link>
          <Link href="/deals" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
            <Tag className="w-4 h-4" /> Deals
          </Link>
          <Link href="/image-gen" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
            <ImageIcon className="w-4 h-4" /> Image Gen
          </Link>
          <Link href="/scheduler" className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
            <Calendar className="w-4 h-4" /> Schedule
          </Link>
          <Link href="/pro" className="flex items-center gap-1 text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 px-3 py-1 rounded-full text-xs font-semibold transition-colors">
            Go Pro 🔥
          </Link>
          <span className="text-gray-600 text-sm hidden sm:block">Hey, {displayName} 👋</span>
          <button onClick={signOut} className="text-gray-500 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {celebration && (
          <div className="mb-6 bg-gradient-to-r from-green-500/15 to-emerald-500/10 border border-green-500/30 rounded-2xl p-5 flex items-start gap-3">
            <div className="text-3xl">🎉</div>
            <div>
              <div className="text-xs text-green-400 font-semibold mb-1">CHECK-IN COMPLETE</div>
              <p className="text-white font-semibold">You checked in to {celebration.challengeName}.</p>
              <p className="text-gray-300 text-sm mt-1">
                {celebration.amount > 0
                  ? `That adds $${celebration.amount.toFixed(2)} to your total and keeps your ${celebration.streak}-day streak alive.`
                  : `Your ${celebration.streak}-day streak is alive. Small wins count.`}
              </p>
            </div>
          </div>
        )}
        {/* AI Tip / First Step */}
        <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-5 mb-8 flex items-start gap-3">
          <Zap className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-xs text-orange-400 font-semibold mb-1">{challenges.length === 0 ? "FIRST STEP" : "TODAY&apos;S TIP"}</div>
            <p className="text-gray-200 text-sm leading-relaxed">
              {challenges.length === 0
                ? "Start with one simple challenge today. You can always add more later — the goal is momentum, not perfection."
                : loadingTip
                  ? "Loading your daily tip..."
                  : aiTip || "Every dollar saved today is a dollar working for your future. 💪"}
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black">Your Challenges</h1>
            <p className="text-gray-500 text-sm mt-1">{challenges.length === 0 ? "Start your first challenge below" : `${challenges.length} active challenge${challenges.length > 1 ? "s" : ""}`}</p>
          </div>
          <button
            onClick={() => setShowNewChallenge(true)}
            className="bg-orange-500 hover:bg-orange-400 px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Challenge
          </button>
        </div>

        {/* Challenge Cards */}
        {challenges.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">🎯</div>
            <p className="font-semibold text-lg text-gray-300">Let&apos;s start your first challenge</p>
            <p className="text-sm mt-1 max-w-md mx-auto">Pick one simple goal below and get your first win today. The fastest start is the 52-Week Classic.</p>
            <button onClick={() => setShowNewChallenge(true)} className="mt-4 bg-orange-500 hover:bg-orange-400 px-6 py-3 rounded-full font-semibold transition-colors">
              Pick My First Challenge
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((challenge) => {
              const checkedToday = hasCheckedInToday(challenge);
              const progress = challenge.target_amount > 0 ? Math.min((challenge.total_saved / challenge.target_amount) * 100, 100) : 0;

              return (
                <div key={challenge.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-3xl">{CHALLENGE_ICONS[challenge.type] || "⭐"}</span>
                      <h3 className="font-bold mt-2">{challenge.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-orange-400 font-black text-2xl">
                        <Flame className="w-5 h-5" />
                        {challenge.current_streak}
                      </div>
                      <div className="text-xs text-gray-500">day streak</div>
                      {challenge.current_streak > 0 && challenge.current_streak < 7 && (
                        <div className="text-[10px] text-orange-300 mt-1">First week in progress</div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">Saved</div>
                      <div className="font-bold text-green-400">${challenge.total_saved.toFixed(0)}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">Best streak</div>
                      <div className="font-bold">{challenge.longest_streak} days</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {challenge.target_amount > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Check in button */}
                  <button
                    onClick={() => !checkedToday && checkIn(challenge)}
                    disabled={checkedToday || checkingIn === challenge.id}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2
                      ${checkedToday
                        ? "bg-green-500/20 text-green-400 cursor-default border border-green-500/20"
                        : "bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20"
                      }`}
                  >
                    {checkedToday ? (
                      <><CheckCircle className="w-4 h-4" /> Done for today!</>
                    ) : checkingIn === challenge.id ? (
                      "Checking in..."
                    ) : (
                      <><Flame className="w-4 h-4" /> Check In</>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Tools Section */}
        <div className="mt-10 mb-2">
          <h2 className="text-xl font-black mb-1">Financial Tools</h2>
          <p className="text-gray-500 text-sm mb-5">Know where you stand. Take action.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/inflation" className="group bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-2xl p-5 transition-all duration-200">
              <div className="text-3xl mb-3">🧮</div>
              <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">Inflation Calculator</h3>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">See exactly how much more you&apos;re paying vs 2023. The number might shock you.</p>
              <div className="mt-3 text-red-400 text-xs font-semibold group-hover:text-red-300 transition-colors">Calculate my cost →</div>
            </Link>
            <Link href="/emergency-fund" className="group bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/30 rounded-2xl p-5 transition-all duration-200">
              <div className="text-3xl mb-3">🏦</div>
              <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">Emergency Fund</h3>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">Build your 1-month safety net. Most Americans have less than $400 saved.</p>
              <div className="mt-3 text-orange-400 text-xs font-semibold group-hover:text-orange-300 transition-colors">Start the challenge →</div>
            </Link>
            <Link href="/recession-proof" className="group bg-white/5 hover:bg-yellow-500/10 border border-white/10 hover:border-yellow-500/30 rounded-2xl p-5 transition-all duration-200">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">Recession-Proof Score</h3>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">10-question quiz. Get your score out of 100. Specific actions to improve.</p>
              <div className="mt-3 text-yellow-400 text-xs font-semibold group-hover:text-yellow-300 transition-colors">Take the quiz →</div>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        {challenges.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-center">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-black">{challenges.reduce((a, c) => a + c.current_streak, 0)}</div>
              <div className="text-gray-500 text-xs mt-1">Total streak days</div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-center">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-black">${challenges.reduce((a, c) => a + c.total_saved, 0).toFixed(0)}</div>
              <div className="text-gray-500 text-xs mt-1">Total saved</div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-center">
              <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-black">{Math.max(...challenges.map(c => c.longest_streak), 0)}</div>
              <div className="text-gray-500 text-xs mt-1">Best streak ever</div>
            </div>
          </div>
        )}

        {/* Pro Upgrade Banner */}
        <div className="mt-8 bg-gradient-to-r from-orange-500/10 to-yellow-500/5 border border-orange-500/20 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="font-semibold text-sm text-white">Upgrade to Pro for streak shields &amp; unlimited challenges</p>
              <p className="text-gray-500 text-xs mt-0.5">Only $7.99/mo — cancel anytime</p>
            </div>
          </div>
          <Link
            href="/pro"
            className="shrink-0 bg-orange-500 hover:bg-orange-400 px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Upgrade Now →
          </Link>
        </div>
      </div>

      {/* New Challenge Modal */}
      {showNewChallenge && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#111118] border border-white/10 rounded-3xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-black mb-2">Pick a challenge</h2>
            <p className="text-gray-400 text-sm mb-6">Choose one to start building your streak today. If you want the easiest win, start with the 52-Week Classic.</p>

            <div className="space-y-3">
              {PRESET_CHALLENGES.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => startChallenge(preset)}
                  disabled={startingChallenge !== null}
                  className="w-full bg-white/5 hover:bg-white/10 disabled:opacity-60 border border-white/10 hover:border-orange-500/30 rounded-2xl p-4 text-left transition-colors flex items-center gap-4"
                >
                  <span className="text-3xl">{preset.icon}</span>
                  <div>
                    <div className="font-bold flex items-center gap-2">{preset.name} {preset.id === "52week" && <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">BEST FIRST PICK</span>}</div>
                    <div className="text-gray-400 text-sm">{preset.description}</div>
                    {startingChallenge === preset.id && <div className="text-orange-400 text-xs mt-2">Starting your challenge...</div>}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewChallenge(false)}
              className="w-full mt-4 py-3 rounded-xl text-gray-500 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
