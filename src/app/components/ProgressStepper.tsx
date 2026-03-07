"use client";

type ProgressStepperProps = {
  step: number;
  total: number;
};

export function ProgressStepper({ step, total }: ProgressStepperProps) {
  const pct = total > 0 ? Math.min(100, ((step + 1) / total) * 100) : 0;

  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-300 ease-in-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
