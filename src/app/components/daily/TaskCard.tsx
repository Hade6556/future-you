"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ClockIcon, ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import type { GeneratedTask } from "../../types/pipeline";
import { ACCENT, ACCENT as LIME, TEXT_HI, TEXT_MID } from "@/app/theme";
const FONT_BODY = "var(--font-apercu), sans-serif";
const FONT_MONO = "var(--font-jetbrains-mono), monospace";

const CATEGORY_COLORS: Record<string, string> = {
  plan: "#6B8AFF",
  habit: ACCENT,
  wellbeing: "#FF8AD8",
  custom: "rgba(255,255,255,0.5)",
};

type Props = {
  task: GeneratedTask;
  onToggle: () => void;
  onDefer: () => void;
  onSwap: () => void;
};

export default function TaskCard({ task, onToggle, onDefer, onSwap }: Props) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[task.category] ?? CATEGORY_COLORS.custom;

  if (task.deferred) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: task.completed ? 0.6 : 1, y: 0 }}
      style={{
        background: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Main row */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          width: "100%",
          padding: "14px 14px",
          textAlign: "left" as const,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* Checkbox */}
        <div style={{ flexShrink: 0 }}>
          {task.completed ? (
            <motion.div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: LIME,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </motion.div>
          ) : (
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.20)",
                boxSizing: "border-box" as const,
              }}
            />
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: 15,
              color: TEXT_HI,
              textDecoration: task.completed ? "line-through" : "none",
              display: "block",
            }}
          >
            {task.label}
          </span>
        </div>

        {/* Right side: time + category */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              padding: "3px 8px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 999,
              fontSize: 13,
              fontFamily: FONT_MONO,
              fontWeight: 500,
              color: TEXT_MID,
              whiteSpace: "nowrap" as const,
            }}
          >
            <ClockIcon style={{ width: 10, height: 10 }} aria-hidden />
            {task.estimatedMinutes}m
          </span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: color,
              flexShrink: 0,
            }}
          />
        </div>
      </button>

      {/* Quick actions — always visible for incomplete tasks */}
      {!task.completed && (
        <div style={{ display: "flex", gap: 6, padding: "0 14px 8px", marginTop: -4 }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSwap();
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 10px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: FONT_BODY,
              fontSize: 11,
              fontWeight: 500,
              color: TEXT_MID,
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <ArrowPathIcon style={{ width: 11, height: 11 }} aria-hidden />
            Swap
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDefer();
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 10px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: FONT_BODY,
              fontSize: 11,
              fontWeight: 500,
              color: TEXT_MID,
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <ArrowRightIcon style={{ width: 11, height: 11 }} aria-hidden />
            Tomorrow
          </button>
        </div>
      )}

      {/* Expandable description */}
      {task.description && (
        <div style={{ padding: "0 14px" }}>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: FONT_MONO,
              fontSize: 13,
              color: TEXT_MID,
              padding: "0 0 10px",
              letterSpacing: "0.04em",
              textTransform: "uppercase" as const,
            }}
          >
            {expanded ? "Hide details" : "Details"}
          </button>

          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden", paddingBottom: 12 }}
            >
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 13,
                  color: TEXT_MID,
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {task.description}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
