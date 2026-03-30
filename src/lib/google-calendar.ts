import { google } from "googleapis";
import type { PipelinePhase } from "@/app/types/pipeline";

// ── OAuth2 client ─────────────────────────────────────────────────────────────

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );
}

export function getAuthUrl(): string {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // always return refresh_token
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });
}

// ── Token type ────────────────────────────────────────────────────────────────

export type StoredTokens = {
  access_token: string;
  refresh_token: string;
  expiry_date: number | null;
  token_type: string;
  scope: string;
};

export function buildAuthenticatedClient(tokens: StoredTokens) {
  const client = getOAuth2Client();
  client.setCredentials(tokens);
  return client;
}

// ── Date math ─────────────────────────────────────────────────────────────────

/** Returns YYYY-MM-DD start/end for a phase, given its index in the phases array. */
export function phaseDateRange(
  phases: PipelinePhase[],
  targetIndex: number,
  planStartDate: Date
): { startDate: string; endDate: string } {
  let offsetDays = 0;
  for (let i = 0; i < targetIndex; i++) {
    offsetDays += (phases[i].duration_weeks ?? 0) * 7;
  }

  const start = new Date(planStartDate);
  start.setDate(start.getDate() + offsetDays);

  const end = new Date(start);
  end.setDate(end.getDate() + (phases[targetIndex].duration_weeks ?? 1) * 7);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

/** Add N days to a YYYY-MM-DD string, returns YYYY-MM-DD. */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ── Idempotent event upsert ───────────────────────────────────────────────────

interface CalendarEventInput {
  summary: string;
  description: string;
  startDate: string; // YYYY-MM-DD (all-day)
  endDate: string;   // YYYY-MM-DD exclusive end
  planId: string;
  eventKey: string;  // unique within plan: e.g. "phase-1", "milestone-1-2", "event-abc"
}

export async function upsertCalendarEvent(
  auth: ReturnType<typeof buildAuthenticatedClient>,
  calendarId: string,
  input: CalendarEventInput
): Promise<string> {
  const calendar = google.calendar({ version: "v3", auth });
  const privateKey = `behavio_${input.planId}_${input.eventKey}`;

  // Check for existing event with this key
  const existing = await calendar.events.list({
    calendarId,
    privateExtendedProperty: [`behavioKey=${privateKey}`],
    maxResults: 1,
    showDeleted: false,
  });

  const existingEvent = existing.data.items?.[0];

  const eventBody = {
    summary: input.summary,
    description: input.description,
    start: { date: input.startDate },
    end: { date: input.endDate },
    extendedProperties: {
      private: {
        behavioPlanId: input.planId,
        behavioKey: privateKey,
      },
    },
  };

  if (existingEvent?.id) {
    await calendar.events.update({
      calendarId,
      eventId: existingEvent.id,
      requestBody: eventBody,
    });
    return existingEvent.id;
  }

  const created = await calendar.events.insert({
    calendarId,
    requestBody: eventBody,
  });
  return created.data.id!;
}
