"use client";

import { ACCENT, accentRgba } from "@/app/theme";
import type { ArchetypeKey } from "./mockups/PlanCardMockup";

type SigilKey = ArchetypeKey | "locked";

interface ArchetypeSigilProps {
  archetype: SigilKey;
  size?: number;
}

/**
 * Distinct geometric mark per archetype — built from straight lines + arcs so
 * each silhouette reads at a glance and stays recognizable at 24px or 96px.
 */
export default function ArchetypeSigil({ archetype, size = 72 }: ArchetypeSigilProps) {
  const stroke = ACCENT;
  const fill = accentRgba(0.05);
  const dim = accentRgba(0.35);

  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
    style: { display: "block" },
  };

  switch (archetype) {
    case "Strategist":
      // Concentric squares + crosshair = sequencing / mapping the terrain
      return (
        <svg {...common}>
          <rect x="6" y="6" width="52" height="52" rx="2" stroke={dim} strokeWidth="1" />
          <rect x="14" y="14" width="36" height="36" rx="1.5" stroke={stroke} strokeWidth="1.4" fill={fill} />
          <rect x="24" y="24" width="16" height="16" stroke={stroke} strokeWidth="1.4" />
          <line x1="32" y1="6" x2="32" y2="20" stroke={stroke} strokeWidth="1.4" />
          <line x1="32" y1="44" x2="32" y2="58" stroke={stroke} strokeWidth="1.4" />
          <line x1="6" y1="32" x2="20" y2="32" stroke={stroke} strokeWidth="1.4" />
          <line x1="44" y1="32" x2="58" y2="32" stroke={stroke} strokeWidth="1.4" />
          <circle cx="32" cy="32" r="2" fill={stroke} />
        </svg>
      );

    case "Steady Builder":
      // Stacked horizontal bars with subtle ascending offset — compounding
      return (
        <svg {...common}>
          <rect x="8" y="12" width="36" height="6" rx="1" stroke={stroke} strokeWidth="1.4" fill={fill} />
          <rect x="14" y="22" width="42" height="6" rx="1" stroke={stroke} strokeWidth="1.4" fill={fill} />
          <rect x="10" y="32" width="40" height="6" rx="1" stroke={stroke} strokeWidth="1.4" fill={fill} />
          <rect x="16" y="42" width="44" height="6" rx="1" stroke={stroke} strokeWidth="1.4" fill={accentRgba(0.18)} />
          <line x1="6" y1="56" x2="58" y2="56" stroke={dim} strokeWidth="1" />
        </svg>
      );

    case "Endurance Engine":
      // Long climbing arc with milestone dots — sustained ramp
      return (
        <svg {...common}>
          <line x1="6" y1="56" x2="58" y2="56" stroke={dim} strokeWidth="1" />
          <line x1="6" y1="56" x2="6" y2="8" stroke={dim} strokeWidth="1" />
          <path
            d="M 6 52 Q 22 50 30 38 T 58 8"
            stroke={stroke}
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="14" cy="50" r="2" fill={stroke} />
          <circle cx="26" cy="42" r="2" fill={stroke} />
          <circle cx="38" cy="30" r="2" fill={stroke} />
          <circle cx="50" cy="18" r="2" fill={stroke} />
          <circle cx="58" cy="8" r="3" fill={stroke} stroke={accentRgba(0.5)} strokeWidth="2" />
        </svg>
      );

    case "Creative Spark":
      // Asymmetric burst — angular rays from off-center pivot
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="22" stroke={dim} strokeWidth="1" />
          <line x1="32" y1="6" x2="32" y2="22" stroke={stroke} strokeWidth="1.5" />
          <line x1="32" y1="42" x2="32" y2="58" stroke={stroke} strokeWidth="1.5" />
          <line x1="6" y1="32" x2="22" y2="32" stroke={stroke} strokeWidth="1.5" />
          <line x1="42" y1="32" x2="58" y2="32" stroke={stroke} strokeWidth="1.5" />
          <line x1="14" y1="14" x2="24" y2="24" stroke={stroke} strokeWidth="1.5" />
          <line x1="40" y1="40" x2="50" y2="50" stroke={stroke} strokeWidth="1.5" />
          <line x1="50" y1="14" x2="40" y2="24" stroke={stroke} strokeWidth="1.5" />
          <line x1="24" y1="40" x2="14" y2="50" stroke={stroke} strokeWidth="1.5" />
          <circle cx="32" cy="32" r="4" fill={stroke} />
          <circle cx="32" cy="32" r="8" stroke={stroke} strokeWidth="1.4" fill={fill} />
        </svg>
      );

    case "Guardian":
      // Layered shields — concentric arcs converging to a base
      return (
        <svg {...common}>
          <path
            d="M 32 6 L 56 14 V 32 Q 56 50 32 58 Q 8 50 8 32 V 14 Z"
            stroke={dim}
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 32 12 L 50 18 V 32 Q 50 46 32 52 Q 14 46 14 32 V 18 Z"
            stroke={stroke}
            strokeWidth="1.4"
            fill={fill}
          />
          <path
            d="M 32 20 L 42 24 V 32 Q 42 40 32 44 Q 22 40 22 32 V 24 Z"
            stroke={stroke}
            strokeWidth="1.4"
            fill={accentRgba(0.12)}
          />
          <line x1="32" y1="20" x2="32" y2="44" stroke={stroke} strokeWidth="1.2" strokeDasharray="2 2" />
        </svg>
      );

    case "Explorer":
      // Compass rose — diverging arrows from a centered diamond
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="22" stroke={dim} strokeWidth="1" strokeDasharray="2 3" />
          <polygon points="32,8 36,32 32,30 28,32" stroke={stroke} strokeWidth="1.4" fill={accentRgba(0.18)} />
          <polygon points="32,56 28,32 32,34 36,32" stroke={stroke} strokeWidth="1.4" fill={fill} />
          <polygon points="8,32 32,28 30,32 32,36" stroke={stroke} strokeWidth="1.4" fill={fill} />
          <polygon points="56,32 32,36 34,32 32,28" stroke={stroke} strokeWidth="1.4" fill={accentRgba(0.18)} />
          <circle cx="32" cy="32" r="2.5" fill={stroke} />
          <line x1="14" y1="14" x2="20" y2="20" stroke={dim} strokeWidth="1" />
          <line x1="50" y1="14" x2="44" y2="20" stroke={dim} strokeWidth="1" />
          <line x1="14" y1="50" x2="20" y2="44" stroke={dim} strokeWidth="1" />
          <line x1="50" y1="50" x2="44" y2="44" stroke={dim} strokeWidth="1" />
        </svg>
      );

    case "locked":
    default:
      // Question mark inside a dashed seal — your archetype, sealed
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="26" stroke={dim} strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="32" cy="32" r="20" stroke={stroke} strokeWidth="1.4" fill={fill} />
          <path
            d="M 24 25 Q 24 18 32 18 Q 40 18 40 25 Q 40 30 34 32 Q 32 33 32 36"
            stroke={stroke}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="32" cy="42" r="1.6" fill={stroke} />
        </svg>
      );
  }
}
