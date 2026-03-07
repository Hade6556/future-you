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
    : { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 100, opacity: 0 } };

  return (
    <motion.div
      data-testid="sheet"
      role="dialog"
      aria-label="Future Me coaching"
      className="glass fixed left-5 right-5 z-50 w-auto max-w-[420px] overflow-hidden rounded-[28px] p-6 md:left-1/2 md:right-auto md:w-full md:max-w-[520px] md:-translate-x-1/2 md:px-8 md:py-6 lg:max-w-[640px] lg:px-10"
      style={{
        top: "clamp(12%, 18vh, 22%)",
      }}
      drag={reduceMotion ? false : "y"}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.4 }}
      onDragEnd={handleDragEnd}
      {...motionProps}
      transition={{ duration, ease: "easeOut" }}
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
        <span className="h-1 w-10 rounded-full bg-white/20" />
      </div>
    </motion.div>
  );
}
