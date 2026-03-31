"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  MapPinIcon,
  BookmarkIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { usePlanStore } from "../state/planStore";
import { AMBITION_GOAL_MAP, type PipelineEvent, type PipelineExpert } from "../types/pipeline";

/* ── Design tokens ──────────────────────────────────────────────────────── */

const LIME = "#C8FF00";
const NAVY = "#060912";
const TEXT_HI = "rgba(235,242,255,0.95)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const TEXT_LO = "rgba(120,155,195,0.40)";
const GLASS = "rgba(255,255,255,0.07)";
const GLASS_BORDER = "rgba(255,255,255,0.14)";

const FONT_HEADING = "var(--font-barlow-condensed), sans-serif";
const FONT_BODY = "var(--font-apercu), sans-serif";
const FONT_MONO = "var(--font-jetbrains-mono), monospace";

/* ── Shared inline-style objects ────────────────────────────────────────── */

const shellStyle: React.CSSProperties = {
  minHeight: "100dvh",
  background: NAVY,
  position: "relative",
  overflow: "hidden",
};

const meshStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 0,
  background:
    "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(50,90,220,0.38) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(15,40,110,0.40) 0%, transparent 55%), linear-gradient(170deg, #0d1a3a 0%, #060912 55%)",
  pointerEvents: "none",
};

const gridStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 0,
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
  pointerEvents: "none",
};

const innerStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 20,
  width: "100%",
  maxWidth: 448,
  margin: "0 auto",
  minWidth: 0,
  padding: "max(3.5rem, calc(env(safe-area-inset-top, 0px) + 2.75rem)) 24px 160px",
};

const cardStyle: React.CSSProperties = {
  background: GLASS,
  border: "1px solid " + GLASS_BORDER,
  borderRadius: 20,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid " + GLASS_BORDER,
  borderRadius: 14,
  padding: "14px 18px",
  fontSize: 15,
  color: TEXT_HI,
  outline: "none",
  fontFamily: FONT_BODY,
};

const ctaStyle: React.CSSProperties = {
  background: LIME,
  color: NAVY,
  border: "none",
  borderRadius: 14,
  padding: "16px 0",
  width: "100%",
  fontFamily: FONT_HEADING,
  fontWeight: 800,
  fontSize: 16,
  textTransform: "uppercase",
  cursor: "pointer",
  fontStyle: "italic",
};

const ghostStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid " + GLASS_BORDER,
  color: TEXT_MID,
  borderRadius: 14,
  padding: "14px 0",
  fontFamily: FONT_BODY,
  fontSize: 14,
  cursor: "pointer",
  flex: 1,
  textAlign: "center",
};

const sourceBadgeStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.30)",
  border: "1px solid rgba(255,255,255,0.20)",
  borderRadius: 999,
  padding: "4px 10px",
  fontSize: 11,
  color: "#fff",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontWeight: 500,
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function stripMarkdown(text: string): string {
  return text
    .replace(/\*{1,3}([\s\S]*?)\*{1,3}/g, "$1")
    .replace(/_{1,3}([\s\S]*?)_{1,3}/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`[^`]+`/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanTitle(raw: string): string {
  return raw
    .replace(/\s[-|]\s*(Eventbrite|Meetup|Ticketmaster|Strava|F6S|Founders Network)$/i, "")
    .trim();
}

function sanitizeEventText(text: string | null | undefined, fallback: string): string {
  if (!text || typeof text !== "string") return fallback;
  const t = text.trim();
  if (
    t.includes("</loc>") ||
    t.includes("<lastmod>") ||
    t.includes("</url>") ||
    /\.xml\.gz/i.test(t) ||
    t.length > 2000
  )
    return fallback;
  return stripMarkdown(t).trim() || fallback;
}

function sourceDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

const SOURCE_META: Record<string, { label: string; emoji: string; color: string }> = {
  eventbrite:       { label: "Eventbrite",       emoji: "🎟",  color: "#f05537" },
  meetup:           { label: "Meetup",            emoji: "👥",  color: "#e0393e" },
  ticketmaster:     { label: "Ticketmaster",      emoji: "🎫",  color: "#026cdf" },
  strava:           { label: "Strava",            emoji: "🏃",  color: "#fc4c02" },
  founders_network: { label: "Founders Network",  emoji: "🚀",  color: "#6c47ff" },
  luma:             { label: "Luma",              emoji: "✨",  color: "#7c3aed" },
  linkedin:         { label: "LinkedIn",          emoji: "💼",  color: "#0a66c2" },
  facebook:         { label: "Facebook",          emoji: "📘",  color: "#1877f2" },
  f6s:              { label: "F6S",               emoji: "🚀",  color: "#ff6b35" },
  garysguide:       { label: "Gary's Guide",      emoji: "📅",  color: "#333333" },
  allevents:        { label: "AllEvents",         emoji: "🗓",  color: "#5b21b6" },
};

function titleToGradient(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  }
  const h1 = hash % 360;
  const h2 = (h1 + 40 + (hash >> 8) % 80) % 360;
  return `linear-gradient(135deg, hsl(${h1}deg 55% 20%), hsl(${h2}deg 45% 12%))`;
}

function isFarAway(eventLocation: string | null, userLocation: string): boolean {
  if (!eventLocation || !userLocation) return false;
  const evtLower = eventLocation.toLowerCase();
  const userLower = userLocation.toLowerCase();
  const tokens = userLower.split(/[\s,]+/).filter((t) => t.length > 2);
  return tokens.length > 0 && !tokens.some((t) => evtLower.includes(t));
}

/* ── Shell wrapper ───────────────────────────────────────────────────────── */

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={shellStyle}>
      <div aria-hidden style={meshStyle} />
      <div aria-hidden style={gridStyle} />
      <div style={innerStyle}>{children}</div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function SourceBadge({ source }: { source: string }) {
  const meta = SOURCE_META[source];
  return (
    <span style={sourceBadgeStyle}>
      {meta ? `${meta.emoji} ${meta.label}` : source}
    </span>
  );
}

function ExpertLogo({ expert }: { expert: PipelineExpert }) {
  const [failed, setFailed] = useState(false);
  const logoSrc = `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(expert.url)}`;

  if (!failed) {
    return (
      <img
        src={logoSrc}
        alt={expert.name}
        onError={() => setFailed(true)}
        style={{
          height: 40,
          width: 40,
          flexShrink: 0,
          borderRadius: 12,
          objectFit: "contain",
          background: "#fff",
          padding: 6,
          border: "1px solid " + GLASS_BORDER,
        }}
      />
    );
  }
  return (
    <div
      style={{
        display: "flex",
        height: 40,
        width: 40,
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: TEXT_HI,
        color: NAVY,
        fontWeight: 700,
        fontSize: 14,
        fontFamily: FONT_BODY,
      }}
    >
      {expert.name.charAt(0)}
    </div>
  );
}

function ExpertCard({ expert }: { expert: PipelineExpert }) {
  return (
    <div
      style={{
        ...cardStyle,
        display: "flex",
        minWidth: 0,
        alignItems: "flex-start",
        gap: 12,
        padding: 16,
      }}
    >
      <ExpertLogo expert={expert} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: TEXT_HI, lineHeight: 1.3, fontFamily: FONT_BODY }}>
            {expert.name}
          </p>
          {expert.verified && (
            <CheckBadgeIcon style={{ height: 16, width: 16, flexShrink: 0, color: LIME }} aria-label="Verified" />
          )}
        </div>
        <p style={{ fontSize: 12, color: TEXT_LO, fontFamily: FONT_BODY }}>{expert.role}</p>
        {expert.specialty && (
          <p style={{ marginTop: 2, fontSize: 12, color: TEXT_MID, fontFamily: FONT_BODY }}>{expert.specialty}</p>
        )}
        {expert.bio_snippet && (
          <p
            style={{
              marginTop: 6,
              fontSize: 13,
              color: TEXT_MID,
              fontFamily: FONT_BODY,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {expert.bio_snippet}
          </p>
        )}
        <Link
          href={expert.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 14,
            fontWeight: 500,
            color: LIME,
            textDecoration: "none",
            fontFamily: FONT_BODY,
          }}
        >
          View profile
          <ChevronRightIcon style={{ height: 14, width: 14, flexShrink: 0 }} />
        </Link>
      </div>
    </div>
  );
}

function EventsOrb() {
  return (
    <div
      style={{
        height: 32,
        width: 32,
        flexShrink: 0,
        borderRadius: "50%",
        border: "1px solid " + GLASS_BORDER,
        background: GLASS,
      }}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse" style={{ ...cardStyle, overflow: "hidden" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "16px 16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ height: 36, width: 96, borderRadius: 999, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ height: 24, width: 128, borderRadius: 999, background: "rgba(255,255,255,0.08)" }} />
        </div>
        <div style={{ borderRadius: 12, background: "rgba(255,255,255,0.08)", height: 112 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ height: 20, width: "75%", borderRadius: 6, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ height: 16, width: "50%", borderRadius: 6, background: "rgba(255,255,255,0.08)" }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ height: 44, flex: 1, borderRadius: 10, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ height: 44, flex: 1, borderRadius: 10, background: "rgba(255,255,255,0.08)" }} />
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, userLocation }: { event: PipelineEvent; userLocation: string }) {
  const title = cleanTitle(sanitizeEventText(event.title, "Event"));
  const date = formatDate(event.start_date);
  const location = event.virtual
    ? "Online"
    : event.location && event.location.length < 40
    ? event.location
    : null;
  const description = sanitizeEventText(event.description, "");
  const sourceMeta = SOURCE_META[event.source_name];
  const gradient = titleToGradient(title);
  const farAway = !event.virtual && isFarAway(event.location, userLocation);

  return (
    <div style={{ ...cardStyle, overflow: "hidden" }}>
      {/* Hero banner */}
      <div
        style={{
          position: "relative",
          display: "flex",
          minHeight: 128,
          flexDirection: "column",
          justifyContent: "flex-end",
          borderRadius: "20px 20px 0 0",
          padding: "40px 16px 16px",
          overflow: "hidden",
          background: gradient,
        }}
      >
        {event.image_url && (
          <>
            <img
              src={event.image_url}
              alt=""
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
          </>
        )}

        {/* Source pill — top-right */}
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
          <span style={sourceBadgeStyle}>
            {sourceMeta ? `${sourceMeta.emoji} ${sourceMeta.label}` : event.source_name}
          </span>
        </div>

        {/* Virtual / Far away badge — top-left */}
        {(event.virtual || farAway) && (
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {event.virtual && (
              <span style={sourceBadgeStyle}>
                <GlobeAltIcon style={{ height: 12, width: 12 }} /> Online
              </span>
            )}
            {farAway && (
              <span
                style={{
                  ...sourceBadgeStyle,
                  border: "1px solid rgba(251,191,36,0.40)",
                  background: "rgba(245,158,11,0.30)",
                  color: "#fde68a",
                }}
              >
                📍 Far away
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <p
          style={{
            position: "relative",
            zIndex: 10,
            fontSize: 18,
            fontWeight: 900,
            fontStyle: "italic",
            lineHeight: 1.25,
            color: "#fff",
            fontFamily: FONT_HEADING,
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </p>

        {/* Date + location row */}
        {(date || location) && (
          <div
            style={{
              position: "relative",
              zIndex: 10,
              marginTop: 6,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
              fontSize: 12,
              color: "rgba(255,255,255,0.80)",
              fontFamily: FONT_BODY,
            }}
          >
            {date && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <CalendarIcon style={{ height: 12, width: 12, flexShrink: 0 }} />
                {date}
              </span>
            )}
            {location && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <MapPinIcon style={{ height: 12, width: 12, flexShrink: 0 }} />
                {location}
              </span>
            )}
            {event.price_label && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                {event.price_label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "16px 16px 20px" }}>
        {/* Scraped-from attribution */}
        <p style={{ fontSize: 11, color: TEXT_LO, fontFamily: FONT_MONO }}>
          Scraped from{" "}
          <span style={{ fontWeight: 500 }}>
            {sourceMeta ? sourceMeta.label : event.source_name}
          </span>{" "}
          · {sourceDomain(event.source_url)}
        </p>

        {/* Description */}
        {description && (
          <p
            style={{
              fontSize: 14,
              color: TEXT_MID,
              fontFamily: FONT_BODY,
              lineHeight: 1.55,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        )}

        {/* "Recommended for you" chip */}
        <span
          style={{
            alignSelf: "flex-start",
            display: "inline-block",
            borderRadius: 8,
            border: "1px solid " + GLASS_BORDER,
            background: GLASS,
            padding: "2px 8px",
            fontSize: 12,
            color: TEXT_LO,
            fontFamily: FONT_MONO,
          }}
        >
          Recommended for you
        </span>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <Link
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              minHeight: 44,
              minWidth: 0,
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
              fontSize: 14,
              fontWeight: 500,
              color: TEXT_MID,
              textDecoration: "none",
              fontFamily: FONT_BODY,
            }}
          >
            Details
            <ChevronRightIcon style={{ height: 16, width: 16, flexShrink: 0 }} />
          </Link>
          <span style={{ height: 16, width: 1, flexShrink: 0, background: GLASS_BORDER }} aria-hidden />
          <button
            style={{
              ...ghostStyle,
              flex: "none",
              minHeight: 44,
              minWidth: 44,
              width: 44,
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Bookmark"
          >
            <BookmarkIcon style={{ height: 16, width: 16 }} />
          </button>
          <button
            style={{
              ...ctaStyle,
              flex: 1,
              minHeight: 44,
              padding: "12px 0",
              fontSize: 14,
            }}
          >
            Add to plan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page component ─────────────────────────────────────────────────── */

export default function EventsPage() {
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);
  const pipelineStatus = usePlanStore((s) => s.pipelineStatus);
  const setPipelinePlan = usePlanStore((s) => s.setPipelinePlan);
  const setPipelineStatus = usePlanStore((s) => s.setPipelineStatus);
  const location = usePlanStore((s) => s.location);
  const setLocation = usePlanStore((s) => s.setLocation);

  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [locationInput, setLocationInput] = useState(location);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  async function fetchEvents() {
    setLocation(locationInput);
    setPipelineStatus("loading");
    setPipelineError(null);
    const goal = (ambitionType && AMBITION_GOAL_MAP[ambitionType]) || "wellness";
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, location: locationInput }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Pipeline returned ${res.status}`);
      }
      const data = await res.json();
      setPipelinePlan(data);
      setCurrentIndex(0);
    } catch (err) {
      setPipelineError(err instanceof Error ? err.message : "Unknown error");
      setPipelineStatus("error");
    }
  }

  const now = Date.now();
  const events: PipelineEvent[] = (pipelinePlan?.recommended_events ?? [])
    .filter((e) => {
      if (e.start_date) {
        const d = new Date(e.start_date).getTime();
        if (!isNaN(d) && d < now) return false;
      }
      if (e.description) {
        const commas = (e.description.match(/,/g) ?? []).length;
        const words = e.description.trim().split(/\s+/).length;
        if (commas > 5 && commas / words > 0.25) return false;
      }
      if (e.location) {
        const parts = e.location.split(",").map((p) => p.trim());
        const junk = parts.some(
          (p) =>
            p.split(/\s+/).length === 1 &&
            p.length < 8 &&
            /^[A-Z]/.test(p) &&
            !/^\d/.test(p) &&
            parts.length > 2,
        );
        if (junk) return false;
      }
      return true;
    })
    .slice(0, 5);
  const event = events[currentIndex] ?? null;
  const matchCount = events.length;

  const headingStyle: React.CSSProperties = {
    fontFamily: FONT_HEADING,
    fontWeight: 900,
    fontStyle: "italic",
    fontSize: 28,
    color: TEXT_HI,
    lineHeight: 1.15,
  };

  const subtextStyle: React.CSSProperties = {
    marginTop: 8,
    fontFamily: FONT_BODY,
    fontSize: 15,
    color: TEXT_MID,
    fontWeight: 400,
  };

  // ── SSR guard ──────────────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <PageShell>
        <header>
          <h1 style={headingStyle}>Best match for you</h1>
        </header>
        <SkeletonCard />
      </PageShell>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (pipelineStatus === "loading") {
    return (
      <PageShell>
        <header>
          <h1 style={headingStyle}>Best match for you</h1>
          <p style={subtextStyle}>Finding events matched to your ambition…</p>
        </header>
        <SkeletonCard />
        <div
          style={{
            ...cardStyle,
            display: "flex",
            minWidth: 0,
            alignItems: "flex-start",
            gap: 12,
            padding: 16,
          }}
        >
          <EventsOrb />
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.5, color: TEXT_HI, fontFamily: FONT_BODY }}>
              Searching Eventbrite, Meetup, Ticketmaster and more…
            </p>
            <p style={{ marginTop: 4, fontSize: 12, color: TEXT_LO, fontFamily: FONT_MONO }}>
              This takes about 30–60 seconds.
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Idle — location input ──────────────────────────────────────────────────
  if (pipelineStatus === "idle") {
    return (
      <PageShell>
        <header>
          <h1 style={headingStyle}>Find events near you</h1>
          <p style={subtextStyle}>Enter your city so we can find relevant events.</p>
        </header>
        <div style={{ ...cardStyle, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchEvents()}
            placeholder="e.g. Vilnius, Lithuania"
            style={inputStyle}
          />
          <button style={{ ...ctaStyle, opacity: !locationInput.trim() ? 0.4 : 1 }} onClick={fetchEvents} disabled={!locationInput.trim()}>
            Find Events
          </button>
        </div>
      </PageShell>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (pipelineStatus === "error") {
    return (
      <PageShell>
        <header>
          <h1 style={headingStyle}>Best match for you</h1>
        </header>
        <div style={{ ...cardStyle, padding: 24, textAlign: "center" }}>
          <p style={{ fontSize: 15, color: TEXT_MID, fontFamily: FONT_BODY }}>
            Couldn&apos;t load events right now.
          </p>
          {pipelineError && (
            <p
              style={{
                marginTop: 8,
                fontSize: 12,
                fontFamily: FONT_MONO,
                color: "#f87171",
                background: "rgba(255,255,255,0.04)",
                padding: "8px 12px",
                borderRadius: 10,
                wordBreak: "break-all",
              }}
            >
              {pipelineError}
            </p>
          )}
          <button style={{ ...ctaStyle, marginTop: 16 }} onClick={() => setPipelineStatus("idle")}>
            Retry
          </button>
        </div>
      </PageShell>
    );
  }

  // ── No events found ────────────────────────────────────────────────────────
  if (pipelineStatus === "ready" && events.length === 0) {
    return (
      <PageShell>
        <header>
          <h1 style={headingStyle}>No events found</h1>
        </header>
        <div style={{ ...cardStyle, padding: 24, textAlign: "center" }}>
          <p style={{ fontSize: 15, color: TEXT_MID, fontFamily: FONT_BODY }}>
            We couldn&apos;t find upcoming events near <strong>{location}</strong> for your goal. Try a different city or broaden your search.
          </p>
          <button style={{ ...ctaStyle, marginTop: 16 }} onClick={() => setPipelineStatus("idle")}>
            Try another location
          </button>
          <Link href="/events/search" style={{ textDecoration: "none", display: "block", marginTop: 12 }}>
            <button style={{ ...ghostStyle, width: "100%" }}>
              Advanced search
            </button>
          </Link>
        </div>
      </PageShell>
    );
  }

  // ── Events carousel ────────────────────────────────────────────────────────
  return (
    <PageShell>
      <header>
        <h1 style={headingStyle}>Best match for you</h1>
        <p style={subtextStyle}>Curated events to advance your path.</p>
        <Link
          href="/events/search"
          style={{
            display: "inline-block",
            marginTop: 8,
            fontSize: 14,
            fontWeight: 500,
            color: LIME,
            textDecoration: "none",
            fontFamily: FONT_BODY,
          }}
        >
          Find events (goal, location, timeframe…)
        </Link>
      </header>

      {event && <EventCard event={event} userLocation={location} />}

      {/* Carousel dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6 }} aria-hidden>
        {events.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              height: 6,
              width: 6,
              borderRadius: "50%",
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: i === currentIndex ? TEXT_MID : GLASS_BORDER,
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>

      {/* Next / skip */}
      {events.length > 1 && currentIndex < events.length - 1 && (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={ghostStyle}
            onClick={() => setCurrentIndex((i) => Math.min(i + 1, events.length - 1))}
          >
            Skip
          </button>
          <button
            style={{ ...ghostStyle, color: TEXT_HI, fontWeight: 500 }}
            onClick={() => setCurrentIndex((i) => Math.min(i + 1, events.length - 1))}
          >
            Next event
          </button>
        </div>
      )}

      {/* Footer summary */}
      <div
        style={{
          ...cardStyle,
          display: "flex",
          minWidth: 0,
          alignItems: "flex-start",
          gap: 12,
          padding: 16,
        }}
      >
        <EventsOrb />
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.5, color: TEXT_HI, fontFamily: FONT_BODY }}>
            Behavio found <strong>{matchCount} events</strong> matched to your ambition.
          </p>
          <p style={{ marginTop: 4, fontSize: 15, lineHeight: 1.5, color: TEXT_HI, fontFamily: FONT_BODY }}>
            We&apos;ll block time in your calendar when you accept.
          </p>
          <p style={{ marginTop: 4, fontSize: 12, color: TEXT_LO, fontFamily: FONT_MONO }}>
            {currentIndex + 1} of {matchCount} · Tap dots to jump
          </p>
        </div>
      </div>

      <button
        style={{ ...ghostStyle, width: "100%", minHeight: 44, flex: "none" }}
        onClick={() => setPipelineStatus("idle")}
      >
        Find new events
      </button>

      {/* Roadmap link */}
      {pipelinePlan?.phases && pipelinePlan.phases.length > 0 && (
        <Link
          href="/plan"
          style={{
            ...cardStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            textDecoration: "none",
          }}
        >
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: TEXT_HI, fontFamily: FONT_BODY }}>
              Your roadmap
            </p>
            <p style={{ fontSize: 12, color: TEXT_LO, marginTop: 2, fontFamily: FONT_MONO }}>
              {pipelinePlan.phases.length} phases · {pipelinePlan.horizon_weeks} weeks
            </p>
          </div>
          <ArrowRightIcon style={{ height: 20, width: 20, flexShrink: 0, color: TEXT_MID }} />
        </Link>
      )}
    </PageShell>
  );
}
