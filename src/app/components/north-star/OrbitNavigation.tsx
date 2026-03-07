"use client";

import { motion, useReducedMotion } from "framer-motion";

const MOTION_DURATION = 0.25;
const ORBIT_R = 56;
const SIZE = ORBIT_R * 2;

export type OrbitNavigationProps = {
  illuminate: boolean;
};

export function OrbitNavigation({ illuminate }: OrbitNavigationProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      <motion.div
        className="absolute rounded-full border border-white/30"
        style={{ width: SIZE, height: SIZE }}
        initial={false}
        animate={{
          opacity: illuminate ? 0.6 : 0.25,
          borderColor: illuminate ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
        }}
        transition={{ duration: MOTION_DURATION, ease: "easeOut" }}
      />
      {!reduceMotion && (
        <motion.div
          className="absolute"
          style={{ width: SIZE, height: SIZE }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.span
            className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            style={{ boxShadow: "0 0 6px rgba(255,255,255,0.8)" }}
            animate={{ opacity: illuminate ? 1 : 0.5 }}
            transition={{ duration: MOTION_DURATION, ease: "easeOut" }}
          />
          <motion.span
            className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-white"
            style={{ boxShadow: "0 0 6px rgba(255,255,255,0.8)" }}
            animate={{ opacity: illuminate ? 1 : 0.5 }}
            transition={{ duration: MOTION_DURATION, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </div>
  );
}
