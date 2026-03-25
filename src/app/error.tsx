"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: "var(--canvas-base)" }}>
      <p className="mb-4 text-5xl">😵</p>
      <h1 className="mb-2 text-[22px] font-bold text-foreground">Something went wrong</h1>
      <p className="mb-8 max-w-xs text-sm text-muted-foreground">
        An unexpected error occurred. Try again, or go back to the dashboard.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="h-11 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="flex h-11 items-center rounded-xl border border-border bg-card px-6 text-sm font-medium text-foreground hover:bg-muted"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
