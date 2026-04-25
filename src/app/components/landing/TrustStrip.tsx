"use client";

import { motion } from "framer-motion";
import { Lock, RefreshCw } from "lucide-react";
import { ACCENT, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

function StarRow({ size = 12 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12" fill="#00B67A">
          <path d="M6 0l1.76 3.64L12 4.24 8.88 7.2l.72 4.32L6 9.48 2.4 11.52l.72-4.32L0 4.24l4.24-.6z" />
        </svg>
      ))}
    </span>
  );
}

export default function TrustStrip() {
  return (
    <section style={{ paddingTop: 32, paddingBottom: 32 }}>
      <div className="landing-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px 32px",
            padding: "20px 24px",
            borderRadius: 20,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 13,
            color: TEXT_MID,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>4.9</span>
            <StarRow />
            <span style={{ color: TEXT_LO, fontSize: 12 }}>App Store</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 800,
                color: "#00B67A",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                fontSize: 14,
              }}
            >
              Trustpilot
            </span>
            <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>4.8</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: TEXT_MID }}>
            <Lock size={14} strokeWidth={1.8} style={{ color: ACCENT }} />
            <span>GDPR-private</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: TEXT_MID }}>
            <RefreshCw size={14} strokeWidth={1.8} style={{ color: ACCENT }} />
            <span>Cancel anytime</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 999,
              background: accentRgba(0.08),
              color: ACCENT,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Featured · App of the Day
          </div>
        </motion.div>
      </div>
    </section>
  );
}
