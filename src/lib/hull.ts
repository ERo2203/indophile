/** Pure geometry, safe for client and server. */
export type Pt = [lat: number, lng: number];

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

/** Convex envelope of circles of radius r (degrees) around each point. */
export function bufferedHull(points: Pt[], r: number): Pt[] {
  const ring: Pt[] = [];
  for (const [lat, lng] of points) {
    const k = 1 / Math.cos((lat * Math.PI) / 180);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      ring.push([lat + Math.sin(a) * r, lng + Math.cos(a) * r * k]);
    }
  }
  return convexHull(ring).map(([a, b]) => [Math.round(a * 100) / 100, Math.round(b * 100) / 100]);
}

export function centroid(hull: Pt[]): Pt {
  const lat = hull.reduce((s, p) => s + p[0], 0) / hull.length;
  const lng = hull.reduce((s, p) => s + p[1], 0) / hull.length;
  return [Math.round(lat * 100) / 100, Math.round(lng * 100) / 100];
}

export const area = (h: Pt[]) =>
  Math.abs(
    h.reduce((s, p, i) => {
      const q = h[(i + 1) % h.length];
      return s + p[1] * q[0] - q[1] * p[0];
    }, 0),
  ) / 2;

export interface TimedPoint {
  lat: number;
  lng: number;
  from?: number;
  to?: number;
}

/** Envelopes for the points valid at `year` (or all points when year is null). */
export function hullsAt(groups: TimedPoint[][], r: number, year: number | null): { hulls: Pt[][]; label: Pt } | null {
  const live = groups
    .map((g) => g.filter((p) => year === null || ((p.from ?? -Infinity) <= year && year <= (p.to ?? Infinity))))
    .filter((g) => g.length > 0);
  if (!live.length) return null;
  const hulls = live.map((g) => bufferedHull(g.map((p) => [p.lat, p.lng] as Pt), r));
  const biggest = hulls.reduce((a, b) => (area(b) > area(a) ? b : a));
  return { hulls, label: centroid(biggest) };
}
