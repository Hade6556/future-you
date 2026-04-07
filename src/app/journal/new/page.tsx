"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import ActionLoader from "../../components/ActionLoader";
import AmbitionMapOrbs from "../../components/AmbitionMapOrbs";
import CoachResponseCard from "../../components/CoachResponseCard";
import { usePlanStore } from "../../state/planStore";
import type { AmbitionCategory } from "../../state/planStore";

type Mood = "Calm" | "Anxious" | "Energized" | "Sad" | "Focused";
type Sentiment = "positive" | "neutral" | "negative";
type PageState = "form" | "processing" | "done";

const MOODS: { label: Mood; color: string; sentiment: Sentiment }[] = [
  { label: "Calm",      color: "#4CAF7D", sentiment: "neutral"  },
  { label: "Anxious",   color: "#A28FFF", sentiment: "negative" },
  { label: "Energized", color: "#C8FF00", sentiment: "positive" },
  { label: "Sad",       color: "rgba(120,155,195,0.55)", sentiment: "negative" },
  { label: "Focused",   color: "#F5A623", sentiment: "positive" },
];

const LIME = "#C8FF00";
const NAVY = "#060912";
const TEXT_HI = "rgba(235,242,255,0.95)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const TEXT_LO = "rgba(120,155,195,0.40)";

const FONT_HEADING: React.CSSProperties = {
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 900,
  fontStyle: "italic",
};
const FONT_BODY: React.CSSProperties = {
  fontFamily: "var(--font-apercu), sans-serif",
};

export default function NewEntryPage() {
  const router = useRouter();

  // Page state machine
  const [pageState, setPageState] = useState<PageState>("form");
  const [coachMessage, setCoachMessage] = useState<string | null>(null);
  const [coachActionItem, setCoachActionItem] = useState<string | null>(null);
  const [mapUpdated, setMapUpdated] = useState(false);

  // Form state
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [content, setContent] = useState("");

  // Zustand selectors
  const recordJournalEntry = usePlanStore((s) => s.recordJournalEntry);
  const incrementStreak = usePlanStore((s) => s.incrementStreak);
  const ambitionCategories = usePlanStore((s) => s.ambitionCategories);
  const setAmbitionCategories = usePlanStore((s) => s.setAmbitionCategories);
  const setLastReflection = usePlanStore((s) => s.setLastReflection);
  const dogArchetype = usePlanStore((s) => s.dogArchetype);
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const streak = usePlanStore((s) => s.streak);
  const userName = usePlanStore((s) => s.userName);
  const lastReflection = usePlanStore((s) => s.lastReflection);

  const selectedMoodData = MOODS.find((m) => m.label === selectedMood);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = content.trim();
    if (!text) return;

    setPageState("processing");
    setLastReflection(text);

    // Step 1: analyze + coach in parallel
    const [analyzeResult, coachResult] = await Promise.allSettled([
      fetch("/api/analyze-dump", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
        credentials: "include",
      }).then((r) => r.json() as Promise<{ categories: Array<{ label: string; pct: number }> }>),
      fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode: "reflect",
          context: { archetype: dogArchetype, ambitionType, streak, userName, lastReflection },
        }),
        credentials: "include",
      }).then((r) => r.json() as Promise<{ message: string; actionItem?: string | null; sentiment?: string }>),
    ]);

    // Process analyze result
    if (analyzeResult.status === "fulfilled" && analyzeResult.value.categories?.length) {
      setAmbitionCategories(
        analyzeResult.value.categories.map((c): AmbitionCategory => ({
          label: c.label,
          shortLabel: c.label.split(" ")[0],
          pct: c.pct,
          prevPct: ambitionCategories.find((x) => x.label === c.label)?.pct ?? c.pct,
        }))
      );
      setMapUpdated(true);
    } else {
      setMapUpdated(false);
    }

    // Process coach result
    let coachMsg = "Reflection saved. Coach is unavailable right now.";
    let coachAction: string | null = null;
    let sentiment: Sentiment = selectedMoodData?.sentiment ?? "neutral";
    if (coachResult.status === "fulfilled") {
      coachMsg = coachResult.value.message ?? coachMsg;
      coachAction = coachResult.value.actionItem ?? null;
      if (coachResult.value.sentiment) {
        sentiment = coachResult.value.sentiment as Sentiment;
      }
    }

    // Step 2: save to brain-dumps with coach response
    try {
      await fetch("/api/brain-dumps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, coach_response: coachMsg, sentiment }),
        credentials: "include",
      });
    } catch { /* non-blocking */ }

    // Step 3: update scoring + streak
    recordJournalEntry();
    incrementStreak();

    setCoachMessage(coachMsg);
    setCoachActionItem(coachAction);
    setPageState("done");
  }

  function resetForm() {
    setPageState("form");
    setContent("");
    setSelectedMood(null);
    setCoachMessage(null);
    setCoachActionItem(null);
    setMapUpdated(false);
  }

  // ─── Done state: dark navy with ambition map + coach card ───
  if (pageState === "done") {
    return (
      <div style={{ minHeight: "100dvh", background: NAVY, position: "relative", overflow: "hidden" }}>
        {/* Background mesh */}
        <div aria-hidden style={{
          position: "fixed", inset: 0, zIndex: 0,
          background: "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(50,90,220,0.38) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(15,40,110,0.40) 0%, transparent 55%), linear-gradient(170deg, #0d1a3a 0%, #060912 55%)",
          pointerEvents: "none",
        }} />
        {/* Grid overlay */}
        <div aria-hidden style={{
          position: "fixed", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px", pointerEvents: "none",
        }} />

        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", flexDirection: "column", gap: 20,
          width: "100%", maxWidth: 448, margin: "0 auto", minWidth: 0,
          padding: "max(3.5rem, calc(env(safe-area-inset-top, 0px) + 2.75rem)) 24px 160px",
        }}>
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 style={{
              ...FONT_HEADING,
              fontSize: 38, lineHeight: 0.95, letterSpacing: "-0.03em",
              color: TEXT_HI, margin: 0,
            }}>
              Entry saved
            </h1>
            <p style={{
              ...FONT_BODY,
              fontSize: 15, lineHeight: 1.6, color: TEXT_MID,
              marginTop: 8, marginBottom: 0,
            }}>
              Here&apos;s what we found in your reflection.
            </p>
          </motion.header>

          {/* Ambition map */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
          >
            <AmbitionMapOrbs categories={ambitionCategories} />
          </motion.div>

          {/* Map status */}
          <p style={{ ...FONT_BODY, textAlign: "center", fontSize: 12, color: TEXT_LO, margin: 0 }}>
            {mapUpdated
              ? "↑ Ambition map updated"
              : "Map couldn't be updated — try a longer entry"}
          </p>

          {/* Coach response */}
          {coachMessage && (
            <CoachResponseCard message={coachMessage} actionItem={coachActionItem} />
          )}

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => router.push("/journal")}
              style={{
                ...FONT_BODY,
                width: "100%", borderRadius: 999, border: "none", cursor: "pointer",
                background: LIME, color: NAVY,
                padding: "14px 24px", fontSize: 15, fontWeight: 700,
                boxShadow: "0 4px 24px rgba(200,255,0,0.25)",
              }}
            >
              View Journal
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{
                ...FONT_BODY,
                background: "transparent", border: "none", cursor: "pointer",
                padding: "8px 0", fontSize: 14, fontWeight: 500, color: TEXT_MID,
                textDecoration: "underline", textUnderlineOffset: 2,
              }}
            >
              Write another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Form state (+ processing overlay) ───
  const canSubmit = content.trim().length > 0 && pageState !== "processing";

  return (
    <>
    <ActionLoader visible={pageState === "processing"} />
    <div style={{ minHeight: "100dvh", background: NAVY, position: "relative", overflow: "hidden" }}>
      {/* Background mesh */}
      <div aria-hidden style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(50,90,220,0.38) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(15,40,110,0.40) 0%, transparent 55%), linear-gradient(170deg, #0d1a3a 0%, #060912 55%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "48px 48px", pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", gap: 20,
        width: "100%", maxWidth: 448, margin: "0 auto", minWidth: 0,
        padding: "max(3.5rem, calc(env(safe-area-inset-top, 0px) + 2.75rem)) 24px 24px",
      }}>

        {/* Back nav */}
        <Link
          href="/journal"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4, width: "fit-content",
            ...FONT_BODY, fontSize: 13, fontWeight: 600, color: TEXT_MID,
            textDecoration: "none", padding: "4px 0",
          }}
        >
          <ChevronLeftIcon style={{ width: 16, height: 16 }} />
          Back
        </Link>

        {/* Header */}
        <header>
          <h1 style={{
            ...FONT_HEADING,
            fontSize: 38, lineHeight: 0.95, letterSpacing: "-0.03em",
            color: TEXT_HI, margin: 0,
          }}>
            New entry
          </h1>
          <p style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase",
            color: TEXT_LO, margin: "8px 0 0",
          }}>
            Get it out. No filter needed.
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Mood selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
              color: TEXT_LO,
            }}>
              How are you feeling?
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {MOODS.map(({ label, color }) => {
                const active = selectedMood === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedMood(active ? null : label)}
                    style={{
                      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                      padding: "12px 0", borderRadius: 14, cursor: "pointer",
                      background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                      border: active ? `1.5px solid ${color}` : "1.5px solid rgba(255,255,255,0.08)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{
                      width: 20, height: 20, borderRadius: "50%", display: "block",
                      background: color,
                      boxShadow: active ? `0 0 10px ${color}80` : "none",
                    }} />
                    <span style={{
                      ...FONT_BODY, fontSize: 13, fontWeight: 600,
                      color: active ? TEXT_HI : TEXT_MID,
                    }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea */}
          <div style={{
            position: "relative",
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 20, padding: 20,
            overflow: "hidden",
          }}>
            <div aria-hidden style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
            }} />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind…"
              rows={6}
              autoFocus
              style={{
                width: "100%", resize: "none", background: "transparent",
                border: "none", outline: "none",
                ...FONT_BODY, fontSize: 15, lineHeight: 1.7,
                color: TEXT_HI,
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              width: "100%", padding: "16px 0", borderRadius: 999, border: "none",
              cursor: canSubmit ? "pointer" : "default",
              background: canSubmit ? LIME : "rgba(200,255,0,0.20)",
              color: NAVY,
              ...FONT_HEADING, fontSize: 16, letterSpacing: "0.04em",
              boxShadow: canSubmit ? "0 4px 24px rgba(200,255,0,0.25)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            {pageState === "processing" ? "Saving…" : "Save Entry"}
          </button>

        </form>
      </div>
    </div>
    </>
  );
}
