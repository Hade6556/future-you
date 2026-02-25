import Link from "next/link";

const quickFacts = [
  {
    label: "Who it’s for",
    value: "Solopreneurs and creators who feel \"meant for more\"",
  },
  {
    label: "What it does",
    value:
      "Captures your best-self vision, scouts opportunities, and nudges you to act",
  },
  {
    label: "How it feels",
    value: "Calm, pragmatic mentor energy by default (you can tweak it later)",
  },
];

const steps = [
  {
    title: "Describe your Future You",
    body: "Write out the best version of yourself. We’ll structure it into values, roles, and multiple possible paths.",
  },
  {
    title: "Sync reality",
    body: "Connect your calendar, health data, or notes so Future You understands your actual life constraints.",
  },
  {
    title: "Receive daily briefs",
    body: "Get one clear plan for the day plus handpicked events, intros, and nudges that align with your goals.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Future You
            </p>
            <p className="text-sm text-slate-300">
              A calmer path to the version of you that already made it
            </p>
          </div>
          <Link
            href="/intake"
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
          >
            Start the canvas
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-8">
          <p className="mb-4 text-xs uppercase tracking-[0.5em] text-slate-400">
            Clarity â€¢ Momentum â€¢ Intros
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Feel lost? Future You already wrote the plan.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Describe the person you know you’re supposed to become. We’ll turn it
            into a concrete path, sync your real commitments, and act like a
            proactive co-pilot so you only have to execute.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            <Link
              href="/intake"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Capture Future You
            </Link>
            <button
              type="button"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
            >
              View sample brief
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {quickFacts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                {fact.label}
              </p>
              <p className="mt-3 text-base text-slate-100">{fact.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-400">
            How it works
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl bg-slate-950/40 p-5">
                <p className="text-sm font-semibold text-slate-300">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-slate-300">{step.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
