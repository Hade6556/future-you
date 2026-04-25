"use client";

import { CSSProperties, ElementType, MouseEvent, ReactNode, useRef } from "react";
import { accentRgba } from "@/app/theme";

interface SpotlightCardProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Spotlight radius in pixels. Default 360. */
  radius?: number;
  /** Spotlight intensity 0..1. Default 0.16. */
  intensity?: number;
  [key: `data-${string}`]: string | undefined;
}

/**
 * Card wrapper that paints a soft sage-mint spotlight tracking the cursor.
 * The overlay is absolutely positioned with pointer-events: none so it never
 * blocks clicks. CSS custom properties (--mx, --my, --spot-opacity) are set
 * on the parent and inherited into the overlay's gradient.
 */
export default function SpotlightCard({
  as,
  children,
  className,
  style,
  radius = 360,
  intensity = 0.16,
  ...rest
}: SpotlightCardProps) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = (as ?? "div") as ElementType;

  function handleMove(e: MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    el.style.setProperty("--spot-opacity", "1");
  }

  function handleLeave() {
    ref.current?.style.setProperty("--spot-opacity", "0");
  }

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: "var(--spot-opacity, 0)",
          transition: "opacity 220ms ease-out",
          background: `radial-gradient(${radius}px circle at var(--mx, 50%) var(--my, 50%), ${accentRgba(intensity)} 0%, transparent 55%)`,
          borderRadius: "inherit",
          zIndex: 0,
        }}
      />
      {children}
    </Tag>
  );
}
