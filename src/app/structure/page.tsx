"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import type { AmbitionCategory } from "../state/planStore";

const ORB_PALETTE = [
  { gradient: "from-red-300 to-destructive",        glow: "var(--orb-glow-destructive)", dot: "bg-destructive" },
  { gradient: "from-green-200 to-accent",            glow: "var(--orb-glow-success)",     dot: "bg-accent" },
  { gradient: "from-accent-secondary/50 to-primary", glow: "var(--orb-glow-primary)",     dot: "bg-primary" },
  { gradient: "from-amber-200 to-amber-500",         glow: "rgba(245,158,11,0.4)",         dot: "bg-amber-500" },
  { gradient: "from-sky-200 to-sky-500",             glow: "rgba(14,165,233,0.4)",         dot: "bg-sky-500" },
  { gradient: "from-pink-200 to-pink-500",           glow: "rgba(236,72,153,0.4)",         dot: "bg-pink-500" },
  { gradient: "from-violet-200 to-violet-500",       glow: "rgba(139,92,246,0.4)",         dot: "bg-violet-500" },
  { gradient: "from-orange-200 to-orange-500",       glow: "rgba(249,115,22,0.4)",         dot: "bg-orange-500" },
];

function diameterForPct(pct: number, maxPct: number) {
  return Math.round((pct / Math.max(maxPct, 1)) * 90);
}

function getOrbPosition(i: number, total: number) {
  const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
  return {
    left: `${50 + 32 * Math.cos(angle)}%`,
    top: `${50 + 28 * Math.sin(angle)}%`,
  };
}

type RecordingState = "idle" | "recording" | "processing" | "done";

export default function StructurePage() {

  // Recording state machine
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [lang, setLang] = useState<"en-US" | "lt-LT">("en-US");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [coachMessage, setCoachMessage] = useState<string | null>(null);
  const [coachActionItem, setCoachActionItem] = useState<string | null>(null);
  const [mapUpdated, setMapUpdated] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const accumulatedRef = useRef("");
  const manualStopRef = useRef(false);

  const [speechSupported, setSpeechSupported] = useState(false);
  useEffect(() => {
    setSpeechSupported(
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window
    );
  }, []);

  // Zustand selectors
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
    setRecordingError(null);

    const recognition = new SR() as SpeechRecognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognitionRef.current = recognition;

    recognition.onstart = () => setRecordingState("recording");

    recognition.onresult = (event: SpeechRecognitionEvent) => {
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
      if (manualStopRef.current) {
        // User tapped stop — all onresult events have now fired, safe to read
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

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "aborted") return;
      if (e.error === "no-speech") {
        setRecordingError("No speech detected. Tap Retry to try again.");
        return;
      }
      if (e.error === "not-allowed") {
        setRecordingError("Microphone access denied. Check your browser permissions.");
        return;
      }
      setRecordingError("Recording failed. Tap Retry to try again.");
    };

    recognition.start();
  }

  function stopListening() {
    manualStopRef.current = true;
    recognitionRef.current?.stop();
    // Don't read accumulatedRef here — the browser fires one more onresult
    // to finalize pending interim speech after stop(). We read it in onend
    // which is guaranteed to fire after all onresult events.
  }

  async function processTranscript(rawTranscript: string) {
    setRecordingState("processing");
    setFinalTranscript(rawTranscript);
    setRecordingError(null);

    // Step 1: Rewrite (sequential — both parallel calls need the cleaned text)
    let cleaned = rawTranscript;
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: rawTranscript, lang }),
      });
      const data = await res.json() as { cleaned: string };
      cleaned = data.cleaned || rawTranscript;
    } catch {
      // keep raw if rewrite fails
    }
    setFinalTranscript(cleaned);
    setLastReflection(cleaned);

    // Step 2: analyze + coach in parallel
    const [analyzeResult, coachResult] = await Promise.allSettled([
      fetch("/api/analyze-dump", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: cleaned }),
      }).then((r) => r.json() as Promise<{ categories: Array<{ label: string; pct: number }> }>),
      fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleaned,
          mode: "reflect",
          context: { archetype: dogArchetype, ambitionType, streak, userName, lastReflection },
        }),
      }).then((r) => r.json() as Promise<{ message: string; actionItem?: string | null; sentiment?: string }>),
    ]);

    // Apply categories if analyze succeeded
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

    // Extract coach result
    let coachMsg = "Reflection saved. Coach is unavailable right now.";
    let coachAction: string | null = null;
    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    if (coachResult.status === "fulfilled") {
      coachMsg = coachResult.value.message ?? coachMsg;
      coachAction = coachResult.value.actionItem ?? null;
      sentiment = (coachResult.value.sentiment as typeof sentiment) ?? "neutral";
    }

    // Step 3: Save locally
    try {
      await fetch("/api/brain-dumps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: cleaned, coach_response: coachMsg, sentiment }),
      });
    } catch { /* non-blocking */ }

    // Step 4: Increment streak
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

  return (
    <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
      <div className="section-gap mx-auto flex w-full max-w-md flex-col min-w-0">
        {/* Header */}
        <header>
          <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-tight text-foreground">
            Your ambition map
          </h1>
          <p className="mt-2 text-[15px] font-normal leading-relaxed text-muted-foreground">
            We adjust focus every week based on your inputs.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Updated today</p>
        </header>

        {/* Hero card */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card px-6 py-8" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="relative mx-auto flex aspect-square max-h-[280px] w-full max-w-full items-center justify-center">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
              aria-hidden
            />
            {ambitionCategories.length > 0 ? (() => {
              const maxPct = Math.max(...ambitionCategories.map((c) => c.pct));
              return ambitionCategories.map((cat, i) => {
                const d = diameterForPct(cat.pct, maxPct);
                const pos = getOrbPosition(i, ambitionCategories.length);
                const palette = ORB_PALETTE[i % ORB_PALETTE.length];
                const delta = cat.pct - cat.prevPct;
                const deltaLabel = delta > 0 ? `+${delta}%` : delta < 0 ? `${delta}%` : "—";
                return (
                  <div
                    key={cat.label}
                    className="absolute flex flex-col items-center justify-center"
                    style={{ width: d, height: d, transform: "translate(-50%, -50%)", ...pos }}
                  >
                    <div
                      className={`relative h-full w-full rounded-full bg-gradient-to-br ${palette.gradient} shadow-lg`}
                      style={{ boxShadow: `0 0 40px ${palette.glow}` }}
                    />
                    <span className="mt-1.5 text-center text-xs font-medium text-text-primary drop-shadow-sm">
                      {cat.shortLabel} {cat.pct}%
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-accent-cool">
                      {deltaLabel} vs last
                    </span>
                  </div>
                );
              });
            })() : (
              <p className="text-xs text-text-secondary text-center px-4">
                Record a brain dump to populate your map
              </p>
            )}
          </div>
        </div>

        {/* Legend */}
        {ambitionCategories.length > 0 && (
          <div className="block-gap flex flex-col">
            {ambitionCategories.map((cat, i) => (
              <div key={cat.label} className="flex items-baseline gap-4">
                <div className={`h-5 w-5 shrink-0 rounded-full ${ORB_PALETTE[i % ORB_PALETTE.length].dot}`} />
                <span className="text-[15px] text-text-primary">
                  {cat.label} <strong className="font-semibold">{cat.pct}%</strong>
                </span>
              </div>
            ))}
          </div>
        )}


        {/* Voice reflection section */}
        <div className="block-gap flex flex-col items-center gap-4">
          {speechSupported ? (
            <>
              {/* Language toggle — always visible */}
              <div className="flex rounded-full border border-border bg-card p-0.5 text-xs font-medium">
                {(["en-US", "lt-LT"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    disabled={recordingState === "processing"}
                    className={`rounded-full px-3 py-1 transition-colors disabled:opacity-40 ${
                      lang === l
                        ? "bg-primary text-primary-foreground"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {l === "en-US" ? "EN" : "LT"}
                  </button>
                ))}
              </div>

              {/* Mic button */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  disabled={recordingState === "processing"}
                  onClick={() => {
                    if (recordingState === "recording") stopListening();
                    else if (recordingState !== "processing") startListening();
                  }}
                  className={`flex h-[88px] w-[88px] min-w-[88px] items-center justify-center rounded-full shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    recordingState === "recording"
                      ? "animate-mic-pulse"
                      : recordingState === "processing"
                      ? "bg-muted"
                      : "hover:scale-105 active:scale-95"
                  }`}
                  style={{
                    background: recordingState === "recording" ? "var(--destructive)" : recordingState === "processing" ? undefined : "var(--accent-primary)",
                    boxShadow: recordingState === "recording" ? "0 0 0 4px rgba(232,98,42,0.25)" : "0 4px 16px rgba(232,98,42,0.35)",
                  }}
                  aria-label={
                    recordingState === "recording" ? "Stop recording" :
                    recordingState === "processing" ? "Processing…" :
                    "Start recording"
                  }
                >
                  {recordingState === "processing" ? (
                    <svg className="h-8 w-8 animate-spin text-white" fill="none" viewBox="0 0 24 24" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <MicrophoneIcon className="h-10 w-10 text-white" aria-hidden />
                  )}
                </button>
                <span className="text-sm font-medium text-text-primary">
                  {recordingState === "recording" ? "Tap to stop" :
                   recordingState === "processing" ? "Saving reflection…" :
                   recordingState === "done" ? "Reflection saved" :
                   "Tap to reflect"}
                </span>
              </div>

              {/* Prompt chips — only when idle */}
              {recordingState === "idle" && (
                <div className="flex flex-wrap justify-center gap-2" aria-label="Quick reflection prompts">
                  {["What went well?", "What's blocking me?", "Rebalance focus"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => startListening()}
                      className="touch-target rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/40 hover:bg-secondary/50 active:scale-[0.97]"
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
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3"
                  >
                    <p className="flex-1 text-[13px] font-medium text-destructive">{recordingError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setRecordingError(null);
                        setRecordingState("idle");
                      }}
                      className="touch-target shrink-0 rounded-full border border-destructive/40 px-3 py-1 text-xs font-semibold text-destructive"
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
                  className="flex w-full flex-col gap-3"
                >
                  {(interimTranscript || finalTranscript) && (
                    <div className="rounded-xl border border-border bg-card px-4 py-3">
                      <p className="mb-1 text-[13px] font-medium text-text-secondary">Your reflection</p>
                      <p className="text-[15px] leading-relaxed text-text-primary">
                        {finalTranscript || interimTranscript}
                        {recordingState === "recording" && !finalTranscript && (
                          <span className="animate-pulse ml-0.5 inline-block h-[1em] w-px bg-primary align-text-bottom" />
                        )}
                      </p>
                    </div>
                  )}

                  {recordingState === "done" && coachMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.25 }}
                      className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3"
                    >
                      <div className="relative h-[40px] w-[32px] shrink-0">
                        <Image src="/orb-thinking.png" alt="" fill className="object-contain object-bottom" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-[13px] font-medium text-text-secondary">Future Me</p>
                        <p className="text-[14px] leading-relaxed text-text-primary">{coachMessage}</p>
                        {coachActionItem && (
                          <p className="mt-2 border-t border-border pt-2 text-[12px] text-accent-cool">
                            → {coachActionItem}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {recordingState === "done" && (
                    <p className="text-center text-xs text-muted-foreground">
                      {mapUpdated
                        ? "↑ Ambition map updated"
                        : "Map couldn't be updated — try a longer reflection"}
                    </p>
                  )}

                  {recordingState === "done" && (
                    <button
                      type="button"
                      onClick={resetRecording}
                      className="touch-target self-center py-2 text-sm font-medium text-text-secondary underline underline-offset-2"
                    >
                      Record again
                    </button>
                  )}
                </motion.div>
              )}
            </>
          ) : (
            /* Fallback for browsers without Web Speech API */
            <div className="flex w-full flex-col gap-3">
              <p className="text-center text-xs text-muted-foreground">
                Voice recording isn&apos;t supported in this browser. Type your reflection below.
              </p>
              <textarea
                placeholder="What's on your mind?"
                className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-[15px] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                rows={3}
                value={finalTranscript}
                onChange={(e) => setFinalTranscript(e.target.value)}
              />
              {recordingState === "done" && coachMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3">
                  <div className="relative h-[40px] w-[32px] shrink-0">
                    <Image src="/orb-thinking.png" alt="" fill className="object-contain object-bottom" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[13px] font-medium text-text-secondary">Future Me</p>
                    <p className="text-[14px] leading-relaxed text-text-primary">{coachMessage}</p>
                  </div>
                </div>
              )}
              <button
                type="button"
                disabled={!finalTranscript.trim() || recordingState === "processing"}
                onClick={() => void processTranscript(finalTranscript.trim())}
                className="touch-target rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                {recordingState === "processing" ? "Saving…" : recordingState === "done" ? "Saved ✓" : "Submit reflection"}
              </button>
              {recordingState === "done" && (
                <button type="button" onClick={resetRecording} className="self-center text-xs font-medium text-text-secondary underline underline-offset-2">
                  Write another
                </button>
              )}
            </div>
          )}
        </div>

        {/* Link to journal */}
        <Link
          href="/journal"
          className="self-center text-xs font-medium text-text-secondary underline underline-offset-2"
        >
          View brain dumps →
        </Link>
      </div>
    </div>
  );
}
