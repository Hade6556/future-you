"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GoalPlan, PipelinePhase } from "../../types/pipeline";
import type { DayInfo } from "../../utils/dayEngine";

type Props = {
  plan: GoalPlan;
  dayInfo: DayInfo;
};

export function JourneyPath({ plan, dayInfo }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [previewPhase, setPreviewPhase] = useState<PipelinePhase | null>(null);

  const phases = plan.phases;
  const currentPhaseIndex = phases.findIndex((p) => p === dayInfo.currentPhase);

  // Days until next phase
  function daysUntilPhase(phaseIndex: number): number {
    let dayCount = 1;
    for (let pi = 0; pi < phaseIndex; pi++) {
      for (const step of phases[pi].steps) {
        dayCount += Math.max(1, step.duration_weeks * 7);
      }
    }
    return Math.max(0, dayCount - dayInfo.currentDay);
  }

  const nextPhaseIndex = currentPhaseIndex + 1;
  const daysToNextPhase = nextPhaseIndex < phases.length ? daysUntilPhase(nextPhaseIndex) : null;

  return (
    <div className="mx-4">
      <div className="mb-2 flex items-center justify-between">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: "var(--text-muted)" }}
        >
          Your Journey
        </p>
        {daysToNextPhase !== null && daysToNextPhase > 0 && (
          <p className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            Phase {nextPhaseIndex + 1} in {daysToNextPhase}d
          </p>
        )}
      </div>

      {/* Scrollable path */}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex items-center" style={{ minWidth: `${phases.length * 120}px` }}>
          {phases.map((phase, pi) => {
            const isCompleted = pi < currentPhaseIndex;
            const isCurrent = pi === currentPhaseIndex;
            const isFuture = pi > currentPhaseIndex;

            return (
              <div key={pi} className="flex flex-1 items-center">
                {/* Connector line (before first node) */}
                {pi > 0 && (
                  <div
                    className="h-[2px] flex-1"
                    style={{
                      background: isCompleted || isCurrent
                        ? "var(--accent-secondary)"
                        : "var(--badge-bg)",
                    }}
                  />
                )}

                {/* Phase node */}
                <button
                  className="flex flex-col items-center gap-1.5 shrink-0"
                  style={{ width: "80px" }}
                  onClick={() => isFuture && setPreviewPhase(phase)}
                  aria-label={`${phase.phase_name}${isFuture ? " — tap to preview" : ""}`}
                >
                  {/* Circle */}
                  <div
                    className={[
                      "flex h-12 w-12 items-center justify-center rounded-full border-2",
                      isCurrent ? "animate-journey-node-pulse" : "",
                    ].join(" ")}
                    style={{
                      background: isCompleted
                        ? "var(--accent-secondary)"
                        : isCurrent
                        ? "var(--accent-primary)"
                        : "var(--canvas-base)",
                      borderColor: isCompleted
                        ? "var(--accent-secondary)"
                        : isCurrent
                        ? "var(--accent-primary)"
                        : "var(--card-stroke)",
                      opacity: isFuture ? 0.55 : 1,
                    }}
                  >
                    {isCompleted ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                        <path d="M4 10l4 4 8-8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span
                        className="text-[13px] font-black"
                        style={{ color: isCurrent ? "white" : "var(--text-muted)" }}
                      >
                        {pi + 1}
                      </span>
                    )}
                  </div>

                  {/* Phase label */}
                  <div className="text-center">
                    <p
                      className="text-[10px] font-bold leading-tight"
                      style={{
                        color: isCompleted
                          ? "var(--accent-secondary)"
                          : isCurrent
                          ? "var(--accent-primary)"
                          : "var(--text-muted)",
                        maxWidth: "72px",
                      }}
                    >
                      {phase.phase_name}
                    </p>
                    {isCurrent && (
                      <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--accent-primary)" }}>
                        You are here
                      </p>
                    )}
                    {isFuture && (
                      <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                        tap to peek →
                      </p>
                    )}
                  </div>
                </button>

                {/* Connector line (after last? no) */}
                {pi < phases.length - 1 && (
                  <div
                    className="h-[2px] flex-1"
                    style={{
                      background: isCompleted ? "var(--accent-secondary)" : "var(--badge-bg)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase preview sheet */}
      <AnimatePresence>
        {previewPhase && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.35)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewPhase(null)}
            />
            {/* Sheet */}
            <motion.div
              className="fixed bottom-0 left-1/2 z-50 w-full max-w-md rounded-t-3xl px-6 pb-10 pt-6"
              style={{ background: "var(--card-surface)", transform: "translateX(-50%)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            >
              {/* Handle */}
              <div className="mx-auto mb-5 h-1 w-10 rounded-full" style={{ background: "var(--card-stroke)" }} />

              <p
                className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--accent-primary)" }}
              >
                Coming up
              </p>
              <h3
                className="mb-2 text-[22px] font-extrabold leading-tight tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {previewPhase.phase_name}
              </h3>
              <p className="mb-4 text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {previewPhase.goal}
              </p>

              {previewPhase.milestones.length > 0 && (
                <div>
                  <p
                    className="mb-2 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Milestones
                  </p>
                  <ul className="space-y-1.5">
                    {previewPhase.milestones.slice(0, 3).map((m, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 text-[12px]" aria-hidden>🎯</span>
                        <p className="text-[13px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                          {m}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                className="mt-6 w-full rounded-full py-3.5 text-[14px] font-bold text-white"
                style={{ background: "var(--accent-primary)" }}
                onClick={() => setPreviewPhase(null)}
              >
                Back to today
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
