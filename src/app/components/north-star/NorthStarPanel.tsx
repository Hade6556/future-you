"use client";

import { useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePlanStore } from "../../state/planStore";
import { ParticleField } from "../particle-field";
import { buildNorthStarStatus } from "./status";
import { CommandRosette } from "./CommandRosette";
import { HeroSection } from "./HeroSection";
import { AssistantCard } from "./AssistantCard";

const MOTION_DURATION = 0.25;

export function NorthStarPanel() {
  const assistantOpen = usePlanStore((s) => s.homeAssistantOpen);
  const setAssistantOpen = usePlanStore((s) => s.setHomeAssistantOpen);
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.15 : MOTION_DURATION;

  const identityComplete = usePlanStore((s) => s.identityComplete);
  const planReady = usePlanStore((s) => s.planReady);
  const dailyStatus = usePlanStore((s) => s.dailyStatus);
  const futureScore = usePlanStore((s) => s.futureScore);
  const streak = usePlanStore((s) => s.streak);

  const status = buildNorthStarStatus({
    identityComplete,
    planReady,
    futureScore,
    dailyStatus,
    streak,
  });

  const open = useCallback(() => setAssistantOpen(true), [setAssistantOpen]);
  const close = useCallback(() => setAssistantOpen(false), [setAssistantOpen]);

  return (
    <>
      {!assistantOpen && (
        <div className="mx-auto flex min-w-0 max-w-lg flex-1 flex-col">
          <HeroSection onOpen={open} />
          <section className="flex flex-1 flex-col gap-3 overflow-y-auto py-6 md:gap-4">
            <p className="operator-label text-[10px] text-slate-500">Stacked Rituals</p>
            {status.chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={open}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 md:px-5"
              >
                <span className="plan-body font-semibold text-white">{chip.label}</span>
                <span
                  className={`shrink-0 plan-supporting font-medium ${
                    chip.status === "locked" ? "text-[var(--ritual-red)]" : "text-[var(--ion-green)]"
                  }`}
                >
                  {chip.status === "locked" ? "Locked" : chip.status === "ready" ? "Ready" : "In progress"}
                </span>
              </button>
            ))}
          </section>
        </div>
      )}

      <AnimatePresence>
        {assistantOpen && (
          <>
            <ParticleField minimal className="z-10" />
            <motion.div
              className="pointer-events-none fixed inset-0 z-20 w-full max-w-[100vw]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration, ease: "easeOut" }}
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(123,91,255,0.14) 0%, rgba(65,179,255,0.07) 40%, transparent 70%)",
              }}
            />
            <motion.div
              className="fixed inset-0 z-[35] w-full max-w-[100vw] bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration, ease: "easeOut" }}
              onClick={close}
              onKeyDown={(e) => e.key === "Escape" && close()}
              role="button"
              tabIndex={0}
              aria-label="Close assistant"
            />
            {/* Demoted orb: compact progress accent in header */}
            <div className="pointer-events-none fixed inset-x-0 top-[max(2.5rem,calc(env(safe-area-inset-top)+1rem))] z-50 flex flex-col items-center px-5">
              <div className="pointer-events-auto">
                <CommandRosette isOpen onClick={close} scale={0.75} />
              </div>
            </div>
            <AssistantCard status={status} onClose={close} />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
