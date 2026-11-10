"use client";

import Link from "next/link";
import { useState } from "react";
import type { AncestryModel, Specimen } from "@/data/specimens";

const COMPONENT_COLORS: Record<string, string> = {
  iranian: "#B07A2A",
  aasi: "#4E5B45",
  steppe: "#3F6FA0",
  indus: "#A65D43",
};

function colourFor(name: string) {
  const n = name.toLowerCase();
  if (n.includes("iran")) return COMPONENT_COLORS.iranian;
  if (n.includes("aasi")) return COMPONENT_COLORS.aasi;
  if (n.includes("steppe")) return COMPONENT_COLORS.steppe;
  if (n.includes("siberian")) return "#5A86B5";
  if (n.includes("indus")) return COMPONENT_COLORS.indus;
  return "#77736A";
}

/**
 * Shows each specimen's published ancestry model. Where proportions have been
 * transcribed from the source they are drawn to scale; otherwise the bar shows
 * which sources the model used, hatched, with an explicit "pending" marker.
 */
export function AncestryCalculator({ specimens, links }: { specimens: Specimen[]; links: Record<string, { t: string; h: string }> }) {
  const [a, setA] = useState(specimens[0]?.id);
  const [b, setB] = useState<string | "">("");
  const pick = (id: string) => specimens.find((s) => s.id === id);
  const shown = [pick(a), b ? pick(b) : undefined].filter((x): x is Specimen => !!x);

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-end mb-8">
        <label className="flex flex-col gap-1">
          <span className="eyebrow">Specimen</span>
          <select className="bg-ivory border rule px-3 py-2 text-sm min-w-[280px]" value={a} onChange={(e) => setA(e.target.value)}>
            {specimens.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="eyebrow">Compare with</span>
          <select className="bg-ivory border rule px-3 py-2 text-sm min-w-[280px]" value={b} onChange={(e) => setB(e.target.value)}>
            <option value="">— none —</option>
            {specimens.filter((s) => s.id !== a).map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
      </div>

      <div className={`grid gap-8 ${shown.length > 1 ? "lg:grid-cols-2" : ""}`}>
        {shown.map((s) => (
          <article key={s.id} className="border rule bg-ivory">
            <header className="p-6 border-b rule">
              <p className="eyebrow">{s.kind === "group" ? `Group${s.n ? ` · ${s.n}` : ""}` : "Individual"}</p>
              <h3 className="font-display text-[1.8rem] leading-tight mt-1">{s.label}</h3>
              <p className="data text-[11px] text-stone mt-2">{s.place}</p>
              <p className="data text-[11px] text-stone">{s.dates} · dated by {s.dating}</p>
              {s.siteId && links[s.siteId] && <Link href={links[s.siteId].h} className="mt-2 inline-block text-[12px] text-terracotta hover:underline">Site: {links[s.siteId].t} →</Link>}
            </header>

            <section className="p-6 border-b rule">
              <p className="rubric mb-3">Ancestry model</p>
              {s.genetic ? (
                <>
                  <div className="space-y-6">
                    {s.genetic.models.map((m) => <ModelBar key={m.label} model={m} />)}
                  </div>
                  {s.genetic.findings && s.genetic.findings.length > 0 && (
                    <dl className="mt-5 space-y-2.5 text-[12.5px] border-t rule pt-4">
                      {s.genetic.findings.map((f) => (
                        <div key={f.label}>
                          <dt className="eyebrow">{f.label}</dt>
                          <dd className="mt-0.5">{f.value}</dd>
                          <dd className="data text-[11px] text-stone">{f.locus}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <p className="mt-4 text-[13px] text-ink/80 leading-relaxed">{s.genetic.note}</p>
                  <dl className="mt-4 grid grid-cols-[7rem_1fr] gap-y-1.5 text-[12px]">
                    <dt className="eyebrow">Method</dt><dd>{s.genetic.method}</dd>
                    <dt className="eyebrow">Coverage</dt><dd>{s.genetic.coverage}</dd>
                    {s.genetic.mtDNA && (<><dt className="eyebrow">mtDNA</dt><dd>{s.genetic.mtDNA}</dd></>)}
                    {s.genetic.yDNA && (<><dt className="eyebrow">Y-DNA</dt><dd>{s.genetic.yDNA}</dd></>)}
                    {s.sex && (<><dt className="eyebrow">Sex</dt><dd>{s.sex}</dd></>)}
                  </dl>
                </>
              ) : (
                <p className="text-sm text-stone">No ancient DNA has been published for this specimen, so no ancestry result exists.</p>
              )}
            </section>

            <section className="p-6">
              <p className="rubric mb-3">Physical profile</p>
              <dl className="grid grid-cols-[7rem_1fr] gap-y-2 text-[13px]">
                <Trait k="Stature" v={s.physical.stature.value} extra={s.physical.stature.method ? `${s.physical.stature.method}${s.physical.stature.locus ? ` · ${s.physical.stature.locus}` : ""}` : s.physical.stature.locus} />
                <Trait k="Build" v={s.physical.build} />
                <Trait k="Bone density" v={s.physical.boneDensity} />
                <Trait k="Teeth" v={s.physical.dental} />
                <Trait k="Pathology" v={s.physical.pathology} />
                <Trait k="Pigmentation" v={s.physical.pigmentation} />
              </dl>
              {s.physical.note && <p className="mt-4 text-[12px] text-stone leading-relaxed">{s.physical.note}</p>}
            </section>
          </article>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-6 text-[13px] text-ink/80 leading-relaxed">
        <p><strong className="font-display text-lg block mb-1">Model, not measurement.</strong> An ancestry proportion is the output of a statistical model with chosen source populations. Change the sources and the numbers change.</p>
        <p><strong className="font-display text-lg block mb-1">Where the numbers come from.</strong> Every figure is transcribed from the publication, with its location cited under the bar. A value marked &ldquo;derived&rdquo; is 1 minus a reported figure; a range covers several individuals; &ldquo;≥&rdquo; is a published minimum. Where a source gives no number, none is shown.</p>
        <p><strong className="font-display text-lg block mb-1">Not an identity.</strong> No result here corresponds to an ethnic, caste, linguistic, religious or national group, past or present.</p>
      </div>
    </div>
  );
}

function ModelBar({ model }: { model: AncestryModel }) {
  // Point estimates (and minimums) are drawn to scale; ranges are drawn at their midpoint with whiskers in the legend.
  const widths = model.components.map((c) => (c.proportion !== null ? c.proportion : c.range ? (c.range[0] + c.range[1]) / 2 : null));
  const known = widths.filter((w): w is number => w !== null).reduce((x, y) => x + y, 0);
  const unknownCount = widths.filter((w) => w === null).length;
  const fill = (w: number | null) => (w !== null ? w : unknownCount ? Math.max(0, 1 - known) / unknownCount : 0);
  const isRange = model.components.some((c) => c.range);
  return (
    <div>
      <p className="text-[13px] font-medium">{model.label}</p>
      <div className="mt-2 flex h-8 w-full overflow-hidden border border-ink/20">
        {model.components.map((c, i) => {
          const w = fill(widths[i]);
          const hatched = c.proportion === null || c.derived || c.atLeast;
          const col = colourFor(c.name);
          return (
            <div
              key={c.name}
              className="flex items-center justify-center text-[11px] text-paper font-medium overflow-hidden whitespace-nowrap"
              style={{ flex: Math.max(w, 0.0001), background: hatched ? `repeating-linear-gradient(135deg, ${col} 0 7px, ${col}C0 7px 14px)` : col }}
              title={c.name}
            >
              {label(c)}
            </div>
          );
        })}
      </div>
      <ul className="mt-2.5 space-y-1.5 text-[12.5px]">
        {model.components.map((c) => (
          <li key={c.name} className="flex items-start gap-2">
            <span className="w-3 h-3 shrink-0 mt-0.5" style={{ background: colourFor(c.name) }} />
            <span className="flex-1">{c.name}</span>
            <span className="data text-[11px] text-right">
              {c.proportion !== null ? (
                <>
                  {c.atLeast ? "≥ " : ""}
                  {(c.proportion * 100).toFixed(0)}%{c.se ? ` ± ${(c.se * 100).toFixed(0)}` : ""}
                  {c.derived && <span className="block text-[11px] text-stone">derived (1 − reported)</span>}
                </>
              ) : c.range ? (
                <>{(c.range[0] * 100).toFixed(0)}–{(c.range[1] * 100).toFixed(0)}%<span className="block text-[11px] text-stone">range across individuals</span></>
              ) : (
                <span className="text-stone">remainder; not given separately</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 data text-[11px] text-stone">
        {model.fit && <>Fit {model.fit} · </>}
        {isRange && <>Bar drawn at range midpoints · </>}
        {model.locus}
      </p>
    </div>
  );
}

function label(c: AncestryModel["components"][number]) {
  if (c.proportion !== null) return `${c.atLeast ? "≥" : ""}${Math.round(c.proportion * 100)}%`;
  if (c.range) return `${Math.round(c.range[0] * 100)}–${Math.round(c.range[1] * 100)}%`;
  return "rest";
}

function Trait({ k, v, extra }: { k: string; v: string | null; extra?: string }) {
  return (
    <>
      <dt className="eyebrow pt-0.5">{k}</dt>
      <dd>
        {v ?? <span className="text-stone">Not reported</span>}
        {extra && <span className="block data text-[11px] text-stone mt-0.5">{extra}</span>}
      </dd>
    </>
  );
}
