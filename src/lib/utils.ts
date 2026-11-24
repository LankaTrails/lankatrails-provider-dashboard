import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a rating value to display with one decimal place
 * @param rating - The rating value (can be number, null, or undefined)
 * @param defaultValue - The default value to return if rating is null/undefined
 * @returns Formatted rating string with one decimal place
 */
export function formatRating(rating: number | null | undefined, defaultValue: string = "0.0"): string {
  if (rating === null || rating === undefined || isNaN(rating)) {
    return defaultValue;
  }
  return rating.toFixed(1);
}