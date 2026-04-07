"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GeneratedTask, PipelineStep } from "../../types/pipeline";

const LIME = "#C8FF00";
const NAVY = "#060912";
const TEXT_HI = "rgba(235,242,255,0.95)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const FONT_HEADING = "var(--font-barlow-condensed), sans-serif";
const FONT_BODY = "var(--font-apercu), sans-serif";

type Props = {
  task: GeneratedTask | null;
  currentStep: PipelineStep | null;
  ambitionType: string | null;
  energy: string;
  timeAvailable: number;
  onSwap: (taskId: string, replacement: GeneratedTask) => void;
  onClose: () => void;
};

export default function SwapTaskSheet({ task, currentStep, ambitionType, energy, timeAvailable, onSwap, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  if (!task) return null;

  async function handleSwap() {
    if (!task) return;
    setLoading(true);
    try {
      const res = await fetch("/api/daily-tasks/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskToReplace: task,
          currentStep,
          ambitionType,
          energy,
          timeAvailable,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.replacement) {
        onSwap(task.id, data.replacement);
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setLoading(false);
      onClose();
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="app-fixed-phone"
        style={{
          bottom: 0,
          zIndex: 50,
          background: "rgba(15,32,64,0.98)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px 24px 0 0",
          padding: "20px 24px calc(96px + env(safe-area-inset-bottom, 0px))",
          boxShadow: "0 -12px 30px rgba(0,0,0,0.45)",
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.14)", margin: "0 auto 16px" }} />

        <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 900, fontStyle: "italic", fontSize: 22, color: TEXT_HI, margin: 0 }}>
          Swap task
        </h3>

        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: TEXT_MID, marginTop: 8, lineHeight: 1.5 }}>
          Replace &ldquo;{task.label}&rdquo; with an AI-generated alternative that serves the same purpose.
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "14px 20px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              cursor: "pointer",
              fontFamily: FONT_BODY,
              fontSize: 14,
              fontWeight: 600,
              color: TEXT_HI,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSwap}
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px 20px",
              background: loading ? "rgba(200,255,0,0.4)" : LIME,
              color: NAVY,
              border: "none",
              borderRadius: 14,
              cursor: loading ? "default" : "pointer",
              fontFamily: FONT_HEADING,
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: "0.04em",
              textTransform: "uppercase" as const,
            }}
          >
            {loading ? "Generating..." : "Swap it"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
