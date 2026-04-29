import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get("template") || "tip";
  const headline = searchParams.get("headline") || "Save Money Today";
  const body = searchParams.get("body") || "Small changes add up to big savings.";
  const stat = searchParams.get("stat") || "";
  // topic is accepted for future use
  // const topic = searchParams.get("topic") || "savings";

  // Color schemes by template
  const schemes: Record<string, { bg: string; accent: string; text: string; badge: string }> = {
    tip: { bg: "#f97316", accent: "#ea580c", text: "#ffffff", badge: "💡 TIP" },
    stat: { bg: "#0a0a0f", accent: "#f97316", text: "#ffffff", badge: "📊 STAT" },
    challenge: { bg: "#0a0a0f", accent: "#f97316", text: "#ffffff", badge: "🏆 CHALLENGE" },
    alert: { bg: "#1a0505", accent: "#ef4444", text: "#ffffff", badge: "🚨 ALERT" },
    inflation: { bg: "#1a0505", accent: "#ef4444", text: "#ffffff", badge: "🚨 ALERT" },
    story: { bg: "#0a0a0f", accent: "#f97316", text: "#ffffff", badge: "📱 TODAY" },
  };

  const scheme = schemes[template] || schemes.tip;
  const isOrange = scheme.bg === "#f97316";

  const shortHeadline = headline.length <= 48;
  const headlineSize = stat ? (headline.length > 70 ? "42px" : "50px") : shortHeadline ? "60px" : headline.length > 90 ? "40px" : "50px";
  const bodyText = body.length > 95 ? body.substring(0, 95) + "..." : body;
  const bodySize = bodyText.length > 75 ? "26px" : "30px";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background: isOrange
            ? "linear-gradient(135deg, #f97316, #ea580c)"
            : scheme.bg,
          padding: "72px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Background decoration */}
        {!isOrange && (
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
          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "48px" }}>🔥</span>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-1px",
              }}
            >
              StackStreak
            </span>
          </div>

          {/* Badge */}
          <div
            style={{
              display: "flex",
              background: isOrange ? "rgba(255,255,255,0.2)" : scheme.accent,
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

        {/* Middle: Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Stat */}
          {stat && (
            <div
              style={{
                fontSize: "88px",
                fontWeight: 900,
                color: isOrange ? "#fff" : scheme.accent,
                lineHeight: 1,
                letterSpacing: "-4px",
              }}
            >
              {stat}
            </div>
          )}

          {/* Headline */}
          <div
            style={{
              fontSize: headlineSize,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: "-1px",
              maxWidth: "900px",
              overflow: "hidden",
            }}
          >
            {headline}
          </div>

          {/* Body */}
          <div
            style={{
              fontSize: bodySize,
              color: isOrange ? "rgba(255,255,255,0.85)" : "#9ca3af",
              lineHeight: 1.4,
              maxWidth: "860px",
              overflow: "hidden",
            }}
          >
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
            borderTop: `2px solid ${isOrange ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              background: isOrange
                ? "rgba(255,255,255,0.15)"
                : "rgba(249,115,22,0.15)",
              borderRadius: "100px",
              padding: "12px 32px",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                color: isOrange ? "#fff" : scheme.accent,
                fontWeight: 700,
              }}
            >
              stackstreak.aivantageworks.com • free app
            </span>
          </div>
          <span
            style={{
              fontSize: "24px",
              color: isOrange ? "rgba(255,255,255,0.6)" : "#4b5563",
            }}
          >
            Free • No ads • Start today
          </span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
    }
  );
}
