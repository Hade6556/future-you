import { createHash } from "crypto";

/**
 * Meta Conversions API server helper.
 *
 * Posts to https://graph.facebook.com/v21.0/{PIXEL}/events with hashed
 * user_data. Pairs with the browser-side fbq via `eventId` for dedup —
 * caller MUST pass the same eventId on both sides (we use Stripe IDs:
 * checkout session.id for StartTrial, invoice.id for Subscribe).
 *
 * Silent no-op when META_ACCESS_TOKEN or pixel ID is missing so dev/local
 * builds don't error.
 *
 * Env:
 *   META_ACCESS_TOKEN          — generate in Events Manager → Settings → CAPI
 *   META_PIXEL_ID              — server-side pixel ID (falls back to NEXT_PUBLIC_META_PIXEL_ID)
 *   META_TEST_EVENT_CODE       — optional, attaches to events for Events Manager → Test Events
 */

const GRAPH_API_VERSION = "v21.0";

function hashSha256(input: string): string {
  return createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
}

function getPixelId(): string | null {
  return (
    (process.env.META_PIXEL_ID ?? "").trim() ||
    (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").trim() ||
    null
  );
}

export type MetaEventInput = {
  /** "StartTrial", "Subscribe", "Purchase", etc. */
  eventName: string;
  /** Stripe ID used for client/server dedup. session.id or invoice.id. */
  eventId: string;
  /** Page URL where the event would have been seen. */
  eventSourceUrl?: string;
  /** Best-effort caller fields. */
  email?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  /** From Stripe metadata or attribution params if available. */
  fbc?: string | null; // _fbc cookie value, format: fb.1.<ts>.<fbclid>
  fbp?: string | null; // _fbp cookie value
  /** Monetary fields. value should be in major units (e.g. 44.00, not 4400). */
  value?: number;
  currency?: string;
  /** Used by Meta to estimate downstream LTV for optimisation. */
  predictedLtv?: number;
  /** Stripe plan key or product id. */
  contentIds?: string[];
};

export async function sendMetaEvent(input: MetaEventInput): Promise<void> {
  const accessToken = (process.env.META_ACCESS_TOKEN ?? "").trim();
  const pixelId = getPixelId();

  if (!accessToken || !pixelId) {
    console.warn(
      `[meta-capi] skipped ${input.eventName} — META_ACCESS_TOKEN or pixel ID not set`,
    );
    return;
  }

  const userData: Record<string, unknown> = {};
  if (input.email) userData.em = [hashSha256(input.email)];
  if (input.clientIpAddress) userData.client_ip_address = input.clientIpAddress;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;
  if (input.fbc) userData.fbc = input.fbc;
  if (input.fbp) userData.fbp = input.fbp;

  const customData: Record<string, unknown> = {};
  if (typeof input.value === "number") customData.value = input.value;
  if (input.currency) customData.currency = input.currency.toUpperCase();
  if (typeof input.predictedLtv === "number") customData.predicted_ltv = input.predictedLtv;
  if (input.contentIds && input.contentIds.length > 0) {
    customData.content_ids = input.contentIds;
    customData.content_type = "subscription";
  }

  const event: Record<string, unknown> = {
    event_name: input.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    action_source: "website",
    user_data: userData,
    custom_data: customData,
  };
  if (input.eventSourceUrl) event.event_source_url = input.eventSourceUrl;

  const body: Record<string, unknown> = {
    data: [event],
    access_token: accessToken,
  };
  const testCode = (process.env.META_TEST_EVENT_CODE ?? "").trim();
  if (testCode) body.test_event_code = testCode;

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error(
        `[meta-capi] ${input.eventName} HTTP ${res.status} eventId=${input.eventId}: ${text.slice(0, 400)}`,
      );
      return;
    }
    console.log(
      `[meta-capi] ${input.eventName} ok eventId=${input.eventId}${testCode ? ` (test=${testCode})` : ""} → ${text.slice(0, 200)}`,
    );
  } catch (err) {
    console.error(`[meta-capi] ${input.eventName} fetch failed eventId=${input.eventId}:`, err);
  }
}
