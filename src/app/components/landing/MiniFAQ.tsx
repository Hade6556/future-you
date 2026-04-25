"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Reveal from "./Reveal";
import { ACCENT, TEXT_HI, TEXT_MID } from "@/app/theme";

const FAQ = [
  {
    q: "How long does it actually take?",
    a: "Three minutes for the seven-question quiz. Your archetype, weekly cadence, and first plan are generated and on your calendar within the next minute.",
  },
  {
    q: "Is it really free?",
    a: "Yes. The quiz, your archetype, and your first 90-day plan are free forever. The optional upgrade unlocks daily AI coaching check-ins and two-way calendar sync.",
  },
  {
    q: "Will this work if my schedule is unpredictable?",
    a: "That's the case it's built for. Behavio asks how your week actually looks — including the parts that are unstable — and re-paces every time you skip. There's no streak to break.",
  },
  {
    q: "What if it doesn't fit my life after a week?",
    a: "Tell the plan. There's a 30-second 'this isn't working' input on every day card; the plan re-bases overnight on what you said. If it still doesn't fit, cancel without losing what you wrote.",
  },
  {
    q: "What happens after the 90 days?",
    a: "You get a 90-day review — what scaled, what stalled, what surprised you. From there the plan re-bases for the next phase. Most users keep going on a new goal area; the system stays the same.",
  },
  {
    q: "Where does my data live?",
    a: "EU-hosted (Frankfurt). GDPR-compliant. We don't sell behavioral data, ever. You can export everything in a single zip and delete your account from settings.",
  },
];

export default function MiniFAQ() {
  return (
    <section id="faq" style={{ paddingTop: 88, paddingBottom: 88, scrollMarginTop: 96 }}>
      <div className="landing-section-inner" style={{ maxWidth: 820 }}>
        <Reveal>
          <div style={{ marginBottom: 36 }}>
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
              ↳ Common questions
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
              Before you{" "}
              <span style={{ fontStyle: "italic", color: ACCENT }}>click.</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <Accordion
            className="border-y border-white/[0.06]"
            style={
              {
                ["--accent" as string]: ACCENT,
              } as React.CSSProperties
            }
          >
            {FAQ.map((item) => (
              <AccordionItem
                key={item.q}
                value={item.q}
                className="border-b border-white/[0.06] last:border-b-0"
              >
                <AccordionTrigger
                  className="!py-5 !text-base !font-semibold !text-white !no-underline hover:!no-underline"
                  style={{
                    fontFamily: "var(--font-apercu), sans-serif",
                    color: TEXT_HI,
                    letterSpacing: "-0.005em",
                    fontSize: 16,
                  }}
                >
                  {item.q}
                </AccordionTrigger>
                <AccordionContent
                  style={{
                    fontFamily: "var(--font-apercu), sans-serif",
                    color: TEXT_MID,
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    paddingRight: 32,
                  }}
                >
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
