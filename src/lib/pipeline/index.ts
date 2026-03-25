import type { GoalPlan, UserContext } from "@/app/types/pipeline";
import { parseGoal } from "./goalParser";
import { fetchEvents, fetchEventsForSources } from "./eventFetcher";
import { normalizeEvents } from "./normalizer";
import { enrichEventImages } from "./imageEnricher";
import { buildPlan } from "./planBuilder";
import { getCuratedExperts } from "./experts";

export async function runPipeline(
  goal: string,
  location: string | null,
  userContext?: UserContext
): Promise<GoalPlan> {
  const { goalKey, goalConfig } = parseGoal(goal);
  const experts = getCuratedExperts(goalKey);

  if (!location) {
    // No location — skip event fetching, return plan immediately
    return buildPlan(goal, goalKey, goalConfig, [], experts, userContext);
  }

  const rawSources = await fetchEvents(goalConfig, location);
  let events = normalizeEvents(rawSources, goalConfig.category, location, goalConfig.keywords);

  // Retry sources that produced fewer than 2 events with a broader fallback query
  const eventCountBySource = new Map<string, number>();
  for (const e of events) {
    eventCountBySource.set(e.source_name, (eventCountBySource.get(e.source_name) ?? 0) + 1);
  }
  const sparseSources = rawSources
    .map((s) => s.sourceName)
    .filter((name) => (eventCountBySource.get(name) ?? 0) < 2);

  if (sparseSources.length > 0) {
    const retrySources = await fetchEventsForSources(sparseSources, goalConfig, location);
    const merged = [
      ...rawSources.filter((s) => !sparseSources.includes(s.sourceName)),
      ...retrySources,
    ];
    events = normalizeEvents(merged, goalConfig.category, location, goalConfig.keywords);
  }

  await enrichEventImages(events);
  return buildPlan(goal, goalKey, goalConfig, events, experts, userContext);
}
