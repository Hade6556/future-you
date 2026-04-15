"use client";

import { ACCENT, NAVY } from "@/app/theme";
import { BehavioLogo } from "./BehavioLogo";

export default function ActionLoader({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-5"
      style={{ background: NAVY }}
    >
      <BehavioLogo size={32} />
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ background: ACCENT, opacity: 0.7, animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
