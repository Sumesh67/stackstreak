import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN;
const FB_PROFILE = process.env.BUFFER_FACEBOOK_PROFILE_ID;
const IG_PROFILE = process.env.BUFFER_INSTAGRAM_PROFILE_ID;

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://stackstreak-two.vercel.app";

const TOPIC_HASHTAGS: Record<string, string[]> = {
  inflation: ["#inflation", "#savemoney", "#personalfinance", "#moneytips", "#costoflivingincrease", "#budgeting", "#stackstreak", "#financialfreedom", "#moneyhacks", "#savingmoney"],
  groceries: ["#grocerysavings", "#savemoney", "#mealprep", "#frugalliving", "#budgetmeals", "#groceryhacks", "#stackstreak", "#personalfinance", "#moneytips", "#savingmoney"],
  subscriptions: ["#cancelsubscriptions", "#savemoney", "#moneysaving", "#personalfinance", "#budgeting", "#frugalliving", "#stackstreak", "#moneytips", "#financialfreedom", "#savingmoney"],
  bills: ["#billsavings", "#savemoney", "#reducebills", "#personalfinance", "#moneyhacks", "#frugalliving", "#stackstreak", "#budgeting", "#moneytips", "#financialfreedom"],
  food: ["#mealprep", "#savemoney", "#cookathome", "#budgetmeals", "#nodoorDash", "#frugalliving", "#stackstreak", "#personalfinance", "#moneytips", "#savingmoney"],
  savings: ["#savingschallenge", "#52weekchallenge", "#savemoney", "#personalfinance", "#emergencyfund", "#financialfreedom", "#stackstreak", "#moneytips", "#savingsgoals", "#savingmoney"],
  default: ["#savemoney", "#personalfinance", "#moneytips", "#frugalliving", "#budgeting", "#financialfreedom", "#stackstreak", "#moneyhacks", "#savingmoney", "#savingschallenge"],
};

function buildCaption(post: { headline: string; body: string; topic: string }) {
  const hashtags = (TOPIC_HASHTAGS[post.topic] || TOPIC_HASHTAGS.default).join(" ");
  return `${post.headline}\n\n${post.body}\n\n💰 Save more at stackstreak-two.vercel.app\n\n${hashtags}`;
}

function buildImageUrl(post: {
  template?: string;
  headline: string;
  body: string;
  stat?: string;
  topic?: string;
}) {
  const params = new URLSearchParams({
    template: post.template || "tip",
    headline: post.headline,
    body: post.body,
    stat: post.stat || "",
    topic: post.topic || "savings",
  });
  return `${APP_URL}/api/generate-image?${params.toString()}`;
}

async function postToBuffer(
  profileId: string,
  text: string,
  scheduledAt?: number,
  imageUrl?: string
) {
  const params: Record<string, string> = {
    "profile_ids[]": profileId,
    text,
    now: scheduledAt ? "false" : "true",
  };

  if (scheduledAt) {
    params["scheduled_at"] = new Date(scheduledAt * 1000).toISOString();
  }

  if (imageUrl) {
    params["media[photo]"] = imageUrl;
    params["media[thumbnail]"] = imageUrl;
  }

  const res = await fetch(
    `https://api.bufferapp.com/1/updates/create.json?access_token=${BUFFER_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params),
    }
  );

  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const { post, platforms, scheduleNow } = await req.json();

    if (!BUFFER_TOKEN) {
      return NextResponse.json({ error: "Buffer not configured" }, { status: 503 });
    }

    const caption = buildCaption(post);
    const imageUrl = buildImageUrl(post);
    const results = [];

    if (platforms === "Both" || platforms === "Facebook") {
      const fbResult = await postToBuffer(FB_PROFILE!, caption, undefined, imageUrl);
      results.push({ platform: "Facebook", success: !fbResult.error, data: fbResult });
    }

    if (platforms === "Both" || platforms === "Instagram") {
      const igResult = await postToBuffer(IG_PROFILE!, caption, undefined, imageUrl);
      results.push({ platform: "Instagram", success: !igResult.error, data: igResult });
    }

    return NextResponse.json({ success: true, results, caption, imageUrl });
  } catch (error) {
    console.error("Buffer post error:", error);
    return NextResponse.json({ error: "Failed to post" }, { status: 500 });
  }
}

// GET — auto-post daily content (called by cron)
export async function GET() {
  try {
    if (!BUFFER_TOKEN) return NextResponse.json({ error: "Buffer not configured" });

    // Generate a post using Gemini
    const geminiRes = await fetch(
      `${APP_URL}/api/generate-posts`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 1 }),
      }
    );

    const posts = await geminiRes.json();
    const post = posts[0];
    const caption = buildCaption(post);
    const imageUrl = buildImageUrl(post);

    // Post to both platforms with image
    const fbResult = await postToBuffer(FB_PROFILE!, caption, undefined, imageUrl);
    const igResult = await postToBuffer(IG_PROFILE!, caption, undefined, imageUrl);

    return NextResponse.json({
      success: true,
      posted: {
        caption,
        imageUrl,
        facebook: !fbResult.error,
        instagram: !igResult.error,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
