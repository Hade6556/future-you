"use client";

const TRUSTPILOT_GREEN = "#00B67A";

type Props = {
  rating?: number; // e.g. 4.5 or 5
  size?: "sm" | "md";
  className?: string;
};

export function TrustpilotStars({ rating = 5, size = "md", className = "" }: Props) {
  const box = size === "sm" ? 12 : 16;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      aria-label={`${rating} out of 5 stars`}
      role="img"
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < full;
        const isHalf = i === full && half;
        return (
          <span
            key={i}
            className="relative inline-flex items-center justify-center overflow-hidden rounded-[2px]"
            style={{
              width: box,
              height: box,
              backgroundColor: filled ? TRUSTPILOT_GREEN : "#E5E7EB",
            }}
          >
            {isHalf ? (
              <>
                <span
                  className="absolute inset-0"
                  style={{ width: "50%", backgroundColor: TRUSTPILOT_GREEN }}
                />
                <StarIcon size={size === "sm" ? 8 : 10} className="relative z-10 text-white" />
              </>
            ) : (
              <StarIcon
                size={size === "sm" ? 8 : 10}
                className={filled ? "text-white" : "text-gray-300"}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

function StarIcon({ size, className }: { size: number; className: string }) {
  const path =
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={path} />
    </svg>
  );
}
