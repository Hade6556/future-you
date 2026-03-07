import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined)[]): string {
  return twMerge(inputs.filter(Boolean));
}
