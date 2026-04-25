"use client";

import { Check, X } from "lucide-react";
import Reveal from "./Reveal";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

const NEGATIVE = "#FF5555";
const negRgba = (a: number) => `rgba(255,85,85,${a})`;

const ROWS: { feature: string; tracker: string; behavio: string }[] = [
  {
    feature: "When you skip a day",
    tracker: "Your streak dies. Guilt notification.",
    behavio: "Plan reschedules. Streak survives.",
  },
  {
    feature: "What it shows you",
    tracker: "Everything you failed to do",
    behavio: "The next move that's actually doable",
  },
  {
    feature: "Personalization",
    tracker: "One checklist. Same for everyone.",
    behavio: "Built around how you actually work",
  },
  {
    feature: "Calendar",
    tracker: "You schedule it. Or you don't.",
    behavio: "On your calendar by tonight",
  },
  {
    feature: "When you're burned out",
    tracker: "Same load week 1 and week 12",
    behavio: "Eases up when you're running low",
  },
  {
    feature: "After 90 days",
    tracker: "Start over from scratch",
    behavio: "Rebuilds on what actually worked",
  },
];

export default function ComparisonTable() {
  return (
    <section style={{ paddingTop: 88, paddingBottom: 88 }}>
      <div className="landing-section-inner">
        <Reveal offset={10}>
          <div style={{ marginBottom: 36, maxWidth: 820 }}>
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
              ↳ Built different on purpose
            </p>
            <h2
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontSize: "clamp(32px, 4vw, 52px)",
                color: TEXT_HI,
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                margin: "0 0 18px",
              }}
            >
              Other apps catalogue your failures.{" "}
              <span style={{ fontStyle: "italic", color: ACCENT }}>Behavio rebuilds your week.</span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: "clamp(15px, 1.3vw, 17px)",
                color: TEXT_MID,
                lineHeight: 1.55,
                margin: 0,
                maxWidth: 620,
              }}
            >
              When you slip — and you will — most plans punish you.
              This one quietly recalculates.
            </p>
          </div>
        </Reveal>

        <Reveal offset={14} delay={0.1}>
          <style>{`
            .cmp-table {
              position: relative;
              border: 1px solid rgba(255,255,255,0.07);
              border-radius: 20px;
              overflow: hidden;
              background: linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005));
            }
            .cmp-row {
              display: grid;
              grid-template-columns: 1fr;
              gap: 0;
              border-top: 1px solid rgba(255,255,255,0.05);
            }
            .cmp-row:first-of-type { border-top: 0; }
            .cmp-cell {
              padding: 18px 20px;
              border-top: 1px solid rgba(255,255,255,0.04);
            }
            .cmp-row > .cmp-cell:first-child { border-top: 0; }
            @media (min-width: 768px) {
              .cmp-row { grid-template-columns: 1.1fr 1.4fr 1.55fr; }
              .cmp-row > .cmp-cell { border-top: 0; border-left: 1px solid rgba(255,255,255,0.05); }
              .cmp-row > .cmp-cell:first-child { border-left: 0; }
              .cmp-cell { padding: 20px 24px; }
            }
            .cmp-head {
              background: rgba(255,255,255,0.02);
            }
            .cmp-cell-behavio {
              background:
                linear-gradient(180deg, ${accentRgba(0.09)}, ${accentRgba(0.05)});
              box-shadow: inset 2px 0 0 ${ACCENT};
            }
            .cmp-cell-behavio-head {
              background: linear-gradient(180deg, ${accentRgba(0.18)}, ${accentRgba(0.08)});
              box-shadow:
                inset 2px 0 0 ${ACCENT},
                inset 0 -1px 0 ${accentRgba(0.25)};
            }
            .cmp-cell-tracker {
              background: linear-gradient(180deg, ${negRgba(0.04)}, ${negRgba(0.015)});
            }
          `}</style>

          <div className="cmp-table">
            <div className="cmp-row cmp-head">
              <div className="cmp-cell">
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: TEXT_LO,
                  }}
                >
                  When
                </span>
              </div>
              <div className="cmp-cell cmp-cell-tracker">
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: negRgba(0.85),
                  }}
                >
                  Habit trackers
                </span>
              </div>
              <div
                className="cmp-cell cmp-cell-behavio cmp-cell-behavio-head"
                style={{ display: "flex", alignItems: "center" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: ACCENT,
                    fontWeight: 700,
                  }}
                >
                  Behavio
                </span>
              </div>
            </div>

            {ROWS.map((row, i) => (
              <div key={i} className="cmp-row">
                <div className="cmp-cell">
                  <span
                    style={{
                      fontFamily: "var(--font-apercu), sans-serif",
                      fontWeight: 600,
                      fontSize: 14.5,
                      color: TEXT_HI,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {row.feature}
                  </span>
                </div>
                <div className="cmp-cell cmp-cell-tracker" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: 18,
                      height: 18,
                      borderRadius: 999,
                      background: negRgba(0.18),
                      border: `1px solid ${negRgba(0.45)}`,
                      color: NEGATIVE,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 2,
                      boxShadow: `0 0 12px ${negRgba(0.25)}`,
                    }}
                  >
                    <X size={11} strokeWidth={3} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-apercu), sans-serif",
                      fontSize: 14,
                      color: "rgba(255, 200, 200, 0.78)",
                      lineHeight: 1.5,
                    }}
                  >
                    {row.tracker}
                  </span>
                </div>
                <div className="cmp-cell cmp-cell-behavio" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: 18,
                      height: 18,
                      borderRadius: 999,
                      background: ACCENT,
                      color: "#060912",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 2,
                      boxShadow: `0 0 14px ${accentRgba(0.45)}`,
                    }}
                  >
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-apercu), sans-serif",
                      fontSize: 14.5,
                      color: TEXT_HI,
                      lineHeight: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    {row.behavio}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
