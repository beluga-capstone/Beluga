// handles classname merging

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
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
