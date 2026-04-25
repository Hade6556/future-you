"use client";

import { motion } from "framer-motion";
import { Target, Layers, Mountain, Sparkles, Shield, Compass, type LucideIcon } from "lucide-react";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

type Archetype = {
  name: string;
  blurb: string;
  Icon: LucideIcon;
};

const ARCHETYPES: Archetype[] = [
  { name: "Strategist", blurb: "Sees the long game. Wins by sequencing.", Icon: Target },
  { name: "Steady Builder", blurb: "Compounds small wins into big ones.", Icon: Layers },
  { name: "Endurance Engine", blurb: "Outlasts obstacles. Quiet relentlessness.", Icon: Mountain },
  { name: "Creative Spark", blurb: "Designs the path others didn't see.", Icon: Sparkles },
  { name: "Guardian", blurb: "Protects what matters. Builds with care.", Icon: Shield },
  { name: "Explorer", blurb: "Finds energy in new ground.", Icon: Compass },
];

function scrollToFinalCTA() {
  document.getElementById("final-cta")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export default function ArchetypePreview() {
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
            The reveal
          </p>
          <h2
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(28px, 3.6vw, 44px)",
              color: TEXT_HI,
              lineHeight: 1.1,
              margin: "0 0 12px",
              letterSpacing: "-0.01em",
            }}
          >
            You&apos;re one of <span style={{ color: ACCENT }}>6 archetypes.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 15,
              color: TEXT_MID,
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            Each one moves through goals differently. Find yours, get the plan that fits — not generic advice.
          </p>
        </motion.div>

        <style>{`
          .archetype-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
          @media (min-width: 768px) {
            .archetype-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
          }
          @media (min-width: 1024px) {
            .archetype-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          }
          .archetype-card {
            cursor: pointer;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.03);
            border-radius: 18px;
            padding: 18px 16px;
            transition: transform 0.18s, border-color 0.18s, background 0.18s;
            text-align: center;
            backdrop-filter: blur(8px);
          }
          .archetype-card:hover {
            transform: translateY(-3px);
            border-color: ${accentRgba(0.4)};
            background: ${accentRgba(0.06)};
          }
          .archetype-card.locked {
            border-color: ${accentRgba(0.5)};
            background: ${accentRgba(0.10)};
          }
        `}</style>

        <div className="archetype-grid">
          {ARCHETYPES.map((a, i) => (
            <motion.button
              key={a.name}
              type="button"
              onClick={scrollToFinalCTA}
              className="archetype-card"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  margin: "0 auto 10px",
                  borderRadius: "50%",
                  background: accentRgba(0.10),
                  border: `1px solid ${accentRgba(0.22)}`,
                  color: ACCENT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <a.Icon size={26} strokeWidth={1.6} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: TEXT_HI,
                  marginBottom: 4,
                  letterSpacing: "-0.01em",
                }}
              >
                {a.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 12,
                  color: TEXT_MID,
                  lineHeight: 1.4,
                }}
              >
                {a.blurb}
              </div>
            </motion.button>
          ))}

          {/* Locked "Yours" card */}
          <motion.button
            type="button"
            onClick={scrollToFinalCTA}
            className="archetype-card locked"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: ARCHETYPES.length * 0.04 }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto 10px",
                borderRadius: "50%",
                background: accentRgba(0.18),
                border: `1px dashed ${accentRgba(0.5)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 800,
                color: ACCENT,
              }}
            >
              ?
            </div>
            <div
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: ACCENT,
                marginBottom: 4,
              }}
            >
              Yours
            </div>
            <div
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 12,
                color: TEXT_LO,
                lineHeight: 1.4,
              }}
            >
              Take the quiz to unlock
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
