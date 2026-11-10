/** Client-safe map types and styling (no data imports). */
import type { MapLayer } from "./types";

export interface TerritoryShape {
  polityId: string;
  title: string;
  /** One envelope per zone. */
  hulls: [number, number][][];
  label: [number, number];
  color: string;
  region?: string;
  /** Evidence points; `id` present when the point is its own site record. */
  evidence: { id?: string; title: string; lat: number; lng: number; role?: string; from?: number; to?: number }[];
  /** Political polities are drawn as filled, bordered regions; cultures as dashed envelopes. */
  political: boolean;
  /** How far (km) a centre of weight 1 projects authority, by polity kind. */
  reachKm: number;
  /** Weighted centres used by the filled political map. */
  pts: { lat: number; lng: number; w: number; from?: number; to?: number }[];
  /** Anchor groups with validity years, so the client can redraw the envelope for any date. */
  groups: { lat: number; lng: number; from?: number; to?: number }[][];
  radius: number;
  basis: string;
  confidence: "documented" | "estimated" | "disputed";
  start: number;
  end: number;
}

export interface PointFeature {
  id: string;
  title: string;
  lat: number;
  lng: number;
  layers: MapLayer[];
  start: number;
  end: number;
  dateLabel: string;
  precision: string;
  modern: string;
  country: string;
  summary: string;
  href: string;
  approximate?: boolean;
  culture?: string;
  evidence?: string;
  periods: string[];
  image?: { src: string; credit: string };
  findings?: string[];
  discovered?: string;
  excavations?: string;
  unesco?: number;
  related: string[];
  /** Override colour (e.g. by religious tradition). */
  color?: string;
  /** For polity-derived points: the polity they belong to. */
  polityId?: string;
  tradition?: string;
}

export interface RouteFeature {
  id: string;
  title: string;
  layer: "trade" | "migration";
  path: [number, number][];
  start: number;
  end: number;
  dateLabel: string;
  basis: string;
  summary: string;
  href: string;
  commodities?: string[];
  evidence?: string;
}

export interface PeriodBand {
  id: string;
  title: string;
  start: number;
  end: number;
  href: string;
  precision: string;
}

export interface LanguageArea {
  id: string;
  title: string;
  family: string;
  color: string;
  reachKm: number;
  pts: { lat: number; lng: number; w: number }[];
}

export interface MapPayload {
  periods: PeriodBand[];
  /** id -> title/href for every published entry, so panels can link anything. */
  index: Record<string, { t: string; h: string }>;
  points: PointFeature[];
  routes: RouteFeature[];
  /** Light polity records for panels (no geometry — boundaries load from /geo/*.json). */
  territories: { polityId: string; title: string; href: string; dateLabel: string; kind: string; region?: string; start: number; end: number }[];
}

export const LAYER_META: Record<MapLayer, { label: string; color: string; shape: "circle" | "diamond" | "square" | "ring" | "triangle" | "cross" }> = {
  archaeological: { label: "Archaeological sites", color: "#A65D43", shape: "circle" },
  settlement: { label: "Ancient settlements", color: "#7F6A4D", shape: "square" },
  polity: { label: "Political territories", color: "#B49A65", shape: "ring" },
  migration: { label: "Migration routes", color: "#4E5B45", shape: "ring" },
  trade: { label: "Trade routes", color: "#B49A65", shape: "ring" },
  religious: { label: "Religious centres", color: "#4E5B45", shape: "diamond" },
  battle: { label: "Battle locations", color: "#24231F", shape: "cross" },
  inscription: { label: "Inscriptions", color: "#87452F", shape: "triangle" },
  port: { label: "Ancient ports", color: "#3F6E78", shape: "square" },
  unesco: { label: "UNESCO heritage", color: "#7F8D6E", shape: "ring" },
  temple: { label: "Temples & shrines", color: "#8A3B5C", shape: "diamond" },
  hotspot: { label: "Cultural hotspots", color: "#C08A1E", shape: "circle" },
  language: { label: "Language attestations", color: "#3F5A78", shape: "triangle" },
  fossil: { label: "Fossils & deep time", color: "#6B5B3E", shape: "square" },
};

const PRIORITY: MapLayer[] = ["fossil", "battle", "language", "inscription", "temple", "port", "religious", "hotspot", "archaeological", "settlement", "unesco", "trade"];

export function primaryLayer(p: Pick<PointFeature, "layers">, colorBy?: MapLayer[]): MapLayer {
  const order = colorBy ?? PRIORITY;
  return order.find((l) => p.layers.includes(l)) ?? p.layers[0] ?? "archaeological";
}

/** Colours for religious traditions (Religion theme). */
export const TRADITION_COLORS: Record<string, { label: string; color: string }> = {
  vedic: { label: "Vedic", color: "#B07A2A" },
  buddhist: { label: "Buddhist", color: "#D1A23B" },
  jain: { label: "Jain", color: "#5E8C4A" },
  ajivika: { label: "Ajivika", color: "#8C6B3A" },
  hindu: { label: "Hindu", color: "#C0613F" },
  islamic: { label: "Islamic", color: "#2F7A5A" },
  sikh: { label: "Sikh", color: "#3F6FA0" },
  christian: { label: "Christian", color: "#6E5AA6" },
  zoroastrian: { label: "Zoroastrian", color: "#A8402F" },
  jewish: { label: "Jewish", color: "#4E7F9E" },
};
