import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// import { parseISO, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function convertTimeStampToDateString(timestamp: string) {
//   const date = parseISO(timestamp);
//   return format(date, "dd MMMM yyyy");
// }
