/**
 * Geographic helpers. Territorial extents are never hand-drawn: they are the
 * convex envelope of the find-spots of evidence cited by a polity, so every
 * vertex of a polygon traces back to a sourced record.
 */
import type { PolityEntry, SiteEntry } from "./types";
import { getEntry } from "./db";

type Pt = [lat: number, lng: number];

/** Andrew's monotone chain convex hull on lng/lat. */
export function convexHull(points: Pt[]): Pt[] {
  const pts = [...points].map(([lat, lng]) => [lng, lat] as [number, number]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length < 3) return points;
  const cross = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: [number, number][] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)].map(([lng, lat]) => [lat, lng]);
}

/** Expand a hull outward from its centroid so find-spots sit inside the envelope. */
export function padHull(hull: Pt[], factor = 0.08): Pt[] {
  const cx = hull.reduce((s, p) => s + p[0], 0) / hull.length;
  const cy = hull.reduce((s, p) => s + p[1], 0) / hull.length;
  return hull.map(([lat, lng]) => [lat + (lat - cx) * factor, lng + (lng - cy) * factor]);
}

export type { TerritoryShape as Territory } from "./maptypes";
import type { TerritoryShape as Territory } from "./maptypes";

export function territoryFor(p: PolityEntry): Territory | undefined {
  if (!p.extent) return undefined;
  const ev = p.extent.evidence
    .map((id) => getEntry(id))
    .filter((e): e is SiteEntry => !!e && e.type === "site")
    .map((s) => ({ id: s.id, title: s.title, lat: s.place.lat, lng: s.place.lng }));
  if (ev.length < 3) return undefined;
  return {
    polityId: p.id,
    title: p.title,
    hull: padHull(convexHull(ev.map((e) => [e.lat, e.lng]))),
    evidence: ev,
    basis: p.extent.basis,
    confidence: p.extent.confidence,
    start: p.dates?.start ?? -1e9,
    end: p.dates?.end ?? p.dates?.start ?? 1e9,
  };
}
