import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn function
 *
 * @description A utility function for conditionally joining class names
 * @param {...ClassValue} inputs - The class names to be merged
 * @returns {string} The merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
