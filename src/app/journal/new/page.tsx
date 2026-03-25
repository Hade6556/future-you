"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import ActionLoader from "../../components/ActionLoader";

type Mood = "Calm" | "Anxious" | "Energized" | "Sad" | "Focused";
type Sentiment = "positive" | "neutral" | "negative";

const MOODS: { label: Mood; color: string; sentiment: Sentiment }[] = [
  { label: "Calm",      color: "#9BB068", sentiment: "neutral"  },
  { label: "Anxious",   color: "#A28FFF", sentiment: "negative" },
  { label: "Energized", color: "#7B6BA8", sentiment: "positive" },
  { label: "Sad",       color: "#BDA193", sentiment: "negative" },
  { label: "Focused",   color: "#FFCE5C", sentiment: "positive" },
];

export default function NewEntryPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedMoodData = MOODS.find((m) => m.label === selectedMood);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/brain-dumps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          sentiment: selectedMoodData?.sentiment ?? null,
        }),
      });
      router.push("/journal");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
    <ActionLoader visible={saving} />
    <div
      className="content-padding relative flex min-h-dvh flex-col pb-16 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]"
      style={{ background: "var(--canvas-base)" }}
    >
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 min-w-0">

        {/* Back nav */}
        <Link
          href="/journal"
          className="flex w-fit items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold transition-colors hover:bg-muted"
          style={{ color: "var(--text-secondary)" }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back
        </Link>

        {/* Header */}
        <header>
          <h1 className="text-[28px] font-extrabold leading-[1.1] tracking-tight text-foreground">
            New Entry
          </h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
            Get it out. No filter needed.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Mood selector */}
          <div className="flex flex-col gap-2">
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              How are you feeling?
            </span>
            <div className="flex gap-2">
              {MOODS.map(({ label, color }) => {
                const active = selectedMood === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedMood(active ? null : label)}
                    className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-3 transition-all"
                    style={{
                      background: active ? color : `${color}28`,
                      outline: active ? `2px solid ${color}` : "none",
                      outlineOffset: "2px",
                    }}
                  >
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{ background: color }}
                    />
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: active ? "#1F160F" : "var(--text-secondary)" }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea */}
          <div
            className="rounded-3xl border p-4"
            style={{
              background: "var(--canvas-elevated)",
              borderColor: "var(--card-stroke)",
              boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
            }}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind…"
              rows={8}
              className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
              autoFocus
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || !content.trim()}
            className="h-14 w-full rounded-full text-[15px] font-bold text-white transition-opacity disabled:opacity-40"
            style={{ background: "#4B3425" }}
          >
            {saving ? "Saving…" : "Save Entry"}
          </button>

        </form>
      </div>
    </div>
    </>
  );
}
