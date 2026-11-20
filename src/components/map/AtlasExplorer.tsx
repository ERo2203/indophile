"use client";

import Link from "next/link";
import Image from "next/image";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { MapLayer } from "@/lib/types";
import type { MapPayload } from "@/lib/maptypes";
import { LAYER_META, TRADITION_COLORS, primaryLayer } from "@/lib/maptypes";
import { CLIOPATRIA_CITATION, CLIO_TO_POLITY, HBM_CITATION, parseClioKey, parseHbmKey, type ShownPolity } from "@/lib/cliopatria";
import { formatYear } from "@/lib/format";
import { SEA_LEVEL, seaLevelAt } from "@/data/sea-level";

const fy = (y: number) => formatYear(y).replace(" CE", "");
import { DynamicMap } from "./DynamicMap";
import { TimeScroller } from "./TimeScroller";

const ALL_LAYERS: MapLayer[] = ["polity", "archaeological", "settlement", "inscription", "temple", "religious", "hotspot", "language", "fossil", "port", "trade", "migration", "battle", "unesco", "landscape"];
const SHEET = "relative w-full min-h-0 shrink overflow-y-auto overscroll-contain bg-parchment border-t sm:border rule rounded-t-2xl sm:rounded-none shadow-[0_-18px_50px_-24px_rgba(0,0,0,.55)] sm:shadow-[0_24px_60px_-28px_rgba(0,0,0,.55)]";
const LINE_LAYERS: MapLayer[] = ["polity", "migration", "trade"];
const SHORT: Record<MapLayer, string> = {
  archaeological: "Sites",
  settlement: "Settlements",
  polity: "Kingdoms",
  inscription: "Inscriptions",
  temple: "Temples",
  religious: "Sacred sites",
  hotspot: "Cultural hotspots",
  language: "First inscriptions",
  port: "Ports",
  trade: "Trade routes",
  migration: "Migrations",
  battle: "Battles",
  unesco: "UNESCO",
  fossil: "Fossils",
  landscape: "Landscape",
};

type Theme = "political" | "languages" | "religion" | "landscape";
/** Themes are starting points: each picks a set of layers, which can then be changed freely. */
const THEMES: { id: Theme; label: string; layers: MapLayer[] }[] = [
  { id: "political", label: "Political", layers: ["polity", "inscription", "port", "battle"] },
  { id: "religion", label: "Religion", layers: ["religious", "temple"] },
  { id: "languages", label: "Languages", layers: ["language"] },
  { id: "landscape", label: "Landscape", layers: ["landscape"] },
];

/** Layers grouped by what they show, in the order a reader is likely to want them. */
const GROUPS: { label: string; layers: MapLayer[] }[] = [
  { label: "Territories and movement", layers: ["polity", "trade", "migration"] },
  { label: "Places", layers: ["archaeological", "settlement", "port"] },
  { label: "Faith and culture", layers: ["religious", "temple", "hotspot"] },
  { label: "Writing", layers: ["inscription", "language"] },
  { label: "Events and heritage", layers: ["battle", "unesco"] },
  { label: "Land and deep time", layers: ["landscape", "fossil"] },
];

type Selected = { id: string; kind: "point" | "route" | "territory" } | null;

export function AtlasExplorer({
  payload,
  variant = "full",
  defaultYear = -250,
  defaultLayers,
  initialView,
}: {
  payload: MapPayload;
  variant?: "full" | "preview";
  defaultYear?: number;
  defaultLayers?: MapLayer[];
  initialView?: { center: [number, number]; zoom: number };
}) {
  const isPreview = variant === "preview";
  const [theme, setTheme] = useState<Theme>("political");
  const [basemap, setBasemap] = useState<"plain" | "terrain">("plain");
  const [layers, setLayers] = useState<Set<MapLayer>>(new Set(defaultLayers ?? THEMES[0].layers));
  const chooseTheme = (t: Theme) => {
    setTheme(t);
    setLayers(new Set(THEMES.find((x) => x.id === t)!.layers));
    setCoast(t === "landscape");
    setSelected(null);
  };
  const [year, setYear] = useState(defaultYear);
  const [allTime, setAllTime] = useState(false);
  const [modern, setModern] = useState(false);
  const [coast, setCoast] = useState(false);
  const [selected, setSelected] = useState<Selected>(null);
  const [legend, setLegend] = useState(false);
  const [panel, setPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelBtn = useRef<HTMLButtonElement>(null);
  const y = useDeferredValue(year);
  // Read once on the client; the map itself only mounts client-side.
  const [narrow] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);

  // Deep links: /atlas?year=-250&layers=inscription,polity&focus=girnar&all=1
  useEffect(() => {
    if (isPreview) return;
    const q = new URLSearchParams(window.location.search);
    const qy = q.get("year");
    if (qy && !Number.isNaN(+qy)) setYear(+qy);
    const l = q.get("layers");
    if (l) setLayers(new Set(l.split(",").filter((x): x is MapLayer => ALL_LAYERS.includes(x as MapLayer))));
    // Theme first: choosing a theme clears the selection a focus link sets.
    const th = q.get("theme");
    if (th === "languages" || th === "religion" || th === "landscape") chooseTheme(th);
    if (q.get("coast") === "1") setCoast(true);
    const f = q.get("focus");
    if (f) setSelected({ id: f, kind: payload.points.some((p) => p.id === f) ? "point" : payload.territories.some((t) => t.polityId === f) ? "territory" : "route" });
    if (q.get("all") === "1") setAllTime(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !panel && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, panel]);

  // The layers panel closes on Escape or a press outside it.
  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPanel(false);
      panelBtn.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || panelBtn.current?.contains(t)) return;
      setPanel(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [panel]);

  const inTime = (start: number, end: number) => allTime || (start <= y && y <= end);

  const points = useMemo(
    () =>
      payload.points
        .filter((p) => p.layers.some((l) => layers.has(l) && !LINE_LAYERS.includes(l)) && inTime(p.start, p.end))
        .map((p) => (theme === "religion" && p.tradition ? { ...p, color: TRADITION_COLORS[p.tradition]?.color } : p)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payload, layers, y, allTime, theme],
  );
  const routes = useMemo(
    () => payload.routes.filter((r) => layers.has(r.layer) && inTime(r.start, r.end)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payload, layers, y, allTime],
  );
  // Political boundaries are drawn only from the sourced Cliopatria dataset.
  const [shown, setShown] = useState<ShownPolity[]>([]);
  const [listOpen, setListOpen] = useState(false);
  const shownPolities = new Set(shown.map((x) => x.name)).size;
  const boundaries = useMemo(
    () => (layers.has("polity") && !allTime ? { year: y } : null),
    [layers, allTime, y],
  );

  const religionCounts = useMemo(() => {
    if (theme !== "religion") return [];
    const c: Record<string, number> = {};
    for (const p of payload.points) if (p.tradition && p.layers.includes("religious") && inTime(p.start, p.end)) c[p.tradition] = (c[p.tradition] ?? 0) + 1;
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, y, allTime, theme]);

  const counts = useMemo(() => {
    const c: Partial<Record<MapLayer, number>> = {};
    for (const l of ALL_LAYERS) {
      if (l === "polity") c[l] = shownPolities;
      else if (l === "trade" || l === "migration") c[l] = payload.routes.filter((r) => r.layer === l && inTime(r.start, r.end)).length;
      else c[l] = payload.points.filter((p) => p.layers.includes(l) && inTime(p.start, p.end)).length;
    }
    return c;
     
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, y, allTime, shownPolities]);

  const toggle = (l: MapLayer) =>
    setLayers((prev) => {
      const n = new Set(prev);
      if (n.has(l)) n.delete(l);
      else n.add(l);
      return n;
    });
  const solo = (l: MapLayer) => setLayers(new Set([l]));

  const sea = useMemo(() => (coast && !allTime ? seaLevelAt(y) : null), [coast, allTime, y]);
  const visible = points.length + routes.length + (boundaries ? shownPolities : 0) + (sea && sea.level <= -2.5 ? 1 : 0);

  return (
    <div
      data-immersive={isPreview ? undefined : ""}
      className={`atlas-shell relative isolate flex flex-col overflow-hidden bg-[var(--map-sea)] ${isPreview ? "h-[600px] lg:h-[680px]" : "h-[calc(100svh-4rem)] supports-[height:100dvh]:h-[calc(100dvh-4rem)]"}`}
    >
      <div className="relative flex-1 min-h-0">
        <DynamicMap
          className="absolute inset-0"
          points={points}
          routes={routes}
          boundaries={boundaries}
          onBoundariesShown={setShown}
          basemap={basemap}
          seaLevel={sea ? sea.level : null}
          selectedId={selected?.id}
          modernLabels={modern}
          onSelect={(id, kind) => setSelected(id ? { id, kind: kind ?? "point" } : null)}
          initialView={initialView ?? (isPreview || narrow ? { center: [21, 78], zoom: 4 } : { center: [21.5, 77], zoom: 5 })}
        />

        {/* Top bar — theme presets on the left, layers and key on the right */}
        <div className="absolute top-3 left-3 sm:left-14 right-3 z-[520] flex items-center gap-2 pointer-events-none">
          <div className="pointer-events-auto min-w-0 overflow-x-auto no-scrollbar shadow-[0_6px_20px_-12px_rgba(0,0,0,.45)]">
            <div className="flex w-max gap-px bg-ink/15 border border-ink/15" role="tablist" aria-label="Map theme">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={theme === t.id}
                  onClick={() => chooseTheme(t.id)}
                  title={`${t.label}: ${t.layers.map((l) => LAYER_META[l].label.toLowerCase()).join(", ")}`}
                  className={`h-9 sm:h-8 px-2 sm:px-3 text-[12px] font-medium transition-colors ${theme === t.id ? "bg-ink text-parchment" : "bg-ivory/95 text-ink hover:bg-ivory"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="ml-auto pointer-events-auto flex gap-1.5 shrink-0">
            <button
              ref={panelBtn}
              onClick={() => { setPanel((v) => !v); setLegend(false); }}
              aria-expanded={panel}
              aria-controls="atlas-layers"
              title="Choose what the map shows"
              className={`h-9 sm:h-8 w-9 sm:w-auto justify-center sm:pl-2.5 sm:pr-2.5 inline-flex items-center gap-1.5 border text-[12px] font-medium shadow-[0_6px_20px_-12px_rgba(0,0,0,.45)] transition-colors ${panel ? "bg-ink text-parchment border-ink" : "bg-ivory/95 border-ink/10 text-ink hover:bg-ivory"}`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
                <path d="m12 4 8.5 4.5L12 13 3.5 8.5z" />
                <path d="m3.5 12.5 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">Layers</span>
              <span className={`hidden sm:inline data text-[11px] tabular-nums min-w-4 text-center ${panel ? "text-parchment/70" : "text-stone"}`}>{layers.size + (coast ? 1 : 0) + (modern ? 1 : 0) + (basemap === "terrain" ? 1 : 0)}</span>
            </button>
            <button
              onClick={() => { setLegend((v) => !v); setPanel(false); }}
              aria-expanded={legend}
              className={`hidden sm:block h-9 w-9 sm:h-8 sm:w-8 border font-display italic text-lg leading-none shadow-[0_6px_20px_-12px_rgba(0,0,0,.45)] transition-colors ${legend ? "bg-ink text-parchment border-ink" : "bg-ivory/95 border-ink/10 text-ink hover:bg-ivory"}`}
              title="How to read this map"
              aria-label="How to read this map"
            >
              i
            </button>
          </div>
        </div>

        {/* What the map shows now: one chip per active layer, each removable */}
        <div className="absolute top-[3.6rem] sm:top-14 left-0 sm:left-14 right-0 z-[500] pointer-events-none">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-3 sm:pl-0 pb-2 [mask-image:linear-gradient(to_right,#000_calc(100%-24px),transparent)] sm:[mask-image:none]" role="group" aria-label="Layers shown">
            {ALL_LAYERS.filter((l) => layers.has(l)).map((l) => (
              <ActiveChip key={l} label={SHORT[l]} count={l === "polity" && allTime ? undefined : counts[l] ?? 0} onRemove={() => toggle(l)}>
                <Swatch layer={l} on />
              </ActiveChip>
            ))}
            {basemap === "terrain" && <ActiveChip label="Terrain" onRemove={() => setBasemap("plain")} />}
            {coast && <ActiveChip label="Sea level" onRemove={() => setCoast(false)} />}
            {modern && <ActiveChip label="Modern borders" onRemove={() => setModern(false)} />}
            {layers.size === 0 && (
              <button onClick={() => setPanel(true)} className="pointer-events-auto shrink-0 h-8 px-3 text-[12px] bg-ivory border border-dashed border-ink/30 text-stone hover:text-ink">
                No layers shown · choose layers
              </button>
            )}
            <span className="shrink-0 w-3 sm:w-1" aria-hidden />
          </div>
        </div>

        {panel && (
          <>
            <button aria-label="Close layers" tabIndex={-1} onClick={() => setPanel(false)} className="sm:hidden absolute inset-0 z-[710] bg-ink/25" />
            <LayersPanel
              ref={panelRef}
              theme={THEMES.find((t) => t.id === theme)!}
              year={allTime ? null : year}
              layers={layers}
              counts={counts}
              onToggle={toggle}
              onSolo={solo}
              onReset={() => chooseTheme(theme)}
              onClear={() => setLayers(new Set())}
              onClose={() => setPanel(false)}
              onKey={() => { setPanel(false); setLegend(true); }}
              base={[
                { id: "terrain", label: "Terrain", note: "Shaded relief instead of the plain map", on: basemap === "terrain", toggle: () => setBasemap((b) => (b === "plain" ? "terrain" : "plain")) },
                { id: "coast", label: "Sea level", note: "The coastline as the sea rose and fell, from 50,000 BCE", on: coast, toggle: () => setCoast((v) => !v) },
                { id: "modern", label: "Modern borders", note: "Today's international borders, for orientation", on: modern, toggle: () => setModern((v) => !v) },
              ]}
            />
          </>
        )}

        {legend && (
          <div className="absolute top-[3.6rem] sm:top-12 right-3 z-[650] w-[min(300px,calc(100%-1.5rem))] max-h-[calc(100%-5rem)] overflow-y-auto bg-parchment border rule p-5 shadow-[0_20px_50px_-25px_rgba(0,0,0,.5)] text-[12.5px] leading-relaxed space-y-3">
            <p className="eyebrow">How to read this map</p>
            <p><span className="inline-block w-4 h-3 align-middle mr-1.5 bg-terracotta/50 border border-ink/40" />Kingdoms are drawn from <a className="underline" href={CLIOPATRIA_CITATION.repo} target="_blank" rel="noopener noreferrer">Cliopatria</a>, the Seshat Global History Databank&apos;s peer-reviewed boundary dataset (CC BY 4.0), exactly as published — one scholarly reconstruction among several. Where Cliopatria is blank, regions from <a className="underline" href={HBM_CITATION.repo} target="_blank" rel="noopener noreferrer">historical-basemaps</a> (GPL-3.0) fill the gap with dashed borders and italic names — a coarser, approximate source.</p>
            <p><span className="inline-block w-4 h-3 align-middle mr-1.5 bg-[var(--map-shelf)] border border-dashed border-[var(--map-shelf-edge)]" />Sea level shows the coast as it stood in the chosen year: global sea level from Spratt &amp; Lisiecki (2016) applied to today&apos;s seafloor depths from NOAA ETOPO 2022. It does not allow for land rising or sinking, or for silt laid down since, so deltas and the exact shoreline are approximate. Diamonds in the Landscape theme mark documented changes such as rivers that moved; old river courses are not drawn.</p>
            <p>Language areas are not drawn: no sourced historical language-area dataset has been added yet. The Languages theme shows dated first inscriptions.</p>
            <p><span className="inline-block w-5 align-middle mr-1.5 border-t-2 border-dashed border-gold" />Trade routes join attested places; the lines between them are simplified.</p>
            <p><span className="inline-block w-5 align-middle mr-1.5 border-t-2 border-dotted border-sage-deep" />Migration arrows are modelled ancestry flows from ancient DNA, not paths walked.</p>
            <p><span className="inline-block w-2.5 h-2.5 rounded-full border border-dashed border-terracotta align-middle mr-1.5" />A dashed ring marks an approximate location.</p>
            <p className="text-stone">Click any point, line or territory to learn more. Themes are starting points: open Layers to add or remove anything, or press Only to see a single layer.</p>
          </div>
        )}

        {boundaries && theme !== "religion" && shown.length > 0 && !selected && (
          <div className={`absolute left-3 bottom-7 sm:bottom-3 z-[500] w-[min(260px,calc(100%-1.5rem))] bg-parchment/[0.97] border rule shadow-[0_16px_40px_-24px_rgba(0,0,0,.5)] ${listOpen ? "max-h-[60%]" : ""} flex flex-col`}>
            <button onClick={() => setListOpen((o) => !o)} aria-expanded={listOpen} className="flex items-center justify-between px-4 py-2.5 text-left">
              <span className="eyebrow">Polities in {formatYear(year)} · {shownPolities}</span>
              <span className="data text-stone">{listOpen ? "–" : "+"}</span>
            </button>
            {listOpen && (
              <ul className="overflow-y-auto px-2 pb-2 text-[12.5px]">
                {shown.map((p) => (
                  <li key={p.key}>
                    <button onClick={() => setSelected({ id: p.key, kind: "territory" })} className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-ivory">
                      <span className="w-3 h-3 shrink-0 border border-ink/30" style={{ background: p.color }} />
                      <span className={`flex-1 ${p.src === "hbm" ? "italic text-ink/75" : ""}`}>{p.polityId ? payload.index[p.polityId]?.t ?? p.name : p.name}</span>
                      <span className="data text-[11px] text-stone-light" title={p.src === "hbm" ? "historical-basemaps (gap-fill)" : "Cliopatria"}>{p.src === "hbm" ? "H" : "C"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {listOpen && <p className="px-4 pb-3 text-[11px] text-stone leading-snug">C = Cliopatria (primary). <em>H</em> = historical-basemaps, shown only where the primary source is blank.</p>}
          </div>
        )}

        {theme === "religion" && religionCounts.length > 0 && !selected && (
          <div className="absolute left-3 bottom-7 sm:bottom-3 z-[500] w-[min(290px,calc(100%-1.5rem))] bg-parchment/95 border rule p-4 shadow-[0_16px_40px_-24px_rgba(0,0,0,.5)]">
            <p className="eyebrow mb-2">Catalogued sacred sites active {allTime ? "in all periods" : `in ${formatYear(year)}`}</p>
            <div className="flex h-3 w-full overflow-hidden">
              {religionCounts.map(([t, n]) => (
                <span key={t} style={{ flex: n, background: TRADITION_COLORS[t]?.color }} title={`${TRADITION_COLORS[t]?.label}: ${n}`} />
              ))}
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[12px]">
              {religionCounts.map(([t, n]) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: TRADITION_COLORS[t]?.color }} />
                  {TRADITION_COLORS[t]?.label}
                  <span className="ml-auto data text-[11px] text-stone">{n}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-stone leading-snug">Counts of sites in this archive, not numbers of followers. Scroll through time to watch traditions appear and spread.</p>
          </div>
        )}

        {coast && !selected && !panel && (
          <SeaPanel year={year} allTime={allTime} />
        )}

        {/* Empty state */}
        {visible === 0 && (
          <div className="absolute inset-x-0 top-20 z-[400] flex justify-center pointer-events-none">
            <p className="bg-parchment/95 border rule px-4 py-2 data text-stone">Nothing catalogued for this moment and these filters yet.</p>
          </div>
        )}

        {/* Selection panel */}
        {selected && (
          <div className="atlas-sheet absolute z-[700] inset-x-0 bottom-0 max-h-[78%] sm:inset-x-auto sm:left-3 sm:right-auto sm:bottom-3 sm:w-[400px] sm:max-h-[calc(100%-7.5rem)] lg:left-auto lg:right-3 lg:top-[6.25rem] lg:max-h-none flex flex-col justify-end sm:justify-start">
            <InfoPanel payload={payload} selected={selected} shown={shown} onClose={() => setSelected(null)} compact={isPreview} />
          </div>
        )}

        {isPreview && !selected && (
          <Link href={`/atlas?year=${year}`} className="absolute bottom-4 right-4 z-[500] inline-flex items-center gap-2 bg-ink text-parchment px-5 py-3 text-sm hover:bg-terracotta transition-colors shadow-lg">
            Open the full atlas <span aria-hidden>→</span>
          </Link>
        )}
      </div>

      <TimeScroller
        year={year}
        onYear={setYear}
        periods={payload.periods}
        allTime={allTime}
        onAllTime={setAllTime}
        activeCount={visible}
        compact={isPreview}
      />
    </div>
  );
}

function Swatch({ layer, on }: { layer: MapLayer; on: boolean }) {
  const m = LAYER_META[layer];
  if (layer === "polity") return <span className="w-3.5 h-2.5 border border-dashed shrink-0" style={{ borderColor: "var(--color-terracotta-deep)", background: on ? "color-mix(in srgb, var(--color-terracotta) 25%, transparent)" : "transparent" }} />;
  if (layer === "trade" || layer === "migration")
    return <span className={`w-3.5 shrink-0 border-t-2 ${layer === "trade" ? "border-dashed" : "border-dotted"}`} style={{ borderColor: on ? (layer === "trade" ? "var(--color-gold)" : "var(--color-sage-deep)") : "var(--color-stone-light)" }} />;
  return <span className="w-2.5 h-2.5 rounded-full border-2 shrink-0" style={{ borderColor: m.color, background: on ? m.color : "transparent" }} />;
}

function InfoPanel({ payload, selected, shown, onClose, compact }: { payload: MapPayload; selected: NonNullable<Selected>; shown: ShownPolity[]; onClose: () => void; compact?: boolean }) {
  const link = (id: string) => payload.index[id];
  const hasImage = selected.kind === "point" && !compact && !!payload.points.find((x) => x.id === selected.id)?.image;
  let body: React.ReactNode = null;

  if (selected.kind === "point") {
    const p = payload.points.find((x) => x.id === selected.id);
    if (!p) return null;
    const layer = primaryLayer(p);
    body = (
      <>
        {p.image && !compact && (
          <div className="relative aspect-[2/1] sm:aspect-[16/9] -mx-5 sm:-mx-6 mb-5 bg-sage-pale overflow-hidden">
            <Image src={p.image.src} alt={p.title} fill sizes="380px" className="object-cover" />
            <span className="absolute inset-x-0 bottom-0 px-3 pt-6 pb-1.5 text-right data text-[11px] text-paper bg-gradient-to-t from-black/55 to-transparent">{p.image.credit}</span>
          </div>
        )}
        <p className="eyebrow mb-2" style={{ color: LAYER_META[layer].color }}>{LAYER_META[layer].label.replace(/s$/, "")}</p>
        <h2 className="font-display text-[1.75rem] sm:text-[1.9rem] leading-tight pr-10 text-balance">{p.title}</h2>
        <p className="data text-[12px] text-stone mt-1.5 leading-relaxed">{p.modern}, {p.country}{p.approximate ? " · location approximate" : ""}</p>
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
        <Link href={p.href} className="mt-6 flex items-center justify-between bg-ink text-parchment px-4 py-3 text-sm hover:bg-terracotta transition-colors">Learn more about this site <span aria-hidden>→</span></Link>
      </>
    );
  } else if (selected.kind === "territory") {
    const hk = parseHbmKey(selected.id);
    if (hk) {
      const item = shown.find((x) => x.key === selected.id);
      return (
        <aside className={`${SHEET} px-5 pt-7 pb-6 sm:p-6`} aria-label="Polity details">
          <SheetChrome onClose={onClose} />
          <p className="eyebrow mb-2" style={{ color: item?.color }}>Political boundary · gap-fill source</p>
          <h2 className="font-display text-[1.75rem] sm:text-[1.9rem] leading-tight pr-10 text-balance">{hk.name}</h2>
          {item && <p className="data text-stone mt-1">Map slice {fy(item.from)} (valid to {fy(item.to)})</p>}
          <p className="mt-4 text-[13px] text-ink/85 leading-relaxed">
            Shown because the primary dataset (Cliopatria) has no polity here at this date. This outline comes from a coarser, time-sliced world map whose borders are marked as approximate; treat it as indicative only.
          </p>
          <p className="mt-4 data text-[11px] text-stone leading-relaxed">Boundary source: {HBM_CITATION.text} {HBM_CITATION.repo} · {HBM_CITATION.license}, clipped and simplified.</p>
          <a href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(hk.name)}`} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-between border border-ink/30 px-4 py-3 text-sm hover:border-ink">Search Wikipedia <span aria-hidden>↗</span></a>
        </aside>
      );
    }
    const ck = parseClioKey(selected.id);
    if (ck) {
      const pid = CLIO_TO_POLITY[ck.name];
      const t = pid ? payload.territories.find((x) => x.polityId === pid) : undefined;
      const rec = pid ? payload.index[pid] : undefined;
      return (
        <aside className={`${SHEET} px-5 pt-7 pb-6 sm:p-6`} aria-label="Polity details">
          <SheetChrome onClose={onClose} />
          <p className="eyebrow mb-2" style={{ color: shown.find((x) => x.key === selected.id)?.color }}>Political boundary · Cliopatria</p>
          <h2 className="font-display text-[1.75rem] sm:text-[1.9rem] leading-tight pr-10 text-balance">{rec?.t ?? ck.name}</h2>
          {rec && rec.t !== ck.name && <p className="data text-[11px] text-stone mt-1">Cliopatria: {ck.name}</p>}
          {t && <p className="data text-stone mt-1">{t.dateLabel} · {t.kind}</p>}
          <p className="mt-4 text-[13px] text-ink/85 leading-relaxed">
            This outline is the version Cliopatria records from <strong>{fy(ck.from)}</strong>. Borders were often fluid, contested or held through subordinate rulers; this is one scholarly reconstruction.
          </p>
          <p className="mt-4 data text-[11px] text-stone leading-relaxed">
            Boundary source: {CLIOPATRIA_CITATION.text} doi:{CLIOPATRIA_CITATION.doi} · {CLIOPATRIA_CITATION.version}, CC BY 4.0, clipped and simplified.
          </p>
          {rec ? (
            <Link href={rec.h} className="mt-6 flex items-center justify-between bg-ink text-parchment px-4 py-3 text-sm hover:bg-terracotta transition-colors">Learn more about this polity <span aria-hidden>→</span></Link>
          ) : (
            <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(ck.name.replace(/ /g, "_"))}`} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-between border border-ink/30 px-4 py-3 text-sm hover:border-ink">Not yet in Indophile — read on Wikipedia <span aria-hidden>↗</span></a>
          )}
        </aside>
      );
    }
    const t = payload.territories.find((x) => x.polityId === selected.id);
    if (!t) return null;
    body = (
      <>
        <p className="eyebrow mb-2">Polity{t.region ? ` · ${t.region}` : ""}</p>
        <h2 className="font-display text-[1.75rem] sm:text-[1.9rem] leading-tight pr-10 text-balance">{t.title}</h2>
        <p className="data text-stone mt-1">{t.dateLabel} · {t.kind}</p>
        <p className="mt-3 data text-[11px] text-ink">
          Duration: {t.end - t.start > 0 ? `about ${(t.end - t.start).toLocaleString("en")} years` : "single date"}
        </p>
        <p className="mt-4 text-[13px] text-ink/85 leading-relaxed">Its boundary is drawn when a published map dataset covers it at the year shown; otherwise it appears through its located places.</p>
        <Link href={t.href} className="mt-6 flex items-center justify-between bg-ink text-parchment px-4 py-3 text-sm hover:bg-terracotta transition-colors">Learn more about this polity <span aria-hidden>→</span></Link>
      </>
    );
  } else {
    const r = payload.routes.find((x) => x.id === selected.id);
    if (!r) return null;
    body = (
      <>
        <p className="eyebrow mb-2">{r.layer === "migration" ? "Population movement" : "Trade route"}</p>
        <h2 className="font-display text-[1.75rem] sm:text-[1.9rem] leading-tight pr-10 text-balance">{r.title}</h2>
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
        <Link href={r.href} className="mt-6 flex items-center justify-between bg-ink text-parchment px-4 py-3 text-sm hover:bg-terracotta transition-colors">Learn more about this route <span aria-hidden>→</span></Link>
      </>
    );
  }

  return (
    <aside
      className={`${SHEET} px-5 pt-7 pb-6 sm:p-6 ${hasImage ? "!pt-0 sm:!pt-0" : ""}`}
      aria-label="Selected location details"
    >
      <SheetChrome onClose={onClose} />
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

function SheetChrome({ onClose }: { onClose: () => void }) {
  return (
    <>
      <span aria-hidden className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 z-10 h-1 w-10 rounded-full bg-ink/25 mix-blend-multiply" />
      <div className="sticky top-0 z-10 h-0 flex justify-end">
        <button
          onClick={onClose}
          className="mt-3 -mr-2 sm:-mr-3 w-10 h-10 flex items-center justify-center rounded-full bg-parchment/95 border rule text-stone hover:text-ink shadow-[0_6px_16px_-10px_rgba(0,0,0,.5)]"
          aria-label="Close panel"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </>
  );
}

function ActiveChip({ label, count, onRemove, children }: { label: string; count?: number; onRemove: () => void; children?: React.ReactNode }) {
  return (
    <button
      onClick={onRemove}
      title={`Hide ${label.toLowerCase()}`}
      aria-label={`Hide ${label}${count !== undefined ? `, ${count} shown` : ""}`}
      className={`group pointer-events-auto shrink-0 inline-flex items-center gap-1.5 h-8 pl-2 pr-1.5 text-[12px] bg-ivory border border-ink/15 text-ink shadow-[0_6px_20px_-12px_rgba(0,0,0,.45)] hover:border-ink/40 transition-colors ${count === 0 ? "text-stone" : ""}`}
    >
      {children}
      {label}
      {count !== undefined && <span className="data text-[11px] tabular-nums text-stone">{count}</span>}
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-stone group-hover:text-terracotta" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="m7 7 10 10M17 7 7 17" />
      </svg>
    </button>
  );
}

type BaseOption = { id: string; label: string; note: string; on: boolean; toggle: () => void };

function LayersPanel({
  ref,
  theme,
  year,
  layers,
  counts,
  onToggle,
  onSolo,
  onReset,
  onClear,
  onClose,
  onKey,
  base,
}: {
  ref: React.Ref<HTMLDivElement>;
  theme: { label: string };
  year: number | null;
  layers: Set<MapLayer>;
  counts: Partial<Record<MapLayer, number>>;
  onToggle: (l: MapLayer) => void;
  onSolo: (l: MapLayer) => void;
  onReset: () => void;
  onClear: () => void;
  onClose: () => void;
  onKey: () => void;
  base: BaseOption[];
}) {
  return (
    <div
      ref={ref}
      id="atlas-layers"
      role="dialog"
      aria-label="Map layers"
      className="absolute z-[720] inset-x-0 bottom-0 max-h-[80%] sm:inset-x-auto sm:bottom-auto sm:top-14 sm:right-3 sm:w-[340px] sm:max-h-[calc(100%-4.5rem)] flex flex-col bg-parchment border-t sm:border rule rounded-t-2xl sm:rounded-none shadow-[0_-18px_50px_-24px_rgba(0,0,0,.55)] sm:shadow-[0_24px_60px_-28px_rgba(0,0,0,.55)]"
    >
      <div className="flex items-baseline justify-between gap-3 px-5 pt-4 pb-3 border-b rule">
        <h2 className="font-display text-[1.45rem] leading-none">Layers</h2>
        <span className="data text-[11px] text-stone">{year === null ? "all periods" : `counts for ${formatYear(year)}`}</span>
        <button onClick={onClose} aria-label="Close layers" className="ml-auto -mr-1 w-8 h-8 inline-flex items-center justify-center text-stone hover:text-ink">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <div className="overflow-y-auto overscroll-contain px-5 pb-2">
        {GROUPS.map((g) => (
          <fieldset key={g.label} className="pt-4">
            <legend className="data text-[11px] uppercase tracking-[0.14em] text-stone">{g.label}</legend>
            <ul className="mt-1">
              {g.layers.map((l) => {
                const on = layers.has(l);
                const n = counts[l] ?? 0;
                return (
                  <li key={l} className="group flex items-center">
                    <button role="checkbox" aria-checked={on} onClick={() => onToggle(l)} className="min-w-0 flex-1 flex items-center gap-2.5 py-2 text-left">
                      <span className={`shrink-0 w-4 h-4 border inline-flex items-center justify-center transition-colors ${on ? "bg-ink border-ink text-parchment" : "border-ink/30 group-hover:border-ink/60"}`} aria-hidden>
                        {on && <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>}
                      </span>
                      <Swatch layer={l} on />
                      <span className={`min-w-0 flex-1 text-[13.5px] ${on ? "text-ink" : "text-ink/75"}`}>{LAYER_META[l].label}</span>
                      <span className={`data text-[11px] tabular-nums ${n === 0 ? "text-stone-light" : "text-stone"}`}>{l === "polity" && !on ? "" : n}</span>
                    </button>
                    <button onClick={() => onSolo(l)} title={`Show only ${LAYER_META[l].label.toLowerCase()}`} aria-label={`Show only ${LAYER_META[l].label}`} className="ml-2 data text-[11px] px-1.5 py-0.5 text-stone opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 hover:text-terracotta">
                      only
                    </button>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
        <fieldset className="pt-4 mt-2 border-t rule">
          <legend className="data text-[11px] uppercase tracking-[0.14em] text-stone">Base map</legend>
          <ul className="mt-1.5">
            {base.map((o) => (
              <li key={o.id}>
                <button role="switch" aria-checked={o.on} onClick={o.toggle} className="w-full flex items-center gap-3 py-2 text-left group">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] text-ink">{o.label}</span>
                    <span className="block text-[11.5px] text-stone leading-snug">{o.note}</span>
                  </span>
                  <span className={`relative shrink-0 w-8 h-[18px] rounded-full transition-colors ${o.on ? "bg-ink" : "bg-ink/15 group-hover:bg-ink/25"}`} aria-hidden>
                    <span className={`absolute top-[3px] w-3 h-3 rounded-full bg-parchment transition-[left] duration-200 ${o.on ? "left-[17px]" : "left-[3px]"}`} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </fieldset>

      </div>

      <div className="flex items-center gap-2 px-5 py-3 border-t rule">
        <button onClick={onReset} className="text-[12.5px] text-terracotta hover:underline underline-offset-4">Reset to {theme.label}</button>
        <span className="text-stone-light" aria-hidden>·</span>
        <button onClick={onClear} className="text-[12.5px] text-stone hover:text-ink">Clear all</button>
        <span className="sm:hidden text-stone-light" aria-hidden>·</span>
        <button onClick={onKey} className="sm:hidden text-[12.5px] text-stone hover:text-ink">Map key</button>
        <button onClick={onClose} className="ml-auto h-8 px-4 bg-ink text-parchment text-[12.5px] font-medium hover:bg-ink/90">Done</button>
      </div>
    </div>
  );
}

/** Sea-level readout with the curve it comes from, for the coastline layer. */
function SeaPanel({ year, allTime }: { year: number; allTime: boolean }) {
  const W = 236, H = 64, MAXKA = 52, MIN = -135;
  const px = (ka: number) => W - (ka / MAXKA) * W;
  const py = (m: number) => (m / MIN) * H;
  const pts = SEA_LEVEL.filter(([ka]) => ka <= MAXKA).map(([ka, m]) => `${px(ka).toFixed(1)},${py(Math.min(0, m)).toFixed(1)}`).join(" ");
  const ka = (1950 - year) / 1000;
  const s = seaLevelAt(year);
  const near = s.level > -2.5;
  return (
    <div className="absolute right-3 bottom-7 sm:bottom-3 z-[500] w-[min(220px,calc(100%-1.5rem))] sm:w-[280px] bg-parchment/[0.97] border rule p-3 sm:p-4 shadow-[0_16px_40px_-24px_rgba(0,0,0,.5)]">
      <p className="eyebrow">Sea level{allTime ? "" : ` · ${formatYear(year)}`}</p>
      {allTime ? (
        <p className="mt-1 text-[12.5px] text-stone">Pick a year to see the coastline of that time.</p>
      ) : (
        <p className="mt-1 font-display text-xl sm:text-2xl leading-tight">
          {near ? "Close to today" : <>About {Math.round(-s.level)} m lower</>}
          {!near && <span className="data text-[11px] text-stone ml-2 whitespace-nowrap">± {Math.round(s.err)} m</span>}
        </p>
      )}
      <svg viewBox={`-2 -4 ${W + 4} ${H + 14}`} className="hidden sm:block mt-2 w-full h-auto" role="img" aria-label="Global sea level over the last 52,000 years">
        <line x1={0} x2={W} y1={0} y2={0} className="stroke-ink/20" strokeWidth={0.8} />
        <polyline points={pts} fill="none" className="stroke-terracotta" strokeWidth={1.5} strokeLinejoin="round" />
        {!allTime && ka >= 0 && ka <= MAXKA && (
          <>
            <line x1={px(ka)} x2={px(ka)} y1={-3} y2={H + 2} className="stroke-ink/50" strokeWidth={0.8} strokeDasharray="2 2" />
            <circle cx={px(ka)} cy={py(s.level)} r={3} className="fill-ink" />
          </>
        )}
        <text x={0} y={H + 10} className="fill-stone data" fontSize={8}>50,000 BCE</text>
        <text x={W} y={H + 10} textAnchor="end" className="fill-stone data" fontSize={8}>today</text>
      </svg>
      <p className="sm:hidden mt-1 text-[11px] text-stone leading-snug">Shaded ground was dry land. An approximate model; see the i panel.</p>
      <p className="hidden sm:block mt-2 text-[11px] text-stone leading-snug">
        Shaded ground was dry land when the sea stood this low. Curve: Spratt &amp; Lisiecki 2016; seafloor: NOAA ETOPO 2022. A bathtub model: it ignores land movement and the silt rivers have laid down since, so deltas and coasts are approximate.
      </p>
    </div>
  );
}
