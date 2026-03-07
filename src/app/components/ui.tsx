"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

/* ─── GlassCard ─────────────────────────────────────────────── */

export function GlassCard({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-[32px] ${glow ? "glass-glow" : "glass"} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── SectionHeader ─────────────────────────────────────────── */

export function SectionHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[12px] font-semibold uppercase tracking-[0.3em] text-muted ${className}`}
    >
      {children}
    </p>
  );
}

/* ─── Buttons (polymorphic: button or Link) ─────────────────── */

type ButtonOnlyProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  href?: never;
};

type LinkOnlyProps = {
  children: ReactNode;
  className?: string;
  href: string;
};

export function PrimaryButton(props: ButtonOnlyProps | LinkOnlyProps) {
  const base = `inline-flex h-14 shrink-0 items-center justify-center rounded-full glass-button-primary px-8 text-[15px] font-semibold text-white transition-all duration-200 active:scale-95 hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none motion-reduce:transition-none ${props.className ?? ""}`;

  if (props.href) {
    return (
      <Link href={props.href} className={base}>
        {props.children}
      </Link>
    );
  }

  const { children, className, ...buttonProps } = props as ButtonOnlyProps;
  void className;
  return (
    <button className={base} {...buttonProps}>
      {children}
    </button>
  );
}

export function SecondaryButton(props: ButtonOnlyProps | LinkOnlyProps) {
  const base = `inline-flex h-14 shrink-0 items-center justify-center rounded-full border border-muted bg-transparent px-8 text-[15px] font-semibold text-accent-blue transition-all duration-200 active:scale-95 hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none motion-reduce:transition-none ${props.className ?? ""}`;

  if (props.href) {
    return (
      <Link href={props.href} className={base}>
        {props.children}
      </Link>
    );
  }

  const { children, className, ...buttonProps } = props as ButtonOnlyProps;
  void className;
  return (
    <button className={base} {...buttonProps}>
      {children}
    </button>
  );
}

/* ─── Tag ───────────────────────────────────────────────────── */

const tagVariants: Record<string, string> = {
  default: "border-white/8 bg-white/5 text-white/80 shadow-[0_0_8px_rgba(255,255,255,0.04)]",
  accent:
    "border-accent-blue/30 bg-accent-blue/10 text-accent-blue shadow-[0_0_8px_rgba(75,93,255,0.12)]",
  success:
    "border-[var(--color-pulse-teal)]/30 bg-[var(--color-pulse-teal)]/10 text-[var(--color-pulse-teal)] shadow-[0_0_8px_rgba(33,211,179,0.1)]",
  warning:
    "border-amber-400/30 bg-amber-400/10 text-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.1)]",
};

export function Tag({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: "default" | "accent" | "success" | "warning";
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium ${tagVariants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

