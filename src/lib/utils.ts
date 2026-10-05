import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Joins class names and resolves Tailwind conflicts (later wins). Used by the shadcn components in `components/ui`. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
