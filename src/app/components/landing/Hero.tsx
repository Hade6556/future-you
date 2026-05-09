"use client";

import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { ACCENT, ACCENT_HOVER, ON_ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";
import { trackEvent } from "@/app/quiz/utils/analytics";
import FollowThroughCurve from "./mockups/FollowThroughCurve";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        paddingTop: "clamp(96px, 14vh, 160px)",
        paddingBottom: "clamp(72px, 12vh, 140px)",
      }}
    >
      <div className="landing-section-inner" style={{ width: "100%" }}>
        <style>{`
          .hero-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 56px;
            align-items: center;
          }
          @media (min-width: 1024px) {
            .hero-grid { grid-template-columns: 1.05fr 1fr; gap: 72px; }
          }
          .hero-meta-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 18px;
            margin-top: 36px;
          }
          @media (min-width: 600px) {
            .hero-meta-row { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; }
          }
        `}</style>

        <div className="hero-grid">
          <div>
            <BlurFade delay={0} offset={10}>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: ACCENT,
                  margin: "0 0 18px",
                  fontWeight: 600,
                }}
              >
                ↳ The 2-min self-diagnosis
              </p>
            </BlurFade>

            <BlurFade delay={0.1} offset={14}>
              <h1
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(40px, 5.6vw, 72px)",
                  color: TEXT_HI,
                  lineHeight: 0.98,
                  letterSpacing: "-0.025em",
                  margin: "0 0 22px",
                }}
              >
                Why you keep{" "}
                <span style={{ fontStyle: "italic", color: ACCENT }}>
                  failing.
                </span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.2} offset={12}>
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
                The follow-through curve is the same for almost everyone who
                tries to change something on their own. Take the 2-minute
                quiz — find out where on the curve you are, and what to do
                about it.
              </p>
            </BlurFade>

            <BlurFade delay={0.3} offset={10}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                <Link
                  href="/quiz"
                  onClick={() => trackEvent("funnel_start", { source: "landing_hero" })}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "16px 26px",
                    borderRadius: 12,
                    background: `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT_HOVER} 100%)`,
                    color: ON_ACCENT,
                    fontFamily: "var(--font-apercu), sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: "-0.005em",
                    textDecoration: "none",
                    boxShadow: `0 1px 0 rgba(255,255,255,0.20) inset, 0 12px 24px -10px ${accentRgba(0.55)}`,
                  }}
                >
                  Take the 2-min quiz
                  <span aria-hidden style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>→</span>
                </Link>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: TEXT_LO,
                  }}
                >
                  Free · 2 min · No card required
                </span>
              </div>
            </BlurFade>

            <BlurFade delay={0.45} offset={8}>
              <div className="hero-meta-row">
                <HeroMeta label="People diagnosed" value="43,000+" />
                <HeroMeta label="Average rating" value="4.9 / 5" />
                <HeroMeta label="Time to first action" value="< 5 min" />
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={0.25} direction="left" offset={20}>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "-8% -4%",
                  background: `radial-gradient(60% 50% at 50% 50%, ${accentRgba(0.14)}, transparent 70%)`,
                  filter: "blur(40px)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", justifyContent: "center" }}>
                <FollowThroughCurve />
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}

function HeroMeta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "14px 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 800,
          fontSize: 26,
          color: TEXT_HI,
          letterSpacing: "-0.01em",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: TEXT_LO,
        }}
      >
        {label}
      </span>
    </div>
  );
}
