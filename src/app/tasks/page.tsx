"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import type { ArchetypeId } from "../types/plan";
import { ARCHETYPES } from "../data/archetypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ClockIcon, PlusIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

type Task = {
  id: string;
  label: string;
  time: string;
  done: boolean;
  flexible?: boolean;
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getDefaultTasks(archetype: ArchetypeId | null): Task[] {
  switch (archetype) {
    case "strategist":
      return [
        { id: "1", label: "Deep work block", time: "9:00 AM", done: false },
        { id: "2", label: "Review goals", time: "12:00 PM", done: false },
        { id: "3", label: "Remove one distraction", time: "3:00 PM", done: false },
      ];
    case "endurance":
      return [
        { id: "1", label: "Morning workout", time: "7:00 AM", done: false },
        { id: "2", label: "Track nutrition", time: "12:00 PM", done: false },
        { id: "3", label: "10-min walk", time: "5:00 PM", done: false },
      ];
    case "creative":
      return [
        { id: "1", label: "Creative brainstorm", time: "10:00 AM", done: false },
        { id: "2", label: "Prototype one idea", time: "2:00 PM", done: false },
        { id: "3", label: "Share with a friend", time: "6:00 PM", done: false },
      ];
    case "guardian":
      return [
        { id: "1", label: "Morning meditation", time: "7:30 AM", done: false },
        { id: "2", label: "Check in with buddy", time: "12:00 PM", done: false },
        { id: "3", label: "Evening reflection", time: "9:00 PM", done: false },
      ];
    case "explorer":
      return [
        { id: "1", label: "Try something new", time: "10:00 AM", done: false },
        { id: "2", label: "Research next step", time: "2:00 PM", done: false },
        { id: "3", label: "Log what you learned", time: "7:00 PM", done: false },
      ];
    default:
      return [
        { id: "1", label: "Morning routine", time: "8:00 AM", done: false },
        { id: "2", label: "Focus session", time: "11:00 AM", done: false },
        { id: "3", label: "Evening review", time: "8:00 PM", done: false },
      ];
  }
}

export default function TasksPage() {
  const userName = usePlanStore((s) => s.userName);
  const archetype = usePlanStore((s) => s.dogArchetype);
  const quizComplete = usePlanStore((s) => s.quizComplete);

  const [tasks, setTasks] = useState<Task[]>(() => getDefaultTasks(archetype));
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState("");

  const arch = archetype ? ARCHETYPES.find((a) => a.id === archetype) : null;

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const addTask = () => {
    if (!newTaskLabel.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setTasks((prev) => [
      ...prev,
      { id: String(Date.now()), label: newTaskLabel.trim(), time: timeStr, done: false },
    ]);
    setNewTaskLabel("");
    setShowAddSheet(false);
  };

  if (!quizComplete) {
    return (
      <div className="content-padding flex min-h-dvh flex-col items-center justify-center bg-background">
        <p className="type-body text-center text-text-secondary">
          Take the quiz first so Future Me can personalize your tasks.
        </p>
        <Button render={<Link href="/quiz" />} className="mt-6">
          Take the quiz
        </Button>
      </div>
    );
  }

  const doneCount = tasks.filter((t) => t.done).length;
  const progressPct = tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0;
  const hasTasks = tasks.length > 0;

  return (
    <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
      <div className="section-gap mx-auto flex w-full max-w-md flex-col">
        {/* Header: 8px vertical rhythm */}
        <header>
          <h1 className="type-h1">
            {getGreeting()},<br />{userName || "friend"}
          </h1>
          <p className="mt-2 text-[18px] font-semibold tracking-tight text-text-primary">
            Today&apos;s tasks
          </p>
          <p className="mt-2 type-body font-normal text-microcopy-soft">
            Knock out the three needle-movers before noon
          </p>
        </header>

        {/* Task list: 44px min touch target per row; 16px horizontal padding */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
          {hasTasks ? (
            <ul className="divide-y divide-divider">
              {tasks.map((task) => (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="touch-target flex min-h-[44px] w-full min-w-0 items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
                  >
                    <div className="shrink-0">
                      {task.done ? (
                        <motion.div
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-primary"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        </motion.div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40" />
                      )}
                    </div>
                    <span
                      className={`type-body min-w-0 flex-1 font-semibold text-text-primary ${task.done ? "line-through opacity-50" : ""}`}
                    >
                      {task.label}
                    </span>
                    {task.flexible ? (
                      <span className="shrink-0 rounded-full border border-border bg-transparent px-2 py-0.5 text-[11px] font-medium tracking-normal text-text-secondary shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                        Time flexible
                      </span>
                    ) : (
                      <span className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-chip-bg px-2 py-0.5 text-[11px] font-medium tracking-tight text-text-secondary shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                        <ClockIcon className="h-3 w-3 text-text-secondary" aria-hidden />
                        {task.time}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            /* Empty state: illustrated card */
            <Card className="border-0 shadow-none">
              <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
                <motion.div
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/60"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <CheckBadgeIcon className="h-8 w-8 text-primary/70" aria-hidden />
                </motion.div>
                <div>
                  <p className="type-card-title">No tasks yet</p>
                  <p className="type-body mt-1 font-normal text-text-secondary">
                    Add your first task and build momentum for the day.
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddSheet(true)}
                  size="sm"
                  variant="default"
                  className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary-hover"
                >
                  <PlusIcon className="mr-1 h-4 w-4" aria-hidden />
                  Add task
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Progress: 16px block gap; Add task 24px below */}
        {hasTasks && (
          <div className="block-gap flex flex-col">
            <div className="flex flex-col gap-2">
              <p className="type-caption text-text-secondary">
                Progress • {doneCount} of {tasks.length} done ({Math.round(progressPct)}%)
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPct}%`,
                    background: progressPct > 0
                      ? "repeating-linear-gradient( -55deg, var(--progress-fill), var(--progress-fill) 2px, var(--progress-fill-dim) 2px, var(--progress-fill-dim) 4px )"
                      : "transparent",
                  }}
                  initial={false}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex justify-center pt-0">
              <Button
                onClick={() => setShowAddSheet(true)}
                size="sm"
                variant="default"
                className="touch-target min-h-[44px] rounded-full bg-primary text-primary-foreground hover:bg-primary-hover px-6 shadow-[var(--nav-shadow)]"
              >
                <PlusIcon className="mr-1.5 h-4 w-4" aria-hidden />
                Add task
              </Button>
            </div>
          </div>
        )}

        {/* Coach card: 16px inner gap; 24px vertical padding */}
        {arch && (
          <Card className="mt-auto mb-6 min-w-0 overflow-hidden bg-gradient-to-br from-secondary/60 to-muted/40">
            <CardContent className="block-gap flex flex-col pb-4 pt-6 leading-relaxed p-4">
              <div className="flex items-start gap-3">
                <div
                  className="-mt-2 h-8 w-8 shrink-0 rounded-full shadow-sm"
                  style={{
                    background: `radial-gradient(ellipse 70% 70% at 35% 30%, var(--orb-gradient-start), var(--orb-gradient-end) 85%)`,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="type-caps-micro text-text-secondary">
                    You&apos;re on the {arch.name.replace(/^The\s+/, "")} path
                  </p>
                  <p className="type-body mt-1 text-text-primary">
                    <span className="font-semibold">Today&apos;s focus:</span> {arch.ritualStyle}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href="/brief" />}
                    className="touch-target mt-3 min-h-[44px] w-fit rounded-xl border-border text-text-primary"
                  >
                    View plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add task sheet */}
      <AnimatePresence>
        {showAddSheet && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-foreground/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSheet(false)}
            />
            <motion.div
              className="content-padding fixed inset-x-0 bottom-0 z-50 rounded-t-xl border-t border-border bg-card pb-10 pt-6 shadow-[0_-2px_8px_rgba(0,0,0,0.15)]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
              <h3 className="type-card-title">Add a task</h3>
              <Input
                type="text"
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                placeholder="What do you need to do?"
                autoFocus
                className="mt-4"
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
              <Button
                onClick={addTask}
                disabled={!newTaskLabel.trim()}
                size="sm"
                variant="default"
                className="mt-4 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover"
              >
                Add
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
