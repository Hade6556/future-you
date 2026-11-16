<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0B1026,60:1E2A5A,100:5B6CFF&height=210&section=header&text=Behavio&fontSize=70&fontColor=ffffff&fontAlignY=38&desc=A%20two-minute%20self-diagnosis%2C%20an%20AI-built%20daily%20plan%2C%20and%20a%20coach%20that%20checks%20in%20every%20day&descSize=17&descAlignY=60" alt="Behavio banner" width="100%" />

**Behavio turns a short quiz about your goals and habits into a structured daily action plan, then keeps you on it with daily tasks, streaks and an AI mentor.**

[![Top language](https://img.shields.io/github/languages/top/Hade6556/future-you?style=for-the-badge)](https://github.com/Hade6556/future-you)
[![License](https://img.shields.io/github/license/Hade6556/future-you?style=for-the-badge)](#license)
[![Last commit](https://img.shields.io/github/last-commit/Hade6556/future-you?style=for-the-badge)](https://github.com/Hade6556/future-you/commits)
[![Stars](https://img.shields.io/github/stars/Hade6556/future-you?style=for-the-badge)](https://github.com/Hade6556/future-you/stargazers)

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-auth%20%2B%20db-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-subscriptions-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Claude](https://img.shields.io/badge/Claude-plans%20%2B%20coaching-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://docs.anthropic.com/)

</div>

---

## What it does

The landing page asks "Why you keep failing" and offers a two-minute self-diagnosis. The quiz collects your goal area, specific goals, current state, bad habits, past attempts, available time per day and a free-text goal narrative, reveals an archetype, and captures an email. Claude then builds a plan from that profile. From there the app is a daily loop: a morning check-in, generated tasks for the day, an evening wrap-up, a streak, and a mentor message. Pro access is sold on a trial-first paywall through Stripe.

> **[screenshot placeholder]** Three captures at 390×844 (phone) and one at 1440×900: the quiz's archetype reveal, the paywall plan picker, the home screen with the Future Score ring and streak, and the daily tasks view with a morning check-in. Use a demo profile, no real email.

## Features

- **Quiz funnel** with twenty screens, progress bar, insight cards, archetype scoring and a resume banner for people who come back later.
- **AI plan generation** from the quiz profile, with a validator that rejects malformed plans and a weekly refresh.
- **Daily tasks**: generate, complete, swap a task you cannot do today, and add recurring tasks.
- **Mentor**: a daily message and a check-in dialogue, both Claude-written from your recent activity.
- **Journal** with brain dumps that get analysed into actions.
- **Explore**: events matched to your goal, fetched through Firecrawl or SerpAPI when keys are set.
- **Home**: Future Score ring, gap chart, journey path, milestones, missions, streak chain and weekly momentum.
- **Plan export** to PDF.
- **Google Calendar sync** of your plan.
- **Trial-first paywall**: anonymous Supabase session on load, so Stripe Checkout works before anyone types an email. Annual and optional monthly plans, trial length configurable, Customer Portal for changes.
- **Growth plumbing**: Meta, TikTok and GA pixels, server-side Meta Conversions API events from the Stripe webhook, UTM and click-id capture forwarded into checkout metadata.
- **Local-only mode**: without Supabase keys the app runs on localStorage with no login.
- **PWA install banner** and web push keys.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router, React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn with Base UI, Framer Motion, Lucide and Heroicons, `@react-pdf/renderer` |
| State | Zustand stores for the quiz, the plan and funnel resume |
| AI | Claude via `@anthropic-ai/sdk` in the intake, plan, daily-task, coach, mentor, rewrite and journal routes |
| Data and auth | Supabase (anonymous and email auth, Postgres tables in `supabase/schema.sql`) |
| Billing | Stripe Checkout with trial, webhooks, Customer Portal |
| Integrations | Google Calendar (`googleapis`), Firecrawl, SerpAPI, Meta CAPI |
| Ops | pm2 `ecosystem.config.js` for a VPS, cron routes for daily mentor, trial reminder and weekly plan refresh |

## Quick start

Requirements: Node 20 or newer and an Anthropic API key. Supabase and Stripe are optional for local development.

```bash
git clone https://github.com/Hade6556/future-you.git
cd future-you
npm install
cp .env.local.example .env.local      # fill in ANTHROPIC_API_KEY at minimum
npm run dev                           # http://localhost:3000
```

With only the Anthropic key set, the app runs in local-only mode. To enable accounts and payments:

1. **Supabase**: create a project, run `supabase/schema.sql` and `supabase/migrations/003_handle_new_user_anonymous_email.sql` in the SQL editor, enable **Anonymous** and **Email** providers, and set the URL, publishable key and service role key in `.env.local`.
2. **Stripe**: create the annual (and optionally monthly) recurring prices, set `STRIPE_PRICE_PRO_ANNUAL`, `STRIPE_PRICE_PRO_MONTHLY`, the secret key and the webhook secret. Forward webhooks locally with `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
3. **Optional**: Google Calendar OAuth credentials, Firecrawl or SerpAPI keys, pixel ids, VAPID keys. Every optional key is skipped silently when empty.

The full variable list with comments is in [`.env.local.example`](.env.local.example).

### Scripts

```bash
npm run dev            # Next.js dev server
npm run build && npm run start
npm run lint
npm run event-search   # scripts/event-search.mjs, tries the event sources from the command line
npm run start:all      # pm2: production server plus the companion pipeline service, see ecosystem.config.js
```

Cron routes under `src/app/api/cron/` expect `Authorization: Bearer $CRON_SECRET` and need an external scheduler. **[placeholder: document which scheduler calls them in production]**

## Usage

1. Open `/` and start the quiz, or jump to `/quiz`.
2. After the reveal and email capture the app generates a plan on `/generating` and shows `/paywall`.
3. `/onboarding` sets the first week; `/` becomes the home dashboard once a plan exists.
4. Daily: `/tasks` for the check-in, tasks and wrap-up; `/journal` for brain dumps; `/plan` for the full plan and PDF export; `/explore` for events.
5. `/account` manages the subscription through the Stripe Customer Portal.

Design and strategy notes live in [`docs/`](docs/): experience foundation, palette, typography, paywall strategy, SEO and the distribution playbook.

## Contributing

1. Run `npm run lint` and `npm run build` before a pull request. The Vercel build is strict about TypeScript.
2. Prompts for plans, tasks and the mentor live in the matching `src/app/api/*` route. Keep the JSON shapes in sync with `src/lib/pipeline/planValidator.ts`.
3. Quiz changes go in `src/app/quiz/screens` and the store; keep `archetypeScoring.ts` deterministic so the reveal is reproducible.
4. Anything that touches billing must keep the webhook idempotent and use the Supabase service role only on the server.
5. Do not commit `.env.local`. The example file is the contract.

## License

No license file is in the repository yet, so the default "all rights reserved" applies. **[placeholder: add a LICENSE file; the badge above updates by itself]**
