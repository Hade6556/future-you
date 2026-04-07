"use client";

import { useState, type CSSProperties } from "react";
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

const LIME = "#C8FF00";
const TEXT_HI = "rgba(235,242,255,0.92)";
const TEXT_MID = "rgba(120,155,195,0.75)";
const TEXT_LO = "rgba(120,155,195,0.40)";
const GLASS = "rgba(255,255,255,0.07)";
const GLASS_BORDER = "rgba(255,255,255,0.14)";

const features = [
  {
    href: "/structure",
    icon: MicrophoneIcon,
    label: "Brain Dump",
    description: "Voice-record a reflection and update your ambition map in real time.",
    badge: null,
  },
  {
    href: "/events",
    icon: CalendarDaysIcon,
    label: "Find Events",
    description: "Discover Eventbrite, Meetup, and Luma events matched to your goal.",
    badge: null,
  },
  {
    href: "/mentors",
    icon: UserGroupIcon,
    label: "Who to Follow",
    description: "Experts and mentors curated around your ambition domain.",
    badge: null,
  },
  {
    href: "/tasks",
    icon: CheckCircleIcon,
    label: "Daily Tasks",
    description: "Your archetype-specific task list. Track what needs to get done today.",
    badge: null,
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

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const headingFont: CSSProperties = {
    fontFamily: "var(--font-barlow-condensed), sans-serif",
    fontWeight: 800,
    fontStyle: "italic",
    color: TEXT_HI,
  };

  const bodyFont: CSSProperties = {
    fontFamily: "var(--font-body), Georgia, serif",
    color: TEXT_MID,
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#060912",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "9rem",
        paddingTop: "max(3.5rem, env(safe-area-inset-top, 3.5rem))",
        paddingLeft: "var(--content-padding, 20px)",
        paddingRight: "var(--content-padding, 20px)",
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
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 448,
          margin: "0 auto",
          minWidth: 0,
          gap: 24,
          paddingTop: 52,
        }}
      >
        <header>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SparklesIcon
              style={{ width: 22, height: 22, color: LIME, flexShrink: 0 }}
              aria-hidden
            />
            <h1
              style={{
                ...headingFont,
                fontSize: 38,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Explore
            </h1>
          </div>
          <p
            style={{
              ...bodyFont,
              margin: "10px 0 0",
              fontSize: 15,
              lineHeight: 1.55,
              fontWeight: 400,
            }}
          >
            AI-powered tools to accelerate your path.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            const badge = badgeKeys[i];
            const isHovered = hoveredCard === i;
            return (
              <Link
                key={`${f.href}-${i}`}
                href={f.href}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  display: "flex",
                  minWidth: 0,
                  alignItems: "center",
                  gap: 16,
                  borderRadius: 16,
                  padding: "16px 18px",
                  textDecoration: "none",
                  background: GLASS,
                  border: `1px solid ${isHovered ? "rgba(255,255,255,0.22)" : GLASS_BORDER}`,
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: isHovered
                    ? "0 8px 28px rgba(0,0,0,0.35)"
                    : "0 2px 12px rgba(0,0,0,0.2)",
                  transform: isHovered ? "translateY(-1px)" : "none",
                  transition:
                    "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    height: 48,
                    width: 48,
                    flexShrink: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    background: "rgba(200,255,0,0.1)",
                    border: "1px solid rgba(200,255,0,0.18)",
                  }}
                >
                  <Icon
                    style={{ width: 22, height: 22, color: LIME }}
                    aria-hidden
                  />
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-barlow-condensed), sans-serif",
                        fontWeight: 800,
                        fontStyle: "italic",
                        fontSize: 17,
                        lineHeight: 1.25,
                        color: TEXT_HI,
                        margin: 0,
                      }}
                    >
                      {f.label}
                    </p>
                    {badge && (
                      <span
                        style={{
                          display: "inline-block",
                          borderRadius: 999,
                          padding: "4px 10px",
                          fontSize: 13,
                          fontWeight: 700,
                          letterSpacing: "0.02em",
                          fontFamily: "var(--font-barlow-condensed), sans-serif",
                          background: LIME,
                          color: "#060912",
                        }}
                      >
                        {badge}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      ...bodyFont,
                      margin: "6px 0 0",
                      fontSize: 13,
                      lineHeight: 1.4,
                    }}
                  >
                    {f.description}
                  </p>
                </div>

                <ChevronRightIcon
                  style={{
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                    color: TEXT_LO,
                    transform: isHovered ? "translateX(3px)" : "none",
                    transition: "transform 0.2s ease",
                  }}
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
