"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePlanStore, todayISO } from "./state/planStore";

import { AppTour } from "./components/AppTour";
import { computeDayInfo } from "./utils/dayEngine";
import { HookScreen } from "./components/home/HookScreen";
import { GapChart } from "./components/home/GapChart";
import { Week1WinCard } from "./components/home/Week1WinCard";
import { PlanUpdatedCard } from "./components/home/PlanUpdatedCard";
import { StreakMomentumCard } from "./components/home/StreakMomentumCard";
import { MilestoneCard } from "./components/home/MilestoneCard";


function formatHeaderDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function HomeClient() {
  const router = useRouter();
  const quizComplete       = usePlanStore((s) => s.quizComplete);
  const onboardingComplete = usePlanStore((s) => s.onboardingComplete);
  const isPremium          = usePlanStore((s) => s.isPremium);
  const planReady          = usePlanStore((s) => s.planReady);
  const pipelinePlan       = usePlanStore((s) => s.pipelinePlan);
  const planStartDate      = usePlanStore((s) => s.planStartDate);
  const userName           = usePlanStore((s) => s.userName);
  const streak             = usePlanStore((s) => s.streak);
  const todayStatus        = usePlanStore((s) => s.todayStatus);
  const appTourSeen        = usePlanStore((s) => s.appTourSeen);
  const setAppTourSeen     = usePlanStore((s) => s.setAppTourSeen);
  const phoenixDay         = usePlanStore((s) => s.phoenixDay);
  const phoenixPriorStreak = usePlanStore((s) => s.phoenixPriorStreak);
  const exitPhoenixMode    = usePlanStore((s) => s.exitPhoenixMode);
  const hydrateFromServer  = usePlanStore((s) => s.hydrateFromServer);
  const recordDailyVisit   = usePlanStore((s) => s.recordDailyVisit);

  const taskHistory          = usePlanStore((s) => s.taskHistory);
  const planRefreshSummary   = usePlanStore((s) => s.planRefreshSummary);
  const planRefreshSeen      = usePlanStore((s) => s.planRefreshSeen);
  const dismissPlanRefresh   = usePlanStore((s) => s.dismissPlanRefresh);

  const todayTasks           = usePlanStore((s) => s.todayTasks);
  const todayTasksDate       = usePlanStore((s) => s.todayTasksDate);
  const toggleDailyTask      = usePlanStore((s) => s.toggleDailyTask);
  const journalDates         = usePlanStore((s) => s.journalDates);

  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const dayInfo = useMemo(
    () => (pipelinePlan && planStartDate ? computeDayInfo(pipelinePlan, planStartDate) : null),
    [pipelinePlan, planStartDate],
  );

  useEffect(() => {
    if (quizComplete && !onboardingComplete) {
      router.replace("/quiz/result");
    }
  }, [quizComplete, onboardingComplete, router]);

  // Hydrate from server early so returning logged-in users don't get stuck in local-first quiz flow.
  useEffect(() => {
    void hydrateFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Record daily visit first (uses local state), then sync with server
  useEffect(() => {
    if (quizComplete && onboardingComplete) {
      recordDailyVisit();     // increment streak from local state immediately
      hydrateFromServer();    // sync with server in background
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizComplete, onboardingComplete]);


  if (!quizComplete) return <HookScreen />;
  if (!onboardingComplete) return null;

  const firstName   = userName ? userName.split(" ")[0] : "";
  const questTitle  = dayInfo?.currentStep?.title ?? "Today's ritual";

  const today = todayISO();
  const tasksReady = todayTasksDate === today && todayTasks.length > 0;
  const activeTasks = todayTasks.filter((t) => !t.deferred);
  const doneCount = activeTasks.filter((t) => t.completed).length;

  const daysSinceJournal = (() => {
    if (!journalDates) return null;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (journalDates[key]) return i;
    }
    return null;
  })();

  const greetingText = (() => {
    if (todayStatus === "done")    return `You closed the gap today, ${firstName || "you"}.`;
    if (todayStatus === "partial") return "Partial progress. Finish what you started.";
    if (phoenixDay || todayStatus === "skipped") return "Rise again.";
    if (!planReady || (planStartDate === todayISO() && streak === 0)) return "Your system is ready. First action, now.";
    const h   = new Date().getHours();
    const tod = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
    return firstName ? `Good ${tod}, ${firstName}.` : `Good ${tod}.`;
  })();

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
            gap: 16,
            padding:
              "max(3.25rem, calc(env(safe-area-inset-top, 0px) + 2.75rem)) max(24px, env(safe-area-inset-right, 24px)) 24px max(24px, env(safe-area-inset-left, 24px))",
          }}
        >

          {/* Header */}
          <header
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: 32,
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  color: "rgba(235,242,255,0.92)",
                  margin: 0,
                }}
              >
                {greetingText}
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(120,155,195,0.62)",
                  margin: "6px 0 0",
                  lineHeight: 1.35,
                }}
              >
                {formatHeaderDate()}
                {dayInfo && ` · Day ${dayInfo.currentDay} of ${dayInfo.totalDays}`}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 0 }}>
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
                  WebkitBackdropFilter: "blur(8px)",
                  color: "rgba(235,242,255,0.70)",
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                {userName ? userName.charAt(0).toUpperCase() : "?"}
              </Link>
            </div>
          </header>

          {/* Plan updated notification */}
          {planRefreshSummary && !planRefreshSeen && (
            <PlanUpdatedCard
              summary={planRefreshSummary}
              onDismiss={dismissPlanRefresh}
            />
          )}

          {/* Phoenix banner */}
          {phoenixDay && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,85,85,0.30)",
                borderRadius: 20,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#FF5555",
                    marginBottom: 2,
                  }}
                >
                  Streak reset after {phoenixPriorStreak} days
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body), Georgia, serif",
                    fontWeight: 400,
                    fontSize: 12,
                    color: "rgba(120,155,195,0.75)",
                  }}
                >
                  Gap-closure rate down. Two actions today recovers the ground.
                </p>
              </div>
              <button
                onClick={exitPhoenixMode}
                className="btn-cta"
                style={{ padding: "8px 16px", fontSize: 12, flexShrink: 0 }}
              >
                Go
              </button>
            </motion.div>
          )}

          {/* Streak + Momentum */}
          <StreakMomentumCard />

          {/* Today's Tasks preview */}
          <section
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 20,
              padding: "20px",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              }}
            />

            <p
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(120,155,195,0.40)",
                marginBottom: 14,
              }}
            >
              Today&apos;s tasks
            </p>

            {tasksReady ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {activeTasks.slice(0, 4).map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => toggleDailyTask(task.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 0",
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
                          background: task.completed ? "#C8FF00" : "transparent",
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
                          color: task.completed ? "rgba(120,155,195,0.40)" : "rgba(235,242,255,0.88)",
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
                          fontSize: 9,
                          color: "rgba(120,155,195,0.35)",
                          flexShrink: 0,
                        }}
                      >
                        {task.estimatedMinutes}m
                      </span>
                    </button>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 9,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "rgba(120,155,195,0.40)",
                    }}
                  >
                    {doneCount}/{activeTasks.length} done
                  </span>
                  <Link
                    href="/tasks"
                    style={{
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      color: doneCount === activeTasks.length && activeTasks.length > 0 ? "#4CAF7D" : "#C8FF00",
                      textDecoration: "none",
                    }}
                  >
                    {doneCount === activeTasks.length && activeTasks.length > 0 ? "All done ✓" : "See all →"}
                  </Link>
                </div>
              </>
            ) : (
              <Link
                href="/tasks"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: "rgba(200,255,0,0.06)",
                  border: "1px solid rgba(200,255,0,0.18)",
                  borderRadius: 14,
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-apercu), sans-serif",
                    fontSize: 14,
                    color: "rgba(235,242,255,0.80)",
                  }}
                >
                  Check in to generate today&apos;s tasks
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#C8FF00",
                  }}
                >
                  Go →
                </span>
              </Link>
            )}
          </section>

          {/* Gap chart */}
          <GapChart
            planStartDate={planStartDate}
            totalDays={dayInfo?.totalDays ?? 112}
            currentDay={dayInfo?.currentDay ?? 1}
          />

          {/* Quick Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <Link
              href="/journal/new"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "14px 8px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 16,
                textDecoration: "none",
                position: "relative",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(200,255,0,0.70)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(120,155,195,0.55)" }}>
                Journal
              </span>
              {daysSinceJournal !== null && daysSinceJournal >= 2 && (
                <span style={{
                  position: "absolute", top: 6, right: 8,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 7, color: "rgba(245,166,35,0.80)",
                }}>
                  {daysSinceJournal}d
                </span>
              )}
            </Link>
            <Link
              href="/structure"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "14px 8px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 16,
                textDecoration: "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(200,255,0,0.70)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
              </svg>
              <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(120,155,195,0.55)" }}>
                Reflect
              </span>
            </Link>
            <Link
              href="/plan"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "14px 8px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 16,
                textDecoration: "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(200,255,0,0.70)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
              </svg>
              <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(120,155,195,0.55)" }}>
                My Plan
              </span>
            </Link>
          </div>

          {/* Next Milestone */}
          <MilestoneCard
            streak={streak}
            dayInfo={dayInfo}
          />

          {/* Week 1 Win conversion card (non-premium, days 7-14) */}
          {dayInfo && (
            <Week1WinCard
              currentDay={dayInfo.currentDay}
              tasksCompleted={Object.values(taskHistory).filter(Boolean).length}
              totalTasks={Object.keys(taskHistory).length}
              isPremium={isPremium}
            />
          )}

        </div>
      </motion.div>

      {onboardingComplete && !appTourSeen && (
        <AppTour onDismiss={setAppTourSeen} />
      )}

    </div>
  );
}
