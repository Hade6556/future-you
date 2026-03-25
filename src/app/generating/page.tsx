"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { MascotReactor } from "../components/mascot/MascotReactor";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { GoalPlan } from "../types/pipeline";
import type { IntakeResponse } from "../types/plan";

const PENDING_NARRATIVE_KEY = "future-you-pending-narrative";
const STORAGE_KEY_PREFIX = "future-you-plan-";

const STAGES = [
  { id: 0, label: "Understanding your vision" },
  { id: 1, label: "Mapping your 90-day journey" },
  { id: 2, label: "Setting your milestones" },
  { id: 3, label: "Curating your resources" },
];

const STAGE_DURATION = 1400; // ms per stage minimum

function generatePlanId() {
  return `plan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function GeneratingPage() {
  const router = useRouter();
  const setPipelinePlan = usePlanStore((s) => s.setPipelinePlan);
  const setIdentityComplete = usePlanStore((s) => s.setIdentityComplete);
  const setPlanReady = usePlanStore((s) => s.setPlanReady);

  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Flags shared between the two async processes (stages timer + API fetch)
  const apiDone = useRef(false);
  const stagesDone = useRef(false);
  const navigated = useRef(false);

  const maybeNavigate = () => {
    if (apiDone.current && stagesDone.current && !navigated.current) {
      navigated.current = true;
      setProgress(100);
      setTimeout(() => router.push("/plan?reveal=true"), 350);
    }
  };

  // Progress bar — runs over ~6s total
  useEffect(() => {
    const start = Date.now();
    const total = STAGES.length * STAGE_DURATION + 800;
    let frame: number;
    const tick = () => {
      const pct = Math.min(95, Math.round(((Date.now() - start) / total) * 100));
      setProgress(pct);
      if (pct < 95) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Stage timer cascade
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STAGES.forEach((stage, i) => {
      const t = setTimeout(() => {
        if (cancelled) return;
        setCurrentStage(Math.min(i + 1, STAGES.length - 1));
        setCompletedStages((prev) => [...prev, i]);
        if (i === STAGES.length - 1) {
          stagesDone.current = true;
          maybeNavigate();
        }
      }, (i + 1) * STAGE_DURATION);
      timers.push(t);
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch plan from API
  useEffect(() => {
    let narrative = "";
    try {
      narrative = sessionStorage.getItem(PENDING_NARRATIVE_KEY) ?? "";
    } catch {
      // ignore private mode
    }

    if (!narrative) {
      router.replace("/intake");
      return;
    }

    fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ narrative, tone: "Life Coach" }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((b: { error?: string }) => Promise.reject(new Error(b?.error || "Something went wrong")));
        return res.json() as Promise<IntakeResponse>;
      })
      .then((data) => {
        setIdentityComplete(true);
        const planId = generatePlanId();
        const payload = JSON.stringify(data);
        sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${planId}`, payload);
        try { localStorage.setItem(`${STORAGE_KEY_PREFIX}${planId}`, payload); } catch { /* quota */ }
        setPlanReady(planId);

        if ("phases" in data) {
          setPipelinePlan(data as unknown as GoalPlan);
        }

        apiDone.current = true;
        maybeNavigate();
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div
        className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6"
        style={{ background: "var(--canvas-base)" }}
      >
        <p className="text-center text-[15px]" style={{ color: "var(--text-secondary)" }}>{error}</p>
        <button
          onClick={() => router.push("/intake")}
          className="text-sm font-semibold underline"
          style={{ color: "var(--accent-primary)" }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6"
      style={{ background: "var(--canvas-base)" }}
    >
      <div className="mx-auto w-full max-w-sm space-y-8">
        {/* Mascot floating */}
        <motion.div
          className="flex justify-center"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <MascotReactor emotion="encouraging" size={120} />
        </motion.div>

        {/* Heading */}
        <div className="space-y-1 text-center">
          <h2 className="font-display text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Building your plan...</h2>
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>Tailored to how you work best</p>
        </div>

        {/* Stage list */}
        <div className="flex flex-col gap-3">
          {STAGES.map((stage) => {
            const isDone = completedStages.includes(stage.id);
            const isActive = !isDone && currentStage === stage.id;
            const isLocked = !isDone && !isActive;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: isLocked ? 0.4 : 1, x: 0 }}
                transition={{ delay: stage.id * 0.1, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                {/* Status icon */}
                <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isDone ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white"
                      >
                        <CheckIcon className="h-3.5 w-3.5" style={{ color: "#9BB068" }} />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        key="spinner"
                        className="h-5 w-5 rounded-full border-2"
                        style={{ borderColor: "var(--card-stroke)", borderTopColor: "var(--accent-primary)" }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <div key="dot" className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--card-stroke)" }} />
                    )}
                  </AnimatePresence>
                </div>

                {/* Label */}
                <span
                  className="text-[15px] font-medium transition-colors"
                  style={{
                    color: isDone ? "var(--text-primary)" : isActive ? "var(--text-primary)" : "var(--text-muted)",
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
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: "var(--card-stroke)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--accent-primary)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
