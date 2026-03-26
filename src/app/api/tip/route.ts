import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FALLBACK_TIPS = [
  "Every dollar saved today is a dollar working for your future. Small wins add up to big results! 💪",
  "You're building a habit that 80% of people never develop. Each check-in is an investment in yourself.",
  "Saving money isn't about restriction — it's about freedom. Every dollar saved is a choice you're making for your future self.",
  "The secret to saving money? Automate it, celebrate it, repeat it. You're doing all three.",
  "Think of your streak as a muscle. Every day you check in, you make it stronger. Keep flexing! 🔥",
  "Financial stress is real. But so is the peace that comes from knowing you have a cushion. Keep building.",
  "In a world of rising prices, every dollar you save is a small act of financial resistance. Keep going.",
  "Your future self is watching you make this decision. Make them proud.",
];

export async function POST(req: NextRequest) {
  try {
    const { userId, streak, totalSaved } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      const tip = FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
      return NextResponse.json({ tip });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 150,
      messages: [{
        role: "user",
        content: `You are a warm, encouraging financial coach for a savings app called StackStreak. 
        Generate ONE short, motivating daily tip (2-3 sentences max) for a user. 
        ${streak ? `Their current streak is ${streak} days.` : ""}
        ${totalSaved ? `They've saved $${totalSaved} so far.` : ""}
        Context: It's 2026, prices are high due to inflation and tariffs, people are stressed about money.
        Make it specific, real, and encouraging. No generic advice. End with an emoji.
        Just output the tip text, nothing else.`
      }]
    });

    const tip = message.content[0].type === "text" ? message.content[0].text : FALLBACK_TIPS[0];
    
    // Log tip to DB if userId provided (fire and forget)
    if (userId) {
      // Could store to supabase here - skipping for MVP
    }

    return NextResponse.json({ tip });
  } catch {
    const tip = FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
    return NextResponse.json({ tip });
  }
}
