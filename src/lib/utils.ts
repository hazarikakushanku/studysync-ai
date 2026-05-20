import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a random anonymous student ID */
export function generateStudentId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `STU-${num}`;
}

/** Format date to readable string */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format time duration in minutes to human-readable */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Get greeting based on time of day */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Get motivational message for completion */
export function getCompletionMessage(): string {
  const messages = [
    "Consistency creates success.",
    "You are building discipline daily.",
    "Great work. Keep the momentum going.",
    "Every session counts. You showed up today.",
    "Progress is built one day at a time.",
    "Your dedication is paying off.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

/** Get reality-check message for missed day */
export function getMissedMessage(): string {
  const messages = [
    "Small excuses become big failures.",
    "Your future depends on your discipline today.",
    "One missed day is okay. Do not miss twice.",
    "Discipline is choosing what you want most over what you want now.",
    "The only bad workout is the one that did not happen.",
    "Reset and come back stronger tomorrow.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

/** Truncate text with ellipsis */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/** Calculate consistency score (percentage) */
export function calculateConsistency(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
