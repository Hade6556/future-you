"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ARCHETYPES } from "../data/archetypes";
import { usePlanStore } from "../state/planStore";

const AMBITION_LABELS: Record<string, string> = {
  entrepreneur: "business",
  athlete: "fitness",
  weight_loss: "weight loss",
  creative: "creative",
  student: "learning",
  wellness: "wellness",
};

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = usePlanStore((s) => s.completeOnboarding);
  const archetype = usePlanStore((s) => s.dogArchetype);
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const userName = usePlanStore((s) => s.userName);
  const [screen, setScreen] = useState(0);

  const arch = archetype ? ARCHETYPES.find((a) => a.id === archetype) : null;
  const ambitionLabel = AMBITION_LABELS[ambitionType ?? "wellness"] ?? "goals";

  const handleNext = () => {
    if (screen < 2) {
      setScreen(screen + 1);
    } else {
      completeOnboarding();
      router.push("/");
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    router.push("/");
  };

  const screens = [
    {
      image: "/orb-face.png",
      title: `Hi ${userName || "there"}, I'm Future Me`,
      body: arch
        ? `Based on your answers, you're ${arch.name}. That means ${arch.ritualStyle}.`
        : "I'm your personal AI life coach, built to help you reach any goal.",
      badge: arch ? `${arch.emoji} ${arch.name}` : null,
    },
    {
      image: "/orb-notebook.png",
      title: "Here's what your first 7 days look like",
      body: null,
      steps: [
        `🔥 Day 1: Set your daily intention (5 min)`,
        `💪 Day 2–3: First ${ambitionLabel} actions`,
        `✨ Day 4–7: Build your streak`,
      ],
    },
    {
      image: "/orb-face.png",
      title: "Just 10 minutes a day. That's all.",
      body: "Every day, Future Me walks you through these 3 steps. It takes 10 minutes and it compounds.",
      dots: [
        { label: "Align", color: "#F2994A" },
        { label: "Act", color: "#6FCF97" },
        { label: "Reflect", color: "#2D9CDB" },
      ],
    },
  ];

  const s = screens[screen];

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#F8F6F1] px-6 pb-10 pt-[max(48px,env(safe-area-inset-top,16px))]">
      {/* Skip */}
      <button
        onClick={handleSkip}
        className="absolute right-6 top-[max(16px,env(safe-area-inset-top,16px))] text-[14px] font-medium text-[#6A6A6A]"
      >
        Skip
      </button>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex w-full flex-col items-center"
          >
            {/* Mascot */}
            <motion.div
              className="relative h-[200px] w-[200px]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Image src={s.image} alt="Future Me" fill className="object-contain" />
            </motion.div>

            {/* Title */}
            <h1
              className="mt-6 text-center text-[28px] font-bold leading-tight text-[#121212]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {s.title}
            </h1>

            {/* Badge */}
            {"badge" in s && s.badge && (
              <span className="mt-3 rounded-full bg-[#121212] px-4 py-1.5 text-[13px] font-medium text-white">
                {s.badge}
              </span>
            )}

            {/* Body */}
            {s.body && (
              <p className="mt-4 text-center text-[15px] leading-relaxed text-[#6A6A6A]">
                {s.body}
              </p>
            )}

            {/* Steps (screen 2) */}
            {"steps" in s && s.steps && (
              <div className="mt-6 flex w-full flex-col gap-3">
                {s.steps.map((step, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-[#E0E0E0] bg-white px-5 py-4 text-[15px] text-[#121212]"
                  >
                    {step}
                  </div>
                ))}
              </div>
            )}

            {/* Dots (screen 3) */}
            {"dots" in s && s.dots && (
              <div className="mt-6 flex items-center gap-8">
                {s.dots.map((dot) => (
                  <div key={dot.label} className="flex flex-col items-center gap-2">
                    <div
                      className="h-10 w-10 rounded-full"
                      style={{ backgroundColor: dot.color }}
                    />
                    <span className="text-[14px] font-medium text-[#121212]">{dot.label}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom area */}
      <div className="mx-auto w-full max-w-md">
        {/* Page dots */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === screen ? "bg-[#121212]" : "bg-[#E0E0E0]"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex h-[56px] w-full items-center justify-center rounded-[28px] bg-[#121212] text-[17px] font-semibold text-white transition-transform active:scale-[0.97]"
        >
          {screen === 2 ? "Let's start" : "Next"}
        </button>
      </div>
    </div>
  );
}
