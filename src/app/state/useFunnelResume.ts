"use client";

import { usePlanStore } from "./planStore";

export type FunnelStatus =
  | "fresh"
  | "mid_onboarding"
  | "mid_generating"
  | "complete";

export type FunnelResume = {
  status: FunnelStatus;
  resumeHref: string;
};

/**
 * Resolves the user's position in the quiz → onboarding → generating → home funnel
 * by reading planStore state (which is hydrated from localStorage on import).
 * Used by:
 * - the public landing (`/`) to decide whether to show a Resume banner
 * - the dashboard route to redirect mid-funnel users back into the funnel
 *
 * Note: the in-memory quizStore resets on reload, so we can't detect a partially-done
 * quiz. "Fresh" therefore covers both first-time visitors and quiz-abandoners — both
 * are routed to /quiz from the primary CTA, which is the right behavior.
 *
 * The hook is safe to call only in client components — its only caller (LandingPage)
 * is dynamically imported with ssr: false.
 */
export function useFunnelResume(): FunnelResume {
  const quizComplete = usePlanStore((s) => s.quizComplete);
  const onboardingComplete = usePlanStore((s) => s.onboardingComplete);
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);

  if (quizComplete && onboardingComplete && pipelinePlan) {
    return { status: "complete", resumeHref: "/" };
  }
  if (quizComplete && onboardingComplete && !pipelinePlan) {
    return { status: "mid_generating", resumeHref: "/generating" };
  }
  if (quizComplete && !onboardingComplete) {
    return { status: "mid_onboarding", resumeHref: "/onboarding" };
  }
  return { status: "fresh", resumeHref: "/quiz" };
}

/** True if the user has detectable mid-funnel progress (Resume banner should show). */
export function isResumable(status: FunnelStatus): boolean {
  return status === "mid_onboarding" || status === "mid_generating";
}
