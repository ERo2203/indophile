import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailShell } from "@/components/DetailShell";
import { MiniMap } from "@/components/map/MiniMap";
import { ArrowLink, CompactRow, EditorialSection, EntryCard, FactTable, DateTag } from "@/components/ui";
import { getEntry, getPeriods, hrefFor, inPeriod } from "@/lib/db";
import { pointsFor } from "@/lib/mapdata";
import { PRECISION, formatYear } from "@/lib/format";
import { CONCLUSIONS } from "@/data/conclusions";

export function generateStaticParams() {
  return getPeriods().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = getEntry((await params).id);
  return e ? { title: e.title, description: e.summary } : {};
}

export default async function PeriodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getEntry(id);
  if (!p || p.type !== "period") notFound();
  const all = getPeriods();
  const idx = all.findIndex((x) => x.id === id);
  const prev = all[idx - 1], next = all[idx + 1];

  const sites = inPeriod(id, ["site"]);
  const polities = inPeriod(id, ["polity"]);
  const people = inPeriod(id, ["person"]);
  const events = inPeriod(id, ["event"]).sort((a, b) => (a.dates?.start ?? 0) - (b.dates?.start ?? 0));
  const artefacts = inPeriod(id, ["artefact", "script", "study", "article"]);
  const midYear = Math.round(((p.dates?.start ?? 0) + (p.dates?.end ?? p.dates?.start ?? 0)) / 2);
  const atlasYear = Math.max(midYear, -10000);

  return (
    <DetailShell
      e={p}
      trail={[["Home", "/"], ["Timeline", "/timeline"], [p.title]]}
      kicker={`Period ${String(p.order).padStart(2, "0")} of ${all.length}`}
      heroWide
      facts={
        <div>
          <FactTable
            rows={[
              ["Dates", <DateTag key="d" range={p.dates} />],
              ["Dating", p.dates ? `${PRECISION[p.dates.precision].label}. ${p.dates.note ?? ""}` : undefined],
              ["Build phase", p.phase === 4 ? "Phase 4 — in preparation" : "Phase 2 — comprehensive"],
              ["Mapped places", String(sites.length)],
            ]}
          />
          <ArrowLink href={`/atlas?year=${atlasYear}`} className="mt-6">Open this moment in the atlas</ArrowLink>
        </div>
      }
    >
      {p.phase === 4 && (
        <div className="border-l-2 border-gold bg-ivory p-6">
          <p className="rubric !text-gold">In preparation</p>
          <p className="mt-2 text-sm text-ink/80 leading-relaxed">
            This period is framed but not yet fully populated. Indophile is being built in phases, starting with prehistory through the classical period. Entries below are those already in the archive.
          </p>
        </div>
      )}

      <section>
        <p className="rubric mb-3">Major developments</p>
        <ol className="grid sm:grid-cols-2 gap-px bg-[var(--color-rule)] border rule">
          {p.developments.map((d, i) => (
            <li key={d} className="bg-parchment p-5 flex gap-4">
              <span className="data text-terracotta">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[15px] leading-relaxed">{d}</span>
            </li>
          ))}
        </ol>
      </section>

      {sites.length > 0 && (
        <section>
          <p className="rubric mb-2">The Map Check</p>
          <h2 className="h3 mb-5">Where this period happened</h2>
          <MiniMap points={pointsFor(sites.map((s) => s.id))} boundaries={{ year: atlasYear }} className="h-[440px]" />
          <p className="mt-2 data text-[11px] text-stone">Click a point to open its record. Boundaries at {formatYear(atlasYear)} from Cliopatria (Seshat), CC BY 4.0.</p>
        </section>
      )}

      {(p.sections ?? []).map((s, i) => <EditorialSection key={i} s={s} />)}

      {polities.length > 0 && (
        <section>
          <p className="rubric mb-2">Polities & cultures</p>
          <h2 className="h3 mb-6">Civilisations, kingdoms and republics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{polities.map((e) => <EntryCard key={e.id} e={e} />)}</div>
        </section>
      )}

      {sites.length > 0 && (
        <section>
          <p className="rubric mb-2">From the trenches</p>
          <h2 className="h3 mb-6">Archaeological sites</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{sites.slice(0, 9).map((e) => <EntryCard key={e.id} e={e} />)}</div>
          {sites.length > 9 && <div className="mt-4">{sites.slice(9).map((e) => <CompactRow key={e.id} e={e} />)}</div>}
        </section>
      )}

      {events.length > 0 && (
        <section>
          <p className="rubric mb-2">Chronology</p>
          <h2 className="h3 mb-4">Events</h2>
          {events.map((e) => <CompactRow key={e.id} e={e} />)}
        </section>
      )}

      {(people.length > 0 || artefacts.length > 0) && (
        <section className="grid md:grid-cols-2 gap-10">
          {people.length > 0 && (
            <div>
              <h2 className="h3 mb-4">People</h2>
              {people.map((e) => <CompactRow key={e.id} e={e} />)}
            </div>
          )}
          {artefacts.length > 0 && (
            <div>
              <h2 className="h3 mb-4">Artefacts, scripts & research</h2>
              {artefacts.map((e) => <CompactRow key={e.id} e={e} />)}
            </div>
          )}
        </section>
      )}

      {CONCLUSIONS[id] && (
        <section className="grid md:grid-cols-2 gap-px bg-[var(--color-rule)] border rule">
          <div className="bg-ivory p-7">
            <p className="rubric mb-2">Conclusions</p>
            <h2 className="h3 mb-4">What the evidence supports</h2>
            <ul className="space-y-3 text-[15px] leading-relaxed list-disc pl-5 marker:text-sage-deep">
              {CONCLUSIONS[id].known.map((k) => <li key={k}>{k}</li>)}
            </ul>
          </div>
          <div className="bg-night text-paper/85 p-7">
            <p className="rubric !text-gold mb-2">Still open</p>
            <h2 className="h3 text-paper mb-4">What we still don&apos;t know</h2>
            <ul className="space-y-3 text-[15px] leading-relaxed list-disc pl-5 marker:text-gold">
              {CONCLUSIONS[id].open.map((k) => <li key={k}>{k}</li>)}
            </ul>
          </div>
        </section>
      )}

      {id === "prehistory" && (
        <Link href="/deep-time" className="group block bg-sage-pale/60 border border-sage/40 p-6">
          <p className="eyebrow !text-sage-deep">Go further back</p>
          <p className="font-display text-2xl mt-1 group-hover:text-terracotta">Deep time: dinosaurs, the Deccan Traps and the Narmada skull cap →</p>
        </Link>
      )}

      <nav className="grid grid-cols-2 gap-4 border-t rule pt-8" aria-label="Adjacent periods">
        {prev ? (
          <Link href={hrefFor(prev)} className="group">
            <span className="eyebrow">← Previous</span>
            <span className="block font-display text-xl group-hover:text-terracotta">{prev.title}</span>
          </Link>
        ) : <span />}
        {next && (
          <Link href={hrefFor(next)} className="group text-right">
            <span className="eyebrow">Next →</span>
            <span className="block font-display text-xl group-hover:text-terracotta">{next.title}</span>
          </Link>
        )}
      </nav>
    </DetailShell>
  );
}
