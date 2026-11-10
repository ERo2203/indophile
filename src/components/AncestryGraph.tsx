"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * A qualitative model diagram — deliberately without percentages. It shows
 * which ancestry components published models combine, and whether each link
 * is observed directly in ancient genomes or inferred statistically.
 */
type Node = { id: string; label: string; sub: string; x: number; y: number; kind: "source" | "observed" | "model" | "present"; href?: string };
type Edge = { from: string; to: string; basis: "observed" | "model"; note: string };

const NODES: Node[] = [
  { id: "aasi", label: "AASI-related", sub: "Unsampled; inferred", x: 90, y: 70, kind: "source", href: "#aasi" },
  { id: "iran", label: "Iranian-related", sub: "Early-diverging lineage", x: 310, y: 70, kind: "source", href: "#iranian-related" },
  { id: "steppe", label: "Steppe-related", sub: "Swat valley, 2nd mill. BCE", x: 560, y: 70, kind: "observed", href: "#steppe-related" },
  { id: "ivp", label: "Indus Periphery", sub: "12 ancient individuals", x: 200, y: 210, kind: "observed", href: "#indus-periphery" },
  { id: "asi", label: "ASI", sub: "Statistical construct", x: 110, y: 350, kind: "model", href: "#ani-asi" },
  { id: "ani", label: "ANI", sub: "Statistical construct", x: 470, y: 350, kind: "model", href: "#ani-asi" },
  { id: "today", label: "Present-day South Asian populations", sub: "A continuous cline, shaped further by endogamy", x: 290, y: 470, kind: "present", href: "#endogamy" },
];

const EDGES: Edge[] = [
  { from: "iran", to: "ivp", basis: "observed", note: "Observed: Indus Periphery genomes carry Iranian-related ancestry." },
  { from: "aasi", to: "ivp", basis: "observed", note: "Observed: Indus Periphery genomes carry AASI-related ancestry." },
  { from: "ivp", to: "asi", basis: "model", note: "Model: ASI = Indus Periphery-related + AASI-related (Narasimhan et al. 2019)." },
  { from: "aasi", to: "asi", basis: "model", note: "Model: further AASI-related admixture into ASI." },
  { from: "ivp", to: "ani", basis: "model", note: "Model: ANI = Indus Periphery-related + Steppe-related." },
  { from: "steppe", to: "ani", basis: "model", note: "Model: steppe-related ancestry contributes to ANI from the 2nd millennium BCE." },
  { from: "asi", to: "today", basis: "model", note: "Model: most groups fit as ANI–ASI mixtures (Reich et al. 2009)." },
  { from: "ani", to: "today", basis: "model", note: "Mixture dated c. 4,200–1,900 years ago (Moorjani et al. 2013)." },
];

const W = 160, H = 54;

export function AncestryGraph() {
  const [hover, setHover] = useState<string | null>(null);
  const node = (id: string) => NODES.find((n) => n.id === id)!;
  const active = (e: Edge) => hover && (e.from === hover || e.to === hover);
  const note = hover ? EDGES.filter((e) => e.from === hover || e.to === hover) : [];

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-8">
      <svg viewBox="0 0 720 520" className="w-full h-auto" role="img" aria-labelledby="ag-title ag-desc">
        <title id="ag-title">Ancestry model diagram for South Asian population history</title>
        <desc id="ag-desc">Qualitative diagram: AASI-related and Iranian-related ancestry combine in the Indus Periphery group; Indus Periphery combines with AASI to form the ASI model, and with steppe-related ancestry to form the ANI model; present-day populations fit as ANI–ASI mixtures. No proportions are shown.</desc>
        <defs>
          <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" style={{ fill: "var(--color-sage-deep)" }} />
          </marker>
        </defs>
        {EDGES.map((e, i) => {
          const a = node(e.from), b = node(e.to);
          const x1 = a.x + W / 2, y1 = a.y + H, x2 = b.x + (b.kind === "present" ? 140 : W / 2), y2 = b.y;
          const my = (y1 + y2) / 2;
          return (
            <path key={i} d={`M${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2 - 4}`} fill="none"
              style={{ stroke: active(e) ? "var(--color-terracotta)" : "var(--color-sage-deep)" }} strokeOpacity={hover && !active(e) ? 0.2 : 0.85}
              strokeWidth={active(e) ? 2.4 : 1.5} strokeDasharray={e.basis === "model" ? "5 5" : undefined} markerEnd="url(#ah)" />
          );
        })}
        {NODES.map((n) => {
          const w = n.kind === "present" ? 280 : W;
          const fill = n.kind === "observed" ? "var(--color-sage-strong)" : n.kind === "present" ? "var(--color-night)" : "var(--color-ivory)";
          const text = n.kind === "observed" || n.kind === "present" ? "var(--color-paper)" : "var(--color-ink)";
          return (
            <a key={n.id} href={n.href} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}>
              <rect x={n.x} y={n.y} width={w} height={H} style={{ fill, stroke: n.kind === "model" ? "var(--color-terracotta)" : "var(--color-sage-deep)" }} strokeDasharray={n.kind === "model" || n.kind === "source" ? "4 3" : undefined} />
              <text x={n.x + 12} y={n.y + 23} fontFamily="var(--font-cormorant)" fontSize="19" style={{ fill: text }}>{n.label}</text>
              <text x={n.x + 12} y={n.y + 41} fontFamily="var(--font-plex-mono)" fontSize="11" style={{ fill: text }} opacity="0.8">{n.sub}</text>
            </a>
          );
        })}
      </svg>
      <div className="space-y-5 text-sm">
        <div className="border rule bg-ivory p-5 space-y-3">
          <p className="eyebrow">Legend</p>
          <p className="flex items-center gap-3"><span className="w-8 border-t-2 border-sage-deep" /> Observed directly in ancient genomes</p>
          <p className="flex items-center gap-3"><span className="w-8 border-t-2 border-dashed border-sage-deep" /> Statistical model / inference</p>
          <p className="flex items-center gap-3"><span className="w-6 h-4 bg-sage-strong" /> Population with sequenced individuals</p>
          <p className="flex items-center gap-3"><span className="w-6 h-4 border border-dashed border-terracotta" /> Modelled construct, never sampled</p>
        </div>
        <div className="min-h-[120px]" aria-live="polite">
          {note.length ? (
            <ul className="space-y-2">{note.map((e, i) => <li key={i} className="border-l-2 border-terracotta pl-3 text-ink/85">{e.note}</li>)}</ul>
          ) : (
            <p className="text-stone italic font-display text-lg">Hover or focus a box to see how each link is supported.</p>
          )}
        </div>
        <p className="data text-[11px] text-stone leading-relaxed">
          No admixture proportions are drawn here. Published proportions vary by group and by model; see each study for its own figures. <Link href="/methodology#genetics" className="underline">Why we do this</Link>.
        </p>
      </div>
    </div>
  );
}
