"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EnergyLevel, TimeAvailable, ChallengeLevel } from "../../types/pipeline";
import { ACCENT as LIME, NAVY, TEXT_HI, TEXT_MID, GLASS, GLASS_BORDER } from "@/app/theme";
const FONT_HEADING = "var(--font-barlow-condensed), sans-serif";
const FONT_BODY = "var(--font-apercu), sans-serif";
const FONT_MONO = "var(--font-jetbrains-mono), monospace";

type Props = {
  userName: string;
  onSubmit: (energy: EnergyLevel, time: TimeAvailable, focus: string | null, challenge: ChallengeLevel) => void;
  suggestedFocus: string | null;
};

const ENERGY_OPTIONS: { value: EnergyLevel; label: string; icon: string }[] = [
  { value: "low", label: "Low", icon: "\u{1FAAB}" },
  { value: "medium", label: "Medium", icon: "\u26A1" },
  { value: "high", label: "High", icon: "\u{1F525}" },
];

const TIME_OPTIONS: { value: TimeAvailable; label: string }[] = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2+ hours" },
];

const CHALLENGE_OPTIONS: { value: ChallengeLevel; label: string; sublabel: string; icon: string }[] = [
  { value: "comfort", label: "Comfort Zone", sublabel: "Easy wins, low friction", icon: "\u{1F6E1}\uFE0F" },
  { value: "push", label: "Push Me", sublabel: "Challenging but doable", icon: "\u{1F4AA}" },
  { value: "stretch", label: "Stretch Me", sublabel: "I want to grow today", icon: "\u{1F525}" },
];

export default function MorningCheckin({ userName, onSubmit, suggestedFocus }: Props) {
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [time, setTime] = useState<TimeAvailable | null>(null);
  const [challenge, setChallenge] = useState<ChallengeLevel>("push");
  const [step, setStep] = useState(0); // 0=energy, 1=time, 2=challenge

  function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  const canSubmit = energy !== null && time !== null;

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit(energy!, time!, null, challenge);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: GLASS,
        border: "1px solid " + GLASS_BORDER,
        borderRadius: 24,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "28px 20px",
        boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
      }}
    >
      <h2
        style={{
          fontFamily: FONT_HEADING,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 26,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: TEXT_HI,
          margin: 0,
        }}
      >
        {getGreeting()}, {userName || "friend"}
      </h2>
      <p
        style={{
          fontFamily: FONT_BODY,
          fontSize: 14,
          color: TEXT_MID,
          marginTop: 6,
          lineHeight: 1.5,
        }}
      >
        Quick check-in before we build your day
      </p>

      <AnimatePresence mode="wait">
        {/* Step 0: Energy */}
        {step === 0 && (
          <motion.div
            key="energy"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ marginTop: 20 }}
          >
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: 13,
                fontWeight: 500,
                color: TEXT_MID,
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
                margin: "0 0 12px",
              }}
            >
              How&apos;s your energy?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {ENERGY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setEnergy(opt.value);
                    setTimeout(() => setStep(1), 200);
                  }}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    padding: "16px 8px",
                    background: energy === opt.value ? "rgba(94,205,161,0.12)" : "rgba(255,255,255,0.04)",
                    border: energy === opt.value ? "2px solid " + LIME : "2px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{opt.icon}</span>
                  <span
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 13,
                      fontWeight: 600,
                      color: energy === opt.value ? LIME : TEXT_HI,
                    }}
                  >
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 1: Time */}
        {step === 1 && (
          <motion.div
            key="time"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ marginTop: 20 }}
          >
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: 13,
                fontWeight: 500,
                color: TEXT_MID,
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
                margin: "0 0 12px",
              }}
            >
              Time available today?
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setTime(opt.value);
                    setTimeout(() => setStep(2), 200);
                  }}
                  style={{
                    flex: "1 1 calc(50% - 4px)",
                    padding: "14px 8px",
                    background: time === opt.value ? "rgba(94,205,161,0.12)" : "rgba(255,255,255,0.04)",
                    border: time === opt.value ? "2px solid " + LIME : "2px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    fontWeight: 600,
                    color: time === opt.value ? LIME : TEXT_HI,
                    textAlign: "center" as const,
                    transition: "all 0.15s",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(0)}
              style={{
                marginTop: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: FONT_BODY,
                fontSize: 13,
                color: TEXT_MID,
                padding: 0,
              }}
            >
              &larr; Back
            </button>
          </motion.div>
        )}

        {/* Step 2: Challenge Level */}
        {step === 2 && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ marginTop: 20 }}
          >
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: 13,
                fontWeight: 500,
                color: TEXT_MID,
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
                margin: "0 0 12px",
              }}
            >
              How hard should we push?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {CHALLENGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setChallenge(opt.value);
                    setTimeout(() => {
                      if (energy !== null && time !== null) {
                        onSubmit(energy, time, null, opt.value);
                      }
                    }, 250);
                  }}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "14px 6px",
                    background: challenge === opt.value ? "rgba(94,205,161,0.12)" : "rgba(255,255,255,0.04)",
                    border: challenge === opt.value ? "2px solid " + LIME : "2px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{opt.icon}</span>
                  <span
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 12,
                      fontWeight: 600,
                      color: challenge === opt.value ? LIME : TEXT_HI,
                    }}
                  >
                    {opt.label}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 13,
                      color: TEXT_MID,
                      lineHeight: 1.3,
                      textAlign: "center" as const,
                    }}
                  >
                    {opt.sublabel}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                marginTop: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: FONT_BODY,
                fontSize: 13,
                color: TEXT_MID,
                padding: 0,
              }}
            >
              &larr; Back
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
