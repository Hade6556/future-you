"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

type Testimonial = {
  name: string;
  photo: string;
  daysActive: number;
  quote: string;
  goal: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Maya R.",
    photo: "/mock/people/maya-r.png",
    daysActive: 84,
    quote:
      "Down 9kg in 11 weeks. First time it stuck — the plan adjusted itself the days I couldn't show up.",
    goal: "Health · Strategist",
  },
  {
    name: "James K.",
    photo: "/mock/people/james-k.png",
    daysActive: 67,
    quote:
      "Got the promotion I'd been chasing for two years. The daily action was tiny — but I never missed it.",
    goal: "Career · Endurance",
  },
  {
    name: "Sarah J.",
    photo: "/mock/people/sarah-jones.jpg",
    daysActive: 92,
    quote:
      "84-day journaling streak. I'd never made it past week 3 before. The morning nudge is the thing.",
    goal: "Mindset · Steady",
  },
  {
    name: "Mateo A.",
    photo: "/mock/people/mateo-a.jpg",
    daysActive: 58,
    quote:
      "Saved €4,200 in 8 weeks following the money plan. It's just spreadsheets, but Behavio makes me actually do them.",
    goal: "Finance · Guardian",
  },
  {
    name: "Priya M.",
    photo: "/mock/people/priya-m.png",
    daysActive: 45,
    quote:
      "Picked up running for the first time at 38. Started at 1km. Did my first 10K last weekend.",
    goal: "Health · Explorer",
  },
];

function StarRow({ size = 11 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12" fill="#F5C518">
          <path d="M6 0l1.76 3.64L12 4.24 8.88 7.2l.72 4.32L6 9.48 2.4 11.52l.72-4.32L0 4.24l4.24-.6z" />
        </svg>
      ))}
    </span>
  );
}

export default function ProofStack() {
  return (
    <section style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div className="landing-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          style={{ textAlign: "center", marginBottom: 36 }}
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
            Real people · Real plans
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
            What changes after <span style={{ color: ACCENT }}>day 30.</span>
          </h2>
        </motion.div>

        <style>{`
          .proof-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 14px;
          }
          @media (min-width: 768px) {
            .proof-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
          }
        `}</style>

        <div className="proof-grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              style={{
                margin: 0,
                padding: 22,
                borderRadius: 20,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <Image
                src={t.photo}
                alt={t.name}
                width={56}
                height={56}
                loading="lazy"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid rgba(255,255,255,0.10)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <StarRow size={11} />
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: accentRgba(0.10),
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 10,
                      color: ACCENT,
                      letterSpacing: "0.06em",
                    }}
                  >
                    Day {t.daysActive}
                  </span>
                </div>
                <blockquote
                  style={{
                    margin: "0 0 10px",
                    fontFamily: "var(--font-apercu), sans-serif",
                    fontSize: 15,
                    color: TEXT_HI,
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption
                  style={{
                    fontFamily: "var(--font-apercu), sans-serif",
                    fontSize: 12,
                    color: TEXT_MID,
                  }}
                >
                  <span style={{ color: TEXT_HI, fontWeight: 600 }}>{t.name}</span>
                  <span style={{ color: TEXT_LO }}> · </span>
                  {t.goal}
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
