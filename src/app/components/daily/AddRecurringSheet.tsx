"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LIME = "#C8FF00";
const NAVY = "#060912";
const TEXT_HI = "rgba(235,242,255,0.95)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const FONT_HEADING = "var(--font-barlow-condensed), sans-serif";
const FONT_BODY = "var(--font-apercu), sans-serif";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (label: string, estimatedMinutes: number, daysOfWeek: number[]) => void;
};

export default function AddRecurringSheet({ open, onClose, onAdd }: Props) {
  const [label, setLabel] = useState("");
  const [minutes, setMinutes] = useState("15");
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

  function toggleDay(d: number) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  function handleAdd() {
    if (!label.trim() || days.length === 0) return;
    onAdd(label.trim(), parseInt(minutes, 10) || 15, days);
    setLabel("");
    setMinutes("15");
    setDays([1, 2, 3, 4, 5, 6, 7]);
    onClose();
  }

  const canAdd = label.trim() && days.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="app-fixed-phone"
            style={{
              bottom: 0,
              zIndex: 50,
              background: "rgba(15,32,64,0.98)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: "24px 24px 0 0",
              padding: "20px 24px calc(96px + env(safe-area-inset-bottom, 0px))",
              boxShadow: "0 -12px 30px rgba(0,0,0,0.45)",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.14)", margin: "0 auto 14px" }} />

            <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 900, fontStyle: "italic", fontSize: 20, color: TEXT_HI, margin: 0 }}>
              Add recurring task
            </h3>

            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="What should you do every day?"
              autoFocus
              style={{
                width: "100%",
                marginTop: 14,
                padding: "14px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14,
                fontFamily: FONT_BODY,
                fontSize: 15,
                color: TEXT_HI,
                outline: "none",
                boxSizing: "border-box" as const,
              }}
            />

            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_MID }}>Estimated:</span>
              <select
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                style={{
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  fontFamily: FONT_BODY,
                  fontSize: 13,
                  color: TEXT_HI,
                  outline: "none",
                }}
              >
                <option value="5">5 min</option>
                <option value="10">10 min</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">1 hour</option>
              </select>
            </div>

            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: TEXT_MID, marginTop: 14, marginBottom: 8 }}>
              Which days?
            </p>
            <div style={{ display: "flex", gap: 6 }}>
              {DAY_LABELS.map((dayLabel, i) => {
                const dayNum = i + 1;
                const active = days.includes(dayNum);
                return (
                  <button
                    key={dayLabel}
                    type="button"
                    onClick={() => toggleDay(dayNum)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      background: active ? "rgba(200,255,0,0.12)" : "rgba(255,255,255,0.04)",
                      border: active ? "1.5px solid " + LIME : "1.5px solid rgba(255,255,255,0.08)",
                      borderRadius: 10,
                      cursor: "pointer",
                      fontFamily: FONT_BODY,
                      fontSize: 13,
                      fontWeight: 600,
                      color: active ? LIME : TEXT_MID,
                      textAlign: "center" as const,
                    }}
                  >
                    {dayLabel}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!canAdd}
              style={{
                width: "100%",
                marginTop: 16,
                background: canAdd ? LIME : "rgba(200,255,0,0.25)",
                color: NAVY,
                border: "none",
                borderRadius: 999,
                padding: "14px 0",
                fontFamily: FONT_HEADING,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
                cursor: canAdd ? "pointer" : "default",
                boxShadow: canAdd ? "0 4px 16px rgba(200,255,0,0.25)" : "none",
              }}
            >
              Add recurring task
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
