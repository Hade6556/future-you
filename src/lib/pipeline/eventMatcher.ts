/**
 * AI-powered event matching — uses Claude to generate search queries
 * and score event relevance against the user's goal.
 */

import Anthropic from "@anthropic-ai/sdk";
import { createHash } from "crypto";
import type { PipelineEvent } from "@/app/types/pipeline";
import type { EventSearchContext } from "@/lib/events/resolveEventGoal";
import { fetchEventsFromApis, type ApiEvent } from "./eventApiFetcher";

const anthropic = new Anthropic();

/**
 * AI fallback: generate search queries when no curated theme matched.
 */
async function generateSearchQueries(goal: string, location: string): Promise<string[]> {
  try {
    const resp = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Generate exactly 4 short event search queries for someone whose goal is: "${goal}" in ${location}.
Return ONLY a JSON array of 4 strings. Each query should be 3-6 words, specific to real events (workshops, meetups, conferences, classes). Do NOT include city or country names — location is added automatically. Example: ["startup pitch night","tech entrepreneur meetup","business networking event","side hustle workshop"]`,
        },
      ],
    });

    const text = resp.content[0].type === "text" ? resp.content[0].text : "";
    const match = text.match(/\[[\s\S]*?\]/);
    if (match) {
      const queries = JSON.parse(match[0]) as string[];
      if (Array.isArray(queries) && queries.length > 0) {
        return queries.slice(0, 4);
      }
    }
  } catch (err) {
    console.warn("[eventMatcher] Failed to generate queries via AI, using fallback:", err);
  }

  return [
    `${goal} workshop`,
    `${goal} meetup`,
    `${goal} class`,
    `${goal} event`,
  ];
}

/**
 * Score events for relevance using Claude.
 */
async function scoreEventsWithAI(
  events: ApiEvent[],
  goalRaw: string,
  scoringHint: string,
  location: string,
): Promise<Array<ApiEvent & { relevanceScore: number }>> {
  if (events.length === 0) return [];

  const eventSummaries = events.slice(0, 20).map((e, i) => ({
    i,
    t: e.title,
    d: (e.description ?? "").slice(0, 120),
    l: e.location ?? "unknown",
  }));

  try {
    const resp = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `The user's goal is: "${goalRaw}". Context: ${scoringHint}.

Score each event's relevance to THIS SPECIFIC GOAL on 0-100.
Return ONLY a JSON array of objects with "i" (index) and "s" (score 0-100).

Scoring guide:
- 80-100: Directly helps achieve the goal
- 50-79: Clearly related skill/topic or community
- 30-49: Tangentially related — user might still benefit (networking, adjacent skills, motivation)
- 0-29: Unrelated topic entirely

Lean toward inclusion for adjacent topics. A user pursuing "${goalRaw}" benefits from communities, networking, and adjacent skills, not only events whose title literally restates the goal.

Events: ${JSON.stringify(eventSummaries)}`,
        },
      ],
    });

    const text = resp.content[0].type === "text" ? resp.content[0].text : "";
    const match = text.match(/\[[\s\S]*?\]/);
    if (match) {
      const scores = JSON.parse(match[0]) as Array<{ i: number; s: number }>;
      const valid = scores.filter((s) => s.i >= 0 && s.i < events.length);
      const sorted = valid.slice().sort((a, b) => b.s - a.s);

      console.log(`[eventMatcher] Scores: ${JSON.stringify(sorted.map(s => ({ i: s.i, s: s.s, t: events[s.i]?.title?.slice(0, 40) })))}`);

      const strict = sorted.filter((s) => s.s >= 30);
      // If strict filter drops everything, surface the top candidates anyway —
      // showing the model's best guesses is better than an empty list.
      const chosen = strict.length > 0 ? strict : sorted.slice(0, 6);
      return chosen.map((s) => ({ ...events[s.i], relevanceScore: s.s }));
    }
  } catch (err) {
    console.warn("[eventMatcher] AI scoring failed, returning all events:", err);
  }

  return events.map((e) => ({ ...e, relevanceScore: 50 }));
}

function makeEventId(title: string, date: string | null, location: string): string {
  const key = [
    title.toLowerCase().replace(/\s+/g, " ").trim(),
    date ?? "",
    location.toLowerCase().trim(),
  ].join("|");
  return createHash("sha256").update(key).digest("hex").slice(0, 16);
}

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

/**
 * Main entry: find relevant events using curated queries (preferred) or AI fallback.
 */
export async function findRelevantEvents(
  ctx: EventSearchContext,
  location: string,
  goalCategory: string
): Promise<PipelineEvent[]> {
  console.log(`[eventMatcher] goal="${ctx.goalRaw}" location="${location}" curated=${ctx.searchQueries.length > 0}`);

  let queries: string[];
  if (ctx.searchQueries.length > 0) {
    // Curated queries from the keyword database — skip AI generation
    queries = ctx.searchQueries.slice(0, 4);
    console.log(`[eventMatcher] Using curated queries: ${JSON.stringify(queries)}`);
  } else {
    // AI fallback for freeform / unrecognised goals
    queries = await generateSearchQueries(ctx.goalRaw, location);
    console.log(`[eventMatcher] Using AI-generated queries: ${JSON.stringify(queries)}`);
  }

  let rawEvents = await fetchEventsFromApis(queries, location);
  console.log(`[eventMatcher] Fetched ${rawEvents.length} raw events`);

  // If curated queries returned nothing, retry with broader AI-generated queries
  // before giving up. The keyword DB can be too niche for some cities.
  let broadQueries: string[] | null = null;
  if (rawEvents.length === 0 && ctx.searchQueries.length > 0) {
    broadQueries = await generateSearchQueries(ctx.goalRaw, location);
    console.log(`[eventMatcher] Retrying with broader queries: ${JSON.stringify(broadQueries)}`);
    rawEvents = await fetchEventsFromApis(broadQueries, location);
    console.log(`[eventMatcher] Broad-query retry fetched ${rawEvents.length} raw events`);
  }

  // Final fallback for low-coverage cities (e.g. Vilnius): drop the location and
  // search globally for online/virtual events on the same topic. Force virtual:true
  // so the UI shows them as online.
  if (rawEvents.length === 0) {
    const noLocQueries = broadQueries ?? (await generateSearchQueries(ctx.goalRaw, location));
    console.log(`[eventMatcher] No-location retry: ${JSON.stringify(noLocQueries)}`);
    const onlineEvents = await fetchEventsFromApis(noLocQueries, location, false);
    console.log(`[eventMatcher] No-location retry fetched ${onlineEvents.length} raw events`);
    rawEvents = onlineEvents.map((e) => ({ ...e, virtual: true }));
  }

  if (rawEvents.length === 0) return [];

  const scored = await scoreEventsWithAI(rawEvents, ctx.goalRaw, ctx.scoringHint, location);
  console.log(`[eventMatcher] ${scored.length} relevant events out of ${rawEvents.length} raw`);

  return scored.slice(0, 12).map((evt) => {
    const sourceUrl =
      evt.link.trim() ||
      `https://www.google.com/search?q=${encodeURIComponent(`${evt.title} ${location}`)}`;
    return {
      event_id: makeEventId(evt.title, evt.start_date, evt.location ?? ""),
      title: evt.title,
      description: evt.description,
      start_date: evt.start_date,
      location: evt.location,
      virtual: evt.virtual,
      price_label: evt.price,
      image_url: evt.image_url,
      goal_category: goalCategory,
      source_name: evt.source || extractSourceName(sourceUrl),
      source_url: sourceUrl,
    };
  });
}
