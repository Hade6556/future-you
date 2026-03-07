"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { PrimaryButton } from "./ui";
import type { TileStatus } from "./StatusTile";

const STATUS_LABEL: Record<TileStatus, string> = {
  locked: "Locked",
  ready: "Ready",
  in_progress: "In progress",
};

const CHIP_SUMMARY: Record<string, Record<TileStatus, string>> = {
  identity: { locked: "Take the quiz to find your coaching style.", ready: "Your profile is set.", in_progress: "Getting to know you..." },
  plan: { locked: "Complete the quiz to unlock your plan.", ready: "Your coaching plan is ready.", in_progress: "Building your plan..." },
  daily: { locked: "Accept your plan to start daily coaching.", ready: "Today's coaching complete.", in_progress: "Today's coaching session." },
};

type ChipId = "identity" | "plan" | "daily";

type AssistantBubbleProps = {
  onClose: () => void;
};

export function AssistantBubble({ onClose }: AssistantBubbleProps) {
  const [expandedChip, setExpandedChip] = useState<ChipId | null>(null);
  const reduceMotion = useReducedMotion();

  const planReady = usePlanStore((s) => s.planReady);
  const identityComplete = usePlanStore((s) => s.identityComplete);
  const dailyStatus = usePlanStore((s) => s.dailyStatus);
  const streak = usePlanStore((s) => s.streak);

  const identityStatus: TileStatus = identityComplete ? "ready" : "locked";
  const planStatus: TileStatus = planReady ? "ready" : "locked";
  const dailyStatusTile: TileStatus =
    planReady && dailyStatus !== "align"
      ? dailyStatus === "complete"
        ? "ready"
        : "in_progress"
      : "locked";

  const statusMessage = [
    identityComplete ? "Profile set." : "Quiz pending.",
    planReady ? "Plan ready." : "Plan building.",
    dailyStatusTile === "locked" ? "Coaching locked." : dailyStatusTile === "ready" ? "Today done!" : "Coaching active.",
  ].join(" ");

  const chips: { id: ChipId; label: string; status: TileStatus; href: string; cta: string; disabled: boolean }[] = [
    { id: "identity", label: "Quiz & Profile", status: identityStatus, href: "/quiz", cta: "Take quiz", disabled: false },
    { id: "plan", label: "Coaching Plan", status: planStatus, href: "/plan", cta: "View plan", disabled: !planReady },
    { id: "daily", label: "Daily Coaching", status: dailyStatusTile, href: "/brief", cta: "Open session", disabled: !planReady },
  ];

  const duration = reduceMotion ? 0.2 : 0.35;

  const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (info.offset.y > 80 || info.velocity.y > 300) onClose();
  };

  return (
    <motion.div
      role="dialog"
      aria-label="Future Me coach"
      className="glass fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-5 right-5 z-50 max-h-[60dvh] overflow-hidden rounded-[28px] p-6 md:left-1/2 md:right-auto md:w-full md:max-w-lg md:-translate-x-1/2"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.4 }}
      onDragEnd={handleDragEnd}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration, ease: "easeOut" }}
    >
      <div className="flex max-h-[55dvh] flex-col gap-5 overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[17px] leading-[1.5] text-white">
            Future Me: {statusMessage}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="shrink-0 rounded-full p-2 text-muted transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {chips.map((chip) => (
            <div key={chip.id} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              <button
                type="button"
                onClick={() => setExpandedChip(expandedChip === chip.id ? null : chip.id)}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-white/5"
              >
                <span className="text-[15px] font-medium text-white">{chip.label}</span>
                <span className="flex-1 text-right text-[13px] text-muted">{STATUS_LABEL[chip.status]}</span>
                <motion.span
                  animate={{ rotate: expandedChip === chip.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence>
                {expandedChip === chip.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-white/[0.06] px-4 pb-4 pt-2"
                  >
                    <p className="mb-3 text-[14px] text-muted">
                      {CHIP_SUMMARY[chip.id]?.[chip.status]}
                    </p>
                    {chip.disabled ? (
                      <span className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-[14px] text-muted">
                        Take the quiz first
                      </span>
                    ) : (
                      <PrimaryButton href={chip.href} className="w-full">
                        {chip.cta}
                      </PrimaryButton>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Streak indicator */}
        <p className="text-center text-[12px] text-muted/70">
          Streak: {streak} {streak === 1 ? "day" : "days"}
        </p>
      </div>

      {/* Swipe hint */}
      <div className="mt-2 flex justify-center">
        <span className="h-1 w-8 rounded-full bg-white/20" aria-hidden />
      </div>
    </motion.div>
  );
}
