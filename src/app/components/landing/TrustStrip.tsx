"use client";

import Reveal from "./Reveal";
import { TEXT_MID, TEXT_LO } from "@/app/theme";

const SIGNALS = [
  "4.9 ★ App Store",
  "Trustpilot 4.8",
  "GDPR-private · EU-hosted",
  "No card to start",
  "Cancel anytime",
];

export default function TrustStrip() {
  return (
    <section style={{ paddingTop: 32, paddingBottom: 16 }}>
      <div className="landing-section-inner">
        <Reveal offset={6}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px 18px",
              padding: "16px 0",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: TEXT_MID,
            }}
          >
            {SIGNALS.map((sig, i) => (
              <span key={sig} style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
                <span>{sig}</span>
                {i < SIGNALS.length - 1 && (
                  <span aria-hidden style={{ color: TEXT_LO }}>·</span>
                )}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
