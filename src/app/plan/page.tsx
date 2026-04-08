"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import type { IntakeResponse } from "../types/plan";
import type { PipelinePhase } from "../types/pipeline";
import { usePlanStore } from "../state/planStore";
import { ARCHETYPES } from "../data/archetypes";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { InspirationQuotes } from "../components/InspirationQuotes";
import { downloadPlanPDF } from "../components/PlanExportPDF";

const STORAGE_KEY_PREFIX = "behavio-plan-";

const LIME = "#C8FF00";
const NAVY = "#0A1628";
const TEXT_HI = "rgba(235,242,255,0.92)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const TEXT_LO = "rgba(120,155,195,0.40)";
const GLASS = "rgba(255,255,255,0.07)";
const GLASS_BORDER = "rgba(255,255,255,0.14)";

const glassCard: React.CSSProperties = {
  background: GLASS,
  border: `1px solid ${GLASS_BORDER}`,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: 20,
};

const heading: React.CSSProperties = {
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 800,
  fontStyle: "italic",
  color: TEXT_HI,
  margin: 0,
};

const bodyText: React.CSSProperties = {
  fontFamily: "var(--font-body), Georgia, serif",
  fontWeight: 400,
  color: TEXT_MID,
  lineHeight: 1.6,
  margin: 0,
};

const eyebrow: React.CSSProperties = {
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: 13,
  color: TEXT_LO,
  margin: 0,
};

const limeBadge: React.CSSProperties = {
  display: "inline-block",
  background: "rgba(200,255,0,0.08)",
  border: "1px solid rgba(200,255,0,0.18)",
  color: LIME,
  borderRadius: 100,
  padding: "6px 16px",
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 700,
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: "0.15em",
};

const ctaButton: React.CSSProperties = {
  display: "block",
  width: "100%",
  background: LIME,
  color: "#060912",
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 800,
  fontSize: 16,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  borderRadius: 100,
  padding: "20px 32px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 8px 32px rgba(200,255,0,0.25)",
  textAlign: "center" as const,
};

const outlineButton: React.CSSProperties = {
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  background: "rgba(255,255,255,0.04)",
  color: TEXT_MID,
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 700,
  fontSize: 14,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  borderRadius: 100,
  padding: "16px 28px",
  border: `1px solid ${GLASS_BORDER}`,
  cursor: "pointer",
};

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LockedPhaseOverlay({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        background: "rgba(6,9,18,0.70)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        borderRadius: 20,
        cursor: "pointer",
      }}
      onClick={onUnlock}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: LIME,
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 700,
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.10em",
        }}
      >
        <LockIcon />
        Unlock full plan
      </div>
      <p
        style={{
          fontFamily: "var(--font-body), Georgia, serif",
          fontSize: 12,
          color: TEXT_LO,
          margin: 0,
        }}
      >
        Tap to see pricing
      </p>
    </div>
  );
}

function PhaseCard({
  phase,
  index,
  locked,
  onUnlock,
}: {
  phase: PipelinePhase;
  index: number;
  locked?: boolean;
  onUnlock?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ ...glassCard, overflow: "hidden", position: "relative" }}>
      {locked && onUnlock && <LockedPhaseOverlay onUnlock={onUnlock} />}
      <button
        onClick={() => !locked && setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          padding: 20,
          textAlign: "left",
          background: "none",
          border: "none",
          cursor: locked ? "default" : "pointer",
          opacity: locked ? 0.35 : 1,
          filter: locked ? "blur(2px)" : "none",
          transition: "opacity 0.2s, filter 0.2s",
        }}
      >
        <span
          style={{
            display: "flex",
            height: 32,
            width: 32,
            flexShrink: 0,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: locked ? TEXT_LO : LIME,
            color: "#060912",
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          {index + 1}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              ...heading,
              fontSize: 16,
              lineHeight: 1.3,
            }}
          >
            {phase.phase_name}
          </p>
          <p
            style={{
              ...bodyText,
              fontSize: 12,
              color: TEXT_LO,
              marginTop: 3,
            }}
          >
            {phase.duration_weeks} week{phase.duration_weeks !== 1 ? "s" : ""}
          </p>
        </div>
        <span
          style={{
            color: TEXT_LO,
            fontSize: 13,
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          {locked ? <LockIcon /> : open ? "▲" : "▼"}
        </span>
      </button>

      {open && !locked && (
        <div
          style={{
            padding: "0 20px 20px",
            borderTop: `1px solid ${GLASS_BORDER}`,
            paddingTop: 16,
          }}
        >
          <p style={{ ...bodyText, fontSize: 14 }}>{phase.goal}</p>

          {phase.milestones.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <p style={{ ...eyebrow, marginBottom: 10 }}>Milestones</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {phase.milestones.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        marginTop: 7,
                        height: 5,
                        width: 5,
                        borderRadius: "50%",
                        background: LIME,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ ...bodyText, fontSize: 14, color: TEXT_HI }}>
                      {m}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase.steps.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <p style={{ ...eyebrow, marginBottom: 10 }}>Steps</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {phase.steps.map((step) => (
                  <div key={step.step_number}>
                    <span
                      style={{
                        ...heading,
                        fontSize: 14,
                        fontStyle: "normal",
                        fontWeight: 700,
                      }}
                    >
                      {step.step_number}. {step.title}
                    </span>
                    <p
                      style={{
                        ...bodyText,
                        fontSize: 13,
                        marginTop: 3,
                      }}
                    >
                      {step.description}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-body), Georgia, serif",
                        fontSize: 12,
                        color: LIME,
                        marginTop: 4,
                        margin: 0,
                        marginBlockStart: 4,
                      }}
                    >
                      ✓ {step.success_metric}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getPlanFromStorage(planId: string): IntakeResponse | null {
  if (typeof window === "undefined") return null;
  try {
    let raw = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${planId}`);
    if (!raw) raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${planId}`);
    if (!raw) return null;
    return JSON.parse(raw) as IntakeResponse;
  } catch {
    return null;
  }
}

export default function PlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReveal = searchParams.get("reveal") === "true";

  const planId = usePlanStore((s) => s.planId);
  const setPlanReady = usePlanStore((s) => s.setPlanReady);
  const acceptPlan = usePlanStore((s) => s.acceptPlan);
  const archetype = usePlanStore((s) => s.dogArchetype);
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);
  const userName = usePlanStore((s) => s.userName);
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const isPremium = usePlanStore((s) => s.isPremium);

  const handleUnlockPlan = () => {
    router.push("/paywall");
  };

  const arch = archetype ? ARCHETYPES.find((a) => a.id === archetype) : null;

  const [plan, setPlan] = useState<IntakeResponse | null | undefined>(undefined);
  const [pathIndex, setPathIndex] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!planId) {
        setPlan(null);
        return;
      }
      const data = getPlanFromStorage(planId);
      setPlan(data);
      if (data) setPlanReady(planId);
    }, 0);
    return () => clearTimeout(id);
  }, [planId, setPlanReady]);

  const handleDropIn = () => {
    acceptPlan();
    router.push("/");
  };

  /* ── Loading state ─────────────────────────────────────────────── */
  if (plan === undefined) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#060912",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        <p style={{ ...bodyText, color: TEXT_LO }}>Loading…</p>
      </div>
    );
  }

  /* ── No plan state ─────────────────────────────────────────────── */
  if (!plan) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#060912",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient mesh */}
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
        {/* Grid overlay */}
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
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100dvh",
            padding: "0 32px",
            textAlign: "center",
          }}
        >
          <p style={{ ...bodyText, fontSize: 15, maxWidth: 280 }}>
            No plan yet. Let&apos;s build your roadmap — your coach is ready.
          </p>
          <Link
            href="/intake"
            style={{
              ...ctaButton,
              display: "inline-block",
              width: "auto",
              marginTop: 28,
              textDecoration: "none",
            }}
          >
            Start my plan
          </Link>
        </div>
      </div>
    );
  }

  const path = plan.paths[pathIndex];
  const hasAlternatives = plan.paths.length > 1;

  const day1Step = pipelinePlan?.phases[0]?.steps[0] ?? null;
  const phase1 = pipelinePlan?.phases[0] ?? null;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Background gradient mesh ──────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 20%, rgba(200,255,0,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 10% 90%, rgba(15,40,110,0.40) 0%, transparent 55%),
            linear-gradient(170deg, #0f1e3a 0%, #060912 55%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* ── Subtle grid overlay ───────────────────────────────────── */}
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

      <div style={{ position: "relative", zIndex: 1, padding: "0 20px 140px" }}>
        {/* ── Behavio Logo ──────────────────────────────────────── */}
        <div
          style={{
            paddingTop: "max(3.5rem, env(safe-area-inset-top, 3.5rem))",
            paddingBottom: 28,
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: 20,
              color: "rgba(200,255,0,0.85)",
              letterSpacing: "0.02em",
            }}
          >
            behavio
          </span>
        </div>

        <div style={{ maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          {/* ── Reveal mode: Day 1 hero ───────────────────────────── */}
          {isReveal && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hero */}
              <div style={{ marginBottom: 28, textAlign: "center" }}>
                <span style={limeBadge}>Your plan is ready</span>
                <h1
                  style={{
                    ...heading,
                    fontSize: 44,
                    lineHeight: 0.96,
                    letterSpacing: "-0.03em",
                    marginTop: 18,
                  }}
                >
                  {userName ? `${userName},` : "Here's"}<br />
                  <span style={{ color: TEXT_HI }}>{userName ? "here's your " : "your "}</span>
                  <em style={{ fontStyle: "normal", color: LIME }}>Day 1.</em>
                </h1>
                {phase1 && (
                  <p style={{ ...bodyText, fontSize: 13, marginTop: 10, color: TEXT_LO }}>
                    {phase1.phase_name} · {phase1.duration_weeks} week
                    {phase1.duration_weeks !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* Day 1 task card */}
              {day1Step && (
                <div
                  style={{
                    background: "rgba(200,255,0,0.04)",
                    border: "1px solid rgba(200,255,0,0.16)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderRadius: 20,
                    padding: "28px 24px",
                    marginBottom: 24,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(200,255,0,0.30), transparent)",
                    }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: LIME,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-barlow-condensed), sans-serif",
                        fontWeight: 900,
                        fontSize: 18,
                        color: "#060912",
                        flexShrink: 0,
                      }}
                    >
                      1
                    </div>
                    <div>
                      <p style={{ ...eyebrow, color: "rgba(200,255,0,0.60)", fontSize: 12, letterSpacing: "0.22em" }}>
                        Today&apos;s focus
                      </p>
                      <h3
                        style={{
                          ...heading,
                          fontSize: 22,
                          lineHeight: 1.15,
                          marginTop: 2,
                        }}
                      >
                        {day1Step.title}
                      </h3>
                    </div>
                  </div>
                  <p style={{ ...bodyText, fontSize: 14, marginBottom: day1Step.success_metric ? 14 : 0 }}>
                    {day1Step.description}
                  </p>
                  {day1Step.success_metric && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        paddingTop: 14,
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M3 7l2.5 2.5L11 4" stroke={LIME} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p style={{ ...bodyText, fontSize: 12, color: TEXT_LO, fontStyle: "italic" }}>
                        {day1Step.success_metric}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <button onClick={handleDropIn} style={ctaButton}>
                Begin Day 1
              </button>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginTop: 32,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{ flex: 1, height: 1, background: GLASS_BORDER }}
                />
                <p style={eyebrow}>Your full roadmap</p>
                <div
                  style={{ flex: 1, height: 1, background: GLASS_BORDER }}
                />
              </div>
            </motion.div>
          )}

          {!isReveal && (
            <div style={{ marginBottom: 8 }}>
              <span style={limeBadge}>Your coaching plan</span>
            </div>
          )}

          {!isReveal && arch && (
            <p
              style={{
                ...bodyText,
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 20,
              }}
            >
              Built for {arch.name}s
            </p>
          )}

          {/* ── Values & Strengths ────────────────────────────────── */}
          <div style={{ ...glassCard, padding: 24, marginBottom: 20 }}>
            <p style={eyebrow}>Your Values & Strengths</p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 14,
              }}
            >
              {plan.values.map((v) => (
                <span
                  key={v}
                  style={{
                    ...limeBadge,
                    fontSize: 12,
                    padding: "5px 14px",
                  }}
                >
                  {v}
                </span>
              ))}
              {plan.roles.map((r) => (
                <span
                  key={r}
                  style={{
                    display: "inline-block",
                    background: "rgba(200,255,0,0.18)",
                    border: "1px solid rgba(200,255,0,0.30)",
                    color: LIME,
                    borderRadius: 100,
                    padding: "5px 14px",
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.08em",
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* ── Path Forward ──────────────────────────────────────── */}
          <div style={{ ...glassCard, padding: 24, marginBottom: 20 }}>
            <p style={eyebrow}>Your path forward</p>
            {path && (
              <>
                <h3
                  style={{
                    ...heading,
                    fontSize: 24,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    marginTop: 14,
                  }}
                >
                  {path.name}
                </h3>
                <p style={{ ...bodyText, fontSize: 15, marginTop: 10 }}>
                  {path.description}
                </p>
                {hasAlternatives && (
                  <button
                    onClick={() =>
                      setPathIndex((i) => (i + 1) % plan.paths.length)
                    }
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      marginTop: 16,
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      color: LIME,
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    View alternative path →
                  </button>
                )}
              </>
            )}
          </div>

          {/* ── Inspiration quotes ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
            style={{ marginBottom: 20 }}
          >
            <InspirationQuotes domain={ambitionType} />
          </motion.div>

          {/* ── Pipeline roadmap phases ───────────────────────────── */}
          {pipelinePlan && pipelinePlan.phases.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ ...eyebrow, marginBottom: 14 }}>
                Your {pipelinePlan.horizon_weeks}-week roadmap
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {pipelinePlan.phases.map((phase, i) => (
                  <PhaseCard
                    key={phase.phase_number}
                    phase={phase}
                    index={i}
                    locked={!isPremium && i > 0}
                    onUnlock={handleUnlockPlan}
                  />
                ))}
              </div>

              {/* Unlock CTA banner for free users */}
              {!isPremium && pipelinePlan.phases.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  style={{
                    marginTop: 16,
                    background: "rgba(200,255,0,0.04)",
                    border: "1px solid rgba(200,255,0,0.16)",
                    borderRadius: 16,
                    padding: "20px 24px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      ...heading,
                      fontSize: 18,
                      lineHeight: 1.3,
                      marginBottom: 6,
                    }}
                  >
                    {pipelinePlan.phases.length - 1} more phase{pipelinePlan.phases.length - 1 !== 1 ? "s" : ""} waiting for you
                  </p>
                  <p
                    style={{
                      ...bodyText,
                      fontSize: 13,
                      color: TEXT_LO,
                      marginBottom: 16,
                    }}
                  >
                    Your full roadmap is built. Unlock it to keep going.
                  </p>
                  <button
                    onClick={handleUnlockPlan}
                    style={{
                      ...ctaButton,
                      maxWidth: 280,
                      marginLeft: "auto",
                      marginRight: "auto",
                      fontSize: 14,
                      padding: "16px 28px",
                    }}
                  >
                    Unlock full plan
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* ── Export Plan (premium only) ────────────────────────── */}
          {isPremium && pipelinePlan && (
            <button
              onClick={() => downloadPlanPDF(pipelinePlan, userName)}
              style={{
                ...outlineButton,
                marginBottom: 16,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Export plan as PDF
            </button>
          )}

          {/* ── Main CTA ─────────────────────────────────────────── */}
          <button onClick={handleDropIn} style={ctaButton}>
            Start my daily coaching
          </button>
        </div>
      </div>
    </div>
  );
}
