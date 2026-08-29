/**
 * Testimonials are sourced from Sanity only. The `approved == true` gate lives in
 * `getTestimonialsQuery`, so anything reaching a component has been cleared for the
 * public site by an editor. Never hardcode review content in a component.
 */
export interface Testimonial {
  _id: string;
  customerName: string;
  quote: string;
  rating?: number;
  source?: string;
  date?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Formatted without `toLocaleDateString` so server and client render identical
 * strings — locale-dependent formatting is a hydration mismatch waiting to happen.
 */
export function formatTestimonialDate(date?: string): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return `${MONTHS[parsed.getUTCMonth()]} ${parsed.getUTCFullYear()}`;
}

/** Clamped to the 1–5 range the schema validates, defaulting to a full rating. */
export function clampRating(rating?: number): number {
  if (typeof rating !== "number" || Number.isNaN(rating)) return 5;
  return Math.max(1, Math.min(5, Math.round(rating)));
}
