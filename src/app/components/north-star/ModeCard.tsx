"use client";

import Link from "next/link";
import type { NorthStarStatus } from "./status";

export type RitualCardVariant = "locked" | "ready" | "in_progress";

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

type ModeCardProps = {
  chip: NorthStarStatus["chips"][number];
  onClose: () => void;
  enableMotion?: boolean;
};

function getVariantStyles(variant: RitualCardVariant) {
  const base = "relative rounded-2xl border px-5 py-4 shadow-lg min-h-[var(--card-min-height)] flex flex-col";
  const gap = "gap-[var(--space-sm)]";
  if (variant === "locked") {
    return `${base} ${gap}`;
  }
  return `${base} ${gap}`;
}

function getVariantInlineStyles(variant: RitualCardVariant) {
  if (variant === "locked") {
    return {
      backgroundColor: "var(--plan-card-locked-bg)",
      borderColor: "var(--plan-card-locked-border)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
    };
  }
  return {
    background: "var(--plan-card-ready-bg)",
    borderColor: "var(--plan-card-ready-border)",
    boxShadow: "0 0 0 1px var(--accent-primary-glow-strong), 0 8px 24px rgba(0,0,0,0.08)",
  };
}

export function ModeCard({ chip, onClose, enableMotion = false }: ModeCardProps) {
  const variant: RitualCardVariant = chip.status;
  const isLocked = variant === "locked";
  const isReady = variant === "ready";
  const isInProgress = variant === "in_progress";

  const liftClass = enableMotion ? "transition-transform duration-200 hover:-translate-y-0.5 focus-within:-translate-y-0.5" : "";

  return (
    <div
      data-testid="ritual-card"
      data-status={variant}
      className={`${getVariantStyles(variant)} ${liftClass}`}
      style={getVariantInlineStyles(variant)}
    >
      {(isReady || isInProgress) && enableMotion && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-30"
          style={{
            background: "linear-gradient(105deg, transparent 0%, var(--accent-primary-glow) 45%, transparent 55%)",
            animation: "card-shimmer 4s ease-in-out infinite",
          }}
          aria-hidden
        />
      )}
      <div className="relative flex min-h-0 flex-1 flex-col gap-[var(--space-sm)]">
        <div className="flex items-center justify-between gap-3">
          <span className="plan-body min-w-0 flex-1 break-words font-semibold text-foreground">{chip.label}</span>
          {isLocked && (
            <span className="badge-lock-shimmer inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--ritual-red)]/30 bg-[var(--ritual-red)]/10 px-2.5 py-0.5 plan-supporting font-medium text-[var(--ritual-red)]">
              <LockIcon />
              Locked
            </span>
          )}
          {isReady && (
            <span className="shrink-0 plan-supporting font-medium text-[var(--ion-green)]">Ready</span>
          )}
          {isInProgress && (
            <span className="shrink-0 plan-supporting font-medium text-[var(--color-pulse-teal)]">In progress</span>
          )}
        </div>
        <p className="plan-body break-words text-muted-foreground">{chip.insight}</p>
        <p className="plan-supporting break-words text-muted-foreground">{chip.nextActionLine}</p>
        <div className="mt-1">
          {isReady || isInProgress ? (
            <Link
              href={chip.href}
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary/10 px-4 plan-supporting font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {chip.ctaLabel}
            </Link>
          ) : (
            <Link
              href={chip.href}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 plan-supporting font-medium text-[var(--ritual-red)]/90 hover:text-[var(--ritual-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ritual-red)]/40"
            >
              {chip.ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
