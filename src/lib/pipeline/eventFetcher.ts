import { FirecrawlAppV1 } from "@mendable/firecrawl-js";
import type { GoalConfig } from "./goalParser";

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export type RawSource = {
  sourceName: string;
  results: Array<{
    url: string;
    title?: string;
    description?: string;
    markdown?: string;
  }>;
};

const SEARCH_LIMIT = 25;

// Sources that map to site-specific Firecrawl searches
const SOURCE_SITES: Record<string, string> = {
  eventbrite: "site:eventbrite.com",
  meetup: "site:meetup.com",
  ticketmaster: "site:ticketmaster.com",
  strava: "site:strava.com OR site:active.com",
  founders_network: "site:foundersnetwork.com",
  luma: "site:lu.ma",
  // linkedin and facebook removed: their URLs never pass the /events/ junk filter,
  // so they contribute 0 results while consuming API quota
  f6s: "site:f6s.com",
  garysguide: "site:garysguide.com",
  allevents: "site:allevents.in",
};

export async function fetchEvents(
  goalConfig: GoalConfig,
  location: string
): Promise<RawSource[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not set");

  const app = new FirecrawlAppV1({ apiKey });

  const entries = Object.entries(goalConfig.search_queries).filter(
    ([, query]) => query !== null
  ) as [string, string][];

  const fetches = entries.map(async ([sourceName, baseQuery]) => {
    const siteFilter = SOURCE_SITES[sourceName] ?? "";
    const currentYear = new Date().getFullYear();
    const query = `upcoming ${baseQuery} ${location} ${currentYear} ${siteFilter}`.trim();
    try {
      const response = await app.search(query, { limit: SEARCH_LIMIT });
      const results = Array.isArray(response)
        ? response
        : (response?.web ?? response?.data ?? response?.results ?? []);
      console.log(`[eventFetcher] ${sourceName}: ${results.length} raw results`);
      return { sourceName, results };
    } catch (err) {
      console.warn(`[eventFetcher] Source "${sourceName}" failed:`, err);
      return { sourceName, results: [] };
    }
  });

  const settled = await Promise.allSettled(fetches);
  return settled
    .filter((r): r is PromiseFulfilledResult<RawSource> => r.status === "fulfilled")
    .map((r) => r.value);
}

// Retry specific sources with a broader fallback query built from goal keywords
export async function fetchEventsForSources(
  sourceNames: string[],
  goalConfig: GoalConfig,
  location: string
): Promise<RawSource[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not set");

  const app = new FirecrawlAppV1({ apiKey });
  const currentYear = new Date().getFullYear();

  // Build a broad fallback query from goal keywords
  const keywordSubset = shuffleArray(goalConfig.keywords).slice(0, 4).join(" ");
  const fallbackBase = `${keywordSubset} event workshop`;

  const fetches = sourceNames.map(async (sourceName) => {
    const siteFilter = SOURCE_SITES[sourceName] ?? "";
    const query = `${fallbackBase} ${location} ${currentYear} ${siteFilter}`.trim();
    try {
      const response = await app.search(query, { limit: SEARCH_LIMIT });
      const results = Array.isArray(response)
        ? response
        : (response?.web ?? response?.data ?? response?.results ?? []);
      console.log(`[eventFetcher] retry ${sourceName}: ${results.length} raw results`);
      return { sourceName, results };
    } catch (err) {
      console.warn(`[eventFetcher] Retry source "${sourceName}" failed:`, err);
      return { sourceName, results: [] };
    }
  });

  const settled = await Promise.allSettled(fetches);
  return settled
    .filter((r): r is PromiseFulfilledResult<RawSource> => r.status === "fulfilled")
    .map((r) => r.value);
}
