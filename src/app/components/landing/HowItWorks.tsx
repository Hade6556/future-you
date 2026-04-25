"use client";

import { motion } from "framer-motion";
import { ClipboardList, Map as MapIcon, CalendarCheck } from "lucide-react";
import { ACCENT, TEXT_HI, TEXT_MID, accentRgba } from "@/app/theme";

const STEPS = [
  {
    n: "01",
    icon: ClipboardList,
    title: "Take the quiz",
    body: "3 minutes. We map your goal, your archetype, and what's blocking you.",
    meta: "3 min",
  },
  {
    n: "02",
    icon: MapIcon,
    title: "Get your plan",
    body: "An AI-built 90-day plan, structured into phases and daily steps that fit your life.",
    meta: "Instant",
  },
  {
    n: "03",
    icon: CalendarCheck,
    title: "Show up daily",
    body: "Auto-scheduled into your calendar. Skip a day — the plan adapts. No judgment.",
    meta: "Auto-synced",
  },
];

export default function HowItWorks() {
  return (
    <section style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div className="landing-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          style={{ textAlign: "center", marginBottom: 40 }}
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
            How it works
          </p>
          <h2
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(28px, 3.6vw, 44px)",
              color: TEXT_HI,
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            From <span style={{ color: ACCENT }}>scattered</span> to scheduled — in 3 steps.
          </h2>
        </motion.div>

        <style>{`
          .hiw-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
          @media (min-width: 768px) {
            .hiw-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
          }
        `}</style>

        <div className="hiw-grid">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{
                position: "relative",
                padding: 24,
                borderRadius: 22,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: accentRgba(0.12),
                    border: `1px solid ${accentRgba(0.30)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: ACCENT,
                  }}
                >
                  <s.icon size={20} strokeWidth={1.8} />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 11,
                    color: "rgba(160,180,210,0.55)",
                    letterSpacing: "0.10em",
                  }}
                >
                  {s.n}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontWeight: 600,
                  fontSize: 19,
                  color: TEXT_HI,
                  margin: "0 0 8px",
                  letterSpacing: "-0.01em",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 14,
                  color: TEXT_MID,
                  lineHeight: 1.55,
                  margin: "0 0 14px",
                }}
              >
                {s.body}
              </p>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: accentRgba(0.08),
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  color: ACCENT,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                }}
              >
                {s.meta}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
