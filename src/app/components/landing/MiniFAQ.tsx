"use client";

import { motion } from "framer-motion";
import { ACCENT, TEXT_HI, TEXT_MID, accentRgba } from "@/app/theme";

const FAQ = [
  {
    q: "How long does it take?",
    a: "Three minutes for the quiz. Your archetype and first plan are generated instantly after.",
  },
  {
    q: "Is it really free?",
    a: "Yes — the quiz, your archetype, and your first 90-day plan are free. You can stay free forever, or upgrade later for daily AI coaching and calendar sync.",
  },
  {
    q: "What if it doesn't fit my life?",
    a: "The plan adapts daily. Skip a day, the system reschedules — no judgment, no broken streaks. Your archetype's pacing is built in, so you never feel like you're behind.",
  },
  {
    q: "How is this different from a habit tracker?",
    a: "Trackers tell you what you didn't do. Behavio tells you the next thing to do — a single, scheduled action that fits your archetype, your goal, and the time you actually have today.",
  },
];

export default function MiniFAQ() {
  return (
    <section style={{ paddingTop: 56, paddingBottom: 56 }}>
      <div className="landing-section-inner" style={{ maxWidth: 760 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              color: ACCENT,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              margin: "0 0 12px",
            }}
          >
            Common questions
          </p>
          <h2
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(28px, 3.4vw, 40px)",
              color: TEXT_HI,
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Before you click.
          </h2>
        </motion.div>

        <style>{`
          .faq-item {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px;
            padding: 18px 22px;
            transition: border-color 0.18s, background 0.18s;
          }
          .faq-item[open] {
            border-color: ${accentRgba(0.4)};
            background: ${accentRgba(0.05)};
          }
          .faq-item > summary {
            list-style: none;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            font-family: var(--font-apercu), sans-serif;
            font-weight: 600;
            font-size: 16px;
            color: ${TEXT_HI};
            letter-spacing: -0.01em;
          }
          .faq-item > summary::-webkit-details-marker { display: none; }
          .faq-item > summary::after {
            content: "+";
            color: ${ACCENT};
            font-size: 22px;
            line-height: 1;
            font-weight: 300;
            transition: transform 0.2s;
          }
          .faq-item[open] > summary::after { content: "−"; }
          .faq-item p {
            margin: 14px 0 0;
            font-family: var(--font-apercu), sans-serif;
            font-size: 14.5px;
            color: ${TEXT_MID};
            line-height: 1.6;
          }
        `}</style>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQ.map((item, i) => (
            <motion.details
              key={item.q}
              className="faq-item"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
