import type { DateRange, EventEntry } from "./types";
import { entriesOfType, getEntry, getPeriods, getSource, hrefFor } from "./db";
import { citeLabel, formatRange } from "./format";

export type TimelineCategory = EventEntry["category"] | "polity";

export interface TimelineItem {
  id: string;
  title: string;
  href: string;
  category: TimelineCategory;
  start: number;
  end?: number;
  precision: DateRange["precision"];
  dateLabel: string;
  place?: string;
  summary: string;
  significance?: string;
  evidence?: string;
  periods: string[];
  related: { id: string; title: string; href: string }[];
  sources: string[];
}

export interface TimelineBand {
  id: string;
  title: string;
  href: string;
  start: number;
  end: number;
  precision: DateRange["precision"];
  dateLabel: string;
  phase: number;
}

export function buildTimeline(): { items: TimelineItem[]; bands: TimelineBand[] } {
  const all = [...entriesOfType("event"), ...entriesOfType("polity")];
  const items: TimelineItem[] = all
    .filter((e) => e.dates)
    .map((e) => ({
      id: e.id,
      title: e.title,
      href: hrefFor(e),
      category: (e.type === "event" ? e.category : "polity") as TimelineCategory,
      start: e.dates!.start,
      end: e.dates!.end,
      precision: e.dates!.precision,
      dateLabel: formatRange(e.dates),
      place: e.type === "event" && e.place ? `${e.place.modern}, ${e.place.country}` : undefined,
      summary: e.summary,
      significance: e.type === "event" ? e.significance : undefined,
      evidence: e.evidence,
      periods: e.periods ?? [],
      related: (e.related ?? [])
        .map((id) => {
          const r = getEntry(id);
          return r ? { id: r.id, title: r.title, href: hrefFor(r) } : undefined;
        })
        .filter((x): x is NonNullable<typeof x> => !!x)
        .slice(0, 4),
      sources: e.cite.map((c) => getSource(c.sourceId)).filter(Boolean).map((s) => citeLabel(s!.authors, s!.year)),
    }))
    .sort((a, b) => a.start - b.start);

  const bands = getPeriods().map((p) => ({
    id: p.id,
    title: p.title,
    href: hrefFor(p),
    start: p.dates!.start,
    end: p.dates!.end ?? p.dates!.start,
    precision: p.dates!.precision,
    dateLabel: formatRange(p.dates),
    phase: p.phase,
  }));
  return { items, bands };
}
