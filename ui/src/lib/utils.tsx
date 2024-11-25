// handles classname merging

import { ROLE_NAMES } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getRoleName = (roleId: number | undefined): string => {
  if (!roleId) return "Unknown Role";
  return ROLE_NAMES[roleId] || "Unknown Role";
};

export const toLocalISOString = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString();
};

export const shortDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    dateStyle: "short",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};
export const shortTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    timeStyle: "short",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};
