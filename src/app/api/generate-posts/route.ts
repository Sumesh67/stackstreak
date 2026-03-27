import { NextRequest, NextResponse } from "next/server";

const FALLBACK_POSTS = [
  {
    day: 1,
    template: "stat",
    headline: "Inflation Added $347 to Your Monthly Bills",
    stat: "$347",
    body: "That's how much more the average American pays monthly vs 2022. The good news? Most of it is cuttable with a few habit changes.",
    platform: "Both",
    bestTime: "7:00 PM",
    topic: "inflation",
  },
  {
    day: 2,
    template: "tip",
    headline: "Cancel 3 Subscriptions Today",
    stat: "$67",
    body: "The average American pays $67/month on forgotten subscriptions. Open your bank app right now and highlight every recurring charge.",
    platform: "Instagram",
    bestTime: "6:30 PM",
    topic: "subscriptions",
  },
  {
    day: 3,
    template: "alert",
    headline: "Groceries Cost 25% More Than 2022",
    stat: "25%",
    body: "Switch to store brands on just 5 items and save $40-80/month. The ingredients are identical — you're just paying for packaging.",
    platform: "Facebook",
    bestTime: "5:00 PM",
    topic: "groceries",
  },
  {
    day: 4,
    template: "challenge",
    headline: "Start the 52-Week Savings Challenge",
    stat: "$1,378",
    body: "Save $1 in week 1, $2 in week 2, up to $52 in week 52. End the year with $1,378 saved — starting with just one dollar.",
    platform: "Both",
    bestTime: "7:30 PM",
    topic: "savings",
  },
  {
    day: 5,
    template: "tip",
    headline: "Delete DoorDash for 30 Days",
    stat: "$150",
    body: "Food delivery apps add 40-60% to your meal cost with fees and tips. Cutting delivery saves the average person $150/month.",
    platform: "Instagram",
    bestTime: "6:00 PM",
    topic: "food",
  },
  {
    day: 6,
    template: "stat",
    headline: "57% of Americans Can't Cover $400 Emergency",
    stat: "57%",
    body: "An emergency fund isn't a luxury — it's your financial armor. Even $25/week builds $1,300 in a year. Start today.",
    platform: "Both",
    bestTime: "8:00 PM",
    topic: "savings",
  },
  {
    day: 7,
    template: "tip",
    headline: "Call Your Internet Provider Right Now",
    stat: "$30",
    body: "Say: 'I'm thinking of switching to a competitor.' Most companies have retention deals that save $20-50/month — they just don't advertise them.",
    platform: "Facebook",
    bestTime: "5:30 PM",
    topic: "bills",
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const days = body.days ?? 7;
    const focus = body.focus ?? "";

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(FALLBACK_POSTS);
    }

    const prompt = `Generate ${days} days of social media post content for StackStreak, a free savings challenge app (stackstreak-two.vercel.app).${focus ? ` Focus area: ${focus}.` : ""}

Each post should cover a DIFFERENT money-saving topic that affects most Americans right now (inflation, groceries, subscriptions, utility bills, food delivery, emergency funds, shopping habits).

Return a JSON array of ${days} objects, each with:
- day: number (1-${days})
- template: one of "tip" | "stat" | "challenge" | "alert" | "story"
- headline: bold attention-grabbing headline (under 8 words)
- stat: a specific number or percentage (e.g. "$347", "43%", "$1,378")
- body: 1-2 sentences of actionable advice, conversational tone
- platform: "Instagram" | "Facebook" | "Both"
- bestTime: best time to post (e.g. "7:00 PM")
- topic: one-word category (groceries/subscriptions/bills/food/savings/mindset/shopping)

Make each post DIFFERENT topic. Use real, specific numbers. Conversational tone — like advice from a smart friend, not a corporation. Each should make people think "wow I didn't know that" or "I need to do this."

Return ONLY valid JSON array, no markdown.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status);
      return NextResponse.json(FALLBACK_POSTS);
    }

    const aiData = await response.json();
    const text = aiData?.content?.[0]?.text ?? "";

    try {
      const posts = JSON.parse(text);
      if (Array.isArray(posts)) {
        return NextResponse.json(posts);
      }
    } catch {
      console.error("Failed to parse AI response as JSON");
    }

    return NextResponse.json(FALLBACK_POSTS);
  } catch (err) {
    console.error("generate-posts error:", err);
    return NextResponse.json(FALLBACK_POSTS);
  }
}
