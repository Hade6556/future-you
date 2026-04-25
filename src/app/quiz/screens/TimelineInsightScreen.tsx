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
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: ACCENT,
          margin: "0 0 14px",
        }}
      >
        ↳ The math no one shows you
      </p>

      {/* Hero stat — 69 full days lost */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        style={{
          position: "relative",
          padding: "26px 22px 22px",
          borderRadius: 20,
          background: "linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: 16,
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(60% 60% at 0% 0%, ${accentRgba(0.10)}, transparent 65%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(72px, 18vw, 108px)",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
              color: ACCENT,
              fontVariantNumeric: "tabular-nums",
              margin: "0 0 4px",
            }}
          >
            69
          </div>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: TEXT_MID,
              margin: "0 0 18px",
            }}
          >
            full days lost / year
          </p>
          <p
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(20px, 4.4vw, 26px)",
              color: TEXT_HI,
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            That&apos;s how much{" "}
            <span style={{ fontStyle: "italic", color: ACCENT }}>time vanishes</span>{" "}
            in 20-minute chunks.
          </p>
          <p
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 14,
              color: TEXT_MID,
              margin: "10px 0 0",
              lineHeight: 1.55,
            }}
          >
            You don&apos;t see the loss because it doesn&apos;t bleed.
          </p>
        </div>
      </motion.div>

      {/* Lost / Reclaimed diptych */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            padding: "16px 14px",
            borderRadius: 14,
            background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: TEXT_LO,
              display: "block",
              marginBottom: 6,
            }}
          >
            Lost · No system
          </span>
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: 32,
              color: TEXT_HI,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            16h
          </div>
          <span
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 12,
              color: TEXT_MID,
              display: "block",
              marginTop: 4,
            }}
          >
            wasted every week
          </span>
        </div>

        <div
          style={{
            padding: "16px 14px",
            borderRadius: 14,
            background: `linear-gradient(180deg, ${accentRgba(0.10)}, ${accentRgba(0.02)})`,
            border: `1px solid ${accentRgba(0.30)}`,
            position: "relative",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: ACCENT,
              display: "block",
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            Reclaimed · Behavio
          </span>
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: 32,
              color: ACCENT,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            127h
          </div>
          <span
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 12,
              color: TEXT_HI,
              display: "block",
              marginTop: 4,
            }}
          >
            in your first 90 days
          </span>
        </div>
      </motion.div>

      <CTAButton label="Reclaim my time →" onClick={onNext} />
    </motion.div>
  );
}
