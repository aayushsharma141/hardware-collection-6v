import { Star } from "lucide-react";

/**
 * StarRating — a rating out of five, drawn.
 *
 * Both review surfaces previously rendered `rating` copies of the "★"
 * character and nothing else, so a four-star review showed four stars with no
 * empty fifth and read as full marks. The unfilled remainder is what makes a
 * rating legible, so it is always drawn.
 */
export function StarRating({
  rating,
  className = "w-3 h-3",
  total = 5,
}: {
  rating: number;
  className?: string;
  total?: number;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} out of ${total} stars`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < rating;
        return (
          <Star
            key={i}
            aria-hidden="true"
            className={`${className} ${
              filled ? "fill-[#C8A96E] text-[#C8A96E]" : "fill-none text-[var(--text-secondary)]/25"
            }`}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}

