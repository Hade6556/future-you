"use client";

import { motion } from "framer-motion";

/** Left = Laser path (option 0), Right = Shepherd path (options 1, 2) */
type Props = {
  selectedIndex: number | null;
};

export function ArchetypeTease({ selectedIndex }: Props) {
  const leftGlow = selectedIndex === 0;
  const rightGlow = selectedIndex === 1 || selectedIndex === 2;

  return (
    <div className="flex items-center justify-center gap-6 py-2" aria-hidden>
      <motion.div
        className={`relative h-12 w-12 rounded-full transition-all duration-300 ${
          leftGlow
            ? "bg-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background quiz-tease-glow"
            : "bg-border/60"
        }`}
        animate={{ scale: leftGlow ? 1.05 : 1 }}
      >
        <svg
          className="absolute inset-0 m-auto h-6 w-6 text-foreground/40"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2L4 6v6l8 4 8-4V6l-8-4zm0 2.18l5.5 2.75v5.14L12 14.68l-5.5-2.61V6.93L12 4.18z" />
        </svg>
      </motion.div>
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        or
      </span>
      <motion.div
        className={`relative h-12 w-12 rounded-full transition-all duration-300 ${
          rightGlow
            ? "bg-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background quiz-tease-glow"
            : "bg-border/60"
        }`}
        animate={{ scale: rightGlow ? 1.05 : 1 }}
      >
        <svg
          className="absolute inset-0 m-auto h-6 w-6 text-foreground/40"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </motion.div>
    </div>
  );
}
