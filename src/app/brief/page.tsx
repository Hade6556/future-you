"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../state/planStore";

const STEPS = [
  {
    label: "Align",
    color: "#F2994A",
    title: "Set your intention",
    body: "What are you coaching toward today? Take 2 minutes to set your focus.",
    cta: "Lock it in",
    next: "act" as const,
  },
  {
    label: "Act",
    color: "#6FCF97",
    title: "Take action",
    body: "Your top focus for today — plus one nudge from Future Me.",
    cta: "I showed up",
    next: "reflect" as const,
  },
  {
    label: "Reflect",
    color: "#2D9CDB",
    title: "Reflect on today",
    body: "One thing that went well today. Future Me wants to know.",
    cta: "Journal it",
    next: "complete" as const,
  },
];

export default function BriefPage() {
  const quizComplete = usePlanStore((s) => s.quizComplete);
  const streak = usePlanStore((s) => s.streak);
  const setDailyStatus = usePlanStore((s) => s.setDailyStatus);
  const incrementStreak = usePlanStore((s) => s.incrementStreak);
  const [showMomentum, setShowMomentum] = useState(false);

  if (!quizComplete) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F8F6F1] px-6">
        <p className="text-center text-[17px] text-[#6A6A6A]">
          Take the quiz first so Future Me can build your coaching plan.
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

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative min-h-dvh bg-[#F8F6F1] px-6 pb-28 pt-[max(56px,env(safe-area-inset-top,16px))]">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-[24px] font-bold text-[#121212]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Today&apos;s coaching
            </h1>
            <p className="mt-1 text-[13px] text-[#6A6A6A]">{dateStr}</p>
          </div>
          <div className="relative h-[80px] w-[80px]">
            <Image src="/orb-face.png" alt="Future Me" fill className="object-contain" />
          </div>
        </div>

        {/* Streak pill */}
        {streak > 0 && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#E0E0E0] bg-white px-4 py-1.5 text-[13px] font-medium text-[#121212]">
            🔥 {streak} days
          </div>
        )}

        {/* Step cards */}
        <div className="mt-6 flex flex-col gap-4">
          {STEPS.map((step) => (
            <div
              key={step.label}
              className="rounded-2xl border border-[#E0E0E0] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: step.color }}
                />
                <span className="text-[13px] font-semibold uppercase tracking-wide text-[#6A6A6A]">
                  {step.label}
                </span>
              </div>
              <h3 className="mt-3 text-[20px] font-bold text-[#121212]">{step.title}</h3>
              <p className="mt-1 text-[15px] text-[#6A6A6A]">{step.body}</p>
              <button
                onClick={() => {
                  setDailyStatus(step.next);
                  if (step.next === "complete") {
                    incrementStreak();
                    setShowMomentum(true);
                  }
                }}
                className="mt-4 flex h-[48px] w-full items-center justify-center rounded-[24px] bg-[#121212] text-[15px] font-semibold text-white transition-transform active:scale-[0.97]"
              >
                {step.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Celebration */}
        <AnimatePresence>
          {showMomentum && (
            <motion.div
              className="mt-8 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="relative h-[100px] w-[100px] animate-[mascot-bounce_0.6s_ease-out_3]">
                <Image src="/orb-face.png" alt="Celebrating" fill className="object-contain" />
              </div>
              <p className="mt-3 text-center text-[17px] font-medium text-[#121212]">
                Future Me is proud of you. ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
