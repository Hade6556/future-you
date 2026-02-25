"use client";

import { FormEvent, useState } from "react";

type IntakePath = {
  name: string;
  description: string;
  timeHorizon: string;
  tradeoffs: string;
};

type IntakeResponse = {
  values: string[];
  roles: string[];
  paths: IntakePath[];
};

export default function IntakePage() {
  const [narrative, setNarrative] = useState("");
  const [tone, setTone] = useState("Calming Mentor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IntakeResponse | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!narrative.trim()) {
      setError("Tell Future You a little about your best self first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ narrative, tone }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong");
      }

      const data = (await response.json()) as IntakeResponse;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Future You Canvas
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Describe the best version of yourself
          </h1>
          <p className="mt-3 text-slate-300">
            Don’t overthink it. Treat this like messaging a friend about the life
            you’re aiming for. Future You will structure it into values, roles,
            and multiple paths.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <label className="block text-sm font-medium text-slate-200">
            What does Future You look/feel like?
            <textarea
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-base text-white placeholder:text-slate-500 focus:border-white/40 focus:outline-none"
              rows={6}
              value={narrative}
              onChange={(event) => setNarrative(event.target.value)}
              placeholder="Example: I wake up energized by a studio doing $30k/mo, I serve founders, I live between Lisbon and LA, I’m in the best shape of my life, etc."
            />
          </label>

          <label className="mt-5 block text-sm font-medium text-slate-200">
            Tone
            <select
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-base text-white focus:border-white/40 focus:outline-none"
              value={tone}
              onChange={(event) => setTone(event.target.value)}
            >
              <option>Calming Mentor</option>
              <option>Hype Friend</option>
              <option>Tough Love</option>
              <option>Mystical Guide</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center rounded-full bg-white py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-white/40"
          >
            {loading ? "Structuring..." : "Generate my paths"}
          </button>

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}
        </form>

        {result ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold text-white">Your Future You map</h2>

            <section className="mt-4">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Top values
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.values.map((value) => (
                  <span
                    key={value}
                    className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-1 text-sm text-slate-100"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Roles & identities
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-white/10 bg-indigo-500/10 px-4 py-1 text-sm text-indigo-200"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Paths you can take
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {result.paths.map((path) => (
                  <div
                    key={path.name}
                    className="rounded-2xl border border-white/10 bg-slate-900/50 p-4"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {path.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">{path.description}</p>
                    <p className="mt-3 text-xs text-slate-400">
                      {path.timeHorizon} Â· {path.tradeoffs}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
