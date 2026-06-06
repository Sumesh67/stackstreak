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

  // ── Pinterest vertical template (1000×1500, CreateAndColor branding) ──────
  if (template === "pinterest") {
    const PW = 1000, PH = 1500;
    const headlineFontSize = headline.length > 60 ? "58px" : headline.length > 40 ? "66px" : "76px";
    return new ImageResponse(
      (
        <div
          style={{
            width: `${PW}px`, height: `${PH}px`,
            display: "flex", flexDirection: "column",
            background: "linear-gradient(160deg,#7c3aed 0%,#db2777 55%,#f97316 100%)",
            fontFamily: "system-ui,sans-serif",
            padding: "80px 72px",
            position: "relative",
          }}
        >
          {/* Decorative circles */}
          <div style={{ position:"absolute", top:-80, left:-80, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,0.07)", display:"flex" }} />
          <div style={{ position:"absolute", bottom:-100, right:-100, width:420, height:420, borderRadius:"50%", background:"rgba(255,255,255,0.05)", display:"flex" }} />
          <div style={{ position:"absolute", top:"40%", right:-60, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.04)", display:"flex" }} />

          {/* Branding */}
          <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
            <span style={{ fontSize:"52px" }}>🎨</span>
            <span style={{ fontSize:"38px", fontWeight:900, color:"#fff", letterSpacing:"-1px" }}>CreateNColor</span>
          </div>

          {/* Badge */}
          <div style={{ display:"flex", marginTop:"36px" }}>
            <div style={{ background:"rgba(255,255,255,0.22)", borderRadius:"100px", padding:"10px 28px", display:"flex" }}>
              <span style={{ fontSize:"26px", fontWeight:700, color:"#fff" }}>✏️ FREE PRINTABLE</span>
            </div>
          </div>

          {/* Main headline */}
          <div style={{ display:"flex", flex:1, flexDirection:"column", justifyContent:"center", gap:"40px" }}>
            <div style={{ fontSize:headlineFontSize, fontWeight:900, color:"#fff", lineHeight:1.08, letterSpacing:"-1.5px", maxWidth:"856px" }}>
              {headline}
            </div>

            {/* Feature tags */}
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              <div style={{ display:"flex", gap:"14px" }}>
                <div style={{ background:"rgba(255,255,255,0.18)", borderRadius:"100px", padding:"10px 26px", display:"flex" }}>
                  <span style={{ fontSize:"22px", color:"#fff", fontWeight:600 }}>🖍️ Print at home</span>
                </div>
                <div style={{ background:"rgba(255,255,255,0.18)", borderRadius:"100px", padding:"10px 26px", display:"flex" }}>
                  <span style={{ fontSize:"22px", color:"#fff", fontWeight:600 }}>✨ AI generated</span>
                </div>
              </div>
              <div style={{ display:"flex" }}>
                <div style={{ background:"rgba(255,255,255,0.18)", borderRadius:"100px", padding:"10px 26px", display:"flex" }}>
                  <span style={{ fontSize:"22px", color:"#fff", fontWeight:600 }}>🆓 Free to start — no account needed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom URL bar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:"40px", borderTop:"2px solid rgba(255,255,255,0.25)" }}>
            <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:"100px", padding:"14px 36px", display:"flex" }}>
              <span style={{ fontSize:"23px", color:"#fff", fontWeight:700 }}>createandcolor.aivantageworks.com</span>
            </div>
            <span style={{ fontSize:"48px" }}>🖍️</span>
          </div>
        </div>
      ),
      { width: PW, height: PH }
    );
  }

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
