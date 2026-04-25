"use client";

import type { CSSProperties } from "react";
import { TEXT_HI, TEXT_MID, TEXT_LO, GLASS_BORDER } from "@/app/theme";

const row: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 14px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${GLASS_BORDER}`,
};

const iconWrap: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 8,
  background: "color-mix(in srgb, var(--cta) 22%, transparent)",
  color: "var(--cta)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const title: CSSProperties = {
  fontFamily: "var(--font-apercu), sans-serif",
  fontWeight: 700,
  fontSize: 14,
  color: TEXT_HI,
  margin: 0,
};

const subtitle: CSSProperties = {
  fontFamily: "var(--font-apercu), sans-serif",
  fontSize: 12,
  color: TEXT_MID,
  margin: 0,
  lineHeight: 1.35,
};

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Shield() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function Bolt() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

/** Three-row trust stack shown right under the CTA — risk reversal + social proof + speed. */
export function PaywallReassurance() {
  return (
    <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
      <div style={row}>
        <div style={iconWrap}><Shield /></div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={title}>30-day money-back guarantee</p>
          <p style={subtitle}>Not feeling progress? Email us within 30 days for a full refund.</p>
        </div>
      </div>
      <div style={row}>
        <div style={iconWrap}><Check /></div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={title}>Joined by 43,219+ goal-builders · 4.9★</p>
          <p style={subtitle}>App of the Day. Cancel anytime in one tap.</p>
        </div>
      </div>
      <div style={row}>
        <div style={iconWrap}><Bolt /></div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={title}>Instant access</p>
          <p style={{ ...subtitle, color: TEXT_LO }}>Your personalized 90-day plan is unlocked the moment you start your trial.</p>
        </div>
      </div>
    </div>
  );
}
