"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizOption } from "../../data/quiz";
import { usePlanStore } from "../../state/planStore";
import {
  buildWinCelebrationLines,
  WIN_CELEBRATION_BASELINE,
} from "../../utils/winCelebrationThemes";

/* ─── Design tokens ─── */
const LIME = "#C8FF00";
const NAVY = "#0A1628";
const TEXT_HI = "rgba(235,242,255,0.92)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const TEXT_LO = "rgba(120,155,195,0.40)";
const GLASS = "rgba(255,255,255,0.07)";
const GLASS_BORDER = "rgba(255,255,255,0.14)";

/* ─── Wordmark ─── */
function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 2, lineHeight: 1 }}>
      <span
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: size,
          color: LIME,
          letterSpacing: "0.02em",
        }}
      >
        behavio
      </span>
    </span>
  );
}

/* ══════════════════════════════════════════════════════
   SPLASH STEP — full-screen hero, single CTA
══════════════════════════════════════════════════════ */

export function SplashStep({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: "0 28px 40px",
        gap: 0,
      }}
    >
      {/* Logo */}
      <div style={{ position: "absolute", top: "max(3.5rem, env(safe-area-inset-top, 3.5rem))", left: 28 }}>
        <Wordmark size={24} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        style={{ marginBottom: 18 }}
      >
        <h1
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: 50,
            lineHeight: 0.96,
            letterSpacing: "-0.03em",
            color: TEXT_HI,
            margin: "0 0 18px",
          }}
        >
          Your{" "}
          <em style={{ fontStyle: "normal", color: LIME }}>best self</em>
          {" "}is already<br />in there.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body), Georgia, serif",
            fontWeight: 400,
            fontSize: 15,
            lineHeight: 1.65,
            color: TEXT_MID,
            margin: "0 0 36px",
            maxWidth: 270,
          }}
        >
          Answer a few quick questions. We&apos;ll build a personal plan to close the gap — fast.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}
      >
        <button
          onClick={onContinue}
          style={{
            width: "100%",
            background: LIME,
            color: "#060912",
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: 100,
            padding: "20px 32px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          Let&apos;s do this
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: TEXT_LO,
            margin: 0,
            textAlign: "center",
          }}
        >
          2 min · private · free
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   TWO-COL CARDS — gender selection
══════════════════════════════════════════════════════ */

type TwoColCardsProps = {
  options: QuizOption[];
  onSelect: (value: number) => void;
};

export function TwoColCards({ options, onSelect }: TwoColCardsProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onSelect(idx), 300);
  };

  return (
    <div style={{ display: "flex", gap: 12, width: "100%" }}>
      {options.map((opt, i) => {
        const isSelected = selected === i;
        return (
          <motion.button
            key={i}
            onClick={() => pick(i)}
            animate={{
              background: isSelected ? "rgba(200,255,0,0.12)" : GLASS,
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              padding: "32px 16px",
              borderRadius: 20,
              border: `1px solid ${isSelected ? LIME : GLASS_BORDER}`,
              background: isSelected ? "rgba(200,255,0,0.12)" : GLASS,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              cursor: "pointer",
              minHeight: 150,
            }}
          >
            {opt.icon && (
              <span style={{ fontSize: 36, lineHeight: 1 }}>{opt.icon}</span>
            )}
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: isSelected ? LIME : TEXT_HI,
              }}
            >
              {opt.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LIST ROWS — field, feeling, goal, timeline
══════════════════════════════════════════════════════ */

type ListRowsProps = {
  options: QuizOption[];
  onSelect: (value: number) => void;
};

export function ListRows({ options, onSelect }: ListRowsProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onSelect(idx), 280);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      {options.map((opt, i) => {
        const isSelected = selected === i;
        return (
          <motion.button
            key={i}
            onClick={() => pick(i)}
            animate={{
              background: isSelected ? "rgba(200,255,0,0.10)" : GLASS,
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 12,
              border: `1px solid ${isSelected ? "rgba(200,255,0,0.40)" : GLASS_BORDER}`,
              background: isSelected ? "rgba(200,255,0,0.10)" : GLASS,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            {opt.icon && (
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                {opt.icon}
              </span>
            )}
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: isSelected ? LIME : TEXT_HI,
                flex: 1,
              }}
            >
              {opt.label}
            </span>

            {isSelected ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: LIME,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke={NAVY}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            ) : (
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path
                  d="M1 1L7 7L1 13"
                  stroke={TEXT_LO}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MULTI-SELECT — toggle rows + continue
══════════════════════════════════════════════════════ */

type MultiSelectProps = {
  options: QuizOption[];
  onContinue: () => void;
};

export function MultiSelect({ options, onContinue }: MultiSelectProps) {
  const [picked, setPicked] = useState<Set<number>>(() => new Set());

  const toggle = (idx: number) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const canContinue = picked.size > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        {options.map((opt, i) => {
          const on = picked.has(i);
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              animate={{
                background: on ? "rgba(200,255,0,0.10)" : GLASS,
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 18px",
                borderRadius: 14,
                border: `1px solid ${on ? "rgba(200,255,0,0.40)" : GLASS_BORDER}`,
                background: on ? "rgba(200,255,0,0.10)" : GLASS,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
              }}
            >
              {opt.icon && (
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {opt.icon}
                </span>
              )}
              <span
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: on ? LIME : TEXT_HI,
                  flex: 1,
                }}
              >
                {opt.label}
              </span>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: `2px solid ${on ? LIME : TEXT_LO}`,
                  background: on ? LIME : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {on && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke={NAVY}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        type="button"
        onClick={() => canContinue && onContinue()}
        animate={{ opacity: canContinue ? 1 : 0.4 }}
        whileTap={canContinue ? { scale: 0.97 } : {}}
        style={{
          width: "100%",
          background: LIME,
          color: "#060912",
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          borderRadius: 100,
          padding: "20px 32px",
          border: "none",
          cursor: canContinue ? "pointer" : "default",
          boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        Continue
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SLIDER SCALE — discrete labels (e.g. Poor → Great)
══════════════════════════════════════════════════════ */

type SliderScaleProps = {
  scaleLabels: string[];
  onContinue: (value: number) => void;
};

export function SliderScale({ scaleLabels, onContinue }: SliderScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      <div style={{ display: "flex", gap: 6, width: "100%" }}>
        {scaleLabels.map((label, i) => {
          const isSelected = selected === i;
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              animate={{
                background: isSelected ? LIME : GLASS,
              }}
              whileTap={{ scale: 0.96 }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "14px 6px",
                borderRadius: 14,
                border: `1px solid ${isSelected ? LIME : GLASS_BORDER}`,
                background: isSelected ? LIME : GLASS,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                cursor: "pointer",
                minHeight: 72,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 800,
                  fontSize: 18,
                  color: isSelected ? NAVY : TEXT_HI,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: isSelected ? "rgba(6,9,18,0.55)" : TEXT_LO,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            type="button"
            onClick={() => onContinue(selected)}
            style={{
              width: "100%",
              background: LIME,
              color: "#060912",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: 100,
              padding: "20px 32px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            Continue
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   INSIGHT CARD — belief seed / objection handler
══════════════════════════════════════════════════════ */

type InstitutionBadge = { name: string; logo: string };

type InsightCardProps = {
  stat?: string;
  headline: string;
  body?: string;
  ctaLabel?: string;
  avatars?: string[];
  badges?: InstitutionBadge[];
  onContinue: () => void;
};

export function InsightCard({ stat, headline, body, ctaLabel, avatars, badges, onContinue }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}
    >
      {/* Lime-tinted insight card */}
      <div
        style={{
          position: "relative",
          background: "rgba(200,255,0,0.05)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(200,255,0,0.18)",
          borderRadius: 20,
          padding: "24px 22px",
          overflow: "hidden",
        }}
      >
        {/* Top lime highlight */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(200,255,0,0.30), transparent)",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(200,255,0,0.60)",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <span style={{ display: "block", width: 16, height: 1, background: "rgba(200,255,0,0.40)" }} />
          What the data shows
        </div>

        <p
          style={{
            fontFamily: "var(--font-body), Georgia, serif",
            fontWeight: 400,
            fontSize: 15,
            lineHeight: 1.65,
            color: "rgba(235,242,255,0.82)",
            margin: "0 0 16px",
          }}
          dangerouslySetInnerHTML={{
            __html: body
              ? body.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight:500;color:rgba(235,242,255,0.92)">$1</strong>')
              : headline,
          }}
        />

        {/* Logo cluster + "Backed by science" — shown ABOVE the PhD stat when badges exist */}
        {badges && badges.length > 0 && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 18,
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ position: "relative", width: 160, height: 80 }}>
              {badges[1] && (
                <img
                  src={badges[1].logo}
                  alt={badges[1].name}
                  style={{
                    position: "absolute",
                    width: 52,
                    height: 52,
                    objectFit: "contain",
                    left: 0,
                    top: 8,
                    zIndex: 1,
                  }}
                />
              )}
              {badges[2] && (
                <img
                  src={badges[2].logo}
                  alt={badges[2].name}
                  style={{
                    position: "absolute",
                    width: 52,
                    height: 52,
                    objectFit: "contain",
                    right: 0,
                    top: 8,
                    zIndex: 1,
                  }}
                />
              )}
              {badges[0] && (
                <img
                  src={badges[0].logo}
                  alt={badges[0].name}
                  style={{
                    position: "absolute",
                    width: 72,
                    height: 72,
                    objectFit: "contain",
                    left: "50%",
                    top: 0,
                    transform: "translateX(-50%)",
                    zIndex: 3,
                    filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.50))",
                  }}
                />
              )}
            </div>

            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 800,
                fontStyle: "italic",
                fontSize: 22,
                letterSpacing: "-0.02em",
                color: TEXT_HI,
                textAlign: "center",
              }}
            >
              Backed by science.
            </span>

            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: TEXT_LO,
                textAlign: "center",
              }}
            >
              {badges.map((b) => b.name).join(" · ")}
            </span>
          </div>
        )}

        {/* PhD stat — shown below logos when badges exist, or standalone */}
        {stat && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: badges && badges.length > 0 ? "none" : "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "baseline",
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontSize: 34,
                color: LIME,
                letterSpacing: "-0.02em",
              }}
            >
              {stat}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body), Georgia, serif",
                fontWeight: 400,
                fontSize: 13,
                color: TEXT_MID,
              }}
            >
              {headline}
            </span>
          </div>
        )}

        {avatars && avatars.length > 0 && !badges && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", flexShrink: 0 }}>
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #0f1a2e",
                    marginLeft: i === 0 ? 0 : -8,
                    position: "relative",
                    zIndex: avatars.length - i,
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: "var(--font-body), Georgia, serif",
                fontWeight: 400,
                fontSize: 11,
                color: TEXT_LO,
                lineHeight: 1.35,
              }}
            >
              Join thousands transforming their lives
            </span>
          </div>
        )}

        {/* Old duplicate badges block removed — now rendered above the stat */}
      </div>

      <button
        onClick={onContinue}
        style={{
          width: "100%",
          background: LIME,
          color: "#060912",
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          borderRadius: 100,
          padding: "20px 32px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {ctaLabel ?? "Continue"}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   YES/NO PILLS — binary history question
══════════════════════════════════════════════════════ */

type YesNoProps = {
  onSelect: (value: number) => void;
};

export function YesNoPills({ onSelect }: YesNoProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onSelect(idx), 300);
  };

  return (
    <div style={{ display: "flex", gap: 12, width: "100%" }}>
      {["Yes", "No"].map((label, i) => {
        const isSelected = selected === i;
        return (
          <motion.button
            key={i}
            onClick={() => pick(i)}
            animate={{
              background: isSelected ? LIME : GLASS,
            }}
            whileTap={{ scale: 0.96 }}
            style={{
              flex: 1,
              padding: "20px 16px",
              borderRadius: 100,
              border: `1px solid ${isSelected ? LIME : GLASS_BORDER}`,
              background: isSelected ? LIME : GLASS,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              cursor: "pointer",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: isSelected ? NAVY : TEXT_HI,
            }}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   COMMITMENT SCALE — 1–5 tap buttons
══════════════════════════════════════════════════════ */

type CommitmentScaleProps = {
  subtext?: string;
  onSelect: (value: number) => void;
};

export function CommitmentScale({ subtext, onSelect }: CommitmentScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {subtext && (
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: TEXT_LO,
            textAlign: "center",
            margin: 0,
          }}
        >
          {subtext}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, width: "100%" }}>
        {[1, 2, 3, 4, 5].map((val) => {
          const isSelected = selected === val;
          return (
            <motion.button
              key={val}
              onClick={() => setSelected(val)}
              animate={{
                background: isSelected ? LIME : GLASS,
              }}
              whileTap={{ scale: 0.92 }}
              style={{
                flex: 1,
                aspectRatio: "1",
                borderRadius: 14,
                border: `1px solid ${isSelected ? LIME : GLASS_BORDER}`,
                background: isSelected ? LIME : GLASS,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                cursor: "pointer",
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 800,
                fontSize: 22,
                color: isSelected ? NAVY : TEXT_HI,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {val}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => onSelect(selected)}
            style={{
              width: "100%",
              background: LIME,
              color: "#060912",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: 100,
              padding: "20px 32px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            That&apos;s my commitment
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LIVE COUNTER CARD — animated user count + pulsing dot
══════════════════════════════════════════════════════ */

export function LiveCounterCard({
  avatars,
  ctaLabel = "I'm ready",
  onContinue,
}: {
  avatars: string[];
  ctaLabel?: string;
  onContinue: () => void;
}) {
  const TARGET = 595588;
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = TARGET - 588;
    const duration = 1800;
    const startTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (TARGET - start) * eased));
      if (progress < 1) animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: GLASS,
          border: `1px solid ${GLASS_BORDER}`,
          borderRadius: 20,
          padding: "36px 28px 32px",
          width: "100%",
          maxWidth: 360,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Scattered avatar cloud background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.08,
            pointerEvents: "none",
          }}
        >
          {avatars.slice(0, 6).map((src, i) => {
            const positions = [
              { top: "8%", left: "12%" },
              { top: "15%", right: "10%" },
              { top: "55%", left: "6%" },
              { top: "60%", right: "14%" },
              { top: "35%", left: "80%" },
              { top: "78%", left: "45%" },
            ];
            return (
              <img
                key={i}
                src={src}
                alt=""
                style={{
                  position: "absolute",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  objectFit: "cover",
                  filter: "blur(1px)",
                  ...positions[i],
                }}
              />
            );
          })}
        </div>

        {/* LIVE badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginBottom: 20,
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#4ADE80",
              boxShadow: "0 0 8px rgba(74,222,128,0.6)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#4ADE80",
            }}
          >
            LIVE
          </span>
        </div>

        {/* Counter */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 800,
              fontSize: 64,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: LIME,
              marginBottom: 8,
            }}
          >
            {count.toLocaleString()}
          </div>
          <div
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontWeight: 500,
              fontSize: 16,
              color: TEXT_HI,
              lineHeight: 1.45,
              marginBottom: 6,
            }}
          >
            people are building better lives
          </div>
          <div
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: LIME,
              letterSpacing: "0.02em",
            }}
          >
            right now.
          </div>
        </motion.div>

        {/* Stacked avatars row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 24,
            position: "relative",
            zIndex: 1,
          }}
        >
          {avatars.slice(0, 5).map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #0f1a2e",
                marginLeft: i === 0 ? 0 : -10,
                position: "relative",
                zIndex: 5 - i,
              }}
            />
          ))}
        </div>

        <p
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontWeight: 400,
            fontSize: 13,
            color: TEXT_MID,
            lineHeight: 1.5,
            marginTop: 18,
            position: "relative",
            zIndex: 1,
          }}
        >
          Our AI-powered plans are built from real behavioral science — not generic advice.
        </p>
      </div>

      <button
        onClick={onContinue}
        style={{
          marginTop: 24,
          width: "100%",
          maxWidth: 360,
          padding: "18px 0",
          background: LIME,
          color: NAVY,
          border: "none",
          borderRadius: 14,
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        {ctaLabel}
      </button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   COMPARISON CARD — Books & Courses vs Behavio
══════════════════════════════════════════════════════ */

function MiniSparkline({ points, color, dashed }: { points: number[]; color: string; dashed?: boolean }) {
  const w = 100;
  const h = 36;
  const pad = 4;
  const usableW = w - pad * 2;
  const usableH = h - pad * 2;
  const d = points
    .map((v, i) => {
      const x = pad + (i / (points.length - 1)) * usableW;
      const y = pad + usableH - v * usableH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <circle cx={pad + usableW} cy={pad + usableH - points[points.length - 1] * usableH} r={3} fill={color} />
    </svg>
  );
}

export function ComparisonCard({
  ctaLabel = "That makes sense",
  onContinue,
}: {
  ctaLabel?: string;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        textAlign: "center",
      }}
    >
      {/* Header stat */}
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 800,
            fontSize: 52,
            color: "#FF6B6B",
            letterSpacing: "-0.02em",
          }}
        >
          92%
        </span>
        <div
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontWeight: 500,
            fontSize: 15,
            color: TEXT_HI,
            marginTop: 4,
          }}
        >
          of people fail with information alone.
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          width: "100%",
          maxWidth: 360,
        }}
      >
        {/* Left — failure */}
        <div
          style={{
            background: "rgba(255,107,107,0.06)",
            border: "1px solid rgba(255,107,107,0.15)",
            borderRadius: 16,
            padding: "20px 14px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FF6B6B",
              marginBottom: 4,
            }}
          >
            Books & Courses
          </div>
          <div style={{ display: "flex", gap: 8, fontSize: 22, opacity: 0.7 }}>
            <span>📚</span>
            <span>🎓</span>
            <span>▶️</span>
          </div>
          <MiniSparkline points={[0.5, 0.55, 0.48, 0.42, 0.3]} color="#FF6B6B" dashed />
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#FF6B6B",
              opacity: 0.8,
            }}
          >
            92% QUIT
          </div>
        </div>

        {/* Right — success */}
        <div
          style={{
            background: "rgba(200,255,0,0.06)",
            border: `1px solid rgba(200,255,0,0.18)`,
            borderRadius: 16,
            padding: "20px 14px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: LIME,
              marginBottom: 4,
            }}
          >
            Behavio
          </div>
          <div style={{ display: "flex", gap: 8, fontSize: 22 }}>
            <span>✅</span>
            <span>🔥</span>
            <span>🎮</span>
          </div>
          <MiniSparkline points={[0.2, 0.35, 0.5, 0.72, 0.92]} color={LIME} />
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: LIME,
            }}
          >
            STICK WITH IT
          </div>
        </div>
      </div>

      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontWeight: 400,
          fontSize: 13,
          color: TEXT_MID,
          lineHeight: 1.5,
          marginTop: 20,
          maxWidth: 320,
        }}
      >
        Consistent action beats information. We use{" "}
        <span style={{ color: LIME, fontWeight: 600 }}>gamification</span> &{" "}
        <span style={{ color: LIME, fontWeight: 600 }}>behavioral science</span>{" "}
        to make you take action.
      </p>

      <button
        onClick={onContinue}
        style={{
          marginTop: 24,
          width: "100%",
          maxWidth: 360,
          padding: "18px 0",
          background: LIME,
          color: NAVY,
          border: "none",
          borderRadius: 14,
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        {ctaLabel}
      </button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   TIMELINE CARD — Before/After time savings
══════════════════════════════════════════════════════ */

export function TimelineCard({
  ctaLabel = "Continue",
  onContinue,
}: {
  ctaLabel?: string;
  onContinue: () => void;
}) {
  const ROW = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 18px",
    borderRadius: 14,
    width: "100%",
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        textAlign: "center",
      }}
    >
      {/* Big 10x stat */}
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: 72,
            lineHeight: 1,
            color: LIME,
            letterSpacing: "-0.02em",
          }}
        >
          10×
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontWeight: 500,
          fontSize: 16,
          color: TEXT_HI,
          marginBottom: 28,
          maxWidth: 300,
        }}
      >
        more efficient than figuring it out alone.
      </p>

      {/* Two stacked rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: "100%",
          maxWidth: 360,
        }}
      >
        {/* Row 1 — Without (red/faded) */}
        <div
          style={{
            ...ROW,
            background: "rgba(255,107,107,0.06)",
            border: "1px solid rgba(255,107,107,0.12)",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "rgba(255,107,107,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 20,
            }}
          >
            ⏳
          </div>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: "#FF6B6B",
              }}
            >
              On your own
            </div>
            <div
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontWeight: 400,
                fontSize: 12,
                color: TEXT_LO,
                marginTop: 2,
              }}
            >
              Months of trial, error & guessing
            </div>
          </div>
        </div>

        {/* Row 2 — With Behavio (lime) */}
        <div
          style={{
            ...ROW,
            background: "rgba(200,255,0,0.06)",
            border: "1px solid rgba(200,255,0,0.16)",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "rgba(200,255,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 20,
            }}
          >
            🎯
          </div>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: LIME,
              }}
            >
              With Behavio
            </div>
            <div
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontWeight: 400,
                fontSize: 12,
                color: TEXT_LO,
                marginTop: 2,
              }}
            >
              15 min/day — guided, focused, effective
            </div>
          </div>
        </div>
      </div>

      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontWeight: 400,
          fontSize: 13,
          color: TEXT_MID,
          lineHeight: 1.5,
          marginTop: 22,
          maxWidth: 320,
        }}
      >
        We focus your effort on{" "}
        <span style={{ color: LIME, fontWeight: 600 }}>what actually matters</span>
        {" "}— not everything at once.
      </p>

      <button
        onClick={onContinue}
        style={{
          marginTop: 24,
          width: "100%",
          maxWidth: 360,
          padding: "18px 0",
          background: LIME,
          color: NAVY,
          border: "none",
          borderRadius: 14,
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        {ctaLabel}
      </button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   WIN CELEBRATION — congrats + progress chart
══════════════════════════════════════════════════════ */

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

type ProgressChartLine = {
  label: string;
  emoji: string;
  color: string;
  points: number[];
};

function ProgressChart({
  lines,
  baseline,
}: {
  lines: ProgressChartLine[];
  baseline: ProgressChartLine;
}) {
  const W = 320;
  const H = 180;
  const pad = { top: 10, right: 12, bottom: 28, left: 12 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const weeks = ["Now", "WEEK 1", "WEEK 2", "WEEK 3", "WEEK 4"];

  const toX = (i: number) => pad.left + (i / (weeks.length - 1)) * chartW;
  const toY = (v: number) => pad.top + chartH - v * chartH;

  const makePath = (pts: number[]) =>
    pts.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");

  const allLines = [...lines, baseline];
  const primaryLine = lines[0];
  const isBaseline = (label: string) => label === baseline.label;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "20px 16px 12px",
        width: "100%",
        maxWidth: 360,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        {lines.map((l) => (
          <span
            key={l.label}
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 11,
              color: l.color,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {l.emoji} {l.label}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        {[...Array(5)].map((_, i) => (
          <line
            key={i}
            x1={toX(i)}
            y1={pad.top}
            x2={toX(i)}
            y2={pad.top + chartH}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="3 4"
          />
        ))}
        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
          <line
            key={i}
            x1={pad.left}
            y1={toY(v)}
            x2={pad.left + chartW}
            y2={toY(v)}
            stroke="rgba(255,255,255,0.04)"
          />
        ))}

        {allLines.map((line) => (
          <path
            key={line.label}
            d={makePath(line.points)}
            fill="none"
            stroke={line.color}
            strokeWidth={isBaseline(line.label) ? 1.5 : 2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={isBaseline(line.label) ? "4 3" : undefined}
            opacity={isBaseline(line.label) ? 0.7 : 1}
          />
        ))}

        {allLines.map((line) =>
          line.points.map((v, i) =>
            i === line.points.length - 1 ? (
              <circle
                key={`${line.label}-${i}`}
                cx={toX(i)}
                cy={toY(v)}
                r={isBaseline(line.label) ? 3 : 4}
                fill={line.color}
              />
            ) : null,
          ),
        )}

        <text
          x={toX(4) - 4}
          y={toY(primaryLine.points[4]) - 10}
          fill={primaryLine.color}
          fontSize="9"
          fontFamily="var(--font-apercu), sans-serif"
          fontWeight="700"
          textAnchor="end"
        >
          Behavio Users
        </text>
        <text
          x={toX(4) - 4}
          y={toY(baseline.points[4]) + 14}
          fill={baseline.color}
          fontSize="8"
          fontFamily="var(--font-apercu), sans-serif"
          fontWeight="600"
          textAnchor="end"
          opacity={0.8}
        >
          {baseline.label}
        </text>

        {weeks.map((label, i) => (
          <text
            key={label}
            x={toX(i)}
            y={H - 4}
            fill="rgba(255,255,255,0.35)"
            fontSize="8"
            fontFamily="var(--font-jetbrains-mono), monospace"
            textAnchor="middle"
            letterSpacing="0.06em"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function WinCelebration({ onContinue }: { onContinue: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const multiSelectAnswers = usePlanStore((s) => s.multiSelectAnswers);
  const { themes, headlinePartsLower } = buildWinCelebrationLines(multiSelectAnswers);

  const chartLines = themes.map((t) => ({
    label: t.shortLabel,
    emoji: t.emoji,
    color: t.color,
    points: t.points,
  }));
  const baselineLine = {
    label: WIN_CELEBRATION_BASELINE.label,
    emoji: WIN_CELEBRATION_BASELINE.emoji,
    color: WIN_CELEBRATION_BASELINE.color,
    points: [...WIN_CELEBRATION_BASELINE.points],
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth || 340;
    const H = canvas.clientHeight || 600;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const colors = ["#C8FF00", "#4CAF7D", "#2DD4C0", "rgba(255,255,255,0.8)", "#5B8DEF"];
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: -20 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 3,
      rotation: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.15,
    }));

    let frame = 0;
    let animId: number;
    const STOP_SPAWNING = 180; // ~3s at 60fps — stop recycling particles
    const FADE_START = 200;
    const FADE_END = 280; // fully gone by ~4.7s

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      if (frame > FADE_END) return; // done

      const fadeAlpha = frame > FADE_START
        ? 1 - (frame - FADE_START) / (FADE_END - FADE_START)
        : 1;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.rotation += p.rotV;
        if (p.y > H + 20) {
          if (frame < STOP_SPAWNING) {
            p.y = -20;
            p.x = Math.random() * W;
            p.vy = 2 + Math.random() * 3;
          } else {
            return;
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.min(1, frame / 20) * fadeAlpha;
        ctx.fillStyle = p.color;
        roundRect(ctx, -p.w / 2, -p.h / 2, p.w, p.h, 1);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        textAlign: "center",
        gap: 0,
        paddingTop: 20,
        paddingBottom: 40,
        isolation: "isolate" as const,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 22 }}
        style={{
          zIndex: 2,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          width: "100%",
          maxWidth: 380,
          padding: "0 16px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: 52,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: LIME,
            marginBottom: 16,
          }}
        >
          CONGRATS!
        </div>

        <p
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontWeight: 500,
            fontSize: 17,
            lineHeight: 1.5,
            color: TEXT_HI,
            marginBottom: 28,
            maxWidth: 340,
          }}
        >
          We created the perfect routine to supercharge your{" "}
          <span style={{ color: LIME, fontWeight: 700 }}>{headlinePartsLower[0]}</span>,{" "}
          <span style={{ color: LIME, fontWeight: 700 }}>{headlinePartsLower[1]}</span> &{" "}
          <span style={{ color: LIME, fontWeight: 700 }}>{headlinePartsLower[2]}</span> in the
          next 40 days!
        </p>

        <ProgressChart lines={chartLines} baseline={baselineLine} />

        <button
          onClick={onContinue}
          style={{
            marginTop: 28,
            width: "100%",
            maxWidth: 360,
            padding: "18px 0",
            background: LIME,
            color: NAVY,
            border: "none",
            borderRadius: 14,
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          CONTINUE
          <span style={{ fontSize: 18 }}>&rarr;</span>
        </button>

        <p
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: 1.55,
            color: TEXT_MID,
            marginTop: 28,
            maxWidth: 340,
          }}
        >
          We have analyzed the answers to your quiz and created your custom plan{" "}
          <span style={{ color: LIME, fontWeight: 600 }}>tailored to your {headlinePartsLower[0]}</span>,{" "}
          <span style={{ color: LIME, fontWeight: 600 }}>{headlinePartsLower[1]}</span> &{" "}
          <span style={{ color: LIME, fontWeight: 600 }}>{headlinePartsLower[2]}</span>.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   CAPTURE FORM — name + email
══════════════════════════════════════════════════════ */

type CaptureFormProps = {
  onSubmit: (name: string, email: string) => void;
};

export function CaptureForm({ onSubmit }: CaptureFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const canSubmit = name.trim().length > 0 && email.includes("@");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "16px 18px",
    background: GLASS,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${GLASS_BORDER}`,
    borderRadius: 14,
    color: TEXT_HI,
    fontFamily: "var(--font-body), Georgia, serif",
    fontWeight: 400,
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      <input
        type="text"
        className="capture-form-input"
        placeholder="Your first name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
        autoComplete="given-name"
      />
      <input
        type="email"
        className="capture-form-input"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        autoComplete="email"
      />
      <motion.button
        onClick={() => canSubmit && onSubmit(name.trim(), email.trim())}
        animate={{ opacity: canSubmit ? 1 : 0.4 }}
        whileTap={canSubmit ? { scale: 0.97 } : {}}
        style={{
          width: "100%",
          background: LIME,
          color: "#060912",
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          borderRadius: 100,
          padding: "20px 32px",
          border: "none",
          cursor: canSubmit ? "pointer" : "default",
          marginTop: 4,
          boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        Send My Plan
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: TEXT_LO,
          textAlign: "center",
          margin: 0,
        }}
      >
        Private · no spam · cancel anytime
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MULTI-SELECT STEP — checkbox rows, multiple answers
══════════════════════════════════════════════════════ */

type MultiSelectStepProps = {
  options: QuizOption[];
  onSubmit: (selectedIndices: number[]) => void;
};

export function MultiSelectStep({ options, onSubmit }: MultiSelectStepProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const hasSelection = selected.size > 0;

  const handleContinue = () => {
    if (!hasSelection) return;
    onSubmit(Array.from(selected).sort((a, b) => a - b));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        {options.map((opt, i) => {
          const isOn = selected.has(i);
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              animate={{
                background: isOn ? "rgba(200,255,0,0.10)" : GLASS,
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 12,
                border: `1px solid ${isOn ? LIME : GLASS_BORDER}`,
                background: isOn ? "rgba(200,255,0,0.10)" : GLASS,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
              }}
            >
              {opt.icon && (
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {opt.icon}
                </span>
              )}
              <span
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: isOn ? LIME : TEXT_HI,
                  flex: 1,
                }}
              >
                {opt.label}
              </span>

              <span
                aria-hidden
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: `2px solid ${isOn ? LIME : TEXT_LO}`,
                  background: isOn ? LIME : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isOn && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                  >
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke={NAVY}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {hasSelection && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={handleContinue}
            style={{
              width: "100%",
              background: LIME,
              color: "#060912",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: 100,
              padding: "20px 32px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            Continue
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SLIDER SCALE — labeled segments + Continue
══════════════════════════════════════════════════════ */

type SliderScaleStepProps = {
  labels: string[];
  onSelect: (value: number) => void;
};

export function SliderScaleStep({ labels, onSelect }: SliderScaleStepProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleContinue = () => {
    if (selected === null) return;
    onSelect(selected);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
        {/* Indicator row */}
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "flex-end",
            justifyContent: "space-between",
            minHeight: 18,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          {labels.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <motion.div
                animate={{
                  scale: selected === i ? 1 : 0,
                  opacity: selected === i ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: LIME,
                  boxShadow: "0 0 12px rgba(200,255,0,0.45)",
                  marginBottom: 2,
                }}
              />
            </div>
          ))}
        </div>

        {/* Track line */}
        <div style={{ position: "relative", width: "100%", height: 12, marginTop: -4 }}>
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 8,
              right: 8,
              top: "50%",
              height: 1,
              transform: "translateY(-50%)",
              background: GLASS_BORDER,
            }}
          />
        </div>

        {/* Segments */}
        <div style={{ display: "flex", width: "100%", gap: 4, marginTop: -2 }}>
          {labels.map((label, i) => {
            const isOn = selected === i;
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1,
                  padding: "12px 6px",
                  borderRadius: 12,
                  border: `1px solid ${isOn ? LIME : GLASS_BORDER}`,
                  background: isOn ? "rgba(200,255,0,0.10)" : GLASS,
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  cursor: "pointer",
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: isOn ? LIME : TEXT_HI,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={handleContinue}
            style={{
              width: "100%",
              background: LIME,
              color: "#060912",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: 100,
              padding: "20px 32px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            Continue
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
