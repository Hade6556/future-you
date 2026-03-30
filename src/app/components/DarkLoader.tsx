"use client";

import { OrbAvatar } from "./mascot/OrbAvatar";

export default function DarkLoader() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      style={{ background: "#0A1628" }}
    >
      <OrbAvatar emotion="thinking" size={80} />
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full animate-pulse"
            style={{ background: "#C8FF00", animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
