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
const TEXT_MID = "rgba(120,155,195,0.85)";
const TEXT_LO = "rgba(120,155,195,0.55)";
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
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 700,
            fontSize: 36,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: TEXT_HI,
            margin: "0 0 18px",
          }}
        >
          Your{" "}
          <em style={{ fontStyle: "italic", color: LIME }}>best self</em>
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
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: 100,
            padding: "16px 28px",
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
            fontSize: 13,
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
              boxShadow: isSelected ? "0 0 24px rgba(200,255,0,0.18)" : "none",
              transition: "box-shadow 0.2s",
            }}
          >
            {opt.icon && (
              <span style={{ fontSize: 36, lineHeight: 1 }}>{opt.icon}</span>
            )}
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: "0.02em",
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
              gap: 12,
              padding: "14px 16px",
              borderRadius: 14,
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
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {opt.icon}
              </span>
            )}
            <span
              style={{
                fontFamily: "var(--font-apercu), sans-serif",
                fontWeight: 500,
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
                gap: 12,
                padding: "14px 16px",
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
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {opt.icon}
                </span>
              )}
              <span
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontWeight: 500,
                  fontSize: 15,
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
          fontSize: 17,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          borderRadius: 100,
          padding: "16px 28px",
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
                boxShadow: isSelected ? "0 4px 16px rgba(200,255,0,0.18)" : "none",
                transition: "box-shadow 0.2s",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  color: isSelected ? NAVY : TEXT_HI,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: isSelected ? "rgba(6,9,18,0.60)" : TEXT_LO,
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
              fontSize: 17,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: 100,
              padding: "16px 28px",
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
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        width: "100%",
        textAlign: "center",
      }}
    >
      {/* ── Hero stat block — screams at you ── */}
      {stat && (
        <div style={{ marginBottom: 6, textAlign: "center" }}>
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 18 }}
          >
            <span
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontWeight: 900,
                fontSize: 72,
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: LIME,
                textShadow: "0 0 60px rgba(200,255,0,0.35), 0 0 120px rgba(200,255,0,0.15)",
                display: "block",
                textAlign: "center",
              }}
            >
              {stat}
            </span>
          </motion.div>
        </div>
      )}

      {/* Headline — right in their face */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
      >
        <p
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 600,
            fontSize: 22,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            color: TEXT_HI,
            margin: "0 0 6px",
          }}
        >
          Your first action.
          <br />
          Done before you doubt it.
        </p>
        {headline && (
          <p
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: TEXT_LO,
              margin: 0,
              maxWidth: 320,
            }}
          >
            {headline}
          </p>
        )}
      </motion.div>

      {/* Glass card — mechanism */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        style={{
          position: "relative",
          background: GLASS,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: `1px solid ${GLASS_BORDER}`,
          borderRadius: 20,
          padding: "22px 20px",
          marginTop: 24,
          width: "100%",
          maxWidth: 360,
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent)",
          }}
        />

        {/* 3-step visual: Goal → Tiny actions → Momentum */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            marginBottom: 16,
          }}
        >
          {[
            { icon: "🎯", label: "Your goal" },
            { icon: "→", label: "" },
            { icon: "⚡", label: "Tiny actions" },
            { icon: "→", label: "" },
            { icon: "🔥", label: "Momentum" },
          ].map((step, i) =>
            step.icon === "→" ? (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontSize: 18,
                  color: TEXT_LO,
                  margin: "0 4px",
                }}
              >
                →
              </span>
            ) : (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  minWidth: 70,
                }}
              >
                <span style={{ fontSize: 24 }}>{step.icon}</span>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: TEXT_LO,
                  }}
                >
                  {step.label}
                </span>
              </div>
            ),
          )}
        </div>

        {body && (
          <p
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: 1.6,
              color: TEXT_MID,
              margin: 0,
              textAlign: "center",
            }}
            dangerouslySetInnerHTML={{
              __html: body.replace(
                /\*\*(.*?)\*\*/g,
                `<strong style="font-weight:600;color:${TEXT_HI}">$1</strong>`,
              ),
            }}
          />
        )}

        {/* Research logos — small trust strip */}
        {badges && badges.length > 0 && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {badges.map((b) => (
              <img
                key={b.name}
                src={b.logo}
                alt={b.name}
                style={{
                  width: 26,
                  height: 26,
                  objectFit: "contain",
                  opacity: 0.45,
                }}
              />
            ))}
          </div>
        )}

        {/* Avatar social proof — when no badges */}
        {avatars && avatars.length > 0 && !badges && (
          <div
            style={{
              marginTop: 14,
              paddingTop: 12,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", flexShrink: 0 }}>
              {avatars.slice(0, 5).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #0f1a2e",
                    marginLeft: i === 0 ? 0 : -6,
                    position: "relative",
                    zIndex: 5 - i,
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 12,
                letterSpacing: "0.06em",
                color: TEXT_LO,
              }}
            >
              1,200+ plans started today
            </span>
          </div>
        )}
      </motion.div>

      <button
        onClick={onContinue}
        style={{
          marginTop: 24,
          width: "100%",
          maxWidth: 360,
          background: LIME,
          color: "#060912",
          fontFamily: "var(--font-display), sans-serif",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          borderRadius: 100,
          padding: "16px 28px",
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
              padding: "24px 16px",
              borderRadius: 100,
              border: `1px solid ${isSelected ? LIME : GLASS_BORDER}`,
              background: isSelected ? LIME : GLASS,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              cursor: "pointer",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: isSelected ? NAVY : TEXT_HI,
              boxShadow: isSelected ? "0 0 20px rgba(200,255,0,0.22)" : "none",
              transition: "box-shadow 0.2s",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <span style={{ flex: 1, height: 1, background: "rgba(200,255,0,0.12)" }} />
          <span
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(200,255,0,0.55)",
              whiteSpace: "nowrap",
            }}
          >
            {subtext}
          </span>
          <span style={{ flex: 1, height: 1, background: "rgba(200,255,0,0.12)" }} />
        </div>
      )}

      <div style={{ display: "flex", gap: 10, width: "100%" }}>
        {[1, 2, 3, 4].map((val) => {
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
                padding: "22px 8px",
                borderRadius: 16,
                border: `1px solid ${isSelected ? LIME : GLASS_BORDER}`,
                background: isSelected ? LIME : GLASS,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                cursor: "pointer",
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 800,
                fontSize: 26,
                color: isSelected ? NAVY : TEXT_HI,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isSelected ? "0 0 20px rgba(200,255,0,0.20)" : "none",
                transition: "box-shadow 0.2s",
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
              padding: "16px 28px",
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
   LIVE COUNTER CARD — realistic social proof + micro-testimonials
══════════════════════════════════════════════════════ */

const MICRO_TESTIMONIALS = [
  { name: "Anna", text: "Did 8 minutes instead of skipping." },
  { name: "Jay", text: "Day 3 streak after months of stops/starts." },
  { name: "Mia", text: "Finally stopped overthinking and just started." },
  { name: "Sam", text: "First time I actually followed through." },
  { name: "Lina", text: "Tiny win today, biggest shift in weeks." },
];

export function LiveCounterCard({
  avatars,
  ctaLabel = "Start my first 2-minute win",
  onContinue,
}: {
  avatars: string[];
  ctaLabel?: string;
  onContinue: () => void;
}) {
  const userName = usePlanStore((s) => s.userName);
  const firstName = userName ? userName.split(" ")[0] : null;

  const BASE_RECENT = 1248;
  const [recentCount, setRecentCount] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const startTime = performance.now();
    let animId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setRecentCount(Math.round(BASE_RECENT * eased));
      if (progress < 1) animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const drift = setInterval(() => {
      setRecentCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(drift);
  }, []);

  useEffect(() => {
    const rotate = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % MICRO_TESTIMONIALS.length);
    }, 3500);
    return () => clearInterval(rotate);
  }, []);

  const current = MICRO_TESTIMONIALS[testimonialIdx];

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
          padding: "32px 24px 28px",
          width: "100%",
          maxWidth: 360,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top highlight */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(200,255,0,0.25), transparent)",
          }}
        />

        {/* LIVE badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginBottom: 18,
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
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#4ADE80",
            }}
          >
            LIVE
          </span>
        </div>

        {/* Counter — recent plans */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <div
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontWeight: 800,
              fontSize: 56,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: LIME,
              marginBottom: 6,
            }}
          >
            {recentCount.toLocaleString()}
          </div>
          <div
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontWeight: 500,
              fontSize: 15,
              color: TEXT_HI,
              lineHeight: 1.45,
            }}
          >
            plans started in the last 24h
          </div>
        </motion.div>

        {/* Stacked avatars */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 20,
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
                width: 32,
                height: 32,
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

        {/* Rotating micro-testimonial */}
        <div
          style={{
            marginTop: 18,
            minHeight: 42,
            position: "relative",
            zIndex: 1,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 13,
                  color: TEXT_HI,
                  lineHeight: 1.5,
                }}
              >
                &ldquo;{current.text}&rdquo;
              </span>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: TEXT_LO,
                }}
              >
                — {current.name}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Outcome line */}
        <div
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontWeight: 400,
              fontSize: 12,
              color: TEXT_MID,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Most people complete their first action in under{" "}
            <span style={{ color: LIME, fontWeight: 600 }}>6 minutes</span>.
          </p>
        </div>
      </div>

      {/* Personalized motivation line */}
      <p
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontWeight: 500,
          fontSize: 14,
          color: TEXT_HI,
          marginTop: 20,
          marginBottom: 4,
        }}
      >
        {firstName
          ? `Let\u2019s build your first win, ${firstName}.`
          : "Your first tiny win starts now."}
      </p>

      <button
        onClick={onContinue}
        style={{
          marginTop: 12,
          width: "100%",
          maxWidth: 360,
          padding: "16px 28px",
          background: LIME,
          color: NAVY,
          border: "none",
          borderRadius: 100,
          fontFamily: "var(--font-display), sans-serif",
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {ctaLabel}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 13,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: TEXT_LO,
          margin: "8px 0 0",
        }}
      >
        2 min · private · free
      </p>
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

const FAIL_STORY = [
  { icon: "😩", line: '"I\'ll start Monday"', sub: "…Monday never comes" },
  { icon: "📱", line: "Scrolled for 2 hours", sub: "instead of doing the thing" },
  { icon: "🔄", line: "Reset the counter again", sub: "Day 1 — for the 47th time" },
  { icon: "💀", line: "Gave up", sub: "\"Maybe I'm just not that person\"" },
];
const WIN_STORY = [
  { icon: "⚡", line: "Got a 2-min action", sub: "Specific. No thinking required." },
  { icon: "✅", line: "Done before coffee", sub: "Felt easy. Did it again next day." },
  { icon: "🔥", line: "14-day streak", sub: "Didn't even try — the system worked." },
  { icon: "🏆", line: "Goal hit in 6 weeks", sub: "\"Why didn't I do this sooner?\"" },
];

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 3l8 8M11 3l-8 8" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7L5.5 10L11.5 4" stroke={LIME} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ComparisonCard({
  ctaLabel = "I want the system",
  onContinue,
}: {
  ctaLabel?: string;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        width: "100%",
        textAlign: "center",
      }}
    >
      {/* ── Headline ── */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          fontFamily: "var(--font-display), sans-serif",
          fontWeight: 600,
          fontSize: 20,
          lineHeight: 1.2,
          color: TEXT_HI,
          margin: "0 0 20px",
        }}
      >
        This is what &quot;trying harder&quot; looks like.
      </motion.p>

      {/* ── FAIL STORY ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "rgba(255,70,70,0.04)",
          border: "1px solid rgba(255,70,70,0.15)",
          borderRadius: 20,
          padding: "18px 16px 14px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at top, rgba(255,70,70,0.06) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#FF6B6B",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 13 }}>😔</span> Without a system
        </div>

        {FAIL_STORY.map((item, i) => (
          <motion.div
            key={item.line}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.4, duration: 0.25 }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 9,
              padding: "8px 0",
              borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "rgba(255,120,120,0.9)",
                  lineHeight: 1.3,
                }}
              >
                {item.line}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontWeight: 400,
                  fontSize: 13,
                  color: TEXT_LO,
                  lineHeight: 1.3,
                  marginTop: 1,
                }}
              >
                {item.sub}
              </div>
            </div>
          </motion.div>
        ))}
        <MiniSparkline points={[0.6, 0.55, 0.45, 0.3, 0.12]} color="#FF6B6B" dashed />
      </motion.div>

      {/* ── Pivot divider ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.0, duration: 0.3 }}
        style={{
          margin: "16px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(200,255,0,0.12)",
            border: "1px solid rgba(200,255,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          ↓
        </div>
        <span
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "0.04em",
            color: LIME,
          }}
        >
          Now watch this.
        </span>
      </motion.div>

      {/* ── WIN STORY ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.4 }}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "rgba(200,255,0,0.04)",
          border: "1px solid rgba(200,255,0,0.20)",
          borderRadius: 20,
          padding: "18px 16px 14px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at top, rgba(200,255,0,0.06) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: LIME,
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 13 }}>⚡</span> With Behavio
        </div>

        {WIN_STORY.map((item, i) => (
          <motion.div
            key={item.line}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.4 + i * 0.35, duration: 0.25 }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 9,
              padding: "8px 0",
              borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: TEXT_HI,
                  lineHeight: 1.3,
                }}
              >
                {item.line}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontWeight: 400,
                  fontSize: 13,
                  color: TEXT_MID,
                  lineHeight: 1.3,
                  marginTop: 1,
                }}
              >
                {item.sub}
              </div>
            </div>
          </motion.div>
        ))}
        <MiniSparkline points={[0.15, 0.3, 0.5, 0.75, 0.95]} color={LIME} />
      </motion.div>

      {/* Bridge */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.8 }}
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontWeight: 400,
          fontSize: 14,
          color: TEXT_MID,
          lineHeight: 1.5,
          marginTop: 18,
          maxWidth: 300,
        }}
      >
        Same person. Same goal.{" "}
        <span style={{ color: LIME, fontWeight: 700 }}>Different system.</span>
      </motion.p>

      {/* CTA — only fully visible after win story completes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.0, duration: 0.35 }}
        style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 20 }}
      >
        <button
          onClick={onContinue}
          style={{
            width: "100%",
            maxWidth: 360,
            padding: "16px 28px",
            background: LIME,
            color: NAVY,
            border: "none",
            borderRadius: 100,
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {ctaLabel}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   TIMELINE CARD — Before/After time savings
══════════════════════════════════════════════════════ */

export function TimelineCard({
  ctaLabel = "Lock in my plan",
  onContinue,
}: {
  ctaLabel?: string;
  onContinue: () => void;
}) {
  const TIMELINE = [
    { week: "NOW", own: "Thinking about starting", behavio: "First action done", icon: "🚀" },
    { week: "WEEK 1", own: "Watching YouTube videos", behavio: "7-day streak", icon: "🔥" },
    { week: "WEEK 2", own: "Bought a course, didn't open it", behavio: "Routine feels automatic", icon: "⚡" },
    { week: "MONTH 1", own: "Back to old habits", behavio: "Friends notice the change", icon: "💬" },
    { week: "MONTH 3", own: "\"I'll try again next year\"", behavio: "Goal reached", icon: "🏆" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        width: "100%",
        textAlign: "center",
      }}
    >
      {/* Hero stat */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 18 }}
        style={{ marginBottom: 4 }}
      >
        <span
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 900,
            fontSize: 64,
            lineHeight: 0.9,
            color: LIME,
            textShadow: "0 0 60px rgba(200,255,0,0.30), 0 0 120px rgba(200,255,0,0.12)",
            display: "block",
            textAlign: "center",
          }}
        >
          10×
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}
      >
        <p
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 600,
            fontSize: 20,
            lineHeight: 1.2,
            color: TEXT_HI,
            margin: "0 0 4px",
          }}
        >
          faster than figuring it out alone.
        </p>
        <p
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontWeight: 400,
            fontSize: 13,
            color: TEXT_LO,
            margin: 0,
          }}
        >
          Here&apos;s how the next 3 months play out:
        </p>
      </motion.div>

      {/* Timeline — two separate columns side by side */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          width: "100%",
          maxWidth: 380,
        }}
      >
        {/* ── LEFT: On your own — red/dead ── */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{
            background: "rgba(255,70,70,0.05)",
            border: "1px solid rgba(255,70,70,0.15)",
            borderRadius: 18,
            padding: "14px 12px 16px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at top, rgba(255,70,70,0.06) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#FF6B6B",
              marginBottom: 14,
              textAlign: "center",
            }}
          >
            😔 On your own
          </div>
          {TIMELINE.map((row, i) => (
            <motion.div
              key={row.week}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.3, duration: 0.2 }}
              style={{
                padding: "8px 0",
                borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,107,107,0.45)",
                  marginBottom: 3,
                }}
              >
                {row.week}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 13,
                  fontWeight: i === TIMELINE.length - 1 ? 500 : 400,
                  color: i === TIMELINE.length - 1 ? "rgba(255,107,107,0.75)" : TEXT_LO,
                  lineHeight: 1.35,
                }}
              >
                {row.own}
              </div>
            </motion.div>
          ))}
          <MiniSparkline points={[0.55, 0.5, 0.4, 0.25, 0.1]} color="#FF6B6B" dashed />
        </motion.div>

        {/* ── RIGHT: With Behavio — lime/alive ── */}
        <motion.div
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            background: "rgba(200,255,0,0.05)",
            border: "1px solid rgba(200,255,0,0.20)",
            borderRadius: 18,
            padding: "14px 12px 16px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at top, rgba(200,255,0,0.06) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: LIME,
              marginBottom: 14,
              textAlign: "center",
            }}
          >
            ⚡ With Behavio
          </div>
          {TIMELINE.map((row, i) => (
            <motion.div
              key={row.week}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 + i * 0.3, duration: 0.2 }}
              style={{
                padding: "8px 0",
                borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display), sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(200,255,0,0.50)",
                  marginBottom: 3,
                }}
              >
                {row.week}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 13,
                  fontWeight: i === TIMELINE.length - 1 ? 700 : 500,
                  color: i === TIMELINE.length - 1 ? LIME : TEXT_HI,
                  lineHeight: 1.35,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <span style={{ fontSize: 13 }}>{row.icon}</span>
                {row.behavio}
              </div>
            </motion.div>
          ))}
          <MiniSparkline points={[0.12, 0.3, 0.52, 0.78, 0.95]} color={LIME} />
        </motion.div>
      </div>

      {/* Bridge */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        style={{
          fontFamily: "var(--font-apercu), sans-serif",
          fontWeight: 400,
          fontSize: 13,
          color: TEXT_MID,
          lineHeight: 1.5,
          marginTop: 18,
          maxWidth: 300,
        }}
      >
        15 min/day.{" "}
        <span style={{ color: LIME, fontWeight: 700 }}>Guided. Focused. No guesswork.</span>
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.35 }}
        style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 20 }}
      >
        <button
          onClick={onContinue}
          style={{
            width: "100%",
            maxWidth: 360,
            padding: "16px 28px",
            background: LIME,
            color: NAVY,
            border: "none",
            borderRadius: 100,
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {ctaLabel}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </motion.div>
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
              fontSize: 13,
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
          fontSize="12"
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
          fontSize="12"
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
            fontSize="12"
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
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 800,
            fontSize: 40,
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
            fontFamily: "var(--font-display), sans-serif",
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
    fontFamily: "var(--font-apercu), sans-serif",
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
          fontSize: 17,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          borderRadius: 100,
          padding: "16px 28px",
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
          fontSize: 12,
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
                gap: 12,
                padding: "14px 16px",
                borderRadius: 14,
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
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {opt.icon}
                </span>
              )}
              <span
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontWeight: 500,
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
              fontSize: 17,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: 100,
              padding: "16px 28px",
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
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontWeight: 500,
                  fontSize: 12,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: isOn ? LIME : TEXT_HI,
                  textAlign: "center",
                  lineHeight: 1.2,
                  boxShadow: isOn ? "0 4px 14px rgba(200,255,0,0.16)" : "none",
                  transition: "box-shadow 0.2s",
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
              fontSize: 17,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: 100,
              padding: "16px 28px",
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
