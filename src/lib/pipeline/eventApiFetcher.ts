/**
 * Event API Fetcher — replaces Firecrawl scraping with structured API calls.
 * Uses SerpAPI Google Events as the primary source (structured JSON, reliable).
 * Falls back to Eventbrite API if available.
 */

export type ApiEvent = {
  title: string;
  description: string | null;
  start_date: string | null;
  location: string | null;
  link: string;
  source: string;
  virtual: boolean;
  price: string | null;
  image_url: string | null;
};

const VIRTUAL_KEYWORDS = ["online", "zoom", "webinar", "virtual", "remote", "livestream"];

/** Hard cap on SerpAPI round-trips per single event fetch. */
const MAX_SERP_CALLS = 5;

/** SerpAPI documents `SERPAPI_KEY`; accept common alternates from .env typos. */
function getSerpApiKey(): string | undefined {
  return (
    process.env.SERPAPI_KEY ||
    process.env.SERP_API_KEY ||
    process.env.SERAPI_KEY ||
    undefined
  );
}

/** Exposed for `/api/events` so the client can explain empty results. */
export function isSerpEventsConfigured(): boolean {
  return !!getSerpApiKey();
}

type SerpEventResult = {
  title?: string;
  description?: string;
  date?: { start_date?: string; when?: string };
  address?: string[];
  venue?: { name?: string };
  link?: string;
  thumbnail?: string;
  image?: string;
  ticket_info?: Array<{ link?: string; price?: string }>;
  event_location_map?: { link?: string };
};

function ticketInfoFirstLink(ticketInfo: unknown): string | undefined {
  if (!Array.isArray(ticketInfo)) return undefined;
  for (const item of ticketInfo) {
    if (item && typeof item === "object" && "link" in item) {
      const l = String((item as { link?: string }).link ?? "").trim();
      if (l) return l;
    }
  }
  return undefined;
}

function resolveSerpEventLink(evt: SerpEventResult): string {
  return (
    evt.link?.trim() ||
    ticketInfoFirstLink(evt.ticket_info) ||
    evt.event_location_map?.link?.trim() ||
    ""
  );
}

/** Commas in "City, Country" in Google Events queries are a known SerpAPI/Google pain point — use spaces. */
function normalizeLocationForQuery(location: string): string {
  return location.replace(/,/g, " ").replace(/\s+/g, " ").trim();
}

function isVirtual(text: string): boolean {
  const lower = text.toLowerCase();
  return VIRTUAL_KEYWORDS.some((kw) => lower.includes(kw));
}

// ── SerpAPI Google Events ───────────────────────────────────────────────────

function pushSerpEventsInto(
  eventsResults: SerpEventResult[],
  out: ApiEvent[],
  seenTitles: Set<string>
): void {
  for (const evt of eventsResults) {
    const title = (evt.title ?? "").trim();
    if (!title) continue;
    const key = title.toLowerCase().replace(/\s+/g, " ");
    if (seenTitles.has(key)) continue;
    seenTitles.add(key);

    const link = resolveSerpEventLink(evt);
    const fullText = [title, evt.description ?? "", evt.address?.join(" ") ?? ""].join(" ");
    const price =
      Array.isArray(evt.ticket_info) && evt.ticket_info[0] && typeof evt.ticket_info[0] === "object"
        ? (evt.ticket_info[0] as { price?: string }).price ?? null
        : null;

    out.push({
      title,
      description: evt.description ?? null,
      start_date: evt.date?.start_date ?? evt.date?.when ?? null,
      location: evt.address?.join(", ") ?? evt.venue?.name ?? null,
      link,
      source: extractSourceName(link),
      virtual: isVirtual(fullText),
      price,
      image_url: evt.thumbnail ?? evt.image ?? null,
    });
  }
}

async function fetchSerpGoogleEventsOnce(
  q: string,
  apiKey: string
): Promise<{ events: SerpEventResult[]; error?: string; state?: string }> {
  const params = new URLSearchParams({
    engine: "google_events",
    q,
    api_key: apiKey,
    hl: "en",
  });

  const res = await fetch(`https://serpapi.com/search?${params.toString()}`, {
    signal: AbortSignal.timeout(12_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { events: [], error: `HTTP ${res.status}: ${body.slice(0, 180)}` };
  }

  const data = (await res.json()) as {
    error?: string;
    events_results?: SerpEventResult[];
    search_information?: { events_results_state?: string };
  };

  if (data.error) {
    return { events: [], error: data.error };
  }

  const events = data.events_results ?? [];
  const state = data.search_information?.events_results_state;
  return { events, state };
}

async function fetchSerpApiEvents(
  queries: string[],
  location: string,
  appendLocation: boolean = true
): Promise<ApiEvent[]> {
  const apiKey = getSerpApiKey();
  if (!apiKey) {
    console.warn(
      "[eventApiFetcher] No SerpAPI key \u2014 set SERPAPI_KEY (or SERP_API_KEY) in .env.local and restart the dev server"
    );
    return [];
  }

  const normLoc = normalizeLocationForQuery(location);
  const results: ApiEvent[] = [];
  const seenTitles = new Set<string>();
  let budget = MAX_SERP_CALLS;

  const runQuery = async (fullQ: string, label: string): Promise<boolean> => {
    if (budget <= 0) return false;
    budget--;
    try {
      const { events, error, state } = await fetchSerpGoogleEventsOnce(fullQ, apiKey);
      if (error) {
        console.warn(`[eventApiFetcher] SerpAPI (${label}) q="${fullQ.slice(0, 80)}\u2026": ${error}`);
        return false;
      }
      if (events.length === 0 && state) {
        console.log(`[eventApiFetcher] SerpAPI (${label}) 0 events, state=${state} q="${fullQ.slice(0, 72)}\u2026"`);
      }
      pushSerpEventsInto(events, results, seenTitles);
      return events.length > 0;
    } catch (err) {
      console.warn(`[eventApiFetcher] SerpAPI (${label}) request failed:`, err);
      return false;
    }
  };

  for (const query of queries) {
    if (budget <= 0) break;
    const fullQ = appendLocation && normLoc ? `${query} ${normLoc}` : query;
    await runQuery(fullQ, appendLocation ? "goal query" : "no-location");
  }

  // No generic fallback — showing random local events (concerts, festivals)
  // is worse than showing nothing when goal-specific queries return zero.

  console.log(`[eventApiFetcher] used ${MAX_SERP_CALLS - budget}/${MAX_SERP_CALLS} SerpAPI calls`);
  return results;
}

// ── Eventbrite API ──────────────────────────────────────────────────────────

async function fetchEventbriteEvents(
  queries: string[],
  location: string
): Promise<ApiEvent[]> {
  const token = process.env.EVENTBRITE_TOKEN;
  if (!token) {
    console.warn("[eventApiFetcher] EVENTBRITE_TOKEN not set, skipping Eventbrite");
    return [];
  }

  const results: ApiEvent[] = [];

  for (const query of queries) {
    try {
      const params = new URLSearchParams({
        "q": query,
        "location.address": location,
        "expand": "venue",
        "sort_by": "date",
      });

      const res = await fetch(
        `https://www.eventbriteapi.com/v3/events/search/?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(10_000),
        }
      );

      if (!res.ok) continue;

      const data = await res.json();
      for (const evt of data.events ?? []) {
        const venueName = evt.venue?.name ?? "";
        const venueCity = evt.venue?.address?.city ?? "";
        const loc = [venueName, venueCity].filter(Boolean).join(", ") || null;
        const fullText = [evt.name?.text ?? "", evt.description?.text ?? ""].join(" ");

        results.push({
          title: evt.name?.text ?? "",
          description: evt.description?.text?.slice(0, 300) ?? null,
          start_date: evt.start?.local ?? null,
          location: loc,
          link: evt.url ?? "",
          source: "eventbrite",
          virtual: evt.online_event ?? isVirtual(fullText),
          price: evt.is_free ? "Free" : null,
          image_url: evt.logo?.url ?? null,
        });
      }
    } catch (err) {
      console.warn(`[eventApiFetcher] Eventbrite error for query "${query}":`, err);
    }
  }

  return results;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function extractSourceName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    if (hostname.includes("eventbrite")) return "eventbrite";
    if (hostname.includes("meetup")) return "meetup";
    if (hostname.includes("lu.ma")) return "luma";
    if (hostname.includes("ticketmaster")) return "ticketmaster";
    return hostname.split(".")[0];
  } catch {
    return "web";
  }
}

// ── Main entry point ────────────────────────────────────────────────────────

export async function fetchEventsFromApis(
  queries: string[],
  location: string,
  appendLocation: boolean = true
): Promise<ApiEvent[]> {
  const [serpResults, eventbriteResults] = await Promise.all([
    fetchSerpApiEvents(queries, location, appendLocation),
    appendLocation ? fetchEventbriteEvents(queries, location) : Promise.resolve([]),
  ]);

  const all = [...serpResults, ...eventbriteResults];
  console.log(`[eventApiFetcher] fetched ${serpResults.length} SerpAPI + ${eventbriteResults.length} Eventbrite = ${all.length} total`);

  const seen = new Set<string>();
  const deduped: ApiEvent[] = [];
  for (const evt of all) {
    const key = evt.title.toLowerCase().replace(/\s+/g, " ").trim();
    if (!seen.has(key) && evt.title) {
      seen.add(key);
      deduped.push(evt);
    }
  }

  return deduped;
}
