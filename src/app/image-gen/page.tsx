"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState, useCallback } from "react";
import { Flame, Download, ArrowLeft, Image as ImageIcon, Sliders, Sparkles, Clock, RefreshCw } from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type PostData = {
  day: number;
  template: "tip" | "stat" | "challenge" | "alert" | "story";
  headline: string;
  stat: string;
  body: string;
  platform: string;
  bestTime: string;
  topic: string;
  trendSource?: string;
};

type TemplateId = "tip" | "stat" | "challenge" | "inflation" | "story";
type ColorScheme = "orange" | "dark" | "red" | "green";
type SizeMode = "square" | "story";

interface TemplateFields {
  headline: string;
  body: string;
  stat?: string;
  statLabel?: string;
  week?: string;
  amount?: string;
  mainText?: string;
}

interface Template {
  id: TemplateId;
  label: string;
  emoji: string;
  description: string;
  defaultSize: SizeMode;
  defaults: TemplateFields;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TEMPLATES: Template[] = [
  {
    id: "tip",
    label: "Tip of the Day",
    emoji: "💡",
    description: "Orange gradient — perfect for Instagram & Facebook",
    defaultSize: "square",
    defaults: {
      headline: "Stop buying name brands",
      body: "Store brands are made by the same manufacturers 80% of the time. Try switching just 3 items this week.",
    },
  },
  {
    id: "stat",
    label: "Did You Know?",
    emoji: "📊",
    description: "Dark card with giant stat — high-impact & shareable",
    defaultSize: "square",
    defaults: {
      headline: "DID YOU KNOW?",
      stat: "$347",
      statLabel: "extra per month",
      body: "That's how much more inflation is costing the average family. Fight back with StackStreak.",
    },
  },
  {
    id: "challenge",
    label: "Savings Challenge",
    emoji: "🏆",
    description: "Dark + orange — track your weekly savings goal",
    defaultSize: "square",
    defaults: {
      week: "Week 4",
      amount: "$10",
      body: "You should have $10 saved in your 52-week challenge. Are you on track? 🔥",
      headline: "Savings Challenge",
    },
  },
  {
    id: "inflation",
    label: "Inflation Alert",
    emoji: "🚨",
    description: "Red/orange warning — great for urgent posts",
    defaultSize: "square",
    defaults: {
      headline: "Groceries are 25% more expensive than 2022",
      body: "Here's how to cut your grocery bill in half this month.",
    },
  },
  {
    id: "story",
    label: "Story / Reel",
    emoji: "📱",
    description: "Vertical 9:16 — for Stories, Reels & TikTok",
    defaultSize: "story",
    defaults: {
      mainText: "Inflation added $4,000 to your yearly bills. Here's how to fight back →",
      headline: "",
      body: "",
    },
  },
];

const COLOR_SCHEMES: { id: ColorScheme; label: string; emoji: string }[] = [
  { id: "orange", label: "Orange Fire", emoji: "🔥" },
  { id: "dark", label: "Dark Mode", emoji: "🌑" },
  { id: "red", label: "Red Alert", emoji: "🚨" },
  { id: "green", label: "Green Savings", emoji: "💚" },
];

const CANVAS_SIZES: Record<SizeMode, { w: number; h: number }> = {
  square: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
};

// ─── Helper functions ─────────────────────────────────────────────────────────

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ─── Color scheme palettes ────────────────────────────────────────────────────

const PALETTES: Record<
  ColorScheme,
  { bg1: string; bg2: string; accent: string; accent2: string; text: string; sub: string }
> = {
  orange: {
    bg1: "#f97316",
    bg2: "#ea580c",
    accent: "#ffffff",
    accent2: "#fed7aa",
    text: "#ffffff",
    sub: "rgba(255,255,255,0.85)",
  },
  dark: {
    bg1: "#0a0a0f",
    bg2: "#111118",
    accent: "#f97316",
    accent2: "#ea580c",
    text: "#ffffff",
    sub: "#9ca3af",
  },
  red: {
    bg1: "#7f1d1d",
    bg2: "#450a0a",
    accent: "#fca5a5",
    accent2: "#f97316",
    text: "#ffffff",
    sub: "#fca5a5",
  },
  green: {
    bg1: "#052e16",
    bg2: "#14532d",
    accent: "#4ade80",
    accent2: "#22c55e",
    text: "#ffffff",
    sub: "#86efac",
  },
};

// ─── Canvas draw functions per template ───────────────────────────────────────

function drawTipCard(
  ctx: CanvasRenderingContext2D,
  fields: TemplateFields,
  palette: (typeof PALETTES)[ColorScheme],
  w: number,
  h: number,
  fontSize: number
) {
  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, palette.bg1);
  grad.addColorStop(1, palette.bg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Decorative circles
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(w * 0.9, h * 0.15, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w * 0.05, h * 0.85, 160, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const pad = 80;

  // Logo row
  ctx.font = `bold ${Math.round(fontSize * 0.6)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.textAlign = "left";
  ctx.fillText("🔥 StackStreak", pad, pad + 24);

  // "TIP OF THE DAY" label
  ctx.font = `600 ${Math.round(fontSize * 0.55)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("TIP OF THE DAY", pad, pad + 90);

  // Divider line
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(pad, pad + 110);
  ctx.lineTo(pad + 160, pad + 110);
  ctx.stroke();

  // Headline
  const headlineSize = Math.round(fontSize * 1.45);
  ctx.font = `900 ${headlineSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  const headlineY = wrapText(ctx, fields.headline || "Your headline here", pad, h * 0.38, w - pad * 2, headlineSize * 1.2);

  // Body text
  ctx.font = `400 ${Math.round(fontSize * 0.85)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  wrapText(ctx, fields.body || "Your body text here.", pad, headlineY + 20, w - pad * 2, Math.round(fontSize * 0.85) * 1.5);

  // Bottom pill badge
  const badgeText = "stackstreak-two.vercel.app";
  ctx.font = `600 ${Math.round(fontSize * 0.6)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  const badgeW = ctx.measureText(badgeText).width + 60;
  const badgeH = Math.round(fontSize * 0.9);
  const badgeX = w / 2 - badgeW / 2;
  const badgeY = h - 100;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(badgeText, w / 2, badgeY + badgeH * 0.65);
}

function drawStatCard(
  ctx: CanvasRenderingContext2D,
  fields: TemplateFields,
  palette: (typeof PALETTES)[ColorScheme],
  w: number,
  h: number,
  fontSize: number
) {
  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, palette.bg1);
  grad.addColorStop(1, palette.bg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const pad = 70;

  // Accent border glow
  ctx.save();
  ctx.shadowColor = palette.accent;
  ctx.shadowBlur = 60;
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 8;
  drawRoundedRect(ctx, 30, 30, w - 60, h - 60, 40);
  ctx.stroke();
  ctx.restore();

  // Inner border (clean)
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.35;
  drawRoundedRect(ctx, 30, 30, w - 60, h - 60, 40);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // "DID YOU KNOW?" label
  ctx.font = `700 ${Math.round(fontSize * 0.65)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.accent;
  ctx.textAlign = "center";
  ctx.fillText("DID YOU KNOW?", w / 2, pad + 60);

  // Decorative dots
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(w / 2 - 24 + i * 24, pad + 95, 5, 0, Math.PI * 2);
    ctx.fillStyle = palette.accent;
    ctx.globalAlpha = 0.4 + i * 0.2;
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Giant stat number
  const statSize = Math.round(fontSize * 3.5);
  ctx.font = `900 ${statSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.text;
  ctx.textAlign = "center";
  ctx.fillText(fields.stat || "$347", w / 2, h / 2 + statSize * 0.35);

  // Stat label below
  ctx.font = `500 ${Math.round(fontSize * 0.9)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.accent;
  ctx.fillText(fields.statLabel || "extra per month", w / 2, h / 2 + statSize * 0.7);

  // Body text
  const bodySize = Math.round(fontSize * 0.75);
  ctx.font = `400 ${bodySize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.sub;
  wrapText(ctx, fields.body || "Body text here.", pad + 20, h * 0.73, w - (pad + 20) * 2, bodySize * 1.55);

  // Bottom branding
  ctx.font = `700 ${Math.round(fontSize * 0.6)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.accent;
  ctx.textAlign = "center";
  ctx.fillText("🔥 StackStreak  ·  stackstreak-two.vercel.app", w / 2, h - 60);
}

function drawChallengeCard(
  ctx: CanvasRenderingContext2D,
  fields: TemplateFields,
  palette: (typeof PALETTES)[ColorScheme],
  w: number,
  h: number,
  fontSize: number
) {
  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, palette.bg1);
  grad.addColorStop(1, palette.bg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Background accent shape
  ctx.save();
  ctx.globalAlpha = 0.08;
  const shapeGrad = ctx.createLinearGradient(0, 0, w, h);
  shapeGrad.addColorStop(0, palette.accent);
  shapeGrad.addColorStop(1, palette.accent2);
  ctx.fillStyle = shapeGrad;
  ctx.beginPath();
  ctx.moveTo(w * 0.4, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, h * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const pad = 80;

  // Logo
  ctx.font = `700 ${Math.round(fontSize * 0.6)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.accent;
  ctx.textAlign = "left";
  ctx.fillText("🔥 StackStreak", pad, pad + 24);

  // Week badge
  const week = fields.week || "Week 4";
  ctx.font = `700 ${Math.round(fontSize * 0.7)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  const badgeW = ctx.measureText(week).width + 50;
  const badgeH = Math.round(fontSize);
  drawRoundedRect(ctx, pad, h * 0.25, badgeW, badgeH, 14);
  ctx.fillStyle = palette.accent;
  ctx.fill();
  ctx.fillStyle = palette.bg1 === "#0a0a0f" ? "#ffffff" : palette.bg1;
  ctx.textAlign = "left";
  ctx.fillText(week, pad + 25, h * 0.25 + badgeH * 0.68);

  // Title
  ctx.font = `900 ${Math.round(fontSize * 1.3)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.text;
  ctx.textAlign = "left";
  ctx.fillText("SAVINGS CHALLENGE", pad, h * 0.25 + badgeH + 70);

  // "This week: save $X"
  const amount = fields.amount || "$10";
  ctx.font = `700 ${Math.round(fontSize * 1.7)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.accent;
  ctx.fillText(`This week: save ${amount}`, pad, h * 0.5);

  // Progress bar background
  const barY = h * 0.57;
  const barW = w - pad * 2;
  const barH = 28;
  drawRoundedRect(ctx, pad, barY, barW, barH, barH / 2);
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fill();

  // Progress fill (example ~30%)
  const progressFill = barW * 0.3;
  drawRoundedRect(ctx, pad, barY, progressFill, barH, barH / 2);
  const progGrad = ctx.createLinearGradient(pad, 0, pad + progressFill, 0);
  progGrad.addColorStop(0, palette.accent);
  progGrad.addColorStop(1, palette.accent2);
  ctx.fillStyle = progGrad;
  ctx.fill();

  // Progress label
  ctx.font = `500 ${Math.round(fontSize * 0.6)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.sub;
  ctx.textAlign = "left";
  ctx.fillText("Week 4 of 52", pad, barY + barH + 35);
  ctx.textAlign = "right";
  ctx.fillText("$1,378 goal", w - pad, barY + barH + 35);

  // Body text
  const bodySize = Math.round(fontSize * 0.8);
  ctx.font = `400 ${bodySize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.sub;
  ctx.textAlign = "left";
  wrapText(ctx, fields.body || "", pad, h * 0.7, w - pad * 2, bodySize * 1.55);

  // Bottom branding
  ctx.font = `700 ${Math.round(fontSize * 0.6)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.accent;
  ctx.textAlign = "center";
  ctx.fillText("stackstreak-two.vercel.app  ·  Free Savings App 🔥", w / 2, h - 60);
}

function drawInflationCard(
  ctx: CanvasRenderingContext2D,
  fields: TemplateFields,
  palette: (typeof PALETTES)[ColorScheme],
  w: number,
  h: number,
  fontSize: number
) {
  // Background — keep intense even if palette changes
  const bg1 = palette.bg1 === "#f97316" ? "#7f1d1d" : palette.bg1;
  const bg2 = palette.bg2 === "#ea580c" ? "#1c0505" : palette.bg2;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, bg1);
  grad.addColorStop(1, bg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Animated-feel diagonal stripe accents
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = palette.accent;
  for (let i = -3; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 200 - 100, 0);
    ctx.lineTo(i * 200 + 100, 0);
    ctx.lineTo(i * 200 - 200 + h, h);
    ctx.lineTo(i * 200 - 400 + h, h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  const pad = 80;

  // 🚨 emoji big
  ctx.font = `${Math.round(fontSize * 2.5)}px -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("🚨", w / 2, h * 0.25);

  // ALERT label
  ctx.font = `800 ${Math.round(fontSize * 0.72)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "#fca5a5";
  ctx.fillText("INFLATION ALERT", w / 2, h * 0.35);

  // Headline
  const headlineSize = Math.round(fontSize * 1.25);
  ctx.font = `900 ${headlineSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "#ffffff";
  const headEndY = wrapText(
    ctx,
    fields.headline || "Groceries are 25% more expensive than 2022",
    pad,
    h * 0.43,
    w - pad * 2,
    headlineSize * 1.2
  );

  // Divider
  const divGrad = ctx.createLinearGradient(pad, 0, w - pad, 0);
  divGrad.addColorStop(0, "transparent");
  divGrad.addColorStop(0.5, "#fca5a5");
  divGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(pad, headEndY + 20);
  ctx.lineTo(w - pad, headEndY + 20);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Body
  const bodySize = Math.round(fontSize * 0.82);
  ctx.font = `400 ${bodySize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "#fca5a5";
  const bodyEndY = wrapText(
    ctx,
    fields.body || "Here's how to cut your grocery bill in half this month.",
    pad,
    headEndY + 50,
    w - pad * 2,
    bodySize * 1.5
  );

  // CTA pill
  const ctaText = "Fight back at stackstreak-two.vercel.app 🔥";
  ctx.font = `600 ${Math.round(fontSize * 0.6)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  const ctaW = Math.min(ctx.measureText(ctaText).width + 60, w - pad * 2);
  const ctaH = Math.round(fontSize * 0.95);
  const ctaX = w / 2 - ctaW / 2;
  const ctaY = Math.max(bodyEndY + 40, h - 200);
  drawRoundedRect(ctx, ctaX, ctaY, ctaW, ctaH, ctaH / 2);
  ctx.fillStyle = "#f97316";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(ctaText, w / 2, ctaY + ctaH * 0.66);

  // Bottom logo
  ctx.font = `700 ${Math.round(fontSize * 0.6)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText("🔥 StackStreak — Free Savings App", w / 2, h - 55);
}

function drawStoryCard(
  ctx: CanvasRenderingContext2D,
  fields: TemplateFields,
  palette: (typeof PALETTES)[ColorScheme],
  w: number,
  h: number,
  fontSize: number
) {
  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, palette.bg1);
  grad.addColorStop(0.5, palette.bg2);
  grad.addColorStop(1, palette.bg1);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Decorative orbs
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.arc(w * 0.8, h * 0.2, 350, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w * 0.1, h * 0.8, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const pad = 90;

  // Top branding
  ctx.font = `700 ${Math.round(fontSize * 0.7)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.accent;
  ctx.textAlign = "center";
  ctx.fillText("🔥 StackStreak", w / 2, 120);

  // Accent line top
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(pad, 145);
  ctx.lineTo(w - pad, 145);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Main text — huge and centered
  const mainSize = Math.round(fontSize * 1.55);
  ctx.font = `900 ${mainSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.text;
  ctx.textAlign = "center";

  // Center the text block vertically
  const mainTextContent = fields.mainText || "Inflation added $4,000 to your yearly bills. Here's how to fight back →";
  const words = mainTextContent.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  const maxW = w - pad * 2;
  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(test).width > maxW && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);

  const lineH = mainSize * 1.25;
  const blockH = lines.length * lineH;
  const startY = h / 2 - blockH / 2 + mainSize * 0.4;

  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, startY + i * lineH);
  });

  // Accent line bottom
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(pad, h - 200);
  ctx.lineTo(w - pad, h - 200);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Bottom branding block
  ctx.font = `600 ${Math.round(fontSize * 0.65)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.accent;
  ctx.textAlign = "center";
  ctx.fillText("Free savings app — build your streak", w / 2, h - 145);

  ctx.font = `500 ${Math.round(fontSize * 0.58)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = palette.sub;
  ctx.fillText("stackstreak-two.vercel.app", w / 2, h - 95);

  // Swipe up hint
  ctx.font = `500 ${Math.round(fontSize * 0.55)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillText("↑ Swipe Up", w / 2, h - 45);
}

// ─── Main draw dispatcher ─────────────────────────────────────────────────────

function drawCard(
  ctx: CanvasRenderingContext2D,
  templateId: TemplateId,
  fields: TemplateFields,
  colorScheme: ColorScheme,
  sizeMode: SizeMode,
  fontSize: number
) {
  const { w, h } = CANVAS_SIZES[sizeMode];
  const palette = PALETTES[colorScheme];

  ctx.clearRect(0, 0, w, h);

  switch (templateId) {
    case "tip":
      drawTipCard(ctx, fields, palette, w, h, fontSize);
      break;
    case "stat":
      drawStatCard(ctx, fields, palette, w, h, fontSize);
      break;
    case "challenge":
      drawChallengeCard(ctx, fields, palette, w, h, fontSize);
      break;
    case "inflation":
      drawInflationCard(ctx, fields, palette, w, h, fontSize);
      break;
    case "story":
      drawStoryCard(ctx, fields, palette, w, h, fontSize);
      break;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImageGenPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("tip");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("orange");
  const [sizeMode, setSizeMode] = useState<SizeMode>("square");
  const [fontSize, setFontSize] = useState(52);
  const [fields, setFields] = useState<TemplateFields>(TEMPLATES[0].defaults);
  const [weekPosts, setWeekPosts] = useState<PostData[] | null>(null);
  const [generatingWeek, setGeneratingWeek] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState<PostData[] | null>(null);
  const [generatingTrending, setGeneratingTrending] = useState(false);

  // When template changes, load defaults and reset size
  const handleTemplateChange = (t: Template) => {
    setSelectedTemplate(t.id);
    setFields(t.defaults);
    setSizeMode(t.defaultSize);
    if (t.id === "story") setFontSize(56);
    else setFontSize(52);
  };

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = CANVAS_SIZES[sizeMode];
    canvas.width = size.w;
    canvas.height = size.h;
    drawCard(ctx, selectedTemplate, fields, colorScheme, sizeMode, fontSize);
  }, [selectedTemplate, fields, colorScheme, sizeMode, fontSize]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `stackstreak-${selectedTemplate}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const updateField = (key: keyof TemplateFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const generateWeek = async () => {
    setGeneratingWeek(true);
    try {
      const res = await fetch("/api/generate-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 7 }),
      });
      const data = await res.json();
      setWeekPosts(data);
    } catch (err) {
      console.error("Failed to generate week:", err);
    } finally {
      setGeneratingWeek(false);
    }
  };

  const generateTrending = async () => {
    setGeneratingTrending(true);
    try {
      const res = await fetch("/api/trending-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setTrendingPosts(data);
    } catch (err) {
      console.error("Failed to fetch trending:", err);
    } finally {
      setGeneratingTrending(false);
    }
  };

  const usePost = (post: PostData) => {
    // Map post template to TemplateId (alert → inflation, others match)
    const templateMap: Record<string, TemplateId> = {
      tip: "tip",
      stat: "stat",
      challenge: "challenge",
      alert: "inflation",
      story: "story",
    };
    const tid = templateMap[post.template] ?? "tip";
    const tmpl = TEMPLATES.find((t) => t.id === tid)!;
    setSelectedTemplate(tid);
    setSizeMode(tmpl.defaultSize);
    if (tid === "story") setFontSize(56);
    else setFontSize(52);

    if (tid === "stat") {
      setFields({ ...tmpl.defaults, stat: post.stat, statLabel: "per month", body: post.body, headline: post.headline });
    } else if (tid === "challenge") {
      setFields({ ...tmpl.defaults, body: post.body, headline: post.headline });
    } else {
      setFields({ ...tmpl.defaults, headline: post.headline, body: post.body });
    }

    canvasAreaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const downloadAll = async () => {
    if (!weekPosts) return;
    for (const post of weekPosts) {
      usePost(post);
      await new Promise((r) => setTimeout(r, 600));
      handleDownload();
      await new Promise((r) => setTimeout(r, 500));
    }
  };

  const TOPIC_COLORS: Record<string, string> = {
    inflation: "bg-red-500/20 text-red-300 border-red-500/30",
    subscriptions: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    groceries: "bg-green-500/20 text-green-300 border-green-500/30",
    savings: "bg-green-500/20 text-green-300 border-green-500/30",
    bills: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    food: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    mindset: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    shopping: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  };

  const TEMPLATE_ICON: Record<string, string> = {
    tip: "💡",
    stat: "📊",
    challenge: "🏆",
    alert: "🚨",
    story: "📱",
  };

  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate)!;

  // Scale factor for preview display
  const previewScale = sizeMode === "story" ? 0.28 : 0.42;
  const { w: cw, h: ch } = CANVAS_SIZES[sizeMode];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-7xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Flame className="text-orange-400 w-6 h-6" />
          <span className="font-black text-lg">StackStreak</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/scripts" className="text-gray-400 hover:text-white transition-colors">
            Scripts
          </Link>
          <Link href="/deals" className="text-gray-400 hover:text-white transition-colors">
            Deals
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-black flex items-center gap-3">
            <ImageIcon className="text-orange-400 w-8 h-8" />
            Image Generator
          </h1>
          <p className="text-gray-400 mt-1">
            Create ready-to-post social media cards — no design skills needed
          </p>
        </div>

        {/* ── AUTO-GENERATE WEEK ── */}
        <div className="mb-8 p-5 bg-white/[0.04] border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-black text-lg flex items-center gap-2">
                <Sparkles className="text-orange-400 w-5 h-5" />
                Auto-Generate Week
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Generate 7 ready-to-post cards with AI — one click, full week
              </p>
            </div>
            <div className="flex items-center gap-2">
              {weekPosts && (
                <button
                  onClick={downloadAll}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Download All
                </button>
              )}
              <button
                onClick={generateWeek}
                disabled={generatingWeek}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
              >
                {generatingWeek ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {weekPosts ? "Regenerate Week" : "Generate Week"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Skeleton or cards */}
          {(generatingWeek || weekPosts) && (
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-3" style={{ minWidth: "max-content" }}>
                {generatingWeek
                  ? Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-[200px] shrink-0 bg-white/5 border border-white/10 rounded-xl p-3 animate-pulse"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-orange-500/30" />
                          <div className="h-4 w-20 bg-white/10 rounded" />
                        </div>
                        <div className="h-3 w-full bg-white/10 rounded mb-1.5" />
                        <div className="h-3 w-4/5 bg-white/10 rounded mb-3" />
                        <div className="flex gap-1 mb-3">
                          <div className="h-5 w-12 bg-white/10 rounded" />
                          <div className="h-5 w-16 bg-white/10 rounded" />
                        </div>
                        <div className="h-7 w-full bg-white/10 rounded-lg" />
                      </div>
                    ))
                  : weekPosts!.map((post) => {
                      const topicClass =
                        TOPIC_COLORS[post.topic] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30";
                      return (
                        <div
                          key={post.day}
                          className="w-[200px] shrink-0 bg-white/[0.05] border border-white/10 hover:border-orange-500/30 rounded-xl p-3 flex flex-col transition-colors"
                        >
                          {/* Day circle + topic */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                              {post.day}
                            </div>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${topicClass} truncate`}
                            >
                              {post.topic}
                            </span>
                          </div>

                          {/* Headline */}
                          <p className="text-xs font-semibold text-white leading-tight mb-2 line-clamp-2 flex-1">
                            {post.headline}
                          </p>

                          {/* Template + platform + time row */}
                          <div className="flex items-center gap-1 mb-2 flex-wrap">
                            <span className="text-[10px] bg-white/10 rounded px-1.5 py-0.5 text-gray-400">
                              {TEMPLATE_ICON[post.template]} {post.template}
                            </span>
                            <span className="text-[10px] bg-white/10 rounded px-1.5 py-0.5 text-gray-400 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {post.bestTime}
                            </span>
                          </div>

                          {/* Platform */}
                          <p className="text-[10px] text-gray-500 mb-2">{post.platform}</p>

                          {/* Use button */}
                          <button
                            onClick={() => usePost(post)}
                            className="w-full py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-orange-300 text-xs font-bold transition-colors"
                          >
                            Use →
                          </button>
                        </div>
                      );
                    })}
              </div>
            </div>
          )}

          {!generatingWeek && !weekPosts && (
            <p className="text-xs text-gray-600 text-center py-2">
              Click "Generate Week" to create 7 unique social posts instantly
            </p>
          )}
        </div>

        {/* ── TRENDING NOW ── */}
        <div className="mb-8 p-5 bg-white/[0.04] border border-red-500/20 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-black text-lg flex items-center gap-2">
                <span className="text-xl">🔥</span>
                Trending Now
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Post ideas based on today&apos;s finance news — always timely
              </p>
            </div>
            <button
              onClick={generateTrending}
              disabled={generatingTrending}
              className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
            >
              {generatingTrending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Crawling news...
                </>
              ) : (
                <>
                  🔥 {trendingPosts ? "Refresh Trends" : "Get Trending Ideas"}
                </>
              )}
            </button>
          </div>

          {(generatingTrending || trendingPosts) && (
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-3" style={{ minWidth: "max-content" }}>
                {generatingTrending
                  ? Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="w-[200px] shrink-0 bg-white/5 border border-white/10 rounded-xl p-3 animate-pulse">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-red-500/30" />
                          <div className="h-4 w-20 bg-white/10 rounded" />
                        </div>
                        <div className="h-3 w-full bg-white/10 rounded mb-1.5" />
                        <div className="h-3 w-4/5 bg-white/10 rounded mb-3" />
                        <div className="h-7 w-full bg-white/10 rounded-lg" />
                      </div>
                    ))
                  : trendingPosts!.map((post) => {
                      const topicClass = TOPIC_COLORS[post.topic] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30";
                      return (
                        <div key={post.day} className="w-[210px] shrink-0 bg-white/[0.05] border border-red-500/20 hover:border-red-500/40 rounded-xl p-3 flex flex-col transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                              {post.day}
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${topicClass} truncate`}>
                              {post.topic}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-white leading-tight mb-1 line-clamp-2 flex-1">
                            {post.headline}
                          </p>
                          {post.trendSource && (
                            <p className="text-[10px] text-gray-600 italic mb-2 line-clamp-1">
                              📰 {post.trendSource}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mb-2">
                            <span className="text-[10px] bg-white/10 rounded px-1.5 py-0.5 text-gray-400 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />{post.bestTime}
                            </span>
                          </div>
                          <button
                            onClick={() => usePost(post)}
                            className="w-full py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 text-xs font-bold transition-colors"
                          >
                            Use →
                          </button>
                        </div>
                      );
                    })}
              </div>
            </div>
          )}

          {!generatingTrending && !trendingPosts && (
            <p className="text-xs text-gray-600 text-center py-2">
              Crawls finance news feeds and generates post ideas based on what&apos;s trending today
            </p>
          )}
        </div>

        <div ref={canvasAreaRef} className="flex gap-8 items-start">
          {/* ── LEFT PANEL ── */}
          <div className="w-[380px] shrink-0 space-y-5">
            {/* Template selector */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">
                Template
              </label>
              <div className="space-y-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTemplateChange(t)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                      selectedTemplate === t.id
                        ? "bg-orange-500/15 border-orange-500/50 text-white"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/8"
                    }`}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <div>
                      <div className="font-semibold text-sm">{t.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{t.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color scheme */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">
                Color Scheme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_SCHEMES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColorScheme(c.id)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors text-left border ${
                      colorScheme === c.id
                        ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                        : "bg-white/5 text-gray-400 hover:text-white border-white/10"
                    }`}
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">
                Canvas Size
              </label>
              <div className="flex gap-2">
                {(["square", "story"] as SizeMode[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSizeMode(s)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                      sizeMode === s
                        ? "bg-orange-500 text-white border-transparent"
                        : "bg-white/5 text-gray-400 hover:text-white border-white/10"
                    }`}
                  >
                    {s === "square" ? "◻ Square 1:1" : "▬ Story 9:16"}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size slider */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2 justify-between">
                <span>
                  <Sliders className="w-3 h-3 inline mr-1" />
                  Font Size
                </span>
                <span className="text-orange-400 font-bold">{fontSize}px</span>
              </label>
              <input
                type="range"
                min={32}
                max={80}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            {/* Text fields */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">
                Content
              </label>
              <div className="space-y-3">
                {selectedTemplate === "story" ? (
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Main Text</label>
                    <textarea
                      rows={4}
                      value={fields.mainText ?? ""}
                      onChange={(e) => updateField("mainText", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 resize-none text-sm"
                      placeholder="Your story card text..."
                    />
                  </div>
                ) : selectedTemplate === "stat" ? (
                  <>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Big Stat</label>
                      <input
                        type="text"
                        value={fields.stat ?? ""}
                        onChange={(e) => updateField("stat", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 text-sm"
                        placeholder="e.g. $347"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Stat Label</label>
                      <input
                        type="text"
                        value={fields.statLabel ?? ""}
                        onChange={(e) => updateField("statLabel", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 text-sm"
                        placeholder="e.g. extra per month"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Body Text</label>
                      <textarea
                        rows={3}
                        value={fields.body}
                        onChange={(e) => updateField("body", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 resize-none text-sm"
                        placeholder="Supporting text..."
                      />
                    </div>
                  </>
                ) : selectedTemplate === "challenge" ? (
                  <>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">Week</label>
                        <input
                          type="text"
                          value={fields.week ?? ""}
                          onChange={(e) => updateField("week", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 text-sm"
                          placeholder="Week 4"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">Amount</label>
                        <input
                          type="text"
                          value={fields.amount ?? ""}
                          onChange={(e) => updateField("amount", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 text-sm"
                          placeholder="$10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Body Text</label>
                      <textarea
                        rows={3}
                        value={fields.body}
                        onChange={(e) => updateField("body", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 resize-none text-sm"
                        placeholder="Challenge text..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Headline</label>
                      <input
                        type="text"
                        value={fields.headline}
                        onChange={(e) => updateField("headline", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 text-sm"
                        placeholder="Bold headline..."
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Body Text</label>
                      <textarea
                        rows={4}
                        value={fields.body}
                        onChange={(e) => updateField("body", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 resize-none text-sm"
                        placeholder="Supporting text..."
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 rounded-2xl font-black text-lg transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PNG
            </button>

            <p className="text-xs text-gray-600 text-center">
              Full 1080px image — ready to post on Instagram, TikTok & more
            </p>
          </div>

          {/* ── RIGHT PANEL — Preview ── */}
          <div className="flex-1 flex flex-col items-center">
            <div className="sticky top-6">
              <div className="mb-3 flex items-center justify-between w-full px-1">
                <span className="text-sm text-gray-400 font-medium">
                  {currentTemplate.emoji} {currentTemplate.label} Preview
                </span>
                <span className="text-xs text-gray-600">
                  {cw}×{ch}px
                </span>
              </div>

              {/* Canvas wrapper with shadow */}
              <div
                className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10"
                style={{
                  width: Math.round(cw * previewScale),
                  height: Math.round(ch * previewScale),
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={cw}
                  height={ch}
                  style={{
                    width: Math.round(cw * previewScale),
                    height: Math.round(ch * previewScale),
                    display: "block",
                  }}
                />
              </div>

              {/* Download button below preview */}
              <button
                onClick={handleDownload}
                className="mt-4 w-full py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 text-gray-300 hover:text-white"
              >
                <Download className="w-4 h-4" />
                Download Full Resolution PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
