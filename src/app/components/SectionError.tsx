"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SectionError({
  error,
  reset,
  section,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  section: string;
}) {
  useEffect(() => {
    console.error(`[${section}]`, error);
  }, [error, section]);

  return (
    <div
      className="flex min-h-[60dvh] flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "var(--canvas-base)" }}
    >
      <h2 className="mb-2 text-lg font-semibold text-foreground">
        {section} hit a snag
      </h2>
      <p className="mb-6 max-w-xs text-sm text-muted-foreground">
        Something went wrong loading this section. Try again or head home.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="h-10 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Retry
        </button>
        <Link
          href="/"
          className="flex h-10 items-center rounded-xl border border-border bg-card px-5 text-sm font-medium text-foreground hover:bg-muted"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
