"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "@/app/state/planStore";
import { ACCENT as LIME, TEXT_HI, TEXT_MID, TEXT_LO, GLASS, GLASS_BORDER, NAVY, accentRgba } from "@/app/theme";

type Category = { label: string; pct: number };
type CoachReply = { message: string; actionItem?: string | null };
type PageState = "idle" | "processing" | "done";

export default function JournalNewPage() {
  const router = useRouter();
  const userName = usePlanStore((s) => s.userName);
  const dogArchetype = usePlanStore((s) => s.dogArchetype);
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const streak = usePlanStore((s) => s.streak);

  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [pageState, setPageState] = useState<PageState>("idle");
  const [categories, setCategories] = useState<Category[]>([]);
  const [coachReply, setCoachReply] = useState<CoachReply | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const hadErrorRef = useRef(false);

  const startRecording = useCallback(() => {
    setError(null);
    const SR =
      (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (!SR) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";
    recognitionRef.current = recognition;
    hadErrorRef.current = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      hadErrorRef.current = true;
      const messages: Record<string, string> = {
        "no-speech": "No speech detected — try again.",
        "not-allowed": "Microphone access denied. Check your browser settings.",
        "audio-capture": "No microphone found.",
        "network": "Network error — check your connection.",
      };
      setError(messages[event.error] || `Recording error: ${event.error}`);
      setRecording(false);
    };

    recognition.onend = () => {
      if (!hadErrorRef.current && recording) {
        setRecording(false);
      }
    };

    try {
      recognition.start();
      setRecording(true);
    } catch {
      setError("Could not start recording.");
    }
  }, [recording]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setRecording(false);
  }, []);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (trimmed.length < 10) {
      setError("Write or say a bit more before saving.");
      return;
    }

    setPageState("processing");
    setError(null);

    try {
      const rewriteRes = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: trimmed, lang: navigator.language || "en" }),
        credentials: "include",
      });
      const rewriteData = rewriteRes.ok ? await rewriteRes.json() : null;
      const cleaned = rewriteData?.cleaned || trimmed;

      const [analyzeRes, coachRes] = await Promise.all([
        fetch("/api/analyze-dump", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: cleaned }),
          credentials: "include",
        }),
        fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: cleaned,
            context: {
              archetype: dogArchetype,
              ambitionType,
              streak,
              userName: userName || "",
            },
            mode: "reflect",
          }),
          credentials: "include",
        }),
      ]);

      const analyzeData = analyzeRes.ok ? await analyzeRes.json() : null;
      if (analyzeData?.categories) {
        setCategories(analyzeData.categories);
      }

      const coachData = coachRes.ok ? await coachRes.json().catch(() => null) : null;
      const coachMsg = coachData?.message || null;
      if (coachMsg) {
        setCoachReply({ message: coachMsg, actionItem: coachData.actionItem ?? null });
      }

      // Save entry with coach response included
      await fetch("/api/brain-dumps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: cleaned,
          coach_response: coachMsg,
          sentiment: coachData?.sentiment ?? analyzeData?.categories?.[0]?.label ? "neutral" : null,
        }),
        credentials: "include",
      }).catch(() => {});

      setPageState("done");
    } catch {
      setError("Something went wrong. Try again.");
      setPageState("idle");
    }
  };

  const ready = text.trim().length >= 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        minHeight: "100dvh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "0 20px env(safe-area-inset-bottom, 20px)",
      }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "max(56px, env(safe-area-inset-top, 56px))",
          paddingBottom: 8,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: TEXT_MID,
            fontFamily: "var(--font-apercu), sans-serif",
            fontSize: 15,
            padding: "8px 0",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ verticalAlign: "middle", marginRight: 4 }}>
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <div style={{ width: 60 }} />
      </div>

      <AnimatePresence mode="wait">
        {/* ── Input state ──────────────────────────────────────── */}
        {pageState === "idle" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            {/* Title area */}
            <div style={{ textAlign: "center", marginBottom: 28, marginTop: 8 }}>
              <h1
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 800,
                  fontStyle: "italic",
                  fontSize: 32,
                  color: TEXT_HI,
                  margin: "0 0 6px",
                  letterSpacing: "-0.01em",
                }}
              >
                Voice Dump
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 14,
                  color: TEXT_LO,
                  margin: 0,
                }}
              >
                {recording ? "Listening — tap the mic to stop" : "Speak your mind or type it out"}
              </p>
            </div>

            {/* Mic button with animated rings */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, position: "relative" }}>
              {recording && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.8], opacity: [0.25, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      border: `2px solid ${LIME}`,
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                  <motion.div
                    animate={{ scale: [1, 2.2], opacity: [0.15, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                    style={{
                      position: "absolute",
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      border: `1px solid ${LIME}`,
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </>
              )}
              <motion.button
                onClick={recording ? stopRecording : startRecording}
                whileTap={{ scale: 0.92 }}
                animate={recording ? { scale: [1, 1.06, 1] } : {}}
                transition={recording ? { repeat: Infinity, duration: 1.5 } : {}}
                style={{
                  position: "relative",
                  zIndex: 2,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: recording
                    ? "rgba(255,60,60,0.85)"
                    : `linear-gradient(135deg, ${LIME} 0%, rgba(94,205,161,0.75) 100%)`,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: recording
                    ? "0 0 40px rgba(255,60,60,0.35), 0 0 80px rgba(255,60,60,0.15)"
                    : "0 4px 24px rgba(94,205,161,0.30), 0 8px 48px rgba(94,205,161,0.12)",
                }}
              >
                {recording ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="6" width="12" height="12" rx="2" fill="white" />
                  </svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill={NAVY} />
                    <path d="M19 11a7 7 0 0 1-14 0M12 19v3m-3 0h6" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </motion.button>
            </div>

            {/* Textarea in glass card */}
            <div
              style={{
                background: GLASS,
                border: `1px solid ${GLASS_BORDER}`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderRadius: 16,
                padding: 2,
                marginBottom: 16,
              }}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind? Speak or type freely…"
                rows={6}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderRadius: 14,
                  padding: 16,
                  color: TEXT_HI,
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 15,
                  lineHeight: 1.6,
                  resize: "none",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Word count */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12, paddingRight: 4 }}>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 11,
                  color: ready ? LIME : TEXT_LO,
                  transition: "color 0.2s",
                }}
              >
                {text.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontSize: 13,
                  color: "#ff6b6b",
                  margin: "0 0 12px",
                  textAlign: "center",
                  background: "rgba(255,60,60,0.08)",
                  border: "1px solid rgba(255,60,60,0.15)",
                  borderRadius: 10,
                  padding: "10px 16px",
                }}
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              onClick={handleSubmit}
              whileTap={ready ? { scale: 0.97 } : {}}
              style={{
                width: "100%",
                background: ready ? LIME : "rgba(94,205,161,0.15)",
                color: ready ? NAVY : accentRgba(0.35),
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontStyle: "italic",
                fontSize: 18,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderRadius: 14,
                padding: "16px 28px",
                border: "none",
                cursor: ready ? "pointer" : "default",
                boxShadow: ready ? "0 8px 32px rgba(94,205,161,0.20)" : "none",
                transition: "all 0.25s ease",
              }}
            >
              Save Reflection
            </motion.button>
          </motion.div>
        )}

        {/* ── Processing state ─────────────────────────────────── */}
        {pageState === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            {/* Pulsing orb */}
            <div style={{ position: "relative", width: 64, height: 64 }}>
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.15, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  inset: -12,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, rgba(94,205,161,0.25) 0%, transparent 70%)`,
                }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: "3px solid rgba(255,255,255,0.06)",
                  borderTopColor: LIME,
                  borderRightColor: "rgba(94,205,161,0.3)",
                }}
              />
            </div>
            <p
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontStyle: "italic",
                fontSize: 18,
                color: TEXT_MID,
              }}
            >
              Analyzing your thoughts…
            </p>
          </motion.div>
        )}

        {/* ── Done state ───────────────────────────────────────── */}
        {pageState === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, paddingTop: 16 }}
          >
            {/* Success header */}
            <div style={{ textAlign: "center" }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              >
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <circle cx="26" cy="26" r="26" fill={LIME} />
                  <motion.path
                    d="M16 26l7 7 13-13"
                    stroke={NAVY}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  />
                </svg>
              </motion.div>
              <h2
                style={{
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 800,
                  fontStyle: "italic",
                  fontSize: 26,
                  color: TEXT_HI,
                  margin: "16px 0 4px",
                }}
              >
                Reflection Saved
              </h2>
              <p style={{ fontFamily: "var(--font-apercu), sans-serif", fontSize: 14, color: TEXT_MID, margin: 0 }}>
                Here&apos;s what was on your mind
              </p>
            </div>

            {/* Category breakdown */}
            {categories.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {categories.map((cat, idx) => (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.08 }}
                    style={{
                      background: GLASS,
                      border: `1px solid ${GLASS_BORDER}`,
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      borderRadius: 14,
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-apercu), sans-serif",
                          fontWeight: 600,
                          fontSize: 14,
                          color: TEXT_HI,
                          margin: "0 0 8px",
                        }}
                      >
                        {cat.label}
                      </p>
                      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.pct}%` }}
                          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.4 + idx * 0.08 }}
                          style={{
                            height: "100%",
                            background: `linear-gradient(90deg, ${LIME}, rgba(94,205,161,0.6))`,
                            borderRadius: 2,
                          }}
                        />
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 13,
                        fontWeight: 600,
                        color: LIME,
                        minWidth: 40,
                        textAlign: "right",
                      }}
                    >
                      {cat.pct}%
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Coach response */}
            {coachReply && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{
                  background: "rgba(94,205,161,0.05)",
                  border: `1px solid rgba(94,205,161,0.15)`,
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderRadius: 16,
                  padding: "16px 18px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${LIME}, rgba(94,205,161,0.6))`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3C7 3 3 7 3 12c0 2.2.8 4.2 2.1 5.7L4 21l3.3-1.1c1.5.9 3 1.1 4.7 1.1 5 0 9-4 9-9s-4-9-9-9z" fill={NAVY} />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontWeight: 700,
                      fontStyle: "italic",
                      fontSize: 14,
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
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: TEXT_HI,
                    margin: 0,
                  }}
                >
                  {coachReply.message}
                </p>
                {coachReply.actionItem && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "10px 12px",
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: LIME,
                        margin: "0 0 4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Action item
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontSize: 13,
                        color: TEXT_MID,
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {coachReply.actionItem}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
              <motion.button
                onClick={() => router.push("/")}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%",
                  background: LIME,
                  color: NAVY,
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontSize: 18,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  borderRadius: 14,
                  padding: "16px 28px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(94,205,161,0.20)",
                }}
              >
                Done
              </motion.button>
              <button
                onClick={() => router.push("/journal")}
                style={{
                  width: "100%",
                  background: "transparent",
                  color: TEXT_MID,
                  fontFamily: "var(--font-apercu), sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  borderRadius: 14,
                  padding: "12px 28px",
                  border: `1px solid ${GLASS_BORDER}`,
                  cursor: "pointer",
                }}
              >
                View past entries
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
