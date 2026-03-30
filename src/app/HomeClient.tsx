"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePlanStore, todayISO } from "./state/planStore";
import { PaywallSheet } from "./components/paywall/PaywallSheet";
import { AppTour } from "./components/AppTour";
import { computeDayInfo } from "./utils/dayEngine";
import { HookScreen } from "./components/home/HookScreen";
import { GapChart } from "./components/home/GapChart";
import { Week1WinCard } from "./components/home/Week1WinCard";
import { PlanUpdatedCard } from "./components/home/PlanUpdatedCard";
import { StreakMomentumCard } from "./components/home/StreakMomentumCard";
import { MilestoneCard } from "./components/home/MilestoneCard";

const SESSION_PAYWALL_KEY = "behavio-paywall-last-date";

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

  const [sessionPaywallOpen, setSessionPaywallOpen] = useState(false);
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

  // Record daily visit first (uses local state), then sync with server
  useEffect(() => {
    if (quizComplete && onboardingComplete) {
      recordDailyVisit();     // increment streak from local state immediately
      hydrateFromServer();    // sync with server in background
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizComplete, onboardingComplete]);

  // Show paywall sheet for non-premium users once per session/day
  useEffect(() => {
    if (isPremium || !onboardingComplete) return;
    try {
      const last = sessionStorage.getItem(SESSION_PAYWALL_KEY);
      const today = new Date().toISOString().slice(0, 10);
      if (last === today) return;
    } catch { /* ignore */ }
    const timer = setTimeout(() => setSessionPaywallOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [isPremium, onboardingComplete]);

  const handleSessionPaywallClose = () => {
    setSessionPaywallOpen(false);
    try {
      sessionStorage.setItem(SESSION_PAYWALL_KEY, new Date().toISOString().slice(0, 10));
    } catch { /* ignore */ }
  };

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
              <div
                aria-label={`${streak} day streak`}
                style={{
                  display: "inline-flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px 5px 7px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 6.82666 8.53333"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  aria-hidden
                  width={20}
                  height={26}
                  style={{ display: "block", flexShrink: 0, overflow: "visible" }}
                >
                  <defs>
                    <radialGradient id="fireGlow" cx="50%" cy="60%" r="50%">
                      <stop offset="0%" stopColor="#C8FF00" stopOpacity="0.6">
                        <animate attributeName="stopOpacity" values="0.6;0.3;0.55;0.35;0.6" dur="2.5s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="60%" stopColor="#D4FF33" stopOpacity="0.15">
                        <animate attributeName="stopOpacity" values="0.15;0.25;0.1;0.2;0.15" dur="3s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="100%" stopColor="#C8FF00" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* Outer glow — breathes in size */}
                  <ellipse cx="3.41" cy="3.6" rx="2.6" ry="3.4" fill="url(#fireGlow)" opacity="0.5">
                    <animate attributeName="ry" values="3.4;3.9;3.5;3.8;3.4" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="rx" values="2.6;2.9;2.5;2.8;2.6" dur="3s" repeatCount="indefinite" />
                  </ellipse>
                  {/* Rising embers */}
                  <circle cx="2.8" cy="2.5" r="0.18" fill="#C8FF00" opacity="0">
                    <animate attributeName="cy" values="4;1;-0.5" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0.7;0" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="2.8;2.5;2.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="4.2" cy="3" r="0.14" fill="#E5FF66" opacity="0">
                    <animate attributeName="cy" values="4.5;1.5;0" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0.6;0" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="4.2;4.5;4.3" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="3.4" cy="2" r="0.12" fill="#ffffff" opacity="0">
                    <animate attributeName="cy" values="3.5;0.5;-1" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0.5;0" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
                  </circle>
                  {/* Main flame — breathe + sway */}
                  <g style={{ transformOrigin: "50% 100%" }}>
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      values="1 0.96;1 1.05;1 0.97;1 1.03;1 0.96"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                    <g>
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="-1.5 3.41 8.53;2 3.41 8.53;-1 3.41 8.53;1.5 3.41 8.53;-1.5 3.41 8.53"
                        dur="3.5s"
                        repeatCount="indefinite"
                      />
                      {/* Outer flame */}
                      <path
                        fill="#C8FF00"
                        fillRule="nonzero"
                        d="M2.19418 3.43256c0.171654,-0.0729606 0.981992,-0.473524 0.849098,-2.51938 -0.00625984,-0.0520354 0.0595827,-0.0814291 0.0937795,-0.0407244 0.496264,0.657122 1.2477,1.61003 1.06698,2.50698 0.274827,-0.224244 0.391874,-0.799941 0.401764,-1.13351 -0.00287795,-0.0534961 0.0672795,-0.0776929 0.0975276,-0.0326496 0.53424,0.818642 0.91748,1.84963 0.38198,2.76904 -0.209594,0.359862 -0.530689,0.630732 -0.896654,0.797512 -0.36561,0.166614 -0.776244,0.229492 -1.16533,0.173524 -0.665236,-0.0956929 -1.26754,-0.536543 -1.47732,-1.39707 -0.0760354,-0.31189 -0.0864173,-0.670236 -0.00993701,-1.06974 0.0692165,-0.361551 0.20976,-0.757339 0.437453,-1.18343 0.0241772,-0.057378 0.112059,-0.0325827 0.101748,0.0294961 -0.0543543,0.270772 -0.0887835,0.911571 0.118909,1.09996z"
                      />
                      {/* Inner flame — brighter, slightly smaller, offset timing */}
                      <g style={{ transformOrigin: "50% 100%" }}>
                        <animateTransform
                          attributeName="transform"
                          type="scale"
                          values="0.55 0.5;0.55 0.6;0.55 0.48;0.55 0.55;0.55 0.5"
                          dur="1.4s"
                          repeatCount="indefinite"
                        />
                        <path
                          fill="#E5FF66"
                          fillRule="nonzero"
                          opacity="0.85"
                          transform="translate(1.53, 3.2)"
                          d="M2.19418 3.43256c0.171654,-0.0729606 0.981992,-0.473524 0.849098,-2.51938 -0.00625984,-0.0520354 0.0595827,-0.0814291 0.0937795,-0.0407244 0.496264,0.657122 1.2477,1.61003 1.06698,2.50698 0.274827,-0.224244 0.391874,-0.799941 0.401764,-1.13351 -0.00287795,-0.0534961 0.0672795,-0.0776929 0.0975276,-0.0326496 0.53424,0.818642 0.91748,1.84963 0.38198,2.76904 -0.209594,0.359862 -0.530689,0.630732 -0.896654,0.797512 -0.36561,0.166614 -0.776244,0.229492 -1.16533,0.173524 -0.665236,-0.0956929 -1.26754,-0.536543 -1.47732,-1.39707 -0.0760354,-0.31189 -0.0864173,-0.670236 -0.00993701,-1.06974 0.0692165,-0.361551 0.20976,-0.757339 0.437453,-1.18343 0.0241772,-0.057378 0.112059,-0.0325827 0.101748,0.0294961 -0.0543543,0.270772 -0.0887835,0.911571 0.118909,1.09996z"
                        >
                          <animate attributeName="opacity" values="0.85;0.6;0.9;0.65;0.85" dur="1.2s" repeatCount="indefinite" />
                        </path>
                      </g>
                    </g>
                  </g>
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontWeight: 900,
                    fontSize: 19,
                    color: "#C8FF00",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {streak}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 8,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(120,155,195,0.72)",
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                  }}
                >
                  day streak
                </span>
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

      <PaywallSheet
        open={sessionPaywallOpen}
        onClose={handleSessionPaywallClose}
        variant="session"
      />
    </div>
  );
}
