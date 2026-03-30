"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { GeneratedTask } from "../../types/pipeline";

const LIME = "#C8FF00";
const NAVY = "#060912";
const TEXT_HI = "rgba(235,242,255,0.95)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const FONT_HEADING = "var(--font-barlow-condensed), sans-serif";
const FONT_BODY = "var(--font-apercu), sans-serif";
const FONT_MONO = "var(--font-jetbrains-mono), monospace";

type Props = {
  tasks: GeneratedTask[];
  journaledToday: boolean;
  tomorrowStepTitle: string | null;
};

export default function EveningWrapup({ tasks, journaledToday, tomorrowStepTitle }: Props) {
  const activeTasks = tasks.filter((t) => !t.deferred);
  const doneCount = activeTasks.filter((t) => t.completed).length;
  const totalCount = activeTasks.length;
  const mustDoTasks = activeTasks.filter((t) => t.priority === "must-do");
  const mustDoDone = mustDoTasks.filter((t) => t.completed).length;
  const allMustDoDone = mustDoTasks.length > 0 && mustDoDone >= mustDoTasks.length;

  const hour = new Date().getHours();
  const showWrapup = hour >= 18 || allMustDoDone;

  if (!showWrapup) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(200,255,0,0.04)",
        border: "1px solid rgba(200,255,0,0.14)",
        borderRadius: 20,
        padding: "20px 16px",
      }}
    >
      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: 11,
          fontWeight: 500,
          color: LIME,
          letterSpacing: "0.06em",
          textTransform: "uppercase" as const,
          margin: 0,
        }}
      >
        {allMustDoDone ? "All must-do tasks complete" : "Evening wrap-up"}
      </p>

      <p
        style={{
          fontFamily: FONT_HEADING,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 22,
          color: TEXT_HI,
          margin: "6px 0 0",
        }}
      >
        {doneCount}/{totalCount} tasks done
      </p>

      {allMustDoDone && (
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 14,
            color: TEXT_MID,
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          You crushed the needle-movers today. That&apos;s what builds momentum.
        </p>
      )}

      {/* Tomorrow preview */}
      {tomorrowStepTitle && (
        <div
          style={{
            marginTop: 14,
            padding: "10px 14px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              color: TEXT_MID,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              margin: 0,
            }}
          >
            Tomorrow&apos;s focus
          </p>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 14,
              color: TEXT_HI,
              marginTop: 4,
              fontWeight: 500,
            }}
          >
            {tomorrowStepTitle}
          </p>
        </div>
      )}

      {/* Journal CTA */}
      {!journaledToday && (
        <Link
          href="/journal/new"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 14,
            padding: "14px 20px",
            background: LIME,
            color: NAVY,
            border: "none",
            borderRadius: 14,
            fontFamily: FONT_HEADING,
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Journal about today
        </Link>
      )}
    </motion.div>
  );
}
