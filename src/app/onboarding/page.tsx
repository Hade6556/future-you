"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { buildStarterPlan, persistStarterIntake, triggerBackgroundUpgrade } from "../state/starterPlan";
import type { AmbitionDomain } from "../types/plan";
import { defaultAmbitionForIntent } from "../types/marketingIntent";
import { INTENT_COPY } from "../data/intentConfig";
import { FunnelThemeShell } from "../components/funnel/FunnelThemeShell";
import { ACCENT, TEXT_HI, TEXT_MID, TEXT_LO, accentRgba } from "@/app/theme";

const PENDING_NARRATIVE_KEY = "behavio-pending-narrative";

const ONBOARDING_EYEBROW: CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: ACCENT,
  margin: "0 0 12px",
};

const ONBOARDING_H1: CSSProperties = {
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 900,
  fontSize: "clamp(32px, 7vw, 40px)",
  color: TEXT_HI,
  margin: "0 0 10px",
  lineHeight: 1.0,
  letterSpacing: "-0.025em",
};

const ONBOARDING_SUB: CSSProperties = {
  fontFamily: "var(--font-apercu), sans-serif",
  fontSize: 14.5,
  color: TEXT_MID,
  lineHeight: 1.5,
  margin: "0 0 28px",
};

const ONBOARDING_INPUT: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
  color: TEXT_HI,
  fontFamily: "var(--font-apercu), sans-serif",
  fontSize: 15.5,
  outline: "none",
  letterSpacing: "-0.005em",
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
    setSelectedGoal((prev) => {
      if (prev) return prev;
      if (marketingIntent) return defaultAmbitionForIntent(marketingIntent);
      return "confidence";
    });
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

      // ── Instant plan: ship a starter, fire AI upgrade in background ─────
      const ambition = selectedGoal!;
      const starter = buildStarterPlan({ ambition, narrative: trimmed });
      const store = usePlanStore.getState();
      store.setPipelinePlan(starter);
      store.setPlanReady(starter.plan_id);
      store.setIdentityComplete(true);
      persistStarterIntake(starter.plan_id, trimmed);

      const intakeTone = marketingIntent ? INTENT_COPY[marketingIntent].intakeTone : "Life Coach";
      triggerBackgroundUpgrade({
        ambition,
        narrative: trimmed,
        location: locationInput.trim() || null,
        archetypeId: store.dogArchetype ?? null,
        marketingIntent: marketingIntent ?? null,
        intakeTone,
        planId: starter.plan_id,
        onPlanUpgrade: (plan) => {
          usePlanStore.getState().setPipelinePlan(plan);
        },
      });

      router.push("/");
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
        <div style={{ display: "flex", gap: 6, marginBottom: 44 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 2,
                borderRadius: 999,
                background: i <= step ? cta : "rgba(255,255,255,0.06)",
                transition: "background 320ms",
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
              <p style={ONBOARDING_EYEBROW}>↳ Step 01</p>
              <h1 style={ONBOARDING_H1}>
                What&apos;s your <span style={{ fontStyle: "italic", color: ACCENT }}>name?</span>
              </h1>
              <p style={ONBOARDING_SUB}>So we know what to call you.</p>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canProceed && handleNext()}
                placeholder="Your first name"
                autoFocus
                style={ONBOARDING_INPUT}
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
              <p style={ONBOARDING_EYEBROW}>↳ Step 02</p>
              <h1 style={ONBOARDING_H1}>
                What do you want to <span style={{ fontStyle: "italic", color: ACCENT }}>achieve?</span>
              </h1>
              <p style={ONBOARDING_SUB}>
                {intentCopy?.cardSubtitle ?? "Pick the area that matters most right now."}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedGoal(opt.id)}
                    style={{
                      padding: "14px",
                      borderRadius: 14,
                      border: `1px solid ${selectedGoal === opt.id ? accentRgba(0.45) : "rgba(255,255,255,0.08)"}`,
                      background: selectedGoal === opt.id
                        ? accentRgba(0.10)
                        : "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "border-color 160ms, background 160ms",
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
                          fontWeight: selectedGoal === opt.id ? 600 : 500,
                          color: selectedGoal === opt.id ? TEXT_HI : TEXT_MID,
                          lineHeight: 1.3,
                          letterSpacing: "-0.005em",
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
              <p style={ONBOARDING_EYEBROW}>↳ Step 03</p>
              <h1 style={ONBOARDING_H1}>
                Where are you <span style={{ fontStyle: "italic", color: ACCENT }}>based?</span>
              </h1>
              <p style={ONBOARDING_SUB}>We&apos;ll find events and opportunities near you.</p>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canProceed && handleNext()}
                placeholder="e.g. Vilnius, Lithuania"
                autoFocus
                style={ONBOARDING_INPUT}
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
              <p style={ONBOARDING_EYEBROW}>↳ Step 04</p>
              <h1 style={ONBOARDING_H1}>
                Describe your <span style={{ fontStyle: "italic", color: ACCENT }}>goal.</span>
              </h1>
              <p style={ONBOARDING_SUB}>
                Be specific — what does success look like in 90 days?
              </p>
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder={intentCopy?.narrativePlaceholder ?? "e.g. I want to save €5,000 for a down payment by cutting unnecessary spending and finding a side income..."}
                autoFocus
                style={{
                  ...ONBOARDING_INPUT,
                  flex: 1,
                  minHeight: 140,
                  fontSize: 15,
                  lineHeight: 1.6,
                  resize: "none",
                }}
              />
              <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: TEXT_LO, marginTop: 10 }}>
                {narrative.trim().length}/20 characters
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
                padding: "14px 18px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "transparent",
                color: TEXT_MID,
                fontFamily: "var(--font-apercu), sans-serif",
                fontSize: 14.5,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "-0.005em",
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
              borderRadius: 12,
              border: "none",
              background: canProceed
                ? `linear-gradient(180deg, ${cta} 0%, color-mix(in srgb, ${cta} 88%, #000000) 100%)`
                : "rgba(255,255,255,0.05)",
              color: canProceed ? "var(--primary-foreground, #060912)" : TEXT_LO,
              fontFamily: "var(--font-apercu), sans-serif",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "-0.005em",
              cursor: canProceed ? "pointer" : "default",
              transition: "background 160ms, box-shadow 160ms",
              boxShadow: canProceed
                ? `0 1px 0 rgba(255,255,255,0.20) inset, 0 12px 24px -10px ${accentRgba(0.55)}`
                : "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {step === 3 ? "Build my plan" : "Continue"}
            {canProceed && (
              <span aria-hidden style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 12 }}>→</span>
            )}
          </button>
        </div>
      </div>
    </div>
    </FunnelThemeShell>
  );
}
