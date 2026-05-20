import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// function to merge tailwind classes together
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// this generates a random student id like STU-12345
export function generateStudentId() {
  let num = Math.floor(10000 + Math.random() * 90000);
  return "STU-" + num;
}

// format a date to show like "May 20, 2025"
export function formatDate(date: Date | string) {
  let d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// converts minutes to something like "2h 30m"
export function formatDuration(minutes: number) {
  if (minutes < 60) return minutes + "m";
  let h = Math.floor(minutes / 60);
  let m = minutes % 60;
  if (m > 0) return h + "h " + m + "m";
  return h + "h";
}

// says good morning/afternoon/evening based on time
export function getGreeting() {
  let hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// returns a random motivational message when you complete something
export function getCompletionMessage() {
  let messages = [
    "Consistency creates success.",
    "You are building discipline daily.",
    "Great work. Keep the momentum going.",
    "Every session counts. You showed up today.",
    "Progress is built one day at a time.",
    "Your dedication is paying off.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// returns a message when you miss a day
export function getMissedMessage() {
  let messages = [
    "Small excuses become big failures.",
    "Your future depends on your discipline today.",
    "One missed day is okay. Do not miss twice.",
    "Discipline is choosing what you want most over what you want now.",
    "The only bad workout is the one that did not happen.",
    "Reset and come back stronger tomorrow.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// cuts a long string short and adds ...
export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

// calculates what % of tasks are done
export function calculateConsistency(completed: number, total: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
