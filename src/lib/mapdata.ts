/**
 * Serialises the knowledge graph into the plain, JSON-safe feature payload the
 * client map consumes. Geographic data stays separate from editorial prose:
 * the map only receives ids, coordinates, dates, layers and short labels.
 */
import type { MapPayload, PointFeature, RouteFeature } from "./maptypes";
export * from "./maptypes";
import { allEntries, entriesOfType, getImage, hrefFor } from "./db";
import { formatRange } from "./format";
import { territoryFor } from "./geo";

export function buildMapPayload(): MapPayload {
  const points: PointFeature[] = entriesOfType("site").map((s) => ({
    id: s.id,
    title: s.title,
    lat: s.place.lat,
    lng: s.place.lng,
    layers: s.layers,
    start: s.dates?.start ?? -1e9,
    end: s.dates?.end ?? s.dates?.start ?? 1e9,
    dateLabel: formatRange(s.dates),
    precision: s.dates?.precision ?? "approximate",
    modern: s.place.modern,
    country: s.place.country,
    summary: s.summary,
    href: hrefFor(s),
    approximate: s.place.approximate,
    culture: s.culture,
    evidence: s.evidence,
    periods: s.periods ?? [],
    image: (() => {
      const rec = getImage(s.image?.id);
      return rec ? { src: rec.src, credit: `${rec.artist || "Unknown"} · ${rec.license}` } : undefined;
    })(),
    findings: s.findings?.slice(0, 4),
    discovered: s.discovered ? [s.discovered.year, s.discovered.by].filter(Boolean).join(" · ") : undefined,
    excavations: s.excavations?.map((x) => `${x.years} — ${x.by}`).join("; "),
    unesco: s.unesco?.year,
    related: s.related ?? [],
  }));

  const routes: RouteFeature[] = entriesOfType("route").map((r) => ({
    id: r.id,
    title: r.title,
    layer: r.layer,
    path: r.path,
    start: r.dates?.start ?? -1e9,
    end: r.dates?.end ?? 1e9,
    dateLabel: formatRange(r.dates),
    basis: r.geometryBasis,
    summary: r.summary,
    href: hrefFor(r),
    commodities: r.commodities,
    evidence: r.evidence,
  }));

  const territories = entriesOfType("polity")
    .map((p) => {
      const t = territoryFor(p);
      return t ? { ...t, href: hrefFor(p), dateLabel: formatRange(p.dates), kind: p.kind } : undefined;
    })
    .filter((t): t is NonNullable<typeof t> => !!t);

  const index = Object.fromEntries(allEntries().map((e) => [e.id, { t: e.title, h: hrefFor(e) }]));
  return { index, points, routes, territories };
}


let cached: MapPayload | null = null;
export function mapPayload(): MapPayload {
  return (cached ??= buildMapPayload());
}

/** Point features for a set of entry ids (sites only), for small contextual maps. */
export function pointsFor(ids: string[]): PointFeature[] {
  const set = new Set(ids);
  return mapPayload().points.filter((p) => set.has(p.id));
}

export function routesFor(ids: string[]): RouteFeature[] {
  const set = new Set(ids);
  return mapPayload().routes.filter((r) => set.has(r.id));
}

export function territoriesFor(ids: string[]) {
  const set = new Set(ids);
  return mapPayload().territories.filter((t) => set.has(t.polityId));
}
