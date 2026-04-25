"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BehavioLogo } from "@/app/components/BehavioLogo";
import { ACCENT, ACCENT_HOVER, ON_ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";
import { trackEvent } from "@/app/quiz/utils/analytics";

function StarRow({ count = 5, size = 11 }: { count?: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12" fill="#F5C518">
          <path d="M6 0l1.76 3.64L12 4.24 8.88 7.2l.72 4.32L6 9.48 2.4 11.52l.72-4.32L0 4.24l4.24-.6z" />
        </svg>
      ))}
    </span>
  );
}

export default function Hero() {
  const [countUp, setCountUp] = useState(0);

  useEffect(() => {
    const target = 43219;
    const steps = 32;
    const increment = target / steps;
    let current = 0;
    const id = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCountUp(target);
        clearInterval(id);
      } else {
        setCountUp(Math.round(current));
      }
    }, 38);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ paddingTop: 56, paddingBottom: 56 }}>
      <div
        className="landing-section-inner"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 40,
          alignItems: "center",
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            .hero-grid { grid-template-columns: 1.15fr 1fr !important; gap: 64px !important; }
          }
          @media (min-width: 1024px) {
            .hero-orb-wrap { order: 2 !important; }
            .hero-text-wrap { order: 1 !important; }
          }
          @keyframes orbFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 40,
            alignItems: "center",
          }}
        >
          <div className="hero-text-wrap" style={{ order: 1 }}>
            {/* App-of-the-Day badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                marginBottom: 24,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: TEXT_LO,
              }}
            >
              <StarRow size={11} /> App of the Day · 4.9
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.45 }}
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(38px, 5.5vw, 64px)",
                color: TEXT_HI,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: "0 0 18px",
              }}
            >
              Close the gap between who you are and who you&apos;re{" "}
              <span style={{ color: ACCENT }}>meant to be.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: "clamp(15px, 1.6vw, 19px)",
                color: TEXT_MID,
                lineHeight: 1.55,
                margin: "0 0 28px",
                maxWidth: 520,
              }}
            >
              Your AI-powered 90-day plan. Built around your real behavior.
              Auto-scheduled into your calendar. Starts today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360 }}
            >
              <Link
                href="/quiz"
                onClick={() => trackEvent("funnel_start", { source: "landing_hero" })}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  padding: "16px 24px",
                  borderRadius: 14,
                  background: `linear-gradient(145deg, ${ACCENT}, ${ACCENT_HOVER})`,
                  color: ON_ACCENT,
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: `0 0 24px ${accentRgba(0.28)}, 0 2px 8px rgba(0,0,0,0.35)`,
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
                  textAlign: "center",
                }}
              >
                Free · 3 min · No credit card · Instant archetype
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                marginTop: 32,
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                flexWrap: "wrap",
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 14,
                color: TEXT_MID,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 800,
                  fontSize: 22,
                  color: TEXT_HI,
                }}
              >
                {countUp.toLocaleString()}+
              </span>
              <span>people already building their plan</span>
            </motion.div>
          </div>

          <motion.div
            className="hero-orb-wrap"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              order: 2,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 360,
            }}
          >
            {/* Soft mint glow halo */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: "5%",
                background: `radial-gradient(circle, ${accentRgba(0.30)} 0%, transparent 60%)`,
                filter: "blur(48px)",
                pointerEvents: "none",
              }}
            />
            {/* Subtle orbit ring */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                width: "min(380px, 78vw)",
                aspectRatio: "1 / 1",
                borderRadius: "50%",
                border: `1px dashed ${accentRgba(0.22)}`,
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                width: "min(280px, 60vw)",
                aspectRatio: "1 / 1",
                borderRadius: "50%",
                border: `1px solid ${accentRgba(0.12)}`,
              }}
            />
            {/* Mark */}
            <div
              style={{
                position: "relative",
                animation: "orbFloat 6s ease-in-out infinite",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "min(200px, 44vw)",
                aspectRatio: "1 / 1",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${accentRgba(0.10)} 0%, transparent 70%)`,
              }}
            >
              <BehavioLogo variant="mark" size={140} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
