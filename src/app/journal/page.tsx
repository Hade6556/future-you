"use client";

import { useState, useEffect, type CSSProperties } from "react";
import Link from "next/link";
import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/24/outline";

const LIME = "#C8FF00";
const TEXT_HI = "rgba(235,242,255,0.92)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const TEXT_LO = "rgba(120,155,195,0.40)";
const GLASS = "rgba(255,255,255,0.07)";
const GLASS_BORDER = "rgba(255,255,255,0.14)";

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

const sentimentDot: Record<string, string> = {
  positive: "#5C8B4A",
  neutral: "#C49A2A",
  negative: "#D94F3A",
};

const glassCard: CSSProperties = {
  background: GLASS,
  border: `1px solid ${GLASS_BORDER}`,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: 16,
};

function ReflectionCard({ reflection }: { reflection: Reflection }) {
  const [expanded, setExpanded] = useState(false);
  const content = reflection.content ?? "";
  const isLong = content.length > 200;

  return (
    <div style={{ ...glassCard, display: "flex", flexDirection: "column", gap: 12, padding: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: TEXT_LO,
          }}
        >
          {getDateLabel(reflection.created_at)}
        </span>
        {reflection.sentiment && (
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              flexShrink: 0,
              background: sentimentDot[reflection.sentiment] ?? TEXT_LO,
            }}
          />
        )}
      </div>

      <p
        style={{
          fontFamily: "var(--font-body), Georgia, serif",
          fontSize: 15,
          lineHeight: 1.65,
          color: TEXT_MID,
          margin: 0,
          ...(expanded || !isLong
            ? {}
            : {
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical" as const,
                overflow: "hidden",
              }),
        }}
      >
        {content}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          style={{
            alignSelf: "flex-start",
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: "4px 0",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            letterSpacing: "0.04em",
            color: LIME,
          }}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}

      {reflection.coach_response && (
        <details style={{ marginTop: 4 }}>
          <summary
            style={{
              cursor: "pointer",
              listStyle: "none",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              letterSpacing: "0.06em",
              color: TEXT_MID,
            }}
          >
            Behavio said →
          </summary>
          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 12,
              border: "1px solid rgba(200,255,0,0.22)",
              background: "rgba(200,255,0,0.04)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-body), Georgia, serif",
                fontSize: 13,
                lineHeight: 1.65,
                color: TEXT_MID,
              }}
            >
              {reflection.coach_response}
            </p>
          </div>
        </details>
      )}
    </div>
  );
}

function SkeletonCard() {
  const bar = (w: string): CSSProperties => ({
    height: 10,
    width: w,
    borderRadius: 9999,
    background: "rgba(255,255,255,0.08)",
    animation: "journalSk 1.2s ease-in-out infinite",
  });

  return (
    <div
      style={{
        ...glassCard,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={bar("64px")} />
        <div style={{ ...bar("8px"), width: 8 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={bar("100%")} />
        <div style={bar("80%")} />
        <div style={bar("60%")} />
      </div>
      <div style={bar("96px")} />
    </div>
  );
}

export default function JournalPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/brain-dumps", { credentials: "include" });
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
    <>
      <style>{`
        @keyframes journalSk { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.55; } }
        details > summary::-webkit-details-marker { display: none; }
      `}</style>
      <div
        style={{
          minHeight: "100dvh",
          background: "#060912",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background: `
              radial-gradient(ellipse 80% 55% at 50% -5%, rgba(50,90,220,0.38) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 90% 90%, rgba(15,40,110,0.40) 0%, transparent 55%),
              linear-gradient(170deg, #0d1a3a 0%, #060912 55%)
            `,
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              position: "absolute",
              top: "max(3.5rem, env(safe-area-inset-top, 3.5rem))",
              left: 28,
              display: "flex",
              alignItems: "baseline",
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontWeight: 700,
                fontStyle: "italic",
                fontSize: 20,
                color: "rgba(200,255,0,0.85)",
                letterSpacing: "0.02em",
              }}
            >
              behavio
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              width: "100%",
              maxWidth: 448,
              marginLeft: "auto",
              marginRight: "auto",
              minWidth: 0,
              padding:
                "max(5.5rem, calc(env(safe-area-inset-top, 3.5rem) + 2rem)) 24px max(9rem, env(safe-area-inset-bottom, 2rem))",
            }}
          >
            <Link
              href="/structure"
              style={{
                display: "flex",
                width: "fit-content",
                alignItems: "center",
                gap: 6,
                borderRadius: 9999,
                padding: "8px 14px",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                letterSpacing: "0.02em",
                color: TEXT_MID,
                border: `1px solid ${GLASS_BORDER}`,
                background: GLASS,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <ChevronLeftIcon style={{ width: 16, height: 16 }} />
              Back
            </Link>

            <header
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontWeight: 800,
                    fontStyle: "italic",
                    fontSize: 34,
                    lineHeight: 1.05,
                    letterSpacing: "-0.025em",
                    color: TEXT_HI,
                    margin: 0,
                  }}
                >
                  Journal
                </h1>
                <p
                  style={{
                    margin: "10px 0 0",
                    fontFamily: "var(--font-body), Georgia, serif",
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: TEXT_MID,
                  }}
                >
                  Every thought you&apos;ve spoken aloud.
                </p>
              </div>
              <Link
                href="/journal/new"
                aria-label="New entry"
                style={{
                  marginTop: 4,
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: 9999,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "var(--font-barlow-condensed), sans-serif",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#060912",
                  background: LIME,
                  boxShadow: "0 4px 24px rgba(200,255,0,0.25)",
                }}
              >
                <PlusIcon style={{ width: 18, height: 18 }} />
                New entry
              </Link>
            </header>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : reflections.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 20,
                  paddingTop: 48,
                  paddingBottom: 48,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 64,
                    height: 64,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    fontSize: 28,
                    background: "rgba(200,255,0,0.08)",
                    border: "1px solid rgba(200,255,0,0.18)",
                  }}
                  aria-hidden
                >
                  🎙
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      fontStyle: "italic",
                      color: TEXT_HI,
                    }}
                  >
                    No brain dumps yet
                  </p>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontFamily: "var(--font-body), Georgia, serif",
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: TEXT_LO,
                      maxWidth: 280,
                    }}
                  >
                    Tap the mic on Structure to record your first reflection.
                  </p>
                </div>
                <Link
                  href="/structure"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 24px",
                    borderRadius: 9999,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#060912",
                    background: LIME,
                    boxShadow: "0 4px 24px rgba(200,255,0,0.25)",
                  }}
                >
                  Go to Structure →
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {reflections.map((r) => (
                  <ReflectionCard key={r.id} reflection={r} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
