"use client";

import { useEffect, useRef, useState } from "react";
import type * as LT from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PointFeature, RouteFeature } from "@/lib/maptypes";
import { LAYER_META, primaryLayer } from "@/lib/maptypes";
import type { MapLayer } from "@/lib/types";
import { CLIOPATRIA_CREDIT, HBM_CREDIT, CLIO_TO_POLITY, clioKey, type ClioFeature, type HbmFeature, type ShownPolity } from "@/lib/cliopatria";


export interface MapCanvasProps {
  points: PointFeature[];
  routes?: RouteFeature[];
  selectedId?: string | null;
  onSelect?: (id: string | null, kind?: "point" | "route" | "territory") => void;
  /** Fit the view to the given points on data change (mini/article maps). */
  fit?: boolean;
  interactive?: boolean;
  modernLabels?: boolean;
  /** Which layer colours a point when it belongs to several. */
  colorBy?: MapLayer[];
  className?: string;
  initialView?: { center: [number, number]; zoom: number };
  showLabels?: boolean;
  /**
   * Sourced political boundaries (Cliopatria). `year` shows every polity at that
   * date; `only` restricts to given Indophile polity ids; `largest` draws only
   * each polity's largest recorded extent (for polity pages).
   */
  boundaries?: { year: number | null; only?: string[]; largest?: boolean } | null;
  onBoundariesShown?: (shown: ShownPolity[]) => void;
  basemap?: "plain" | "terrain";
}


export default function MapCanvas({
  points,
  routes = [],
  selectedId,
  onSelect,
  fit = false,
  interactive = true,
  modernLabels = false,
  colorBy,
  className = "",
  initialView = { center: [23.5, 77], zoom: 5 },
  showLabels = false,
  boundaries = null,
  onBoundariesShown,
  basemap = "plain",
}: MapCanvasProps) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LT.Map | null>(null);
  const L = useRef<typeof LT | null>(null);
  const dataLayer = useRef<LT.LayerGroup | null>(null);
  const borderLayer = useRef<LT.GeoJSON | null>(null);
  const bordersData = useRef<unknown>(null);
  const boundaryLayer = useRef<LT.LayerGroup | null>(null);
  const themeHandler = useRef<(() => void) | null>(null);
  const mqRef = useRef<MediaQueryList | null>(null);
  const onShownRef = useRef(onBoundariesShown);
  onShownRef.current = onBoundariesShown;
  const terrain = useRef<LT.TileLayer | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [ready, setReadyTick] = useState(0);

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const leaflet = (await import("leaflet")).default;
      if (cancelled || !el.current || map.current) return;
      L.current = leaflet;
      const m = leaflet.map(el.current, {
        center: initialView.center,
        zoom: initialView.zoom,
        minZoom: 3,
        maxZoom: 11,
        preferCanvas: true,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        touchZoom: interactive,
        keyboard: interactive,
        attributionControl: true,
        worldCopyJump: false,
        maxBounds: [[-5, 25], [55, 120]],
      });
      // Plain cartographic base: land, lakes, rivers and a faint graticule,
      // drawn from Natural Earth (public domain). No imagery, no tiles.
      m.createPane("base").style.zIndex = "200";
      m.createPane("borders").style.zIndex = "250";
      const base = leaflet.canvas({ pane: "base", padding: 0.5 });
      const geo = await loadBase();
      if (cancelled) return;
      const land = leaflet.geoJSON(geo.land as never, { pane: "base", renderer: base, interactive: false, style: { stroke: true, color: cssVar("--map-coast"), weight: 0.8, fillColor: cssVar("--map-land"), fillOpacity: 1 } } as unknown as LT.GeoJSONOptions).addTo(m);
      const lakes = leaflet.geoJSON(geo.lakes as never, { pane: "base", renderer: base, interactive: false, style: { stroke: true, color: cssVar("--map-lake-edge"), weight: 0.6, fillColor: cssVar("--map-lake"), fillOpacity: 1 } } as unknown as LT.GeoJSONOptions).addTo(m);
      const rivers = leaflet.geoJSON(geo.rivers as never, {
        pane: "base", renderer: base, interactive: false,
        style: (f: { properties?: { scalerank?: number } } | undefined) => ({ color: cssVar("--map-river"), weight: (f?.properties?.scalerank ?? 6) <= 3 ? 1.4 : 0.8, opacity: 0.85 }),
      } as unknown as LT.GeoJSONOptions).addTo(m);
      const grat: [number, number][][] = [];
      for (let lng = 30; lng <= 120; lng += 5) grat.push([[-10, lng], [60, lng]]);
      for (let lat = -5; lat <= 55; lat += 5) grat.push([[lat, 20], [lat, 125]]);
      const graticule = leaflet.polyline(grat, { pane: "base", renderer: base, interactive: false, color: cssVar("--map-grat"), opacity: 1, weight: 0.6 }).addTo(m);
      // Repaint the base map when the visitor switches theme.
      const repaint = () => {
        land.setStyle({ color: cssVar("--map-coast"), fillColor: cssVar("--map-land") });
        lakes.setStyle({ color: cssVar("--map-lake-edge"), fillColor: cssVar("--map-lake") });
        rivers.setStyle({ color: cssVar("--map-river") });
        graticule.setStyle({ color: cssVar("--map-grat") });
        setReadyTick((t) => t + 1);
      };
      themeHandler.current = repaint;
      window.addEventListener("indophile:theme", repaint);
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", repaint);
      mqRef.current = mq;
      bordersData.current = geo.borders;
      m.attributionControl.setPrefix(false);
      m.attributionControl.addAttribution("Base: Natural Earth (public domain)");
      // Sourced boundaries (Cliopatria) and their labels.
      m.createPane("politiesUnder").style.zIndex = "290";
      m.createPane("polities").style.zIndex = "300";
      m.createPane("areaLabels").style.zIndex = "450";
      boundaryLayer.current = leaflet.layerGroup().addTo(m);
      m.attributionControl.addAttribution(CLIOPATRIA_CREDIT);
      m.attributionControl.addAttribution(HBM_CREDIT);
      m.on("click", () => onSelectRef.current?.(null));
      map.current = m;
      dataLayer.current = leaflet.layerGroup().addTo(m);
      setReadyTick((t) => t + 1); // redraw once the async init completes
    })();
    return () => {
      cancelled = true;
      if (themeHandler.current) {
        window.removeEventListener("indophile:theme", themeHandler.current);
        mqRef.current?.removeEventListener("change", themeHandler.current);
      }
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Present-day borders, for orientation only
  useEffect(() => {
    const m = map.current, leaflet = L.current;
    if (!m || !leaflet || !bordersData.current) return;
    if (modernLabels && !borderLayer.current) {
      borderLayer.current = leaflet
        .geoJSON(bordersData.current as never, { pane: "borders", interactive: false, style: { color: cssVar("--map-border"), weight: 1, dashArray: "3 4", opacity: 0.7 } })
        .addTo(m);
    } else if (!modernLabels && borderLayer.current) {
      borderLayer.current.remove();
      borderLayer.current = null;
    }
  });

  // Terrain basemap (optional)
  useEffect(() => {
    const m = map.current, leaflet = L.current;
    if (!m || !leaflet) return;
    if (basemap === "terrain" && !terrain.current) {
      if (!m.getPane("terrain")) m.createPane("terrain").style.zIndex = "210";
      terrain.current = leaflet
        .tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}", {
          pane: "terrain",
          maxNativeZoom: 8,
          maxZoom: 11,
          attribution: "Relief &copy; Esri — US National Park Service",
        })
        .addTo(m);
    } else if (basemap !== "terrain" && terrain.current) {
      terrain.current.remove();
      terrain.current = null;
    }
  });

  // Political boundaries for the current moment: Cliopatria on top, historical-basemaps filling gaps beneath.
  const bKey = boundaries ? `${boundaries.year}|${(boundaries.only ?? []).join(",")}|${boundaries.largest ? 1 : 0}|${selectedId ?? ""}` : "";
  useEffect(() => {
    const m = map.current, leaflet = L.current, group = boundaryLayer.current;
    if (!m || !leaflet || !group) return;
    group.clearLayers();
    if (!boundaries) {
      onShownRef.current?.([]);
      return;
    }
    let alive = true;
    (async () => {
      const [clioAll, hbmAll] = await Promise.all([loadPolities(), boundaries.only ? Promise.resolve([] as HbmFeature[]) : loadHbm()]);
      if (!alive) return;
      const inYear = (f: number, t: number) => boundaries.year === null || (f <= boundaries.year && boundaries.year <= t);
      let clioShown = clioAll.filter((f) => (!boundaries.only || boundaries.only.includes(CLIO_TO_POLITY[f.properties.n] ?? "")) && inYear(f.properties.f, f.properties.t));
      if (boundaries.largest) {
        const best = new Map<string, { f: ClioFeature; a: number }>();
        for (const f of clioShown) {
          const a = ringArea(largestRing(f));
          const k = CLIO_TO_POLITY[f.properties.n] ?? f.properties.n;
          if (!best.has(k) || best.get(k)!.a < a) best.set(k, { f, a });
        }
        clioShown = [...best.values()].map((x) => x.f);
      }
      // Gap-fill regions are shown only where the primary dataset leaves land empty.
      const hbmShown = boundaries.year === null ? [] : hbmAll.filter((f) => inYear(f.properties.f, f.properties.t) && coveredShare(f, clioShown) < 0.5);

      type Item = { key: string; name: string; src: "cliopatria" | "hbm"; f: ClioFeature | HbmFeature; bbox: [number, number, number, number]; area: number; color?: string };
      const items: Item[] = [
        ...clioShown.map((f) => ({ key: clioKey(f.properties.n, f.properties.f), name: f.properties.n, src: "cliopatria" as const, f, bbox: featBbox(f), area: ringArea(largestRing(f)) })),
        ...hbmShown.map((f) => ({ key: `hbm:${f.properties.n}|${f.properties.f}`, name: f.properties.n, src: "hbm" as const, f, bbox: featBbox(f), area: ringArea(largestRing(f)) })),
      ];
      assignColours(items);

      const renderer = leaflet.canvas({ pane: "polities", padding: 0.3 });
      const draw = (it: Item) => {
        const sel = selectedId === it.key || (!!selectedId && CLIO_TO_POLITY[it.name] === selectedId);
        const hb = it.src === "hbm";
        const layer = leaflet.geoJSON(it.f as never, {
          pane: hb ? "politiesUnder" : "polities",
          renderer: hb ? underRenderer : renderer,
          interactive,
          style: {
            color: cssVar("--map-poly-edge"),
            weight: sel ? 2.4 : hb ? 0.8 : 1,
            dashArray: hb ? "4 3" : undefined,
            opacity: 0.85,
            fillColor: it.color,
            fillOpacity: sel ? 0.66 : selectedId ? 0.28 : hb ? 0.32 : 0.5,
          },
        } as unknown as LT.GeoJSONOptions);
        layer.on("click", (ev) => {
          leaflet.DomEvent.stopPropagation(ev);
          onSelectRef.current?.(it.key, "territory");
        });
        const p = it.f.properties;
        layer.bindTooltip(`${it.name} · ${fmtY(p.f)}–${fmtY(p.t)}${hb ? " · gap-fill source" : ""}`, { className: "ind-tip", sticky: true });
        group.addLayer(layer);
        if (it.area > 0.35) {
          const [lng, lat] = ringCentroid(largestRing(it.f));
          const fs = Math.max(11, Math.min(19, 9.5 + Math.sqrt(it.area) * 0.9));
          group.addLayer(
            leaflet.marker([lat, lng], {
              pane: "areaLabels",
              interactive: false,
              icon: leaflet.divIcon({ className: "", html: `<span class="ind-area-label${hb ? " ind-area-label-alt" : ""}" style="font-size:${fs.toFixed(0)}px">${it.name}</span>`, iconSize: [0, 0] }),
            }),
          );
        }
      };
      const underRenderer = leaflet.canvas({ pane: "politiesUnder", padding: 0.3 });
      items.filter((i) => i.src === "hbm").forEach(draw);
      items.filter((i) => i.src === "cliopatria").forEach(draw);
      onShownRef.current?.(
        items
          .sort((a, b) => b.area - a.area)
          .map((i) => ({ key: i.key, name: i.name, color: i.color!, src: i.src, from: i.f.properties.f, to: i.f.properties.t, polityId: CLIO_TO_POLITY[i.name] })),
      );
      if (fit && boundaries.only && items.length) {
        const b = leaflet.latLngBounds([]);
        group.eachLayer((l) => {
          const gl = l as LT.GeoJSON;
          if (typeof gl.getBounds === "function") b.extend(gl.getBounds());
        });
        if (b.isValid()) m.fitBounds(b.pad(0.1), { animate: false });
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bKey, ready]);

  // Draw data
  useEffect(() => {
    const m = map.current, leaflet = L.current, group = dataLayer.current;
    if (!m || !leaflet || !group) return;
    group.clearLayers();

    for (const r of routes) {
      const isMig = r.layer === "migration";
      const line = leaflet.polyline(r.path, {
        color: isMig ? cssVar("--color-sage-deep") : cssVar("--color-gold"),
        weight: selectedId === r.id ? 4 : isMig ? 2.5 : 2.2,
        opacity: 0.9,
        dashArray: r.basis === "schematic" ? (isMig ? "1 7" : "6 6") : undefined,
        lineCap: "round",
        interactive,
      });
      line.on("click", (ev) => { leaflet.DomEvent.stopPropagation(ev); onSelectRef.current?.(r.id, "route"); });
      line.bindTooltip(r.title, { className: "ind-tip", sticky: true });
      group.addLayer(line);
      // arrowhead dot for direction
      const end = r.path[r.path.length - 1];
      group.addLayer(leaflet.circleMarker(end, { radius: 3.5, color: isMig ? cssVar("--color-sage-deep") : cssVar("--color-gold"), fillOpacity: 1, weight: 0, interactive: false }));
    }

    for (const p of points) {
      const layer = primaryLayer(p, colorBy);
      const meta = LAYER_META[layer];
      const sel = selectedId === p.id;
      const hollow = layer === "inscription" || layer === "battle";
      const col = p.color ?? meta.color;
      const marker = leaflet.circleMarker([p.lat, p.lng], {
        radius: sel ? 9 : layer === "inscription" || layer === "temple" ? 4.5 : 6,
        color: sel ? cssVar("--color-ink") : hollow ? col : cssVar("--color-ivory"),
        weight: sel ? 2.5 : hollow ? 2 : 1.5,
        fillColor: col,
        fillOpacity: hollow ? 0.25 : 0.95,
        dashArray: p.approximate ? "2 2" : undefined,
        interactive,
      });
      marker.on("click", (ev) => { leaflet.DomEvent.stopPropagation(ev); onSelectRef.current?.(p.id, "point"); });
      marker.bindTooltip(`${p.title}${p.approximate ? " (approx.)" : ""}`, { className: "ind-tip", direction: "top", offset: [0, -6], permanent: showLabels });
      group.addLayer(marker);
    }

    if (fit && points.length && !boundaries?.only) {
      const b = leaflet.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
      routes.forEach((r) => r.path.forEach((pt) => b.extend(pt)));
      m.fitBounds(b.pad(points.length === 1 ? 2.5 : 0.25), { maxZoom: points.length === 1 ? 7 : 8, animate: false });
    }
  });

  return <div ref={el} className={className} role="application" aria-label="Interactive historical map" />;
}

type BaseGeo = { land: unknown; lakes: unknown; rivers: unknown; borders: unknown };
let baseCache: Promise<BaseGeo> | null = null;
function loadBase(): Promise<BaseGeo> {
  const get = (n: string) => fetch(`/geo/${n}.json`).then((r) => r.json());
  return (baseCache ??= Promise.all([get("land"), get("lakes"), get("rivers"), get("borders")]).then(([land, lakes, rivers, borders]) => ({ land, lakes, rivers, borders })));
}

let polityCache: Promise<ClioFeature[]> | null = null;
function loadPolities(): Promise<ClioFeature[]> {
  // Fetched lazily, once per session; served gzip-compressed (~0.2 MB).
  return (polityCache ??= fetch("/geo/polities.json").then((r) => r.json()).then((fc) => fc.features as ClioFeature[]));
}

function pointInRing(x: number, y: number, r: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function inFeature(x: number, y: number, f: { geometry: { coordinates: [number, number][][][] } }): boolean {
  for (const poly of f.geometry.coordinates) {
    if (pointInRing(x, y, poly[0]) && !poly.slice(1).some((h) => pointInRing(x, y, h))) return true;
  }
  return false;
}
/** Share of a feature's area (sampled on a grid) that lies inside any of `over`. */
function coveredShare(f: HbmFeature, over: ClioFeature[]): number {
  const b = featBbox(f);
  const cand = over.filter((o) => {
    const ob = featBbox(o);
    return ob[0] <= b[2] && b[0] <= ob[2] && ob[1] <= b[3] && b[1] <= ob[3];
  });
  if (!cand.length) return 0;
  let inside = 0, covered = 0;
  const n = 9;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const x = b[0] + ((i + 0.5) / n) * (b[2] - b[0]);
    const y = b[1] + ((j + 0.5) / n) * (b[3] - b[1]);
    if (!inFeature(x, y, f)) continue;
    inside++;
    if (cand.some((o) => inFeature(x, y, o))) covered++;
  }
  return inside ? covered / inside : 1;
}

let hbmCache: Promise<HbmFeature[]> | null = null;
function loadHbm(): Promise<HbmFeature[]> {
  return (hbmCache ??= fetch("/geo/hbm.json").then((r) => r.json()).then((fc) => fc.features as HbmFeature[]));
}

function featBbox(f: { geometry: { coordinates: [number, number][][][] } }): [number, number, number, number] {
  const b: [number, number, number, number] = [1e9, 1e9, -1e9, -1e9];
  for (const poly of f.geometry.coordinates) for (const [x, y] of poly[0]) {
    if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y;
  }
  return b;
}

/**
 * Distinct colours: each polity starts from a stable colour derived from its
 * name; if a neighbouring (overlapping-bounds) polity already has it, the next
 * free colour is used, so adjacent regions never share a fill.
 */
const DISTINCT = ["#D98A6A", "#8DB872", "#E3C068", "#7FA3CF", "#C08AAE", "#EDAA72", "#78B8B2", "#CC7A6B", "#A9B868", "#9C8ED0", "#D6A26E", "#6FAE8C", "#DE8CA2", "#8EAFC9", "#BC9B6B", "#93CBA0", "#E6B4A0", "#B4C7E7"];
function assignColours(items: { name: string; bbox: [number, number, number, number]; area: number; color?: string }[]) {
  const order = [...items].sort((a, b) => b.area - a.area);
  const touch = (a: [number, number, number, number], b: [number, number, number, number]) => a[0] - 0.4 <= b[2] && b[0] - 0.4 <= a[2] && a[1] - 0.4 <= b[3] && b[1] - 0.4 <= a[3];
  for (const it of order) {
    let h = 0;
    for (const ch of it.name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const used = new Set(order.filter((o) => o.color && o !== it && touch(o.bbox, it.bbox)).map((o) => o.color));
    for (let k = 0; k < DISTINCT.length; k++) {
      const c = DISTINCT[(h + k) % DISTINCT.length];
      if (!used.has(c)) { it.color = c; break; }
    }
    it.color ??= DISTINCT[h % DISTINCT.length];
  }
}

function largestRing(f: { geometry: { coordinates: [number, number][][][] } }): [number, number][] {
  let best: [number, number][] = [];
  let bestA = -1;
  for (const poly of f.geometry.coordinates) {
    const a = ringArea(poly[0]);
    if (a > bestA) { bestA = a; best = poly[0]; }
  }
  return best;
}

function ringArea(r: [number, number][]): number {
  let s = 0;
  for (let i = 0; i < r.length; i++) {
    const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % r.length];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}

/** Area-weighted centroid of a ring (lng, lat). */
function ringCentroid(r: [number, number][]): [number, number] {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < r.length; i++) {
    const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % r.length];
    const k = x1 * y2 - x2 * y1;
    a += k; cx += (x1 + x2) * k; cy += (y1 + y2) * k;
  }
  if (Math.abs(a) < 1e-9) return r[0];
  return [cx / (3 * a), cy / (3 * a)];
}

function fmtY(y: number) {
  return y < 0 ? `${-y} BCE` : `${y}`;
}

/** Read a theme colour from CSS custom properties at draw time. */
function cssVar(name: string): string {
  if (typeof window === "undefined") return "#888";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";
}
