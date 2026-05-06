import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get("template") || "tip";
  const headline = searchParams.get("headline") || "Save Money Today";
  const body = searchParams.get("body") || "Small changes add up to big savings.";
  const stat = searchParams.get("stat") || "";
  const colorParam = searchParams.get("color") || "";
  const size = searchParams.get("size") || "square";

  const isStory = size === "story";
  const imgW = 1080;
  const imgH = isStory ? 1920 : 1080;

  // Base schemes per template (used when no color override)
  const baseSchemes: Record<string, { bg: string; gradient?: string; accent: string; text: string; badge: string }> = {
    tip:       { bg: "#f97316", gradient: "linear-gradient(135deg,#f97316,#ea580c)", accent: "#fff",    text: "#fff", badge: "💡 TIP" },
    stat:      { bg: "#0a0a0f", accent: "#f97316", text: "#fff", badge: "📊 STAT" },
    challenge: { bg: "#0a0a0f", accent: "#f97316", text: "#fff", badge: "🏆 CHALLENGE" },
    alert:     { bg: "#1a0505", accent: "#ef4444", text: "#fff", badge: "🚨 ALERT" },
    inflation: { bg: "#1a0505", accent: "#ef4444", text: "#fff", badge: "🚨 ALERT" },
    story:     { bg: "#0a0a0f", accent: "#f97316", text: "#fff", badge: "📱 TODAY" },
  };

  // Color override palettes
  const colorOverrides: Record<string, { bg: string; gradient?: string; accent: string }> = {
    orange: { bg: "#f97316", gradient: "linear-gradient(135deg,#f97316,#ea580c)", accent: "#fff" },
    dark:   { bg: "#0a0a0f", accent: "#f97316" },
    red:    { bg: "#1a0505", accent: "#ef4444" },
    green:  { bg: "#052e16", gradient: "linear-gradient(135deg,#052e16,#064e3b)", accent: "#10b981" },
  };

  const base = baseSchemes[template] || baseSchemes.tip;
  const override = colorOverrides[colorParam];
  const scheme = override ? { ...base, ...override } : base;

  const background = scheme.gradient ?? scheme.bg;
  const isLight = scheme.bg === "#f97316" || colorParam === "orange";
  const isGreen = colorParam === "green";

  const shortHeadline = headline.length <= 48;
  const headlineSize = stat
    ? headline.length > 70 ? "42px" : "50px"
    : shortHeadline ? "60px" : headline.length > 90 ? "40px" : "50px";
  const bodyText = body.length > 95 ? body.substring(0, 95) + "..." : body;
  const bodySize = bodyText.length > 75 ? "26px" : "30px";
  const subColor = isLight ? "rgba(255,255,255,0.85)" : isGreen ? "#6ee7b7" : "#9ca3af";
  const accentForStat = isLight ? "#fff" : scheme.accent;

  return new ImageResponse(
    (
      <div
        style={{
          width: `${imgW}px`,
          height: `${imgH}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background,
          padding: isStory ? "96px 72px" : "72px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Background glow */}
        {!isLight && (
          <div
            style={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: scheme.accent,
              opacity: 0.08,
              display: "flex",
            }}
          />
        )}

        {/* Top: Logo + Badge */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "48px" }}>🔥</span>
            <span style={{ fontSize: "36px", fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>
              StackStreak
            </span>
          </div>
          <div
            style={{
              display: "flex",
              background: isLight ? "rgba(255,255,255,0.2)" : scheme.accent,
              borderRadius: "100px",
              padding: "8px 24px",
              width: "fit-content",
            }}
          >
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#fff" }}>
              {scheme.badge}
            </span>
          </div>
        </div>

        {/* Middle: Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {stat && (
            <div style={{ fontSize: "88px", fontWeight: 900, color: accentForStat, lineHeight: 1, letterSpacing: "-4px" }}>
              {stat}
            </div>
          )}
          <div style={{ fontSize: headlineSize, fontWeight: 900, color: "#fff", lineHeight: 1.08, letterSpacing: "-1px", maxWidth: "900px" }}>
            {headline}
          </div>
          <div style={{ fontSize: bodySize, color: subColor, lineHeight: 1.4, maxWidth: "860px" }}>
            {bodyText}
          </div>
        </div>

        {/* Bottom: CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "32px",
            borderTop: `2px solid ${isLight ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              background: isLight ? "rgba(255,255,255,0.15)" : `${scheme.accent}26`,
              borderRadius: "100px",
              padding: "12px 32px",
            }}
          >
            <span style={{ fontSize: "24px", color: isLight ? "#fff" : scheme.accent, fontWeight: 700 }}>
              stackstreak.aivantageworks.com • free app
            </span>
          </div>
          <span style={{ fontSize: "24px", color: isLight ? "rgba(255,255,255,0.6)" : "#4b5563" }}>
            Free • No ads • Start today
          </span>
        </div>
      </div>
    ),
    { width: imgW, height: imgH }
  );
}
