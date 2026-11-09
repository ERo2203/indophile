"use client";

import { useEffect, useRef, useState } from "react";
import type * as LT from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PointFeature, RouteFeature, MapPayload } from "@/lib/maptypes";
import { LAYER_META, primaryLayer } from "@/lib/maptypes";
import type { MapLayer } from "@/lib/types";

export type TerritoryFeature = MapPayload["territories"][number];

export interface MapCanvasProps {
  points: PointFeature[];
  routes?: RouteFeature[];
  territories?: TerritoryFeature[];
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
}


export default function MapCanvas({
  points,
  routes = [],
  territories = [],
  selectedId,
  onSelect,
  fit = false,
  interactive = true,
  modernLabels = false,
  colorBy,
  className = "",
  initialView = { center: [23.5, 77], zoom: 5 },
  showLabels = false,
}: MapCanvasProps) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LT.Map | null>(null);
  const L = useRef<typeof LT | null>(null);
  const dataLayer = useRef<LT.LayerGroup | null>(null);
  const labelLayer = useRef<LT.TileLayer | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [, setReadyTick] = useState(0);

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
      leaflet
        .tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}", {
          maxNativeZoom: 9,
          maxZoom: 11,
          className: "atlas-tiles",
          attribution: "Terrain &copy; Esri — USGS, Esri, TANA, DeLorme, NPS",
        })
        .addTo(m);
      m.on("click", () => onSelectRef.current?.(null));
      map.current = m;
      dataLayer.current = leaflet.layerGroup().addTo(m);
      setReadyTick((t) => t + 1); // redraw once the async init completes
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Modern labels overlay
  useEffect(() => {
    const m = map.current, leaflet = L.current;
    if (!m || !leaflet) return;
    if (modernLabels && !labelLayer.current) {
      labelLayer.current = leaflet
        .tileLayer("https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png", {
          subdomains: "abcd",
          maxZoom: 11,
          opacity: 0.75,
          attribution: "Labels &copy; OpenStreetMap contributors &copy; CARTO",
        })
        .addTo(m);
    } else if (!modernLabels && labelLayer.current) {
      labelLayer.current.remove();
      labelLayer.current = null;
    }
  });

  // Draw data
  useEffect(() => {
    const m = map.current, leaflet = L.current, group = dataLayer.current;
    if (!m || !leaflet || !group) return;
    group.clearLayers();

    for (const t of territories) {
      const dash = t.confidence === "documented" ? undefined : t.confidence === "disputed" ? "2 6" : "8 6";
      const poly = leaflet.polygon(t.hull, {
        color: "#87452F",
        weight: 1.4,
        dashArray: dash,
        fillColor: "#B49A65",
        fillOpacity: selectedId === t.polityId ? 0.22 : 0.1,
        interactive,
      });
      poly.on("click", (ev) => { leaflet.DomEvent.stopPropagation(ev); onSelectRef.current?.(t.polityId, "territory"); });
      poly.bindTooltip(`${t.title} · estimated extent`, { className: "ind-tip", sticky: true });
      group.addLayer(poly);
      const c = poly.getBounds().getCenter();
      group.addLayer(
        leaflet.marker(c, {
          interactive: false,
          icon: leaflet.divIcon({ className: "", html: `<span class="ind-label">${t.title}</span>`, iconSize: [0, 0] }),
        }),
      );
    }

    for (const r of routes) {
      const isMig = r.layer === "migration";
      const line = leaflet.polyline(r.path, {
        color: isMig ? "#4E5B45" : "#9C8350",
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
      group.addLayer(leaflet.circleMarker(end, { radius: 3.5, color: isMig ? "#4E5B45" : "#9C8350", fillOpacity: 1, weight: 0, interactive: false }));
    }

    for (const p of points) {
      const layer = primaryLayer(p, colorBy);
      const meta = LAYER_META[layer];
      const sel = selectedId === p.id;
      const hollow = layer === "inscription" || layer === "battle";
      const marker = leaflet.circleMarker([p.lat, p.lng], {
        radius: sel ? 9 : layer === "inscription" ? 4.5 : 6,
        color: sel ? "#24231F" : hollow ? meta.color : "#FAF8F2",
        weight: sel ? 2.5 : hollow ? 2 : 1.5,
        fillColor: meta.color,
        fillOpacity: hollow ? 0.25 : 0.95,
        dashArray: p.approximate ? "2 2" : undefined,
        interactive,
      });
      marker.on("click", (ev) => { leaflet.DomEvent.stopPropagation(ev); onSelectRef.current?.(p.id, "point"); });
      marker.bindTooltip(`${p.title}${p.approximate ? " (approx.)" : ""}`, { className: "ind-tip", direction: "top", offset: [0, -6], permanent: showLabels });
      group.addLayer(marker);
    }

    if (fit && points.length) {
      const b = leaflet.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
      routes.forEach((r) => r.path.forEach((pt) => b.extend(pt)));
      m.fitBounds(b.pad(points.length === 1 ? 2.5 : 0.25), { maxZoom: points.length === 1 ? 7 : 8, animate: false });
    }
  });

  return <div ref={el} className={className} role="application" aria-label="Interactive historical map" />;
}
