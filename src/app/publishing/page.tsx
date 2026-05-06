"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, BarChart2, Calendar, Camera, ChevronDown, ChevronRight,
  ChevronUp, Clock, CheckCircle, Copy, ExternalLink, Eye, EyeOff,
  Filter, Flame, Globe, Image as ImageIcon, Palette, Pencil, RefreshCw, RotateCcw,
  Sliders, Sparkles, Trash2, TrendingUp, Zap,
} from "lucide-react";
import stackstreakPack from "@/lib/week1-scheduler-pack.json";
import createcolorPack from "@/lib/createcolor-week1-pack.json";

// ─── Types ────────────────────────────────────────────────────────────────────

type AppId = "stackstreak" | "createcolor";
type Tab = "today" | "schedule" | "studio";
type StudioPlatform = "Facebook" | "Instagram" | "Pinterest" | "Reddit";

type PostData = {
  day: number;
  app: AppId;
  template: string;
  headline: string;
  stat: string;
  body: string;
  platform: string;
  bestTime: string;
  topic: string;
};

type PostStatus = {
  done: boolean;
  instagramPosted: boolean;
  facebookPosted: boolean;
  pinterestPosted: boolean;
  redditPosted: boolean;
};

type ThemeConfig = {
  label: string;
  captionByPlatform: Partial<Record<StudioPlatform, string>>;
  titleByPlatform?: Partial<Record<StudioPlatform, string>>;
  headline: string;
  subheadline: string;
  stackTemplate?: string;
  createColorTheme?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STACK_URL = "https://stackstreak.aivantageworks.com";
const CREATE_URL = "https://createandcolor.aivantageworks.com";

const DAY_NAMES: Record<number, string> = {
  1: "Tuesday", 2: "Wednesday", 3: "Thursday", 4: "Friday",
  5: "Saturday", 6: "Sunday", 7: "Monday",
};

const STACK_HASHTAGS: Record<string, string[]> = {
  inflation: ["#inflation", "#savemoney", "#personalfinance", "#moneytips", "#budgeting", "#stackstreak", "#financialfreedom", "#savingmoney"],
  savings: ["#savingschallenge", "#52weekchallenge", "#savemoney", "#personalfinance", "#stackstreak", "#moneytips", "#savingsgoals", "#savingmoney"],
  mindset: ["#moneymindset", "#financialfreedom", "#personalfinance", "#moneyhabits", "#savemoney", "#stackstreak", "#wealthbuilding"],
  shopping: ["#shoppingsavings", "#savemoney", "#frugalliving", "#stackstreak", "#personalfinance", "#budgeting", "#moneyhacks"],
  groceries: ["#grocerysavings", "#savemoney", "#mealprep", "#frugalliving", "#stackstreak", "#personalfinance", "#budgetmeals"],
  food: ["#mealprep", "#savemoney", "#cookathome", "#budgetmeals", "#frugalliving", "#stackstreak", "#personalfinance"],
  subscriptions: ["#cancelsubscriptions", "#savemoney", "#moneysaving", "#personalfinance", "#budgeting", "#stackstreak"],
  bills: ["#billsavings", "#savemoney", "#reducebills", "#personalfinance", "#moneyhacks", "#stackstreak"],
  default: ["#savemoney", "#personalfinance", "#moneytips", "#frugalliving", "#budgeting", "#stackstreak", "#financialfreedom"],
};

const CREATE_HASHTAGS: Record<string, string[]> = {
  dinosaurs: ["#dinosaurcoloringpages", "#kidsactivities", "#printablesforkids", "#momlife", "#screenfreeactivities", "#createNcolor", "#coloringpages"],
  unicorns: ["#unicorncoloringpages", "#kidsactivities", "#printablesforkids", "#createNcolor", "#coloringpages", "#momlife", "#screenfreeactivities"],
  space: ["#spacecoloringpages", "#kidsactivities", "#printablesforkids", "#createNcolor", "#homeschool", "#screenfreeactivities"],
  rainyday: ["#rainydayactivities", "#kidsactivities", "#printablesforkids", "#momlife", "#createNcolor", "#indooractivities", "#boredkids"],
  imagination: ["#kidsactivities", "#coloringpages", "#createNcolor", "#printablesforkids", "#momlife", "#screenfreeactivities", "#kidsimagination"],
  parents: ["#momlife", "#kidsactivities", "#parentingtips", "#createNcolor", "#printablesforkids", "#screenfreeactivities"],
  education: ["#homeschool", "#teachersofinstagram", "#kidsactivities", "#printablesforkids", "#createNcolor", "#educationalactivities"],
  default: ["#kidsactivities", "#coloringpages", "#printablesforkids", "#createNcolor", "#momlife", "#screenfreeactivities"],
};

const TEMPLATE_MAP: Record<string, string> = {
  tip: "tip", stat: "stat", challenge: "challenge", alert: "inflation", story: "story",
};

const STUDIO_CONFIG: Record<AppId, { label: string; platforms: StudioPlatform[]; themes: Record<string, ThemeConfig> }> = {
  stackstreak: {
    label: "StackStreak",
    platforms: ["Facebook", "Instagram"],
    themes: {
      savings: {
        label: "Small Savings",
        captionByPlatform: {
          Facebook: `You do NOT need to save hundreds of dollars at once to start getting ahead.\n\nSaving $5 matters.\nSkipping one impulse buy matters.\nCooking at home twice this week matters.\n\nThe hardest part is not math. It's momentum.\n\nThat's why I built StackStreak — a free savings challenge app that makes progress feel visible.\n\nTry it here: ${STACK_URL}\n\n#savingmoney #budgeting #moneyhabits #frugalliving #personalfinance #savemoney #financialgoals #stackstreak`,
          Instagram: `Small wins matter. 🔥\n\nSaving $5 matters. Skipping one impulse buy matters. Cooking at home twice this week matters.\n\nMomentum beats perfection.\n\nTry it free: ${STACK_URL}\n\n#savingmoney #budgeting #financialgoals #stackstreak #moneyhabits`,
        },
        headline: "Small savings still count.",
        subheadline: "Momentum beats perfection.",
        stackTemplate: "tip",
      },
      inflation: {
        label: "Inflation",
        captionByPlatform: {
          Facebook: `Nobody warned us that everyday life would get this expensive.\n\nGroceries cost more. Bills cost more. Somehow even a quick Target run feels like financial sabotage.\n\nStackStreak helps you build savings momentum one small win at a time.\n\nTry it here: ${STACK_URL}\n\n#inflation #savemoney #personalfinance #budgeting #stackstreak`,
          Instagram: `Inflation is winning. Fight back with streaks. 🔥\n\nGroceries, bills, and everyday life got expensive fast. Start building savings momentum one small win at a time.\n\n${STACK_URL}\n\n#inflation #savemoney #stackstreak #moneytips`,
        },
        headline: "Inflation is winning.",
        subheadline: "Fight back with streaks.",
        stackTemplate: "alert",
      },
      challenge: {
        label: "52-Week Challenge",
        captionByPlatform: {
          Facebook: `One of the easiest ways to start saving is the 52-week challenge.\n\nWeek 1: save $1\nWeek 2: save $2\nWeek 3: save $3\n\nKeep going, and by the end of the year you've saved $1,378.\n\nStart free: ${STACK_URL}\n\n#52weekchallenge #savingschallenge #savemoney #stackstreak`,
          Instagram: `Start with $1. End with $1,378. 🌱\n\nThat's why the 52-week challenge is one of the easiest ways to build momentum.\n\n${STACK_URL}\n\n#52weekchallenge #savingschallenge #stackstreak`,
        },
        headline: "$1,378 in one year",
        subheadline: "Start with just $1.",
        stackTemplate: "challenge",
      },
    },
  },
  createcolor: {
    label: "CreateNColor",
    platforms: ["Facebook", "Instagram", "Pinterest"],
    themes: {
      rainyday: {
        label: "Rainy Day",
        captionByPlatform: {
          Facebook: `Stuck inside with bored kids? CreateNColor makes printable coloring pages from almost any idea in seconds. It's a simple rainy-day activity parents can use again and again.\n\n${CREATE_URL}`,
          Instagram: `Rainy day + bored kid + low-energy parent = rough combo 😅\n\nCreateNColor turns almost any idea into a printable coloring page in seconds.\n\n${CREATE_URL}\n\n#rainydayactivities #kidsactivities #momlife #createNcolor`,
          Pinterest: `Stuck inside with bored kids? CreateNColor makes printable coloring pages from almost any idea in seconds. A simple rainy-day activity parents can use again and again. ${CREATE_URL}`,
        },
        titleByPlatform: { Pinterest: "Easy Rainy Day Activity for Kids" },
        headline: "Rainy day? Print this.",
        subheadline: "Easy kid activity in seconds.",
        createColorTheme: "rainyday",
      },
      magiclens: {
        label: "Magic Lens",
        captionByPlatform: {
          Facebook: `One of the coolest parts of CreateNColor is Magic Lens. Take a photo and turn it into a coloring page. Toys, pets, favorite objects — all fair game.\n\n${CREATE_URL}`,
          Instagram: `Take a photo. Make a coloring page. 📸✨\n\nMagic Lens turns real things into printable fun — toys, pets, favorite objects, random kid obsessions.\n\nTry it free: ${CREATE_URL}\n\n#magiclens #kidsactivities #coloringpages #screenfreeactivities #createNcolor`,
          Pinterest: `Take a photo and turn it into a printable coloring page with Magic Lens. A fun way to turn favorite toys, pets, and everyday moments into creative kid activities. Try it here: ${CREATE_URL}`,
        },
        titleByPlatform: { Pinterest: "Turn Photos Into Coloring Pages" },
        headline: "Take a photo. Make a coloring page.",
        subheadline: "Magic Lens turns real things into printable fun.",
        createColorTheme: "magiclens",
      },
      dinosaurs: {
        label: "Dinosaurs",
        captionByPlatform: {
          Facebook: `If your kid loves dinosaurs, this is an easy one. CreateNColor lets you turn fun ideas into printable coloring pages in seconds. Great for quiet time, homeschool, or rainy-day fun.\n\nTry it here: ${CREATE_URL}`,
          Instagram: `Need an easy win for a dinosaur-loving kid? 🦖\n\nCreateNColor turns fun ideas into printable coloring pages in seconds.\n\nTry it free: ${CREATE_URL}\n\n#kidsactivities #dinosaurcoloringpages #printablesforkids #momlife #screenfreeactivities #createNcolor`,
          Pinterest: `Need an easy activity for dinosaur-loving kids? CreateNColor lets you turn fun ideas into printable coloring pages in seconds. ${CREATE_URL}`,
        },
        titleByPlatform: { Pinterest: "Free Dinosaur Coloring Pages for Kids" },
        headline: "Free Dinosaur Coloring Pages",
        subheadline: "Make one in seconds.",
        createColorTheme: "dinosaurs",
      },
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTodayDay(): number {
  const d = new Date().getDay();
  // Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6, Mon=7
  return d === 0 ? 6 : d === 1 ? 7 : d - 1;
}

function buildCaption(post: PostData): string {
  if (post.app === "stackstreak") {
    const tags = (STACK_HASHTAGS[post.topic] ?? STACK_HASHTAGS.default).join(" ");
    return `${post.headline}\n\n${post.body}\n\n💰 Try StackStreak free: ${STACK_URL}\n\n${tags}`;
  }
  const tags = (CREATE_HASHTAGS[post.topic] ?? CREATE_HASHTAGS.default).join(" ");
  return `${post.headline}\n\n${post.body}\n\n🎨 Try CreateNColor free: ${CREATE_URL}\n\n${tags}`;
}

function getImageUrl(post: PostData): string {
  if (post.app === "stackstreak") {
    const p = new URLSearchParams({
      template: TEMPLATE_MAP[post.template] ?? "tip",
      headline: post.headline,
      body: post.body,
      stat: post.stat ?? "",
    });
    return `/api/generate-image?${p}`;
  }
  const themeMap: Record<string, string> = {
    dinosaurs: "dinosaurs", unicorns: "rainyday", space: "rainyday",
    rainyday: "rainyday", imagination: "magiclens", parents: "rainyday", education: "rainyday",
  };
  const p = new URLSearchParams({
    theme: themeMap[post.topic] ?? "rainyday",
    headline: post.headline,
    subheadline: post.body.slice(0, 80),
  });
  return `${CREATE_URL}/api/marketing-image?${p}`;
}

function getDefaultParts(post: PostData) {
  const cta = post.app === "stackstreak" ? "💰 Try StackStreak free:" : "🎨 Try CreateNColor free:";
  const url = post.app === "stackstreak" ? STACK_URL : CREATE_URL;
  const hashtags = post.app === "stackstreak"
    ? (STACK_HASHTAGS[post.topic] ?? STACK_HASHTAGS.default).join(" ")
    : (CREATE_HASHTAGS[post.topic] ?? CREATE_HASHTAGS.default).join(" ");
  return { cta, url, hashtags };
}

function assembleCaption(headline: string, body: string, cta: string, url: string, hashtags: string): string {
  return `${headline}\n\n${body}\n\n${cta} ${url}\n\n${hashtags}`;
}

function buildPlatformCaption(
  platform: string,
  headline: string,
  body: string,
  cta: string,
  url: string,
  hashtags: string
): string {
  const tags = hashtags.split(" ").filter(Boolean);
  switch (platform) {
    case "Facebook":
      // Conversational, shorter hashtag tail (5 max)
      return `${headline}\n\n${body}\n\n${cta} ${url}\n\n${tags.slice(0, 5).join(" ")}`;
    case "Pinterest":
      // No hashtags — Pinterest uses keyword descriptions, not tags
      return `${headline}\n\n${body}\n\n${url}`;
    case "Reddit":
      // No hashtags, no emoji CTA — just content + link
      return `${headline}\n\n${body}\n\n${url}`;
    default: // Instagram
      // Full caption with all hashtags
      return `${headline}\n\n${body}\n\n${cta} ${url}\n\n${hashtags}`;
  }
}

function postKey(post: PostData): string {
  return `${post.app}:${post.day}`;
}

function defaultStatus(): PostStatus {
  return { done: false, instagramPosted: false, facebookPosted: false, pinterestPosted: false, redditPosted: false };
}

function getStorageKey(): string {
  const now = new Date();
  const week = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  return `publishing_hub_v1_${now.getFullYear()}_w${week}`;
}

// ─── Backup post pools (used when removing a post) ───────────────────────────

const STACKSTREAK_BACKUPS: Array<Omit<PostData, "day" | "app">> = [
  { template: "tip",       headline: "Cut your grocery bill by 20%",                    stat: "",       body: "Plan meals before you shop, buy store brands, and stick to a list. Small grocery swaps add up fast.",              platform: "Both",      bestTime: "7:00 PM",  topic: "groceries"     },
  { template: "challenge", headline: "No-spend weekend challenge",                       stat: "",       body: "Two days, no purchases except essentials. Track what you almost bought — the urge fades faster than you think.", platform: "Instagram", bestTime: "8:00 AM",  topic: "savings"       },
  { template: "stat",      headline: "Unused subscriptions cost households $1,300/year", stat: "$1,300", body: "Audit your subscriptions today. Cancel what you haven't touched in 30 days. That's a real emergency fund.",      platform: "Facebook",  bestTime: "6:00 PM",  topic: "subscriptions" },
  { template: "tip",       headline: "Pay yourself first — even $10 counts",             stat: "",       body: "Before bills, before groceries — move $10 to savings. Make it automatic. You won't miss what you never see.",    platform: "Both",      bestTime: "9:00 AM",  topic: "mindset"       },
  { template: "alert",     headline: "Impulse buys are costing you $3,000+ a year",      stat: "",       body: "Average impulse buy: $30–50. Twice a week, every week. One streak keeps the habit honest.",                     platform: "Instagram", bestTime: "7:30 PM",  topic: "shopping"      },
  { template: "tip",       headline: "Meal prep = the easiest money habit",               stat: "",       body: "Two hours on Sunday saves $50–100 in takeout each week. StackStreak turns that into a trackable streak.",        platform: "Facebook",  bestTime: "12:00 PM", topic: "food"          },
  { template: "challenge", headline: "The $5 savings challenge",                          stat: "",       body: "Every time you save $5 — a sale, a skipped coffee, a packed lunch — add it to your streak. Watch it grow.",     platform: "Both",      bestTime: "8:30 AM",  topic: "savings"       },
];

const CREATECOLOR_BACKUPS: Array<Omit<PostData, "day" | "app">> = [
  { template: "tip",     headline: "Ocean coloring pages kids will love",                stat: "", body: "Sharks, seahorses, silly fish, treasure chests — type any ocean idea into CreateNColor and print a fresh page.", platform: "Pinterest", bestTime: "10:00 AM", topic: "default"    },
  { template: "story",   headline: "My daughter said: purple horse with wings and a crown", stat: "", body: "10 seconds later, she had a coloring page. That's CreateNColor.",                                              platform: "Both",      bestTime: "7:00 PM",  topic: "imagination"},
  { template: "tip",     headline: "Animal coloring pages for any obsession",            stat: "", body: "Whatever animal your kid is into this week — CreateNColor makes a custom printable page in seconds.",               platform: "Pinterest", bestTime: "11:00 AM", topic: "default"    },
  { template: "parent",  headline: "Screen-free activity that takes 30 seconds to set up", stat: "", body: "Type an idea. Print a coloring page. Hand it to your kid. Done. Easiest quiet-time activity you'll find.",      platform: "Facebook",  bestTime: "8:30 PM",  topic: "parents"    },
  { template: "tip",     headline: "Superhero coloring pages kids design themselves",    stat: "", body: "Let kids name their own superhero and describe their powers. CreateNColor turns the idea into a printable page.",   platform: "Both",      bestTime: "5:00 PM",  topic: "imagination"},
  { template: "teacher", headline: "Coloring pages matched to your lesson theme",        stat: "", body: "Teaching oceans, farms, seasons, or animals? CreateNColor makes printable pages for your lesson in seconds.",      platform: "Reddit",    bestTime: "4:00 PM",  topic: "education"  },
  { template: "tip",     headline: "Princess and fairy coloring pages on demand",        stat: "", body: "Mix characters, settings, and accessories. CreateNColor matches exactly what your child loves this week.",          platform: "Pinterest", bestTime: "1:30 PM",  topic: "default"    },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────

function AppBadge({ app }: { app: AppId }) {
  return app === "stackstreak" ? (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
      <Flame className="w-3 h-3" /> StackStreak
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
      <Palette className="w-3 h-3" /> CreateNColor
    </span>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const cls: Record<string, string> = {
    Instagram: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    Facebook: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Pinterest: "bg-red-500/20 text-red-300 border-red-500/30",
    Reddit: "bg-orange-600/20 text-orange-300 border-orange-600/30",
    Both: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cls[platform] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
      {platform}
    </span>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
        copied
          ? "bg-green-500/20 text-green-300 border border-green-500/30"
          : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
      }`}
    >
      {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function ImagePreview({ url }: { url: string }) {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  if (state === "idle") {
    return (
      <button
        onClick={() => setState("loading")}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.03] border border-dashed border-white/15 hover:border-orange-500/30 text-gray-500 hover:text-orange-300 text-xs font-semibold transition-colors"
      >
        <Eye className="w-3.5 h-3.5" /> Preview Image
      </button>
    );
  }

  if (state === "error") {
    return (
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
        <span className="text-red-300">Image unavailable for this app/template</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white flex items-center gap-1 ml-2">
          <ExternalLink className="w-3.5 h-3.5" /> Open URL
        </a>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-white/[0.03] border border-white/10">
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center min-h-[120px]">
          <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Post preview"
        className={`w-full h-auto rounded-xl transition-opacity duration-300 ${state === "ok" ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setState("ok")}
        onError={() => setState("error")}
      />
      {state === "ok" && (
        <div className="absolute top-2 right-2 flex gap-1">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open full size"
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setState("idle")}
            title="Hide"
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── CreateNColor Image Helper ────────────────────────────────────────────────

function CreateColorImageHelper({ headline, body, onClose }: { headline: string; body: string; onClose?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idea = `${headline} — ${body}`;

  const handleOpen = () => {
    navigator.clipboard.writeText(idea).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    window.open("https://createandcolor.aivantageworks.com/create", "_blank");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImg(url);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setUploadedImg(url);
  };

  return (
    <div className="rounded-xl bg-pink-500/[0.06] border border-pink-500/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-pink-300 font-semibold flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" /> CreateNColor Image
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-600 hover:text-gray-300 transition-colors text-xs">✕ hide</button>
        )}
      </div>

      {/* Step 1 — generate */}
      <div className="space-y-2">
        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Step 1 — Generate</div>
        <div className="rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2 text-xs text-gray-400 leading-relaxed">
          {idea}
        </div>
        <button
          onClick={handleOpen}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 text-xs font-semibold transition-colors"
        >
          {copied ? (
            <><CheckCircle className="w-3.5 h-3.5" /> Idea copied — paste in Type It</>
          ) : (
            <><ExternalLink className="w-3.5 h-3.5" /> Copy Idea + Open CreateNColor</>
          )}
        </button>
        {copied && (
          <p className="text-[11px] text-pink-300/60 text-center">
            Type It → Paste → Create Magic → Download
          </p>
        )}
      </div>

      {/* Step 2 — add image back */}
      <div className="space-y-2">
        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Step 2 — Add Image to Post</div>

        {uploadedImg ? (
          <div className="relative rounded-xl overflow-hidden border border-pink-500/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={uploadedImg} alt="Generated coloring page" className="w-full h-auto rounded-xl" />
            <div className="absolute top-2 right-2 flex gap-1">
              <a
                href={uploadedImg}
                download="createcolor-post.png"
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                title="Download"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => { setUploadedImg(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                title="Remove"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border border-dashed border-pink-500/30 hover:border-pink-500/60 bg-white/[0.02] hover:bg-pink-500/[0.05] text-gray-500 hover:text-pink-300 cursor-pointer transition-colors"
          >
            <ImageIcon className="w-6 h-6" />
            <span className="text-xs font-semibold">Click or drag your downloaded image here</span>
            <span className="text-[11px] text-gray-600">PNG, JPG — stays local, nothing uploaded</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

// ─── Replacement Picker ───────────────────────────────────────────────────────

function ReplacementPicker({
  original,
  candidates,
  onPick,
  onSkip,
}: {
  original: PostData;
  candidates: PostData[];
  onPick: (p: PostData) => void;
  onSkip: () => void;
}) {
  return (
    <div className="space-y-4 py-1">
      <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
        <Trash2 className="w-3.5 h-3.5" /> Removing post — pick a replacement
      </div>
      <div className="text-sm text-gray-600 line-through leading-snug">{original.headline}</div>

      <div className="space-y-2">
        {candidates.map((c, i) => (
          <button
            key={i}
            onClick={() => onPick(c)}
            className="w-full text-left p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/[0.06] transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-bold text-white group-hover:text-orange-200 transition-colors leading-snug">{c.headline}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{c.body}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-orange-400 transition-colors shrink-0 mt-0.5" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <PlatformBadge platform={c.platform} />
              <span className="text-[10px] text-gray-600">{c.bestTime}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onSkip}
        className="text-xs text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1.5"
      >
        <Trash2 className="w-3 h-3" /> Remove without replacing
      </button>
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({
  post,
  status,
  onStatusChange,
  onRemove,
  pendingReplacement,
  isToday,
}: {
  post: PostData;
  status: PostStatus;
  onStatusChange: (key: string, update: Partial<PostStatus>) => void;
  onRemove: () => void;
  pendingReplacement?: { candidates: PostData[]; onPick: (p: PostData) => void; onSkip: () => void };
  isToday: boolean;
}) {
  const [captionOpen, setCaptionOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [imgSettingsOpen, setImgSettingsOpen] = useState(false);
  const [customHeadline, setCustomHeadline] = useState(post.headline);
  const [customBody, setCustomBody] = useState(post.body);
  const [customCta, setCustomCta] = useState(() => getDefaultParts(post).cta);
  const [customUrl, setCustomUrl] = useState(() => getDefaultParts(post).url);
  const [customHashtags, setCustomHashtags] = useState(() => getDefaultParts(post).hashtags);
  const [imgTemplate, setImgTemplate] = useState(() => TEMPLATE_MAP[post.template] ?? "tip");
  const [imgColor, setImgColor] = useState<"orange" | "dark" | "red" | "green">("orange");
  const [imgSize, setImgSize] = useState<"square" | "story">("square");
  const [helperOpen, setHelperOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(
    post.platform === "Both" ? "Instagram" : post.platform
  );
  const [msg, setMsg] = useState<string | null>(null);

  const defaults = useMemo(() => getDefaultParts(post), [post]);
  const isEdited = customHeadline !== post.headline || customBody !== post.body
    || customCta !== defaults.cta || customUrl !== defaults.url || customHashtags !== defaults.hashtags;
  const key = postKey(post);
  const caption = buildPlatformCaption(selectedPlatform, customHeadline, customBody, customCta, customUrl, customHashtags);

  const imageUrl = useMemo(() => {
    if (post.app !== "stackstreak") return getImageUrl({ ...post, headline: customHeadline, body: customBody });
    const p = new URLSearchParams({
      template: imgTemplate,
      headline: customHeadline,
      body: customBody,
      stat: post.stat ?? "",
      color: imgColor,
      size: imgSize,
    });
    return `/api/generate-image?${p}`;
  }, [post, customHeadline, customBody, imgTemplate, imgColor, imgSize]);

  const showMsg = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 4500);
  };

  const isCC = post.app === "createcolor";

  const handlePlatformClick = (
    platform: string,
    statusUpdate: Partial<PostStatus>
  ) => {
    setSelectedPlatform(platform);
    const newCaption = buildPlatformCaption(platform, customHeadline, customBody, customCta, customUrl, customHashtags);
    navigator.clipboard.writeText(newCaption).catch(() => {});
    if (isCC) {
      setHelperOpen(true);
      showMsg(`📋 ${platform} caption copied — generate image in CreateNColor, then post`);
    } else {
      window.open(imageUrl, "_blank");
      showMsg(`📋 ${platform} caption copied + image opened — save image, then post`);
    }
    onStatusChange(key, statusUpdate);
  };

  const handleFacebookHelper  = () => handlePlatformClick("Facebook",  { facebookPosted: true });
  const handleInstagramHelper = () => handlePlatformClick("Instagram", { instagramPosted: true });
  const handlePinterestHelper = () => handlePlatformClick("Pinterest", { pinterestPosted: true });
  const handleRedditHelper    = () => handlePlatformClick("Reddit",    { redditPosted: true });

  const platforms = ["Instagram", "Facebook", "Pinterest", "Reddit"];

  return (
    <div className={`relative bg-white/[0.04] border rounded-2xl p-5 flex flex-col gap-3 transition-all ${
      status.done
        ? "border-green-500/20 opacity-50"
        : isToday
          ? "border-orange-400/50 ring-1 ring-orange-400/20"
          : "border-white/10 hover:border-white/20"
    }`}>
      {/* Corner badge */}
      {status.done ? (
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 border border-green-500/30">
          <CheckCircle className="w-3 h-3" /> Done
        </div>
      ) : isToday ? (
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
          <Calendar className="w-3 h-3" /> Today
        </div>
      ) : null}

      {/* App + platform row */}
      <div className="flex items-center gap-2 flex-wrap pr-20">
        <AppBadge app={post.app} />
        <PlatformBadge platform={post.platform} />
      </div>

      {/* Day + time */}
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <span className="font-semibold">{DAY_NAMES[post.day] ?? `Day ${post.day}`}</span>
        <span className="text-white/20">·</span>
        <Clock className="w-3 h-3" />
        <span>{post.bestTime}</span>
      </div>

      {/* Replacement picker — shown when user clicked Remove */}
      {pendingReplacement && (
        <ReplacementPicker
          original={post}
          candidates={pendingReplacement.candidates}
          onPick={pendingReplacement.onPick}
          onSkip={pendingReplacement.onSkip}
        />
      )}

      {/* Content — view or edit (hidden while replacement picker is active) */}
      {!pendingReplacement && (
        editing ? (
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1 block">Headline</label>
              <input
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                className="w-full rounded-xl bg-[#111118] border border-orange-500/30 px-3 py-2 text-white text-sm font-bold focus:outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1 block">Body</label>
              <textarea
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-[#111118] border border-white/10 px-3 py-2 text-gray-300 text-sm leading-relaxed resize-none focus:outline-none focus:border-orange-400/50"
              />
            </div>
          </div>
        ) : (
          <>
            <h3 className={`font-black text-white text-base leading-snug ${isEdited ? "text-orange-200" : ""}`}>{customHeadline}</h3>
            {post.stat && <div className="text-2xl font-black text-orange-400">{post.stat}</div>}
            <p className="text-gray-400 text-sm leading-relaxed">{customBody}</p>
          </>
        )
      )}

      {/* Image preview — StackStreak uses API, CreateNColor shows helper when a platform button is clicked */}
      {!pendingReplacement && (
        post.app === "stackstreak"
          ? <ImagePreview url={imageUrl} />
          : helperOpen
            ? <CreateColorImageHelper headline={customHeadline} body={customBody} onClose={() => setHelperOpen(false)} />
            : <p className="text-[11px] text-gray-600 text-center py-1">Click a platform button below to generate &amp; preview your image</p>
      )}

      {/* Image settings toggle */}
      {!pendingReplacement && post.app === "stackstreak" && (
        <>
          <button
            onClick={() => setImgSettingsOpen((v) => !v)}
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 text-xs text-gray-500 hover:text-orange-300 transition-colors font-semibold"
          >
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Image Settings
            </span>
            {imgSettingsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {imgSettingsOpen && (
            <div className="rounded-xl bg-[#0d0d14] border border-white/10 p-4 space-y-4">
              {/* Template */}
              <div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Template</div>
                <div className="flex flex-wrap gap-2">
                  {([
                    { id: "tip",       emoji: "💡", label: "Tip" },
                    { id: "stat",      emoji: "📊", label: "Stat" },
                    { id: "challenge", emoji: "🏆", label: "Challenge" },
                    { id: "inflation", emoji: "🚨", label: "Alert" },
                    { id: "story",     emoji: "📱", label: "Story" },
                  ] as const).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setImgTemplate(t.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        imgTemplate === t.id
                          ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                          : "bg-white/[0.04] text-gray-400 border-white/10 hover:border-white/20 hover:text-gray-200"
                      }`}
                    >
                      {t.emoji} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color scheme */}
              <div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Color Scheme</div>
                <div className="flex gap-2">
                  {([
                    { id: "orange", emoji: "🔥", label: "Orange Fire",    dot: "bg-orange-500" },
                    { id: "dark",   emoji: "🌑", label: "Dark Mode",      dot: "bg-gray-800 border border-white/20" },
                    { id: "red",    emoji: "🚨", label: "Red Alert",       dot: "bg-red-700" },
                    { id: "green",  emoji: "💚", label: "Green Savings",   dot: "bg-emerald-600" },
                  ] as const).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setImgColor(c.id)}
                      title={c.label}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        imgColor === c.id
                          ? "bg-white/15 text-white border-white/30"
                          : "bg-white/[0.04] text-gray-400 border-white/10 hover:border-white/20 hover:text-gray-200"
                      }`}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas size */}
              <div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Canvas Size</div>
                <div className="flex gap-2">
                  {([
                    { id: "square", label: "◻ Square 1:1",  sub: "Feed post" },
                    { id: "story",  label: "▬ Story 9:16",   sub: "Stories & Reels" },
                  ] as const).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setImgSize(s.id)}
                      className={`flex flex-col items-start px-3 py-2 rounded-lg text-xs border transition-colors ${
                        imgSize === s.id
                          ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                          : "bg-white/[0.04] text-gray-400 border-white/10 hover:border-white/20 hover:text-gray-200"
                      }`}
                    >
                      <span className="font-semibold">{s.label}</span>
                      <span className={`text-[10px] mt-0.5 ${imgSize === s.id ? "text-orange-300/70" : "text-gray-600"}`}>{s.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Open full size */}
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs font-semibold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Image to Save / Download
              </a>
            </div>
          )}
        </>
      )}

      {/* Caption toggle + action buttons — hidden while replacement picker is active */}
      {!pendingReplacement && <button
        onClick={() => setCaptionOpen((v) => !v)}
        className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 text-xs text-gray-500 hover:text-gray-200 transition-colors font-semibold"
      >
        <span>Caption — <span className="text-white/50">{selectedPlatform}</span></span>
        {captionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>}
      {!pendingReplacement && captionOpen && (
        <div className="rounded-xl bg-[#0d0d14] border border-white/10 overflow-hidden">
          {/* Template fields */}
          <div className="p-4 space-y-3 border-b border-white/10">
            <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Edit Template</div>

            <div>
              <label className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 block">Headline</label>
              <input
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-3 py-2 text-white text-sm font-bold focus:outline-none focus:border-orange-400/50"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 block">Body</label>
              <textarea
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                rows={3}
                className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-3 py-2 text-gray-300 text-sm leading-relaxed resize-none focus:outline-none focus:border-orange-400/50"
              />
            </div>

            <div className="grid grid-cols-[1fr_2fr] gap-2">
              <div>
                <label className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 block">CTA Line</label>
                <input
                  value={customCta}
                  onChange={(e) => setCustomCta(e.target.value)}
                  className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-3 py-2 text-gray-300 text-xs focus:outline-none focus:border-orange-400/50"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 block">URL</label>
                <input
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-3 py-2 text-gray-300 text-xs focus:outline-none focus:border-orange-400/50"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 block">Hashtags</label>
              <textarea
                value={customHashtags}
                onChange={(e) => setCustomHashtags(e.target.value)}
                rows={2}
                className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-3 py-2 text-gray-400 text-xs leading-relaxed resize-none focus:outline-none focus:border-orange-400/50"
              />
            </div>
          </div>

          {/* Assembled preview */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Preview</span>
              <CopyButton text={caption} label="Copy Full Caption" />
            </div>
            <pre className="whitespace-pre-wrap text-xs text-gray-300 leading-6 font-sans">{caption}</pre>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!pendingReplacement && <div className="flex flex-wrap gap-2">
        <CopyButton text={caption} label="Copy Caption" />

        {([
          { id: "Facebook",  icon: <Globe className="w-3.5 h-3.5" />,     done: status.facebookPosted,  label: "Facebook",  doneLabel: "FB ✓",        cls: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30",     selCls: "bg-blue-500/30 text-blue-200 border-blue-400/50"   },
          { id: "Instagram", icon: <Camera className="w-3.5 h-3.5" />,    done: status.instagramPosted, label: "Instagram", doneLabel: "IG ✓",         cls: "bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border-pink-500/30",     selCls: "bg-pink-500/30 text-pink-200 border-pink-400/50"   },
          { id: "Pinterest", icon: <TrendingUp className="w-3.5 h-3.5" />, done: status.pinterestPosted, label: "Pinterest", doneLabel: "Pinterest ✓", cls: "bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30",         selCls: "bg-red-500/30 text-red-200 border-red-400/50"      },
          { id: "Reddit",    icon: <Zap className="w-3.5 h-3.5" />,        done: status.redditPosted,    label: "Reddit",    doneLabel: "Reddit ✓",    cls: "bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border-orange-600/30", selCls: "bg-orange-500/30 text-orange-200 border-orange-400/50" },
        ] as const).map(({ id, icon, done, label, doneLabel, cls, selCls }) => {
          const isSelected = selectedPlatform === id;
          const handlers: Record<string, () => void> = {
            Facebook: handleFacebookHelper, Instagram: handleInstagramHelper,
            Pinterest: handlePinterestHelper, Reddit: handleRedditHelper,
          };
          return (
            <button
              key={id}
              onClick={handlers[id]}
              disabled={!isCC && done && !isSelected}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                isSelected ? selCls + " ring-1 ring-white/20"
                : done && !isCC ? "bg-green-500/20 text-green-300 border-green-500/30 cursor-default"
                : cls
              }`}
            >
              {icon}
              {done && !isSelected ? doneLabel : label}
            </button>
          );
        })}

        <button
          onClick={() => setEditing((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            editing
              ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
              : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
          {editing ? "Done Editing" : isEdited ? "Edit ✎" : "Edit"}
        </button>

        {isEdited && (
          <button
            onClick={() => {
              setCustomHeadline(post.headline); setCustomBody(post.body);
              setCustomCta(defaults.cta); setCustomUrl(defaults.url); setCustomHashtags(defaults.hashtags);
              setEditing(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-500 hover:text-gray-300 border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}

        <button
          onClick={onRemove}
          title="Remove this post from the schedule"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors bg-white/5 hover:bg-red-500/15 text-gray-600 hover:text-red-400 border border-white/10 hover:border-red-500/30"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>

        <button
          onClick={() => onStatusChange(key, { done: !status.done })}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            status.done
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          {status.done ? "Done ✓" : "Mark Done"}
        </button>
      </div>}

      {msg && (
        <div className={`text-xs font-semibold text-center py-2 rounded-lg border ${
          msg.startsWith("✅") ? "text-green-300 bg-green-500/10 border-green-500/20"
            : msg.startsWith("📋") ? "text-blue-300 bg-blue-500/10 border-blue-500/20"
            : "text-yellow-300 bg-yellow-500/10 border-yellow-500/20"
        }`}>
          {msg}
        </div>
      )}
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ posts, statuses }: { posts: PostData[]; statuses: Record<string, PostStatus> }) {
  const total = posts.length;
  const done = Object.values(statuses).filter((s) => s.done).length;
  const ss = posts.filter((p) => p.app === "stackstreak").length;
  const cc = posts.filter((p) => p.app === "createcolor").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <BarChart2 className="w-4 h-4 text-orange-400" /> Week Progress
        </div>
        <span className="text-sm font-black text-white">{done}/{total} done</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center justify-between bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2">
          <span className="flex items-center gap-1.5 text-orange-300"><Flame className="w-3 h-3" /> StackStreak</span>
          <span className="font-black text-white">{ss}</span>
        </div>
        <div className="flex items-center justify-between bg-pink-500/10 border border-pink-500/20 rounded-xl px-3 py-2">
          <span className="flex items-center gap-1.5 text-pink-300"><Palette className="w-3 h-3" /> CreateNColor</span>
          <span className="font-black text-white">{cc}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Studio Tab ───────────────────────────────────────────────────────────────

function StudioTab() {
  const [app, setApp] = useState<AppId>("stackstreak");
  const [platform, setPlatform] = useState<StudioPlatform>("Facebook");
  const [themeKey, setThemeKey] = useState<string>("savings");
  const [customCaption, setCustomCaption] = useState<string | null>(null);

  const appConfig = STUDIO_CONFIG[app];
  const themeEntries = Object.entries(appConfig.themes);
  const safeThemeKey = appConfig.themes[themeKey] ? themeKey : themeEntries[0][0];
  const theme = appConfig.themes[safeThemeKey];

  const title = theme.titleByPlatform?.[platform] ?? theme.headline;
  const baseCaption = theme.captionByPlatform[platform] ?? "";
  const noCaption = !theme.captionByPlatform[platform];
  const caption = customCaption ?? baseCaption;
  const isCaptionEdited = customCaption !== null && customCaption !== baseCaption;

  // Reset custom caption when theme/platform/app changes
  useEffect(() => { setCustomCaption(null); }, [app, platform, safeThemeKey]);

  const imageUrl = useMemo(() => {
    if (app === "stackstreak") {
      const p = new URLSearchParams({
        template: theme.stackTemplate ?? "tip",
        headline: theme.headline,
        body: theme.subheadline,
      });
      return `${STACK_URL}/api/generate-image?${p}`;
    }
    const p = new URLSearchParams({
      theme: theme.createColorTheme ?? "rainyday",
      headline: theme.headline,
      subheadline: theme.subheadline,
    });
    return `${CREATE_URL}/api/marketing-image?${p}`;
  }, [app, theme]);

  const PRESETS = [
    { app: "stackstreak" as AppId, platform: "Facebook" as StudioPlatform, theme: "savings", label: "StackStreak · FB · Savings" },
    { app: "stackstreak" as AppId, platform: "Instagram" as StudioPlatform, theme: "inflation", label: "StackStreak · IG · Inflation" },
    { app: "stackstreak" as AppId, platform: "Instagram" as StudioPlatform, theme: "challenge", label: "StackStreak · IG · 52-Week" },
    { app: "createcolor" as AppId, platform: "Pinterest" as StudioPlatform, theme: "dinosaurs", label: "CreateNColor · Pinterest · Dinos" },
    { app: "createcolor" as AppId, platform: "Instagram" as StudioPlatform, theme: "magiclens", label: "CreateNColor · IG · Magic Lens" },
    { app: "createcolor" as AppId, platform: "Facebook" as StudioPlatform, theme: "rainyday", label: "CreateNColor · FB · Rainy Day" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Content Studio</h1>
        <p className="text-gray-400 text-sm mt-1">Pick an app, platform, and theme — copy the ready-to-post content</p>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={`${p.app}-${p.platform}-${p.theme}`}
            onClick={() => { setApp(p.app); setPlatform(p.platform); setThemeKey(p.theme); }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              app === p.app && platform === p.platform && safeThemeKey === p.theme
                ? "bg-white/15 text-white border-white/20"
                : "bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20 hover:text-gray-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="grid sm:grid-cols-3 gap-4 bg-white/[0.04] border border-white/10 rounded-2xl p-5">
        <div>
          <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">App</label>
          <select
            value={app}
            onChange={(e) => {
              const next = e.target.value as AppId;
              setApp(next);
              const firstTheme = Object.keys(STUDIO_CONFIG[next].themes)[0];
              setThemeKey(firstTheme);
              setPlatform(STUDIO_CONFIG[next].platforms[0]);
            }}
            className="w-full rounded-xl bg-[#111118] border border-white/10 px-3 py-2.5 text-white text-sm"
          >
            <option value="stackstreak">StackStreak</option>
            <option value="createcolor">CreateNColor</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as StudioPlatform)}
            className="w-full rounded-xl bg-[#111118] border border-white/10 px-3 py-2.5 text-white text-sm"
          >
            {appConfig.platforms.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Theme</label>
          <select
            value={safeThemeKey}
            onChange={(e) => setThemeKey(e.target.value)}
            className="w-full rounded-xl bg-[#111118] border border-white/10 px-3 py-2.5 text-white text-sm"
          >
            {themeEntries.map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-300">Image</div>
          <ImagePreview url={imageUrl} />
          <div className="flex gap-2 flex-wrap">
            <CopyButton text={imageUrl} label="Copy Image URL" />
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open Full Size
            </a>
          </div>
        </div>

        {/* Caption */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AppBadge app={app} />
            <PlatformBadge platform={platform} />
          </div>
          <div className="rounded-2xl bg-orange-500/10 border border-orange-500/20 p-4">
            <div className="text-xs text-orange-300 font-semibold uppercase tracking-wider mb-1">Title / Hook</div>
            <div className="text-lg font-bold">{title}</div>
          </div>
          {noCaption ? (
            <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-4 text-sm text-yellow-300">
              No pre-written caption for this platform + theme. Write your own below or switch platform.
            </div>
          ) : null}
          <div className="rounded-2xl bg-[#0d0d14] border border-white/10 p-1">
            <div className="flex items-center justify-between px-3 pt-2 pb-1">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Caption {isCaptionEdited && <span className="text-orange-400 normal-case">(edited)</span>}
              </span>
              {isCaptionEdited && (
                <button
                  onClick={() => setCustomCaption(null)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCustomCaption(e.target.value)}
              rows={10}
              className="w-full bg-transparent px-3 pb-3 text-sm text-gray-200 leading-7 font-sans resize-none focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={title} label="Copy Title" />
            <CopyButton text={caption} label="Copy Caption" />
            <CopyButton text={`${theme.headline}\n${theme.subheadline}`} label="Copy Image Text" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PublishingPage() {
  const [tab, setTab] = useState<Tab>("today");
  const [posts, setPosts] = useState<PostData[]>([]);
  const [statuses, setStatuses] = useState<Record<string, PostStatus>>({});
  const [generating, setGenerating] = useState(false);
  const [pendingRemovalKey, setPendingRemovalKey] = useState<string | null>(null);
  const [appFilter, setAppFilter] = useState<"all" | AppId>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  const todayDay = getTodayDay();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(getStorageKey());
      if (raw) {
        const { posts: p, statuses: s } = JSON.parse(raw);
        if (Array.isArray(p)) setPosts(p);
        if (s && typeof s === "object") setStatuses(s);
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((p: PostData[], s: Record<string, PostStatus>) => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify({ posts: p, statuses: s }));
    } catch {
      // ignore
    }
  }, []);

  const handleRemove = useCallback((key: string) => {
    setPendingRemovalKey(key);
  }, []);

  const handleConfirmRemove = useCallback((key: string) => {
    setPosts((current) => {
      const next = current.filter((p) => postKey(p) !== key);
      setStatuses((prev) => {
        const n = { ...prev };
        delete n[key];
        persist(next, n);
        return n;
      });
      return next;
    });
    setPendingRemovalKey(null);
  }, [persist]);

  const handlePickReplacement = useCallback((oldKey: string, replacement: PostData) => {
    setPosts((current) => {
      const next = current.map((p) => postKey(p) === oldKey ? replacement : p);
      setStatuses((prev) => {
        const n = { ...prev };
        delete n[oldKey];
        n[postKey(replacement)] = defaultStatus();
        persist(next, n);
        return n;
      });
      return next;
    });
    setPendingRemovalKey(null);
  }, [persist]);

  const handleStatusChange = useCallback((key: string, update: Partial<PostStatus>) => {
    setStatuses((prev) => {
      const next = { ...prev, [key]: { ...(prev[key] ?? defaultStatus()), ...update } };
      setPosts((currentPosts) => { persist(currentPosts, next); return currentPosts; });
      return next;
    });
  }, [persist]);

  const removalCandidates = useMemo(() => {
    if (!pendingRemovalKey) return [];
    const post = posts.find((p) => postKey(p) === pendingRemovalKey);
    if (!post) return [];
    const pool = post.app === "stackstreak" ? STACKSTREAK_BACKUPS : CREATECOLOR_BACKUPS;
    const usedTopics = new Set(
      posts.filter((p) => p.app === post.app && postKey(p) !== pendingRemovalKey).map((p) => p.topic)
    );
    const unique = pool.filter((b) => !usedTopics.has(b.topic));
    const source = unique.length >= 3 ? unique : pool;
    return source.slice(0, 3).map((b) => ({ ...b, day: post.day, app: post.app as AppId }));
  }, [pendingRemovalKey, posts]);

  const loadPosts = useCallback((incoming: PostData[], keepOtherApp?: AppId) => {
    setPosts((current) => {
      const kept = keepOtherApp ? current.filter((p) => p.app === keepOtherApp) : [];
      const merged = [...kept, ...incoming];
      const newStatuses: Record<string, PostStatus> = {};
      merged.forEach((p) => { newStatuses[postKey(p)] = defaultStatus(); });
      setStatuses(newStatuses);
      persist(merged, newStatuses);
      return merged;
    });
  }, [persist]);

  const loadStackstreakWeek1 = () => {
    const typed = (stackstreakPack as Omit<PostData, "app">[]).map((p) => ({ ...p, app: "stackstreak" as AppId }));
    loadPosts(typed, "createcolor");
  };

  const loadCreatecolorWeek1 = () => {
    const typed = (createcolorPack as Omit<PostData, "app">[]).map((p) => ({ ...p, app: "createcolor" as AppId }));
    loadPosts(typed, "stackstreak");
  };

  const loadBothWeek1 = () => {
    const ss = (stackstreakPack as Omit<PostData, "app">[]).map((p) => ({ ...p, app: "stackstreak" as AppId }));
    const cc = (createcolorPack as Omit<PostData, "app">[]).map((p) => ({ ...p, app: "createcolor" as AppId }));
    loadPosts([...ss, ...cc]);
  };

  const generatePosts = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 7 }),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const typed = data.map((p) => ({ ...p, app: "stackstreak" as AppId }));
        loadPosts(typed, "createcolor");
      }
    } catch {
      // ignore
    }
    setGenerating(false);
  };

  const filteredPosts = useMemo(() => {
    return posts
      .filter((p) => {
        if (appFilter !== "all" && p.app !== appFilter) return false;
        if (platformFilter !== "all" && p.platform !== platformFilter && p.platform !== "Both") return false;
        return true;
      })
      .sort((a, b) => a.day !== b.day ? a.day - b.day : a.app.localeCompare(b.app));
  }, [posts, appFilter, platformFilter]);

  const todayPosts = useMemo(
    () => posts.filter((p) => p.day === todayDay).sort((a, b) => a.app.localeCompare(b.app)),
    [posts, todayDay]
  );

  const todayRemaining = todayPosts.filter((p) => !statuses[postKey(p)]?.done).length;

  const TABS: { id: Tab; label: string; badge?: number }[] = [
    { id: "today", label: "Today", badge: todayRemaining || undefined },
    { id: "schedule", label: "Schedule", badge: posts.length || undefined },
    { id: "studio", label: "Studio" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-7xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <span className="font-black">Publishing Hub</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="text-orange-300 font-semibold">StackStreak</span>
          <span>+</span>
          <span className="text-pink-300 font-semibold">CreateNColor</span>
        </div>
      </nav>

      {/* Tabs */}
      <div className="border-b border-white/5 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 pt-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-t-xl border border-b-0 transition-colors ${
                tab === t.id
                  ? "text-white bg-white/[0.06] border-white/10"
                  : "text-gray-500 hover:text-gray-300 border-transparent"
              }`}
            >
              {t.label}
              {t.badge !== undefined && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-black ${
                  t.id === "today" ? "bg-orange-500/20 text-orange-300" : "bg-white/10 text-gray-400"
                }`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── TODAY ── */}
        {tab === "today" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black">
                {DAY_NAMES[todayDay]}&apos;s Posts
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {todayPosts.length === 0
                  ? "No posts scheduled for today — load a week in the Schedule tab"
                  : `${todayRemaining} left to publish · ${todayPosts.length - todayRemaining} done`}
              </p>
            </div>

            {posts.length === 0 && (
              <div className="text-center py-20 border border-white/10 rounded-2xl">
                <div className="text-5xl mb-4">📅</div>
                <p className="text-gray-400 font-semibold mb-2">No schedule loaded yet</p>
                <p className="text-gray-600 text-sm mb-6">Load a week pack to get started</p>
                <button
                  onClick={() => { loadBothWeek1(); setTab("schedule"); }}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 px-6 py-3 rounded-full font-bold text-sm transition-all"
                >
                  Load Both Apps — Week 1
                </button>
              </div>
            )}

            {posts.length > 0 && todayPosts.length === 0 && (
              <div className="text-center py-16 border border-white/10 rounded-2xl">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-gray-400 font-semibold">Nothing scheduled for {DAY_NAMES[todayDay]}</p>
                <p className="text-gray-600 text-sm mt-1">Check the Schedule tab for other days</p>
              </div>
            )}

            {todayPosts.length > 0 && (
              <>
                {/* Step guide */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4">
                  {["Preview image", "Copy caption", "Click platform button", "Post manually", "Mark Done"].map((step, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                      <span>{step}</span>
                      {i < 4 && <ChevronRight className="w-3 h-3 text-white/20 ml-1" />}
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {todayPosts.map((post) => (
                    <PostCard
                      key={postKey(post)}
                      post={post}
                      status={statuses[postKey(post)] ?? defaultStatus()}
                      onStatusChange={handleStatusChange}
                      onRemove={() => handleRemove(postKey(post))}
                      pendingReplacement={pendingRemovalKey === postKey(post) ? {
                        candidates: removalCandidates,
                        onPick: (p) => handlePickReplacement(postKey(post), p),
                        onSkip: () => handleConfirmRemove(postKey(post)),
                      } : undefined}
                      isToday
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SCHEDULE ── */}
        {tab === "schedule" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black">Week Schedule</h1>
              <p className="text-gray-400 text-sm mt-1">Load a week pack, filter by app or platform, then work through posts day by day</p>
            </div>

            {/* Load buttons */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Load posts</div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={loadBothWeek1}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/10 transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Both Apps — Week 1
                </button>
                <button
                  onClick={loadStackstreakWeek1}
                  className="flex items-center gap-2 px-4 py-2.5 bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/30 rounded-xl font-bold text-sm transition-colors"
                >
                  <Flame className="w-4 h-4" /> StackStreak — Week 1
                </button>
                <button
                  onClick={loadCreatecolorWeek1}
                  className="flex items-center gap-2 px-4 py-2.5 bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 border border-pink-500/30 rounded-xl font-bold text-sm transition-colors"
                >
                  <Palette className="w-4 h-4" /> CreateNColor — Week 1
                </button>
                <button
                  onClick={generatePosts}
                  disabled={generating}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {generating ? "Generating…" : "AI Generate StackStreak"}
                </button>
              </div>
            </div>

            {posts.length > 0 && (
              <>
                {/* Stats */}
                <StatsBar posts={posts} statuses={statuses} />

                {/* Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                  <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  {(["all", "stackstreak", "createcolor"] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => setAppFilter(a)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        appFilter === a ? "bg-white/15 text-white border border-white/20" : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/10"
                      }`}
                    >
                      {a === "all" ? "All Apps" : a === "stackstreak" ? "StackStreak" : "CreateNColor"}
                    </button>
                  ))}
                  <span className="text-white/10">|</span>
                  {["all", "Facebook", "Instagram", "Pinterest", "Reddit"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatformFilter(p)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        platformFilter === p ? "bg-white/15 text-white border border-white/20" : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-white/10"
                      }`}
                    >
                      {p === "all" ? "All Platforms" : p}
                    </button>
                  ))}
                </div>
              </>
            )}

            {filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={postKey(post)}
                    post={post}
                    status={statuses[postKey(post)] ?? defaultStatus()}
                    onStatusChange={handleStatusChange}
                    onRemove={() => handleRemove(postKey(post))}
                    pendingReplacement={pendingRemovalKey === postKey(post) ? {
                      candidates: removalCandidates,
                      onPick: (p) => handlePickReplacement(postKey(post), p),
                      onSkip: () => handleConfirmRemove(postKey(post)),
                    } : undefined}
                    isToday={post.day === todayDay}
                  />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">No posts match the current filter</div>
            ) : (
              <div className="text-center py-20 border border-white/10 rounded-2xl">
                <div className="text-5xl mb-4">📅</div>
                <p className="text-gray-400 font-semibold mb-2">No posts loaded</p>
                <p className="text-gray-600 text-sm mb-6">Use the buttons above to load a week pack</p>
                <button
                  onClick={loadBothWeek1}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 px-6 py-3 rounded-full font-bold text-sm transition-all"
                >
                  Load Both Apps — Week 1
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STUDIO ── */}
        {tab === "studio" && <StudioTab />}
      </div>
    </main>
  );
}
