"use client";

import { useState, useEffect } from "react";
import { ChevronRightIcon, CheckBadgeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePlanStore } from "../state/planStore";
import { AMBITION_GOAL_MAP, type PipelineExpert } from "../types/pipeline";

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
  const bio = expert.bio_snippet ? stripMarkdown(expert.bio_snippet) : null;
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
        {bio && (
          <p className="mt-1.5 text-[13px] text-text-secondary line-clamp-3">{bio}</p>
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

function SkeletonCard() {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4 animate-pulse">
      <div className="h-10 w-10 shrink-0 rounded-xl bg-border" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-1/2 rounded bg-border" />
        <div className="h-3 w-1/3 rounded bg-border" />
        <div className="h-3 w-3/4 rounded bg-border" />
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
    <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
      <div className="section-gap mx-auto flex w-full max-w-md flex-col min-w-0">
        <header>
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5" style={{ color: "var(--accent-primary)" }} aria-hidden />
            <h1 className="type-h1 text-text-primary">Who to Follow</h1>
          </div>
          <p className="mt-2 type-body font-normal text-microcopy-soft">
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
        <div className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4">
          <div className="h-8 w-8 shrink-0 rounded-full border border-border bg-muted" />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold leading-relaxed text-text-primary">
              Searching for mentors and experts…
            </p>
            <p className="mt-1 text-xs text-microcopy-soft">This takes about 30–60 seconds.</p>
          </div>
        </div>
      </>
    );
  }

  if (!ambitionType || !AMBITION_GOAL_MAP[ambitionType]) {
    return wrapper(
      <Card className="min-w-0 border border-border shadow-sm">
        <CardContent className="p-6 text-center">
          <p className="text-[15px] text-text-secondary">
            {ambitionType
              ? "Mentor search for your ambition type is coming soon."
              : "Complete the quiz so we can find mentors matched to your goal."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (pipelineStatus === "idle") {
    return wrapper(
      <Card className="min-w-0 border border-border shadow-sm">
        <CardContent className="p-6 space-y-4">
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchMentors()}
            placeholder="e.g. Vilnius, Lithuania"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-[15px] text-text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <Button
            className="w-full min-h-[44px] bg-primary text-primary-foreground hover:bg-primary-hover"
            onClick={fetchMentors}
            disabled={!locationInput.trim()}
          >
            Find Mentors
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (pipelineStatus === "error") {
    return wrapper(
      <Card className="min-w-0 border border-border shadow-sm">
        <CardContent className="p-6 text-center">
          <p className="text-[15px] text-text-secondary">Couldn&apos;t load mentors right now.</p>
          {pipelineError && (
            <p className="mt-2 text-xs font-mono text-destructive bg-muted px-3 py-2 rounded-lg break-all">
              {pipelineError}
            </p>
          )}
          <Button className="mt-4" onClick={() => setPipelineStatus("idle")}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  if (pipelineStatus === "ready" && experts.length === 0) {
    return wrapper(
      <Card className="min-w-0 border border-border shadow-sm">
        <CardContent className="p-6 text-center">
          <p className="text-[15px] text-text-secondary">
            No mentors found right now. Check back soon.
          </p>
        </CardContent>
      </Card>
    );
  }

  return wrapper(
    <>
      {experts.map((expert) => (
        <ExpertCard key={expert.resource_id} expert={expert} />
      ))}
      <Button
        variant="ghost"
        className="w-full min-h-[44px] text-text-secondary"
        onClick={() => setPipelineStatus("idle")}
      >
        Search again
      </Button>
    </>
  );
}
