"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import type { IntakeResponse } from "../types/plan";
import type { PipelinePhase } from "../types/pipeline";
import { usePlanStore } from "../state/planStore";
import { ARCHETYPES } from "../data/archetypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { InspirationQuotes } from "../components/InspirationQuotes";

const STORAGE_KEY_PREFIX = "future-you-plan-";

function PhaseCard({ phase, index }: { phase: PipelinePhase; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl border border-border bg-card overflow-hidden"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: "var(--accent-primary)" }}
        >
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[15px] text-foreground leading-snug">
            {phase.phase_name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {phase.duration_weeks} week{phase.duration_weeks !== 1 ? "s" : ""}
          </p>
        </div>
        <span className="text-muted-foreground text-sm shrink-0 mt-0.5">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          <p className="text-[14px] text-muted-foreground">{phase.goal}</p>

          {phase.milestones.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Milestones
              </p>
              <ul className="space-y-1">
                {phase.milestones.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--accent-primary)" }} />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {phase.steps.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Steps
              </p>
              <ol className="space-y-2">
                {phase.steps.map((step) => (
                  <li key={step.step_number} className="text-[14px] text-foreground">
                    <span className="font-semibold">{step.step_number}. {step.title}</span>
                    <p className="text-muted-foreground mt-0.5 text-[13px]">{step.description}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: "var(--accent-secondary)" }}>
                      ✓ {step.success_metric}
                    </p>
                  </li>
                ))}
              </ol>
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
  const googleCalendarConnected = usePlanStore((s) => s.googleCalendarConnected);
  const setGoogleCalendarConnected = usePlanStore((s) => s.setGoogleCalendarConnected);

  const arch = archetype ? ARCHETYPES.find((a) => a.id === archetype) : null;

  const [plan, setPlan] = useState<IntakeResponse | null | undefined>(undefined);
  const [pathIndex, setPathIndex] = useState(0);
  const [calendarSyncing, setCalendarSyncing] = useState(false);
  const [calendarSyncError, setCalendarSyncError] = useState<string | null>(null);

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

  // Detect redirect back from Google OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const calStatus = params.get("calendar");
    if (calStatus === "connected") {
      setGoogleCalendarConnected(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("calendar");
      window.history.replaceState({}, "", url.toString());
    }
  }, [setGoogleCalendarConnected]);

  const handleCalendarSync = useCallback(async () => {
    if (!pipelinePlan) return;
    setCalendarSyncing(true);
    setCalendarSyncError(null);
    try {
      const res = await fetch("/api/calendar/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pipelinePlan),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setCalendarSyncError(data.error ?? "Sync failed");
      }
    } catch {
      setCalendarSyncError("Network error during sync");
    } finally {
      setCalendarSyncing(false);
    }
  }, [pipelinePlan]);

  const handleDropIn = () => {
    acceptPlan();
    router.push("/brief");
  };

  if (plan === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-6">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6">
        <p className="text-center text-[15px] text-muted-foreground">
          No plan yet. Let&apos;s build your roadmap — your coach is ready.
        </p>
        <Button render={<Link href="/intake" />} className="mt-6">
          Start my plan
        </Button>
      </div>
    );
  }

  const path = plan.paths[pathIndex];
  const hasAlternatives = plan.paths.length > 1;

  // Day 1 step for reveal mode
  const day1Step = pipelinePlan?.phases[0]?.steps[0] ?? null;
  const phase1 = pipelinePlan?.phases[0] ?? null;

  return (
    <div className="relative min-h-dvh bg-background px-4 pb-32 pt-14">
      <div className="mx-auto max-w-md space-y-5">

        {/* ── Reveal mode: Day 1 hero ─────────────────────────────────── */}
        {isReveal && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <span
                className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white"
                style={{ background: "var(--accent-secondary)" }}
              >
                Your plan is ready
              </span>
              <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-foreground">
                {userName ? `${userName}, here's` : "Here's"} your Day 1.
              </h1>
              {phase1 && (
                <p className="text-[14px] text-muted-foreground">
                  {phase1.phase_name} · {phase1.duration_weeks} week{phase1.duration_weeks !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {day1Step && (
              <Card
                className="border-0 shadow-md"
                style={{ background: "var(--card-surface)", boxShadow: "0 4px 20px rgba(232,98,42,0.12)" }}
              >
                <CardContent className="p-5 space-y-2">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white"
                    style={{ background: "var(--accent-primary)" }}
                  >
                    Day 1
                  </span>
                  <h3 className="text-[20px] font-extrabold text-foreground">{day1Step.title}</h3>
                  <p className="text-[14px] leading-relaxed text-muted-foreground">{day1Step.description}</p>
                  {day1Step.success_metric && (
                    <p className="text-[12px] italic text-muted-foreground">
                      Done when: {day1Step.success_metric}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <button
              onClick={handleDropIn}
              className="w-full rounded-full py-4 text-[16px] font-bold text-white shadow-md"
              style={{ background: "var(--accent-primary)" }}
            >
              Begin Day 1
            </button>

            <div className="flex items-center gap-3 pt-2">
              <div className="h-px flex-1 bg-border" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Your full roadmap
              </p>
              <div className="h-px flex-1 bg-border" />
            </div>
          </motion.div>
        )}

        {!isReveal && (
          <span
            className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white"
            style={{ background: "var(--accent-secondary)" }}
          >
            Your coaching plan
          </span>
        )}

        {!isReveal && arch && (
          <p className="text-sm font-medium text-muted-foreground">
            Built for {arch.name}s
          </p>
        )}

        {/* Values */}
        <Card className="border border-border shadow-sm" style={{ background: "var(--card-surface)" }}>
          <CardContent className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Your Values & Strengths
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {plan.values.map((v) => (
                <span
                  key={v}
                  className="rounded-full px-3 py-1 text-[12px] font-semibold"
                  style={{ background: "var(--badge-bg)", color: "var(--text-secondary)" }}
                >
                  {v}
                </span>
              ))}
              {plan.roles.map((r) => (
                <span
                  key={r}
                  className="rounded-full px-3 py-1 text-[12px] font-semibold text-white"
                  style={{ background: "var(--accent-secondary)" }}
                >
                  {r}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Path */}
        <Card className="border border-border shadow-sm" style={{ background: "var(--card-surface)" }}>
          <CardContent className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Your path forward
            </p>
            {path && (
              <>
                <h3 className="mt-3 text-[22px] font-extrabold tracking-tight text-foreground">
                  {path.name}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{path.description}</p>
                {hasAlternatives && (
                  <button
                    onClick={() => setPathIndex((i) => (i + 1) % plan.paths.length)}
                    className="mt-4 text-sm font-bold"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    View alternative path
                  </button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Inspiration quotes — domain-matched famous quotes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          <InspirationQuotes domain={ambitionType} />
        </motion.div>

        {/* Pipeline roadmap phases */}
        {pipelinePlan && pipelinePlan.phases.length > 0 && (
          <div className="space-y-3">
            <p className="font-accent text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Your {pipelinePlan.horizon_weeks}-week roadmap
            </p>
            {pipelinePlan.phases.map((phase, i) => (
              <PhaseCard key={phase.phase_number} phase={phase} index={i} />
            ))}
          </div>
        )}

        {/* Google Calendar connect / sync */}
        {pipelinePlan && (
          <div className="space-y-2">
            {!googleCalendarConnected ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => { window.location.href = "/api/auth/google-calendar"; }}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Connect Google Calendar
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => void handleCalendarSync()}
                disabled={calendarSyncing}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8 14l2.5 2.5L16 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {calendarSyncing ? "Syncing…" : "Sync Plan to Calendar"}
              </Button>
            )}
            {calendarSyncError && (
              <p className="text-center text-xs text-destructive">{calendarSyncError}</p>
            )}
          </div>
        )}

        <button
          onClick={handleDropIn}
          className="w-full rounded-full py-4 text-[16px] font-bold text-white shadow-md"
          style={{ background: "var(--accent-primary)" }}
        >
          Start my daily coaching
        </button>
      </div>
    </div>
  );
}
