"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { PointFeature } from "@/lib/maptypes";
import { norm } from "@/lib/search";
import { DynamicMap } from "./map/DynamicMap";

export function SiteArchive({ points, periods }: { points: PointFeature[]; periods: { id: string; title: string }[] }) {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("");
  const [period, setPeriod] = useState("");
  const [kind, setKind] = useState("archaeological");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [sel, setSel] = useState<string | null>(null);

  const countries = useMemo(() => [...new Set(points.map((p) => p.country))].sort(), [points]);
  const shown = useMemo(() => {
    const nq = norm(q);
    return points
      .filter((p) => (!kind || p.layers.includes(kind as never)) && (!country || p.country === country) && (!period || p.periods.includes(period)))
      .filter((p) => !nq || norm(`${p.title} ${p.modern} ${p.culture ?? ""} ${p.summary}`).includes(nq))
      .sort((a, b) => a.start - b.start);
  }, [points, q, country, period, kind]);

  const select = "bg-ivory border rule px-3 py-2 text-sm";
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center mb-6">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter sites, cultures, regions…" aria-label="Filter sites" className={`${select} flex-1 min-w-0`} />
        <select aria-label="Site type" value={kind} onChange={(e) => setKind(e.target.value)} className={select}>
          <option value="">All places</option>
          <option value="archaeological">Excavated sites</option>
          <option value="inscription">Inscriptions</option>
          <option value="religious">Religious centres</option>
          <option value="port">Ports</option>
          <option value="unesco">UNESCO World Heritage</option>
          <option value="battle">Battle locations</option>
        </select>
        <select aria-label="Period" value={period} onChange={(e) => setPeriod(e.target.value)} className={select}>
          <option value="">All periods</option>
          {periods.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <select aria-label="Country" value={country} onChange={(e) => setCountry(e.target.value)} className={select}>
          <option value="">All countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex border rule" role="group" aria-label="View">
          {(["grid", "table"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} aria-pressed={view === v} className={`px-3 py-2 data text-[11px] ${view === v ? "bg-ink text-parchment" : "text-stone"}`}>{v}</button>
          ))}
        </div>
      </div>

      <div className="relative h-[380px] border rule mb-8 overflow-hidden">
        <DynamicMap className="absolute inset-0" points={shown} selectedId={sel} fit={shown.length > 0} onSelect={(id) => setSel(id)} />
      </div>

      <p className="data text-stone mb-5" aria-live="polite">{shown.length} sites</p>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {shown.map((p) => (
            <Link key={p.id} href={p.href} onMouseEnter={() => setSel(p.id)} className={`group card-ind flex flex-col ${sel === p.id ? "!border-terracotta" : ""}`}>
              <div className="relative aspect-[16/10] bg-sage-pale overflow-hidden plate">
                {p.image ? <Image src={p.image.src} alt={p.title} fill sizes="25vw" className="object-cover" /> : (
                  <div className="absolute inset-0 flex items-end p-3 data text-[11px] text-stone">{p.lat.toFixed(2)}°N {p.lng.toFixed(2)}°E</div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="eyebrow">{p.country}</p>
                <h3 className="font-display text-xl leading-tight mt-1 group-hover:text-terracotta">{p.title}</h3>
                <p className="text-[13px] text-stone mt-1">{p.modern}</p>
                <p className="data text-[11px] text-ink/70 mt-auto pt-3">{p.dateLabel}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left border-b-2 border-ink">
                {["Site", "Present-day location", "Period", "Culture", "Coordinates"].map((h) => <th key={h} className="eyebrow py-3 pr-4">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.id} className="border-b rule hover:bg-ivory" onMouseEnter={() => setSel(p.id)}>
                  <td className="py-3 pr-4"><Link href={p.href} className="font-display text-lg hover:text-terracotta">{p.title}</Link></td>
                  <td className="py-3 pr-4 text-stone">{p.modern}, {p.country}</td>
                  <td className="py-3 pr-4 data text-[12px]">{p.dateLabel}</td>
                  <td className="py-3 pr-4 text-stone">{p.culture ?? "—"}</td>
                  <td className="py-3 data text-[11px] text-stone">{p.lat.toFixed(3)}, {p.lng.toFixed(3)}{p.approximate ? " ≈" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
