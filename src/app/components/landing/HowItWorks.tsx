"use client";

import { ReactNode } from "react";
import Reveal from "./Reveal";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO } from "@/app/theme";
import PlanCardMockup from "./mockups/PlanCardMockup";
import QuizMockup from "./mockups/QuizMockup";
import CalendarMockup from "./mockups/CalendarMockup";

type Step = {
  index: string;
  title: string;
  body: string;
  bullets: string[];
  visual: ReactNode;
  reverse?: boolean;
};

const STEPS: Step[] = [
  {
    index: "01",
    title: "Take a 3-minute quiz.",
    body: "Seven questions about your goal, your week, and what's quietly been blocking you. No essays, no productivity-bro jargon.",
    bullets: [
      "Pick the one area of life that comes first",
      "Tell us your real schedule, not your aspirational one",
      "Answer how you've actually responded to setbacks",
    ],
    visual: <QuizMockup />,
  },
  {
    index: "02",
    title: "Get your plan instantly.",
    body: "The plan is sequenced for your archetype. Three phases, ninety days. Each day is one card with one anchor action — never a blank checklist.",
    bullets: [
      "Phase 1: get the system running",
      "Phase 2: stretch what's already working",
      "Phase 3: scale, document, anchor",
    ],
    visual: <PlanCardMockup archetype="Strategist" day={12} variant="full" />,
    reverse: true,
  },
  {
    index: "03",
    title: "It runs in your calendar.",
    body: "Behavio writes the day's anchor action straight into your calendar at the time you said you're free. Skip a day — the plan reschedules. The streak doesn't break.",
    bullets: [
      "Two-way Google Calendar sync",
      "Auto-reschedules around real conflicts",
      "Adapts pacing if your energy drops three days running",
    ],
    visual: <CalendarMockup />,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ paddingTop: 88, paddingBottom: 88, scrollMarginTop: 96 }}>
      <div className="landing-section-inner">
        <Reveal>
          <div style={{ marginBottom: 48, maxWidth: 760 }}>
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
              ↳ How it works
            </p>
            <h2
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontSize: "clamp(32px, 4vw, 52px)",
                color: TEXT_HI,
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              From scattered to{" "}
              <span style={{ fontStyle: "italic", color: ACCENT }}>scheduled</span> — in three steps.
            </h2>
          </div>
        </Reveal>

        <style>{`
          .hiw-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 32px;
            align-items: center;
            padding: 28px 0;
            border-top: 1px solid rgba(255,255,255,0.06);
          }
          @media (min-width: 900px) {
            .hiw-row { grid-template-columns: 1fr 1fr; gap: 64px; padding: 56px 0; }
            .hiw-row[data-reverse="true"] .hiw-text { order: 2; }
            .hiw-row[data-reverse="true"] .hiw-visual { order: 1; }
          }
          .hiw-visual {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>

        <div>
          {STEPS.map((s, i) => (
            <Reveal key={s.index} delay={0.04 + i * 0.06}>
              <div className="hiw-row" data-reverse={s.reverse ? "true" : "false"}>
                <div className="hiw-text">
                  <div
                    style={{
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontWeight: 900,
                      fontStyle: "italic",
                      fontSize: 64,
                      lineHeight: 1,
                      color: "transparent",
                      WebkitTextStroke: `1px ${TEXT_LO}`,
                      letterSpacing: "-0.02em",
                      marginBottom: 14,
                    }}
                  >
                    {s.index}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(26px, 2.6vw, 34px)",
                      color: TEXT_HI,
                      lineHeight: 1.05,
                      letterSpacing: "-0.015em",
                      margin: "0 0 14px",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-apercu), sans-serif",
                      fontSize: 16,
                      color: TEXT_MID,
                      lineHeight: 1.55,
                      margin: "0 0 18px",
                      maxWidth: 480,
                    }}
                  >
                    {s.body}
                  </p>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "flex-start",
                          fontFamily: "var(--font-apercu), sans-serif",
                          fontSize: 14,
                          color: TEXT_HI,
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            flexShrink: 0,
                            marginTop: 9,
                            width: 6,
                            height: 1,
                            background: ACCENT,
                          }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hiw-visual">{s.visual}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
