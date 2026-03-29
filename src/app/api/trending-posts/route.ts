import { NextRequest, NextResponse } from "next/server";
import { geminiGenerate } from "@/lib/gemini";

export const dynamic = "force-dynamic";

const FALLBACK_POSTS = [
  { day: 1, template: "alert", headline: "Tariffs Are Raising Prices at the Store", stat: "+15%", body: "New tariffs on imports are pushing everyday prices higher. Switch to domestically made products and store brands to dodge the increases.", platform: "Both", bestTime: "7:00 PM", topic: "inflation", trendSource: "Today's trade news" },
  { day: 2, template: "stat", headline: "Credit Card Debt Hit a Record $1.21 Trillion", stat: "$1.21T", body: "Americans are drowning in credit card debt at 20%+ interest. Pay more than the minimum — even $20 extra/month saves hundreds in interest.", platform: "Both", bestTime: "6:30 PM", topic: "debt", trendSource: "Consumer finance news" },
  { day: 3, template: "tip", headline: "Grocery Prices Still Rising in 2026", stat: "8%", body: "Grocery inflation is still outpacing wages. Meal planning + store brands + cashback apps (Ibotta/Fetch) can claw back $80-150/month.", platform: "Facebook", bestTime: "5:00 PM", topic: "groceries", trendSource: "Consumer price data" },
  { day: 4, template: "challenge", headline: "Start an Emergency Fund This Week", stat: "$1,000", body: "With economic uncertainty rising, financial experts say a $1,000 emergency fund is your first priority. Save $25/day for 40 days.", platform: "Both", bestTime: "7:30 PM", topic: "savings", trendSource: "Financial planning trends" },
  { day: 5, template: "tip", headline: "Housing Costs Eat 40% of Income for Many", stat: "40%", body: "If rent is eating 40%+ of your take-home pay, it's time to cut elsewhere aggressively — subscriptions, dining, and delivery add up fast.", platform: "Instagram", bestTime: "6:00 PM", topic: "housing", trendSource: "Housing market news" },
  { day: 6, template: "stat", headline: "The Average Car Payment Is Now $735/Month", stat: "$735", body: "Car costs are crushing budgets. If you're car shopping, buy used (2-3 years old) — you avoid the steepest depreciation and save $200+/month.", platform: "Both", bestTime: "8:00 PM", topic: "transport", trendSource: "Auto industry data" },
  { day: 7, template: "tip", headline: "Your Utility Bill Has a Secret Discount", stat: "$30", body: "Most utility companies offer low-income assistance programs AND budget billing to smooth out seasonal spikes. Call and ask — most people never do.", platform: "Facebook", bestTime: "5:30 PM", topic: "bills", trendSource: "Consumer advocacy news" },
];

function parseRSSItems(xml: string): { title: string; description: string }[] {
  const items: { title: string; description: string }[] = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const match of itemMatches) {
    const content = match[1];
    const titleMatch = content.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || content.match(/<title>([\s\S]*?)<\/title>/);
    const descMatch = content.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || content.match(/<description>([\s\S]*?)<\/description>/);
    if (titleMatch?.[1]?.trim()) {
      items.push({
        title: titleMatch[1].trim().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
        description: descMatch ? descMatch[1].replace(/<[^>]*>/g, "").trim().substring(0, 200) : "",
      });
    }
    if (items.length >= 10) break;
  }
  return items;
}

async function fetchRSS(url: string): Promise<{ title: string; description: string }[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const text = await res.text();
    return parseRSSItems(text);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  try {
    const feeds = [
      "https://feeds.marketwatch.com/marketwatch/personal-finance/",
      "https://rss.nytimes.com/services/xml/rss/nyt/YourMoney.xml",
      "https://feeds.npr.org/1017/rss.xml",
      "https://www.consumerfinance.gov/about-us/blog/feed/",
    ];

    const results = await Promise.allSettled(feeds.map(fetchRSS));
    const allItems: { title: string; description: string }[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") allItems.push(...result.value);
    }
    const headlines = allItems.slice(0, 12);

    if (headlines.length === 0 || !process.env.GEMINI_API_KEY) {
      return NextResponse.json(FALLBACK_POSTS);
    }

    const prompt = `You are a social media content strategist for StackStreak, a free savings challenge app (stackstreak-two.vercel.app).

Here are today's trending finance/money headlines:
${headlines.map((h, i) => `${i + 1}. ${h.title}`).join("\n")}

Create 7 social media post ideas inspired by these trends. Connect each to practical money-saving advice for average Americans worried about inflation.

Return a JSON array of exactly 7 objects:
- day: number 1-7
- template: "tip" | "stat" | "challenge" | "alert" | "story"
- headline: attention-grabbing headline under 8 words
- stat: specific number/percentage/dollar amount
- body: 1-2 sentences of actionable advice, conversational tone
- platform: "Both"
- bestTime: best posting time (e.g. "7:00 PM")
- topic: one-word category
- trendSource: brief 3-5 word reference to the inspiring headline

Return ONLY valid JSON array, no markdown.`;

    const text = await geminiGenerate(prompt, 2048);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return NextResponse.json(FALLBACK_POSTS);
    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(FALLBACK_POSTS);
  }
}
