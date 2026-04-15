"use client";

import { useEffect, useState } from "react";

export type CheckoutOptions = {
  trialDays: number;
  monthlyAvailable: boolean;
  annualAvailable: boolean;
};

const fallback: CheckoutOptions = {
  trialDays: 7,
  monthlyAvailable: false,
  annualAvailable: false,
};

export function useCheckoutOptions() {
  const [options, setOptions] = useState<CheckoutOptions | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/checkout")
      .then(async (res) => {
        if (!res.ok) throw new Error("checkout options");
        return res.json() as Promise<CheckoutOptions>;
      })
      .then((data) => {
        if (cancelled) return;
        setOptions({
          trialDays: typeof data.trialDays === "number" ? data.trialDays : fallback.trialDays,
          monthlyAvailable: !!data.monthlyAvailable,
          annualAvailable: !!data.annualAvailable,
        });
      })
      .catch(() => {
        if (!cancelled) setOptions(fallback);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return options;
}
