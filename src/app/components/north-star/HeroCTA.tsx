"use client";

import Link from "next/link";

type HeroCTAProps = {
  headline: string;
  ctaLabel: string;
  ctaHref: string;
  onClose: () => void;
};

export function HeroCTA({ headline, ctaLabel, ctaHref, onClose }: HeroCTAProps) {
  return (
    <div className="flex flex-col gap-[var(--space-md)] md:gap-[var(--space-lg)]">
      <div className="flex items-start justify-between gap-[var(--space-md)]">
        <h2 className="plan-headline min-w-0 flex-1 break-words font-semibold tracking-tight text-white">
          {headline}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant"
          className="shrink-0 rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ion-green)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--night-sky)]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <Link
        href={ctaHref}
        onClick={onClose}
        className="plan-cta-primary plan-cta-text inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 px-6 font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ion-green)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--night-sky)] active:scale-[0.98]"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
