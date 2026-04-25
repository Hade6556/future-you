"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ACCENT, ACCENT_HOVER, ON_ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";
import { trackEvent } from "@/app/quiz/utils/analytics";

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      style={{
        paddingTop: 80,
        paddingBottom: 88,
        position: "relative",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 80% at 50% 50%, ${accentRgba(0.10)} 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <div
        className="landing-section-inner"
        style={{
          maxWidth: 720,
          textAlign: "center",
          position: "relative",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(32px, 4.2vw, 52px)",
            color: TEXT_HI,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: "0 0 14px",
          }}
        >
          43,219 already know their archetype.{" "}
          <span style={{ color: ACCENT }}>You don&apos;t — yet.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 17,
            color: TEXT_MID,
            lineHeight: 1.5,
            margin: "0 auto 32px",
            maxWidth: 540,
          }}
        >
          Three minutes to find out which archetype you are. No commitment. No card.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.16 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
        >
          <Link
            href="/quiz"
            onClick={() => trackEvent("funnel_start", { source: "landing_final" })}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "18px 40px",
              borderRadius: 16,
              background: `linear-gradient(145deg, ${ACCENT}, ${ACCENT_HOVER})`,
              color: ON_ACCENT,
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: `0 0 32px ${accentRgba(0.32)}, 0 4px 14px rgba(0,0,0,0.4)`,
              minWidth: 280,
            }}
          >
            Take the Free Quiz →
          </Link>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              color: TEXT_LO,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Free · 3 min · No credit card · Instant archetype
          </p>
        </motion.div>
      </div>
    </section>
  );
}
