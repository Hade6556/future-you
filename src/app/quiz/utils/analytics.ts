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
  purchase: { meta: "Purchase", tiktok: "CompletePayment", ga: "purchase" },
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

/** Fire once per checkout success. Idempotent via localStorage dedupe key. */
export function trackPurchase(params: {
  value: number;
  currency: string;
  plan: string;
  transactionId?: string;
}) {
  const w = getWin();
  if (!w) return;
  try {
    const key = `behavio_purchase_${params.transactionId ?? params.plan}`;
    if (w.localStorage?.getItem(key)) return;
    w.localStorage?.setItem(key, "1");
  } catch {}

  trackEvent("purchase", params);
}

export function trackLead(email: string) {
  trackEvent("email_captured", { email_provided: !!email });
}
