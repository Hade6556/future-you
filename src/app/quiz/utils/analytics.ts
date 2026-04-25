/**
 * Single entry point for analytics. Fans out to:
 * - GTM dataLayer
 * - Meta Pixel (fbq)
 * - TikTok Pixel (ttq)
 * - Google Analytics (gtag)
 *
 * Each platform is silently skipped if its pixel isn't loaded.
 */

type Win = Window & {
  dataLayer?: unknown[];
  fbq?: (...args: unknown[]) => void;
  ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
  gtag?: (...args: unknown[]) => void;
};

const STANDARD_EVENT_MAP: Record<
  string,
  { meta?: string; tiktok?: string; ga?: string }
> = {
  funnel_start: { meta: "ViewContent", tiktok: "ViewContent" },
  paywall_viewed: { meta: "ViewContent", tiktok: "ViewContent" },
  paywall_cta_clicked: { meta: "InitiateCheckout", tiktok: "InitiateCheckout" },
  email_captured: { meta: "Lead", tiktok: "SubmitForm" },
  quiz_completed: { meta: "CompleteRegistration", tiktok: "CompleteRegistration" },
  // Stripe checkout completion — paired with server-side CAPI StartTrial via eventID.
  // The actual paid conversion (`Subscribe`) is server-only via invoice.payment_succeeded
  // since the user isn't on a page when the trial converts 3 days later.
  start_trial: { meta: "StartTrial", tiktok: "StartTrial" },
};

function getWin(): Win | null {
  if (typeof window === "undefined") return null;
  return window as unknown as Win;
}

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  const w = getWin();
  if (!w) return;

  try {
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({ event: name, ...properties });
  } catch {}

  const mapping = STANDARD_EVENT_MAP[name];
  if (mapping) {
    try {
      if (mapping.meta && w.fbq) w.fbq("track", mapping.meta, properties ?? {});
    } catch {}
    try {
      if (mapping.tiktok && w.ttq) w.ttq.track(mapping.tiktok, properties ?? {});
    } catch {}
    try {
      if (mapping.ga && w.gtag) w.gtag("event", mapping.ga, properties ?? {});
    } catch {}
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[analytics] ${name}`, properties ?? "");
  }
}

export function trackScreenViewed(screenName: string) {
  trackEvent("screen_viewed", { screen: screenName });
}

export function trackAnswerSelected(
  screenName: string,
  answer: string | string[],
) {
  trackEvent("answer_selected", { screen: screenName, answer });
}

/**
 * Fire once per checkout success. Idempotent via localStorage dedupe key.
 *
 * Sends the Meta StartTrial event with an explicit `eventID` (the Stripe
 * checkout session id) so it deduplicates against the server-side CAPI
 * StartTrial fired from the Stripe webhook. The dataLayer + ttq pushes go
 * through the standard fan-out.
 */
export function trackStartTrial(params: {
  value: number;
  currency: string;
  plan: string;
  /** Stripe checkout session id — MUST match the server-side eventId for dedup. */
  transactionId?: string;
}) {
  const w = getWin();
  if (!w) return;

  try {
    const key = `behavio_start_trial_${params.transactionId ?? params.plan}`;
    if (w.localStorage?.getItem(key)) return;
    w.localStorage?.setItem(key, "1");
  } catch {}

  // Direct fbq call with eventID for dedup; the standard fan-out doesn't
  // know how to attach eventID per event so we bypass it for the meta side.
  try {
    if (w.fbq) {
      w.fbq(
        "track",
        "StartTrial",
        { value: params.value, currency: params.currency, content_ids: [params.plan] },
        params.transactionId ? { eventID: params.transactionId } : undefined,
      );
    }
  } catch {}

  // Also push to dataLayer / tiktok / ga via the standard mapping.
  trackEvent("start_trial", params);
}

/** @deprecated Use trackStartTrial — kept for backwards compatibility. */
export function trackPurchase(params: {
  value: number;
  currency: string;
  plan: string;
  transactionId?: string;
}) {
  trackStartTrial(params);
}

export function trackLead(email: string) {
  trackEvent("email_captured", { email_provided: !!email });
}
