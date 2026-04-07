"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePlanStore, todayISO } from "../state/planStore";
import { computeDayInfo } from "../utils/dayEngine";
import { computeCompletionRate7d, computeAvgScore7d, computeMustDoCompletionRate7d, detectMissedPatterns, getDayOfWeek, getDayOfWeekNumber } from "../utils/taskEngine";
import { deriveCheckinStatus } from "../utils/taskEngine";
import { buildUserProfileDigest } from "@/lib/pipeline/profileDigest";
import type { EnergyLevel, TimeAvailable, ChallengeLevel, GeneratedTask, DailyTasksRequest } from "../types/pipeline";
import MorningCheckin from "../components/daily/MorningCheckin";
import DayContextBanner from "../components/daily/DayContextBanner";
import TaskSection from "../components/daily/TaskSection";
import EveningWrapup from "../components/daily/EveningWrapup";
import AddRecurringSheet from "../components/daily/AddRecurringSheet";
import SwapTaskSheet from "../components/daily/SwapTaskSheet";
import { PlusIcon } from "@heroicons/react/24/outline";

const LIME = "#C8FF00";
const NAVY = "#060912";
const TEXT_HI = "rgba(235,242,255,0.95)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const GLASS = "rgba(255,255,255,0.07)";
const GLASS_BORDER = "rgba(255,255,255,0.14)";
const FONT_HEADING = "var(--font-barlow-condensed), sans-serif";
const FONT_BODY = "var(--font-apercu), sans-serif";
const FONT_MONO = "var(--font-jetbrains-mono), monospace";

export default function TasksPage() {
  const userName = usePlanStore((s) => s.userName);
  const archetype = usePlanStore((s) => s.dogArchetype);
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const quizComplete = usePlanStore((s) => s.quizComplete);
  const streak = usePlanStore((s) => s.streak);
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);
  const planStartDate = usePlanStore((s) => s.planStartDate);
  const dailyScores = usePlanStore((s) => s.dailyScores);
  const taskHistory = usePlanStore((s) => s.taskHistory);
  const journalDates = usePlanStore((s) => s.journalDates);
  const lastReflection = usePlanStore((s) => s.lastReflection);

  // User profile fields (for building profile digest)
  const quizPrimaryGoal = usePlanStore((s) => s.quizPrimaryGoal);
  const quizPastAttempts = usePlanStore((s) => s.quizPastAttempts);
  const quizCurrentState = usePlanStore((s) => s.quizCurrentState);
  const quizVision = usePlanStore((s) => s.quizVision);
  const quizAgeGroup = usePlanStore((s) => s.quizAgeGroup);
  const quizDream = usePlanStore((s) => s.quizDream);
  const quizGender = usePlanStore((s) => s.quizGender);
  const quizObstacles = usePlanStore((s) => s.quizObstacles);
  const quizTimeline = usePlanStore((s) => s.quizTimeline);
  const quizCommitment = usePlanStore((s) => s.quizCommitment);
  const quizSchedule = usePlanStore((s) => s.quizSchedule);
  const multiSelectAnswers = usePlanStore((s) => s.multiSelectAnswers);
  const moodRating = usePlanStore((s) => s.moodRating);
  const sleepQuality = usePlanStore((s) => s.sleepQuality);
  const energyLevelQuiz = usePlanStore((s) => s.energyLevel);
  const stressLevel = usePlanStore((s) => s.stressLevel);

  // Daily tasks state
  const morningCheckinDate = usePlanStore((s) => s.morningCheckinDate);
  const morningEnergy = usePlanStore((s) => s.morningEnergy);
  const morningTimeAvailable = usePlanStore((s) => s.morningTimeAvailable);
  const morningChallengeLevel = usePlanStore((s) => s.morningChallengeLevel);
  const todayTasks = usePlanStore((s) => s.todayTasks);
  const todayTasksDate = usePlanStore((s) => s.todayTasksDate);
  const todayDayMessage = usePlanStore((s) => s.todayDayMessage);
  const todayAdaptationNote = usePlanStore((s) => s.todayAdaptationNote);
  const recurringTasks = usePlanStore((s) => s.recurringTasks);

  // Actions
  const setMorningCheckin = usePlanStore((s) => s.setMorningCheckin);
  const setTodayTasks = usePlanStore((s) => s.setTodayTasks);
  const toggleDailyTask = usePlanStore((s) => s.toggleDailyTask);
  const deferDailyTask = usePlanStore((s) => s.deferDailyTask);
  const addCustomDailyTask = usePlanStore((s) => s.addCustomDailyTask);
  const swapDailyTask = usePlanStore((s) => s.swapDailyTask);
  const addRecurringTask = usePlanStore((s) => s.addRecurringTask);
  const setTodayStatus = usePlanStore((s) => s.setTodayStatus);
  const recalculateAndPersistScore = usePlanStore((s) => s.recalculateAndPersistScore);

  const [loading, setLoading] = useState(false);
  const [generateError, setGenerateError] = useState(false);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [showAddRecurring, setShowAddRecurring] = useState(false);
  const [swapTask, setSwapTask] = useState<GeneratedTask | null>(null);
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [newTaskMinutes, setNewTaskMinutes] = useState("15");

  // Compute day info from plan
  const dayInfo = pipelinePlan && planStartDate ? computeDayInfo(pipelinePlan, planStartDate) : null;
  const today = todayISO();
  const checkinDoneToday = morningCheckinDate === today;
  const tasksLoadedToday = todayTasksDate === today && todayTasks.length > 0;
  const journaledToday = !!(journalDates ?? {})[today];

  // Determine journal sentiment for recommendations
  const lastSentiment: string | null = lastReflection ? null : null; // Would come from reflections table in full implementation

  // Auto-update checkin status based on task completion
  useEffect(() => {
    if (!tasksLoadedToday) return;
    const activeTasks = todayTasks.filter((t) => !t.deferred);
    const mustDoTasks = activeTasks.filter((t) => t.priority === "must-do");
    const mustDoDone = mustDoTasks.filter((t) => t.completed).length;
    const totalDone = activeTasks.filter((t) => t.completed).length;
    const status = deriveCheckinStatus(mustDoTasks.length, mustDoDone, totalDone);
    if (status !== "pending") {
      setTodayStatus(status);
    }
  }, [todayTasks, tasksLoadedToday, setTodayStatus]);

  // Generate tasks after morning check-in
  const generateTasks = useCallback(
    async (energy: EnergyLevel, timeAvailable: TimeAvailable, focusArea: string | null, challengeLevel: ChallengeLevel) => {
      setMorningCheckin(energy, timeAvailable, focusArea, challengeLevel);
      setLoading(true);
      setGenerateError(false);

      try {
        const completionRate = computeCompletionRate7d(dailyScores);
        const avgScore = computeAvgScore7d(dailyScores);
        const mustDoRate = computeMustDoCompletionRate7d(dailyScores);
        const missedPatterns = detectMissedPatterns(taskHistory);
        const dayOfWeekNum = getDayOfWeekNumber();

        // Filter recurring tasks for today
        const todayRecurring = recurringTasks.filter((rt) => rt.active && rt.daysOfWeek.includes(dayOfWeekNum));

        // Build user profile digest for richer task generation
        const domainKeyMap: Record<string, string> = {
          career: "q_goals_career", finance: "q_goals_money", entrepreneur: "q_goals_career",
          athlete: "q_goals_health", weight_loss: "q_goals_health", wellness: "q_goals_health",
          mindfulness: "q_goals_mindset", confidence: "q_goals_mindset",
          student: "q_goals_education", productivity: "q_goals_productivity",
        };
        const goalsKey = domainKeyMap[ambitionType ?? ""] ?? "";
        const specificGoals = goalsKey ? (multiSelectAnswers[goalsKey] ?? []) : [];

        let profileDigest: string | null = null;
        try {
          const userContext = {
            timeline: quizTimeline ?? undefined,
            commitment: quizCommitment ?? undefined,
            schedule: quizSchedule ?? undefined,
            obstacles: quizObstacles.length > 0 ? quizObstacles : undefined,
            primaryGoal: quizPrimaryGoal ?? undefined,
            currentState: quizCurrentState ?? undefined,
            vision: quizVision ?? undefined,
            gender: quizGender ?? undefined,
            ageGroup: quizAgeGroup ?? undefined,
            specificGoals: specificGoals.length > 0 ? specificGoals : undefined,
            motivations: multiSelectAnswers["q_motivations"]?.length ? multiSelectAnswers["q_motivations"] : undefined,
            badHabits: multiSelectAnswers["q_bad_habits"]?.length ? multiSelectAnswers["q_bad_habits"] : undefined,
            selfTrust: multiSelectAnswers["q_self_trust"]?.[0] ?? undefined,
            problems: multiSelectAnswers["q_problems"]?.length ? multiSelectAnswers["q_problems"] : undefined,
            pastAttempts: quizPastAttempts ?? undefined,
            dreamNarrative: quizDream ?? undefined,
            archetype: archetype ?? undefined,
            ambitionDomain: ambitionType ?? undefined,
            moodRating: moodRating ?? undefined,
            sleepQuality: sleepQuality ?? undefined,
            energyLevel: energyLevelQuiz ?? undefined,
            stressLevel: stressLevel != null ? String(stressLevel) : undefined,
            domainAnswers: Object.keys(multiSelectAnswers).length > 0 ? multiSelectAnswers : undefined,
          };
          const digest = buildUserProfileDigest(userContext);
          profileDigest = digest.substring(0, 800) || null;
        } catch { /* profile digest is optional */ }

        const payload: DailyTasksRequest = {
          currentStep: dayInfo?.currentStep ?? null,
          currentPhase: dayInfo?.currentPhase ?? null,
          nextStep: dayInfo?.nextStep ?? null,
          day: dayInfo?.currentDay ?? 1,
          totalDays: dayInfo?.totalDays ?? 90,
          overallProgress: dayInfo?.overallProgress ?? 0,
          userName,
          archetype,
          ambitionType,
          energy,
          timeAvailable,
          focusArea,
          streak,
          completionRate7d: completionRate,
          avgDailyScore7d: avgScore,
          lastJournalSentiment: lastSentiment,
          missedTaskPatterns: missedPatterns,
          dayOfWeek: getDayOfWeek(),
          recurringTasks: todayRecurring,
          userProfileDigest: profileDigest,
          challengeLevel,
          mustDoCompletionRate7d: mustDoRate,
        };

        const res = await fetch("/api/daily-tasks/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setTodayTasks(data.tasks ?? [], data.dayMessage ?? "", data.adaptationNote ?? null);
        } else {
          setGenerateError(true);
        }
      } catch {
        setGenerateError(true);
      } finally {
        setLoading(false);
      }
    },
    [
      setMorningCheckin, setTodayTasks, dailyScores, taskHistory, recurringTasks,
      dayInfo, userName, archetype, ambitionType, streak, lastSentiment,
      quizPrimaryGoal, quizPastAttempts, quizCurrentState, quizVision, quizAgeGroup,
      quizDream, quizGender, quizObstacles, quizTimeline, quizCommitment, quizSchedule,
      multiSelectAnswers, moodRating, sleepQuality, energyLevelQuiz, stressLevel,
    ],
  );

  // Add custom task
  function handleAddCustom() {
    if (!newTaskLabel.trim()) return;
    addCustomDailyTask(newTaskLabel.trim(), parseInt(newTaskMinutes, 10) || 15);
    setNewTaskLabel("");
    setNewTaskMinutes("15");
    setShowAddCustom(false);
  }

  // Handle recurring task add
  function handleAddRecurring(label: string, minutes: number, daysOfWeek: number[]) {
    addRecurringTask({
      id: `rec-${Date.now()}`,
      label,
      estimatedMinutes: minutes,
      daysOfWeek,
      active: true,
    });
  }

  // Handle swap
  function handleSwap(taskId: string, replacement: GeneratedTask) {
    swapDailyTask(taskId, replacement);
    setSwapTask(null);
  }

  // ─── Not onboarded ──────────────────────────────────────────────────────
  if (!quizComplete) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: NAVY,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: TEXT_MID, textAlign: "center", lineHeight: 1.6 }}>
          Take the quiz first so Behavio can personalize your tasks.
        </p>
        <Link
          href="/quiz"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24,
            background: LIME,
            color: NAVY,
            border: "none",
            borderRadius: 14,
            padding: "14px 28px",
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
            textDecoration: "none",
          }}
        >
          Take the quiz
        </Link>
      </div>
    );
  }

  // ─── Task grouping ──────────────────────────────────────────────────────
  const activeTasks = todayTasks.filter((t) => !t.deferred);
  const mustDoTasks = activeTasks.filter((t) => t.priority === "must-do");
  const shouldDoTasks = activeTasks.filter((t) => t.priority === "should-do");
  const bonusTasks = activeTasks.filter((t) => t.priority === "bonus");
  const doneCount = activeTasks.filter((t) => t.completed).length;
  const progressPct = activeTasks.length > 0 ? Math.round((doneCount / activeTasks.length) * 100) : 0;
  const mustDoDone = mustDoTasks.filter((t) => t.completed).length;

  // Suggested focus from current phase
  const suggestedFocus = dayInfo?.currentPhase?.goal ?? null;

  return (
    <div style={{ minHeight: "100dvh", background: NAVY, position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(50,90,220,0.38) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(15,40,110,0.40) 0%, transparent 55%), linear-gradient(170deg, #0d1a3a 0%, #060912 55%)",
          pointerEvents: "none",
        }}
      />
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
          gap: 16,
          width: "100%",
          maxWidth: 448,
          margin: "0 auto",
          minWidth: 0,
          padding: "max(3.5rem, calc(env(safe-area-inset-top, 0px) + 2.75rem)) 24px 160px",
        }}
      >
        {/* ─── Header ──────────────────────────────────────────────────── */}
        <header>
          <h1
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: 38,
              lineHeight: 0.94,
              letterSpacing: "-0.03em",
              color: TEXT_HI,
              margin: 0,
            }}
          >
            Today&apos;s tasks
          </h1>
          {streak > 0 && (
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: 12,
                color: LIME,
                marginTop: 6,
                letterSpacing: "0.04em",
              }}
            >
              {streak}-day streak
            </p>
          )}
        </header>

        {/* ─── No plan yet (shown before check-in if no plan) ──────────── */}
        {!pipelinePlan && !tasksLoadedToday && !loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: "40px 24px",
              textAlign: "center",
            }}
          >
            <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: TEXT_MID, lineHeight: 1.6 }}>
              Generate your plan first so we can create targeted daily tasks.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "14px 28px",
                background: LIME,
                color: NAVY,
                borderRadius: 14,
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
                textDecoration: "none",
              }}
            >
              Go to plan
            </Link>
          </div>
        )}

        {/* ─── Morning Check-in (if not done today and plan exists) ───────── */}
        {pipelinePlan && !checkinDoneToday && !tasksLoadedToday && (
          <MorningCheckin
            userName={userName}
            onSubmit={generateTasks}
            suggestedFocus={suggestedFocus}
          />
        )}

        {/* ─── Loading state ───────────────────────────────────────────── */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: "40px 24px",
              textAlign: "center",
            }}
          >
            <motion.div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "3px solid rgba(200,255,0,0.2)",
                borderTopColor: LIME,
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: TEXT_MID }}>
              Building your personalized tasks...
            </p>
          </motion.div>
        )}

        {/* ─── Tasks loaded ────────────────────────────────────────────── */}
        {tasksLoadedToday && !loading && (
          <>
            {/* Day Context Banner */}
            {dayInfo && (
              <DayContextBanner
                day={dayInfo.currentDay}
                totalDays={dayInfo.totalDays}
                phaseName={dayInfo.currentPhase?.phase_name ?? null}
                stepTitle={dayInfo.currentStep?.title ?? null}
                dayMessage={todayDayMessage}
                adaptationNote={todayAdaptationNote}
              />
            )}

            {/* Task sections by priority */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <TaskSection
                priority="must-do"
                tasks={mustDoTasks}
                onToggle={(id) => toggleDailyTask(id)}
                onDefer={(id) => deferDailyTask(id)}
                onSwap={(id) => setSwapTask(todayTasks.find((t) => t.id === id) ?? null)}
              />
              <TaskSection
                priority="should-do"
                tasks={shouldDoTasks}
                onToggle={(id) => toggleDailyTask(id)}
                onDefer={(id) => deferDailyTask(id)}
                onSwap={(id) => setSwapTask(todayTasks.find((t) => t.id === id) ?? null)}
              />
              <TaskSection
                priority="bonus"
                tasks={bonusTasks}
                onToggle={(id) => toggleDailyTask(id)}
                onDefer={(id) => deferDailyTask(id)}
                onSwap={(id) => setSwapTask(todayTasks.find((t) => t.id === id) ?? null)}
              />
            </div>

            {/* Progress bar */}
            {activeTasks.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 13,
                      fontWeight: 500,
                      color: TEXT_MID,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase" as const,
                      margin: 0,
                    }}
                  >
                    {mustDoDone}/{mustDoTasks.length} must-do &bull; {doneCount}/{activeTasks.length} total
                  </p>
                  <p
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 13,
                      color: TEXT_MID,
                      margin: 0,
                    }}
                  >
                    {progressPct}%
                  </p>
                </div>
                <div
                  style={{
                    height: 8,
                    width: "100%",
                    borderRadius: 999,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.10)",
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      borderRadius: 999,
                      background:
                        progressPct > 0
                          ? `repeating-linear-gradient(-55deg, ${LIME}, ${LIME} 2px, rgba(200,255,0,0.55) 2px, rgba(200,255,0,0.55) 4px)`
                          : "transparent",
                    }}
                    initial={false}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowAddCustom(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: LIME,
                  color: NAVY,
                  border: "none",
                  borderRadius: 14,
                  padding: "14px 22px",
                  fontFamily: FONT_HEADING,
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                }}
              >
                <PlusIcon style={{ width: 16, height: 16 }} aria-hidden />
                Add task
              </button>
              <button
                type="button"
                onClick={() => setShowAddRecurring(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255,255,255,0.05)",
                  color: TEXT_HI,
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 14,
                  padding: "14px 22px",
                  fontFamily: FONT_HEADING,
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                }}
              >
                <PlusIcon style={{ width: 16, height: 16 }} aria-hidden />
                Recurring
              </button>
            </div>

            {/* Evening Wrap-up */}
            <EveningWrapup
              tasks={todayTasks}
              journaledToday={journaledToday}
              tomorrowStepTitle={dayInfo?.nextStep?.title ?? null}
            />
          </>
        )}

        {/* ─── Generation failed or stuck — retry ────────────────────────── */}
        {pipelinePlan && checkinDoneToday && !tasksLoadedToday && !loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: "40px 24px",
              textAlign: "center",
            }}
          >
            <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: TEXT_MID, lineHeight: 1.6 }}>
              Task generation failed. Tap below to try again.
            </p>
            <button
              type="button"
              onClick={() => generateTasks(morningEnergy ?? "medium", morningTimeAvailable ?? 60, null, morningChallengeLevel ?? "push")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "14px 28px",
                background: LIME,
                color: NAVY,
                border: "none",
                borderRadius: 14,
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

      </div>

      {/* ─── Bottom sheets ──────────────────────────────────────────────── */}

      {/* Add custom task */}
      <AnimatePresence>
        {showAddCustom && (
          <>
            <motion.div
              style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddCustom(false)}
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
              <div style={{ width: 40, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.14)", margin: "0 auto 14px" }} />
              <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 900, fontStyle: "italic", fontSize: 20, color: TEXT_HI, margin: 0 }}>
                Add a task
              </h3>
              <input
                type="text"
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                placeholder="What do you need to do?"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
                style={{
                  width: "100%",
                  marginTop: 14,
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 14,
                  fontFamily: FONT_BODY,
                  fontSize: 15,
                  color: TEXT_HI,
                  outline: "none",
                  boxSizing: "border-box" as const,
                }}
              />
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_MID }}>Time:</span>
                  <select
                    value={newTaskMinutes}
                    onChange={(e) => setNewTaskMinutes(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 10,
                      fontFamily: FONT_BODY,
                      fontSize: 13,
                      color: TEXT_HI,
                      outline: "none",
                    }}
                  >
                    <option value="5">5 min</option>
                    <option value="10">10 min</option>
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustom}
                  disabled={!newTaskLabel.trim()}
                  style={{
                    background: newTaskLabel.trim() ? LIME : "rgba(200,255,0,0.25)",
                    color: NAVY,
                    border: "none",
                    borderRadius: 999,
                    padding: "10px 28px",
                    fontFamily: FONT_HEADING,
                    fontWeight: 800,
                    fontSize: 14,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase" as const,
                    cursor: newTaskLabel.trim() ? "pointer" : "default",
                    boxShadow: newTaskLabel.trim() ? "0 4px 16px rgba(200,255,0,0.25)" : "none",
                  }}
                >
                  Add
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add recurring task */}
      <AddRecurringSheet
        open={showAddRecurring}
        onClose={() => setShowAddRecurring(false)}
        onAdd={handleAddRecurring}
      />

      {/* Swap task */}
      {swapTask && (
        <SwapTaskSheet
          task={swapTask}
          currentStep={dayInfo?.currentStep ?? null}
          ambitionType={ambitionType}
          energy={morningEnergy ?? "medium"}
          timeAvailable={morningTimeAvailable ?? 60}
          onSwap={handleSwap}
          onClose={() => setSwapTask(null)}
        />
      )}
    </div>
  );
}
