#!/usr/bin/env node
/**
 * Event search CLI. Calls the app's /api/plan (or pipeline) with the collected params.
 * Usage: npm run event-search -- --goal "lose weight" --location "Vilnius, Lithuania" --format both --budget paid_ok --timeframe "next 2 months" --how-often weekly
 * API base: API_URL env or http://localhost:3000
 */

const API_URL = process.env.API_URL || "http://localhost:3000";

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--") && args[i].length > 2) {
      const key = args[i].slice(2).replace(/-/g, "_");
      const next = args[i + 1];
      out[key] = next && !next.startsWith("--") ? next : true;
      if (out[key] !== true) i++;
    }
  }
  return out;
}

async function main() {
  const a = parseArgs();
  const goal = a.goal || a.g;
  if (!goal) {
    console.error("Usage: npm run event-search -- --goal \"lose weight\" --location \"Vilnius, Lithuania\" --format both --budget paid_ok --timeframe \"next 2 months\" --how_often weekly");
    process.exit(1);
  }

  const body = {
    goal,
    location: a.location || a.l || undefined,
    eventFormat: a.format || a.event_format || undefined,
    budget: a.budget || a.b || undefined,
    timeframe: a.timeframe || a.t || undefined,
    howOften: a.how_often || a.howOften || undefined,
  };

  const url = `${API_URL}/api/plan`;
  console.error(`POST ${url}`);
  console.error(JSON.stringify(body, null, 2));

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120_000),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Error:", data.error || res.statusText);
      process.exit(1);
    }
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Request failed:", err.message);
    process.exit(1);
  }
}

main();
