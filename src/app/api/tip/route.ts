import { NextRequest, NextResponse } from "next/server";
import { geminiGenerate } from "@/lib/gemini";

export const dynamic = "force-dynamic";

const FALLBACK_TIPS = [
  "Every dollar saved today is a dollar working for your future. Small wins add up to big results! 💪",
  "You're building a habit that 80% of people never develop. Each check-in is an investment in yourself.",
  "Saving money isn't about restriction — it's about freedom. Every dollar saved is a choice for your future self.",
  "The secret to saving money? Automate it, celebrate it, repeat it. You're doing all three.",
  "Think of your streak as a muscle. Every day you check in, you make it stronger. Keep flexing! 🔥",
  "Financial stress is real. But so is the peace that comes from knowing you have a cushion. Keep building.",
  "In a world of rising prices, every dollar you save is a small act of financial resistance. Keep going.",
  "Your future self is watching you make this decision. Make them proud. ⭐",
];

export async function POST(req: NextRequest) {
  try {
    const { streak, totalSaved } = await req.json();

    const prompt = `You are a warm, encouraging financial coach for a savings app called StackStreak. 
Generate ONE short, motivating daily tip (2-3 sentences max) for a user. 
${streak ? `Their current streak is ${streak} days.` : ""}
${totalSaved ? `They've saved $${totalSaved} so far.` : ""}
Context: It's 2026, prices are high due to inflation and tariffs, people are stressed about money.
Make it specific, real, and encouraging. No generic advice. End with an emoji.
Just output the tip text, nothing else.`;

    const tip = await geminiGenerate(prompt, 150);
    return NextResponse.json({ tip: tip.trim() });
  } catch {
    const tip = FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
    return NextResponse.json({ tip });
  }
}
