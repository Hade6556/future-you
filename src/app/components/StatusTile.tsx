"use client";

import Link from "next/link";
import { ReactNode } from "react";

export type TileStatus = "locked" | "ready" | "in_progress";

const statusLabel: Record<TileStatus, string> = {
  locked: "Locked",
  ready: "Ready",
  in_progress: "In progress",
};

type StatusTileProps = {
  title: string;
  status: TileStatus;
  href: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export function StatusTile({
  title,
  status,
  href,
  icon,
  disabled,
}: StatusTileProps) {
  const content = (
    <div className="flex max-w-[344px] flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-opacity duration-150 hover:opacity-95">
      {icon && (
        <div
          className={`flex h-10 w-10 items-center justify-center ${status === "ready" ? "text-accent-cool" : status === "in_progress" ? "text-accent-cool/70" : "text-muted"}`}
        >
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-[24px] font-medium tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-[13px] text-muted">{statusLabel[status]}</p>
      </div>
    </div>
  );

  if (disabled) {
    return (
      <div className="cursor-not-allowed opacity-60" aria-disabled>
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
