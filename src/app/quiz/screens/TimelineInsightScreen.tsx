"use client";

import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

export default function TimelineInsightScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: 26,
          color: TEXT_HI,
          margin: "0 0 20px",
          lineHeight: 1.2,
        }}
      >
        Without a system, the average person wastes 2.3 hours a day.
      </h2>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div style={{
          flex: 1,
          padding: "16px 14px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.10)",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 800, fontSize: 28, color: TEXT_HI, lineHeight: 1 }}>16h</div>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, color: TEXT_LO, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>wasted / week</div>
        </div>
        <div style={{
          flex: 1,
          padding: "16px 14px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.10)",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 800, fontSize: 28, color: TEXT_HI, lineHeight: 1 }}>69</div>
          <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, color: TEXT_LO, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>full days lost / year</div>
        </div>
      </div>

      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 15,
          color: TEXT_MID,
          margin: "0 0 36px",
          lineHeight: 1.5,
        }}
      >
        Behavio users reclaim an average of{" "}
        <span style={{ color: ACCENT, fontWeight: 600 }}>127 hours</span> in
        their first 90 days.
      </p>

      <CTAButton label="Reclaim my time →" onClick={onNext} />
    </motion.div>
  );
}
