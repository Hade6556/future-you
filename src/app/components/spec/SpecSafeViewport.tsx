"use client";

import { type ReactNode } from "react";

export function SpecSafeViewport({ children }: { children: ReactNode }) {
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col gap-[var(--space-section)] px-6 pb-8 pt-10 md:max-w-screen-md md:px-20"
      style={{
        paddingTop: "max(40px, env(safe-area-inset-top))",
        paddingBottom: "max(32px, env(safe-area-inset-bottom))",
      }}
    >
      {children}
    </div>
  );
}
