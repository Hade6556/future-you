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
  // No axial motion. Pure opacity + blur fade is the safest scroll-reveal
  // language — anything else fights the scroll direction.
  offset = 0,
  blur = "3px",
  duration = 0.45,
  direction = "up",
  // 0px margin: trigger as the element's edge crosses the viewport edge.
  // Combined with once:true, this fades elements in cleanly the first time
  // they enter view; scrolling back never re-runs the animation.
  inViewMargin = "0px",
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: inViewMargin, once: true });

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
