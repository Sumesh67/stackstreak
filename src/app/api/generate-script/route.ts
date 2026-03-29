import { NextRequest, NextResponse } from "next/server";
import { geminiGenerate } from "@/lib/gemini";

export const dynamic = "force-dynamic";

const FALLBACK_SCRIPT = {
  hook: "You're losing $400 every single month — and you don't even realize it. 💸",
  story: "Inflation hit 20% since 2020. Your paycheck stayed flat. That gap? That's money quietly disappearing from your wallet every time you swipe your card.",
  value: "Here's what I did: I downloaded StackStreak and started ONE savings challenge. The 52-week challenge starts with just $1. Week 52, you've saved $1,378. I also cancelled 3 subscriptions I forgot about ($47/month gone), switched to ALDI for groceries (saves me $80/month), and meal prepped on Sundays. In 90 days, I saved over $800.",
  cta: "Download StackStreak free at stackstreak-two.vercel.app. It's 100% free, no catch. Start your streak today.",
  caption: "POV: You just discovered you've been losing $400/month without knowing it 😤 Here's the exact system I used to save $800 in 90 days using StackStreak (free app!). Link in bio 💰",
  hashtags: ["#savingmoney", "#personalfinance", "#moneytips", "#frugalliving", "#savingchallenge", "#financialfreedom", "#budgeting", "#stackstreak", "#moneytok", "#inflation"],
};

const PLATFORM_TONES: Record<string, string> = {
  TikTok: "Use Gen Z/millennial slang, fast-paced, very casual, trend-aware. Short punchy sentences.",
  "Instagram Reels": "Slightly more polished but still relatable. Inspirational tone. Use emojis freely.",
  "Facebook Reels": "Conversational, slightly older audience (25-45). More detail-oriented. Warmer tone.",
  "YouTube Shorts": "Clear and direct. Include a strong verbal hook in first 3 seconds. End with subscribe/link CTA. Speak confidently. Script is read as a voiceover — no text-only jokes.",
};

export async function POST(req: NextRequest) {
  const { platform, topic, duration, hookStyle } = await req.json();

  const platformTone = PLATFORM_TONES[platform] || PLATFORM_TONES["TikTok"];
  const isYouTube = platform === "YouTube Shorts";

  const extraYouTubeFields = isYouTube ? `
- title: click-worthy YouTube title under 70 chars (include a number or power word, end with #shorts)
- description: full YouTube description with links to stackstreak-two.vercel.app and /inflation /recession-proof /emergency-fund, 3-5 hashtags at bottom
- thumbnail_text: 3-5 words max for thumbnail text overlay (high contrast, bold, curiosity-driven)` : "";

  const prompt = `You are a viral short-form video scriptwriter specializing in personal finance content. Generate a ${duration}-second ${platform} script about '${topic}' for an app called StackStreak (a free savings challenge app — stackstreak-two.vercel.app).

Hook style: ${hookStyle}
Platform tone: ${platformTone}

Return ONLY a valid JSON object with these keys:
- hook: opening 1-2 sentences (stop the scroll)
- story: problem/setup (2-3 sentences)
- value: main tip or content (3-5 sentences, specific and actionable)
- cta: call to action for StackStreak (1-2 sentences)
- caption: social media caption (2-3 sentences + emojis)
- hashtags: array of ${isYouTube ? "5" : "15"} relevant hashtags${extraYouTubeFields}

Conversational tone, real specific numbers, no corporate speak. Return ONLY valid JSON, no markdown.`;

  try {
    const text = await geminiGenerate(prompt, 1024);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json(FALLBACK_SCRIPT);
    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(FALLBACK_SCRIPT);
  }
}
