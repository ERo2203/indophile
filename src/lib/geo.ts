/**
 * Geographic helpers. Territorial extents are never hand-drawn: each is a
 * buffered envelope around points that a source ties to the polity — its
 * capitals, dated inscriptions and monuments, or the find-spots of sourced
 * site records. Every vertex therefore traces back to a cited location.
 */
import type { Anchor, PolityEntry, SiteEntry } from "./types";
import type { TerritoryShape as Territory } from "./maptypes";
import { getEntry } from "./db";

export type { TerritoryShape as Territory } from "./maptypes";

import { convexHull, bufferedHull, hullsAt } from "./hull";
export { convexHull, bufferedHull };

const PALETTE = ["#C0613F", "#5E8C4A", "#D1A23B", "#3F6FA0", "#9B4F7A", "#E08A3C", "#3F8A86", "#A8402F", "#7E8F2E", "#6E5AA6", "#B5703A", "#2F7A5A", "#C24E6B", "#4E7F9E", "#8C6B3A", "#58A06E"];

function colourFor(id: string): string {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function territoryFor(p: PolityEntry, region?: string): Territory | undefined {
  const x = p.extent;
  if (!x) return undefined;
  const fromSites = (x.evidence ?? [])
    .map((id) => getEntry(id))
    .filter((e): e is SiteEntry => !!e && e.type === "site")
    .map((s) => ({ id: s.id, title: s.title, lat: s.place.lat, lng: s.place.lng, role: "site record" as string | undefined, from: undefined as number | undefined, to: undefined as number | undefined }));
  const anchors: Anchor[] = x.anchors ?? [];
  const main = [...fromSites, ...anchors.map((a) => ({ title: a.name, lat: a.lat, lng: a.lng, role: a.role, from: a.from, to: a.to }))];
  const zones = (x.zones ?? []).map((z) => z.map((a) => ({ title: a.name, lat: a.lat, lng: a.lng, role: a.role, from: a.from, to: a.to })));
  const groups = [main, ...zones].filter((g) => g.length > 0);
  if (!groups.length) return undefined;

  // Kingdoms and empires governed a hinterland well beyond their dated
  // monuments, so their envelopes are widened; chiefdoms, colonial enclaves
  // and archaeological distributions stay tight around the evidence.
  const tight = ["chiefdom", "colonial", "archaeological-culture", "civilisation"].includes(p.kind);
  const r = (x.radius ?? (fromSites.length >= 3 ? 0.55 : 0.8)) * (tight ? 1 : 1.7);
  const timed = groups.map((g) => g.map((e) => ({ lat: e.lat, lng: e.lng, from: e.from, to: e.to })));
  const political = !["archaeological-culture", "civilisation"].includes(p.kind);
  const pts = groups.flat().map((e) => ({ lat: e.lat, lng: e.lng, from: e.from, to: e.to, w: weightFor(e.role) }));
  const all = hullsAt(timed, r, null)!;
  return {
    polityId: p.id,
    title: p.title,
    hulls: all.hulls,
    label: all.label,
    groups: timed,
    radius: r,
    political,
    reachKm: REACH[p.kind] ?? 220,
    pts,
    color: colourFor(p.id),
    region,
    evidence: [...main, ...zones.flat()],
    basis: x.basis,
    confidence: x.confidence,
    start: p.dates?.start ?? -1e9,
    end: p.dates?.end ?? p.dates?.start ?? 1e9,
  };
}

/** Reach of a weight-1 centre, by polity kind (km). */
const REACH: Partial<Record<PolityEntry["kind"], number>> = {
  empire: 330,
  confederacy: 300,
  sultanate: 270,
  kingdom: 250,
  janapada: 160,
  republic: 130,
  chiefdom: 100,
  colonial: 35,
};

/** Capitals project authority further than forts, ports or single monuments. */
export function weightFor(role?: string): number {
  const r = (role ?? "capital").toLowerCase();
  if (r.startsWith("capital") || r.includes(" capital") || r === "capital") return 1.5;
  if (r.includes("province") || r.includes("provincial")) return 1.2;
  if (r.includes("fort") || r.includes("city") || r.includes("centre")) return 1.0;
  if (r.includes("port")) return 0.85;
  return 0.75; // inscriptions, temples, monuments, sites
}
