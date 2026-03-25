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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePlanStore } from "../state/planStore";
import { AMBITION_GOAL_MAP, type PipelineEvent, type PipelineExpert } from "../types/pipeline";

/** Remove markdown syntax from a string (handles cached data pre-backend fix) */
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

/** Strip source suffix from scraped titles like "Event Name - Eventbrite" */
function cleanTitle(raw: string): string {
  return raw
    .replace(/\s[-|]\s*(Eventbrite|Meetup|Ticketmaster|Strava|F6S|Founders Network)$/i, "")
    .trim();
}

/** If text looks like XML/sitemap garbage, return fallback; otherwise return cleaned text. */
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
  eventbrite:      { label: "Eventbrite",       emoji: "🎟",  color: "#f05537" },
  meetup:          { label: "Meetup",            emoji: "👥",  color: "#e0393e" },
  ticketmaster:    { label: "Ticketmaster",      emoji: "🎫",  color: "#026cdf" },
  strava:          { label: "Strava",            emoji: "🏃",  color: "#fc4c02" },
  founders_network:{ label: "Founders Network", emoji: "🚀",  color: "#6c47ff" },
  luma:            { label: "Luma",              emoji: "✨",  color: "#7c3aed" },
  linkedin:        { label: "LinkedIn",          emoji: "💼",  color: "#0a66c2" },
  facebook:        { label: "Facebook",          emoji: "📘",  color: "#1877f2" },
  f6s:             { label: "F6S",               emoji: "🚀",  color: "#ff6b35" },
  garysguide:      { label: "Gary's Guide",      emoji: "📅",  color: "#333333" },
  allevents:       { label: "AllEvents",         emoji: "🗓",  color: "#5b21b6" },
};

function SourceBadge({ source }: { source: string }) {
  const meta = SOURCE_META[source];
  return (
    <span className="rounded-full bg-chip-bg px-2 py-0.5 text-xs text-muted-foreground border border-border">
      {meta ? `${meta.emoji} ${meta.label}` : source}
    </span>
  );
}

/** Deterministic gradient from event title — unique per event */
function titleToGradient(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  }
  const h1 = hash % 360;
  const h2 = (h1 + 40 + (hash >> 8) % 80) % 360;
  return `linear-gradient(135deg, hsl(${h1}deg 55% 20%), hsl(${h2}deg 45% 12%))`;
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
        className="h-10 w-10 shrink-0 rounded-xl object-contain bg-white p-1.5 border border-border"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-primary-foreground font-bold text-sm">
      {expert.name.charAt(0)}
    </div>
  );
}

function ExpertCard({ expert }: { expert: PipelineExpert }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4">
      <ExpertLogo expert={expert} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-[15px] font-semibold text-text-primary leading-snug">{expert.name}</p>
          {expert.verified && (
            <CheckBadgeIcon className="h-4 w-4 shrink-0 text-primary" aria-label="Verified" />
          )}
        </div>
        <p className="text-xs text-microcopy-soft">{expert.role}</p>
        {expert.specialty && (
          <p className="mt-0.5 text-xs text-text-secondary">{expert.specialty}</p>
        )}
        {expert.bio_snippet && (
          <p className="mt-1.5 text-[13px] text-text-secondary line-clamp-3">{expert.bio_snippet}</p>
        )}
        <Link
          href={expert.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-2"
        >
          View profile
          <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" />
        </Link>
      </div>
    </div>
  );
}

function EventsOrb() {
  return (
    <div className="h-8 w-8 shrink-0 rounded-full border border-border bg-muted" />
  );
}

function SkeletonCard() {
  return (
    <Card className="min-w-0 overflow-hidden border border-border shadow-sm animate-pulse">
      <CardContent className="flex flex-col gap-6 p-4 pb-6">
        <div className="flex items-center justify-between gap-2">
          <div className="h-9 w-24 rounded-full bg-border" />
          <div className="h-6 w-32 rounded-full bg-border" />
        </div>
        <div className="rounded-xl bg-border h-28" />
        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded bg-border" />
          <div className="h-4 w-1/2 rounded bg-border" />
        </div>
        <div className="flex gap-2">
          <div className="h-11 flex-1 rounded-lg bg-border" />
          <div className="h-11 flex-1 rounded-lg bg-border" />
        </div>
      </CardContent>
    </Card>
  );
}

function isFarAway(eventLocation: string | null, userLocation: string): boolean {
  if (!eventLocation || !userLocation) return false;
  const evtLower = eventLocation.toLowerCase();
  const userLower = userLocation.toLowerCase();
  // Split user location into tokens (e.g. "Vilnius, Lithuania" → ["vilnius", "lithuania"])
  const tokens = userLower.split(/[\s,]+/).filter((t) => t.length > 2);
  return tokens.length > 0 && !tokens.some((t) => evtLower.includes(t));
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
    <Card className="min-w-0 overflow-hidden border border-border shadow-sm">
      <CardContent className="flex flex-col gap-0 p-0 pb-5">

        {/* Hero banner — real image when available, gradient fallback always */}
        <div
          className="relative flex min-h-[128px] flex-col justify-end rounded-t-xl px-4 pb-4 pt-10 overflow-hidden"
          style={{ background: gradient }}
        >
          {event.image_url && (
            <>
              <img
                src={event.image_url}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-black/45" />
            </>
          )}

          {/* Source pill — top-right */}
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {sourceMeta ? `${sourceMeta.emoji} ${sourceMeta.label}` : event.source_name}
            </span>
          </div>

          {/* Virtual / Far away badge — top-left */}
          {(event.virtual || farAway) && (
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
              {event.virtual && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  <GlobeAltIcon className="h-3 w-3" /> Online
                </span>
              )}
              {farAway && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/30 px-2.5 py-1 text-xs font-medium text-amber-200 backdrop-blur-sm">
                  📍 Far away
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <p className="relative z-10 text-lg font-bold leading-snug text-white drop-shadow line-clamp-2">
            {title}
          </p>

          {/* Date + location row */}
          {(date || location) && (
            <div className="relative z-10 mt-1.5 flex flex-wrap items-center gap-3 text-xs text-white/80">
              {date && (
                <span className="inline-flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3 shrink-0" />
                  {date}
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3 shrink-0" />
                  {location}
                </span>
              )}
              {event.price_label && (
                <span className="inline-flex items-center gap-1 font-medium">
                  {event.price_label}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-4 pt-4">
          {/* Scraped-from attribution */}
          <p className="text-[11px] text-muted-foreground">
            Scraped from{" "}
            <span className="font-medium">
              {sourceMeta ? sourceMeta.label : event.source_name}
            </span>{" "}
            · {sourceDomain(event.source_url)}
          </p>

          {/* Description */}
          {description && (
            <p className="text-sm text-text-secondary line-clamp-3">{description}</p>
          )}

          {/* "Recommended for you" chip */}
          <span className="self-start inline-block rounded-md border border-border bg-chip-bg px-2 py-0.5 text-xs text-muted-foreground">
            Recommended for you
          </span>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={event.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target inline-flex min-h-[44px] min-w-0 items-center gap-1 shrink-0 -translate-y-0.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:underline underline-offset-2 transition-colors"
            >
              Details
              <ChevronRightIcon className="h-4 w-4 shrink-0" />
            </Link>
            <span className="h-4 w-px shrink-0 bg-border" aria-hidden />
            <Button
              variant="outline"
              size="icon-sm"
              className="touch-target shrink-0 min-h-[44px] min-w-[44px]"
              aria-label="Bookmark"
            >
              <BookmarkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              className="touch-target min-h-[44px] min-w-0 flex-1 bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              Add to plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
    const goal = ambitionType ? AMBITION_GOAL_MAP[ambitionType] : undefined;
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
      // Only drop events with a provably past date; null dates pass through
      if (e.start_date) {
        const d = new Date(e.start_date).getTime();
        if (!isNaN(d) && d < now) return false;
      }
      // Drop keyword-soup descriptions: too many commas relative to content length
      if (e.description) {
        const commas = (e.description.match(/,/g) ?? []).length;
        const words = e.description.trim().split(/\s+/).length;
        if (commas > 5 && commas / words > 0.25) return false;
      }
      // Drop events with junk location data (very short segments between commas suggest tag lists)
      if (e.location) {
        const parts = e.location.split(",").map((p) => p.trim());
        const junk = parts.some((p) => p.split(/\s+/).length === 1 && p.length < 8 && /^[A-Z]/.test(p) && !/^\d/.test(p) && parts.length > 2);
        if (junk) return false;
      }
      return true;
    })
    .slice(0, 5);
  const event = events[currentIndex] ?? null;
  const matchCount = events.length;

  // ── SSR guard — prevents hydration mismatch from store reading localStorage ─
  if (!mounted) {
    return (
      <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
        <div className="section-gap mx-auto flex w-full max-w-md flex-col min-w-0">
          <header>
            <h1 className="type-h1 text-text-primary">Best match for you</h1>
          </header>
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (pipelineStatus === "loading") {
    return (
      <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
        <div className="section-gap mx-auto flex w-full max-w-md flex-col min-w-0">
          <header>
            <h1 className="type-h1 text-text-primary">Best match for you</h1>
            <p className="mt-2 type-body font-normal text-microcopy-soft">
              Finding events matched to your ambition…
            </p>
          </header>
          <SkeletonCard />
          <div className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4">
            <EventsOrb />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold leading-relaxed text-text-primary">
                Searching Eventbrite, Meetup, Ticketmaster and more…
              </p>
              <p className="mt-1 text-xs text-microcopy-soft">This takes about 30–60 seconds.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── No ambition / unsupported type ────────────────────────────────────────
  if (!ambitionType || !AMBITION_GOAL_MAP[ambitionType]) {
    return (
      <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
        <div className="section-gap mx-auto flex w-full max-w-md flex-col min-w-0">
          <header>
            <h1 className="type-h1 text-text-primary">Best match for you</h1>
          </header>
          <Card className="min-w-0 border border-border shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-[15px] text-text-secondary">
                {ambitionType
                  ? "Event search for your ambition type is coming soon."
                  : "Complete the quiz so we can find events matched to your goal."}
              </p>
              <Link href="/events/search">
                <Button variant="outline" className="min-h-[44px]">
                  Find events (set goal, location & more)
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Idle — show location input ─────────────────────────────────────────────
  if (pipelineStatus === "idle") {
    return (
      <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
        <div className="section-gap mx-auto flex w-full max-w-md flex-col min-w-0">
          <header>
            <h1 className="type-h1 text-text-primary">Find events near you</h1>
            <p className="mt-2 type-body font-normal text-microcopy-soft">
              Enter your city so we can find relevant events.
            </p>
          </header>
          <Card className="min-w-0 border border-border shadow-sm">
            <CardContent className="p-6 space-y-4">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchEvents()}
                placeholder="e.g. Vilnius, Lithuania"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-[15px] text-text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <Button
                className="w-full min-h-[44px] bg-primary text-primary-foreground hover:bg-primary-hover"
                onClick={fetchEvents}
                disabled={!locationInput.trim()}
              >
                Find Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (pipelineStatus === "error") {
    return (
      <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
        <div className="section-gap mx-auto flex w-full max-w-md flex-col min-w-0">
          <header>
            <h1 className="type-h1 text-text-primary">Best match for you</h1>
          </header>
          <Card className="min-w-0 border border-border shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-[15px] text-text-secondary">
                Couldn&apos;t load events right now.
              </p>
              {pipelineError && (
                <p className="mt-2 text-xs font-mono text-destructive bg-muted px-3 py-2 rounded-lg break-all">
                  {pipelineError}
                </p>
              )}
              <Button className="mt-4" onClick={() => setPipelineStatus("idle")}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── No events returned → fall back to idle so user can search again ────────
  if (pipelineStatus === "ready" && events.length === 0) {
    setPipelineStatus("idle");
    return null;
  }

  // ── Events carousel ────────────────────────────────────────────────────────
  return (
    <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
      <div className="section-gap mx-auto flex w-full max-w-md flex-col min-w-0">
        <header>
          <h1 className="type-h1 text-text-primary">Best match for you</h1>
          <p className="mt-2 type-body font-normal text-microcopy-soft">
            Curated events to advance your path.
          </p>
          <Link href="/events/search" className="mt-2 inline-block text-sm font-medium text-primary hover:underline underline-offset-2">
            Find events (goal, location, timeframe…)
          </Link>
        </header>

        {event && <EventCard event={event} userLocation={location} />}

        {/* Carousel dots */}
        <div className="flex justify-center gap-1.5" aria-hidden>
          {events.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === currentIndex ? "bg-text-secondary" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Next / skip */}
        {events.length > 1 && currentIndex < events.length - 1 && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="flex-1 min-h-[44px]"
              onClick={() => setCurrentIndex((i) => Math.min(i + 1, events.length - 1))}
            >
              Skip
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-h-[44px]"
              onClick={() => setCurrentIndex((i) => Math.min(i + 1, events.length - 1))}
            >
              Next event
            </Button>
          </div>
        )}

        {/* Footer summary */}
        <div className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4">
          <EventsOrb />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold leading-relaxed text-text-primary">
              Future Me found <strong>{matchCount} events</strong> matched to your ambition.
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-text-primary">
              We&apos;ll block time in your calendar when you accept.
            </p>
            <p className="mt-1 text-xs text-microcopy-soft">
              {currentIndex + 1} of {matchCount} · Tap dots to jump
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full min-h-[44px] text-text-secondary"
          onClick={() => setPipelineStatus("idle")}
        >
          Find new events
        </Button>

        {/* ── Roadmap link ────────────────────────────────────────────────── */}
        {pipelinePlan?.phases && pipelinePlan.phases.length > 0 && (
          <Link
            href="/plan"
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:bg-muted/50 transition-colors"
          >
            <div>
              <p className="text-[15px] font-semibold text-text-primary">Your roadmap</p>
              <p className="text-xs text-microcopy-soft mt-0.5">
                {pipelinePlan.phases.length} phases · {pipelinePlan.horizon_weeks} weeks
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>
        )}
      </div>
    </div>
  );
}
