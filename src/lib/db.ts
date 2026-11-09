/**
 * Data access layer. Every page reads through these functions; nothing
 * imports the seed files directly. Swapping this module's internals for
 * PostgreSQL queries is the whole migration path (see ARCHITECTURE.md).
 */
import type { Entry, EntryType, ImageRecord, PeriodEntry, SiteEntry, Source } from "./types";
import { periods } from "@/data/periods";
import { polities } from "@/data/polities";
import { sites } from "@/data/sites";
import { people, events, artefacts } from "@/data/people-events";
import { studies, concepts } from "@/data/genetics";
import { scripts, routes } from "@/data/scripts-routes";
import { subjects, articles, collections } from "@/data/editorial";
import { sources } from "@/data/sources";
import imageRegistry from "@/data/images.json";

const ALL: Entry[] = [
  ...periods,
  ...polities,
  ...sites,
  ...people,
  ...events,
  ...artefacts,
  ...studies,
  ...concepts,
  ...scripts,
  ...routes,
  ...subjects,
  ...articles,
  ...collections,
];

const byId = new Map(ALL.map((e) => [e.id, e]));
const sourceById = new Map(sources.map((s) => [s.id, s]));

/** Reverse-link index, computed once: id -> ids of entries that point to it. */
const backlinks = new Map<string, Set<string>>();
for (const e of ALL) {
  const outs = new Set<string>([...(e.related ?? []), ...(e.periods ?? []), ...(e.subjects ?? [])]);
  if (e.type === "collection") e.items.forEach((i) => outs.add(i.id));
  if (e.type === "site" && e.place) {
    /* sites link to themselves only through explicit relations */
  }
  for (const target of outs) {
    if (!backlinks.has(target)) backlinks.set(target, new Set());
    backlinks.get(target)!.add(e.id);
  }
}

const isPublic = (e: Entry | undefined): e is Entry => !!e && e.status === "published";

/** Public reads only ever see published entries. */
export function getEntry(id: string): Entry | undefined {
  const e = byId.get(id);
  return isPublic(e) ? e : undefined;
}

export function getEntryAnyStatus(id: string): Entry | undefined {
  return byId.get(id);
}

export function allEntries(opts: { includeUnpublished?: boolean } = {}): Entry[] {
  return opts.includeUnpublished ? ALL : ALL.filter(isPublic);
}

export function entriesOfType<T extends EntryType>(type: T): Extract<Entry, { type: T }>[] {
  return ALL.filter((e) => e.type === type && isPublic(e)) as Extract<Entry, { type: T }>[];
}

export function getPeriods(): PeriodEntry[] {
  return entriesOfType("period").sort((a, b) => a.order - b.order);
}

export function getSites(): SiteEntry[] {
  return entriesOfType("site");
}

/**
 * Everything connected to an entry, in both directions, de-duplicated and
 * restricted to published entries. Optionally filter by type.
 */
export function related(id: string, types?: EntryType[]): Entry[] {
  const e = byId.get(id);
  const ids = new Set<string>([...(e?.related ?? []), ...(backlinks.get(id) ?? [])]);
  ids.delete(id);
  const out: Entry[] = [];
  for (const rid of ids) {
    const r = getEntry(rid);
    if (r && (!types || types.includes(r.type))) out.push(r);
  }
  return out;
}

/** Entries that list `periodId` among their periods. */
export function inPeriod(periodId: string, types?: EntryType[]): Entry[] {
  return ALL.filter(
    (e) => isPublic(e) && e.periods?.includes(periodId) && (!types || types.includes(e.type)),
  );
}

export function inSubject(subjectId: string): Entry[] {
  return ALL.filter((e) => isPublic(e) && e.subjects?.includes(subjectId));
}

export function getSource(id: string): Source | undefined {
  return sourceById.get(id);
}

export function allSources(): Source[] {
  return [...sources].sort((a, b) => a.authors.localeCompare(b.authors) || a.year - b.year);
}

/** Every published entry citing a source. */
export function citingEntries(sourceId: string): Entry[] {
  return ALL.filter(
    (e) =>
      isPublic(e) &&
      (e.cite.some((c) => c.sourceId === sourceId) ||
        ("sections" in e &&
          (e.sections ?? []).some((s) => s.cite?.some((c) => c.sourceId === sourceId)))),
  );
}

/** All distinct sources used by an entry, including section-level citations. */
export function sourcesFor(e: Entry): Source[] {
  const ids = new Set(e.cite.map((c) => c.sourceId));
  if ("sections" in e) for (const s of e.sections ?? []) s.cite?.forEach((c) => ids.add(c.sourceId));
  return [...ids].map((id) => sourceById.get(id)).filter((s): s is Source => !!s);
}

export function getImage(id: string | undefined): ImageRecord | undefined {
  if (!id) return undefined;
  return (imageRegistry as Record<string, ImageRecord>)[id];
}

/** URL for an entry's detail page. One place to change routing. */
export function hrefFor(e: Pick<Entry, "id" | "type">): string {
  switch (e.type) {
    case "period": return `/periods/${e.id}`;
    case "polity": return `/civilisations/${e.id}`;
    case "site": return `/sites/${e.id}`;
    case "artefact": return `/artefacts/${e.id}`;
    case "person": return `/people/${e.id}`;
    case "event": return `/events/${e.id}`;
    case "study": return `/genetics/${e.id}`;
    case "concept": return `/genetics#${e.id}`;
    case "script": return `/languages#${e.id}`;
    case "article": return `/articles/${e.id}`;
    case "collection": return `/collections/${e.id}`;
    case "route": return `/trade#${e.id}`;
    case "subject": return `/explore/${e.id}`;
  }
}

export const TYPE_LABEL: Record<EntryType, string> = {
  period: "Period",
  polity: "Polity",
  site: "Site",
  artefact: "Artefact",
  person: "Person",
  event: "Event",
  study: "Genetic study",
  concept: "Concept",
  script: "Script / language",
  article: "Article",
  collection: "Collection",
  route: "Route",
  subject: "Subject",
};
