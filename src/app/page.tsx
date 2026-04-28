"use client";

import Link from "next/link";
import { Flame, Trophy, Zap, Shield, Star, ArrowRight, TrendingUp } from "lucide-react";

const CHALLENGES = [
  {
    id: "52week",
    name: "52-Week Classic",
    description: "Save $1 in week 1, $2 in week 2... $52 in week 52",
    total: "$1,378",
    duration: "52 weeks",
    difficulty: "Easy",
    color: "from-green-500 to-emerald-600",
    icon: "🌱",
  },
  {
    id: "nospend",
    name: "No-Spend Month",
    description: "Track days you didn't spend on non-essentials",
    total: "Varies",
    duration: "30 days",
    difficulty: "Medium",
    color: "from-blue-500 to-cyan-600",
    icon: "🧊",
  },
  {
    id: "1k90",
    name: "$1K in 90 Days",
    description: "Save $11.11/day. Hit $1,000 in 3 months.",
    total: "$1,000",
    duration: "90 days",
    difficulty: "Hard",
    color: "from-purple-500 to-pink-600",
    icon: "🚀",
  },
];

const EARLY_WINS = [
  { title: "52-week challenge", text: "A simple way to turn small weekly savings into $1,378 by the end of the year.", avatar: "🌱" },
  { title: "No-spend reset", text: "Perfect for anyone trying to stop leak spending and build momentum fast.", avatar: "🧊" },
  { title: "AI money nudges", text: "Quick prompts and ideas when you need motivation, not a lecture.", avatar: "🤖" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-400 w-7 h-7" />
          <span className="text-xl font-bold">StackStreak</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#challenges" className="text-gray-400 hover:text-white text-sm transition-colors">Challenges</a>
          <a href="#how" className="text-gray-400 hover:text-white text-sm transition-colors">How it works</a>
          <Link href="/auth" className="bg-orange-500 hover:bg-orange-400 px-4 py-2 rounded-full text-sm font-semibold transition-colors inline-block">
            Start Free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-16 max-w-4xl mx-auto fade-up">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-sm text-orange-300 mb-8">
          <Flame className="w-4 h-4" />
          <span>Inflation is up. Your savings should be too.</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Saving money should feel like{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
            winning
          </span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          StackStreak turns saving into a daily game with streaks, badges, and AI coaching.
          No bank account needed. No shame. Just wins.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto justify-center">
          <Link
            href="/auth"
            className="bg-orange-500 hover:bg-orange-400 px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2 justify-center"
          >
            Start Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#challenges"
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2 justify-center"
          >
            See Challenges
          </Link>
        </div>

        <p className="text-gray-600 text-sm mt-4">Free forever. No credit card. No bank linking.</p>
        <p className="text-gray-500 text-sm mt-2">Create your account and start your first challenge in under 2 minutes.</p>

        {/* Social proof numbers */}
        <div className="flex items-center justify-center gap-8 mt-12 text-center">
          <div>
            <div className="text-3xl font-black text-orange-400">$1,378</div>
            <div className="text-gray-500 text-sm">saved with 52-week challenge</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <div className="text-3xl font-black text-orange-400">🔥 Daily</div>
            <div className="text-gray-500 text-sm">money-saving motivation</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <div className="text-3xl font-black text-orange-400">Free</div>
            <div className="text-gray-500 text-sm">to start, always</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-4">How StackStreak works</h2>
        <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">Three steps. No complexity. No excuses.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "01", icon: <Trophy className="w-8 h-8 text-yellow-400" />, title: "Pick a challenge", desc: "Choose from proven presets or create your own. 52-week, no-spend month, custom goals — your call." },
            { step: "02", icon: <Flame className="w-8 h-8 text-orange-400" />, title: "Check in daily", desc: "Mark each day or week complete. Your streak grows. Your total saved grows. The satisfaction is real." },
            { step: "03", icon: <Zap className="w-8 h-8 text-purple-400" />, title: "AI keeps you going", desc: "Get personalized tips when you need motivation. Milestone badges when you hit goals. Never feel alone." },
          ].map((item) => (
            <div key={item.step} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-4xl font-black text-white/10">{item.step}</div>
                <div>
                  <div className="mb-3">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Challenges */}
      <section id="challenges" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-4">Choose your challenge</h2>
        <p className="text-gray-400 text-center mb-12">Start with a preset or build your own.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {CHALLENGES.map((c) => (
            <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform cursor-pointer group">
              <div className="text-4xl mb-4">{c.icon}</div>
              <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${c.color} mb-3`}>
                {c.difficulty}
              </div>
              <h3 className="font-black text-xl mb-2">{c.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{c.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{c.duration}</span>
                <span className="font-bold text-green-400">{c.total} saved</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">Everything you need. Nothing you don&apos;t.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: <Flame className="w-5 h-5 text-orange-400" />, title: "Streak tracking", desc: "Daily streaks that make you want to show up" },
            { icon: <Trophy className="w-5 h-5 text-yellow-400" />, title: "Milestone badges", desc: "Earn badges at 1 week, 1 month, halfway, complete" },
            { icon: <Zap className="w-5 h-5 text-purple-400" />, title: "AI daily tips", desc: "Personalized coaching based on your progress" },
            { icon: <TrendingUp className="w-5 h-5 text-green-400" />, title: "Progress charts", desc: "See your savings grow visually over time" },
            { icon: <Shield className="w-5 h-5 text-blue-400" />, title: "No bank linking", desc: "Your finances stay private — always" },
            { icon: <Star className="w-5 h-5 text-pink-400" />, title: "Custom challenges", desc: "Build any challenge with your own amounts and goals" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-xl p-4">
              <div className="mt-0.5">{f.icon}</div>
              <div>
                <div className="font-semibold text-sm">{f.title}</div>
                <div className="text-gray-400 text-xs mt-1">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Early Wins */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-4">Built for real savings momentum</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          StackStreak is early, but the goal is simple: make saving money feel lighter, clearer, and way more doable.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {EARLY_WINS.map((t) => (
            <div key={t.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{t.text}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{t.avatar}</span>
                <span className="font-semibold text-sm">{t.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-3xl p-12">
          <Flame className="w-12 h-12 text-orange-400 mx-auto mb-4 streak-pulse" />
          <h2 className="text-4xl font-black mb-4">Ready to start your streak?</h2>
          <p className="text-gray-400 mb-8">Join people turning saving money into a daily win. Free forever.</p>
          <Link href="/auth" className="bg-orange-500 hover:bg-orange-400 px-8 py-4 rounded-full text-lg font-bold transition-colors inline-flex items-center gap-2">
            Start Your First Challenge <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-600 text-sm mt-4">No credit card. No bank account. Just streaks.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="font-bold text-white">StackStreak</span>
        </div>
        <p>© 2026 StackStreak. Built for people who want to win at saving.</p>
      </footer>
    </main>
  );
}
