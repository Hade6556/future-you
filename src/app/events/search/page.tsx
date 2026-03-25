"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeftIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon as CheckSolid } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEventSearchStore } from "../../state/eventSearchStore";
import {
  EVENT_SEARCH_GOALS,
  EVENT_FORMATS,
  BUDGET_OPTIONS,
  HOW_OFTEN_OPTIONS,
  type EventSearchParams,
  type EventSearchStep,
} from "../../types/eventSearch";
import { STEPS } from "../../types/eventSearch";
import { useState } from "react";

function StepGoal() {
  const { params, setGoal, nextStep } = useEventSearchStore();
  const selected = params.goal;

  return (
    <div className="space-y-6">
      <p className="type-body text-text-secondary">
        What are you working toward? Pick the one that fits best.
      </p>
      <ul className="grid gap-2">
        {EVENT_SEARCH_GOALS.map((g) => (
          <li key={g.id}>
            <button
              type="button"
              onClick={() => {
                setGoal(g.id);
                nextStep();
              }}
              className="flex w-full min-h-[48px] touch-target items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-[15px] font-medium text-text-primary transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{g.label}</span>
              {selected === g.id && (
                <CheckSolid className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepLocation() {
  const { params, setLocation, nextStep } = useEventSearchStore();
  const [value, setValue] = useState(params.location ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(value);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="type-body text-text-secondary">
        Where are you based? City and country (e.g. Vilnius, Lithuania).
      </p>
      <div className="space-y-2">
        <Label htmlFor="event-search-location">Location</Label>
        <Input
          id="event-search-location"
          type="text"
          placeholder="e.g. Vilnius, Lithuania"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[48px]"
          autoFocus
        />
      </div>
      <Button type="submit" className="w-full min-h-[48px]" disabled={!value.trim()}>
        Next
      </Button>
    </form>
  );
}

function StepFormat() {
  const { params, setEventFormat, nextStep } = useEventSearchStore();
  const selected = params.eventFormat;

  return (
    <div className="space-y-6">
      <p className="type-body text-text-secondary">
        Do you want in-person events, online, or both?
      </p>
      <ul className="grid gap-2">
        {EVENT_FORMATS.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              onClick={() => {
                setEventFormat(f.id);
                nextStep();
              }}
              className="flex w-full min-h-[48px] touch-target items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-[15px] font-medium text-text-primary transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{f.label}</span>
              {selected === f.id && (
                <CheckSolid className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepBudget() {
  const { params, setBudget, nextStep } = useEventSearchStore();
  const selected = params.budget;

  return (
    <div className="space-y-6">
      <p className="type-body text-text-secondary">
        Free only, or are paid events okay?
      </p>
      <ul className="grid gap-2">
        {BUDGET_OPTIONS.map((b) => (
          <li key={b.id}>
            <button
              type="button"
              onClick={() => {
                setBudget(b.id);
                nextStep();
              }}
              className="flex w-full min-h-[48px] touch-target items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-[15px] font-medium text-text-primary transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{b.label}</span>
              {selected === b.id && (
                <CheckSolid className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepTimeframe() {
  const { params, setTimeframe, nextStep } = useEventSearchStore();
  const [value, setValue] = useState(params.timeframe ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeframe(value);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="type-body text-text-secondary">
        When do you want to attend? (e.g. next 2 months, this summer, anytime)
      </p>
      <div className="space-y-2">
        <Label htmlFor="event-search-timeframe">Timeframe</Label>
        <Input
          id="event-search-timeframe"
          type="text"
          placeholder="e.g. next 2 months, this summer, anytime"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[48px]"
          autoFocus
        />
      </div>
      <Button type="submit" className="w-full min-h-[48px]" disabled={!value.trim()}>
        Next
      </Button>
    </form>
  );
}

function StepHowOften() {
  const { params, setHowOften, nextStep } = useEventSearchStore();
  const selected = params.howOften;

  return (
    <div className="space-y-6">
      <p className="type-body text-text-secondary">
        One-time search, or should we check for new events daily or weekly?
      </p>
      <ul className="grid gap-2">
        {HOW_OFTEN_OPTIONS.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => {
                setHowOften(o.id);
                nextStep();
              }}
              className="flex w-full min-h-[48px] touch-target items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-[15px] font-medium text-text-primary transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{o.label}</span>
              {selected === o.id && (
                <CheckSolid className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildCliCommand(p: EventSearchParams): string {
  const goalEntry = EVENT_SEARCH_GOALS.find((g) => g.id === p.goal);
  const goalArg = goalEntry ? goalEntry.pipelineGoal : p.goal;
  const locationEscaped = p.location.includes(" ") ? `"${p.location}"` : p.location;
  const timeframeEscaped = p.timeframe.includes(" ") ? `"${p.timeframe}"` : p.timeframe;
  return `npm run event-search -- --goal "${goalArg}" --location ${locationEscaped} --format ${p.eventFormat} --budget ${p.budget} --timeframe ${timeframeEscaped} --how-often ${p.howOften}`;
}

function SummaryView() {
  const router = useRouter();
  const { params, reset } = useEventSearchStore();
  const [copied, setCopied] = useState(false);

  const p = params as EventSearchParams;
  const complete =
    p.goal &&
    p.location &&
    p.eventFormat &&
    p.budget &&
    p.timeframe &&
    p.howOften;
  if (!complete) return null;
  const goalLabel = EVENT_SEARCH_GOALS.find((g) => g.id === p.goal)?.label ?? p.goal;
  const formatLabel = EVENT_FORMATS.find((f) => f.id === p.eventFormat)?.label ?? p.eventFormat;
  const budgetLabel = BUDGET_OPTIONS.find((b) => b.id === p.budget)?.label ?? p.budget;
  const howOftenLabel = HOW_OFTEN_OPTIONS.find((o) => o.id === p.howOften)?.label ?? p.howOften;

  const summaryLines = [
    `You're looking for events to help you with ${goalLabel} in ${p.location}.`,
    `Format: ${formatLabel}. Budget: ${budgetLabel}. Timeframe: ${p.timeframe}.`,
    `Search: ${howOftenLabel}.`,
  ];

  const cliCommand = buildCliCommand(p);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cliCommand]);

  return (
    <div className="space-y-6">
      <p className="type-body text-text-primary">
        Here’s a short summary of what you told us and the exact command to run for your event search.
      </p>

      <Card className="min-w-0 border border-border shadow-sm">
        <CardContent className="p-4 space-y-3">
          {summaryLines.map((line, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-text-primary">
              {line}
            </p>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label className="text-text-secondary">CLI command to run</Label>
        <div className="relative">
          <pre className="overflow-x-auto rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs text-text-primary whitespace-pre-wrap break-all font-mono">
            {cliCommand}
          </pre>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="absolute top-2 right-2 min-h-[36px] min-w-[36px]"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy command"}
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <ClipboardDocumentIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          className="w-full min-h-[48px]"
          onClick={() => {
            reset();
            router.push("/events");
          }}
        >
          Back to Events
        </Button>
        <Link href="/events" className="block">
          <Button variant="ghost" className="w-full min-h-[44px]">
            Done
          </Button>
        </Link>
      </div>
    </div>
  );
}

function stepTitle(step: EventSearchStep): string {
  switch (step) {
    case "goal":
      return "What's your goal?";
    case "location":
      return "Where are you?";
    case "format":
      return "In-person or online?";
    case "budget":
      return "Free or paid?";
    case "timeframe":
      return "When?";
    case "howOften":
      return "How often to search?";
    case "summary":
      return "Summary & command";
    default:
      return "Event search";
  }
}

export default function EventSearchPage() {
  const router = useRouter();
  const stepIndex = useEventSearchStore((s) => s.stepIndex);
  const currentStep = useEventSearchStore((s) => s.currentStep());

  const step = currentStep;
  const canGoBack = stepIndex > 0;

  const handleBack = () => {
    if (stepIndex > 0) {
      useEventSearchStore.setState({ stepIndex: stepIndex - 1 });
    } else {
      router.push("/events");
    }
  };

  return (
    <div className="content-padding relative flex min-h-dvh flex-col bg-background pb-36 pt-[max(3.5rem,env(safe-area-inset-top,3.5rem))]">
      <div className="section-gap mx-auto flex w-full max-w-md flex-col min-w-0">
        <header className="flex items-center gap-3">
          {canGoBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="touch-target -ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-secondary hover:bg-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Back"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
          ) : (
            <Link
              href="/events"
              className="touch-target -ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-secondary hover:bg-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Back to Events"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="type-h1 text-text-primary">{stepTitle(step)}</h1>
            <p className="mt-1 text-sm text-microcopy-soft">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
          </div>
        </header>

        {step === "goal" && <StepGoal />}
        {step === "location" && <StepLocation />}
        {step === "format" && <StepFormat />}
        {step === "budget" && <StepBudget />}
        {step === "timeframe" && <StepTimeframe />}
        {step === "howOften" && <StepHowOften />}
        {step === "summary" && <SummaryView />}
      </div>
    </div>
  );
}
