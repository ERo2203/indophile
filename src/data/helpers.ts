import type { Citation, DatePrecision, DateRange } from "@/lib/types";

export const UPDATED = "2026-11-09";
export const SEED_EDITOR = "Seed dataset (pending editorial verification)";

export const c = (sourceId: string, locus?: string, supports?: string): Citation => ({
  sourceId,
  locus,
  supports,
});

export const d = (
  start: number,
  end: number | undefined,
  precision: DatePrecision,
  label?: string,
  note?: string,
): DateRange => ({ start, end, precision, label, note });
