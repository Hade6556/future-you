export type GiftReward = {
  type: string;
  icon: string;
  title: string;
  desc: string;
};

export const REWARD_POOL: GiftReward[] = [
  { type: "score_boost",  icon: "·", title: "Extra credit today",       desc: "Today’s check-in counts a little more toward your plan." },
  { type: "shield",       icon: "·", title: "Grace pass earned",        desc: "One missed day won’t reset your streak." },
  { type: "power_day",    icon: "·", title: "Strong day ahead",         desc: "Tomorrow’s focus block is slightly larger—use it deliberately." },
  { type: "insight",      icon: "·", title: "Pattern note",             desc: "People who stay consistent for two weeks tend to see the clearest shift in week three." },
  { type: "social_proof", icon: "·", title: "You’re on pace",           desc: "You’re ahead of most people who started the same week." },
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
