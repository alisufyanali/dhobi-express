import { karachiToday } from "./delivery";

/** Start of today / this month in Karachi, as UTC Date objects for createdAt comparisons. */
export function karachiRanges() {
  const today = karachiToday(); // YYYY-MM-DD
  const startToday = new Date(`${today}T00:00:00+05:00`);
  const startMonth = new Date(`${today.slice(0, 7)}-01T00:00:00+05:00`);
  return { today, startToday, startMonth };
}
