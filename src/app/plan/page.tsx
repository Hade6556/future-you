"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { IntakeResponse } from "../types/plan";
import { usePlanStore } from "../state/planStore";
import { ARCHETYPES } from "../data/archetypes";

const STORAGE_KEY_PREFIX = "future-you-plan-";

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
  const planId = usePlanStore((s) => s.planId);
  const setPlanReady = usePlanStore((s) => s.setPlanReady);
  const acceptPlan = usePlanStore((s) => s.acceptPlan);
  const archetype = usePlanStore((s) => s.dogArchetype);

  const arch = archetype ? ARCHETYPES.find((a) => a.id === archetype) : null;

  const [plan, setPlan] = useState<IntakeResponse | null | undefined>(undefined);
  const [pathIndex, setPathIndex] = useState(0);

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

  const handleDropIn = () => {
    acceptPlan();
    router.push("/brief");
  };

  if (plan === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F8F6F1] px-6">
        <p className="text-[#6A6A6A]">Loading…</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F8F6F1] px-6">
        <p className="text-center text-[17px] text-[#6A6A6A]">
          No plan yet. Let&apos;s build your roadmap — your coach is ready.
        </p>
        <Link
          href="/intake"
          className="mt-6 flex h-[56px] items-center justify-center rounded-[28px] bg-[#121212] px-8 text-[17px] font-semibold text-white"
        >
          Start my plan
        </Link>
      </div>
    );
  }

  const path = plan.paths[pathIndex];
  const hasAlternatives = plan.paths.length > 1;

  return (
    <div className="relative min-h-dvh bg-[#F8F6F1] px-6 pb-28 pt-[max(56px,env(safe-area-inset-top,16px))]">
      <div className="mx-auto max-w-md">
        {/* Tag */}
        <span className="inline-flex rounded-full border border-[#6FCF97]/30 bg-[#6FCF97]/10 px-4 py-1.5 text-[13px] font-medium text-[#2D8B5E]">
          Your coaching plan
        </span>

        {/* Archetype badge */}
        {arch && (
          <p className="mt-2 text-[13px] text-[#6A6A6A]">
            Built for {arch.emoji} {arch.name}s
          </p>
        )}

        {/* Values & Strengths */}
        <div className="mt-6 rounded-2xl border border-[#E0E0E0] bg-white p-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[#6A6A6A]">
            Your Values & Strengths
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {plan.values.map((v) => (
              <span
                key={v}
                className="rounded-full border border-[#E0E0E0] bg-[#F8F6F1] px-3 py-1 text-[13px] text-[#121212]"
              >
                {v}
              </span>
            ))}
            {plan.roles.map((r) => (
              <span
                key={r}
                className="rounded-full border border-[#6FCF97]/30 bg-[#6FCF97]/10 px-3 py-1 text-[13px] font-medium text-[#2D8B5E]"
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Path card */}
        <div className="mt-4 rounded-2xl border border-[#E0E0E0] bg-white p-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[#6A6A6A]">
            Your path forward
          </h2>
          {path && (
            <>
              <h3
                className="mt-3 text-[24px] font-bold text-[#121212]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {path.name}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#6A6A6A]">{path.description}</p>
              {hasAlternatives && (
                <button
                  onClick={() => setPathIndex((i) => (i + 1) % plan.paths.length)}
                  className="mt-4 text-[14px] font-semibold text-[#2D9CDB]"
                >
                  View alternative path →
                </button>
              )}
            </>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleDropIn}
          className="mt-6 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-[#121212] text-[17px] font-semibold text-white transition-transform active:scale-[0.97]"
        >
          Start my daily coaching
        </button>
      </div>
    </div>
  );
}
