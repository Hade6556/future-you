"use client";

import { CommandRosette } from "./CommandRosette";

type HeroSectionProps = {
  onOpen: () => void;
};

export function HeroSection({ onOpen }: HeroSectionProps) {
  return (
    <section
      data-testid="hero"
      className="mx-auto flex w-full max-w-lg flex-shrink-0 flex-col items-center justify-center gap-4"
      style={{
        minHeight: "min(220px, 28vw)",
      }}
    >
      <div
        className="relative mx-auto flex items-center justify-center"
        style={{
          width: "clamp(200px, 28vw, 280px)",
          height: "clamp(200px, 28vw, 280px)",
        }}
      >
        <CommandRosette isOpen={false} onClick={onOpen} />
      </div>
      <p className="operator-label text-center text-foreground" style={{ fontSize: "clamp(11px, 1.2vw, 13px)" }}>
        Behavio
      </p>
      <p className="plan-body text-center text-foreground">
        Tap to check in with your coach.
      </p>
      <p className="plan-supporting text-center text-muted-foreground">
        Your AI life coach for any ambition.
      </p>
      <p className="operator-label text-center text-muted-foreground" style={{ fontSize: "clamp(10px, 1.1vw, 12px)" }}>
        Quiz → Plan → Daily coaching
      </p>
    </section>
  );
}
