"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionInstance = any;

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import type { AmbitionCategory } from "../state/planStore";
import AmbitionMapOrbs from "../components/AmbitionMapOrbs";
import CoachResponseCard from "../components/CoachResponseCard";

const LIME = "#C8FF00";
const NAVY = "#060912";
const TEXT_HI = "rgba(235,242,255,0.95)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const TEXT_LO = "rgba(120,155,195,0.40)";
const GLASS = "rgba(255,255,255,0.07)";
const GLASS_BORDER = "rgba(255,255,255,0.14)";

const FONT_HEADING: React.CSSProperties = {
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 900,
  fontStyle: "italic",
};
const FONT_BODY: React.CSSProperties = {
  fontFamily: "var(--font-apercu), sans-serif",
};
const FONT_MONO: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
};

type RecordingState = "idle" | "recording" | "processing" | "done";

export default function StructurePage() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [lang, setLang] = useState<"en-US" | "lt-LT">("en-US");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [coachMessage, setCoachMessage] = useState<string | null>(null);
  const [coachActionItem, setCoachActionItem] = useState<string | null>(null);
  const [mapUpdated, setMapUpdated] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const accumulatedRef = useRef("");
  const manualStopRef = useRef(false);
  const hadRecognitionErrorRef = useRef(false);

  const [speechSupported, setSpeechSupported] = useState(false);
  useEffect(() => {
    setSpeechSupported(
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window
    );
  }, []);

  const setLastReflection = usePlanStore((s) => s.setLastReflection);
  const dogArchetype = usePlanStore((s) => s.dogArchetype);
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const streak = usePlanStore((s) => s.streak);
  const userName = usePlanStore((s) => s.userName);
  const lastReflection = usePlanStore((s) => s.lastReflection);
  const ambitionCategories = usePlanStore((s) => s.ambitionCategories);
  const setAmbitionCategories = usePlanStore((s) => s.setAmbitionCategories);
  const incrementStreak = usePlanStore((s) => s.incrementStreak);

  function startListening() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) return;
    accumulatedRef.current = "";
    manualStopRef.current = false;
    hadRecognitionErrorRef.current = false;
    setRecordingError(null);

    const recognition = new SR() as SpeechRecognitionInstance;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognitionRef.current = recognition;

    recognition.onstart = () => setRecordingState("recording");

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          accumulatedRef.current += t + " ";
          setFinalTranscript(accumulatedRef.current.trim());
        } else {
          interim += t;
        }
      }
      setInterimTranscript(interim);
    };

    recognition.onend = () => {
      setInterimTranscript("");
      recognitionRef.current = null;
      if (hadRecognitionErrorRef.current) {
        hadRecognitionErrorRef.current = false;
        setRecordingState("idle");
        return;
      }
      if (manualStopRef.current) {
        manualStopRef.current = false;
        const transcript = accumulatedRef.current.trim();
        accumulatedRef.current = "";
        if (transcript) {
          void processTranscript(transcript);
        } else {
          setRecordingError("Nothing was recorded. Tap Retry to try again.");
        }
      } else {
        setRecordingError("Recording stopped unexpectedly. Tap Retry to try again.");
      }
    };

    recognition.onerror = (e: any) => {
      hadRecognitionErrorRef.current = true;
      setRecordingState("idle");
      if (e.error === "aborted") return;
      if (e.error === "no-speech") {
        setRecordingError("No speech detected. Tap Retry to try again.");
        return;
      }
      if (e.error === "not-allowed") {
        setRecordingError("Microphone access denied. Check your browser permissions.");
        return;
      }
      if (e.error === "audio-capture") {
        setRecordingError("No microphone found. Connect a mic and try again.");
        return;
      }
      if (e.error === "service-not-allowed") {
        setRecordingError("Speech service is blocked in this browser/session. Try Chrome or use text input.");
        return;
      }
      if (e.error === "language-not-supported") {
        setRecordingError("Selected language is not supported for speech recognition.");
        return;
      }
      if (e.error === "network") {
        setRecordingError("Network issue while processing speech. Check connection and retry.");
        return;
      }
      setRecordingError("Recording failed. Tap Retry to try again.");
    };

    try {
      recognition.start();
    } catch {
      setRecordingState("idle");
      setRecordingError("Could not start recording. Refresh and check microphone permissions.");
    }
  }

  function stopListening() {
    manualStopRef.current = true;
    recognitionRef.current?.stop();
  }

  async function processTranscript(rawTranscript: string) {
    setRecordingState("processing");
    setFinalTranscript(rawTranscript);
    setRecordingError(null);

    let cleaned = rawTranscript;
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: rawTranscript, lang }),
        credentials: "include",
      });
      const data = await res.json() as { cleaned: string };
      cleaned = data.cleaned || rawTranscript;
    } catch {
      // keep raw if rewrite fails
    }
    setFinalTranscript(cleaned);
    setLastReflection(cleaned);

    const [analyzeResult, coachResult] = await Promise.allSettled([
      fetch("/api/analyze-dump", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: cleaned }),
        credentials: "include",
      }).then((r) => r.json() as Promise<{ categories: Array<{ label: string; pct: number }> }>),
      fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleaned,
          mode: "reflect",
          context: { archetype: dogArchetype, ambitionType, streak, userName, lastReflection },
        }),
        credentials: "include",
      }).then((r) => r.json() as Promise<{ message: string; actionItem?: string | null; sentiment?: string }>),
    ]);

    console.log("[analyze-dump] status:", analyzeResult.status, "categories:", analyzeResult.status === "fulfilled" ? analyzeResult.value.categories : analyzeResult);
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

    let coachMsg = "Reflection saved. Coach is unavailable right now.";
    let coachAction: string | null = null;
    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    if (coachResult.status === "fulfilled") {
      coachMsg = coachResult.value.message ?? coachMsg;
      coachAction = coachResult.value.actionItem ?? null;
      sentiment = (coachResult.value.sentiment as typeof sentiment) ?? "neutral";
    }

    try {
      await fetch("/api/brain-dumps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: cleaned, coach_response: coachMsg, sentiment }),
        credentials: "include",
      });
    } catch { /* non-blocking */ }

    incrementStreak();

    setCoachMessage(coachMsg);
    setCoachActionItem(coachAction);
    setRecordingState("done");
  }

  function resetRecording() {
    setRecordingState("idle");
    setFinalTranscript("");
    setInterimTranscript("");
    setCoachMessage(null);
    setCoachActionItem(null);
    setRecordingError(null);
    setMapUpdated(false);
  }

  const cardStyle: React.CSSProperties = {
    background: GLASS,
    border: "1px solid " + GLASS_BORDER,
    borderRadius: 20,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
  };

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
        <header>
          <h1 style={{
            ...FONT_HEADING,
            fontSize: 46, lineHeight: 0.92, letterSpacing: "-0.03em",
            color: TEXT_HI, margin: 0,
          }}>
            Your ambition map
          </h1>
          <p style={{
            ...FONT_BODY,
            fontSize: 15, lineHeight: 1.6, color: TEXT_MID,
            marginTop: 8, marginBottom: 0,
          }}>
            We adjust focus every week based on your inputs.
          </p>
          <p style={{
            ...FONT_MONO,
            fontSize: 12, color: TEXT_LO,
            marginTop: 4, marginBottom: 0,
          }}>
            Updated today
          </p>
        </header>

        {/* Ambition map orbs + legend */}
        <AmbitionMapOrbs categories={ambitionCategories} />

        {/* Voice reflection section */}
        <div style={{
          ...cardStyle,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          padding: "20px 16px", marginBottom: 24,
          boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
        }}>
          {speechSupported ? (
            <>
              {/* Language toggle */}
              <div style={{
                display: "flex", borderRadius: 999,
                background: GLASS, border: "1px solid " + GLASS_BORDER,
                padding: 2, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              }}>
                {(["en-US", "lt-LT"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    disabled={recordingState === "processing"}
                    style={{
                      ...FONT_BODY,
                      border: "none", cursor: "pointer",
                      borderRadius: 999, padding: "4px 12px",
                      fontSize: 12, fontWeight: 500,
                      background: lang === l ? LIME : "transparent",
                      color: lang === l ? NAVY : TEXT_MID,
                      opacity: recordingState === "processing" ? 0.4 : 1,
                      transition: "background 0.15s, color 0.15s",
                    }}
                  >
                    {l === "en-US" ? "EN" : "LT"}
                  </button>
                ))}
              </div>

              {/* Mic button */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  disabled={recordingState === "processing"}
                  onClick={() => {
                    if (recordingState === "recording") stopListening();
                    else if (recordingState !== "processing") startListening();
                  }}
                  className={recordingState === "recording" ? "animate-mic-pulse" : undefined}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 78, height: 78, minWidth: 78, borderRadius: "50%",
                    border: "none", cursor: recordingState === "processing" ? "not-allowed" : "pointer",
                    opacity: recordingState === "processing" ? 0.5 : 1,
                    background: recordingState === "recording"
                      ? "#FF5555"
                      : recordingState === "processing"
                      ? "rgba(255,255,255,0.12)"
                      : LIME,
                    boxShadow: recordingState === "recording"
                      ? "0 0 0 4px rgba(255,68,68,0.25)"
                      : `0 4px 24px rgba(200,255,0,0.35)`,
                    color: recordingState === "recording" ? "#fff" : NAVY,
                    transition: "transform 0.15s, background 0.15s",
                  }}
                  aria-label={
                    recordingState === "recording" ? "Stop recording" :
                    recordingState === "processing" ? "Processing…" :
                    "Start recording"
                  }
                >
                  {recordingState === "processing" ? (
                    <svg style={{ width: 32, height: 32, animation: "spin 1s linear infinite", color: "#fff" }} fill="none" viewBox="0 0 24 24" aria-hidden>
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <MicrophoneIcon style={{ width: 32, height: 32 }} aria-hidden />
                  )}
                </button>
                <span style={{
                  ...FONT_HEADING,
                  fontSize: 14, fontWeight: 700, color: TEXT_HI,
                }}>
                  {recordingState === "recording" ? "Tap to stop" :
                   recordingState === "processing" ? "Saving reflection…" :
                   recordingState === "done" ? "Reflection saved" :
                   "Tap to reflect"}
                </span>
              </div>

              {/* Prompt chips */}
              {recordingState === "idle" && (
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }} aria-label="Quick reflection prompts">
                  {["What went well?", "What's blocking me?", "Rebalance focus"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => startListening()}
                      style={{
                        ...FONT_BODY,
                        background: GLASS,
                        border: "1px solid " + GLASS_BORDER,
                        color: TEXT_MID,
                        borderRadius: 999,
                        padding: "6px 12px",
                        fontSize: 12, fontWeight: 500,
                        cursor: "pointer",
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Error overlay */}
              <AnimatePresence>
                {recordingError && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 12,
                      borderRadius: 12, padding: "12px 16px",
                      border: "1px solid rgba(255,68,68,0.4)",
                      background: "rgba(255,68,68,0.1)",
                    }}
                  >
                    <p style={{ ...FONT_BODY, flex: 1, fontSize: 13, fontWeight: 500, color: "#FF6B6B", margin: 0 }}>
                      {recordingError}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setRecordingError(null);
                        setRecordingState("idle");
                      }}
                      style={{
                        ...FONT_BODY,
                        flexShrink: 0, borderRadius: 999,
                        border: "1px solid rgba(255,68,68,0.4)",
                        background: "transparent",
                        padding: "4px 12px", fontSize: 12, fontWeight: 600,
                        color: "#FF6B6B", cursor: "pointer",
                      }}
                    >
                      Retry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Transcript + coach response */}
              {(recordingState === "recording" || recordingState === "processing" || recordingState === "done") && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}
                >
                  {(interimTranscript || finalTranscript) && (
                    <div style={{
                      borderRadius: 12, padding: "12px 16px",
                      background: GLASS, border: "1px solid " + GLASS_BORDER,
                    }}>
                      <p style={{ ...FONT_BODY, fontSize: 13, fontWeight: 500, color: TEXT_MID, margin: "0 0 4px" }}>
                        Your reflection
                      </p>
                      <p style={{ ...FONT_BODY, fontSize: 15, lineHeight: 1.6, color: TEXT_HI, margin: 0 }}>
                        {finalTranscript || interimTranscript}
                        {recordingState === "recording" && !finalTranscript && (
                          <span style={{
                            display: "inline-block", width: 1, height: "1em",
                            background: LIME, marginLeft: 2,
                            verticalAlign: "text-bottom",
                            animation: "pulse 1s ease-in-out infinite",
                          }} />
                        )}
                      </p>
                    </div>
                  )}

                  {recordingState === "done" && coachMessage && (
                    <CoachResponseCard message={coachMessage} actionItem={coachActionItem} />
                  )}

                  {recordingState === "done" && (
                    <p style={{ ...FONT_BODY, textAlign: "center", fontSize: 12, color: TEXT_LO, margin: 0 }}>
                      {mapUpdated
                        ? "↑ Ambition map updated"
                        : "Map couldn't be updated — try a longer reflection"}
                    </p>
                  )}

                  {recordingState === "done" && (
                    <button
                      type="button"
                      onClick={resetRecording}
                      style={{
                        ...FONT_BODY,
                        alignSelf: "center", padding: "8px 0",
                        background: "transparent", border: "none", cursor: "pointer",
                        fontSize: 14, fontWeight: 500, color: TEXT_MID,
                        textDecoration: "underline", textUnderlineOffset: 2,
                      }}
                    >
                      Record again
                    </button>
                  )}
                </motion.div>
              )}
            </>
          ) : (
            /* Fallback for browsers without Web Speech API */
            <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
              <p style={{ ...FONT_BODY, textAlign: "center", fontSize: 12, color: TEXT_LO, margin: 0 }}>
                Voice recording isn&apos;t supported in this browser. Type your reflection below.
              </p>
              <textarea
                placeholder="What's on your mind?"
                rows={3}
                value={finalTranscript}
                onChange={(e) => setFinalTranscript(e.target.value)}
                style={{
                  ...FONT_BODY,
                  width: "100%", resize: "none", borderRadius: 12,
                  background: GLASS, border: "1px solid " + GLASS_BORDER,
                  padding: "12px 16px", fontSize: 15, color: TEXT_HI,
                  outline: "none", boxSizing: "border-box",
                }}
              />
              {recordingState === "done" && coachMessage && (
                <CoachResponseCard message={coachMessage} />
              )}
              <button
                type="button"
                disabled={!finalTranscript.trim() || recordingState === "processing"}
                onClick={() => void processTranscript(finalTranscript.trim())}
                style={{
                  ...FONT_BODY,
                  borderRadius: 999, border: "none", cursor: "pointer",
                  background: LIME, color: NAVY,
                  padding: "12px 24px", fontSize: 14, fontWeight: 600,
                  opacity: (!finalTranscript.trim() || recordingState === "processing") ? 0.4 : 1,
                }}
              >
                {recordingState === "processing" ? "Saving…" : recordingState === "done" ? "Saved ✓" : "Submit reflection"}
              </button>
              {recordingState === "done" && (
                <button
                  type="button"
                  onClick={resetRecording}
                  style={{
                    ...FONT_BODY,
                    alignSelf: "center", background: "transparent", border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 500, color: TEXT_MID,
                    textDecoration: "underline", textUnderlineOffset: 2,
                  }}
                >
                  Write another
                </button>
              )}
            </div>
          )}
        </div>

        {/* Link to journal */}
        <Link
          href="/journal"
          style={{
            ...FONT_BODY,
            alignSelf: "center", fontSize: 12, fontWeight: 500, color: TEXT_MID,
            textDecoration: "underline", textUnderlineOffset: 2,
          }}
        >
          View brain dumps →
        </Link>
        <div aria-hidden style={{ height: 80 }} />
      </div>
    </div>
  );
}
