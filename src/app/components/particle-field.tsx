"use client";

import { useReducedMotion } from "framer-motion";

const PARTICLE_COUNT = 20;
const MINIMAL_COUNT = 12;

export function ParticleField({
  minimal = false,
  className = "",
}: {
  minimal?: boolean;
  className?: string;
} = {}) {
  const reduceMotion = useReducedMotion();
  const count = minimal ? MINIMAL_COUNT : PARTICLE_COUNT;

  if (reduceMotion) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => {
        const size = minimal ? "h-1 w-1" : i % 3 === 0 ? "h-1.5 w-1.5" : "h-1 w-1";
        const opacity = minimal ? "bg-white/12" : i % 4 === 0 ? "bg-white/25" : "bg-white/15";
        return (
          <div
            key={i}
            className={`absolute rounded-full ${size} ${opacity}`}
            style={{
              left: `${(i * 7 + 13) % 100}%`,
              top: `${(i * 11 + 17) % 100}%`,
              animation: "star-drift 12s ease-in-out infinite",
              animationDelay: `${(i * 0.5) % 6}s`,
            }}
          />
        );
      })}
    </div>
  );
}
