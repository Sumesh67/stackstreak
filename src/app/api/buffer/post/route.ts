import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN;
const FB_CHANNEL_ID = process.env.BUFFER_FACEBOOK_PROFILE_ID;
const IG_CHANNEL_ID = process.env.BUFFER_INSTAGRAM_PROFILE_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stackstreak-two.vercel.app";

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

function buildImageUrl(post: { template?: string; headline: string; body: string; stat?: string; topic?: string }) {
  const params = new URLSearchParams({
    template: post.template || "tip",
    headline: post.headline,
    body: post.body,
    stat: post.stat || "",
    topic: post.topic || "savings",
  });
  return `${APP_URL}/api/generate-image?${params.toString()}`;
}

async function postToBufferGraphQL(channelId: string, text: string, schedulingType: "automatic" | "notification" = "automatic") {
  const mutation = {
    query: `mutation CreatePost($input: CreatePostInput!) { 
      createPost(input: $input) { 
        ... on PostActionSuccess { post { id status } } 
      } 
    }`,
    variables: {
      input: {
        channelId,
        schedulingType,
        mode: "addToQueue",
        text,
      }
    }
  };

  const res = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${BUFFER_TOKEN}`,
    },
    body: JSON.stringify(mutation),
  });

  const data = await res.json();
  if (data.errors) {
    return { error: data.errors[0]?.message || "Unknown error" };
  }
  return { success: true, data: data.data?.createPost };
}

export async function POST(req: NextRequest) {
  try {
    const { post, platforms } = await req.json();

    if (!BUFFER_TOKEN) {
      return NextResponse.json({ error: "Buffer not configured" }, { status: 503 });
    }

    const caption = buildCaption(post);
    const imageUrl = buildImageUrl(post);
    const results = [];

    // Facebook: posts automatically to queue
    if (platforms === "Both" || platforms === "Facebook") {
      const fbResult = await postToBufferGraphQL(FB_CHANNEL_ID!, caption, "automatic");
      results.push({ platform: "Facebook", success: fbResult.success, data: fbResult });
    }

    // Instagram: uses notification scheduling (Buffer sends push to phone for one-tap posting)
    if (platforms === "Both" || platforms === "Instagram") {
      const igCaption = `${caption}\n\n📸 Download image: ${imageUrl}`;
      const igResult = await postToBufferGraphQL(IG_CHANNEL_ID!, igCaption, "notification");
      results.push({
        platform: "Instagram",
        success: igResult.success,
        note: "Check Buffer app on your phone — tap the notification to post with image",
        data: igResult
      });
    }

    return NextResponse.json({ success: true, results, caption, imageUrl });
  } catch (error) {
    console.error("Buffer post error:", error);
    return NextResponse.json({ error: "Failed to post" }, { status: 500 });
  }
}

// GET — daily auto-post (can be called by a cron job)
export async function GET() {
  try {
    if (!BUFFER_TOKEN) return NextResponse.json({ error: "Buffer not configured" });

    const geminiRes = await fetch(`${APP_URL}/api/generate-posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days: 1 }),
    });

    const posts = await geminiRes.json();
    const post = posts[0];
    const caption = buildCaption(post);
    const imageUrl = buildImageUrl(post);

    const fbResult = await postToBufferGraphQL(FB_CHANNEL_ID!, caption, "automatic");
    const igCaption = `${caption}\n\n📸 Image: ${imageUrl}`;
    const igResult = await postToBufferGraphQL(IG_CHANNEL_ID!, igCaption, "notification");

    return NextResponse.json({
      success: true,
      posted: { caption, imageUrl, facebook: fbResult.success, instagram: igResult.success },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
