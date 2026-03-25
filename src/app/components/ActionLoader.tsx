"use client";

import { OrbAvatar } from "./mascot/OrbAvatar";

export default function ActionLoader({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-6"
      style={{ background: "#7B6BA8" }}
    >
      <OrbAvatar emotion="excited" size={96} />
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full animate-pulse"
            style={{ background: "#4B3425", animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
