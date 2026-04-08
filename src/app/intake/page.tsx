"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { BehavioLogo } from "../components/BehavioLogo";

const LIME  = "#C8FF00";
const TEXT_HI = "rgba(235,242,255,0.92)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const TEXT_LO = "rgba(120,155,195,0.40)";
const GLASS = "rgba(255,255,255,0.07)";
const GLASS_BORDER = "rgba(255,255,255,0.14)";

const PENDING_NARRATIVE_KEY = "behavio-pending-narrative";

export default function IntakePage() {
  const router = useRouter();
  const dogArchetype = usePlanStore((s) => s.dogArchetype);
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const userName = usePlanStore((s) => s.userName);
  const completeOnboarding = usePlanStore((s) => s.completeOnboarding);
  const completeQuiz = usePlanStore((s) => s.completeQuiz);
  const [narrative, setNarrative] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = narrative.trim().length >= 20;

  const handleSubmit = () => {
    const trimmed = narrative.trim();
    if (trimmed.length < 20) {
      setError("Tell me a bit more — the more detail, the better your plan.");
      return;
    }

    const enriched = [
      trimmed,
      ambitionType ? `Goal area: ${ambitionType}` : "",
      dogArchetype ? `Coaching style: ${dogArchetype}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      sessionStorage.setItem(PENDING_NARRATIVE_KEY, enriched);
    } catch {
      // ignore private mode
    }

    const { quizComplete: alreadyDone } = usePlanStore.getState();
    if (!alreadyDone) {
      completeQuiz("steady", ambitionType || "career");
    }
    completeOnboarding();
    router.push("/generating");
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 80% 55% at 50% -5%, rgba(50,90,220,0.38) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 90%, rgba(15,40,110,0.40) 0%, transparent 55%),
            linear-gradient(170deg, #0d1a3a 0%, #060912 55%)
          `,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
          padding: "max(3.5rem, env(safe-area-inset-top, 3.5rem)) 24px 32px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            position: "absolute",
            top: "max(3.5rem, env(safe-area-inset-top, 3.5rem))",
            left: 28,
            zIndex: 10,
          }}
        >
          <BehavioLogo size={20} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: 24 }}
          >
            <span
              style={{
                display: "inline-block",
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: LIME,
                background: "rgba(200,255,0,0.08)",
                border: "1px solid rgba(200,255,0,0.18)",
                borderRadius: 100,
                padding: "6px 14px",
              }}
            >
              One last thing
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 800,
              fontStyle: "italic",
              fontSize: 40,
              lineHeight: 0.96,
              letterSpacing: "-0.025em",
              color: TEXT_HI,
              margin: "0 0 8px",
            }}
          >
            {userName ? `${userName}, what` : "What"} does{" "}
            <em style={{ fontStyle: "normal", color: LIME }}>winning</em> look
            like?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            style={{
              fontFamily: "var(--font-body), Georgia, serif",
              fontWeight: 400,
              fontSize: 14,
              color: TEXT_MID,
              lineHeight: 1.6,
              margin: "0 0 24px",
              maxWidth: 300,
            }}
          >
            Be specific — the more detail you give, the sharper your plan.
          </motion.p>

          {/* Textarea */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <textarea
              value={narrative}
              onChange={(e) => {
                setNarrative(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. I want to launch my first product by summer, feel confident enough to pitch investors, and build a small team I'm proud of..."
              autoFocus
              rows={3}
              style={{
                width: "100%",
                minHeight: 100,
                resize: "none",
                padding: "16px 18px",
                background: GLASS,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${error ? "rgba(255,80,80,0.50)" : GLASS_BORDER}`,
                borderRadius: 16,
                color: TEXT_HI,
                fontFamily: "var(--font-body), Georgia, serif",
                fontWeight: 400,
                fontSize: 15,
                lineHeight: 1.6,
                outline: "none",
                boxSizing: "border-box" as const,
              }}
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: "var(--font-body), Georgia, serif",
                    fontSize: 12,
                    color: "#FF5555",
                    margin: 0,
                  }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleSubmit}
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
                boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              Create my plan
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden
              >
                <path
                  d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>

            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: TEXT_LO,
                textAlign: "center",
                margin: 0,
              }}
            >
              Quick · Private · No credit card required
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
