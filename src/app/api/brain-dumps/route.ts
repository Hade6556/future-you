import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const DUMP_DIR = path.join(os.homedir(), "brain_dumps");

interface DumpFile {
  id: string;
  timestamp: string;
  date: string;
  content: string;
  coach_response: string | null;
  sentiment: "positive" | "neutral" | "negative" | null;
  source: string;
  word_count: number;
}

function ensureDir() {
  if (!fs.existsSync(DUMP_DIR)) fs.mkdirSync(DUMP_DIR, { recursive: true });
}

export async function GET() {
  try {
    ensureDir();
    const files = fs.readdirSync(DUMP_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse(); // newest first

    const dumps: DumpFile[] = [];
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(DUMP_DIR, file), "utf-8");
        const data = JSON.parse(raw) as Partial<DumpFile>;
        dumps.push({
          id: file.replace(".json", ""),
          timestamp: data.timestamp ?? file.replace(".json", "").replace(/_/g, "T"),
          date: data.date ?? (data.timestamp?.slice(0, 10) ?? file.slice(0, 10)),
          content: data.content ?? "",
          coach_response: data.coach_response ?? null,
          sentiment: data.sentiment ?? null,
          source: data.source ?? "cli",
          word_count: data.word_count ?? 0,
        });
      } catch {
        // skip malformed files
      }
    }

    return NextResponse.json({ dumps });
  } catch (err) {
    console.error("[brain-dumps GET]", err);
    return NextResponse.json({ dumps: [] });
  }
}

interface PostBody {
  content: string;
  coach_response?: string | null;
  sentiment?: "positive" | "neutral" | "negative" | null;
}

export async function POST(req: Request) {
  try {
    ensureDir();
    const body = (await req.json()) as PostBody;
    const { content, coach_response = null, sentiment = null } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    const now = new Date();
    const filename =
      now.getFullYear() +
      "-" + String(now.getMonth() + 1).padStart(2, "0") +
      "-" + String(now.getDate()).padStart(2, "0") +
      "_" + String(now.getHours()).padStart(2, "0") +
      "-" + String(now.getMinutes()).padStart(2, "0") +
      "-" + String(now.getSeconds()).padStart(2, "0") +
      ".json";

    const dump: DumpFile = {
      id: filename.replace(".json", ""),
      timestamp: now.toISOString(),
      date: now.toISOString().slice(0, 10),
      content: content.trim(),
      coach_response,
      sentiment,
      source: "voice",
      word_count: content.trim().split(/\s+/).length,
    };

    fs.writeFileSync(path.join(DUMP_DIR, filename), JSON.stringify(dump, null, 2), "utf-8");
    return NextResponse.json({ id: dump.id });
  } catch (err) {
    console.error("[brain-dumps POST]", err);
    return NextResponse.json({ error: "failed to save" }, { status: 500 });
  }
}
