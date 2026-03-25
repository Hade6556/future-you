"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { ARCHETYPES } from "../data/archetypes";
import { MascotReactor, type MascotEmotion } from "./mascot/MascotReactor";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

type MessageState = {
  emotion: MascotEmotion;
  contextLine: string;
};

function deriveMessageState(params: {
  todayStatus: string;
  streak: number;
  planReady: boolean;
  archetypeTagline: string | null;
}): MessageState {
  const { todayStatus, streak, planReady, archetypeTagline } = params;

  if (todayStatus !== "pending") {
    return {
      emotion: "celebrating",
      contextLine:
        streak >= 1
          ? `Day ${streak} done. You're on a roll.`
          : "Today's task is done. Well played.",
    };
  }

  if (streak >= 3) {
    return {
      emotion: "encouraging",
      contextLine: `${streak} days straight. Keep that momentum going.`,
    };
  }

  if (planReady) {
    return {
      emotion: "default",
      contextLine: archetypeTagline ?? "Your next step is waiting.",
    };
  }

  return {
    emotion: "pointing",
    contextLine: "Let's build your 90-day plan — it takes 2 minutes.",
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = {
  dayBadge?: React.ReactNode;
};

export function MentorAvatarGreeting({ dayBadge }: Props) {
  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => setGreeting(getGreeting()), []);

  const userName    = usePlanStore((s) => s.userName);
  const todayStatus = usePlanStore((s) => s.todayStatus);
  const streak      = usePlanStore((s) => s.streak);
  const planReady   = usePlanStore((s) => s.planReady);
  const archetype   = usePlanStore((s) => s.dogArchetype);

  const archetypeTagline = useMemo(() => {
    if (!archetype) return null;
    return ARCHETYPES.find((a) => a.id === archetype)?.tagline ?? null;
  }, [archetype]);

  const { emotion, contextLine } = useMemo(
    () => deriveMessageState({ todayStatus, streak, planReady, archetypeTagline }),
    [todayStatus, streak, planReady, archetypeTagline],
  );

  return (
    <motion.div
      className="flex items-center gap-3 min-w-0"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {/* Avatar */}
      <div className="shrink-0">
        <MascotReactor emotion={emotion} size={80} />
      </div>

      {/* Speech bubble */}
      <div className="min-w-0 flex-1 rounded-2xl bg-secondary px-4 py-3 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <h1 className="type-h1 text-primary leading-tight truncate">
            {greeting}, {userName || "friend"}!
          </h1>
          {dayBadge && <div className="shrink-0">{dayBadge}</div>}
        </div>
        <p className="text-[13px] text-muted-foreground leading-snug">
          {contextLine}
        </p>
      </div>
    </motion.div>
  );
}
