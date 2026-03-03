import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dhossain.com";
  return new URL(path, baseUrl).toString();
}
