"use client";

import { CSSProperties, ReactNode, useRef } from "react";
import {
  motion,
  useInView,
  type MotionProps,
  type UseInViewOptions,
} from "motion/react";

type Direction = "up" | "down" | "left" | "right";

interface RevealProps
  extends Omit<MotionProps, "initial" | "animate" | "variants" | "transition" | "ref"> {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  offset?: number;
  blur?: string;
  duration?: number;
  direction?: Direction;
  inViewMargin?: UseInViewOptions["margin"];
}

/**
 * Scroll-driven reveal that runs both ways — fades + blurs in when the element
 * enters the viewport, fades + blurs back out when it leaves. Tighter defaults
 * than BlurFade so it reads as a polish layer rather than a heavy entrance.
 */
export default function Reveal({
  children,
  className,
  style,
  delay = 0,
  offset = 6,
  blur = "3px",
  duration = 0.45,
  // Default to "up" — elements start *below* their final position and rise
  // into place. This matches the natural scroll-down motion; the previous
  // "down" default made elements fall downward while scrolling down, which
  // felt like resistance fighting the scroll.
  direction = "up",
  inViewMargin = "-12%",
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: inViewMargin });

  const isVertical = direction === "up" || direction === "down";
  // Match BlurFade's sign convention: "down" / "right" enter from the negative axis.
  const sign = direction === "up" || direction === "left" ? 1 : -1;

  const variants = {
    hidden: {
      opacity: 0,
      [isVertical ? "y" : "x"]: sign * offset,
      filter: `blur(${blur})`,
    },
    visible: {
      opacity: 1,
      [isVertical ? "y" : "x"]: 0,
      filter: "blur(0px)",
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay: 0.04 + delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
