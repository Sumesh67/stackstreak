"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, CheckCircle2, Sparkles, Calendar, CheckCircle, Clock, PlusCircle, ListOrdered, ExternalLink, Trash2 } from "lucide-react";
import { loadQueue, saveQueue, type ContentQueueItem } from "@/lib/content-queue";

type AppId = "stackstreak" | "createcolor";
type Platform = "Facebook" | "Instagram" | "Pinterest" | "Reddit";

type ThemeConfig = {
  label: string;
  captionByPlatform: Partial<Record<Platform, string>>;
  titleByPlatform?: Partial<Record<Platform, string>>;
  headline: string;
  subheadline: string;
  stackTemplate?: string;
  createColorTheme?: string;
};

type QueueStatus = {
  reviewed: boolean;
  posted: boolean;
};

const STACK_URL = "https://stackstreak.aivantageworks.com";
const CREATE_URL = "https://createandcolor.aivantageworks.com";

const CONFIG: Record<AppId, { label: string; themes: Record<string, ThemeConfig> }> = {
  stackstreak: {
    label: "StackStreak",
    themes: {
      savings: {
        label: "Small Savings",
        captionByPlatform: {
          Facebook: `You do NOT need to save hundreds of dollars at once to start getting ahead.\n\nSaving $5 matters.\nSkipping one impulse buy matters.\nCooking at home twice this week matters.\n\nThe hardest part is not math. It’s momentum.\n\nThat’s why I built StackStreak — a free savings challenge app that makes progress feel visible.\n\nTry it here: ${STACK_URL}\n\n#savingmoney #budgeting #moneyhabits #frugalliving #personalfinance #savemoney #financialgoals #stackstreak`,
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
          Facebook: `One of the easiest ways to start saving is the 52-week challenge.\n\nWeek 1: save $1\nWeek 2: save $2\nWeek 3: save $3\n\nKeep going, and by the end of the year you’ve saved $1,378.\n\nStart free: ${STACK_URL}\n\n#52weekchallenge #savingschallenge #savemoney #stackstreak`,
          Instagram: `Start with $1. End with $1,378. 🌱\n\nThat’s why the 52-week challenge is one of the easiest ways to build momentum.\n\n${STACK_URL}\n\n#52weekchallenge #savingschallenge #stackstreak`,
        },
        headline: "$1,378 in one year",
        subheadline: "Start with just $1.",
        stackTemplate: "challenge",
      },
    },
  },
  createcolor: {
    label: "CreateColor",
    themes: {
      rainyday: {
        label: "Rainy Day",
        captionByPlatform: {
          Facebook: `Stuck inside with bored kids? CreateColor makes printable coloring pages from almost any idea in seconds. It’s a simple rainy-day activity parents can use again and again.\n\n${CREATE_URL}`,
          Instagram: `Rainy day + bored kid + low-energy parent = rough combo 😅\n\nCreateColor turns almost any idea into a printable coloring page in seconds.\n\n${CREATE_URL}\n\n#rainydayactivities #kidsactivities #momlife #createcolor`,
          Pinterest: `Stuck inside with bored kids? CreateColor makes printable coloring pages from almost any idea in seconds. A simple rainy-day activity parents can use again and again. ${CREATE_URL}`,
        },
        titleByPlatform: {
          Pinterest: "Easy Rainy Day Activity for Kids",
        },
        headline: "Rainy day? Print this.",
        subheadline: "Easy kid activity in seconds.",
        createColorTheme: "rainyday",
      },
      magiclens: {
        label: "Magic Lens",
        captionByPlatform: {
          Facebook: `One of the coolest parts of CreateColor is Magic Lens. Take a photo and turn it into a coloring page. Toys, pets, favorite objects — all fair game.\n\n${CREATE_URL}`,
          Instagram: `Take a photo. Make a coloring page. 📸✨\n\nMagic Lens turns real things into printable fun — toys, pets, favorite objects, random kid obsessions.\n\nTry it free: ${CREATE_URL}\n\n#magiclens #kidsactivities #coloringpages #screenfreeactivities #createcolor`,
          Pinterest: `Take a photo and turn it into a printable coloring page with Magic Lens. A fun way to turn favorite toys, pets, and everyday moments into creative kid activities. Try it here: ${CREATE_URL}`,
        },
        titleByPlatform: {
          Pinterest: "Turn Photos Into Coloring Pages",
        },
        headline: "Take a photo. Make a coloring page.",
        subheadline: "Magic Lens turns real things into printable fun.",
        createColorTheme: "magiclens",
      },
      dinosaurs: {
        label: "Dinosaurs",
        captionByPlatform: {
          Facebook: `If your kid loves dinosaurs, this is an easy one. CreateColor lets you turn fun ideas into printable coloring pages in seconds. Great for quiet time, homeschool, or rainy-day fun.\n\nTry it here: ${CREATE_URL}`,
          Instagram: `Need an easy win for a dinosaur-loving kid? 🦖\n\nCreateColor turns fun ideas into printable coloring pages in seconds. Great for quiet time, homeschool breaks, or screen-free fun.\n\nTry it free: ${CREATE_URL}\n\n#kidsactivities #dinosaurcoloringpages #printablesforkids #momlife #screenfreeactivities #createcolor`,
          Pinterest: `Need an easy activity for dinosaur-loving kids? CreateColor lets you turn fun ideas into printable coloring pages in seconds. Great for quiet time, homeschool breaks, or screen-free fun. Try it here: ${CREATE_URL}`,
        },
        titleByPlatform: {
          Pinterest: "Free Dinosaur Coloring Pages for Kids",
        },
        headline: "Free Dinosaur Coloring Pages",
        subheadline: "Make one in seconds.",
        createColorTheme: "dinosaurs",
      },
    },
  },
};

function getTodayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day === 1 ? 1 : day - 1;
}

function queueKey(app: AppId, themeKey: string, platform: Platform) {
  return `content_studio_${app}_${themeKey}_${platform}`;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
        copied ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10"
      }`}
    >
      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}

export default function ContentStudioPage() {
  const [app, setApp] = useState<AppId>("stackstreak");
  const [platform, setPlatform] = useState<Platform>("Facebook");
  const [themeKey, setThemeKey] = useState<string>("savings");
  const [status, setStatus] = useState<QueueStatus>({ reviewed: false, posted: false });
  const [queueCount, setQueueCount] = useState(0);
  const [queueMessage, setQueueMessage] = useState<string | null>(null);
  const [queueItems, setQueueItems] = useState<ContentQueueItem[]>([]);

  const appConfig = CONFIG[app];
  const themeEntries = Object.entries(appConfig.themes);
  const safeThemeKey = appConfig.themes[themeKey] ? themeKey : themeEntries[0][0];
  const theme = appConfig.themes[safeThemeKey];
  const todayIndex = getTodayIndex();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(queueKey(app, safeThemeKey, platform));
      if (raw) setStatus(JSON.parse(raw));
      else setStatus({ reviewed: false, posted: false });
      const items = loadQueue();
      setQueueCount(items.length);
      setQueueItems(items);
    } catch {
      setStatus({ reviewed: false, posted: false });
      setQueueCount(0);
      setQueueItems([]);
    }
  }, [app, safeThemeKey, platform]);

  const persistStatus = (next: QueueStatus) => {
    setStatus(next);
    localStorage.setItem(queueKey(app, safeThemeKey, platform), JSON.stringify(next));
  };

  const title = useMemo(() => theme.titleByPlatform?.[platform] || theme.headline, [theme, platform]);
  const caption = useMemo(() => theme.captionByPlatform[platform] || theme.captionByPlatform.Facebook || "", [theme, platform]);

  const imageUrl = useMemo(() => {
    if (app === "stackstreak") {
      const params = new URLSearchParams({
        template: theme.stackTemplate || "tip",
        headline: theme.headline,
        body: theme.subheadline,
      });
      return `${STACK_URL}/api/generate-image?${params.toString()}`;
    }

    const params = new URLSearchParams({
      theme: theme.createColorTheme || "rainyday",
      headline: theme.headline,
      subheadline: theme.subheadline,
    });
    return `${CREATE_URL}/api/marketing-image?${params.toString()}`;
  }, [app, theme]);

  const nextTheme = themeEntries.find(([key]) => key !== safeThemeKey)?.[1]?.label || "Next queue item";

  const queueItem: ContentQueueItem = {
    id: `${app}:${platform}:${safeThemeKey}`,
    app,
    platform,
    themeKey: safeThemeKey,
    themeLabel: theme.label,
    title,
    caption,
    headline: theme.headline,
    subheadline: theme.subheadline,
    imageUrl,
    reviewed: status.reviewed,
    posted: status.posted,
    createdAt: new Date().toISOString(),
    scheduledDay: todayIndex,
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-6xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <span className="font-black">Content Studio</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2 text-sm text-gray-300">
          <span><strong>App:</strong> {appConfig.label}</span>
          <span className="text-white/20">•</span>
          <span><strong>Platform:</strong> {platform}</span>
          <span className="text-white/20">•</span>
          <span><strong>Theme:</strong> {theme.label}</span>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
          <div className="text-sm font-semibold text-white mb-3">Quick presets</div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setApp("stackstreak"); setPlatform("Facebook"); setThemeKey("savings"); }} className="px-3 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-semibold">StackStreak + Facebook + Small Savings</button>
            <button onClick={() => { setApp("stackstreak"); setPlatform("Instagram"); setThemeKey("inflation"); }} className="px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-semibold">StackStreak + Instagram + Inflation</button>
            <button onClick={() => { setApp("createcolor"); setPlatform("Instagram"); setThemeKey("magiclens"); }} className="px-3 py-2 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-300 text-sm font-semibold">CreateColor + Instagram + Magic Lens</button>
            <button onClick={() => { setApp("createcolor"); setPlatform("Pinterest"); setThemeKey("dinosaurs"); }} className="px-3 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-semibold">CreateColor + Pinterest + Dinosaurs</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Today</div>
            <div className="text-sm font-bold text-white flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-400" /> Day {todayIndex}</div>
            <div className="text-xs text-gray-400 mt-1">Use this page as your daily review queue</div>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Status</div>
            <div className="text-sm font-bold text-white">{status.posted ? "Posted" : status.reviewed ? "Reviewed" : "Pending"}</div>
            <div className="text-xs text-gray-400 mt-1">Tracked per app + theme + platform</div>
          </div>
          <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Next up</div>
            <div className="text-sm font-bold text-white flex items-center gap-2"><Clock className="w-4 h-4 text-green-400" /> {nextTheme}</div>
            <div className="text-xs text-gray-400 mt-1">Queue size: {queueCount} items</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-5 h-fit">
            <div>
              <label className="block text-sm text-gray-400 mb-2">App</label>
              <select
                value={app}
                onChange={(e) => {
                  const nextApp = e.target.value as AppId;
                  setApp(nextApp);
                  const firstTheme = Object.keys(CONFIG[nextApp].themes)[0];
                  setThemeKey(firstTheme);
                }}
                className="w-full rounded-xl bg-[#111118] border border-white/10 px-4 py-3 text-white"
              >
                <option value="stackstreak">StackStreak</option>
                <option value="createcolor">CreateColor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full rounded-xl bg-[#111118] border border-white/10 px-4 py-3 text-white"
              >
                <option>Facebook</option>
                <option>Instagram</option>
                <option>Pinterest</option>
                <option>Reddit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Theme</label>
              <select
                value={safeThemeKey}
                onChange={(e) => setThemeKey(e.target.value)}
                className="w-full rounded-xl bg-[#111118] border border-white/10 px-4 py-3 text-white"
              >
                {themeEntries.map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>

            {queueMessage && (
              <div className="rounded-xl px-4 py-3 text-sm font-semibold bg-green-500/15 text-green-300 border border-green-500/30">
                {queueMessage}
              </div>
            )}

            <div className="pt-2 border-t border-white/5 space-y-2">
              <button
                onClick={() => persistStatus({ ...status, reviewed: !status.reviewed })}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${status.reviewed ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200"}`}
              >
                {status.reviewed ? "Reviewed ✓" : "Mark Reviewed"}
              </button>
              <button
                onClick={() => persistStatus({ reviewed: true, posted: !status.posted })}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${status.posted ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300"}`}
              >
                {status.posted ? "Posted ✓" : "Mark Posted"}
              </button>
              <button
                onClick={() => {
                  const current = loadQueue();
                  const existingIndex = current.findIndex((x) => x.id === queueItem.id);
                  if (existingIndex >= 0) current[existingIndex] = queueItem;
                  else current.unshift(queueItem);
                  saveQueue(current);
                  setQueueCount(current.length);
                  setQueueItems(current);
                  setQueueMessage(`Added to queue: ${queueItem.themeLabel} (${queueItem.platform})`);
                  setTimeout(() => setQueueMessage(null), 2500);
                }}
                className="w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300"
              >
                <span className="inline-flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Add to Queue</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-orange-400 font-semibold">{appConfig.label} • {platform}</div>
                  <h1 className="text-2xl font-black mt-1">{theme.label}</h1>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <CopyButton text={title} label="Copy Title" />
                  <CopyButton text={caption} label="Copy Caption" />
                  <CopyButton text={`${theme.headline}\n${theme.subheadline}`} label="Copy Image Text" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="rounded-2xl bg-orange-500/10 border border-orange-500/20 p-4">
                  <div className="text-xs uppercase tracking-wider text-orange-300 font-semibold mb-2">Title / Hook</div>
                  <div className="text-xl font-bold">{title}</div>
                </div>
                <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4">
                  <div className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-2">Image Text</div>
                  <div className="text-lg font-bold">{theme.headline}</div>
                  <div className="text-sm text-gray-300 mt-1">{theme.subheadline}</div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#111118] border border-white/10 p-4">
                <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Caption</div>
                <pre className="whitespace-pre-wrap text-sm text-gray-200 leading-7 font-sans">{caption}</pre>
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-green-400 font-semibold">Direct Image URL</div>
                  <div className="text-sm text-gray-400 mt-1">Open this to preview/download the image</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <CopyButton text={imageUrl} label="Copy Image URL" />
                  <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30">
                    Open Image
                  </a>
                </div>
              </div>

              <div className="rounded-2xl bg-[#111118] border border-white/10 p-4 break-all text-sm text-gray-300">
                {imageUrl}
              </div>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold">Queue</div>
                <div className="text-sm text-gray-400 mt-1">See what&apos;s next and jump between Studio and Scheduler</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link href="/scheduler" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30">
                  <ExternalLink className="w-4 h-4" /> Open Scheduler
                </Link>
              </div>
            </div>

            {queueItems.length === 0 ? (
              <div className="rounded-2xl bg-[#111118] border border-white/10 p-4 text-sm text-gray-400">
                No queued items yet. Add one from above to start your publishing flow.
              </div>
            ) : (
              <div className="space-y-3">
                {queueItems.map((item, index) => (
                  <div key={item.id} className="rounded-2xl bg-[#111118] border border-white/10 p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{index === 0 ? "Next item" : "Queued item"}</div>
                        <div className="font-bold text-white mt-1">{item.themeLabel} • {item.platform}</div>
                        <div className="text-sm text-gray-400 mt-1">{item.app} • {item.title}</div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {item.reviewed && <span className="text-xs rounded-full px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30">Reviewed</span>}
                        {item.posted && <span className="text-xs rounded-full px-2 py-1 bg-green-500/20 text-green-300 border border-green-500/30">Posted</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setApp(item.app);
                          setPlatform(item.platform);
                          setThemeKey(item.themeKey);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10"
                      >
                        <ListOrdered className="w-4 h-4" /> Load in Studio
                      </button>
                      <button
                        onClick={() => {
                          const next = queueItems.filter((x) => x.id !== item.id);
                          saveQueue(next);
                          setQueueItems(next);
                          setQueueCount(next.length);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
