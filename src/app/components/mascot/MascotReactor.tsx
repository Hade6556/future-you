"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export type MascotEmotion =
  | "default"
  | "thinking"
  | "excited"
  | "pointing"
  | "celebrating"
  | "encouraging";

const IMAGE_MAP: Record<MascotEmotion, string> = {
  default: "/orb-face.png",
  thinking: "/orb-thinking.png",
  excited: "/orb-face.png",
  pointing: "/orb-pointing.png",
  celebrating: "/orb-notebook.png",
  encouraging: "/orb-lantern.png",
};

import type { TargetAndTransition, Transition } from "framer-motion";

const ANIMATION_MAP: Record<MascotEmotion, TargetAndTransition> = {
  default: { scale: [1, 1.03, 1] },
  thinking: { rotate: [0, 0, 0] },
  excited: { scale: [1, 1.08, 1] },
  pointing: {},
  celebrating: { y: [0, -12, 0] },
  encouraging: { y: [0, -6, 0] },
};

const TRANSITION_MAP: Record<MascotEmotion, Transition> = {
  default: { repeat: Infinity, duration: 3, ease: "easeInOut" },
  thinking: { duration: 0.4 },
  excited: { repeat: Infinity, duration: 2.5 },
  pointing: { duration: 0 },
  celebrating: { repeat: Infinity, duration: 0.6, ease: "easeOut" },
  encouraging: { repeat: Infinity, duration: 3 },
};

type Props = {
  emotion: MascotEmotion;
  size?: number;
};

export function MascotReactor({ emotion, size = 180 }: Props) {
  const src = IMAGE_MAP[emotion] ?? IMAGE_MAP.default;

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={ANIMATION_MAP[emotion]}
      transition={TRANSITION_MAP[emotion]}
      initial={emotion === "thinking" ? { rotate: -5 } : undefined}
    >
      <Image src={src} alt="Future Me" fill className="object-contain" priority />
    </motion.div>
  );
}
