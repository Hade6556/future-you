import { createHash } from "crypto";
import type { PipelineEvent } from "@/app/types/pipeline";
import type { RawSource } from "./eventFetcher";

const JUNK_PATTERNS = [
  /\/sitemap/i,
  /\/search\?/i,
  /\/browse\?/i,
  /\.xml$/i,
  /\/feed\//i,
];

// Title patterns that indicate articles/lists/resources rather than actual events
const NON_EVENT_TITLE_PATTERNS = [
  /^\d+\s+top\s+/i,                         // "46 Top Startup..."
  /^top\s+\d+\s+/i,                         // "Top 10 Startups..."
  /\b\d+\s+best\b/i,                        // "10 best..."
  /\btips?\s+for\b/i,                       // "Tips for..."
  /\blist\s+of\b/i,                         // "List of..."
  /\bstartups?\s+to\s+watch\b/i,
  /\bjob\s+(listing|posting|opening|board)\b/i,
  /\bnewsletter\b/i,
  /\bpodcast\s+episode\b/i,
  /\bweekly\s+roundup\b/i,
];

function isNonEventTitle(title: string): boolean {
  return NON_EVENT_TITLE_PATTERNS.some((p) => p.test(title));
}

const VIRTUAL_KEYWORDS = ["online", "zoom", "webinar", "livestream", "virtual", "remote", "stream"];

// Date extraction regexes
const DATE_PATTERNS = [
  /(\d{4}-\d{2}-\d{2})/,                                 // ISO: 2025-06-01
  /(\w+ \d{1,2},?\s*\d{4})/,                             // June 1, 2025
  /(\d{1,2} \w+ \d{4})/,                                 // 1 June 2025
  /(\d{1,2}\/\d{1,2}\/\d{4})/,                           // 06/01/2025
];

// Location extraction — tries to pull the actual event city from scraped text
// Patterns ordered from most to least specific
const LOCATION_PATTERNS = [
  // "Date | City, Country"  e.g. "March 25-27 | Riga, Latvia"
  /\|\s*([A-Z][a-zA-Z\s\u00C0-\u024F]+,\s*[A-Z][a-zA-Z\s\u00C0-\u024F]+)/,
  // "in City, Country"  e.g. "taking over in Riga, Latvia"
  /\bin\s+([A-Z][a-zA-Z\s\u00C0-\u024F]+,\s*[A-Z][a-zA-Z\s\u00C0-\u024F]+)/,
  // "City, Country" standalone (≤ 40 chars)
  /\b([A-Z][a-zA-Z\u00C0-\u024F]{2,}(?:\s[A-Z][a-zA-Z\u00C0-\u024F]{1,})?,\s*[A-Z][a-zA-Z\s\u00C0-\u024F]{2,})\b/,
  // "at City"
  /\bat\s+([A-Z][a-zA-Z\s\u00C0-\u024F]{2,})/,
  // "in City" without country  e.g. "in Riga"
  /\bin\s+([A-Z][a-zA-Z\u00C0-\u024F]{2,}(?:\s[A-Z][a-zA-Z\u00C0-\u024F]{2,})?)\b/,
];

function extractLocation(text: string): string | null {
  for (const pattern of LOCATION_PATTERNS) {
    const m = text.match(pattern);
    if (m) {
      const loc = m[1].trim();
      if (loc.length <= 50) return loc;
    }
  }
  return null;
}

// Price extraction
const FREE_PATTERN = /\bfree\b/i;
const PRICE_PATTERN = /\$\s*([\d,]+(?:\.\d{1,2})?)/g;

function extractDate(text: string): string | null {
  for (const pattern of DATE_PATTERNS) {
    const m = text.match(pattern);
    if (m) return m[1];
  }
  return null;
}

function extractPrice(text: string): string | null {
  if (FREE_PATTERN.test(text)) return "Free";
  const matches = [...text.matchAll(PRICE_PATTERN)];
  if (matches.length === 0) return null;
  const prices = matches.map((m) => parseFloat(m[1].replace(",", "")));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `$${min}` : `$${min}–$${max}`;
}

function isVirtual(text: string): boolean {
  const lower = text.toLowerCase();
  return VIRTUAL_KEYWORDS.some((kw) => lower.includes(kw));
}

function isJunkUrl(url: string): boolean {
  if (JUNK_PATTERNS.some((p) => p.test(url))) return true;
  // LinkedIn: only accept actual event pages (/events/), reject posts/articles/profiles/company pages
  if (url.includes("linkedin.com") && !url.includes("/events/")) return true;
  // Facebook: only accept actual event pages (/events/), reject pages/groups/posts
  if (url.includes("facebook.com") && !url.includes("/events/")) return true;
  // Meetup: accept event pages and group pages (groups often host events)
  if (url.includes("meetup.com") && (url.includes("/topics/") || url.includes("/categories/"))) return true;
  return false;
}

// Drop results whose title contains a year more than 1 year in the past
// (catches Reddit threads like "Share your startup - October 2018")
function hasStaleTitleYear(title: string): boolean {
  const m = title.match(/\b(20\d{2})\b/);
  if (!m) return false;
  return parseInt(m[1]) < new Date().getFullYear() - 1;
}


function isStale(dateStr: string | null): boolean {
  if (!dateStr) return false;
  try {
    const d = new Date(dateStr);
    const cutoff = new Date();
    return d < cutoff;
  } catch {
    return false;
  }
}

function makeEventId(title: string, date: string | null, location: string): string {
  const key = [
    title.toLowerCase().replace(/\s+/g, " ").trim(),
    date ?? "",
    location.toLowerCase().trim(),
  ].join("|");
  return createHash("sha256").update(key).digest("hex").slice(0, 16);
}

const MIN_RELEVANCE_SCORE = 1;

function scoreRelevance(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((score, kw) => lower.includes(kw.toLowerCase()) ? score + 1 : score, 0);
}

export function normalizeEvents(
  sources: RawSource[],
  goalCategory: string,
  location: string,
  keywords: string[] = []
): PipelineEvent[] {
  const seen = new Set<string>();
  const candidates: PipelineEvent[] = [];

  let stats = { total: 0, junkUrl: 0, noTitle: 0, staleTitle: 0, nonEvent: 0, staleDate: 0, noKeyword: 0, deduped: 0, kept: 0 };

  for (const { sourceName, results } of sources) {
    for (const item of results) {
      stats.total++;
      const url = item.url ?? "";
      if (!url || isJunkUrl(url)) { stats.junkUrl++; continue; }

      const title = (item.title ?? "").trim();
      if (!title) { stats.noTitle++; continue; }
      if (hasStaleTitleYear(title)) { stats.staleTitle++; continue; }
      if (isNonEventTitle(title)) { stats.nonEvent++; continue; }

      const fullText = [title, item.description ?? "", item.markdown ?? ""].join(" ");
      const date = extractDate(fullText);
      const virtual = isVirtual(fullText);

      if (isStale(date)) { stats.staleDate++; continue; }

      // Drop events with no keyword overlap (skip if text too short to evaluate)
      if (keywords.length > 0 && fullText.length > 200) {
        if (scoreRelevance(fullText, keywords) < MIN_RELEVANCE_SCORE) { stats.noKeyword++; continue; }
      }

      // Use extracted location from text; fall back to user's location
      const eventLocation = extractLocation(fullText);

      const eventId = makeEventId(title, date, eventLocation ?? "");
      if (seen.has(eventId)) { stats.deduped++; continue; }
      seen.add(eventId);
      stats.kept++;

      candidates.push({
        event_id: eventId,
        title,
        description: item.description ?? null,
        start_date: date,
        location: eventLocation,
        virtual,
        price_label: extractPrice(fullText),
        image_url: null,
        goal_category: goalCategory,
        source_name: sourceName,
        source_url: url,
      });
    }
  }

  console.log(`[normalizer] ${JSON.stringify(stats)}`);

  // Round-robin across sources to ensure diversity
  const bySource = new Map<string, PipelineEvent[]>();
  for (const event of candidates) {
    const bucket = bySource.get(event.source_name) ?? [];
    bucket.push(event);
    bySource.set(event.source_name, bucket);
  }

  const result: PipelineEvent[] = [];
  const queues = [...bySource.values()];
  let i = 0;
  while (result.length < 15 && queues.some((q) => q.length > 0)) {
    const queue = queues[i % queues.length];
    if (queue.length > 0) result.push(queue.shift()!);
    i++;
  }
  return result;
}
