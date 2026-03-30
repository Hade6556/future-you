"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOUR_CARDS = [
  {
    emoji: "🏠",
    title: "Today is your home base",
    body: "Every day starts here. Your AI coach gives you one task and tracks your streak. Check in daily to keep your momentum.",
    cta: null,
  },
  {
    emoji: "🗺️",
    title: "Your 90-day plan",
    body: 'Tap "My Plan" to see your full roadmap by phase — what you\'re doing, why, and what comes next.',
    cta: null,
  },
  {
    emoji: "➕",
    title: "Quick actions, anywhere",
    body: 'The + button lets you log a win, record a voice reflection, or adjust your goal — without leaving where you are.',
    cta: "Got it, let's go →",
  },
];

interface AppTourProps {
  onDismiss: () => void;
}

export function AppTour({ onDismiss }: AppTourProps) {
  const [card, setCard] = useState(0);
  const [direction, setDirection] = useState(1);

  function goTo(next: number) {
    setDirection(next > card ? 1 : -1);
    setCard(next);
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -50 && card < TOUR_CARDS.length - 1) goTo(card + 1);
    if (info.offset.x > 50 && card > 0) goTo(card - 1);
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="tour-backdrop"
        className="fixed inset-0 z-50"
        style={{ background: "rgba(6,9,18,0.70)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
      />

      {/* Bottom sheet */}
      <motion.div
        key="tour-sheet"
        className="fixed bottom-0 left-0 right-0 z-[60] mx-auto max-w-sm rounded-t-3xl px-6 pb-28 pt-6 shadow-2xl"
        style={{
          background: "rgba(15,32,64,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255,255,255,0.12)",
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div
          className="mx-auto mb-5 h-1 w-10 rounded-full"
          style={{ background: "rgba(255,255,255,0.20)" }}
        />

        {/* Card content */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          className="select-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={card}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                {TOUR_CARDS[card].emoji}
              </div>
              <div className="space-y-2">
                <p className="text-[19px] font-extrabold leading-snug" style={{ color: "rgba(235,242,255,0.95)" }}>
                  {TOUR_CARDS[card].title}
                </p>
                <p className="text-[14px] leading-relaxed" style={{ color: "rgba(120,155,195,0.80)" }}>
                  {TOUR_CARDS[card].body}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Dot indicators */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {TOUR_CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === card ? "20px" : "8px",
                background: i === card ? "#C8FF00" : "rgba(255,255,255,0.20)",
              }}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA / Next button */}
        <div className="mt-5">
          {TOUR_CARDS[card].cta ? (
            <button
              onClick={onDismiss}
              className="w-full rounded-2xl py-3.5 text-[15px] font-bold"
              style={{ background: "#C8FF00", color: "#060912" }}
            >
              {TOUR_CARDS[card].cta}
            </button>
          ) : (
            <button
              onClick={() => goTo(card + 1)}
              className="w-full rounded-2xl py-3.5 text-[15px] font-bold"
              style={{ background: "#C8FF00", color: "#060912" }}
            >
              Next →
            </button>
          )}
        </div>

        {/* Skip link */}
        {card < TOUR_CARDS.length - 1 && (
          <button
            onClick={onDismiss}
            className="mt-3 w-full text-center text-[12px]"
            style={{ color: "rgba(120,155,195,0.50)" }}
          >
            Skip
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
