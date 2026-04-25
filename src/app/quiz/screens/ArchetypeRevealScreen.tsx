"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import CTAButton from "../components/CTAButton";
import { useQuizStore, type Archetype } from "../store/quizStore";
import { calculateArchetype, ARCHETYPE_DESCRIPTIONS } from "../utils/archetypeScoring";
import { trackAnswerSelected } from "../utils/analytics";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";
import ArchetypeSigil from "@/app/components/landing/ArchetypeSigil";
import type { ArchetypeKey } from "@/app/components/landing/mockups/PlanCardMockup";

type RevealMeta = {
  serial: string;
  rarity: string;
  pull: { lead: string; accent1: string; mid: string; accent2: string };
  challenge: string;
  sigil: ArchetypeKey;
};

const REVEAL_META: Record<Archetype, RevealMeta> = {
  "Laser Strategist": {
    serial: "ARC·01",
    rarity: "18%",
    pull: { lead: "You think in", accent1: "systems.", mid: "You move with", accent2: "precision." },
    challenge: "Getting started when the plan still feels incomplete.",
    sigil: "Strategist",
  },
  "Steady Builder": {
    serial: "ARC·02",
    rarity: "22%",
    pull: { lead: "You build through", accent1: "consistency.", mid: "You show up when", accent2: "others quit." },
    challenge: "Staying motivated when progress feels invisible.",
    sigil: "Steady Builder",
  },
  "Endurance Engine": {
    serial: "ARC·03",
    rarity: "14%",
    pull: { lead: "You're built for the", accent1: "long game.", mid: "You push when", accent2: "others stop." },
    challenge: "Recovery. You burn hot and crash hard.",
    sigil: "Endurance Engine",
  },
  "Creative Spark": {
    serial: "ARC·04",
    rarity: "11%",
    pull: { lead: "Your energy is", accent1: "electric", mid: "when you're", accent2: "inspired." },
    challenge: "Finishing what you start before the next idea hits.",
    sigil: "Creative Spark",
  },
  Guardian: {
    serial: "ARC·05",
    rarity: "17%",
    pull: { lead: "You show up for everyone —", accent1: "except yourself.", mid: "Empathy is your", accent2: "greatest strength." },
    challenge: "Putting your own growth first, without guilt.",
    sigil: "Guardian",
  },
  Explorer: {
    serial: "ARC·06",
    rarity: "13%",
    pull: { lead: "You grow by", accent1: "experiencing everything.", mid: "Routine feels like a", accent2: "cage." },
    challenge: "Going deep instead of wide.",
    sigil: "Explorer",
  },
};

/** Strip leading emoji + whitespace so trait labels read as clean editorial nameplates. */
function stripLeadingEmoji(s: string): string {
  return s.replace(/^[\p{Extended_Pictographic}\s]+/u, "").trim();
}

export default function ArchetypeRevealScreen({ onNext }: { onNext: () => void }) {
  const answers = useQuizStore((s) => s.answers);
  const setArchetype = useQuizStore((s) => s.setArchetype);

  const archetype = calculateArchetype(answers);
  const info = ARCHETYPE_DESCRIPTIONS[archetype];
  const meta = REVEAL_META[archetype];

  useEffect(() => {
    setArchetype(archetype);
    trackAnswerSelected("archetype", archetype);
  }, [archetype, setArchetype]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Eyebrow row — serial + revealed */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: ACCENT,
            fontWeight: 600,
          }}
        >
          ↳ {meta.serial} · Revealed
        </span>
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10.5,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: TEXT_LO,
          }}
        >
          {meta.rarity} of users
        </span>
      </div>

      {/* Sigil + name */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{
          padding: "26px 22px 22px",
          borderRadius: 22,
          background: `linear-gradient(180deg, ${accentRgba(0.10)}, ${accentRgba(0.02)})`,
          border: `1px solid ${accentRgba(0.30)}`,
          marginBottom: 22,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(70% 60% at 50% 0%, ${accentRgba(0.18)}, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{ flexShrink: 0 }}
          >
            <ArchetypeSigil archetype={meta.sigil} size={88} />
          </motion.div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 9.5,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: TEXT_LO,
                margin: "0 0 6px",
              }}
            >
              You are
            </p>
            <h1
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(30px, 7vw, 40px)",
                color: TEXT_HI,
                margin: 0,
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
              }}
            >
              {archetype}
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Pull-quote identity statement */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(22px, 5.4vw, 30px)",
          lineHeight: 1.05,
          color: TEXT_HI,
          margin: "0 0 14px",
          letterSpacing: "-0.02em",
        }}
      >
        {meta.pull.lead}{" "}
        <span style={{ fontStyle: "italic", color: ACCENT }}>{meta.pull.accent1}</span>{" "}
        {meta.pull.mid}{" "}
        <span style={{ fontStyle: "italic", color: ACCENT }}>{meta.pull.accent2}</span>
      </motion.h2>

      {/* Operational challenge */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontSize: 14.5,
          color: TEXT_MID,
          margin: "0 0 22px",
          lineHeight: 1.55,
          paddingLeft: 14,
          borderLeft: `1px solid ${accentRgba(0.30)}`,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: TEXT_LO,
            display: "block",
            marginBottom: 4,
          }}
        >
          Biggest challenge
        </span>
        {meta.challenge}
      </motion.p>

      {/* Trait nameplates */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 32,
          flexWrap: "wrap",
        }}
      >
        {info.traits.map((trait) => {
          const label = stripLeadingEmoji(trait);
          return (
            <span
              key={trait}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: 10,
                background: accentRgba(0.08),
                border: `1px solid ${accentRgba(0.25)}`,
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: 14,
                color: ACCENT,
                letterSpacing: "0.005em",
                lineHeight: 1,
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          );
        })}
      </motion.div>

      <CTAButton label="This is exactly me →" onClick={onNext} />
    </motion.div>
  );
}
