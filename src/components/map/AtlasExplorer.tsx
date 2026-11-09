"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { MapLayer } from "@/lib/types";
import type { MapPayload } from "@/lib/maptypes";
import { LAYER_META, primaryLayer } from "@/lib/maptypes";
import { formatYear } from "@/lib/format";
import { DynamicMap } from "./DynamicMap";

export const TIME_STOPS = [
  -10000, -7000, -5000, -3300, -2600, -2200, -1900, -1500, -1000, -600, -400, -322, -250, -150, -50, 50, 150, 250, 400, 500, 600, 1000, 1336, 1526, 1600, 1750, 1857, 1947,
];

const ALL_LAYERS: MapLayer[] = ["archaeological", "settlement", "polity", "migration", "trade", "religious", "battle", "inscription", "port", "unesco"];
const LINE_LAYERS: MapLayer[] = ["polity", "migration", "trade"];

const ERA_JUMPS: { label: string; year: number }[] = [
  { label: "Neolithic", year: -5000 },
  { label: "Indus", year: -2200 },
  { label: "Iron Age", year: -1000 },
  { label: "Mahajanapadas", year: -400 },
  { label: "Maurya", year: -250 },
  { label: "Kushan", year: 150 },
  { label: "Gupta", year: 400 },
  { label: "Medieval", year: 1000 },
  { label: "Mughal", year: 1600 },
];

type Selected = { id: string; kind: "point" | "route" | "territory" } | null;

export function AtlasExplorer({
  payload,
  variant = "full",
  defaultYear = -250,
  defaultLayers,
}: {
  payload: MapPayload;
  variant?: "full" | "preview";
  defaultYear?: number;
  defaultLayers?: MapLayer[];
}) {
  const nearestStop = (y: number) => TIME_STOPS.reduce((best, s, i) => (Math.abs(s - y) < Math.abs(TIME_STOPS[best] - y) ? i : best), 0);
  const [layers, setLayers] = useState<Set<MapLayer>>(new Set(defaultLayers ?? ["archaeological", "settlement", "polity", "inscription", "port", "religious", "trade", "migration", "battle"]));
  const [stop, setStop] = useState(nearestStop(defaultYear));
  const [allTime, setAllTime] = useState(false);
  const [modern, setModern] = useState(false);
  const [selected, setSelected] = useState<Selected>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const year = TIME_STOPS[stop];

  // Deep links: /atlas?year=-250&layers=inscription,polity&focus=girnar
  useEffect(() => {
    if (variant !== "full") return;
    const q = new URLSearchParams(window.location.search);
    const y = q.get("year");
    if (y && !Number.isNaN(+y)) setStop(nearestStop(+y));
    const l = q.get("layers");
    if (l) setLayers(new Set(l.split(",").filter((x): x is MapLayer => ALL_LAYERS.includes(x as MapLayer))));
    const f = q.get("focus");
    if (f) setSelected({ id: f, kind: payload.points.some((p) => p.id === f) ? "point" : payload.territories.some((t) => t.polityId === f) ? "territory" : "route" });
    if (q.get("all") === "1") setAllTime(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inTime = (start: number, end: number) => allTime || (start <= year && year <= end);

  const points = useMemo(
    () => payload.points.filter((p) => p.layers.some((l) => layers.has(l) && !LINE_LAYERS.includes(l)) && inTime(p.start, p.end)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payload, layers, year, allTime],
  );
  const routes = useMemo(
    () => payload.routes.filter((r) => layers.has(r.layer) && inTime(r.start, r.end)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payload, layers, year, allTime],
  );
  const territories = useMemo(
    () => (layers.has("polity") ? payload.territories.filter((t) => (allTime ? true : t.start <= year && year <= t.end)) : []),
    [payload, layers, year, allTime],
  );

  const counts = useMemo(() => {
    const c: Partial<Record<MapLayer, number>> = {};
    for (const l of ALL_LAYERS) {
      if (l === "polity") c[l] = payload.territories.filter((t) => allTime || (t.start <= year && year <= t.end)).length;
      else if (l === "trade" || l === "migration") c[l] = payload.routes.filter((r) => r.layer === l && inTime(r.start, r.end)).length;
      else c[l] = payload.points.filter((p) => p.layers.includes(l) && inTime(p.start, p.end)).length;
    }
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, year, allTime]);

  const toggle = (l: MapLayer) =>
    setLayers((prev) => {
      const n = new Set(prev);
      if (n.has(l)) n.delete(l);
      else n.add(l);
      return n;
    });

  const isPreview = variant === "preview";

  const controls = (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <p className="eyebrow">Moment in time</p>
          <label className="flex items-center gap-2 data text-stone cursor-pointer">
            <input type="checkbox" checked={allTime} onChange={(e) => setAllTime(e.target.checked)} className="accent-terracotta" />
            All periods
          </label>
        </div>
        <p className={`font-display text-[2.4rem] leading-none tracking-tight ${allTime ? "text-stone-light" : "text-ink"}`} aria-live="polite">
          {allTime ? "All periods" : formatYear(year)}
        </p>
        <input
          type="range"
          className="time mt-5"
          min={0}
          max={TIME_STOPS.length - 1}
          step={1}
          value={stop}
          disabled={allTime}
          onChange={(e) => setStop(+e.target.value)}
          aria-label="Select historical date"
          aria-valuetext={formatYear(year)}
        />
        <div className="flex justify-between data text-[10px] text-stone-light mt-1.5">
          <span>10,000 BP</span><span>1 CE</span><span>1947</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {ERA_JUMPS.map((j) => (
            <button
              key={j.label}
              onClick={() => { setAllTime(false); setStop(nearestStop(j.year)); }}
              className={`data text-[10px] px-2 py-1 border transition-colors ${!allTime && TIME_STOPS[stop] === TIME_STOPS[nearestStop(j.year)] ? "bg-ink text-ivory border-ink" : "rule text-stone hover:border-ink/40 hover:text-ink"}`}
            >
              {j.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-3">Layers</p>
        <ul className="grid gap-px">
          {ALL_LAYERS.map((l) => {
            const m = LAYER_META[l];
            const on = layers.has(l);
            return (
              <li key={l}>
                <button
                  onClick={() => toggle(l)}
                  aria-pressed={on}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 text-left text-sm transition-colors ${on ? "bg-ivory text-ink" : "text-stone hover:bg-ivory/50"}`}
                >
                  <LayerSwatch layer={l} on={on} />
                  <span className="flex-1">{m.label}</span>
                  <span className="data text-[10px] text-stone-light tabular-nums">{counts[l] ?? 0}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <label className="mt-4 flex items-center gap-2 data text-stone cursor-pointer">
          <input type="checkbox" checked={modern} onChange={(e) => setModern(e.target.checked)} className="accent-terracotta" />
          Show modern place names
        </label>
      </div>

      <div className="border-t rule pt-5 space-y-2.5 text-[12px] text-stone leading-relaxed">
        <p className="eyebrow">How to read this map</p>
        <p><Dash kind="estimated" /> Territories are envelopes around dated evidence (inscriptions, sites) — estimates, not borders.</p>
        <p><Dash kind="schematic" /> Dashed routes are schematic; migration arrows show modelled ancestry flows, not paths walked.</p>
        <p><span className="inline-block w-2.5 h-2.5 rounded-full border border-dashed border-terracotta align-middle mr-1" /> Dashed rings mark approximate locations.</p>
      </div>
    </div>
  );

  return (
    <div className={`relative ${isPreview ? "h-[560px] lg:h-[640px]" : "h-[calc(100vh-4rem)]"} flex overflow-hidden bg-[#e9e3d4]`}>
      {/* Controls (desktop) */}
      <aside className={`hidden lg:block shrink-0 overflow-y-auto bg-parchment border-r rule ${isPreview ? "w-[300px] p-6" : "w-[330px] p-7"}`}>
        {!isPreview && (
          <div className="mb-7">
            <p className="rubric mb-2">Historical Atlas</p>
            <h1 className="font-display text-3xl leading-tight">The subcontinent, through time</h1>
          </div>
        )}
        {controls}
      </aside>

      <div className="relative flex-1">
        <DynamicMap
          className="absolute inset-0"
          points={points}
          routes={routes}
          territories={territories}
          selectedId={selected?.id}
          modernLabels={modern}
          onSelect={(id, kind) => setSelected(id ? { id, kind: kind ?? "point" } : null)}
          initialView={isPreview ? { center: [24, 74], zoom: 4 } : { center: [24, 76], zoom: 5 }}
        />

        {/* Mobile controls toggle */}
        <button
          onClick={() => setPanelOpen((o) => !o)}
          className="lg:hidden absolute left-3 top-3 z-[500] bg-parchment border rule px-3 py-2 data text-ink shadow-sm"
          aria-expanded={panelOpen}
        >
          {allTime ? "All periods" : formatYear(year)} · Layers
        </button>
        {panelOpen && (
          <div className="lg:hidden absolute inset-x-0 bottom-0 max-h-[70%] overflow-y-auto z-[600] bg-parchment border-t rule p-5">
            <button onClick={() => setPanelOpen(false)} className="absolute right-4 top-4 data text-stone">Close ✕</button>
            {controls}
          </div>
        )}

        {/* Selection panel */}
        {selected && <InfoPanel payload={payload} selected={selected} onClose={() => setSelected(null)} compact={isPreview} />}

        {/* Empty state */}
        {points.length + routes.length + territories.length === 0 && (
          <div className="absolute inset-x-0 top-16 z-[400] flex justify-center pointer-events-none">
            <p className="bg-parchment/95 border rule px-4 py-2 data text-stone">No entries for this date and layer selection yet.</p>
          </div>
        )}

        {isPreview && (
          <div className="absolute bottom-4 right-4 z-[500]">
            <Link href={`/atlas?year=${year}`} className="inline-flex items-center gap-2 bg-ink text-ivory px-5 py-3 text-sm hover:bg-terracotta transition-colors">
              Explore the Atlas <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function LayerSwatch({ layer, on }: { layer: MapLayer; on: boolean }) {
  const m = LAYER_META[layer];
  const style = { borderColor: m.color, background: on ? m.color : "transparent" };
  if (layer === "polity") return <span className="w-4 h-3 border border-dashed shrink-0" style={{ borderColor: "#87452F", background: on ? "rgba(180,154,101,.35)" : "transparent" }} />;
  if (layer === "trade" || layer === "migration")
    return <span className="w-4 shrink-0 border-t-2 border-dashed" style={{ borderColor: on ? (layer === "trade" ? "#9C8350" : "#4E5B45") : "#a7a296" }} />;
  return <span className={`w-3 h-3 rounded-full border-2 shrink-0 ${on ? "" : "opacity-60"}`} style={style} />;
}

function Dash({ kind }: { kind: "estimated" | "schematic" }) {
  return <span className={`inline-block w-5 align-middle mr-1 border-t-2 ${kind === "estimated" ? "border-dashed border-terracotta-deep" : "border-dotted border-sage-deep"}`} />;
}

function InfoPanel({ payload, selected, onClose, compact }: { payload: MapPayload; selected: NonNullable<Selected>; onClose: () => void; compact?: boolean }) {
  const link = (id: string) => payload.index[id];
  let body: React.ReactNode = null;

  if (selected.kind === "point") {
    const p = payload.points.find((x) => x.id === selected.id);
    if (!p) return null;
    const layer = primaryLayer(p);
    body = (
      <>
        {p.image && !compact && (
          <div className="relative aspect-[16/9] -mx-6 -mt-6 mb-5 bg-sage-pale">
            <Image src={p.image.src} alt={p.title} fill sizes="380px" className="object-cover" />
            <span className="absolute bottom-1 right-2 data text-[9px] text-ivory/90 drop-shadow">{p.image.credit}</span>
          </div>
        )}
        <p className="eyebrow mb-2" style={{ color: LAYER_META[layer].color }}>{LAYER_META[layer].label.replace(/s$/, "")}</p>
        <h2 className="font-display text-[1.9rem] leading-tight">{p.title}</h2>
        <p className="data text-stone mt-1">{p.modern}, {p.country}{p.approximate ? " · location approximate" : ""}</p>
        <p className="text-sm text-ink/85 leading-relaxed mt-4">{p.summary}</p>
        <dl className="mt-5 divide-y rule border-y rule text-[13px]">
          <Row k="Period" v={p.dateLabel} />
          <Row k="Culture" v={p.culture} />
          <Row k="Discovered" v={p.discovered} />
          {!compact && <Row k="Excavations" v={p.excavations} />}
          {p.unesco && <Row k="UNESCO" v={`World Heritage, inscribed ${p.unesco}`} />}
          <Row k="Evidence" v={p.evidence?.replace("-", " ")} />
        </dl>
        {p.findings && p.findings.length > 0 && !compact && (
          <div className="mt-5">
            <p className="eyebrow mb-2">Important findings</p>
            <ul className="space-y-1.5 text-[13px] text-ink/85 list-disc pl-4 marker:text-terracotta">
              {p.findings.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        )}
        {p.related.length > 0 && (
          <div className="mt-5">
            <p className="eyebrow mb-2">Related</p>
            <div className="flex flex-wrap gap-1.5">
              {p.related.filter(link).slice(0, compact ? 4 : 10).map((id) => (
                <Link key={id} href={link(id).h} className="text-[12px] border rule px-2 py-1 hover:border-terracotta hover:text-terracotta">{link(id).t}</Link>
              ))}
            </div>
          </div>
        )}
        <Link href={p.href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-terracotta hover:underline">Full site record →</Link>
      </>
    );
  } else if (selected.kind === "territory") {
    const t = payload.territories.find((x) => x.polityId === selected.id);
    if (!t) return null;
    body = (
      <>
        <p className="eyebrow mb-2 !text-terracotta-deep">Estimated territorial extent</p>
        <h2 className="font-display text-[1.9rem] leading-tight">{t.title}</h2>
        <p className="data text-stone mt-1">{t.dateLabel} · {t.kind}</p>
        <div className="mt-4 border-l-2 border-terracotta pl-3 text-[13px] text-ink/85 leading-relaxed">
          <p className="eyebrow mb-1">Confidence: {t.confidence}</p>
          {t.basis}
        </div>
        <p className="eyebrow mt-5 mb-2">Evidence find-spots ({t.evidence.length})</p>
        <div className="flex flex-wrap gap-1.5">
          {t.evidence.map((e) => link(e.id) && (
            <Link key={e.id} href={link(e.id).h} className="text-[12px] border rule px-2 py-1 hover:border-terracotta hover:text-terracotta">{e.title}</Link>
          ))}
        </div>
        <Link href={t.href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-terracotta hover:underline">Polity record →</Link>
      </>
    );
  } else {
    const r = payload.routes.find((x) => x.id === selected.id);
    if (!r) return null;
    body = (
      <>
        <p className="eyebrow mb-2">{r.layer === "migration" ? "Population movement" : "Trade route"}</p>
        <h2 className="font-display text-[1.9rem] leading-tight">{r.title}</h2>
        <p className="data text-stone mt-1">{r.dateLabel}</p>
        <p className="text-sm text-ink/85 leading-relaxed mt-4">{r.summary}</p>
        <p className="mt-4 text-[12px] text-stone border-l-2 border-sage pl-3">
          {r.basis === "schematic" ? "Line is schematic: it shows a connection or modelled flow, not an exact path." : "Waypoints are attested places; the lines between them are simplified."}
        </p>
        {r.commodities && (
          <>
            <p className="eyebrow mt-5 mb-2">Commodities</p>
            <p className="text-[13px]">{r.commodities.join(" · ")}</p>
          </>
        )}
        <Link href={r.href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-terracotta hover:underline">More on this route →</Link>
      </>
    );
  }

  return (
    <aside
      className={`absolute z-[700] bg-parchment border rule shadow-[0_20px_60px_-30px_rgba(0,0,0,.45)] overflow-y-auto p-6
        inset-x-0 bottom-0 max-h-[65%] lg:inset-x-auto lg:bottom-auto lg:top-4 lg:right-4 lg:w-[380px] ${compact ? "lg:max-h-[calc(100%-6rem)]" : "lg:max-h-[calc(100%-2rem)]"}`}
      aria-label="Selected location details"
    >
      <button onClick={onClose} className="absolute right-3 top-3 z-10 w-8 h-8 flex items-center justify-center bg-parchment/90 rounded-full text-stone hover:text-ink" aria-label="Close panel">✕</button>
      {body}
    </aside>
  );
}

function Row({ k, v }: { k: string; v?: string | number }) {
  if (!v) return null;
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 py-2">
      <dt className="eyebrow pt-0.5">{k}</dt>
      <dd className="leading-snug">{v}</dd>
    </div>
  );
}
