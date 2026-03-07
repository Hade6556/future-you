"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressStepper } from "../components/ProgressStepper";
import { GlassCard, PrimaryButton } from "../components/ui";
import type { IntakeResponse } from "../types/plan";
import { usePlanStore } from "../state/planStore";

const STORAGE_KEY_PREFIX = "future-you-plan-";
const QUESTIONS = [
  "What does the best version of you look like?",
  "What ambition are you chasing — business, fitness, creativity, something else?",
  "How do you want to feel when you've made it?",
];

function generatePlanId(): string {
  return `plan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function IntakePage() {
  const router = useRouter();
  const setIdentityComplete = usePlanStore((s) => s.setIdentityComplete);
  const setPlanReady = usePlanStore((s) => s.setPlanReady);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planReady, setPlanReadyState] = useState(false);

  const currentAnswer = answers[step] ?? "";
  const setCurrent = (v: string) => {
    const next = [...answers];
    next[step] = v;
    setAnswers(next);
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
      setError(null);
      return;
    }
    const narrative = answers.filter(Boolean).join("\n\n");
    if (!narrative.trim()) {
      setError("Say a little more.");
      return;
    }
    setLoading(true);
    setError(null);
    fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ narrative, tone: "Life Coach" }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((b) => Promise.reject(new Error(b?.error || "Something went wrong")));
        return res.json() as Promise<IntakeResponse>;
      })
      .then((data) => {
        setIdentityComplete(true);
        const planId = generatePlanId();
        const payload = JSON.stringify(data);
        sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${planId}`, payload);
        try {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}${planId}`, payload);
        } catch {
          // quota or private mode
        }
        setPlanReady(planId);
        setPlanReadyState(true);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  };

  const handleSeePlan = () => {
    router.push("/plan");
  };

  if (planReady) {
    return (
      <div className="min-w-0 overflow-x-hidden px-5 pb-28 pt-5">
        <div className="mx-auto min-w-0 max-w-lg">
          <div className="rounded-[32px] glass-glow p-6 transition-opacity duration-200">
            <h2 className="text-[24px] font-medium tracking-tight text-white">
              Your coaching plan is ready.
            </h2>
            <PrimaryButton
              type="button"
              onClick={handleSeePlan}
              className="mt-5 w-full"
            >
              See Plan
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-x-hidden px-5 pb-28 pt-5">
      <div className="mx-auto flex min-w-0 max-w-lg flex-col gap-6">
        <ProgressStepper step={step} total={3} />

        <GlassCard className="flex flex-col gap-5 p-5">
          <div key={step} className="transition-opacity duration-200">
            <p className="text-[17px] leading-[1.5] text-white">
              {QUESTIONS[step]}
            </p>
          <textarea
            className="field-glass min-h-[120px] w-full resize-none rounded-2xl p-4 text-[15px] leading-relaxed text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-accent-blue/40"
            value={currentAnswer}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="A few words."
            rows={4}
          />
          <PrimaryButton
            type="button"
            onClick={handleNext}
            disabled={!currentAnswer.trim() || loading}
            className="w-full"
          >
            {loading ? "…" : step < 2 ? "Next" : "Generate"}
          </PrimaryButton>
          {error && (
            <p className="text-[14px] text-red-300">{error}</p>
          )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
