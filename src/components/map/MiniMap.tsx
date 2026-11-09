"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PointFeature, RouteFeature, MapPayload } from "@/lib/maptypes";
import { DynamicMap } from "./DynamicMap";

/** A small contextual map that fits to its features; clicking a point opens its record. */
export function MiniMap({
  points,
  routes = [],
  territories = [],
  highlight,
  className = "h-[360px]",
  labels = false,
}: {
  points: PointFeature[];
  routes?: RouteFeature[];
  territories?: MapPayload["territories"];
  highlight?: string;
  className?: string;
  labels?: boolean;
}) {
  const router = useRouter();
  const [sel, setSel] = useState<string | null>(highlight ?? null);
  return (
    <div className={`relative overflow-hidden border rule ${className}`}>
      <DynamicMap
        className="absolute inset-0"
        points={points}
        routes={routes}
        territories={territories}
        selectedId={sel}
        fit
        showLabels={labels}
        onSelect={(id, kind) => {
          if (!id) return setSel(highlight ?? null);
          if (kind === "point") {
            const p = points.find((x) => x.id === id);
            if (p && id !== highlight) router.push(p.href);
          }
          setSel(id);
        }}
      />
    </div>
  );
}
