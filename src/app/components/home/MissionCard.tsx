"use client";

import Link from "next/link";
import { usePlanStore } from "../../state/planStore";
import type { CheckinStatus } from "../../types/pipeline";

function StatusLabel({ status }: { status: CheckinStatus }) {
  const map: Record<CheckinStatus, { label: string; bg: string }> = {
    pending:  { label: "Pending",  bg: "rgba(255,255,255,0.25)" },
    done:     { label: "Done ✓",   bg: "rgba(255,255,255,0.35)" },
    partial:  { label: "Partial",  bg: "rgba(255,255,255,0.25)" },
    skipped:  { label: "Skipped",  bg: "rgba(255,255,255,0.20)" },
  };
  const { label, bg } = map[status];
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-[13px] font-bold text-white"
      style={{ background: bg }}
    >
      {label}
    </span>
  );
}

/** Orange feature card — shows today's coaching mission status. */
export function MissionCard() {
  const todayStatus = usePlanStore((s) => s.todayStatus);
  const planReady = usePlanStore((s) => s.planReady);

  const done = todayStatus === "done";

  return (
    <Link href="/plan" className="no-underline shrink-0">
      <div
        className="flex h-[200px] w-[163px] flex-col justify-between rounded-[32px] p-5"
        style={{
          background: "var(--accent-primary)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='38'%3E%3Ccircle cx='10' cy='10' r='4.5' fill='rgba(255,255,255,0.11)'/%3E%3Ccircle cx='28' cy='10' r='4.5' fill='rgba(255,255,255,0.11)'/%3E%3Ccircle cx='19' cy='24' r='4.5' fill='rgba(255,255,255,0.11)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "38px 38px",
          boxShadow: "0 16px 32px rgba(0,0,0,0.25)",
        }}
      >
        {/* Icon — smiley (done) or target (pending) */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          {done ? (
            <>
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8" />
              <path d="M8.5 13.5s1 2 3.5 2 3.5-2 3.5-2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="9" cy="10" r="1" fill="white" />
              <circle cx="15" cy="10" r="1" fill="white" />
            </>
          ) : (
            <>
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.8" />
              <line x1="12" y1="3" x2="12" y2="6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="12" y1="18" x2="12" y2="21" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </>
          )}
        </svg>

        {/* Title */}
        <div className="flex-1 flex flex-col justify-center gap-1 mt-2">
          <p className="text-[13px] font-bold uppercase tracking-wider text-white/70">
            Today
          </p>
          <p className="text-[16px] font-extrabold leading-snug text-white">
            {planReady ? "Daily Mission" : "Build your plan"}
          </p>
          <p className="text-[12px] text-white/80 leading-snug">
            {planReady
              ? done
                ? "Crushed it."
                : "Tap to check in"
              : "Get a 90-day roadmap"}
          </p>
        </div>

        {/* Status badge */}
        <StatusLabel status={planReady ? todayStatus : "pending"} />
      </div>
    </Link>
  );
}
