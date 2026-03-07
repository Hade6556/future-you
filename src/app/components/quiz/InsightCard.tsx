"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { QuizScreen } from "../../data/quiz";

const MASCOT_MAP: Record<string, string> = {
  default: "/orb-face.png",
  thinking: "/orb-thinking.png",
  excited: "/orb-face.png",
  pointing: "/orb-pointing.png",
};

type Props = {
  screen: QuizScreen;
  onContinue: () => void;
};

export function InsightCard({ screen, onContinue }: Props) {
  const src = MASCOT_MAP[screen.mascotEmotion ?? "default"] ?? "/orb-face.png";

  return (
    <motion.div
      className="flex flex-col items-center px-2"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        className="relative h-[120px] w-[120px]"
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Image src={src} alt="Future Me" fill className="object-contain" />
      </motion.div>

      {screen.stat && (
        <p
          className="mt-6 text-center text-[72px] font-bold leading-none text-[#121212]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {screen.stat}
        </p>
      )}

      {screen.headline && (
        <h2
          className="mt-4 text-center text-[22px] font-semibold leading-tight text-[#121212]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {screen.headline}
        </h2>
      )}

      {screen.body && (
        <p className="mt-4 text-center text-[15px] leading-relaxed text-[#6A6A6A]">
          {screen.body}
        </p>
      )}

      <button
        onClick={onContinue}
        className="mt-10 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-[#121212] text-[17px] font-semibold text-white transition-transform active:scale-[0.97]"
      >
        Got it — continue
      </button>
    </motion.div>
  );
}
