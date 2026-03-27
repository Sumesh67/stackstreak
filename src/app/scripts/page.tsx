"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Flame, Video, Copy, Check, ChevronDown, Calendar, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

const PLATFORMS = ["TikTok", "Instagram Reels", "Facebook Reels", "YouTube Shorts"] as const;
type Platform = typeof PLATFORMS[number];

const TOPICS = [
  "Inflation is stealing from you",
  "Cancel subscriptions you forgot about",
  "The 52-week savings challenge",
  "How I cut my grocery bill in half",
  "No-spend weekend challenge",
  "Build an emergency fund fast",
  "Your recession-proof score",
  "Meal prep to save $200/month",
  "Stop using DoorDash",
  "The 48-hour rule for shopping",
  "How much is inflation costing YOU?",
  "Custom topic",
];

const DURATIONS = ["15", "30", "60"] as const;
const HOOK_STYLES = ["Shocking stat", "Personal story", "Question", "Bold claim", "Before/after"] as const;

const PLATFORM_NOTES: Record<Platform, string> = {
  TikTok: "🎵 Use trending audio. Post 6-9pm. Add text overlay on hook.",
  "Instagram Reels": "📸 Use Reels, not Stories. Add location tag. First frame = thumbnail.",
  "Facebook Reels": "👥 Post to Facebook Groups too. Longer captions work. Tag relevant pages.",
  "YouTube Shorts": "▶️ Keep it under 60 sec. Add chapters. First 3 seconds must hook. Use 3-5 hashtags max. Best times: 12pm & 8pm. Title must include a keyword like 'save money' or 'inflation hack'.",
};

const PLATFORM_HASHTAGS: Record<Platform, string[]> = {
  TikTok: ["#moneytok", "#savingmoney", "#personalfinance", "#financetok", "#moneyhacks", "#frugalliving", "#savingchallenge", "#moneyadvice", "#budgeting", "#stackstreak", "#savingsgoals", "#inflation", "#financialfreedom", "#moneymindset", "#groceryhaul"],
  "Instagram Reels": ["#personalfinance", "#savingmoney", "#financialfreedom", "#moneytips", "#budgetlife", "#frugaltips", "#savingschallenge", "#stackstreak", "#moneygoals", "#debtfree", "#financialindependence", "#moneymotivation", "#savingsaccount", "#budgeting101", "#moneyhacks"],
  "Facebook Reels": ["#savingmoney", "#moneytips", "#personalfinance", "#budgeting", "#frugalliving", "#financialtips", "#moneysaving", "#stackstreak", "#savingsgoals", "#inflation", "#grocerysavings", "#familybudget", "#moneyhacks", "#financialwellness", "#savingsapp"],
  "YouTube Shorts": ["#shorts", "#savemoney", "#personalfinance", "#moneyhacks", "#inflation", "#budgeting", "#financialfreedom", "#savingschallenge", "#stackstreak", "#moneytips", "#frugalliving", "#emergencyfund", "#savingsgoals", "#moneyadvice", "#youtubeshorts"],
};

const YOUTUBE_DURATIONS = ["30", "45", "60"] as const;

const YOUTUBE_TITLE_TEMPLATES = [
  "I saved ${amount} doing this one thing 🔥 #shorts",
  "Inflation is stealing from you — here's how to fight back #shorts",
  "The savings hack nobody talks about #shorts",
  "How to save $1,000 in 90 days (it works) #shorts",
  "Cancel these subscriptions RIGHT NOW #shorts",
  "Why you're broke (it's not your salary) #shorts",
];

const YOUTUBE_DESCRIPTION_TEMPLATE = `📱 Try StackStreak FREE → https://stackstreak-two.vercel.app

The free app that turns saving money into a daily game with streaks, challenges, and AI tips.

⬇️ More Resources:
→ Inflation Calculator: https://stackstreak-two.vercel.app/inflation
→ Recession-Proof Score: https://stackstreak-two.vercel.app/recession-proof
→ Emergency Fund Builder: https://stackstreak-two.vercel.app/emergency-fund

#savemoney #personalfinance #inflation #shorts`;

const CONTENT_CALENDAR = [
  { day: 1, topic: "Inflation is stealing from you", platform: "TikTok", time: "6:00 PM" },
  { day: 2, topic: "Cancel subscriptions you forgot about", platform: "Instagram Reels", time: "7:30 PM" },
  { day: 3, topic: "The 52-week savings challenge", platform: "Facebook Reels", time: "5:00 PM" },
  { day: 5, topic: "How I cut my grocery bill in half", platform: "TikTok", time: "8:00 PM" },
  { day: 7, topic: "No-spend weekend challenge", platform: "Instagram Reels", time: "6:30 PM" },
  { day: 9, topic: "Build an emergency fund fast", platform: "TikTok", time: "7:00 PM" },
  { day: 11, topic: "Meal prep to save $200/month", platform: "Facebook Reels", time: "5:30 PM" },
  { day: 12, topic: "Stop using DoorDash", platform: "TikTok", time: "6:00 PM" },
  { day: 14, topic: "Your recession-proof score", platform: "Instagram Reels", time: "7:00 PM" },
  { day: 16, topic: "The 48-hour rule for shopping", platform: "TikTok", time: "8:00 PM" },
  { day: 18, topic: "How much is inflation costing YOU?", platform: "Facebook Reels", time: "6:00 PM" },
  { day: 19, topic: "Inflation is stealing from you", platform: "Instagram Reels", time: "7:30 PM" },
  { day: 21, topic: "The 52-week savings challenge", platform: "TikTok", time: "6:00 PM" },
  { day: 23, topic: "Cancel subscriptions you forgot about", platform: "TikTok", time: "8:00 PM" },
  { day: 25, topic: "Meal prep to save $200/month", platform: "Instagram Reels", time: "7:00 PM" },
  { day: 26, topic: "No-spend weekend challenge", platform: "Facebook Reels", time: "5:00 PM" },
  { day: 28, topic: "How I cut my grocery bill in half", platform: "TikTok", time: "6:30 PM" },
  { day: 30, topic: "Build an emergency fund fast", platform: "Instagram Reels", time: "7:00 PM" },
];

type ScriptData = {
  hook: string;
  story: string;
  value: string;
  cta: string;
  caption: string;
  hashtags: string[];
  // YouTube Shorts extras
  title?: string;
  description?: string;
  thumbnail_text?: string;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="text-gray-500 hover:text-orange-400 transition-colors p-1">
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export default function ScriptsPage() {
  const [platform, setPlatform] = useState<Platform>("TikTok");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [duration, setDuration] = useState<"15" | "30" | "60">("30");
  const [hookStyle, setHookStyle] = useState<string>(HOOK_STYLES[0]);
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<ScriptData | null>(null);
  const [activeTab, setActiveTab] = useState<"generator" | "calendar">("generator");
  const [allCopied, setAllCopied] = useState(false);

  const effectiveTopic = topic === "Custom topic" ? customTopic : topic;

  const generateScript = async () => {
    if (!effectiveTopic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, topic: effectiveTopic, duration, hookStyle }),
      });
      const data = await res.json();
      setScript(data);
    } catch {
      // Fallback inline
      setScript({
        hook: "You're losing $400 every single month — and you don't even realize it. 💸",
        story: "Inflation hit 20% since 2020. Your paycheck stayed flat. That gap? That's money quietly disappearing from your wallet every time you swipe your card.",
        value: `Here's what I did about "${effectiveTopic}": I downloaded StackStreak and started ONE savings challenge. The 52-week challenge starts with just $1 a week. By week 52, you've saved $1,378. It's not about the amount — it's about building the HABIT. I also cancelled 3 subscriptions ($47/month), switched to ALDI ($80/month savings), and meal prepped Sundays. In 90 days, I saved over $800.`,
        cta: "Download StackStreak free at stackstreak-two.vercel.app. 100% free. Start your streak today.",
        caption: `POV: You just found out the exact trick to beat ${effectiveTopic.toLowerCase()} 😤 Here's my full system that saved me $800 in 90 days using StackStreak (free!) 💰`,
        hashtags: PLATFORM_HASHTAGS[platform],
      });
    }
    setLoading(false);
  };

  const copyAll = () => {
    if (!script) return;
    const full = `🎣 HOOK:\n${script.hook}\n\n📖 STORY/PROBLEM:\n${script.story}\n\n💡 VALUE/TIP:\n${script.value}\n\n🔥 CTA:\n${script.cta}\n\n---\n📝 CAPTION:\n${script.caption}\n\n🏷️ HASHTAGS:\n${script.hashtags.join(" ")}`;
    navigator.clipboard.writeText(full);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const platformColor: Record<Platform, string> = {
    TikTok: "from-pink-500 to-cyan-400",
    "Instagram Reels": "from-purple-500 to-pink-400",
    "Facebook Reels": "from-blue-500 to-indigo-400",
    "YouTube Shorts": "from-red-500 to-red-600",
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-6xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Flame className="text-orange-400 w-6 h-6" />
          <span className="font-black text-lg">StackStreak</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/deals" className="text-gray-400 hover:text-white transition-colors">Deals</Link>
          <Link href="/missions" className="text-gray-400 hover:text-white transition-colors">Missions</Link>
          <Link href="/tips" className="text-gray-400 hover:text-white transition-colors">Tips</Link>
          <Link href="/image-gen" className="text-gray-400 hover:text-white transition-colors">Image Gen</Link>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Video className="text-orange-400 w-8 h-8" />
              Content Studio
            </h1>
            <p className="text-gray-400 mt-2">Generate ready-to-film scripts for TikTok, Instagram & Facebook Reels</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("generator")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === "generator" ? "bg-orange-500 text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}
            >
              <Sparkles className="w-4 h-4 inline mr-1" /> Generator
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === "calendar" ? "bg-orange-500 text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}
            >
              <Calendar className="w-4 h-4 inline mr-1" /> 30-Day Plan
            </button>
          </div>
        </div>

        {activeTab === "calendar" ? (
          <div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
              <h2 className="text-xl font-black mb-1">📅 30-Day Content Calendar</h2>
              <p className="text-gray-400 text-sm mb-6">Your posting schedule for the next month. Mix of platforms and topics for maximum reach.</p>
              <div className="space-y-3">
                {CONTENT_CALENDAR.map((item) => (
                  <div key={item.day} className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 font-black text-sm shrink-0">
                      {item.day}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-white truncate">{item.topic}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.platform} • {item.time}</div>
                    </div>
                    <button
                      onClick={() => {
                        setTopic(TOPICS.includes(item.topic as typeof TOPICS[number]) ? item.topic : TOPICS[0]);
                        setPlatform(item.platform as Platform);
                        setActiveTab("generator");
                      }}
                      className="text-xs text-orange-400 hover:text-orange-300 font-semibold whitespace-nowrap"
                    >
                      Generate →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT: Controls */}
            <div className="space-y-5">
              {/* Platform tabs */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Platform</label>
                <div className="flex gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                        platform === p
                          ? `bg-gradient-to-r ${platformColor[p]} text-white shadow-lg`
                          : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                      }`}
                    >
                      {p === "TikTok" ? "🎵 TikTok" : p === "Instagram Reels" ? "📸 Instagram" : p === "Facebook Reels" ? "👥 Facebook" : "▶️ YouTube"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Topic</label>
                <div className="relative">
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-orange-500/50 pr-10"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t} className="bg-[#111118]">{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {topic === "Custom topic" && (
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Enter your custom topic..."
                    className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                  />
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Duration</label>
                <div className="flex gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        duration === d ? "bg-orange-500 text-white" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Hook Style */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Hook Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {HOOK_STYLES.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHookStyle(h)}
                      className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                        hookStyle === h ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                      }`}
                    >
                      {h === "Shocking stat" ? "📊 " : h === "Personal story" ? "👤 " : h === "Question" ? "❓ " : h === "Bold claim" ? "⚡ " : "↔️ "}
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={generateScript}
                disabled={loading || (topic === "Custom topic" && !customTopic.trim())}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-lg transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Script
                  </>
                )}
              </button>

              {/* Platform tips */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-400">
                {PLATFORM_NOTES[platform]}
              </div>
            </div>

            {/* RIGHT: Script Output */}
            <div>
              {!script && !loading && (
                <div className="h-full flex items-center justify-center text-center py-20">
                  <div>
                    <Video className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 font-semibold">Your script will appear here</p>
                    <p className="text-gray-600 text-sm mt-1">Choose your settings and hit Generate</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="h-full flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-12 h-12 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Writing your script...</p>
                  </div>
                </div>
              )}

              {script && !loading && (
                <div className="space-y-4">
                  {/* Copy all */}
                  <div className="flex items-center justify-between">
                    <h2 className="font-black text-lg">Your Script</h2>
                    <button
                      onClick={copyAll}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-xl text-sm font-semibold transition-colors"
                    >
                      {allCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {allCopied ? "Copied!" : "Copy All"}
                    </button>
                  </div>

                  {/* Hook */}
                  <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-red-400">🎣 HOOK (0–3 sec)</span>
                      <CopyButton text={script.hook} />
                    </div>
                    <p className="text-white font-semibold leading-relaxed">{script.hook}</p>
                  </div>

                  {/* Story */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-blue-400">📖 STORY/PROBLEM (3–15 sec)</span>
                      <CopyButton text={script.story} />
                    </div>
                    <p className="text-gray-200 leading-relaxed">{script.story}</p>
                  </div>

                  {/* Value */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-yellow-400">💡 VALUE/TIP (15–45 sec)</span>
                      <CopyButton text={script.value} />
                    </div>
                    <p className="text-gray-200 leading-relaxed">{script.value}</p>
                  </div>

                  {/* CTA */}
                  <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-orange-400">🔥 CTA (last 5 sec)</span>
                      <CopyButton text={script.cta} />
                    </div>
                    <p className="text-white font-semibold leading-relaxed">{script.cta}</p>
                  </div>

                  {/* Caption */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-purple-400">📝 CAPTION</span>
                      <CopyButton text={script.caption} />
                    </div>
                    <p className="text-gray-200 leading-relaxed">{script.caption}</p>
                  </div>

                  {/* Hashtags */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-cyan-400">🏷️ HASHTAGS</span>
                      <CopyButton text={(script.hashtags || PLATFORM_HASHTAGS[platform]).join(" ")} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(script.hashtags || PLATFORM_HASHTAGS[platform]).map((tag: string, i: number) => (
                        <span key={i} className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* YouTube Shorts specific extras */}
                  {platform === "YouTube Shorts" && (
                    <>
                      {script.title && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-red-400">▶️ VIDEO TITLE</span>
                            <CopyButton text={script.title} />
                          </div>
                          <p className="text-white font-semibold">{script.title}</p>
                        </div>
                      )}

                      {script.thumbnail_text && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-yellow-400">🖼️ THUMBNAIL TEXT</span>
                            <CopyButton text={script.thumbnail_text} />
                          </div>
                          <p className="text-white font-black text-2xl uppercase tracking-wide">{script.thumbnail_text}</p>
                          <p className="text-gray-500 text-xs mt-2">Put this in bold on a high-contrast background</p>
                        </div>
                      )}

                      {script.description && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-green-400">📄 VIDEO DESCRIPTION</span>
                            <CopyButton text={script.description} />
                          </div>
                          <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">{script.description}</pre>
                        </div>
                      )}

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <p className="text-sm font-bold text-gray-400 mb-3">⚡ YOUTUBE SHORTS CHECKLIST</p>
                        <div className="space-y-2 text-sm text-gray-300">
                          {["Vertical 9:16 ratio (1080x1920)", "Under 60 seconds", "Add #shorts to title and description", "Hook in first 3 seconds", "Text overlay on opening frame", "Upload between 12pm–3pm or 7pm–9pm", "Add to a Shorts playlist", "Reply to every comment in first hour"].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded border border-gray-600 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Platform tips */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-400">{PLATFORM_NOTES[platform]}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
