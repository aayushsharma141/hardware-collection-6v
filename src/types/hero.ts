export interface HeroSlide {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  ctaTarget: string;
  imageUrl: string;
  productUrl?: string;
  /** "Selected specimen" card label and caption; fall back to built-in copy when absent. */
  specimenLabel?: string;
  specimenCaption?: string;
  macroUrl?: string;
  reflectionUrl?: string;
}
