"use client";

import { useEffect, type ReactNode } from "react";
import type { MarketingIntent } from "@/app/types/marketingIntent";

const ATTR = "data-marketing-intent";

/** Sets `data-marketing-intent` on `<html>` for funnel-scoped CSS variables; clears on unmount. */
export function FunnelThemeShell({
  intent,
  children,
}: {
  intent: MarketingIntent | null;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    if (intent) {
      root.setAttribute(ATTR, intent);
    } else {
      root.removeAttribute(ATTR);
    }
    return () => {
      root.removeAttribute(ATTR);
    };
  }, [intent]);

  return <>{children}</>;
}
