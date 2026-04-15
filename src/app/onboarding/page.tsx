"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import type { AmbitionDomain } from "../types/plan";
import { defaultAmbitionForIntent } from "../types/marketingIntent";
import { INTENT_COPY } from "../data/intentConfig";
import { FunnelThemeShell } from "../components/funnel/FunnelThemeShell";
import { TEXT_HI, TEXT_MID, TEXT_LO } from "@/app/theme";

const PENDING_NARRATIVE_KEY = "behavio-pending-narrative";

const ONBOARDING_H1: CSSProperties = {
  fontFamily: "var(--font-apercu), sans-serif",
  fontWeight: 600,
  fontSize: 28,
  color: TEXT_HI,
  margin: "0 0 8px",
  lineHeight: 1.25,
  letterSpacing: "-0.02em",
};

const GOAL_OPTIONS: { id: AmbitionDomain; label: string; emoji: string }[] = [
  { id: "career", label: "Career", emoji: "💼" },
  { id: "finance", label: "Money", emoji: "💰" },
  { id: "athlete", label: "Health & Fitness", emoji: "💪" },
  { id: "weight_loss", label: "Weight loss", emoji: "⚖️" },
  { id: "relationships", label: "Relationships", emoji: "❤️" },
  { id: "entrepreneur", label: "Start a Business", emoji: "🚀" },
  { id: "confidence", label: "Personal Growth", emoji: "🌱" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const setAmbitionType = usePlanStore((s) => s.setAmbitionType);
  const setLocation = usePlanStore((s) => s.setLocation);
  const setUserName = usePlanStore((s) => s.setUserName);
  const completeQuiz = usePlanStore((s) => s.completeQuiz);
  const completeOnboarding = usePlanStore((s) => s.completeOnboarding);
  const setPendingNarrative = usePlanStore((s) => s.setPendingNarrative);
  const userName = usePlanStore((s) => s.userName);
  const marketingIntent = usePlanStore((s) => s.marketingIntent);

  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<AmbitionDomain | null>(null);

  useEffect(() => {
    if (!marketingIntent) return;
    setSelectedGoal((prev) => prev ?? defaultAmbitionForIntent(marketingIntent));
  }, [marketingIntent]);
  const [locationInput, setLocationInput] = useState("");
  const [narrative, setNarrative] = useState("");
  const [nameInput, setNameInput] = useState(userName || "");

  function handleNext() {
    if (step === 0 && nameInput.trim()) {
      setUserName(nameInput.trim());
      setStep(1);
    } else if (step === 1 && selectedGoal) {
      setAmbitionType(selectedGoal);
      setStep(2);
    } else if (step === 2 && locationInput.trim()) {
      setLocation(locationInput.trim());
      setStep(3);
    } else if (step === 3 && narrative.trim().length >= 20) {
      // Complete onboarding
      completeQuiz("steady", selectedGoal!);
      completeOnboarding();
      const trimmed = narrative.trim();
      setPendingNarrative(trimmed);
      try {
        sessionStorage.setItem(PENDING_NARRATIVE_KEY, trimmed);
      } catch { /* ignore */ }
      router.push("/generating");
    }
  }

  const canProceed =
    (step === 0 && nameInput.trim().length > 0) ||
    (step === 1 && selectedGoal !== null) ||
    (step === 2 && locationInput.trim().length > 0) ||
    (step === 3 && narrative.trim().length >= 20);

  const intentCopy = marketingIntent ? INTENT_COPY[marketingIntent] : null;
  const cta = "var(--cta)";
  const ctaTint = "color-mix(in srgb, var(--cta) 10%, transparent)";

  return (
    <FunnelThemeShell intent={marketingIntent}>
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 20%, rgba(94,205,161,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 10% 90%, rgba(15,40,110,0.40) 0%, transparent 55%),
            linear-gradient(170deg, #0f1e3a 0%, #060912 55%)
          `,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: 420,
          width: "100%",
          margin: "0 auto",
          padding: "max(3rem, calc(env(safe-area-inset-top, 0px) + 2rem)) 24px 24px",
        }}
      >
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: i <= step ? cta : "rgba(255,255,255,0.10)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{ flex: 1 }}
            >
              <h1 style={ONBOARDING_H1}>
                What&apos;s your name?
              </h1>
              <p style={{ fontFamily: "var(--font-apercu), sans-serif", fontSize: 14, color: TEXT_MID, margin: "0 0 28px" }}>
                So we know what to call you.
              </p>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canProceed && handleNext()}
                placeholder="Your first name"
                autoFocus
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.06)",
                  color: TEXT_HI,
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 16,
                  outline: "none",
                }}
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="goal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{ flex: 1 }}
            >
              <h1 style={ONBOARDING_H1}>
                What do you want to achieve?
              </h1>
              <p style={{ fontFamily: "var(--font-apercu), sans-serif", fontSize: 14, color: TEXT_MID, margin: "0 0 28px" }}>
                {intentCopy?.cardSubtitle ?? "Pick the area that matters most right now."}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedGoal(opt.id)}
                    style={{
                      padding: "14px 14px",
                      borderRadius: 14,
                      border: selectedGoal === opt.id
                        ? `2px solid ${cta}`
                        : "1px solid rgba(255,255,255,0.12)",
                      background: selectedGoal === opt.id ? ctaTint : "rgba(255,255,255,0.05)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-apercu), sans-serif",
                          fontSize: 14,
                          fontWeight: 600,
                          color: selectedGoal === opt.id ? cta : TEXT_HI,
                          lineHeight: 1.3,
                        }}
                      >
                        {opt.label}
                      </span>
                      <span style={{ fontSize: 15, opacity: 0.75, flexShrink: 0 }} aria-hidden>
                        {opt.emoji}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="location"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{ flex: 1 }}
            >
              <h1 style={ONBOARDING_H1}>
                Where are you based?
              </h1>
              <p style={{ fontFamily: "var(--font-apercu), sans-serif", fontSize: 14, color: TEXT_MID, margin: "0 0 28px" }}>
                We&apos;ll find events and opportunities near you.
              </p>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canProceed && handleNext()}
                placeholder="e.g. Vilnius, Lithuania"
                autoFocus
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.06)",
                  color: TEXT_HI,
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 16,
                  outline: "none",
                }}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="narrative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <h1 style={ONBOARDING_H1}>
                Describe your goal
              </h1>
              <p style={{ fontFamily: "var(--font-apercu), sans-serif", fontSize: 14, color: TEXT_MID, margin: "0 0 28px" }}>
                Be specific — what does success look like in 90 days?
              </p>
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder={intentCopy?.narrativePlaceholder ?? "e.g. I want to save €5,000 for a down payment by cutting unnecessary spending and finding a side income..."}
                autoFocus
                style={{
                  flex: 1,
                  minHeight: 140,
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.06)",
                  color: TEXT_HI,
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 15,
                  lineHeight: 1.6,
                  outline: "none",
                  resize: "none",
                }}
              />
              <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, color: TEXT_LO, marginTop: 8 }}>
                {narrative.trim().length}/20 characters minimum
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 32,
            paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
          }}
        >
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                padding: "14px 20px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "none",
                color: TEXT_MID,
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            style={{
              flex: 1,
              padding: "14px 24px",
              borderRadius: 14,
              border: "none",
              background: canProceed ? cta : "rgba(255,255,255,0.08)",
              color: canProceed ? "var(--primary-foreground, #060912)" : TEXT_LO,
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "0.04em",
              cursor: canProceed ? "pointer" : "default",
              transition: "all 0.15s",
            }}
          >
            {step === 3 ? "Build my plan →" : "Continue"}
          </button>
        </div>
      </div>
    </div>
    </FunnelThemeShell>
  );
}
