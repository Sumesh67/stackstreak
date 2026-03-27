import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FALLBACK_SCRIPTS: Record<string, Record<string, unknown>> = {
  default: {
    hook: "You're losing $400 every single month — and you don't even realize it. 💸",
    story: "Inflation hit 20% since 2020. Your paycheck stayed flat. That gap? That's money quietly disappearing from your wallet every time you swipe your card.",
    value: "Here's what I did: I downloaded StackStreak and started ONE savings challenge. The 52-week challenge starts with just $1. Day one, you save $1. Week 52, you've saved $1,378. It's not about the amount — it's about building the HABIT. I also cancelled 3 subscriptions I forgot about ($47/month gone), switched to ALDI for groceries (saves me $80/month), and meal prepped on Sundays. In 90 days, I saved over $800.",
    cta: "Download StackStreak free at stackstreak-two.vercel.app. It's 100% free, no catch. Start your streak today.",
    caption: "POV: You just discovered you've been losing $400/month without knowing it 😤 Here's the exact system I used to save $800 in 90 days using StackStreak (free app!). Link in bio to get started 💰",
    hashtags: ["#savingmoney", "#personalfinance", "#moneytips", "#frugalliving", "#savingchallenge", "#financialfreedom", "#budgeting", "#moneymanagement", "#savingsgoals", "#moneyhacks", "#inflation", "#stackstreak", "#moneytok", "#financetok", "#savingsapp"],
  }
};

const PLATFORM_TONES: Record<string, string> = {
  TikTok: "Use Gen Z/millennial slang, fast-paced, very casual, trend-aware. Short punchy sentences.",
  "Instagram Reels": "Slightly more polished but still relatable. Inspirational tone. Use emojis freely.",
  "Facebook Reels": "Conversational, slightly older audience (25-45). More detail-oriented. Warmer tone.",
};

export async function POST(req: NextRequest) {
  const { platform, topic, duration, hookStyle } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(FALLBACK_SCRIPTS.default);
  }

  const platformTone = PLATFORM_TONES[platform] || PLATFORM_TONES["TikTok"];

  const prompt = `You are a viral short-form video scriptwriter specializing in personal finance content. Generate a ${duration}-second ${platform} script about '${topic}' for an app called StackStreak (a free savings challenge app that helps people save money with streaks and gamification — stackstreak-two.vercel.app).

Hook style: ${hookStyle}
Platform tone: ${platformTone}

Format your response as JSON with these exact keys:
- hook: the opening 1-2 sentences (must stop the scroll)
- story: the problem/setup (2-3 sentences)
- value: the main tip or content (3-5 sentences, specific and actionable)
- cta: call to action for StackStreak (1-2 sentences)
- caption: social media caption for ${platform} (2-3 sentences + emojis)
- hashtags: array of 15 relevant hashtags for ${platform}

Make it conversational, relatable, specific. No corporate speak. Talk like a real person who figured something out and wants to share it. Return ONLY valid JSON, no markdown.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(FALLBACK_SCRIPTS.default);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json(FALLBACK_SCRIPTS.default);

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(FALLBACK_SCRIPTS.default);
  }
}
