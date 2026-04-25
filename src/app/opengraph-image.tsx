import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Behavio — your AI-powered 90-day plan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 90px",
          background:
            "linear-gradient(160deg, #0d1a3a 0%, #060912 60%), radial-gradient(ellipse at top, rgba(94,205,161,0.18), transparent 60%)",
          color: "#F4F8FF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#94A3B8", letterSpacing: "0.2em" }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#5ECDA1" }} />
          BEHAVIO
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            Close the gap between<br />who you are and who<br />you’re <span style={{ color: "#5ECDA1" }}>meant to be.</span>
          </div>
          <div style={{ fontSize: 30, color: "#B6C2D9", lineHeight: 1.3, maxWidth: 920 }}>
            Your AI-powered 90-day plan. Built around your life. Starts today.
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 22, color: "#94A3B8" }}>
          <div>★ 4.9 · App of the Day</div>
          <div>·</div>
          <div>43,219+ building their plan</div>
          <div>·</div>
          <div>Free 3-min quiz</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
