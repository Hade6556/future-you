"use client";

import { useState, useEffect } from "react";
import { ChevronRightIcon, CheckBadgeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePlanStore } from "../state/planStore";
import { AMBITION_GOAL_MAP, type PipelineExpert } from "../types/pipeline";

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
          height: 40, width: 40, flexShrink: 0, borderRadius: 12,
          objectFit: "contain", background: "#fff", padding: 6,
          border: "1px solid " + GLASS_BORDER,
        }}
      />
    );
  }
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: 40, width: 40, flexShrink: 0, borderRadius: "50%",
      background: "rgba(200,255,0,0.15)", color: LIME, border: "none",
      fontWeight: 700, fontSize: 14, fontFamily: FONT_BODY,
    }}>
      {expert.name.charAt(0)}
    </div>
  );
}

function ExpertCard({ expert }: { expert: PipelineExpert }) {
  const bio = expert.bio_snippet ? stripMarkdown(expert.bio_snippet) : null;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0,
      background: GLASS, border: "1px solid " + GLASS_BORDER,
      borderRadius: 16, backdropFilter: "blur(16px)", padding: 16,
    }}>
      <ExpertLogo expert={expert} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: TEXT_HI, lineHeight: 1.3, fontFamily: FONT_BODY, margin: 0 }}>
            {expert.name}
          </p>
          {expert.verified && (
            <CheckBadgeIcon style={{ height: 16, width: 16, flexShrink: 0, color: LIME }} aria-label="Verified" />
          )}
        </div>
        <p style={{ fontSize: 12, color: TEXT_LO, fontFamily: FONT_BODY, margin: 0 }}>{expert.role}</p>
        {expert.specialty && (
          <p style={{ marginTop: 2, fontSize: 12, color: TEXT_MID, fontFamily: FONT_BODY, margin: "2px 0 0" }}>{expert.specialty}</p>
        )}
        {bio && (
          <p style={{
            marginTop: 6, fontSize: 13, color: TEXT_MID, fontFamily: FONT_BODY,
            display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{bio}</p>
        )}
        <Link
          href={expert.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            marginTop: 8, fontSize: 14, fontWeight: 600, color: LIME,
            textDecoration: "none", fontFamily: FONT_BODY,
          }}
        >
          View profile
          <ChevronRightIcon style={{ height: 14, width: 14, flexShrink: 0 }} />
        </Link>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse" style={{
      display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0,
      background: GLASS, border: "1px solid " + GLASS_BORDER,
      borderRadius: 16, backdropFilter: "blur(16px)", padding: 16,
    }}>
      <div style={{ height: 40, width: 40, flexShrink: 0, borderRadius: 12, background: "rgba(255,255,255,0.06)" }} />
      <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 16, width: "50%", borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ height: 12, width: "33%", borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ height: 12, width: "75%", borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
      </div>
    </div>
  );
}

export default function MentorsPage() {
  const ambitionType = usePlanStore((s) => s.ambitionType);
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);
  const pipelineStatus = usePlanStore((s) => s.pipelineStatus);
  const setPipelinePlan = usePlanStore((s) => s.setPipelinePlan);
  const setPipelineStatus = usePlanStore((s) => s.setPipelineStatus);
  const location = usePlanStore((s) => s.location);
  const setLocation = usePlanStore((s) => s.setLocation);

  const [mounted, setMounted] = useState(false);
  const [locationInput, setLocationInput] = useState(location);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  async function fetchMentors() {
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
    } catch (err) {
      setPipelineError(err instanceof Error ? err.message : "Unknown error");
      setPipelineStatus("error");
    }
  }

  const experts: PipelineExpert[] = pipelinePlan?.recommended_experts ?? [];

  const wrapper = (children: React.ReactNode) => (
    <div style={{ minHeight: "100dvh", background: NAVY, position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(50,90,220,0.38) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(15,40,110,0.40) 0%, transparent 55%), linear-gradient(170deg, #0d1a3a 0%, #060912 55%)",
        pointerEvents: "none",
      }} />
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
        <header>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <UserGroupIcon style={{ height: 20, width: 20, color: LIME }} aria-hidden />
            <h1 style={{
              fontSize: 42, fontWeight: 900, fontStyle: "italic",
              lineHeight: 0.94, letterSpacing: "-0.03em", color: TEXT_HI,
              fontFamily: FONT_HEADING, margin: 0,
            }}>Who to Follow</h1>
          </div>
          <p style={{
            marginTop: 8, fontSize: 15, fontWeight: 400, lineHeight: 1.6,
            color: TEXT_MID, fontFamily: FONT_BODY,
          }}>
            Experts and mentors matched to your ambition.
          </p>
        </header>
        {children}
      </div>
    </div>
  );

  if (!mounted) return wrapper(<SkeletonCard />);

  if (pipelineStatus === "loading") {
    return wrapper(
      <>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0,
          background: GLASS, border: "1px solid " + GLASS_BORDER,
          borderRadius: 16, backdropFilter: "blur(16px)", padding: 16,
        }}>
          <div style={{
            height: 32, width: 32, flexShrink: 0, borderRadius: "50%",
            border: "1px solid " + GLASS_BORDER, background: "rgba(255,255,255,0.04)",
          }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.6, color: TEXT_HI, fontFamily: FONT_BODY, margin: 0 }}>
              Searching for mentors and experts…
            </p>
            <p style={{ marginTop: 4, fontSize: 12, color: TEXT_LO, fontFamily: FONT_BODY }}>
              This takes about 30–60 seconds.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!ambitionType || !AMBITION_GOAL_MAP[ambitionType]) {
    return wrapper(
      <div style={{
        background: GLASS, border: "1px solid " + GLASS_BORDER,
        borderRadius: 16, backdropFilter: "blur(16px)", padding: 24,
        textAlign: "center", minWidth: 0,
      }}>
        <p style={{ fontSize: 15, color: TEXT_MID, fontFamily: FONT_BODY, margin: 0 }}>
          {ambitionType
            ? "Mentor search for your ambition type is coming soon."
            : "Complete the quiz so we can find mentors matched to your goal."}
        </p>
      </div>
    );
  }

  if (pipelineStatus === "idle") {
    return wrapper(
      <div style={{
        background: GLASS, border: "1px solid " + GLASS_BORDER,
        borderRadius: 16, backdropFilter: "blur(16px)", padding: 24,
        display: "flex", flexDirection: "column", gap: 16, minWidth: 0,
      }}>
        <input
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchMentors()}
          placeholder="e.g. Vilnius, Lithuania"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid " + GLASS_BORDER,
            borderRadius: 14, padding: "14px 18px", fontSize: 15,
            color: TEXT_HI, outline: "none", fontFamily: FONT_BODY,
            width: "100%", boxSizing: "border-box",
          }}
        />
        <button
          onClick={fetchMentors}
          disabled={!locationInput.trim()}
          style={{
            background: LIME, color: NAVY, border: "none",
            borderRadius: 14, padding: "16px 0", width: "100%",
            fontFamily: FONT_HEADING, fontWeight: 800, fontSize: 16,
            textTransform: "uppercase", cursor: locationInput.trim() ? "pointer" : "not-allowed",
            opacity: locationInput.trim() ? 1 : 0.5,
          }}
        >
          Find Mentors
        </button>
      </div>
    );
  }

  if (pipelineStatus === "error") {
    return wrapper(
      <div style={{
        background: GLASS, border: "1px solid " + GLASS_BORDER,
        borderRadius: 16, backdropFilter: "blur(16px)", padding: 24,
        textAlign: "center", minWidth: 0,
      }}>
        <p style={{ fontSize: 15, color: TEXT_MID, fontFamily: FONT_BODY, margin: 0 }}>
          Couldn&apos;t load mentors right now.
        </p>
        {pipelineError && (
          <p style={{
            marginTop: 8, fontSize: 12, fontFamily: FONT_MONO,
            color: "#ff6b6b", background: "rgba(255,255,255,0.04)",
            padding: "8px 12px", borderRadius: 8, wordBreak: "break-all",
          }}>
            {pipelineError}
          </p>
        )}
        <button
          onClick={() => setPipelineStatus("idle")}
          style={{
            marginTop: 16, background: LIME, color: NAVY, border: "none",
            borderRadius: 14, padding: "16px 0", width: "100%",
            fontFamily: FONT_HEADING, fontWeight: 800, fontSize: 16,
            textTransform: "uppercase", cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (pipelineStatus === "ready" && experts.length === 0) {
    return wrapper(
      <div style={{
        background: GLASS, border: "1px solid " + GLASS_BORDER,
        borderRadius: 16, backdropFilter: "blur(16px)", padding: 24,
        textAlign: "center", minWidth: 0,
      }}>
        <p style={{ fontSize: 15, color: TEXT_MID, fontFamily: FONT_BODY, margin: 0 }}>
          No mentors found right now. Check back soon.
        </p>
      </div>
    );
  }

  return wrapper(
    <>
      {experts.map((expert) => (
        <ExpertCard key={expert.resource_id} expert={expert} />
      ))}
      <button
        onClick={() => setPipelineStatus("idle")}
        style={{
          background: "transparent", border: "none",
          color: TEXT_MID, fontSize: 14, cursor: "pointer",
          fontFamily: FONT_BODY, padding: "12px 0", width: "100%",
        }}
      >
        Search again
      </button>
    </>
  );
}
