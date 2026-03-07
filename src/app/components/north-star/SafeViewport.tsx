"use client";

import { type ReactNode } from "react";

type SafeViewportProps = {
  children: ReactNode;
};

export function SafeViewport({ children }: SafeViewportProps) {
  return (
    <div
      className="flex min-h-dvh min-w-0 flex-col justify-between overflow-hidden"
      style={{
        padding: "clamp(20px, 4vw, 48px)",
        paddingTop: "max(clamp(20px, 4vw, 48px), env(safe-area-inset-top))",
        paddingBottom: "max(clamp(20px, 4vw, 48px), env(safe-area-inset-bottom))",
      }}
    >
      {children}
    </div>
  );
}
