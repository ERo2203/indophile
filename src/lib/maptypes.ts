/** Client-safe map types and styling (no data imports). */
import type { MapLayer } from "./types";

export interface TerritoryShape {
  polityId: string;
  title: string;
  hull: [number, number][];
  evidence: { id: string; title: string; lat: number; lng: number }[];
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

export interface MapPayload {
  /** id -> title/href for every published entry, so panels can link anything. */
  index: Record<string, { t: string; h: string }>;
  points: PointFeature[];
  routes: RouteFeature[];
  territories: (TerritoryShape & { href: string; dateLabel: string; kind: string })[];
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
};

const PRIORITY: MapLayer[] = ["battle", "inscription", "port", "religious", "archaeological", "settlement", "unesco", "trade"];

export function primaryLayer(p: Pick<PointFeature, "layers">, colorBy?: MapLayer[]): MapLayer {
  const order = colorBy ?? PRIORITY;
  return order.find((l) => p.layers.includes(l)) ?? p.layers[0] ?? "archaeological";
}
