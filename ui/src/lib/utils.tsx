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
