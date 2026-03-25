import Link from "next/link";

export const metadata = { title: "Privacy Policy – Future You" };

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-background px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-8 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

        <div className="prose prose-neutral max-w-none space-y-6 text-[15px] leading-relaxed text-foreground">
          <section>
            <h2 className="mb-2 text-lg font-semibold">1. What we collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly: your email address, goal inputs, quiz
              responses, daily check-ins, and voice transcripts (brain dumps). We also collect
              standard usage data such as session metadata and error logs.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">2. How we use it</h2>
            <p className="text-muted-foreground">
              Your data is used solely to generate your personalised 90-day plan, power your AI
              coaching experience, and improve the product. We do not sell your data to third
              parties.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">3. AI processing</h2>
            <p className="text-muted-foreground">
              Coaching messages and plan generation are powered by Anthropic's Claude API. Your
              goal inputs and check-in data are sent to Anthropic's servers to generate responses.
              Anthropic's data retention policies apply to this processing.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">4. Data storage</h2>
            <p className="text-muted-foreground">
              Account and plan data is stored securely in Supabase. Payment processing is handled
              by Stripe — we never store your card details. Local device storage (localStorage) is
              used to cache your plan and preferences on your device.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">5. Your rights</h2>
            <p className="text-muted-foreground">
              You can request deletion of your account and associated data at any time by emailing
              us. You can also export your data on request.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">6. Cookies</h2>
            <p className="text-muted-foreground">
              We use session cookies for authentication only. No third-party tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">7. Contact</h2>
            <p className="text-muted-foreground">
              Questions? Email us at{" "}
              <a href="mailto:hello@futureyou.app" className="underline hover:text-foreground">
                hello@futureyou.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
