"use client";

import { type ReactNode, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrbAvatar } from "../mascot/OrbAvatar";

type Props = {
  step: number;
  totalSteps: number;
  question: string;
  helper?: string;
  children: ReactNode;
  ctaLabel?: string;
  ctaDisabled?: boolean;
  onCtaClick?: () => void;
  error?: string;
  showCoachBubble?: boolean;
  coachMessage?: string;
};

/**
 * Premium coaching aesthetic wrapper for each quiz step.
 * Renders: progress bar, animated icon slot, Fraunces question,
 * helper text, children (input/options), pill CTA with microcopy, optional coach bubble.
 */
export function OnboardingStep({
  step,
  totalSteps,
  question,
  helper,
  children,
  ctaLabel = "Continue",
  ctaDisabled = false,
  onCtaClick,
  error,
  showCoachBubble = false,
  coachMessage = "Nice to meet you already 👋",
}: Props) {
  const errorId = useId();
  const pct = Math.round((step / totalSteps) * 100);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-6">
      {/* Ambient glow behind card */}
      <div className="relative w-full max-w-[360px]">
        <div
          className="pointer-events-none absolute -inset-8 rounded-[40px] opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at 60% 40%, var(--accent-glow) 0%, var(--canvas-elevated) 60%, transparent 80%)",
          }}
          aria-hidden
        />

        {/* Card with themed border */}
        <div
          className="relative rounded-3xl border border-border"
          style={{ boxShadow: "var(--oq-card-shadow)" }}
        >
          <motion.div
            className="flex flex-col gap-5 rounded-3xl bg-card px-6 py-6"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* ── Progress bar ── */}
            <div className="flex items-center gap-3">
              <div
                className="relative h-1 flex-1 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Step ${step} of ${totalSteps}`}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--accent-primary), var(--accent-glow))",
                  }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
              <span
                className="shrink-0 text-[13px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Step {step} of {totalSteps}
              </span>
            </div>

            {/* ── Icon slot ── */}
            <div className="flex justify-center">
              <div
                className="animate-aurora-pulse rounded-full"
                style={{
                  animation: "oq-bounce-in 0.55s cubic-bezier(0.34,1.56,0.64,1) both, oq-float 3s ease-in-out 0.6s infinite, aurora-pulse 2s ease-in-out 0.6s infinite",
                }}
                aria-hidden
              >
                <OrbAvatar emotion="encouraging" size={72} />
              </div>
            </div>

            {/* ── Question ── */}
            <div className="space-y-2 text-center">
              <h2
                className="text-[27px] font-semibold leading-tight text-foreground"
                style={{
                  fontFamily: "var(--font-onboarding-display), Georgia, serif",
                }}
              >
                {question}
              </h2>
              {helper && (
                <p className="text-[16px] leading-relaxed text-muted-foreground">
                  {helper}
                </p>
              )}
            </div>

            {/* ── Children (input, tiles, etc.) ── */}
            <div>{children}</div>

            {/* ── Error message ── */}
            <div
              id={errorId}
              role="alert"
              aria-live="assertive"
              className="min-h-[20px]"
            >
              <AnimatePresence>
                {error && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-center text-[13px] font-medium text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* ── CTA ── */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={ctaDisabled ? undefined : onCtaClick}
                disabled={ctaDisabled}
                aria-label={ctaLabel}
                aria-describedby={error ? errorId : undefined}
                className="relative w-full overflow-hidden rounded-full text-[16px] font-semibold transition-transform active:translate-y-px"
                style={{
                  height: 56,
                  background: ctaDisabled
                    ? "var(--badge-bg)"
                    : "linear-gradient(135deg, var(--accent-primary), var(--accent-glow))",
                  boxShadow: ctaDisabled
                    ? "none"
                    : "inset 0 -2px 6px rgba(0,0,0,0.10), 0 4px 16px var(--accent-primary-glow-strong)",
                  cursor: ctaDisabled ? "default" : "pointer",
                  color: ctaDisabled ? "var(--text-muted)" : "white",
                }}
              >
                {ctaLabel}
              </button>

              {/* Microcopy */}
              <p className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
                Quick · Private · No spam
              </p>
            </div>

            {/* ── Coach bubble ── */}
            <AnimatePresence>
              {showCoachBubble && coachMessage && (
                <motion.div
                  key="coach-bubble"
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-start gap-2"
                  role="status"
                  aria-live="polite"
                >
                  {/* Avatar dot */}
                  <div
                    className="mt-0.5 h-6 w-6 shrink-0 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, var(--accent-primary), var(--accent-glow))",
                    }}
                    aria-hidden
                  />
                  <div
                    className="rounded-2xl rounded-tl-none px-3 py-2 text-[13px] leading-snug bg-muted text-foreground"
                  >
                    {coachMessage}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

