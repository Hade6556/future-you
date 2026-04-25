"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { buildStarterPlan, persistStarterIntake, triggerBackgroundUpgrade } from "../state/starterPlan";
import type { AmbitionDomain } from "../types/plan";
import { INTENT_COPY } from "../data/intentConfig";
import { FunnelThemeShell } from "../components/funnel/FunnelThemeShell";
import { TEXT_HI, TEXT_MID, TEXT_LO } from "@/app/theme";

const PENDING_NARRATIVE_KEY = "behavio-pending-narrative";
const MIN_SCREEN_MS = 600;

const SYNTHESIS_STEPS = [
  "Reading your inputs",
  "Loading your archetype template",
  "Sequencing Phase 1",
];

/**
 * Resume / fallback /generating screen. Most users skip this entirely —
 * onboarding ships a starter plan and navigates straight to /. This screen
 * exists for direct visits (bookmarks, mid-funnel resume) and does the same
 * work in a single brief frame.
 */
export default function GeneratingPage() {
  const router = useRouter();
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const location = usePlanStore((s) => s.location);
  const dogArchetype = usePlanStore((s) => s.dogArchetype);
  const marketingIntent = usePlanStore((s) => s.marketingIntent);

  const [stageIndex, setStageIndex] = useState(0);
  const startedAt = useRef(0);
  const fired = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Cosmetic stage advance — purely UI flavor, finishes in ~600ms
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    SYNTHESIS_STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setStageIndex(i + 1), (i + 1) * 200));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    let narrative = "";
    try {
      narrative = sessionStorage.getItem(PENDING_NARRATIVE_KEY) ?? "";
    } catch { /* private mode */ }
    if (!narrative) {
      narrative = usePlanStore.getState().pendingNarrative ?? "";
    }

    const store = usePlanStore.getState();

    // Already has a plan — just go home.
    if (store.pipelinePlan) {
      router.replace("/");
      return;
    }

    if (!narrative) {
      router.replace("/onboarding");
      return;
    }

    const ambition: AmbitionDomain = (ambitionType ?? "wellness") as AmbitionDomain;
    const starter = buildStarterPlan({ ambition, narrative });

    store.setPipelinePlan(starter);
    store.setPlanReady(starter.plan_id);
    store.setIdentityComplete(true);
    persistStarterIntake(starter.plan_id, narrative);

    const intakeTone = marketingIntent ? INTENT_COPY[marketingIntent].intakeTone : "Life Coach";
    triggerBackgroundUpgrade({
      ambition,
      narrative,
      location: location || null,
      archetypeId: dogArchetype ?? null,
      marketingIntent: marketingIntent ?? null,
      intakeTone,
      planId: starter.plan_id,
      onPlanUpgrade: (plan) => usePlanStore.getState().setPipelinePlan(plan),
    });

    const elapsed = Date.now() - startedAt.current;
    const remaining = Math.max(0, MIN_SCREEN_MS - elapsed);
    setTimeout(() => router.replace("/"), remaining);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FunnelThemeShell intent={marketingIntent}>
      <div
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
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background: `
              radial-gradient(ellipse 60% 40% at 50% 30%, color-mix(in srgb, var(--cta) 12%, transparent) 0%, transparent 65%),
              linear-gradient(170deg, #0f1e3a 0%, #060912 60%)
            `,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 380 }}>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--cta)",
              margin: "0 0 14px",
              textAlign: "center",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "relative",
                display: "inline-flex",
                width: 6,
                height: 6,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "var(--cta)",
                  animation: "genPulse 1.4s ease-out infinite",
                  opacity: 0.55,
                }}
              />
              <span
                style={{
                  position: "relative",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--cta)",
                }}
              />
            </span>
            Synthesizing
          </p>
          <style>{`
            @keyframes genPulse {
              0%   { transform: scale(1);   opacity: 0.55; }
              70%  { transform: scale(2.6); opacity: 0;    }
              100% { transform: scale(2.6); opacity: 0;    }
            }
          `}</style>

          <h2
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(32px, 7.4vw, 44px)",
              color: TEXT_HI,
              letterSpacing: "-0.025em",
              lineHeight: 0.96,
              margin: "0 0 12px",
              textAlign: "center",
            }}
          >
            Building your{" "}
            <span style={{ fontStyle: "italic", color: "var(--cta)" }}>plan.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 14,
              color: TEXT_LO,
              margin: "0 0 32px",
              textAlign: "center",
            }}
          >
            On screen in seconds — refining in the background after.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "16px 18px",
              borderRadius: 16,
              background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.005))",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {SYNTHESIS_STEPS.map((step, i) => {
              const done = i < stageIndex;
              const active = i === stageIndex;
              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: done ? "var(--cta)" : "transparent",
                      border: done
                        ? "1px solid var(--cta)"
                        : `1.5px solid ${active ? "var(--cta)" : "rgba(255,255,255,0.16)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 9,
                      fontWeight: 900,
                      color: "#060912",
                      lineHeight: 1,
                    }}
                  >
                    {done ? "✓" : ""}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-apercu), sans-serif",
                      fontSize: 13.5,
                      color: done || active ? TEXT_HI : TEXT_MID,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.4,
                    }}
                  >
                    {step}
                    {active && (
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        {" "}…
                      </motion.span>
                    )}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </FunnelThemeShell>
  );
}
