"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { usePlanStore } from "../state/planStore";
import { usePremiumGuard } from "../hooks/usePremiumGuard";
import { StreakCard } from "../components/home/StreakCard";
import type { PipelineEvent, PipelineExpert } from "../types/pipeline";
import { resolveEventSearchContext } from "@/lib/events/resolveEventGoal";
import { ACCENT as LIME, TEXT_HI, TEXT_MID, TEXT_LO, GLASS, GLASS_BORDER } from "@/app/theme";

const sub = () => () => {};
const getTrue = () => true;
const getFalse = () => false;
function useHydrated() {
  return useSyncExternalStore(sub, getTrue, getFalse);
}

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-barlow-condensed), sans-serif",
  fontWeight: 700,
  fontStyle: "italic",
  fontSize: 22,
  color: TEXT_HI,
  margin: "0 0 12px",
};

const glassCard: React.CSSProperties = {
  background: GLASS,
  border: `1px solid ${GLASS_BORDER}`,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: 16,
  padding: 16,
};

export default function ExplorePage() {
  const guardRedirecting = usePremiumGuard();
  const hydrated = useHydrated();
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const storeLocation = usePlanStore((s) => s.location);
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);
  const cachedEvents = usePlanStore((s) => s.cachedEvents);
  const eventsFetchedAt = usePlanStore((s) => s.eventsFetchedAt);
  const setCachedEvents = usePlanStore((s) => s.setCachedEvents);

  const location = hydrated ? storeLocation : null;

  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [eventsMeta, setEventsMeta] = useState<{ serpConfigured?: boolean } | null>(null);

  const experts: PipelineExpert[] = (hydrated ? pipelinePlan?.recommended_experts : null) ?? [];

  const fetchEvents = useCallback(() => {
    const loc = location?.trim();
    const ctx = resolveEventSearchContext(ambitionType, pipelinePlan);
    if (!ctx || !loc) return;
    setEventsLoading(true);
    setEventsError(null);
    setEventsMeta(null);
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchQueries: ctx.searchQueries,
        scoringHint: ctx.scoringHint,
        goalRaw: ctx.goalRaw,
        location: loc,
      }),
      credentials: "include",
    })
      .then(async (r) => {
        const data = (await r.json().catch(() => null)) as {
          events?: PipelineEvent[];
          error?: string;
          meta?: { serpConfigured?: boolean };
        } | null;
        if (data?.meta) setEventsMeta(data.meta);
        if (!r.ok) {
          setEventsError(data?.error ?? `Events request failed (${r.status}).`);
          return;
        }
        const fetched = Array.isArray(data?.events) ? data.events : [];
        setCachedEvents(fetched);
      })
      .catch(() => setEventsError("Couldn't load events. Check your connection and try again."))
      .finally(() => setEventsLoading(false));
  }, [ambitionType, location, pipelinePlan, setCachedEvents]);

  // Auto-fetch only once per session (when no cached results exist yet)
  useEffect(() => {
    if (!hydrated || eventsFetchedAt) return;
    fetchEvents();
  }, [hydrated, eventsFetchedAt, fetchEvents]);

  if (guardRedirecting) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{ minHeight: "100dvh", padding: "60px 20px 32px", position: "relative" }}
    >
      <h1
        style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 800,
          fontStyle: "italic",
          fontSize: 28,
          color: TEXT_HI,
          margin: "0 0 24px",
        }}
      >
        Explore
      </h1>

      {/* Streak */}
      <div style={{ marginBottom: 28, display: "flex" }}>
        <StreakCard />
      </div>

      {/* Events */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={sectionTitle}>Events for you</h2>

        {eventsLoading && (
          <div style={{ ...glassCard, display: "flex", alignItems: "center", gap: 10 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.10)",
                borderTopColor: LIME,
              }}
            />
            <span style={{ fontFamily: "var(--font-apercu), sans-serif", fontSize: 14, color: TEXT_MID }}>
              Finding events near you…
            </span>
          </div>
        )}

        {!eventsLoading && cachedEvents.length === 0 && (
          <div style={{ ...glassCard }}>
            <p style={{ fontFamily: "var(--font-apercu), sans-serif", fontSize: 14, color: eventsError ? "#f87171" : TEXT_LO, margin: 0 }}>
              {eventsError
                ? eventsError
                : eventsMeta?.serpConfigured === false
                  ? "Live event search isn't configured on the server (add SERPAPI_KEY in .env.local and restart npm run dev)."
                  : location?.trim()
                    ? "No relevant events found near you right now — we only show events that match your goals."
                    : "Add your location in account settings to discover events."}
            </p>
          </div>
        )}

        {!eventsLoading && cachedEvents.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cachedEvents.map((evt) => (
              <a
                key={evt.event_id}
                href={evt.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div style={{ ...glassCard, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  {evt.image_url && (
                    <img
                      src={evt.image_url}
                      alt=""
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 10,
                        objectFit: "cover",
                        flexShrink: 0,
                        background: "rgba(255,255,255,0.04)",
                      }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontWeight: 600,
                        fontSize: 15,
                        color: TEXT_HI,
                        margin: "0 0 4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {evt.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontSize: 13,
                        color: TEXT_MID,
                        margin: 0,
                      }}
                    >
                      {[evt.start_date, evt.location, evt.price_label].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 4 }}>
                    <path d="M6 4l4 4-4 4" stroke={TEXT_LO} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Find more button — shown after initial fetch completes (whether results or not) */}
        {!eventsLoading && eventsFetchedAt && location?.trim() && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={fetchEvents}
            style={{
              width: "100%",
              marginTop: 12,
              padding: "14px 0",
              borderRadius: 14,
              border: `1px solid rgba(94,205,161,0.25)`,
              background: "rgba(94,205,161,0.06)",
              color: LIME,
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: 16,
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            Find more events
          </motion.button>
        )}
      </div>

      {/* Mentors / Experts */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={sectionTitle}>Recommended mentors</h2>

        {experts.length === 0 && (
          <div style={{ ...glassCard }}>
            <p style={{ fontFamily: "var(--font-apercu), sans-serif", fontSize: 14, color: TEXT_LO, margin: 0 }}>
              Mentor recommendations will appear once your plan is generated.
            </p>
          </div>
        )}

        {experts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {experts.map((exp) => (
              <a
                key={exp.resource_id}
                href={exp.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div style={{ ...glassCard, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "rgba(94,205,161,0.08)",
                      border: "1px solid rgba(94,205,161,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: "var(--font-barlow-condensed), sans-serif",
                      fontWeight: 700,
                      fontSize: 18,
                      color: LIME,
                    }}
                  >
                    {exp.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontWeight: 600,
                        fontSize: 15,
                        color: TEXT_HI,
                        margin: "0 0 2px",
                      }}
                    >
                      {exp.name}
                      {exp.verified && (
                        <span style={{ color: LIME, marginLeft: 4, fontSize: 13 }}>✓</span>
                      )}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontSize: 13,
                        color: TEXT_MID,
                        margin: "0 0 2px",
                      }}
                    >
                      {exp.role}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-apercu), sans-serif",
                        fontSize: 12,
                        color: TEXT_LO,
                        margin: 0,
                      }}
                    >
                      {exp.specialty}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 4 }}>
                    <path d="M6 4l4 4-4 4" stroke={TEXT_LO} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
