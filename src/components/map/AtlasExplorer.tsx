"use client";

import Link from "next/link";
import Image from "next/image";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { MapLayer } from "@/lib/types";
import type { MapPayload } from "@/lib/maptypes";
import { LAYER_META, TRADITION_COLORS, primaryLayer } from "@/lib/maptypes";
import { CLIOPATRIA_CITATION, CLIO_TO_POLITY, HBM_CITATION, parseClioKey, parseHbmKey, type ShownPolity } from "@/lib/cliopatria";
import { formatYear } from "@/lib/format";

const fy = (y: number) => formatYear(y).replace(" CE", "");
import { DynamicMap } from "./DynamicMap";
import { TimeScroller } from "./TimeScroller";

const ALL_LAYERS: MapLayer[] = ["polity", "archaeological", "settlement", "inscription", "temple", "religious", "hotspot", "language", "fossil", "port", "trade", "migration", "battle", "unesco"];
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
};

type Theme = "political" | "languages" | "religion";
const THEMES: { id: Theme; label: string; layers: MapLayer[] }[] = [
  { id: "political", label: "Political", layers: ["polity", "inscription", "port", "battle"] },
  { id: "languages", label: "Languages", layers: ["language"] },
  { id: "religion", label: "Religion", layers: ["religious", "temple"] },
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
    setSelected(null);
  };
  const [year, setYear] = useState(defaultYear);
  const [allTime, setAllTime] = useState(false);
  const [modern, setModern] = useState(false);
  const [selected, setSelected] = useState<Selected>(null);
  const [legend, setLegend] = useState(false);
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
    const f = q.get("focus");
    if (f) setSelected({ id: f, kind: payload.points.some((p) => p.id === f) ? "point" : payload.territories.some((t) => t.polityId === f) ? "territory" : "route" });
    if (q.get("all") === "1") setAllTime(true);
    const th = q.get("theme");
    if (th === "languages" || th === "religion") chooseTheme(th);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    () => (theme === "political" && layers.has("polity") && !allTime ? { year: y } : null),
    [theme, layers, allTime, y],
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

  const visible = points.length + routes.length + (boundaries ? shownPolities : 0);

  return (
    <div className={`relative flex flex-col overflow-hidden bg-[var(--map-sea)] ${isPreview ? "h-[600px] lg:h-[680px]" : "h-[calc(100svh-4rem)]"}`}>
      <div className="relative flex-1 min-h-0">
        <DynamicMap
          className="absolute inset-0"
          points={points}
          routes={routes}
          boundaries={boundaries}
          onBoundariesShown={setShown}
          basemap={basemap}
          selectedId={selected?.id}
          modernLabels={modern}
          onSelect={(id, kind) => setSelected(id ? { id, kind: kind ?? "point" } : null)}
          initialView={initialView ?? (isPreview || narrow ? { center: [21, 78], zoom: 4 } : { center: [21.5, 77], zoom: 5 })}
        />

        {/* Theme switch */}
        <div className="absolute top-3 left-14 z-[520] flex gap-px bg-ink/15 border border-ink/15 shadow-[0_6px_20px_-12px_rgba(0,0,0,.45)]" role="tablist" aria-label="Map theme">
          {THEMES.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={theme === t.id}
              onClick={() => chooseTheme(t.id)}
              className={`h-8 px-3 text-[12px] font-medium ${theme === t.id ? "bg-ink text-parchment" : "bg-ivory/90 text-ink hover:bg-ivory"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filter chips, floating on the map */}
        <div className="absolute top-14 left-14 right-3 z-[500] flex items-start gap-2 pointer-events-none min-w-0">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pointer-events-auto pb-1 min-w-0" role="group" aria-label="Map filters">
            {ALL_LAYERS.map((l) => {
              const on = layers.has(l);
              const n = counts[l] ?? 0;
              return (
                <button
                  key={l}
                  onClick={() => toggle(l)}
                  onDoubleClick={() => solo(l)}
                  aria-pressed={on}
                  title={`${LAYER_META[l].label} — click to toggle, double-click to show only this`}
                  className={`shrink-0 inline-flex items-center gap-1.5 h-8 pl-2 pr-2.5 text-[12px] border shadow-[0_6px_20px_-12px_rgba(0,0,0,.45)] transition-all ${
                    on ? "bg-ivory border-ink/15 text-ink" : "bg-ivory/60 backdrop-blur border-transparent text-stone hover:bg-ivory/85"
                  } ${n === 0 && on ? "opacity-70" : ""}`}
                >
                  <Swatch layer={l} on={on} />
                  {SHORT[l]}
                  <span className={`data text-[11px] tabular-nums ${on ? "text-stone" : "text-stone-light"}`}>{n}</span>
                </button>
              );
            })}
          </div>
          <div className="ml-auto flex gap-1.5 pointer-events-auto shrink-0">
            <button
              onClick={() => setBasemap((b) => (b === "plain" ? "terrain" : "plain"))}
              aria-pressed={basemap === "terrain"}
              className={`h-8 px-3 text-[12px] border shadow-[0_6px_20px_-12px_rgba(0,0,0,.45)] ${basemap === "terrain" ? "bg-ink text-parchment border-ink" : "bg-ivory/85 backdrop-blur border-ink/10 text-ink"}`}
              title="Switch between a plain map and physical terrain"
            >
              Terrain
            </button>
            <button
              onClick={() => setModern((m) => !m)}
              aria-pressed={modern}
              className={`h-8 px-3 text-[12px] border shadow-[0_6px_20px_-12px_rgba(0,0,0,.45)] ${modern ? "bg-ink text-parchment border-ink" : "bg-ivory/85 backdrop-blur border-ink/10 text-ink"}`}
              title="Overlay present-day international borders, for orientation"
            >
              <span className="sm:hidden">Borders</span>
              <span className="hidden sm:inline">Modern borders</span>
            </button>
            <button
              onClick={() => setLegend((v) => !v)}
              aria-expanded={legend}
              className="h-8 w-8 border bg-ivory/85 backdrop-blur border-ink/10 font-display italic text-lg leading-none shadow-[0_6px_20px_-12px_rgba(0,0,0,.45)]"
              title="How to read this map"
              aria-label="How to read this map"
            >
              i
            </button>
          </div>
        </div>

        {legend && (
          <div className="absolute top-14 right-3 z-[650] w-[300px] bg-parchment border rule p-5 shadow-[0_20px_50px_-25px_rgba(0,0,0,.5)] text-[12.5px] leading-relaxed space-y-3">
            <p className="eyebrow">How to read this map</p>
            <p><span className="inline-block w-4 h-3 align-middle mr-1.5 bg-terracotta/50 border border-ink/40" />Kingdoms are drawn from <a className="underline" href={CLIOPATRIA_CITATION.repo} target="_blank" rel="noopener noreferrer">Cliopatria</a>, the Seshat Global History Databank&apos;s peer-reviewed boundary dataset (CC BY 4.0), exactly as published — one scholarly reconstruction among several. Where Cliopatria is blank, regions from <a className="underline" href={HBM_CITATION.repo} target="_blank" rel="noopener noreferrer">historical-basemaps</a> (GPL-3.0) fill the gap with dashed borders and italic names — a coarser, approximate source.</p>
            <p>Language areas are not drawn: no sourced historical language-area dataset has been added yet. The Languages theme shows dated first inscriptions.</p>
            <p><span className="inline-block w-5 align-middle mr-1.5 border-t-2 border-dashed border-gold" />Trade routes join attested places; the lines between them are simplified.</p>
            <p><span className="inline-block w-5 align-middle mr-1.5 border-t-2 border-dotted border-sage-deep" />Migration arrows are modelled ancestry flows from ancient DNA, not paths walked.</p>
            <p><span className="inline-block w-2.5 h-2.5 rounded-full border border-dashed border-terracotta align-middle mr-1.5" />A dashed ring marks an approximate location.</p>
            <p className="text-stone">Click any point, line or territory to learn more. Double-click a filter to show only that layer.</p>
          </div>
        )}

        {theme === "political" && shown.length > 0 && !selected && (
          <div className={`absolute left-3 bottom-3 z-[500] w-[260px] bg-parchment/95 backdrop-blur border rule shadow-[0_16px_40px_-24px_rgba(0,0,0,.5)] ${listOpen ? "max-h-[60%]" : ""} flex flex-col`}>
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
          <div className="absolute left-3 bottom-3 z-[500] w-[290px] bg-parchment/95 border rule p-4 shadow-[0_16px_40px_-24px_rgba(0,0,0,.5)]">
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

        {/* Empty state */}
        {visible === 0 && (
          <div className="absolute inset-x-0 top-20 z-[400] flex justify-center pointer-events-none">
            <p className="bg-parchment/95 border rule px-4 py-2 data text-stone">Nothing catalogued for this moment and these filters yet.</p>
          </div>
        )}

        {/* Selection panel */}
        {selected && (
          <div className="absolute z-[700] inset-x-2 bottom-2 max-h-[70%] lg:inset-x-auto lg:bottom-3 lg:top-14 lg:right-3 lg:w-[380px] lg:max-h-none flex">
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
            <span className="absolute bottom-1 right-2 data text-[11px] text-paper/90 drop-shadow">{p.image.credit}</span>
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
        <Link href={p.href} className="mt-6 flex items-center justify-between bg-ink text-parchment px-4 py-3 text-sm hover:bg-terracotta transition-colors">Learn more about this site <span aria-hidden>→</span></Link>
      </>
    );
  } else if (selected.kind === "territory") {
    const hk = parseHbmKey(selected.id);
    if (hk) {
      const item = shown.find((x) => x.key === selected.id);
      return (
        <aside className="relative w-full self-start max-h-full overflow-y-auto bg-parchment border rule shadow-[0_24px_60px_-28px_rgba(0,0,0,.55)] p-6" aria-label="Polity details">
          <button onClick={onClose} className="absolute right-3 top-3 w-8 h-8 flex items-center justify-center text-stone hover:text-ink" aria-label="Close panel">✕</button>
          <p className="eyebrow mb-2" style={{ color: item?.color }}>Political boundary · gap-fill source</p>
          <h2 className="font-display text-[1.9rem] leading-tight">{hk.name}</h2>
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
        <aside className="relative w-full self-start max-h-full overflow-y-auto bg-parchment border rule shadow-[0_24px_60px_-28px_rgba(0,0,0,.55)] p-6" aria-label="Polity details">
          <button onClick={onClose} className="absolute right-3 top-3 w-8 h-8 flex items-center justify-center text-stone hover:text-ink" aria-label="Close panel">✕</button>
          <p className="eyebrow mb-2" style={{ color: shown.find((x) => x.key === selected.id)?.color }}>Political boundary · Cliopatria</p>
          <h2 className="font-display text-[1.9rem] leading-tight">{rec?.t ?? ck.name}</h2>
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
        <h2 className="font-display text-[1.9rem] leading-tight">{t.title}</h2>
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
        <Link href={r.href} className="mt-6 flex items-center justify-between bg-ink text-parchment px-4 py-3 text-sm hover:bg-terracotta transition-colors">Learn more about this route <span aria-hidden>→</span></Link>
      </>
    );
  }

  return (
    <aside
      className="relative w-full self-start max-h-full bg-parchment border rule shadow-[0_24px_60px_-28px_rgba(0,0,0,.55)] overflow-y-auto p-6"
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
