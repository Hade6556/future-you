"use client";

import { useEffect, useState } from "react";

export type CheckoutOptions = {
  trialDays: number;
  monthlyAvailable: boolean;
  annualAvailable: boolean;
};

const fallbackOnError: CheckoutOptions = {
  trialDays: 3,
  /** If the plans request fails (network, ad blockers), still show both rows; POST will validate. */
  monthlyAvailable: true,
  annualAvailable: true,
};

export function useCheckoutOptions() {
  const [options, setOptions] = useState<CheckoutOptions | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/billing/plans")
      .then(async (res) => {
        if (!res.ok) throw new Error("billing plans");
        return res.json() as Promise<CheckoutOptions>;
      })
      .then((data) => {
        if (cancelled) return;
        setOptions({
          trialDays: typeof data.trialDays === "number" ? data.trialDays : fallbackOnError.trialDays,
          monthlyAvailable: !!data.monthlyAvailable,
          annualAvailable: !!data.annualAvailable,
        });
      })
      .catch(() => {
        if (!cancelled) setOptions(fallbackOnError);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return options;
}
