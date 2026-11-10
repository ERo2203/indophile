"use client";

import dynamic from "next/dynamic";
import type { MapCanvasProps } from "./MapCanvas";

const MapCanvas = dynamic(() => import("./MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--map-sea)]">
      <span className="data text-stone animate-pulse">Loading atlas…</span>
    </div>
  ),
});

export function DynamicMap(props: MapCanvasProps) {
  return <MapCanvas {...props} />;
}
