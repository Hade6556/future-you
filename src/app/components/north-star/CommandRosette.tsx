"use client";

import { motion, useReducedMotion } from "framer-motion";

const NORTH_STAR_PATHS = [
  "M441.66,232.88l-40.43-9a149.11,149.11,0,0,0-38.19-69,10,10,0,0,0-14.28,13.9A129.36,129.36,0,0,1,379.15,219l-12.79-2.83a89.64,89.64,0,0,1-68.08-68.54l-16.08-75a26.94,26.94,0,0,0-52.67-.07l-9.25,41.71c-37.11,10-70.44,33.46-90,63.73A10,10,0,1,0,147,188.81c17.66-27.26,49.81-49,83.91-56.67l.16,0,.66-.19.34-.11.55-.22.4-.17.45-.24a4.49,4.49,0,0,0,.42-.24l.39-.25.41-.29.37-.29c.12-.1.24-.2.35-.31l.38-.36.29-.3c.13-.14.25-.29.37-.44s.15-.19.23-.29.23-.32.34-.49l.2-.3.29-.51.18-.37a4,4,0,0,0,.21-.47,4.52,4.52,0,0,0,.18-.47c.05-.14.1-.28.14-.42s.12-.38.16-.57a1.8,1.8,0,0,0,.06-.22L249,76.79a7,7,0,0,1,13.7,0l16.09,75A109.57,109.57,0,0,0,362,235.65l75.31,16.69a7,7,0,0,1,0,13.68l-75.3,16.68c-2.44.54-4.89,1.17-7.27,1.87a10,10,0,0,0,2.82,19.53,9.87,9.87,0,0,0,2.82-.41c1.94-.57,3.94-1.09,5.94-1.53l75.3-16.68a26.94,26.94,0,0,0,0-52.6Z",
  "M379.4,325a10,10,0,0,0-13.75,3.12,130.73,130.73,0,0,1-69.9,54.4l2.53-11.83a89,89,0,0,1,14.77-33.37,10,10,0,1,0-16.19-11.62,108.63,108.63,0,0,0-18.06,40.81l-16.09,75.05a7,7,0,0,1-13.7,0l-16.09-75.05a109.62,109.62,0,0,0-83.25-83.82L74.37,266a7,7,0,0,1,0-13.68l75.3-16.69a109.36,109.36,0,0,0,63.85-41.18,10,10,0,1,0-16-11.95,89.49,89.49,0,0,1-52.21,33.68l-75.3,16.68a26.94,26.94,0,0,0,0,52.6l40.44,9a148.86,148.86,0,0,0,42.91,73.71,10,10,0,0,0,13.66-14.52,129,129,0,0,1-34.49-54.3l12.78,2.83a89.62,89.62,0,0,1,68.07,68.54l16.09,75.05a26.94,26.94,0,0,0,52.68,0L291,404.57a150.63,150.63,0,0,0,91.5-65.82A10,10,0,0,0,379.4,325Z",
  "M123.71,410.25c-.31-.15-31.06-14.74-36.09-47.33a10,10,0,0,0-19.7,0c-5,32.28-35.82,47.19-36.1,47.32a10,10,0,0,0,0,18.08c.31.15,31.07,14.74,36.1,47.33a10,10,0,0,0,19.7,0,58.45,58.45,0,0,1,11.32-26.43,10,10,0,1,0-15.91-12,83.69,83.69,0,0,0-5.25,7.84A91,91,0,0,0,54.6,419.29a90.94,90.94,0,0,0,23.17-25.75c13.87,23.56,36.32,34.22,37.57,34.79a10,10,0,1,0,8.37-18.08Z",
  "M480.23,83.68c-.32-.14-31.15-15.05-36.13-47.34a10,10,0,0,0-19.7,0c-5,32.29-35.82,47.2-36.1,47.33a10,10,0,0,0,0,18.07c.31.14,31.15,15.05,36.13,47.33a10,10,0,0,0,19.7,0c5-32.28,35.81-47.19,36.09-47.32a10,10,0,0,0,0-18.07Zm-46,34.78a90.94,90.94,0,0,0-23.17-25.75A90.86,90.86,0,0,0,434.25,67a90.86,90.86,0,0,0,23.17,25.76A90.94,90.94,0,0,0,434.25,118.46Z",
  "M219.67,168.57a10,10,0,1,0-7-17,10,10,0,0,0,7,17Z",
  "M333.54,315a10,10,0,0,0,0-14.09,10,10,0,0,0-15.33,1.5,9.83,9.83,0,0,0-.91,1.73,9.3,9.3,0,0,0-.57,1.86,9.85,9.85,0,0,0-.2,2,10,10,0,0,0,17,7Z",
  "M197,377.54a11.37,11.37,0,0,0-.92-1.72,10.6,10.6,0,0,0-1.24-1.51,9.4,9.4,0,0,0-1.51-1.24,9.83,9.83,0,0,0-1.72-.92,10.92,10.92,0,0,0-1.87-.57,10.07,10.07,0,0,0-9,2.73,10.6,10.6,0,0,0-1.24,1.51,9.77,9.77,0,0,0-.91,1.72,8.78,8.78,0,0,0-.57,1.87,9.77,9.77,0,0,0-.2,1.95,9.91,9.91,0,0,0,.2,1.94,8.69,8.69,0,0,0,.57,1.86,9.44,9.44,0,0,0,.91,1.72,11.36,11.36,0,0,0,1.24,1.53,10,10,0,0,0,14.09,0,11.36,11.36,0,0,0,1.24-1.53,10.07,10.07,0,0,0,1.49-3.58,9.89,9.89,0,0,0,.19-1.94,9.77,9.77,0,0,0-.19-1.95A10.92,10.92,0,0,0,197,377.54Z",
];

const MOTION_DURATION = 0.25;
const ORB_SIZE = 96;
const INNER_RING_R = 56;
const OUTER_RING_R = 72;
const INNER_SIZE = INNER_RING_R * 2;
const OUTER_SIZE = OUTER_RING_R * 2;
const CONTAINER_SIZE = 160;

export type CommandRosetteProps = {
  isOpen: boolean;
  onClick: () => void;
  /** Scale down for header (e.g. 0.75) */
  scale?: number;
};

export function CommandRosette({ isOpen, onClick, scale = 1 }: CommandRosetteProps) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.15 : MOTION_DURATION;
  const pulse = isOpen && !reduceMotion;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: CONTAINER_SIZE * scale, height: CONTAINER_SIZE * scale }}
    >
      {/* Outer orbital ring (thin, subtle) */}
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute rounded-full border border-white/20"
          style={{
            width: OUTER_SIZE * scale,
            height: OUTER_SIZE * scale,
            borderWidth: 1,
          }}
          initial={false}
          animate={{
            opacity: isOpen ? 0.5 : 0.2,
            rotate: 360,
          }}
          transition={{
            opacity: { duration: MOTION_DURATION, ease: "easeOut" },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
          aria-hidden
        />
      )}
      {/* Inner orbital ring */}
      <motion.div
        className="pointer-events-none absolute rounded-full border border-white/25"
        style={{
          width: INNER_SIZE * scale,
          height: INNER_SIZE * scale,
          borderWidth: 1,
        }}
        initial={false}
        animate={{
          opacity: isOpen ? 0.6 : 0.25,
          borderColor: isOpen ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
        }}
        transition={{ duration, ease: "easeOut" }}
        aria-hidden
      />
      {/* Cardinal points: N, E, S, W (small lines at 0°, 90°, 180°, 270°) */}
      <div
        className="pointer-events-none absolute"
        style={{ width: OUTER_SIZE * scale, height: OUTER_SIZE * scale }}
        aria-hidden
      >
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute left-1/2 top-1/2 h-px w-2 origin-center rounded-full bg-white/40"
            style={{
              transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-${(OUTER_RING_R - 4) * scale}px)`,
            }}
          />
        ))}
      </div>
      {/* Orbiting dots (optional motion) */}
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute"
          style={{ width: INNER_SIZE * scale, height: INNER_SIZE * scale }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          aria-hidden
        >
          <span
            className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            style={{
              boxShadow: "0 0 6px rgba(255,255,255,0.8)",
              opacity: isOpen ? 1 : 0.5,
            }}
          />
          <span
            className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-white"
            style={{
              boxShadow: "0 0 6px rgba(255,255,255,0.8)",
              opacity: isOpen ? 1 : 0.5,
            }}
          />
        </motion.div>
      )}
      {/* Central orb (plasma-glow gradient + star) */}
      <motion.button
        type="button"
        onClick={onClick}
        aria-label="Engage Guidance Protocol"
        className={`relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--night-sky)] ${pulse ? "orb-pulse" : ""}`}
        style={{
          background: "var(--plasma-glow)",
          boxShadow: pulse ? undefined : "inset 0 0 32px rgba(255,255,255,0.12)",
        }}
        initial={false}
        animate={{
          scale: reduceMotion ? 1 : isOpen ? 1.05 : 1,
          opacity: 1,
        }}
        transition={{ duration, ease: "easeOut" }}
        whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
      >
        <span
          className="pointer-events-none absolute inset-[-6px] rounded-full border-2 border-white/20"
          style={{
            background: "linear-gradient(120deg, rgba(123,91,255,0.25) 0%, rgba(65,179,255,0.25) 100%)",
          }}
          aria-hidden
        />
        {!reduceMotion && (
          <span
            className="pointer-events-none absolute inset-[-16px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(123,91,255,0.35) 0%, rgba(65,179,255,0.2) 40%, transparent 70%)",
              filter: "blur(8px)",
            }}
            aria-hidden
          />
        )}
        <svg
          width="48"
          height="48"
          viewBox="0 0 512 520"
          fill="white"
          className="relative z-10 shrink-0"
          aria-hidden
        >
          {NORTH_STAR_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      </motion.button>
    </div>
  );
}
