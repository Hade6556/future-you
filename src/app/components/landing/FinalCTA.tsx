"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { ACCENT, ACCENT_HOVER, ON_ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";
import { trackEvent } from "@/app/quiz/utils/analytics";

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      style={{
        paddingTop: 96,
        paddingBottom: 104,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 70% at 50% 100%, ${accentRgba(0.10)} 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <div
        className="landing-section-inner"
        style={{ maxWidth: 760, position: "relative" }}
      >
        <Reveal>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              color: ACCENT,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: "0 0 18px",
            }}
          >
            ↳ Day 1 starts when you click
          </p>
          <h2
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(38px, 5.4vw, 68px)",
              color: TEXT_HI,
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
              margin: "0 0 18px",
            }}
          >
            Stop planning to start.{" "}
            <span style={{ fontStyle: "italic", color: ACCENT }}>Just start.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: "clamp(15px, 1.4vw, 18px)",
              color: TEXT_MID,
              lineHeight: 1.55,
              margin: "0 0 32px",
              maxWidth: 520,
            }}
          >
            Three minutes. One archetype. A plan that&apos;s on your calendar by
            tonight — and reschedules itself the first time you skip.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Link
              href="/quiz"
              onClick={() => trackEvent("funnel_start", { source: "landing_final" })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "18px 30px",
                borderRadius: 14,
                background: `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT_HOVER} 100%)`,
                color: ON_ACCENT,
                fontFamily: "var(--font-apercu), sans-serif",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "-0.005em",
                textDecoration: "none",
                boxShadow: `0 1px 0 rgba(255,255,255,0.20) inset, 0 16px 32px -12px ${accentRgba(0.55)}`,
              }}
            >
              Take the free quiz
              <span aria-hidden style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>→</span>
            </Link>
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                color: TEXT_LO,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Free · 3 min · No card
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
