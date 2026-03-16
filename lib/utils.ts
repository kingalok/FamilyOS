import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatDate(value?: string | null) {
  if (!value) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium"
  }).format(new Date(value));
}

export function parseTags(input: string) {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function stringifyTags(tags?: string[] | null) {
  return tags?.join(", ") ?? "";
}
