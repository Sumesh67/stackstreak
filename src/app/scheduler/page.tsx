"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import {
  Flame,
  ArrowLeft,
  Calendar,
  Copy,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  Camera,
  Globe,
  Palette,
  Clock,
  Zap,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type PostData = {
  day: number;
  template: "tip" | "stat" | "challenge" | "alert" | "story";
  headline: string;
  stat: string;
  body: string;
  platform: string;
  bestTime: string;
  topic: string;
  trendSource?: string;
};

type PostStatus = {
  done: boolean;
  instagramPosted: boolean;
  facebookPosted: boolean;
};

type SchedulerData = {
  posts: PostData[];
  statuses: Record<number, PostStatus>;
  generatedAt: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const TOPIC_HASHTAGS: Record<string, string[]> = {
  inflation: ["#inflation", "#savemoney", "#personalfinance", "#moneytips", "#costoflivingincrease", "#budgeting", "#stackstreak", "#financialfreedom", "#moneyhacks", "#savingmoney"],
  groceries: ["#grocerysavings", "#savemoney", "#mealprep", "#frugalliving", "#budgetmeals", "#groceryhacks", "#stackstreak", "#personalfinance", "#moneytips", "#savingmoney"],
  subscriptions: ["#cancelsubscriptions", "#savemoney", "#moneysaving", "#personalfinance", "#budgeting", "#frugalliving", "#stackstreak", "#moneytips", "#financialfreedom", "#savingmoney"],
  bills: ["#billsavings", "#savemoney", "#reducebills", "#personalfinance", "#moneyhacks", "#frugalliving", "#stackstreak", "#budgeting", "#moneytips", "#financialfreedom"],
  food: ["#mealprep", "#savemoney", "#cookathome", "#budgetmeals", "#nodoorDash", "#frugalliving", "#stackstreak", "#personalfinance", "#moneytips", "#savingmoney"],
  savings: ["#savingschallenge", "#52weekchallenge", "#savemoney", "#personalfinance", "#emergencyfund", "#financialfreedom", "#stackstreak", "#moneytips", "#savingsgoals", "#savingmoney"],
  mindset: ["#moneymindset", "#financialfreedom", "#personalfinance", "#wealthbuilding", "#moneyhabits", "#savemoney", "#stackstreak", "#moneytips", "#financialindependence", "#savingmoney"],
  shopping: ["#shoppingsavings", "#savemoney", "#thriftshopping", "#frugalliving", "#48hourrule", "#stackstreak", "#personalfinance", "#moneytips", "#budgeting", "#savingmoney"],
  default: ["#savemoney", "#personalfinance", "#moneytips", "#frugalliving", "#budgeting", "#financialfreedom", "#stackstreak", "#moneyhacks", "#savingmoney", "#savingschallenge"],
};

const TOPIC_COLORS: Record<string, string> = {
  inflation: "bg-red-500/20 text-red-300 border-red-500/30",
  subscriptions: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  groceries: "bg-green-500/20 text-green-300 border-green-500/30",
  savings: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  bills: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  food: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  mindset: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  shopping: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  default: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

const TEMPLATE_ICON: Record<string, string> = {
  tip: "💡",
  stat: "📊",
  challenge: "🏆",
  alert: "🚨",
  story: "📱",
};

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Facebook: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Both: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneWeek);
}

function getStorageKey(): string {
  return `stackstreak_scheduler_${getWeekNumber()}`;
}

function buildCaption(post: PostData): string {
  const tags = TOPIC_HASHTAGS[post.topic] ?? TOPIC_HASHTAGS.default;
  const hashtagLine = tags.join(" ");
  return `${post.headline}\n\n${post.body}\n\n💰 Save more at stackstreak.aivantageworks.com\n\n${hashtagLine}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function defaultStatus(): PostStatus {
  return { done: false, instagramPosted: false, facebookPosted: false };
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({
  post,
  status,
  onStatusChange,
}: {
  post: PostData;
  status: PostStatus;
  onStatusChange: (day: number, update: Partial<PostStatus>) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postResult, setPostResult] = useState<string | null>(null);
  const router = useRouter();

  const topicClass = TOPIC_COLORS[post.topic] ?? TOPIC_COLORS.default;
  const platformClass = PLATFORM_COLORS[post.platform] ?? PLATFORM_COLORS.Both;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildCaption(post));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = buildCaption(post);
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateImage = () => {
    const templateMap: Record<string, string> = {
      tip: "tip",
      stat: "stat",
      challenge: "challenge",
      alert: "inflation",
      story: "story",
    };
    const params = new URLSearchParams({
      headline: post.headline,
      body: post.body,
      template: templateMap[post.template] ?? "tip",
      stat: post.stat ?? "",
    });
    router.push(`/image-gen?${params.toString()}`);
  };

  const toggleDone = () => onStatusChange(post.day, { done: !status.done });
  const toggleInsta = () => onStatusChange(post.day, { instagramPosted: !status.instagramPosted });
  const toggleFacebook = () => onStatusChange(post.day, { facebookPosted: !status.facebookPosted });

  const handlePostToInstagram = () => {
    const caption = buildCaption(post);
    // Copy caption to clipboard
    navigator.clipboard.writeText(caption).catch(() => {
      const el = document.createElement("textarea");
      el.value = caption;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    // Build image URL and open in new tab so user can save it
    const templateMap: Record<string, string> = { tip: "tip", stat: "stat", challenge: "challenge", alert: "inflation", story: "story" };
    const imgParams = new URLSearchParams({
      template: templateMap[post.template] ?? "tip",
      headline: post.headline,
      body: post.body,
      stat: post.stat ?? "",
      topic: post.topic ?? "savings",
    });
    window.open(`/api/generate-image?${imgParams.toString()}`, "_blank");
    setPostResult("📋 Caption copied! Image opened in new tab — save it, then post to Instagram");
    onStatusChange(post.day, { instagramPosted: true });
    setTimeout(() => setPostResult(null), 5000);
  };

  const handlePostToBuffer = async () => {
    setPosting(true);
    setPostResult(null);
    try {
      const res = await fetch("/api/buffer/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post, platforms: post.platform, scheduleNow: true }),
      });
      const data = await res.json();
      if (data.success) {
        setPostResult("✅ Posted to Buffer!");
        onStatusChange(post.day, { done: true, instagramPosted: post.platform !== "Facebook", facebookPosted: post.platform !== "Instagram" });
        setTimeout(() => setPostResult(null), 3000);
      } else {
        setPostResult("❌ Failed — check Buffer connection");
        setTimeout(() => setPostResult(null), 3000);
      }
    } catch {
      setPostResult("❌ Error posting");
      setTimeout(() => setPostResult(null), 3000);
    }
    setPosting(false);
  };

  return (
    <div
      className={`relative bg-white/[0.04] border rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 ${
        status.done
          ? "border-green-500/30 opacity-60"
          : "border-white/10 hover:border-orange-500/30"
      }`}
    >
      {/* Done overlay checkmark */}
      {status.done && (
        <div className="absolute top-3 right-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
      )}

      {/* Row 1: Day badge + platform + time */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-sm shrink-0">
          {post.day}
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${platformClass}`}>
          {post.platform}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {post.bestTime}
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ml-auto ${topicClass}`}>
          {post.topic}
        </span>
      </div>

      {/* Headline */}
      <h3 className="font-black text-white text-base leading-tight">{post.headline}</h3>

      {/* Stat */}
      {post.stat && (
        <div className="text-2xl font-black text-orange-400">{post.stat}</div>
      )}

      {/* Body */}
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{post.body}</p>

      {/* Template badge */}
      <div className="text-xs text-gray-600 font-medium">
        {TEMPLATE_ICON[post.template]} {post.template}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap mt-1">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            copied
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10"
          }`}
        >
          {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy Caption"}
        </button>

        <button
          onClick={handleCreateImage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 transition-colors"
        >
          <Palette className="w-3.5 h-3.5" />
          Create Image
        </button>

        <button
          onClick={handlePostToBuffer}
          disabled={posting || status.facebookPosted}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            status.facebookPosted
              ? "bg-green-500/20 text-green-300 border border-green-500/30 cursor-default"
              : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 disabled:opacity-50"
          }`}
        >
          {posting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
          {posting ? "Posting..." : status.facebookPosted ? "FB Posted ✓" : "📘 Facebook"}
        </button>

        <button
          onClick={handlePostToInstagram}
          disabled={status.instagramPosted}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            status.instagramPosted
              ? "bg-green-500/20 text-green-300 border border-green-500/30 cursor-default"
              : "bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          {status.instagramPosted ? "IG Done ✓" : "📸 Instagram"}
        </button>

        <button
          onClick={toggleDone}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white border border-white/10 transition-colors ml-auto"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Mark Done
        </button>
      </div>

      {postResult && (
        <div className={`text-xs font-semibold text-center py-1 rounded-lg ${postResult.startsWith("✅") ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>
          {postResult}
        </div>
      )}

      {/* Platform status bar */}
      <div className="flex gap-2 pt-2 border-t border-white/5">
        <button
          onClick={toggleInsta}
          className={`flex items-center gap-1.5 flex-1 justify-center py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            status.instagramPosted
              ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
              : "bg-white/5 text-gray-600 hover:text-pink-300 border border-white/5 hover:border-pink-500/30"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          {status.instagramPosted ? "Posted" : "Instagram"}
        </button>
        <button
          onClick={toggleFacebook}
          className={`flex items-center gap-1.5 flex-1 justify-center py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            status.facebookPosted
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              : "bg-white/5 text-gray-600 hover:text-blue-300 border border-white/5 hover:border-blue-500/30"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          {status.facebookPosted ? "Posted" : "Facebook"}
        </button>
      </div>
    </div>
  );
}

// ─── Stats Sidebar ────────────────────────────────────────────────────────────

function StatsSidebar({
  posts,
  statuses,
}: {
  posts: PostData[];
  statuses: Record<number, PostStatus>;
}) {
  const total = posts.length;
  const done = Object.values(statuses).filter((s) => s.done).length;
  const instaPosted = Object.values(statuses).filter((s) => s.instagramPosted).length;
  const fbPosted = Object.values(statuses).filter((s) => s.facebookPosted).length;
  const anyInsta = instaPosted > 0;
  const anyFb = fbPosted > 0;

  const times = posts.length > 0
    ? [...new Set(posts.map((p) => p.bestTime))].slice(0, 5)
    : [];

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-4">
      <h2 className="font-black flex items-center gap-2 text-base">
        <BarChart2 className="w-4 h-4 text-orange-400" />
        This Week&apos;s Stats
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Posts generated</span>
          <span className="font-bold text-white">{total}/7</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all"
            style={{ width: `${total > 0 ? (total / 7) * 100 : 0}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Posts marked done</span>
          <span className="font-bold text-white">{done}/{total}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
            style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="pt-2 border-t border-white/5 space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Platforms</p>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-300">
            <Camera className="w-4 h-4 text-pink-400" /> Instagram
          </span>
          {anyInsta ? (
            <span className="text-green-400 text-xs font-semibold">✅ {instaPosted} posted</span>
          ) : (
            <span className="text-gray-600 text-xs">Not posted</span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-300">
            <Globe className="w-4 h-4 text-blue-400" /> Facebook
          </span>
          {anyFb ? (
            <span className="text-green-400 text-xs font-semibold">✅ {fbPosted} posted</span>
          ) : (
            <span className="text-gray-600 text-xs">Not posted</span>
          )}
        </div>
      </div>

      {times.length > 0 && (
        <div className="pt-2 border-t border-white/5 space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Best posting times</p>
          <div className="space-y-1">
            {times.map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SchedulerPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [statuses, setStatuses] = useState<Record<number, PostStatus>>({});
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatingTrending, setGeneratingTrending] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  // ── Load from localStorage ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(getStorageKey());
      if (raw) {
        const data: SchedulerData = JSON.parse(raw);
        setPosts(data.posts ?? []);
        setStatuses(data.statuses ?? {});
        setGeneratedAt(data.generatedAt ?? null);
      }
    } catch {
      // ignore
    }
  }, []);

  // ── Save to localStorage ──
  const persist = useCallback(
    (nextPosts: PostData[], nextStatuses: Record<number, PostStatus>, nextGeneratedAt: string) => {
      const data: SchedulerData = { posts: nextPosts, statuses: nextStatuses, generatedAt: nextGeneratedAt };
      localStorage.setItem(getStorageKey(), JSON.stringify(data));
    },
    []
  );

  const handleStatusChange = useCallback(
    (day: number, update: Partial<PostStatus>) => {
      setStatuses((prev) => {
        const current = prev[day] ?? defaultStatus();
        const next = { ...prev, [day]: { ...current, ...update } };
        const gAt = generatedAt ?? new Date().toISOString();
        persist(posts, next, gAt);
        return next;
      });
    },
    [posts, generatedAt, persist]
  );

  const generatePosts = async (endpoint: string, isGenerating: boolean) => {
    if (isGenerating) return;
    if (endpoint === "/api/generate-posts") setGenerating(true);
    else setGeneratingTrending(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 7 }),
      });
      const data = await res.json();
      const newPosts: PostData[] = Array.isArray(data) ? data : [];
      const newStatuses: Record<number, PostStatus> = {};
      newPosts.forEach((p) => { newStatuses[p.day] = defaultStatus(); });
      const now = new Date().toISOString();
      setPosts(newPosts);
      setStatuses(newStatuses);
      setGeneratedAt(now);
      persist(newPosts, newStatuses, now);
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setGenerating(false);
      setGeneratingTrending(false);
    }
  };

  const postsGenerated = posts.length;
  const postsDone = Object.values(statuses).filter((s) => s.done).length;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-7xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Flame className="text-orange-400 w-6 h-6" />
          <span className="font-black text-lg">StackStreak</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Calendar className="text-orange-400 w-8 h-8" />
            Content Scheduler
          </h1>
          <p className="text-gray-400 mt-1">Generate a week of posts, copy &amp; post in minutes</p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => generatePosts("/api/generate-posts", generating)}
              disabled={generating || generatingTrending}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 transition-all"
            >
              {generating ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Generating…</>
              ) : (
                <><Zap className="w-4 h-4" /> Generate This Week</>
              )}
            </button>

            <button
              onClick={() => generatePosts("/api/trending-posts", generatingTrending)}
              disabled={generating || generatingTrending}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 transition-all"
            >
              {generatingTrending ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Fetching…</>
              ) : (
                <><TrendingUp className="w-4 h-4" /> Trending Now</>
              )}
            </button>
          </div>

          {/* Last generated */}
          <p className="text-xs text-gray-600 mt-3">
            {generatedAt
              ? `Last generated: ${formatDate(generatedAt)}`
              : "Not generated yet — click a button above to start"}
          </p>
        </div>

        {/* Loading skeleton */}
        {(generating || generatingTrending) && posts.length === 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 animate-pulse space-y-3"
              >
                <div className="flex gap-2 items-center">
                  <div className="w-9 h-9 rounded-full bg-orange-500/30" />
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="h-4 w-16 bg-white/10 rounded ml-auto" />
                </div>
                <div className="h-5 w-full bg-white/10 rounded" />
                <div className="h-4 w-4/5 bg-white/10 rounded" />
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-3/4 bg-white/10 rounded" />
                <div className="flex gap-2">
                  <div className="h-8 flex-1 bg-white/10 rounded-lg" />
                  <div className="h-8 flex-1 bg-orange-500/20 rounded-lg" />
                  <div className="h-8 flex-1 bg-white/5 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main content: posts + sidebar */}
        {posts.length > 0 && (
          <div className="flex gap-6 items-start">
            {/* Posts grid */}
            <div className="flex-1 min-w-0">
              {/* Mobile stats toggle */}
              <button
                onClick={() => setStatsOpen((v) => !v)}
                className="lg:hidden w-full flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 mb-4 text-sm font-semibold text-gray-300"
              >
                <span className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-orange-400" />
                  This Week&apos;s Stats — {postsDone}/{postsGenerated} done
                </span>
                {statsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Mobile stats panel */}
              {statsOpen && (
                <div className="lg:hidden mb-4">
                  <StatsSidebar posts={posts} statuses={statuses} />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.day}
                    post={post}
                    status={statuses[post.day] ?? defaultStatus()}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:block w-64 shrink-0 sticky top-6">
              <StatsSidebar posts={posts} statuses={statuses} />
            </div>
          </div>
        )}

        {/* Empty state */}
        {posts.length === 0 && !generating && !generatingTrending && (
          <div className="text-center py-24 text-gray-500">
            <div className="text-6xl mb-4">📅</div>
            <p className="font-semibold text-lg text-gray-400">No posts yet</p>
            <p className="text-sm mt-1 mb-6">
              Generate a full week of content with one click
            </p>
            <button
              onClick={() => generatePosts("/api/generate-posts", generating)}
              className="bg-orange-500 hover:bg-orange-400 px-6 py-3 rounded-full font-bold transition-colors"
            >
              ⚡ Generate This Week
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
