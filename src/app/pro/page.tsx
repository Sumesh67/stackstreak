"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Flame, ArrowLeft, Shield, Infinity, Bot, Check, X, Lock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ProPage() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stripeNotConfigured, setStripeNotConfigured] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email || null);
      }
    };
    getUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email: userEmail }),
      });
      const data = await res.json();

      if (res.status === 503 || data.error === "Stripe not configured") {
        setStripeNotConfigured(true);
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setStripeNotConfigured(true);
      }
    } catch {
      setStripeNotConfigured(true);
    }
    setLoading(false);
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistDone(true);
    setWaitlistEmail("");
  };

  const freeFeatures = [
    { text: "3 savings challenges", included: true },
    { text: "Basic streak tracking", included: true },
    { text: "Tips library", included: true },
    { text: "Weekly missions", included: true },
    { text: "Video learning feed", included: true },
    { text: "Deals page", included: true },
    { text: "Streak shields (protect your streak)", included: false },
    { text: "Unlimited challenges", included: false },
    { text: "AI money coach chat", included: false },
    { text: "Priority support", included: false },
    { text: "Ad-free experience", included: false },
  ];

  const proFeatures = [
    { text: "Everything in Free", included: true },
    { text: "Streak shields (3/month — protect your streak once)", included: true },
    { text: "Unlimited challenges", included: true },
    { text: "AI money coach (unlimited daily tips)", included: true },
    { text: "Priority support", included: true },
    { text: "Ad-free experience", included: true },
    { text: "Early access to new features", included: true },
  ];

  const proFeatureCards = [
    {
      icon: "🛡️",
      title: "Streak Shields",
      desc: "Miss a day? Use a shield to protect your streak. 3 free per month.",
    },
    {
      icon: "♾️",
      title: "Unlimited Challenges",
      desc: "Run multiple challenges simultaneously. 52-week + emergency fund + custom.",
    },
    {
      icon: "🤖",
      title: "AI Coach",
      desc: "Get personalized money advice based on your progress and spending patterns.",
    },
  ];

  const faqs = [
    {
      q: "Can I cancel anytime?",
      a: "Yes, cancel from your account settings, no questions asked. Your data stays with you forever.",
    },
    {
      q: "Is my payment secure?",
      a: "Yes, powered by Stripe — the same payment processor used by Amazon and Apple. We never store your card details.",
    },
    {
      q: "What happens to my data if I cancel?",
      a: "Your challenges and streak history are saved forever on the free plan. You'll never lose what you've built.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Orange gradient top */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-orange-500/10 via-orange-500/5 to-transparent pointer-events-none" />

      {/* Nav */}
      <nav className="relative flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-400 w-6 h-6" />
          <span className="font-black text-lg">StackStreak</span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </nav>

      <div className="relative max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">🔥</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Upgrade to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              StackStreak Pro
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Everything you need to crush your savings goals
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="text-4xl font-black text-white">$7.99</span>
            <div className="text-left">
              <div className="text-gray-400 text-sm">/month</div>
              <div className="text-gray-500 text-xs">Cancel anytime</div>
            </div>
          </div>
        </div>

        {/* Plan Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {/* Free Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="mb-6">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Free Forever</div>
              <div className="text-3xl font-black">$0</div>
              <div className="text-gray-500 text-sm">No credit card needed</div>
            </div>

            <ul className="space-y-3 mb-8">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  {f.included ? (
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-gray-600 shrink-0" />
                  )}
                  <span className={f.included ? "text-gray-300" : "text-gray-600"}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <div className="w-full py-3 rounded-xl text-center text-gray-500 border border-white/5 text-sm font-semibold">
              Current Plan
            </div>
          </div>

          {/* Pro Card */}
          <div className="bg-gradient-to-b from-orange-500/10 to-transparent border-2 border-orange-500/60 rounded-3xl p-8 relative">
            {/* Most Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-orange-500 text-white text-xs font-black px-4 py-1.5 rounded-full">
                MOST POPULAR
              </span>
            </div>

            <div className="mb-6">
              <div className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-1">Pro</div>
              <div className="text-3xl font-black">$7.99</div>
              <div className="text-gray-500 text-sm">per month</div>
            </div>

            <ul className="space-y-3 mb-8">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="text-gray-200">{f.text}</span>
                </li>
              ))}
            </ul>

            {stripeNotConfigured ? (
              <div className="space-y-3">
                <div className="text-center text-orange-400 font-semibold text-sm">
                  Stripe coming soon! Join the waitlist.
                </div>
                {waitlistDone ? (
                  <div className="text-center text-green-400 text-sm font-semibold">
                    ✅ You&apos;re on the waitlist! We&apos;ll email you when Pro launches.
                  </div>
                ) : (
                  <form onSubmit={handleWaitlist} className="flex gap-2">
                    <input
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-400 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
                    >
                      Join →
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-400 disabled:opacity-60 rounded-xl font-black text-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? "Redirecting..." : "Upgrade to Pro →"}
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-gray-500 text-xs">
                  <Lock className="w-3 h-3" />
                  Secure payment via Stripe. Cancel anytime.
                </div>
              </>
            )}
          </div>
        </div>

        {/* What you can do with Pro */}
        <div className="mb-20">
          <h2 className="text-2xl font-black text-center mb-2">What you can do with Pro</h2>
          <p className="text-gray-500 text-center text-sm mb-10">Unlock tools that actually move your savings forward</p>
          <div className="grid md:grid-cols-3 gap-6">
            {proFeatureCards.map((card, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 hover:border-orange-500/30 rounded-2xl p-6 text-center transition-colors"
              >
                <div className="text-5xl mb-4">{card.icon}</div>
                <h3 className="font-black text-lg mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature icons row */}
        <div className="flex justify-center gap-12 mb-20 flex-wrap">
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-8 h-8 text-orange-400" />
            <span className="text-xs text-gray-500 text-center">Streak<br/>Shields</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Infinity className="w-8 h-8 text-orange-400" />
            <span className="text-xs text-gray-500 text-center">Unlimited<br/>Challenges</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Bot className="w-8 h-8 text-orange-400" />
            <span className="text-xs text-gray-500 text-center">AI Money<br/>Coach</span>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold hover:text-orange-300 transition-colors"
                >
                  {faq.q}
                  <span className="text-gray-500 text-lg">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm mb-4">Ready to level up your savings game?</p>
          {!stripeNotConfigured && (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-400 disabled:opacity-60 px-10 py-4 rounded-2xl font-black text-lg transition-colors"
            >
              {loading ? "Redirecting..." : "Get Pro for $7.99/mo →"}
            </button>
          )}
          <div className="mt-3 text-gray-600 text-xs">No commitments. Cancel whenever.</div>
        </div>
      </div>
    </main>
  );
}
