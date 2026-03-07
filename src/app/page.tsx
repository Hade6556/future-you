"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlanStore } from "./state/planStore";
import { ARCHETYPES } from "./data/archetypes";
import { MascotReactor } from "./components/mascot/MascotReactor";
import type { MascotEmotion } from "./components/mascot/MascotReactor";
import { StreakWeekView } from "./components/home/StreakWeekView";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const router = useRouter();
  const quizComplete = usePlanStore((s) => s.quizComplete);
  const onboardingComplete = usePlanStore((s) => s.onboardingComplete);
  const streak = usePlanStore((s) => s.streak);
  const userName = usePlanStore((s) => s.userName);
  const archetype = usePlanStore((s) => s.dogArchetype);

  const arch = archetype ? ARCHETYPES.find((a) => a.id === archetype) : null;

  useEffect(() => {
    if (!quizComplete) {
      router.replace("/quiz");
      return;
    }
    if (!onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [quizComplete, onboardingComplete, router]);

  if (!quizComplete || !onboardingComplete) return null;

  const emotion: MascotEmotion =
    streak === 0
      ? "encouraging"
      : streak >= 7
        ? "excited"
        : "default";

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#F8F6F1] px-6 pb-28 pt-[max(56px,env(safe-area-inset-top,16px))]">
      <div className="mx-auto w-full max-w-md">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <h1
            className="text-[22px] font-semibold text-[#121212]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {getGreeting()}, {userName || "friend"} 👋
          </h1>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E0E0E0] text-[#6A6A6A]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 6v6M6 9h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Mascot */}
        <div className="mt-6 flex flex-col items-center">
          <MascotReactor emotion={emotion} size={160} />
          {arch && (
            <span className="mt-2 text-[12px] text-[#6A6A6A]">
              {arch.emoji} {arch.name}
            </span>
          )}
        </div>

        {/* Streak week view */}
        <div className="mt-8">
          <StreakWeekView streak={streak} />
          {streak === 0 && (
            <p className="mt-2 text-center text-[13px] text-[#6A6A6A]">
              Start your streak today
            </p>
          )}
        </div>

        {/* Today's focus card */}
        <div className="mt-6 rounded-2xl border border-[#E0E0E0] bg-white p-5">
          <p className="text-[11px] font-medium uppercase tracking-widest text-[#6A6A6A]">
            TODAY&apos;S FOCUS
          </p>
          <p className="mt-2 text-[17px] font-medium text-[#121212]">
            {arch?.ritualStyle ?? "Build your daily habits and track progress"}
          </p>
          <Link
            href="/brief"
            className="mt-3 inline-block text-[14px] font-semibold text-[#6FCF97]"
          >
            View today&apos;s plan →
          </Link>
        </div>

        {/* Quick action tiles */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/brief"
            className="flex flex-col gap-2 rounded-2xl border border-[#E0E0E0] bg-white p-4"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#6FCF97]">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 12h8M8 8h5M8 16h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[16px] font-semibold text-[#121212]">Daily Brief</span>
            <span className="text-[12px] text-[#6A6A6A]">Today&apos;s coaching steps</span>
          </Link>
          <Link
            href="/plan"
            className="flex flex-col gap-2 rounded-2xl border border-[#E0E0E0] bg-white p-4"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#2D9CDB]">
              <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span className="text-[16px] font-semibold text-[#121212]">My Plan</span>
            <span className="text-[12px] text-[#6A6A6A]">Your 90-day roadmap</span>
          </Link>
        </div>

        {/* Social proof strip */}
        <p className="mt-8 text-center text-[12px] text-[#6A6A6A]">
          12,847 people are using Future Me today
        </p>
      </div>
    </div>
  );
}
