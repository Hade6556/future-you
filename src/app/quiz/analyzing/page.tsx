"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePlanStore } from "../../state/planStore";

const AMBITION_LABELS: Record<string, string> = {
  entrepreneur: "business goals",
  athlete: "fitness journey",
  weight_loss: "weight loss plan",
  creative: "creative path",
  student: "learning roadmap",
  wellness: "wellness plan",
};

export default function AnalyzingPage() {
  const router = useRouter();
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const userName = usePlanStore((s) => s.userName);
  const [step, setStep] = useState(0);

  const ambitionLabel = AMBITION_LABELS[ambitionType ?? "wellness"] ?? "goals";

  const lines = [
    `Mapping your ${ambitionLabel}...`,
    "Identifying your coaching style...",
    "Building your 90-day roadmap...",
    `Almost ready, ${userName || "friend"}...`,
  ];

  useEffect(() => {
    const intervals = [0, 1000, 2000, 3000];
    const timers = intervals.map((delay, i) =>
      setTimeout(() => setStep(i), delay),
    );
    const navTimer = setTimeout(() => router.push("/quiz/result"), 4200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(navTimer);
    };
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F8F6F1] px-6">
      <div className="flex flex-col items-center">
        <div className="relative h-[160px] w-[160px] animate-[mascot-float_2s_ease-in-out_infinite]">
          <Image
            src="/orb-thinking.png"
            alt="Analyzing"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="mt-8 h-[28px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-center text-[16px] font-medium text-[#121212]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {lines[step]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-8 h-[6px] w-[240px] overflow-hidden rounded-full bg-[#E0E0E0]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#6FCF97] to-[#2D9CDB]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
          />
        </div>

        <p className="mt-12 text-[11px] tracking-wide text-[#6A6A6A]">
          Powered by Future Me AI
        </p>
      </div>
    </div>
  );
}
