"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ACCENT as LIME, TEXT_HI, TEXT_MID, TEXT_LO, GLASS, GLASS_BORDER } from "@/app/theme";
import { usePremiumGuard } from "../hooks/usePremiumGuard";

type Dump = {
  id: string;
  timestamp: string;
  date: string | null;
  content: string;
  coach_response: string | null;
  sentiment: "positive" | "neutral" | "negative" | null;
  word_count: number;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function sentimentColor(s: string | null): string {
  if (s === "positive") return "rgba(94,205,161,0.60)";
  if (s === "negative") return "rgba(255,100,100,0.60)";
  return "rgba(130,155,195,0.45)";
}

function sentimentLabel(s: string | null): string {
  if (s === "positive") return "Positive";
  if (s === "negative") return "Tough";
  return "Neutral";
}

export default function JournalPage() {
  const guardRedirecting = usePremiumGuard();
  const router = useRouter();
  const [dumps, setDumps] = useState<Dump[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (guardRedirecting) return;
    fetch("/api/brain-dumps", { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) return;
        const data = await r.json();
        if (Array.isArray(data?.dumps)) setDumps(data.dumps);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [guardRedirecting]);

  if (guardRedirecting) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{ minHeight: "100dvh", padding: "60px 20px 32px", position: "relative" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: 28,
            color: TEXT_HI,
            margin: 0,
          }}
        >
          Journal
        </h1>
        <motion.button
          onClick={() => router.push("/journal/new")}
          whileTap={{ scale: 0.95 }}
          style={{
            background: LIME,
            color: "#060912",
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: 14,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            borderRadius: 10,
            padding: "10px 18px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill="#060912" />
            <path d="M19 11a7 7 0 0 1-14 0M12 19v3m-3 0h6" stroke="#060912" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          New Entry
        </motion.button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.08)",
              borderTopColor: LIME,
            }}
          />
        </div>
      )}

      {/* Empty state */}
      {!loading && dumps.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: GLASS,
            border: `1px solid ${GLASS_BORDER}`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: 16,
            padding: "40px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(94,205,161,0.08)",
              border: `1px solid rgba(94,205,161,0.15)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill={LIME} />
              <path d="M19 11a7 7 0 0 1-14 0M12 19v3m-3 0h6" stroke={LIME} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: 20,
              color: TEXT_HI,
              margin: "0 0 6px",
            }}
          >
            No entries yet
          </h3>
          <p
            style={{
              fontFamily: "var(--font-apercu), sans-serif",
              fontSize: 14,
              color: TEXT_LO,
              margin: "0 0 20px",
            }}
          >
            Tap the mic to record your first voice dump
          </p>
          <motion.button
            onClick={() => router.push("/journal/new")}
            whileTap={{ scale: 0.97 }}
            style={{
              background: LIME,
              color: "#060912",
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: 16,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: 12,
              padding: "14px 32px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(94,205,161,0.20)",
            }}
          >
            Start Recording
          </motion.button>
        </motion.div>
      )}

      {/* Entries list */}
      {!loading && dumps.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              color: TEXT_LO,
              margin: "0 0 4px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {dumps.length} {dumps.length === 1 ? "entry" : "entries"}
          </p>

          {dumps.map((dump, idx) => {
            const expanded = expandedId === dump.id;
            return (
              <motion.div
                key={dump.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <button
                  onClick={() => setExpandedId(expanded ? null : dump.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: GLASS,
                    border: `1px solid ${expanded ? "rgba(94,205,161,0.20)" : GLASS_BORDER}`,
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderRadius: 16,
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                >
                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontWeight: 600,
                        fontSize: 13,
                        color: TEXT_HI,
                      }}
                    >
                      {formatDate(dump.timestamp)}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {dump.sentiment && (
                        <span
                          style={{
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                            fontSize: 10,
                            color: sentimentColor(dump.sentiment),
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {sentimentLabel(dump.sentiment)}
                        </span>
                      )}
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: 10,
                          color: TEXT_LO,
                        }}
                      >
                        {dump.word_count}w
                      </span>
                      <motion.svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path d="M4 6l4 4 4-4" stroke={TEXT_LO} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </div>
                  </div>

                  {/* Preview */}
                  <p
                    style={{
                      fontFamily: "var(--font-apercu), sans-serif",
                      fontSize: 13,
                      color: TEXT_MID,
                      margin: 0,
                      lineHeight: 1.5,
                      overflow: expanded ? "visible" : "hidden",
                      display: expanded ? "block" : "-webkit-box",
                      WebkitLineClamp: expanded ? undefined : 2,
                      WebkitBoxOrient: expanded ? undefined : "vertical",
                    }}
                  >
                    {dump.content}
                  </p>

                  {/* Coach response (shown when expanded) */}
                  <AnimatePresence>
                    {expanded && dump.coach_response && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          style={{
                            marginTop: 12,
                            padding: "12px 14px",
                            background: "rgba(94,205,161,0.04)",
                            border: "1px solid rgba(94,205,161,0.12)",
                            borderRadius: 12,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${LIME}, rgba(94,205,161,0.6))`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                <path d="M12 3C7 3 3 7 3 12c0 2.2.8 4.2 2.1 5.7L4 21l3.3-1.1c1.5.9 3 1.1 4.7 1.1 5 0 9-4 9-9s-4-9-9-9z" fill="#060912" />
                              </svg>
                            </div>
                            <span
                              style={{
                                fontFamily: "var(--font-barlow-condensed), sans-serif",
                                fontWeight: 700,
                                fontStyle: "italic",
                                fontSize: 11,
                                color: LIME,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                              }}
                            >
                              Coach
                            </span>
                          </div>
                          <p
                            style={{
                              fontFamily: "var(--font-apercu), sans-serif",
                              fontSize: 13,
                              lineHeight: 1.5,
                              color: TEXT_HI,
                              margin: 0,
                            }}
                          >
                            {dump.coach_response}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
