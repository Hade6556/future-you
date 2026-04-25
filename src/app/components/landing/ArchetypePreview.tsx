"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";
import { trackEvent } from "@/app/quiz/utils/analytics";
import ArchetypeMicroMockup from "./mockups/ArchetypeMicroMockup";
import ArchetypeSigil from "./ArchetypeSigil";
import SpotlightCard from "./SpotlightCard";
import type { ArchetypeKey } from "./mockups/PlanCardMockup";

type Archetype = {
  serial: string;
  name: ArchetypeKey;
  signature: string;
  hook: string;
  rarity: string;
};

const ARCHETYPES: Archetype[] = [
  {
    serial: "ARC·01",
    name: "Strategist",
    signature: "Plans → sequences → ships",
    hook: "Sees the long game. Wins by sequencing the right moves in the right order — never by working harder.",
    rarity: "18%",
  },
  {
    serial: "ARC·02",
    name: "Steady Builder",
    signature: "Same block, every day",
    hook: "Compounds small wins. The plan's job is to never let the daily block break, even on bad weeks.",
    rarity: "22%",
  },
  {
    serial: "ARC·03",
    name: "Endurance Engine",
    signature: "Builds slow, finishes loud",
    hook: "Outlasts obstacles. The plan ramps load gradually so the body — or the drive — never quits first.",
    rarity: "14%",
  },
  {
    serial: "ARC·04",
    name: "Creative Spark",
    signature: "Sprint → ship → recover",
    hook: "Designs the path others didn't see. The plan protects deep-work windows and forces shipping cycles.",
    rarity: "11%",
  },
  {
    serial: "ARC·05",
    name: "Guardian",
    signature: "Caps · buffers · compounding",
    hook: "Protects what matters. The plan turns one weekly cap into a permanent buffer — quiet, durable progress.",
    rarity: "17%",
  },
  {
    serial: "ARC·06",
    name: "Explorer",
    signature: "New ground, every week",
    hook: "Finds energy in novelty. The plan rotates variety in without losing the throughline of the goal.",
    rarity: "13%",
  },
];

export default function ArchetypePreview() {
  return (
    <section id="archetypes" style={{ paddingTop: 96, paddingBottom: 96, scrollMarginTop: 96 }}>
      <div className="landing-section-inner">
        <Reveal>
          <div style={{ maxWidth: 760, marginBottom: 56 }}>
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                color: ACCENT,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              ↳ The reveal · Field manual
            </p>
            <h2
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontSize: "clamp(32px, 4vw, 52px)",
                color: TEXT_HI,
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                margin: "0 0 14px",
              }}
            >
              You&apos;re one of <span style={{ fontStyle: "italic", color: ACCENT }}>six archetypes.</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 16,
                color: TEXT_MID,
                lineHeight: 1.55,
                margin: 0,
                maxWidth: 560,
              }}
            >
              Each one moves through goals on its own rhythm. Your plan is sequenced
              for yours — not generic advice you have to translate.
            </p>
          </div>
        </Reveal>

        <style>{`
          .arch-mirror {
            display: grid;
            grid-template-columns: 1fr;
            gap: 14px;
            position: relative;
          }
          @media (min-width: 900px) {
            .arch-mirror {
              grid-template-columns: 1fr 1fr;
              column-gap: 56px;
              row-gap: 18px;
            }
            .arch-mirror::before {
              content: "";
              position: absolute;
              top: 8px;
              bottom: 8px;
              left: 50%;
              width: 1px;
              background: linear-gradient(180deg, transparent, rgba(255,255,255,0.06) 12%, rgba(255,255,255,0.06) 88%, transparent);
              transform: translateX(-0.5px);
              pointer-events: none;
            }
          }
          .arch-card {
            position: relative;
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 18px;
            align-items: start;
            padding: 22px;
            border-radius: 18px;
            background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01));
            border: 1px solid rgba(255,255,255,0.07);
            overflow: hidden;
            transition: border-color 160ms, transform 160ms;
          }
          .arch-card:hover {
            border-color: ${accentRgba(0.30)};
            transform: translateY(-2px);
          }
          /* Mirrored: right column flips its inner sigil to the right edge */
          @media (min-width: 900px) {
            .arch-card[data-side="right"] {
              grid-template-columns: 1fr auto;
              text-align: right;
            }
            .arch-card[data-side="right"] .arch-sigil-wrap { order: 2; }
            .arch-card[data-side="right"] .arch-body { order: 1; }
            .arch-card[data-side="right"] .arch-meta-row {
              flex-direction: row-reverse;
            }
            .arch-card[data-side="right"] .arch-bullet-row {
              justify-content: flex-end;
            }
          }
          .arch-locked {
            background: linear-gradient(180deg, ${accentRgba(0.10)}, ${accentRgba(0.03)});
            border-color: ${accentRgba(0.35)};
          }
        `}</style>

        <div className="arch-mirror">
          {ARCHETYPES.map((a, i) => {
            const side = i % 2 === 0 ? "left" : "right";
            return (
              <Reveal key={a.serial} delay={0.05 + i * 0.05}>
                <SpotlightCard as="article" className="arch-card" data-side={side}>
                  <div className="arch-sigil-wrap">
                    <ArchetypeSigil archetype={a.name} size={72} />
                  </div>
                  <div className="arch-body">
                    <div
                      className="arch-meta-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: 10,
                          letterSpacing: "0.16em",
                          color: TEXT_LO,
                          textTransform: "uppercase",
                        }}
                      >
                        {a.serial}
                      </span>
                      <span
                        aria-hidden
                        style={{ color: TEXT_LO, fontSize: 10 }}
                      >
                        ·
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: 10,
                          letterSpacing: "0.10em",
                          textTransform: "uppercase",
                          color: ACCENT,
                          fontWeight: 600,
                        }}
                      >
                        {a.rarity} of users
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-barlow-condensed), sans-serif",
                        fontWeight: 900,
                        fontStyle: "italic",
                        fontSize: 28,
                        letterSpacing: "-0.015em",
                        color: TEXT_HI,
                        lineHeight: 1.0,
                        margin: "0 0 8px",
                      }}
                    >
                      {a.name}
                    </h3>
                    <div
                      className="arch-bullet-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: 10,
                          height: 1,
                          background: ACCENT,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-apercu), sans-serif",
                          fontSize: 12.5,
                          color: TEXT_MID,
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {a.signature}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontSize: 14,
                        color: TEXT_MID,
                        lineHeight: 1.55,
                        margin: 0,
                      }}
                    >
                      {a.hook}
                    </p>
                    <ArchetypeMicroMockup archetype={a.name} />
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>

        {/* Locked "Yours" — keystone tile, full-width below the mirror */}
        <Reveal delay={0.05 + ARCHETYPES.length * 0.05}>
          <SpotlightCard
            className="arch-card arch-locked"
            intensity={0.22}
            radius={520}
            style={{
              marginTop: 18,
              gridTemplateColumns: "1fr",
              gap: 18,
              padding: 28,
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <ArchetypeSigil archetype="locked" size={84} />
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  color: ACCENT,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                ARC·07 · Locked
              </span>
            </div>
            <div style={{ maxWidth: 520, margin: "0 auto" }}>
              <h3
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: 32,
                  letterSpacing: "-0.015em",
                  color: TEXT_HI,
                  lineHeight: 1.0,
                  margin: "0 0 10px",
                }}
              >
                Yours.
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 15,
                  color: TEXT_MID,
                  lineHeight: 1.55,
                  margin: "0 0 22px",
                }}
              >
                The quiz is seven questions. Your archetype, weekly cadence, and
                first plan are ready before you finish your coffee — and you only
                belong to one.
              </p>
              <Link
                href="/quiz"
                onClick={() => trackEvent("funnel_start", { source: "landing_archetype" })}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 18px",
                  borderRadius: 12,
                  background: ACCENT,
                  color: "#060912",
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                Unlock yours
                <span aria-hidden style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>→</span>
              </Link>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
