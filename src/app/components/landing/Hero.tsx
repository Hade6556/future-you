"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ACCENT, ACCENT_HOVER, ON_ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";
import { trackEvent } from "@/app/quiz/utils/analytics";
import LiveActivityFeed from "./LiveActivityFeed";

const PLAN_COUNT_BASE = 43219;
const PLAN_COUNT_TICK_MS = 15_000;

function usePlansMadeCount() {
  const [count, setCount] = useState(PLAN_COUNT_BASE);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), PLAN_COUNT_TICK_MS);
    return () => clearInterval(id);
  }, []);
  return count;
}

export default function Hero() {
  const plansMade = usePlansMadeCount();

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
            .hero-mockup-wrap { transform: rotate(-1.5deg); }
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
                Stop planning to change.{" "}
                <span style={{ fontStyle: "italic", color: ACCENT }}>
                  Start becoming.
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
                  maxWidth: 480,
                }}
              >
                Most plans collapse on Tuesday. This one doesn&apos;t.
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
                  Take the free quiz
                  <span aria-hidden style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>→</span>
                </Link>
                <Link
                  href="#how-it-works"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "16px 22px",
                    borderRadius: 12,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: TEXT_HI,
                    fontFamily: "var(--font-apercu), sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: "none",
                  }}
                >
                  See a sample plan
                </Link>
              </div>
            </BlurFade>

            <BlurFade delay={0.45} offset={8}>
              <div className="hero-meta-row">
                <HeroMeta label="Plans built so far" value={<><NumberTicker value={plansMade} className="!text-white" />+</>} />
                <HeroMeta label="Average plan rating" value="4.9 / 5" />
                <HeroMeta label="Time to first action" value="< 5 min" />
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={0.25} direction="left" offset={20} className="hero-mockup-wrap">
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Soft mint wash, but flat — no orb */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "-8% -4%",
                  background: `radial-gradient(60% 50% at 60% 40%, ${accentRgba(0.16)}, transparent 70%)`,
                  filter: "blur(40px)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <LiveActivityFeed />
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
