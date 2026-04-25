"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePlanStore, todayISO } from "./state/planStore";
import { computeDayInfo } from "./utils/dayEngine";
import { DailyCoachingSection } from "./components/DailyCoachingSection";
import { StreakMomentumCard } from "./components/home/StreakMomentumCard";
import { GapChart } from "./components/home/GapChart";
import HomeLivePulse from "./components/home/HomeLivePulse";
import { ACCENT, ACCENT_HOVER, ON_ACCENT, accentRgba } from "@/app/theme";
import type { ArchetypeId, AmbitionDomain } from "./types/plan";

function formatHeaderDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const ARCHETYPE_LABEL: Record<ArchetypeId, string> = {
  steady: "Steady Builder",
  strategist: "Laser Strategist",
  endurance: "Endurance Engine",
  creative: "Creative Spark",
  guardian: "Guardian",
  explorer: "Explorer",
};

const AMBITION_LABEL: Record<AmbitionDomain, string> = {
  entrepreneur: "Entrepreneurship",
  athlete: "Health & Fitness",
  weight_loss: "Weight Loss",
  creative: "Creative Work",
  student: "Studies",
  wellness: "Wellness",
  career: "Career",
  finance: "Finance",
  language: "Language",
  travel: "Travel",
  relationships: "Relationships",
  productivity: "Productivity",
  mindfulness: "Mindfulness",
  confidence: "Personal Growth",
};

/** Sentence-case a user-typed string ("advance my career" → "Advance my career"). */
function sentenceCase(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function HomeClient() {
  const quizComplete       = usePlanStore((s) => s.quizComplete);
  const onboardingComplete = usePlanStore((s) => s.onboardingComplete);
  const pipelinePlan       = usePlanStore((s) => s.pipelinePlan);
  const planStartDate      = usePlanStore((s) => s.planStartDate);
  const userName           = usePlanStore((s) => s.userName);
  const streak             = usePlanStore((s) => s.streak);
  const planReady          = usePlanStore((s) => s.planReady);
  const todayStatus        = usePlanStore((s) => s.todayStatus);
  const hydrateFromServer  = usePlanStore((s) => s.hydrateFromServer);

  const todayTasks         = usePlanStore((s) => s.todayTasks);
  const todayTasksDate     = usePlanStore((s) => s.todayTasksDate);
  const toggleDailyTask    = usePlanStore((s) => s.toggleDailyTask);
  const dogArchetype       = usePlanStore((s) => s.dogArchetype);
  const ambitionType       = usePlanStore((s) => s.ambitionType);

  const [mounted, setMounted] = useState(false);

  const dayInfo = useMemo(
    () => (pipelinePlan && planStartDate ? computeDayInfo(pipelinePlan, planStartDate) : null),
    [pipelinePlan, planStartDate],
  );

  // Single hydration + daily visit recording
  useEffect(() => {
    setMounted(true);
    void hydrateFromServer().then(() => {
      queueMicrotask(() => {
        const s = usePlanStore.getState();
        if (s.quizComplete && s.onboardingComplete) {
          s.recordDailyVisit();
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onboardingReady = quizComplete && onboardingComplete && pipelinePlan;

  if (!mounted || !onboardingReady) {
    return null;
  }

  const firstName = userName ? userName.split(" ")[0] : "";
  const today = todayISO();
  const tasksReady = todayTasksDate === today && todayTasks.length > 0;
  const activeTasks = todayTasks.filter((t) => !t.deferred);
  const doneCount = activeTasks.filter((t) => t.completed).length;
  const allDone = tasksReady && doneCount === activeTasks.length;
  const goalText = pipelinePlan?.goal_raw?.trim() ?? "";

  const greetingText = (() => {
    if (todayStatus === "done") {
      return firstName ? `Closed the gap, ${firstName}.` : "You closed the gap today.";
    }
    if (todayStatus === "partial") return "Partial progress. Finish what you started.";
    if (!planReady || (planStartDate === todayISO() && streak === 0)) return "Your system is ready. First action, now.";
    const h = new Date().getHours();
    const tod = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
    return firstName ? `Good ${tod}, ${firstName}.` : `Good ${tod}.`;
  })();

  const archetypeLabel = dogArchetype ? ARCHETYPE_LABEL[dogArchetype] : null;
  const ambitionLabel = ambitionType ? AMBITION_LABEL[ambitionType] : null;
  const identityChips = [archetypeLabel, ambitionLabel].filter(Boolean) as string[];

  /** First step from Phase 1 — used as a today-mission preview before tasks are generated. */
  const phaseOneAnchor = pipelinePlan?.phases?.[0]?.steps?.[0]?.title ?? null;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient mesh */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 20% 10%, rgba(40,80,200,0.30) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 85% 80%, rgba(15,40,100,0.50) 0%, transparent 60%),
            linear-gradient(160deg, #0f2040 0%, #090f1a 50%, #060912 100%)
          `,
          pointerEvents: "none",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: "max(2.5rem, calc(env(safe-area-inset-top, 0px) + 2rem)) max(20px, env(safe-area-inset-right, 20px)) 100px max(20px, env(safe-area-inset-left, 20px))",
          }}
        >
          {/* Header */}
          <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {identityChips.length > 0 && (
                <p
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: ACCENT,
                    margin: "0 0 10px",
                    fontWeight: 600,
                  }}
                >
                  ↳ {identityChips.join(" · ")}
                </p>
              )}
              <h1
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: 28,
                  lineHeight: 1.0,
                  letterSpacing: "-0.025em",
                  color: "rgba(240,245,255,0.95)",
                  margin: 0,
                }}
              >
                {greetingText}
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(140,170,210,0.55)",
                  margin: "8px 0 0",
                }}
              >
                {formatHeaderDate()}
                {dayInfo && ` · Day ${dayInfo.currentDay} of ${dayInfo.totalDays}`}
              </p>
              {goalText && (
                <p
                  style={{
                    fontFamily: "var(--font-apercu), sans-serif",
                    fontSize: 13,
                    color: "rgba(200,220,245,0.80)",
                    margin: "10px 0 0",
                    lineHeight: 1.4,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                  }}
                  title={goalText}
                >
                  <span aria-hidden style={{ color: ACCENT, marginRight: 6 }}>↳</span>
                  {sentenceCase(goalText)}
                </p>
              )}
            </div>
            <Link
              href="/account"
              aria-label="Account settings"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1.5px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(8px)",
                color: "rgba(235,242,255,0.70)",
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              {userName ? userName.charAt(0).toUpperCase() : "?"}
            </Link>
          </header>

          {/*
           * Today — single primary card, always at the top of the home screen.
           * Three internal states (start / in-progress / all-done) keep the focal
           * point in the same place every day, so the layout doesn't shape-shift.
           */}
          <section
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 16,
              padding: "14px 16px",
              overflow: "hidden",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(140,170,210,0.50)",
                marginBottom: 10,
              }}
            >
              Today
            </p>

            {!tasksReady ? (
              // STATE A — no tasks yet today: big primary CTA → /tasks (morning check-in lives there)
              <Link
                href="/tasks"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "18px 20px",
                  borderRadius: 14,
                  background: `linear-gradient(145deg, ${ACCENT}, ${ACCENT_HOVER})`,
                  color: ON_ACCENT,
                  textDecoration: "none",
                  boxShadow: `0 0 24px ${accentRgba(0.28)}, 0 2px 8px rgba(0,0,0,0.32)`,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontWeight: 900,
                      fontStyle: "italic",
                      fontSize: 18,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.0,
                    }}
                  >
                    Start today&apos;s plan
                  </span>
                  {phaseOneAnchor ? (
                    <span
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontWeight: 500,
                        fontSize: 12.5,
                        lineHeight: 1.35,
                        opacity: 0.78,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={phaseOneAnchor}
                    >
                      → {phaseOneAnchor}
                    </span>
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontWeight: 500,
                        fontSize: 12.5,
                        lineHeight: 1.35,
                        opacity: 0.78,
                      }}
                    >
                      3-min check-in &rarr; today&apos;s mission
                    </span>
                  )}
                </div>
                <span aria-hidden style={{ fontSize: 22, lineHeight: 1, fontWeight: 700, flexShrink: 0 }}>→</span>
              </Link>
            ) : allDone ? (
              // STATE C — all tasks done: celebration + nudge to come back tomorrow
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: accentRgba(0.10),
                  border: `1px solid ${accentRgba(0.30)}`,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: ACCENT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5L10 17.5L19.5 7" stroke={ON_ACCENT} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontWeight: 800,
                      fontSize: 16,
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      color: ACCENT,
                      margin: 0,
                      lineHeight: 1.1,
                    }}
                  >
                    Today closed.
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-apercu), sans-serif",
                      fontSize: 12.5,
                      color: "rgba(200,220,245,0.70)",
                      margin: "4px 0 0",
                      lineHeight: 1.4,
                    }}
                  >
                    Plan adjusts overnight. Come back tomorrow.
                  </p>
                </div>
              </div>
            ) : (
              // STATE B — tasks ready, in progress: top 3 tasks + progress + see-all
              <>
                {/* Progress bar */}
                <div
                  aria-hidden
                  style={{
                    width: "100%",
                    height: 4,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: `${activeTasks.length > 0 ? (doneCount / activeTasks.length) * 100 : 0}%`,
                      height: "100%",
                      background: ACCENT,
                      borderRadius: 2,
                      transition: "width 0.4s ease",
                      boxShadow: `0 0 8px ${accentRgba(0.4)}`,
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {activeTasks.slice(0, 3).map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => toggleDailyTask(task.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 0",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: task.completed ? ACCENT : "transparent",
                          border: task.completed ? "none" : "2px solid rgba(255,255,255,0.18)",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {task.completed && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6L5 8.5L9.5 4" stroke="#060912" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-apercu), sans-serif",
                          fontSize: 14,
                          lineHeight: 1.4,
                          color: task.completed ? "rgba(140,170,210,0.45)" : "rgba(240,245,255,0.92)",
                          textDecoration: task.completed ? "line-through" : "none",
                          flex: 1,
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {task.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: 12,
                          color: "rgba(120,155,195,0.35)",
                          flexShrink: 0,
                        }}
                      >
                        {task.estimatedMinutes}m
                      </span>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 12,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(130,155,195,0.45)",
                    }}
                  >
                    {doneCount}/{activeTasks.length} done
                  </span>
                  <Link
                    href="/tasks"
                    style={{
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      color: ACCENT,
                      textDecoration: "none",
                    }}
                  >
                    See all
                  </Link>
                </div>
              </>
            )}
          </section>

          {/* Daily mentor message — secondary, kept below the always-stable Today card */}
          {todayStatus === "pending" && <DailyCoachingSection />}

          {/* Streak + Momentum */}
          <StreakMomentumCard />

          {/* Live "doing it now" pulse — peer signal for the user's archetype */}
          {archetypeLabel && <HomeLivePulse archetypeLabel={archetypeLabel} />}

          {/* Gap chart */}
          <GapChart
            planStartDate={planStartDate}
            totalDays={dayInfo?.totalDays ?? 112}
            currentDay={dayInfo?.currentDay ?? 1}
          />
        </div>
      </motion.div>
    </div>
  );
}
