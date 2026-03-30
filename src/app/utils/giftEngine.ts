export type GiftReward = {
  type: string;
  icon: string;
  title: string;
  desc: string;
};

export const REWARD_POOL: GiftReward[] = [
  { type: "score_boost",  icon: "⚡", title: "+5 Behavio Score Boost",  desc: "Today's effort counts double." },
  { type: "shield",       icon: "🛡️", title: "Streak Shield Earned",   desc: "You've got a safety net for tomorrow." },
  { type: "power_day",    icon: "🔥", title: "Power Day Unlocked",     desc: "Your momentum multiplies tomorrow." },
  { type: "insight",      icon: "💡", title: "Archetype Insight",      desc: "Steady builders who stay consistent unlock their full potential in the next phase." },
  { type: "social_proof", icon: "🏆", title: "You're Ahead",           desc: "You're moving faster than 78% of users who started this week." },
];

/** Deterministic pick based on planId + day number so the gift is consistent all day. */
export function pickReward(planId: string | null, dayNumber: number): GiftReward {
  const seed = `${planId ?? "default"}-${dayNumber}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const c = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + c) | 0;
  }
  const idx = Math.abs(hash) % REWARD_POOL.length;
  return REWARD_POOL[idx];
}
