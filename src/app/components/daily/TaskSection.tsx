"use client";

import type { GeneratedTask } from "../../types/pipeline";
import TaskCard from "./TaskCard";
import { ACCENT as LIME, TEXT_MID } from "@/app/theme";
const FONT_MONO = "var(--font-jetbrains-mono), monospace";

const PRIORITY_CONFIG: Record<string, { label: string; accent: string }> = {
  "must-do": { label: "Must-do", accent: LIME },
  "should-do": { label: "Should-do", accent: "#6B8AFF" },
  bonus: { label: "Bonus", accent: "rgba(255,255,255,0.35)" },
};

type Props = {
  priority: string;
  tasks: GeneratedTask[];
  onToggle: (taskId: string) => void;
  onDefer: (taskId: string) => void;
  onSwap: (taskId: string) => void;
};

export default function TaskSection({ priority, tasks, onToggle, onDefer, onSwap }: Props) {
  const activeTasks = tasks.filter((t) => !t.deferred);
  if (activeTasks.length === 0) return null;

  const config = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG["should-do"];
  const doneCount = activeTasks.filter((t) => t.completed).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: config.accent,
            }}
          />
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 13,
              fontWeight: 600,
              color: config.accent,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
            }}
          >
            {config.label}
          </span>
        </div>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 13,
            color: TEXT_MID,
          }}
        >
          {doneCount}/{activeTasks.length}
        </span>
      </div>

      {/* Task cards */}
      {activeTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onDefer={() => onDefer(task.id)}
          onSwap={() => onSwap(task.id)}
        />
      ))}
    </div>
  );
}
