"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import type { ArchetypeId } from "../types/plan";

type Task = {
  id: string;
  label: string;
  time: string;
  done: boolean;
};

function getDefaultTasks(archetype: ArchetypeId | null): Task[] {
  switch (archetype) {
    case "strategist":
      return [
        { id: "1", label: "Deep work block 🧠", time: "9:00 AM", done: false },
        { id: "2", label: "Review goals", time: "12:00 PM", done: false },
        { id: "3", label: "Remove one distraction", time: "3:00 PM", done: false },
      ];
    case "endurance":
      return [
        { id: "1", label: "Morning workout 💪", time: "7:00 AM", done: false },
        { id: "2", label: "Track nutrition", time: "12:00 PM", done: false },
        { id: "3", label: "10-min walk", time: "5:00 PM", done: false },
      ];
    case "creative":
      return [
        { id: "1", label: "Creative brainstorm ✨", time: "10:00 AM", done: false },
        { id: "2", label: "Prototype one idea", time: "2:00 PM", done: false },
        { id: "3", label: "Share with a friend", time: "6:00 PM", done: false },
      ];
    case "guardian":
      return [
        { id: "1", label: "Morning meditation 🧘", time: "7:30 AM", done: false },
        { id: "2", label: "Check in with accountability buddy", time: "12:00 PM", done: false },
        { id: "3", label: "Evening reflection", time: "9:00 PM", done: false },
      ];
    case "explorer":
      return [
        { id: "1", label: "Try something new 🌍", time: "10:00 AM", done: false },
        { id: "2", label: "Research next step", time: "2:00 PM", done: false },
        { id: "3", label: "Log what you learned", time: "7:00 PM", done: false },
      ];
    default:
      return [
        { id: "1", label: "Morning routine ☀️", time: "8:00 AM", done: false },
        { id: "2", label: "Focus session 🔥", time: "11:00 AM", done: false },
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
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F8F6F1] px-6">
        <p className="text-center text-[17px] text-[#6A6A6A]">
          Take the quiz first so Future Me can personalize your tasks.
        </p>
        <Link
          href="/quiz"
          className="mt-6 flex h-[56px] items-center justify-center rounded-[28px] bg-[#121212] px-8 text-[17px] font-semibold text-white"
        >
          Take the quiz
        </Link>
      </div>
    );
  }

  const doneCount = tasks.filter((t) => t.done).length;
  const progressPct = tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0;

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#F8F6F1] pb-28 pt-[max(56px,env(safe-area-inset-top,16px))]">
      <div className="relative px-6">
        <div className="absolute right-0 top-8">
          <div className="relative h-[120px] w-[120px]">
            <Image src="/orb-notebook.png" alt="" fill className="object-contain" />
          </div>
        </div>

        <h1
          className="text-[32px] font-semibold leading-tight text-[#121212]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Welcome, {userName || "friend"} 👋
        </h1>
        <p className="mt-2 text-[18px] text-[#6A6A6A]">Today&apos;s tasks:</p>
      </div>

      <div className="mx-6 mt-8">
        {tasks.map((task, i) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex w-full items-center px-0 py-0"
          >
            <div className="mr-4 shrink-0">
              {task.done ? (
                <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#6FCF97]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
              ) : (
                <div className="h-[22px] w-[22px] rounded-full border-[1.5px] border-[#C7C7CB]" />
              )}
            </div>

            <div className={`flex flex-1 items-center py-[16px] ${i > 0 ? "border-t border-[#E0E0E0]" : ""}`}>
              <span className={`flex-1 text-left text-[17px] text-[#121212] ${task.done ? "line-through opacity-50" : ""}`}>
                {task.label}
              </span>
              <span className="rounded-full bg-[#E0E0E0]/50 px-3 py-1 text-[13px] text-[#6A6A6A]">
                {task.time}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mx-6 mt-6">
        <div className="flex items-center justify-between text-[12px] text-[#6A6A6A]">
          <span>{doneCount}/{tasks.length} complete</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E0E0E0]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6FCF97] to-[#2D9CDB] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ADD button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setShowAddSheet(true)}
          className="flex h-[48px] w-[120px] items-center justify-center rounded-[24px] bg-[#121212] text-[15px] font-semibold text-white transition-transform active:scale-[0.97]"
        >
          + Add task
        </button>
      </div>

      {/* Add task bottom sheet */}
      <AnimatePresence>
        {showAddSheet && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSheet(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white px-6 pb-10 pt-6 shadow-lg"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E0E0E0]" />
              <h3 className="text-[18px] font-semibold text-[#121212]">Add a task</h3>
              <input
                type="text"
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                placeholder="What do you need to do?"
                autoFocus
                className="mt-4 h-[48px] w-full rounded-2xl border border-[#E0E0E0] bg-[#F8F6F1] px-4 text-[15px] text-[#121212] placeholder:text-[#121212]/30 focus:border-[#121212] focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
              <button
                onClick={addTask}
                disabled={!newTaskLabel.trim()}
                className="mt-4 flex h-[48px] w-full items-center justify-center rounded-[24px] bg-[#121212] text-[15px] font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-40"
              >
                Add
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
