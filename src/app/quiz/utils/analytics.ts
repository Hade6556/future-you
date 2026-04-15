export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    // Push to dataLayer for GTM / analytics
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer?.push({ event: name, ...properties });
  } catch {
    // silently ignore
  }
  if (process.env.NODE_ENV === "development") {
    console.log(`[analytics] ${name}`, properties ?? "");
  }
}

export function trackScreenViewed(screenName: string) {
  trackEvent("screen_viewed", { screen: screenName });
}

export function trackAnswerSelected(
  screenName: string,
  answer: string | string[],
) {
  trackEvent("answer_selected", { screen: screenName, answer });
}
