"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const MOTION_DURATION = 0.25;

type SheetProps = {
  children: ReactNode;
  onClose: () => void;
};

export function Sheet({ children, onClose }: SheetProps) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.15 : MOTION_DURATION;

  const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (info.offset.y > 80 || info.velocity.y > 300) onClose();
  };

  const motionProps = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  const transitionProps = reduceMotion ? { duration } : { duration: 0.2 };

  return (
    <motion.div
      data-testid="sheet"
      role="dialog"
      aria-label="Future Me coaching"
      className="fixed left-5 right-5 z-50 w-auto max-w-[420px] overflow-hidden rounded-xl border border-border bg-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.2)] md:left-1/2 md:right-auto md:w-full md:max-w-[520px] md:-translate-x-1/2 md:px-8 md:py-6 lg:max-w-[640px] lg:px-10"
      style={{
        top: "clamp(12%, 18vh, 22%)",
      }}
      drag={reduceMotion ? false : "y"}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.4 }}
      onDragEnd={handleDragEnd}
      {...motionProps}
      transition={transitionProps}
    >
      <div
        data-testid="sheet-body"
        className="flex flex-col gap-4 overflow-x-hidden overflow-y-auto [scrollbar-gutter:stable]"
        style={{
          maxHeight: "clamp(55vh, 60vh, 70vh)",
          paddingRight: "4px",
        }}
      >
        {children}
      </div>

      <div className="mt-3 flex justify-center" aria-hidden>
        <span className="h-0.5 w-8 rounded-full bg-border" />
      </div>
    </motion.div>
  );
}
