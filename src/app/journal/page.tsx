"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/24/outline";

type Reflection = {
  id: string;
  date: string;
  content: string | null;
  coach_response: string | null;
  sentiment: "positive" | "neutral" | "negative" | null;
  created_at: string;
};

function getDateLabel(isoString: string): string {
  const created = new Date(isoString);
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const createdMidnight = new Date(created.getFullYear(), created.getMonth(), created.getDate());
  const diffDays = Math.round((todayMidnight.getTime() - createdMidnight.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return created.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const sentimentColor: Record<string, string> = {
  positive: "bg-accent",
  neutral: "bg-amber-400",
  negative: "bg-destructive",
};

const sentimentDot: Record<string, string> = {
  positive: "#5C8B4A",
  neutral: "#C49A2A",
  negative: "#D94F3A",
};

function ReflectionCard({ reflection }: { reflection: Reflection }) {
  const [expanded, setExpanded] = useState(false);
  const content = reflection.content ?? "";
  const isLong = content.length > 200;

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
          style={{ background: "var(--badge-bg)", color: "var(--text-secondary)" }}
        >
          {getDateLabel(reflection.created_at)}
        </span>
        {reflection.sentiment && (
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: sentimentDot[reflection.sentiment] ?? "var(--muted)" }}
          />
        )}
      </div>

      {/* Transcript */}
      <p className={`text-[15px] leading-relaxed text-foreground ${expanded || !isLong ? "" : "line-clamp-4"}`}>
        {content}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="self-start rounded-full text-xs font-semibold"
          style={{ color: "var(--accent-primary)" }}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}

      {/* Coach response */}
      {reflection.coach_response && (
        <details className="mt-1">
          <summary
            className="cursor-pointer list-none text-xs font-semibold"
            style={{ color: "var(--text-secondary)" }}
          >
            Future Me said →
          </summary>
          <p
            className="mt-2 border-l-2 pl-3 text-[13px] leading-relaxed"
            style={{ borderColor: "var(--accent-primary)", color: "var(--text-secondary)" }}
          >
            {reflection.coach_response}
          </p>
        </details>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex justify-between">
        <div className="h-3 w-16 rounded-full bg-border" />
        <div className="h-2 w-2 rounded-full bg-border" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-border" />
        <div className="h-3 w-4/5 rounded-full bg-border" />
        <div className="h-3 w-3/5 rounded-full bg-border" />
      </div>
      <div className="h-3 w-24 rounded-full bg-border" />
    </div>
  );
}

export default function JournalPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/brain-dumps");
        const { dumps } = await res.json() as { dumps: Array<{ id: string; date: string; content: string; coach_response: string | null; sentiment: "positive" | "neutral" | "negative" | null; timestamp: string }> };
        setReflections(
          dumps.map((d) => ({
            id: d.id,
            date: d.date,
            content: d.content,
            coach_response: d.coach_response,
            sentiment: d.sentiment,
            created_at: d.timestamp,
          }))
        );
      } catch {
        // show empty state
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
      <div className="section-gap mx-auto flex w-full max-w-md flex-col min-w-0">
        {/* Back nav */}
        <Link
          href="/structure"
          className="flex w-fit items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold transition-colors hover:bg-muted"
          style={{ color: "var(--text-secondary)" }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back
        </Link>

        {/* Header */}
        <header className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-tight text-foreground">
              Brain dumps
            </h1>
            <p className="mt-2 text-[15px] font-normal leading-relaxed text-muted-foreground">
              Every thought you&apos;ve spoken aloud.
            </p>
          </div>
          <Link
            href="/journal/new"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--accent-primary)" }}
            aria-label="New entry"
          >
            <PlusIcon className="h-5 w-5" />
          </Link>
        </header>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : reflections.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
              style={{ background: "var(--badge-bg)" }}
              aria-hidden
            >
              🎙
            </div>
            <div>
              <p className="text-[16px] font-bold text-foreground">No brain dumps yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tap the mic on Structure to record your first reflection.
              </p>
            </div>
            <Link
              href="/structure"
              className="rounded-full px-5 py-2.5 text-sm font-bold text-white"
              style={{ background: "var(--accent-primary)" }}
            >
              Go to Structure →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reflections.map((r) => (
              <ReflectionCard key={r.id} reflection={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
