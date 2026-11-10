/**
 * Serialises the knowledge graph into the plain, JSON-safe feature payload the
 * client map consumes. Geographic data stays separate from editorial prose:
 * the map only receives ids, coordinates, dates, layers and short labels.
 */
import type { MapPayload, PointFeature, RouteFeature } from "./maptypes";
import type { MapLayer } from "./types";
export * from "./maptypes";
import { allEntries, entriesOfType, getImage, getPeriods, hrefFor, regionOf } from "./db";
import { formatRange } from "./format";

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
    tradition: s.tradition?.[0],
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

  const territories = entriesOfType("polity").map((p) => ({
    polityId: p.id,
    title: p.title,
    href: hrefFor(p),
    dateLabel: formatRange(p.dates),
    kind: p.kind,
    region: regionOf(p.id),
    start: p.dates?.start ?? -1e9,
    end: p.dates?.end ?? p.dates?.start ?? 1e9,
  }));

  // Inscriptions, temples and other monuments that locate a polity become map points too.
  for (const pol of entriesOfType("polity")) {
    const all = [...(pol.extent?.anchors ?? []), ...(pol.extent?.zones ?? []).flat()];
    for (const [i, an] of all.entries()) {
      const role = (an.role ?? "").toLowerCase();
      const layers: MapLayer[] = [];
      if (role.includes("inscription") || role.includes("copper plate") || role.includes("pillar")) layers.push("inscription");
      if (/(temple|mosque|monaster|stupa|shrine|cave|colossus|dargah|tomb|mausoleum)/.test(role)) layers.push("temple");
      if (!layers.length) continue;
      points.push({
        id: `${pol.id}~${i}`,
        title: an.name,
        lat: an.lat,
        lng: an.lng,
        layers,
        start: an.from ?? pol.dates?.start ?? -1e9,
        end: an.to ?? pol.dates?.end ?? pol.dates?.start ?? 1e9,
        dateLabel: an.from !== undefined ? `${formatRange({ start: an.from, end: an.to, precision: "approximate" })}` : formatRange(pol.dates),
        precision: "approximate",
        modern: an.role ?? "",
        country: "",
        summary: `${an.role ? an.role[0].toUpperCase() + an.role.slice(1) : "Monument"} — locates ${pol.title}.`,
        href: hrefFor(pol),
        periods: pol.periods ?? [],
        related: [pol.id],
        polityId: pol.id,
      });
    }
  }

  const index = Object.fromEntries(allEntries().map((e) => [e.id, { t: e.title, h: hrefFor(e) }]));
  const periods = getPeriods().map((p) => ({
    id: p.id,
    title: p.title,
    start: p.dates?.start ?? 0,
    end: p.dates?.end ?? p.dates?.start ?? 0,
    href: hrefFor(p),
    precision: p.dates?.precision ?? "approximate",
  }));
  return { index, periods, points, routes, territories };
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

