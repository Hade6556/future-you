import type { GoalPlan, PipelinePhase, PipelineStep } from "../types/pipeline";

export type DayInfo = {
  /** 1-based day number. Day 1 = first day of the plan. */
  currentDay: number;
  /** Total days in the plan (horizon_weeks * 7). */
  totalDays: number;
  /** The step the user is currently on. Null only if plan has no steps. */
  currentStep: PipelineStep | null;
  /** The phase that contains the current step. */
  currentPhase: PipelinePhase | null;
  /** The next step after the current one (for tomorrow preview). Null if on last step. */
  nextStep: PipelineStep | null;
  /** The flat index of the current step across all phases (for compatibility). */
  activeStepIndex: number;
  /** Progress through the plan (0–1). */
  overallProgress: number;
};

/**
 * Compute what day we're on and which step/phase is active,
 * given the plan and the ISO date when the plan started.
 */
export function computeDayInfo(plan: GoalPlan, planStartDate: string): DayInfo {
  const start = new Date(planStartDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayDiff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const currentDay = Math.max(1, dayDiff + 1); // 1-based

  const totalDays = plan.horizon_weeks * 7;
  const overallProgress = Math.min(1, (currentDay - 1) / Math.max(1, totalDays - 1));

  const allSteps = plan.phases.flatMap((p) => p.steps);

  // Walk through each step and find which one encompasses currentDay
  let dayCounter = 1;
  for (const phase of plan.phases) {
    for (let si = 0; si < phase.steps.length; si++) {
      const step = phase.steps[si];
      const stepDays = Math.max(1, step.duration_weeks * 7);
      const stepEndDay = dayCounter + stepDays - 1;

      if (currentDay <= stepEndDay) {
        const stepIndex = allSteps.findIndex((s) => s === step);
        return {
          currentDay,
          totalDays,
          currentStep: step,
          currentPhase: phase,
          nextStep: allSteps[stepIndex + 1] ?? null,
          activeStepIndex: stepIndex,
          overallProgress,
        };
      }

      dayCounter += stepDays;
    }
  }

  // Past the end of the plan — return the last step
  const lastStep = allSteps[allSteps.length - 1] ?? null;
  const lastPhase = plan.phases[plan.phases.length - 1] ?? null;
  return {
    currentDay: Math.min(currentDay, totalDays),
    totalDays,
    currentStep: lastStep,
    currentPhase: lastPhase,
    nextStep: null,
    activeStepIndex: Math.max(0, allSteps.length - 1),
    overallProgress: 1,
  };
}
