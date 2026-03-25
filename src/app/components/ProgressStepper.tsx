"use client";

type ProgressStepperProps = {
  step: number;
  total: number;
};

export function ProgressStepper({ step, total }: ProgressStepperProps) {
  const pct = total > 0 ? Math.min(100, ((step + 1) / total) * 100) : 0;

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-warm-gold transition-all duration-300 ease-in-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
