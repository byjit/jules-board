import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const NAME_REGEX = /\s+/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name?: string): string {
  if (!name) return "U";
  const words = name.trim().split(NAME_REGEX).filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((word) => word?.[0]?.toUpperCase())
    .join("");
  return initials || "U";
}
