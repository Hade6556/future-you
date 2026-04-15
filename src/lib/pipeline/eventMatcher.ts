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

Scoring rules — be STRICT:
- 80-100: Directly helps achieve the goal (e.g. business meetup for "make money", running race for "lose weight")
- 50-79: Clearly related skill/topic (e.g. networking event for "make money", cooking class for "eat healthy")
- 30-49: Tangentially related, user might benefit
- 0-29: NOT relevant — different topic entirely

IMPORTANT: Score 0-20 for events that are clearly unrelated to the goal, even if they sound professional or interesting. Examples of what should score LOW for "make money / business":
- Food festivals, gastro summits, cooking events (unless the goal is cooking/food business)
- Martial arts seminars, sports tournaments, fitness events (unless the goal is fitness)
- Cultural festivals, art exhibitions, music concerts (unless the goal is creative arts)
- Random conferences on unrelated topics (diversity, environment, etc. unless directly tied to the goal)

Only score 50+ if the event DIRECTLY helps with "${goalRaw}".

Events: ${JSON.stringify(eventSummaries)}`,
        },
      ],
    });

    const text = resp.content[0].type === "text" ? resp.content[0].text : "";
    const match = text.match(/\[[\s\S]*?\]/);
    if (match) {
      const scores = JSON.parse(match[0]) as Array<{ i: number; s: number }>;
      const relevant = scores
        .filter((s) => s.i >= 0 && s.i < events.length && s.s >= 45)
        .sort((a, b) => b.s - a.s);

      console.log(`[eventMatcher] Scores: ${JSON.stringify(scores.sort((a, b) => b.s - a.s).map(s => ({ i: s.i, s: s.s, t: events[s.i]?.title?.slice(0, 40) })))}`);

      return relevant.map((s) => ({ ...events[s.i], relevanceScore: s.s }));
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

  const rawEvents = await fetchEventsFromApis(queries, location);
  console.log(`[eventMatcher] Fetched ${rawEvents.length} raw events`);

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
