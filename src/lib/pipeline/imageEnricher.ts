import type { PipelineEvent } from "@/app/types/pipeline";

// Matches both attribute orderings of og:image meta tag
const OG_IMAGE_RE =
  /<meta\s+(?:property=["']og:image["']\s+content=["']([^"']+)["']|content=["']([^"']+)["']\s+property=["']og:image["'])/i;

const TIMEOUT_MS = 4000;
const MAX_EVENTS = 5;

async function fetchOgImage(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BehavioBot/1.0)" },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(OG_IMAGE_RE);
    return m ? (m[1] ?? m[2] ?? null) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Fetch og:image for up to 5 events in parallel. Mutates image_url in place. */
export async function enrichEventImages(events: PipelineEvent[]): Promise<void> {
  const toEnrich = events.slice(0, MAX_EVENTS).filter((e) => !e.image_url);
  if (toEnrich.length === 0) return;

  const results = await Promise.allSettled(
    toEnrich.map((e) => fetchOgImage(e.source_url))
  );

  results.forEach((r, i) => {
    if (r.status === "fulfilled" && r.value) {
      toEnrich[i].image_url = r.value;
    }
  });
}
