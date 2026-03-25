"use client";

import Link from "next/link";
import {
  MicrophoneIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { usePlanStore } from "../state/planStore";

const features = [
  {
    href: "/structure",
    icon: MicrophoneIcon,
    label: "Brain Dump",
    description: "Voice-record a reflection and update your ambition map in real time.",
    badge: null,
    accent: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    iconBg: "bg-violet-500/15",
  },
  {
    href: "/events",
    icon: CalendarDaysIcon,
    label: "Find Events",
    description: "Discover Eventbrite, Meetup, and Luma events matched to your goal.",
    badge: null,
    accent: "bg-sky-500/10 border-sky-500/20 text-sky-400",
    iconBg: "bg-sky-500/15",
  },
  {
    href: "/mentors",
    icon: UserGroupIcon,
    label: "Who to Follow",
    description: "Experts and mentors curated around your ambition domain.",
    badge: null,
    accent: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    iconBg: "bg-emerald-500/15",
  },
  {
    href: "/tasks",
    icon: CheckCircleIcon,
    label: "Daily Tasks",
    description: "Your archetype-specific task list. Track what needs to get done today.",
    badge: null,
    accent: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    iconBg: "bg-amber-500/15",
  },
];

export default function ExplorePage() {
  const ambitionCategories = usePlanStore((s) => s.ambitionCategories);
  const pipelinePlan = usePlanStore((s) => s.pipelinePlan);

  const hasMap = ambitionCategories.length > 0;
  const hasEvents = (pipelinePlan?.recommended_events?.length ?? 0) > 0;
  const hasExperts = (pipelinePlan?.recommended_experts?.length ?? 0) > 0;

  const badges: Record<string, string | null> = {
    "/structure": hasMap ? `${ambitionCategories.length} categories` : null,
    "/events": hasEvents ? `${pipelinePlan!.recommended_events!.length} events` : null,
    "/mentors": hasExperts ? `${pipelinePlan!.recommended_experts!.length} experts` : null,
    "/tasks": null,
  };

  const badgeKeys = [
    badges["/structure"],
    badges["/events"],
    badges["/mentors"],
    badges["/tasks"],
  ];

  return (
    <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
      <div className="section-gap mx-auto flex w-full max-w-md flex-col min-w-0">

        {/* Header */}
        <header>
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" style={{ color: "var(--accent-primary)" }} aria-hidden />
            <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-tight text-foreground">Explore</h1>
          </div>
          <p className="mt-2 text-[15px] font-normal leading-relaxed text-muted-foreground">
            AI-powered tools to accelerate your path.
          </p>
        </header>

        {/* Feature cards */}
        <div className="flex flex-col gap-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            const badge = badgeKeys[i];
            return (
              <Link
                key={`${f.href}-${i}`}
                href={f.href}
                className="group flex min-w-0 items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4 transition-all hover:shadow-md active:scale-[0.98]"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                {/* Icon */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${f.iconBg}`}>
                  <Icon className={`h-5 w-5 ${f.accent.split(" ").find((c) => c.startsWith("text-"))}`} aria-hidden />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[15px] font-bold leading-snug text-foreground">
                      {f.label}
                    </p>
                    {badge && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                        style={{ background: "var(--badge-bg)", color: "var(--text-secondary)" }}
                      >
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
                    {f.description}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
