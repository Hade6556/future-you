"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePlanStore, todayISO } from "./state/planStore";
import { computeDayInfo } from "./utils/dayEngine";
import { DailyCoachingSection } from "./components/DailyCoachingSection";
import { StreakMomentumCard } from "./components/home/StreakMomentumCard";
import { GapChart } from "./components/home/GapChart";
import type { PipelineEvent } from "./types/pipeline";
import { ACCENT } from "@/app/theme";

function formatHeaderDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
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
  const location           = usePlanStore((s) => s.location);

  const todayTasks         = usePlanStore((s) => s.todayTasks);
  const todayTasksDate     = usePlanStore((s) => s.todayTasksDate);
  const toggleDailyTask    = usePlanStore((s) => s.toggleDailyTask);

  const cachedEvents = usePlanStore((s) => s.cachedEvents);
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

  const events: PipelineEvent[] = cachedEvents;

  if (!mounted || !onboardingReady) {
    return null;
  }

  const firstName = userName ? userName.split(" ")[0] : "";
  const today = todayISO();
  const tasksReady = todayTasksDate === today && todayTasks.length > 0;
  const activeTasks = todayTasks.filter((t) => !t.deferred);
  const doneCount = activeTasks.filter((t) => t.completed).length;

  const greetingText = (() => {
    if (todayStatus === "done") return `You closed the gap today, ${firstName || "you"}.`;
    if (todayStatus === "partial") return "Partial progress. Finish what you started.";
    if (!planReady || (planStartDate === todayISO() && streak === 0)) return "Your system is ready. First action, now.";
    const h = new Date().getHours();
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
            gap: 10,
            padding: "max(2.5rem, calc(env(safe-area-inset-top, 0px) + 2rem)) max(20px, env(safe-area-inset-right, 20px)) 100px max(20px, env(safe-area-inset-left, 20px))",
          }}
        >
          {/* Header */}
          <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: 28,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "rgba(240,245,255,0.95)",
                  margin: 0,
                }}
              >
                {greetingText}
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(140,170,210,0.70)",
                  margin: "4px 0 0",
                }}
              >
                {formatHeaderDate()}
                {dayInfo && ` · Day ${dayInfo.currentDay} of ${dayInfo.totalDays}`}
              </p>
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

          {/* Daily Coaching — visible when pending */}
          {todayStatus === "pending" && <DailyCoachingSection />}

          {/* Streak + Momentum */}
          <StreakMomentumCard />

          {/* Today's Tasks */}
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
                marginBottom: 8,
              }}
            >
              Today&apos;s tasks
            </p>

            {tasksReady ? (
              <>
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
                      color: doneCount === activeTasks.length && activeTasks.length > 0 ? "#4CAF7D" : ACCENT,
                      textDecoration: "none",
                    }}
                  >
                    {doneCount === activeTasks.length && activeTasks.length > 0 ? "All done" : "See all"}
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
                  background: "rgba(94,205,161,0.06)",
                  border: "1px solid rgba(94,205,161,0.18)",
                  borderRadius: 14,
                  textDecoration: "none",
                }}
              >
                <span style={{ fontFamily: "var(--font-apercu), sans-serif", fontSize: 14, color: "rgba(235,242,255,0.80)" }}>
                  Check in to generate today&apos;s tasks
                </span>
                <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: 12, color: ACCENT }}>
                  Go
                </span>
              </Link>
            )}
          </section>

          {/* Events for You — async loaded */}
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
                marginBottom: 8,
              }}
            >
              Events for you
            </p>

            {events.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {events.slice(0, 3).map((evt) => (
                  <a
                    key={evt.event_id}
                    href={evt.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "10px 12px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      textDecoration: "none",
                      transition: "background 0.15s",
                    }}
                  >
                    {evt.image_url && (
                      <img
                        src={evt.image_url}
                        alt=""
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-apercu), sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "rgba(240,245,255,0.90)",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {evt.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: 11,
                          color: "rgba(160,180,210,0.55)",
                          margin: "2px 0 0",
                        }}
                      >
                        {[evt.start_date, evt.location, evt.price_label].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: "var(--font-apercu), sans-serif", fontSize: 13, color: "rgba(140,170,210,0.45)", padding: "8px 0" }}>
                {location ? "No events found yet. Check back soon." : "Add your location in settings to see events."}
              </p>
            )}
          </section>

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
