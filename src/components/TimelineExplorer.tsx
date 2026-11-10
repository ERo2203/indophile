"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TimelineBand, TimelineCategory, TimelineItem } from "@/lib/timeline";
import { formatYear } from "@/lib/format";

const CATS: { id: TimelineCategory; label: string }[] = [
  { id: "polity", label: "Civilisations & polities" },
  { id: "political", label: "Political" },
  { id: "battle", label: "Battles" },
  { id: "discovery", label: "Archaeological discoveries" },
  { id: "inscription", label: "Inscriptions" },
  { id: "religious", label: "Religious developments" },
  { id: "migration", label: "Population movements" },
  { id: "technology", label: "Technology" },
  { id: "cultural", label: "Cultural" },
  { id: "environmental", label: "Environment & climate" },
];

const PRESETS: { label: string; from: number; to: number }[] = [
  { label: "Everything", from: -2_000_000, to: 2100 },
  { label: "Deep prehistory", from: -2_000_000, to: -7000 },
  { label: "3000 – 1000 BCE", from: -3000, to: -1000 },
  { label: "1000 BCE – 1 CE", from: -1000, to: 1 },
  { label: "1 – 1200 CE", from: 1, to: 1200 },
  { label: "1200 CE – today", from: 1200, to: 2100 },
];

const MARK: Record<string, string> = { secure: "●", conventional: "◐", approximate: "○", debated: "◌" };

/** Piecewise time scale: compresses deep time, expands the historical period. */
function xOf(y: number): number {
  const seg: [number, number, number, number][] = [
    [-1_600_000, -10000, 0, 6],
    [-10000, -3500, 6, 22],
    [-3500, -500, 22, 52],
    [-500, 700, 52, 76],
    [700, 2026, 76, 100],
  ];
  for (const [a, b, xa, xb] of seg) if (y <= b) return xa + ((Math.max(y, a) - a) / (b - a)) * (xb - xa);
  return 100;
}

export function TimelineExplorer({ items, bands }: { items: TimelineItem[]; bands: TimelineBand[] }) {
  const [cats, setCats] = useState<Set<TimelineCategory>>(new Set(CATS.map((c) => c.id)));
  const [preset, setPreset] = useState(0);
  const { from, to } = PRESETS[preset];

  const shown = useMemo(
    () => items.filter((i) => cats.has(i.category) && (i.end ?? i.start) >= from && i.start <= to),
    [items, cats, from, to],
  );

  const toggle = (c: TimelineCategory) =>
    setCats((prev) => {
      const n = new Set(prev);
      if (n.has(c)) n.delete(c);
      else n.add(c);
      return n;
    });
  const only = (c: TimelineCategory) => setCats(new Set([c]));

  // group by period band containing start
  const groups = useMemo(() => {
    const g = new Map<string, TimelineItem[]>();
    for (const it of shown) {
      const key = it.periods[0] ?? bands.find((b) => b.start <= it.start && it.start <= b.end)?.id ?? "other";
      if (!g.has(key)) g.set(key, []);
      g.get(key)!.push(it);
    }
    return [...g.entries()].sort((a, b) => (bands.findIndex((x) => x.id === a[0]) - bands.findIndex((x) => x.id === b[0])));
  }, [shown, bands]);

  return (
    <div>
      {/* Overview band */}
      <div className="container-ind">
        <div className="relative border-y rule py-6" aria-hidden>
          <div className="relative h-[150px]">
            {bands.map((b, i) => {
              const l = xOf(b.start), r = Math.max(xOf(b.end), l + 0.6);
              const visible = b.end >= from && b.start <= to;
              return (
                <Link
                  key={b.id}
                  href={b.href}
                  tabIndex={-1}
                  title={`${b.title} · ${b.dateLabel}`}
                  className={`absolute h-[14px] group transition-opacity ${visible ? "opacity-100" : "opacity-25"}`}
                  style={{ left: `${l}%`, width: `${r - l}%`, top: `${(i % 4) * 30 + 8}px` }}
                >
                  <span className={`block h-full ${b.phase === 4 ? "bg-stone-light/60" : "bg-terracotta/70"} group-hover:bg-ink ${b.precision === "debated" || b.precision === "approximate" ? "[mask-image:linear-gradient(90deg,transparent,#000_18%,#000_82%,transparent)]" : ""}`} />
                  <span className="absolute left-0 top-[16px] data text-[11px] whitespace-nowrap text-stone group-hover:text-ink">{b.title.split(" and ")[0]}</span>
                </Link>
              );
            })}
            {shown.map((it) => (
              <span key={it.id} className="absolute bottom-0 w-px h-3 bg-ink/50" style={{ left: `${xOf(it.start)}%` }} />
            ))}
          </div>
          <div className="relative h-5 mt-2 border-t rule">
            {[-1_500_000, -10000, -5000, -3500, -2000, -500, 1, 700, 1200, 1947].map((y) => (
              <span key={y} className="absolute top-1.5 -translate-x-1/2 data text-[11px] text-stone whitespace-nowrap" style={{ left: `${xOf(y)}%` }}>
                {y === 1 ? "1 CE" : y < -10000 ? "1.5 Ma" : formatYear(y).replace(" years ago", "")}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-2 data text-[11px] text-stone-light">Scale is compressed for deep time. Faded band ends mark approximate or debated boundaries.</p>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-parchment/95 backdrop-blur border-b rule mt-8">
        <div className="container-ind py-4 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow mr-2">Range</span>
            {PRESETS.map((p, i) => (
              <button key={p.label} onClick={() => setPreset(i)} aria-pressed={preset === i}
                className={`data text-[11px] px-2.5 py-1 border ${preset === i ? "bg-ink text-parchment border-ink" : "rule text-stone hover:text-ink"}`}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow mr-2">Show</span>
            {CATS.map((c) => (
              <span key={c.id} className="inline-flex">
                <button onClick={() => toggle(c.id)} aria-pressed={cats.has(c.id)}
                  className={`text-[12px] px-2.5 py-1 border-y border-l ${cats.has(c.id) ? "bg-sage-pale border-sage/50 text-sage-deep" : "rule text-stone-light line-through"}`}>
                  {c.label}
                </button>
                <button onClick={() => only(c.id)} className="text-[11px] data px-1.5 border rule text-stone hover:text-terracotta" title={`Show only ${c.label}`} aria-label={`Show only ${c.label}`}>only</button>
              </span>
            ))}
            <button onClick={() => setCats(new Set(CATS.map((c) => c.id)))} className="data text-[11px] text-terracotta ml-2 hover:underline">reset</button>
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="container-ind py-12">
        <p className="data text-stone mb-8" aria-live="polite">{shown.length} entries</p>
        {groups.length === 0 && <p className="font-display text-2xl text-stone">Nothing in this range for the selected categories yet.</p>}
        {groups.map(([pid, list]) => {
          const band = bands.find((b) => b.id === pid);
          return (
            <section key={pid} className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-12 mb-16">
              <header className="lg:sticky lg:top-44 self-start">
                <p className="data text-terracotta">{band?.dateLabel}</p>
                <h2 className="font-display text-3xl leading-tight mt-1">
                  {band ? <Link href={band.href} className="hover:text-terracotta">{band.title}</Link> : "Other"}
                </h2>
              </header>
              <ol className="relative border-l rule pl-8">
                {list.map((it) => (
                  <li key={it.id} className="relative pb-10 last:pb-0">
                    <span className="absolute -left-[41px] top-1 w-[17px] text-center text-terracotta bg-parchment leading-none text-lg" title={it.precision}>{MARK[it.precision]}</span>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="data text-ink">{it.dateLabel}</span>
                      <span className="data text-[11px] uppercase tracking-wider text-stone">{CATS.find((c) => c.id === it.category)?.label}</span>
                      {it.precision !== "secure" && <span className="data text-[11px] text-stone-light">({it.precision})</span>}
                    </div>
                    <h3 className="font-display text-[1.6rem] leading-tight mt-1.5">
                      <Link href={it.href} className="hover:text-terracotta">{it.title}</Link>
                    </h3>
                    {it.place && <p className="data text-[11px] text-stone mt-1">◇ {it.place}</p>}
                    <p className="text-[15px] text-ink/80 leading-relaxed mt-2 max-w-2xl">{it.summary}</p>
                    {it.significance && <p className="text-[13px] text-stone mt-2 max-w-2xl"><span className="eyebrow mr-2">Significance</span>{it.significance}</p>}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 items-center">
                      {it.related.map((r) => (
                        <Link key={r.id} href={r.href} className="text-[12px] text-sage-deep hover:text-terracotta link-ind">↳ {r.title}</Link>
                      ))}
                      {it.sources.length > 0 && <span className="data text-[11px] text-stone-light">{it.sources.join(" · ")}</span>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
