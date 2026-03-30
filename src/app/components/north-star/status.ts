export type ChipStatus = "locked" | "ready" | "in_progress";

export type NorthStarStatus = {
  heroHeadline: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  chips: {
    id: "identity" | "plan" | "daily";
    label: string;
    status: ChipStatus;
    href: string;
    insight: string;
    ctaLabel: string;
    nextActionLine: string;
  }[];
  streak: number;
};

export function buildNorthStarStatus(params: {
  identityComplete: boolean;
  planReady: boolean;
  futureScore: number;
  dailyStatus: string;
  streak: number;
}): NorthStarStatus {
  const { identityComplete, planReady, futureScore, dailyStatus, streak } = params;

  const identityStatus: ChipStatus = identityComplete ? "ready" : "locked";
  const planStatus: ChipStatus = planReady ? "ready" : "locked";
  const dailyStatusChip: ChipStatus =
    planReady && dailyStatus !== "align"
      ? dailyStatus === "complete"
        ? "ready"
        : "in_progress"
      : "locked";

  const readyCount = [identityStatus, planStatus, dailyStatusChip].filter((s) => s === "ready").length;
  const inProgressCount = [identityStatus, planStatus, dailyStatusChip].filter((s) => s === "in_progress").length;

  let heroHeadline: string;
  let heroCtaLabel: string;
  let heroCtaHref: string;
  if (readyCount === 3) {
    heroHeadline = "Everything is aligned. Let's go.";
    heroCtaLabel = "Open today's brief";
    heroCtaHref = "/";
  } else if (planReady && futureScore > 0) {
    heroHeadline = `You're ${futureScore}% through your coaching plan.`;
    heroCtaLabel = inProgressCount > 0 ? "Continue" : "Start daily coaching";
    heroCtaHref = "/plan";
  } else if (!identityComplete) {
    heroHeadline = "Take the quiz to find your coaching style.";
    heroCtaLabel = "Take the quiz";
    heroCtaHref = "/quiz";
  } else {
    heroHeadline = "Your coaching plan is taking shape.";
    heroCtaLabel = "View plan";
    heroCtaHref = "/plan";
  }

  const chips: NorthStarStatus["chips"] = [
    {
      id: "identity",
      label: "Quiz & Identity",
      status: identityStatus,
      href: "/quiz",
      insight: identityComplete
        ? "Behavio knows who you are and what you want."
        : "Take the quiz so Behavio can match your energy.",
      ctaLabel: identityComplete ? "Edit profile" : "Take the quiz",
      nextActionLine: identityStatus === "locked"
        ? "Complete the quiz to unlock your coaching plan."
        : "Ready. Behavio has your profile.",
    },
    {
      id: "plan",
      label: "Coaching Plan",
      status: planStatus,
      href: "/plan",
      insight: planReady
        ? "Your coaching plan is ready. Start daily coaching when you are."
        : "Complete your profile to unlock your plan.",
      ctaLabel: planReady ? "See plan" : "Build my plan",
      nextActionLine: planStatus === "locked"
        ? "Complete your profile first."
        : "Ready. Review your plan and accept it.",
    },
    {
      id: "daily",
      label: "Daily Coaching",
      status: dailyStatusChip,
      href: "/",
      insight:
        dailyStatusChip === "locked"
          ? "Daily coaching unlocks after you accept your plan."
          : dailyStatusChip === "ready"
            ? "Today's session complete. See you tomorrow."
            : "Align, act, reflect — one step at a time.",
      ctaLabel: dailyStatusChip === "locked" ? "Unlock coaching" : dailyStatusChip === "ready" ? "View brief" : "Open brief",
      nextActionLine: dailyStatusChip === "locked"
        ? "Accept your coaching plan first."
        : "Ready for today's session.",
    },
  ];

  return { heroHeadline, heroCtaLabel, heroCtaHref, chips, streak };
}
