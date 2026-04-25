"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import type { GoalPlan } from "../types/pipeline";
import type { IntakeResponse } from "../types/plan";
import { BEHAVIO_INTAKE_SAVED_EVENT } from "@/lib/behavio-intake-event";
import { AMBITION_GOAL_MAP } from "../types/pipeline";
import { INTENT_COPY } from "../data/intentConfig";
import { FunnelThemeShell } from "../components/funnel/FunnelThemeShell";
import { NAVY_PANEL as NAVY, TEXT_HI, TEXT_MID, TEXT_LO } from "@/app/theme";

const PENDING_NARRATIVE_KEY = "behavio-pending-narrative";
const STORAGE_KEY_PREFIX = "behavio-plan-";

const STAGES = [
  { id: 0, label: "Understanding your vision" },
  { id: 1, label: "Mapping your 90-day journey" },
  { id: 2, label: "Setting your milestones" },
];

/** Staggered checklist is cosmetic only — we leave as soon as `/api/plan` returns (intake continues in background). */
const STAGE_DURATION = 220;
const MIN_SCREEN_MS = 0;

function generatePlanId() {
  return `plan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function persistIntakePayload(planId: string, data: IntakeResponse) {
  const payload = JSON.stringify(data);
  try {
    sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${planId}`, payload);
  } catch {
    /* private mode */
  }
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${planId}`, payload);
  } catch {
    /* quota */
  }
}

/** Shown until `/api/intake` finishes; plan page swaps in real analysis when we dispatch the event. */
function stubIntakeFromNarrative(narrative: string): IntakeResponse {
  const clip = narrative.trim().slice(0, 200);
  return {
    values: ["Focus", "Growth", "Momentum"],
    roles: ["Builder"],
    paths: [
      {
        name: "Your roadmap",
        description:
          clip ||
          "We’re tailoring paths from what you shared — richer detail appears in a moment.",
        timeHorizon: "90 days",
        tradeoffs: "",
      },
    ],
  };
}

function CheckCircle() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="var(--cta)" />
      <path d="M7 12.5l3 3 7-7" stroke={NAVY} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerCircle() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.10)",
        borderTopColor: "var(--cta)",
      }}
    />
  );
}

export default function GeneratingPage() {
  const router = useRouter();
  const setPipelinePlan = usePlanStore((s) => s.setPipelinePlan);
  const setIdentityComplete = usePlanStore((s) => s.setIdentityComplete);
  const setPlanReady = usePlanStore((s) => s.setPlanReady);
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const location = usePlanStore((s) => s.location);
  const dogArchetype = usePlanStore((s) => s.dogArchetype);
  const marketingIntent = usePlanStore((s) => s.marketingIntent);

  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const apiDone = useRef(false);
  const navigated = useRef(false);
  const fetchStarted = useRef(false);
  const screenStartedAt = useRef(0);

  const maybeNavigate = () => {
    if (!apiDone.current || navigated.current) return;

    const go = () => {
      if (navigated.current) return;
      navigated.current = true;
      setProgress(100);
      // Payments disabled — always go home
      router.push("/");
    };

    const elapsed = Date.now() - screenStartedAt.current;
    const remaining = Math.max(0, MIN_SCREEN_MS - elapsed);
    if (remaining === 0) go();
    else setTimeout(go, remaining);
  };

  useEffect(() => {
    screenStartedAt.current = Date.now();
  }, []);

  useEffect(() => {
    const start = Date.now();
    const total = STAGES.length * STAGE_DURATION + 300;
    let frame: number;
    const tick = () => {
      if (apiDone.current) {
        setProgress(100);
        return;
      }
      const pct = Math.min(90, Math.round(((Date.now() - start) / total) * 90));
      setProgress(pct);
      if (pct < 90) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STAGES.forEach((stage, i) => {
      const t = setTimeout(() => {
        if (cancelled) return;
        setCurrentStage(Math.min(i + 1, STAGES.length - 1));
        setCompletedStages((prev) => [...prev, i]);
      }, (i + 1) * STAGE_DURATION);
      timers.push(t);
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (fetchStarted.current) return;
    fetchStarted.current = true;

    let narrative = "";
    try {
      narrative = sessionStorage.getItem(PENDING_NARRATIVE_KEY) ?? "";
    } catch {
      // ignore private mode
    }
    if (!narrative) {
      narrative = usePlanStore.getState().pendingNarrative ?? "";
    }

    if (!narrative) {
      router.replace("/onboarding");
      return;
    }

    const goalString = AMBITION_GOAL_MAP[ambitionType ?? "wellness"] || narrative.slice(0, 100);

    const userContext = {
      dreamNarrative: narrative,
      archetype: dogArchetype ?? undefined,
      ambitionDomain: ambitionType ?? undefined,
      marketingIntent: marketingIntent ?? undefined,
    };

    const intakeTone = marketingIntent ? INTENT_COPY[marketingIntent].intakeTone : "Life Coach";

    // Intake can be slower than the plan — don’t block the user on both.
    const intakePromise = fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        narrative,
        tone: intakeTone,
        marketingIntent: marketingIntent ?? undefined,
      }),
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json() as Promise<IntakeResponse>;
      })
      .catch(() => null);

    fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal: goalString,
        location: location || null,
        userContext,
      }),
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          console.error(`[generating] /api/plan returned ${res.status}`);
          return null;
        }
        return res.json() as Promise<GoalPlan>;
      })
      .then((planData) => {
        if (!planData || !Array.isArray(planData.phases) || planData.phases.length === 0) {
          setError("We couldn’t generate your plan. Please try again.");
          return;
        }

        const planId = generatePlanId();
        persistIntakePayload(planId, stubIntakeFromNarrative(narrative));

        setIdentityComplete(true);
        setPlanReady(planId);
        setPipelinePlan(planData);

        // Clear pending narrative now that plan is generated
        usePlanStore.getState().setPendingNarrative(null);
        try { sessionStorage.removeItem(PENDING_NARRATIVE_KEY); } catch { /* ignore */ }

        apiDone.current = true;
        setCompletedStages(STAGES.map((s) => s.id));
        setCurrentStage(STAGES.length - 1);
        maybeNavigate();

        void intakePromise.then((intakeData) => {
          if (!intakeData) return;
          persistIntakePayload(planId, intakeData);
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent(BEHAVIO_INTAKE_SAVED_EVENT, { detail: { planId } }),
            );
          }
        });
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <FunnelThemeShell intent={marketingIntent}>
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "0 24px",
          background: "#060912",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 15,
            color: TEXT_MID,
            textAlign: "center",
          }}
        >
          {error}
        </p>
        <button
          onClick={() => router.push("/onboarding")}
          style={{
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--cta)",
            background: "none",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
      </FunnelThemeShell>
    );
  }

  return (
    <FunnelThemeShell intent={marketingIntent}>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background mesh */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 20%, rgba(94,205,161,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 10% 90%, rgba(15,40,110,0.40) 0%, transparent 55%),
            linear-gradient(170deg, #0f1e3a 0%, #060912 55%)
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

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 360 }}>
        {/* Pulsing orb instead of mascot */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `radial-gradient(circle at 40% 35%, rgba(94,205,161,0.25), rgba(94,205,161,0.05) 70%)`,
              border: "1px solid rgba(94,205,161,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(94,205,161,0.10)",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "2px solid rgba(94,205,161,0.30)",
                borderTopColor: "var(--cta)",
              }}
            />
          </motion.div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: 32,
              color: TEXT_HI,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Building your plan...
          </h2>
          <p
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 14,
              color: TEXT_LO,
              marginTop: 6,
            }}
          >
            Tailored to how you work best
          </p>
        </div>

        {/* Stage list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 36,
          }}
        >
          {STAGES.map((stage) => {
            const isDone = completedStages.includes(stage.id);
            const isActive = !isDone && currentStage === stage.id;
            const isLocked = !isDone && !isActive;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: isLocked ? 0.35 : 1, x: 0 }}
                transition={{ delay: stage.id * 0.1, duration: 0.3 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isDone ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <CheckCircle />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div key="spinner">
                        <SpinnerCircle />
                      </motion.div>
                    ) : (
                      <div
                        key="dot"
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.10)",
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <span
                  style={{
                    fontFamily: "var(--font-apercu), sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    color: isDone || isActive ? TEXT_HI : TEXT_LO,
                    transition: "color 0.3s",
                  }}
                >
                  {stage.label}
                  {isActive && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  )}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 5,
            width: "100%",
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              borderRadius: 999,
              background: "var(--cta)",
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
    </FunnelThemeShell>
  );
}
