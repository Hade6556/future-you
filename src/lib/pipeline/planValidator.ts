import type { PipelinePhase, PipelineStep } from "@/app/types/pipeline";

type ValidationResult =
  | { valid: true; phases: PipelinePhase[] }
  | { valid: false; reason: string };

function isValidStep(s: unknown, index: number): s is PipelineStep {
  if (!s || typeof s !== "object") return false;
  const step = s as Record<string, unknown>;
  return (
    typeof step.step_number === "number" &&
    typeof step.title === "string" &&
    step.title.length > 0 &&
    typeof step.description === "string" &&
    step.description.length > 0 &&
    typeof step.duration_weeks === "number" &&
    step.duration_weeks > 0 &&
    typeof step.success_metric === "string"
  );
}

function normalizeStep(raw: Record<string, unknown>, fallbackNumber: number): PipelineStep {
  return {
    step_number: typeof raw.step_number === "number" ? raw.step_number : fallbackNumber,
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    duration_weeks: typeof raw.duration_weeks === "number" && raw.duration_weeks > 0 ? raw.duration_weeks : 1,
    resources: Array.isArray(raw.resources) ? raw.resources.map(String) : [],
    success_metric: String(raw.success_metric ?? "Step completed"),
  };
}

function normalizePhase(raw: Record<string, unknown>, fallbackNumber: number): PipelinePhase | null {
  if (!raw.steps || !Array.isArray(raw.steps) || raw.steps.length === 0) return null;
  if (!raw.phase_name && !raw.goal) return null;

  const steps = (raw.steps as Record<string, unknown>[]).map((s, i) => normalizeStep(s, i + 1));

  return {
    phase_number: typeof raw.phase_number === "number" ? raw.phase_number : fallbackNumber,
    phase_name: String(raw.phase_name ?? `Phase ${fallbackNumber}`),
    duration_weeks:
      typeof raw.duration_weeks === "number" && raw.duration_weeks > 0
        ? raw.duration_weeks
        : steps.reduce((sum, s) => sum + s.duration_weeks, 0),
    goal: String(raw.goal ?? ""),
    steps,
    milestones: Array.isArray(raw.milestones) ? raw.milestones.map(String) : [],
  };
}

export function validatePlanResponse(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== "object") {
    return { valid: false, reason: "Response is not an object" };
  }

  const obj = raw as Record<string, unknown>;
  const phasesRaw = obj.phases;

  if (!Array.isArray(phasesRaw) || phasesRaw.length === 0) {
    return { valid: false, reason: "No phases array found" };
  }

  if (phasesRaw.length > 6) {
    return { valid: false, reason: `Too many phases: ${phasesRaw.length}` };
  }

  const phases: PipelinePhase[] = [];
  for (let i = 0; i < phasesRaw.length; i++) {
    const phase = normalizePhase(phasesRaw[i] as Record<string, unknown>, i + 1);
    if (!phase) {
      return { valid: false, reason: `Phase ${i + 1} is malformed` };
    }
    phases.push(phase);
  }

  return { valid: true, phases };
}
