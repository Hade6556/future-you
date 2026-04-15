"use client";

import Link from "next/link";
import { ACCENT, TEXT_HI, TEXT_MID } from "@/app/theme";

export type ActionState = "active" | "done" | "overdue";

export function ActionItem({
  title,
  state,
  href,
}: {
  title: string;
  state: ActionState;
  href: string;
}) {
  const accent =
    state === "active"  ? ACCENT
    : state === "done"  ? "rgba(76,175,125,0.40)"
    : /* overdue */       "rgba(255,85,85,0.60)";

  const textColor =
    state === "active"  ? TEXT_HI
    : state === "done"  ? "rgba(160,180,210,0.50)"
    : /* overdue */       TEXT_MID;

  return (
    <Link href={href} style={{ display: "block", textDecoration: "none" }}>
      <div
        style={{
          position: "relative",
          background: "rgba(255,255,255,0.05)",
          borderRadius: 14,
          padding: "14px 16px 14px 22px",
          border: "1px solid rgba(255,255,255,0.10)",
          transition: "background 0.15s",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 8,
            bottom: 8,
            width: 2,
            borderRadius: 1,
            background: accent,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: textColor,
            textDecoration: state === "done" ? "line-through" : "none",
          }}
        >
          {title}
        </span>
      </div>
    </Link>
  );
}
