"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePlanStore } from "../../state/planStore";
import { computeDayInfo } from "../../utils/dayEngine";

const PLACEHOLDER_TASKS = ["Define your goal", "Set your schedule", "Choose your focus"];

/** Purple feature card — shows 90-day plan progress and top tasks. */
export function PlanCard() {
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);
  const planStartDate = usePlanStore((s) => s.planStartDate);
  const planReady = usePlanStore((s) => s.planReady);
  const todayStatus = usePlanStore((s) => s.todayStatus);

  const dayInfo = useMemo(
    () => (pipelinePlan && planStartDate ? computeDayInfo(pipelinePlan, planStartDate) : null),
    [pipelinePlan, planStartDate],
  );

  // Pull top 3 task titles from the current phase's steps
  const tasks = useMemo(() => {
    if (!pipelinePlan) return PLACEHOLDER_TASKS;
    const steps = pipelinePlan.phases[0]?.steps ?? [];
    const titles = steps.slice(0, 3).map((s) => s.title);
    return titles.length ? titles : PLACEHOLDER_TASKS;
  }, [pipelinePlan]);

  return (
    <Link href="/plan" className="no-underline shrink-0">
      <div
        className="flex h-[200px] w-[163px] flex-col justify-between rounded-[32px] p-5"
        style={{
          background: "var(--accent-purple)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='34'%3E%3Ccircle cx='19' cy='4' r='4.5' fill='rgba(255,255,255,0.11)'/%3E%3Ccircle cx='6' cy='11' r='4.5' fill='rgba(255,255,255,0.11)'/%3E%3Ccircle cx='32' cy='11' r='4.5' fill='rgba(255,255,255,0.11)'/%3E%3Ccircle cx='6' cy='23' r='4.5' fill='rgba(255,255,255,0.11)'/%3E%3Ccircle cx='32' cy='23' r='4.5' fill='rgba(255,255,255,0.11)'/%3E%3Ccircle cx='19' cy='30' r='4.5' fill='rgba(255,255,255,0.11)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "38px 34px",
          boxShadow: "0 16px 32px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
            My Plan
          </p>
          {dayInfo && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
              Day {dayInfo.currentDay}
            </span>
          )}
        </div>

        {/* Day progress */}
        <div>
          <p className="text-[28px] font-extrabold leading-none text-white">
            {planReady && dayInfo ? `${dayInfo.currentDay}` : "—"}
          </p>
          <p className="text-[11px] text-white/70">
            {planReady && dayInfo ? `of ${dayInfo.totalDays} days` : "not started"}
          </p>
        </div>

        {/* Mini task list */}
        <div className="flex flex-col gap-1.5">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm"
                style={{
                  border: "1.5px solid rgba(255,255,255,0.6)",
                  background: planReady && i === 0 && todayStatus === "done"
                    ? "rgba(255,255,255,0.6)"
                    : "transparent",
                }}
              >
                {planReady && i === 0 && todayStatus === "done" && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <p className="truncate text-[10px] font-medium text-white/90">
                {task}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
