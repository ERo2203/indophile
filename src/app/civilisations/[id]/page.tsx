import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailShell } from "@/components/DetailShell";
import { MiniMap } from "@/components/map/MiniMap";
import { DateTag, EditorialSection, EntryCard, EntryLink, FactTable, LinkList } from "@/components/ui";
import { entriesOfType, getEntry, related } from "@/lib/db";
import { pointsFor } from "@/lib/mapdata";
import { POLITY_TO_CLIO, CLIOPATRIA_CITATION } from "@/lib/cliopatria";
import { POLITY_KIND, formatYear } from "@/lib/format";

export function generateStaticParams() {
  return entriesOfType("polity").map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = getEntry((await params).id);
  return e ? { title: e.title, description: e.summary } : {};
}

export default async function PolityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getEntry(id);
  if (!p || p.type !== "polity") notFound();

  const relSites = related(id, ["site"]);
  const extentIds = p.extent?.evidence ?? [];
  const mapPoints = pointsFor([...new Set([...extentIds, ...relSites.map((s) => s.id), ...(p.capitals ?? []).map((c) => c.place).filter(Boolean) as string[]])]);
  const hasBoundary = (POLITY_TO_CLIO[id] ?? []).length > 0;
  const people = related(id, ["person"]);
  const studies = related(id, ["study", "concept"]);
  const scripts = related(id, ["script"]);
  const artefacts = related(id, ["artefact"]);
  const isCulture = p.kind === "archaeological-culture" || p.kind === "civilisation";

  // Table of contents from sections
  const toc = p.sections.map((s) => s.heading);

  return (
    <DetailShell
      e={p}
      trail={[["Home", "/"], ["Civilisations & polities", "/civilisations"], [p.title]]}
      kicker={POLITY_KIND[p.kind]}
      relatedTitle={isCulture ? "Sites, evidence and research" : "The wider world of this polity"}
      facts={
        <div className="space-y-8">
          <FactTable
            rows={[
              ["Form", POLITY_KIND[p.kind]],
              ["Chronology", <DateTag key="d" range={p.dates} />],
              ["Structure", p.structure],
              ["Centres", p.capitals?.length ? (
                <span key="c">{p.capitals.map((c, i) => <span key={c.name}>{i > 0 && " · "}{c.place ? <EntryLink id={c.place}>{c.name}</EntryLink> : c.name}{c.note ? <span className="text-stone"> ({c.note})</span> : null}</span>)}</span>
              ) : undefined],
              ["Max. extent", p.extent?.maxExtent ? <DateTag key="m" range={p.extent.maxExtent} /> : undefined],
            ]}
          />
          {toc.length > 1 && (
            <nav aria-label="On this page">
              <p className="eyebrow mb-3">On this page</p>
              <ol className="space-y-1.5 text-sm">
                {toc.map((h) => (
                  <li key={h}><a href={`#${h.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="text-stone hover:text-terracotta">{h}</a></li>
                ))}
              </ol>
            </nav>
          )}
          <LinkList title="Personalities" entries={people} />
          <LinkList title="Scripts & languages" entries={scripts} />
          <LinkList title="Genetic research" entries={studies} />
        </div>
      }
    >
      {mapPoints.length > 0 && (
        <section>
          <p className="rubric mb-2">The Map Check</p>
          <h2 className="h3 mb-2">Geographic extent</h2>
          <p className="text-sm text-stone leading-relaxed mb-5 max-w-3xl">
            {hasBoundary ? (
              <>Largest recorded extent, from <a className="underline" href={CLIOPATRIA_CITATION.repo} target="_blank" rel="noopener noreferrer">Cliopatria</a> (Seshat Global History Databank, CC BY 4.0) — drawn as published. Open the atlas to see how it changed over time. Points are the places Indophile uses to locate the polity.</>
            ) : (
              <>No sourced boundary for this polity is available yet, so none is drawn. Points show the capitals, inscriptions and monuments that locate it.</>
            )}
          </p>
          <MiniMap points={mapPoints} boundaries={hasBoundary ? { year: null, only: [id], largest: true } : null} className="h-[460px]" />
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 data text-[11px] text-stone">
            {hasBoundary && <span><span className="inline-block w-4 h-3 bg-terracotta/50 border border-ink/40 align-middle mr-1.5" />Extent per Cliopatria</span>}
            <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-terracotta align-middle mr-1.5" />Evidence find-spot or major centre</span>
            <Link href={`/atlas?year=${p.extent?.maxExtent?.start ?? p.dates?.start ?? 0}&focus=${p.id}`} className="text-terracotta hover:underline">Open in full atlas →</Link>
          </div>
          {p.extent && ((p.extent.anchors?.length ?? 0) > 0 || (p.extent.zones?.length ?? 0) > 0) && (
            <div className="mt-8">
              <p className="eyebrow mb-3">Places that locate this polity</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b-2 border-ink">
                    <th className="eyebrow py-2 pr-4">Place</th>
                    <th className="eyebrow py-2 pr-4">Role</th>
                    <th className="eyebrow py-2">Counted</th>
                  </tr>
                </thead>
                <tbody>
                  {[...(p.extent.anchors ?? []), ...(p.extent.zones ?? []).flat()].map((x, i) => (
                    <tr key={i} className="border-b rule">
                      <td className="py-2 pr-4 font-display text-lg">{x.name}</td>
                      <td className="py-2 pr-4 text-stone">{x.role}</td>
                      <td className="py-2 data text-[12px]">
                        {x.from !== undefined || x.to !== undefined
                          ? `${x.from !== undefined ? formatYear(x.from) : "start"} – ${x.to !== undefined ? formatYear(x.to) : "end"}`
                          : "whole period"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {p.rulers && p.rulers.length > 0 && (
        <section>
          <p className="rubric mb-2">Rulers & important personalities</p>
          <ol className="border-t rule">
            {p.rulers.map((r) => (
              <li key={r.name} className="grid sm:grid-cols-[1fr_auto] gap-2 py-4 border-b rule">
                <div>
                  <span className="font-display text-xl">{r.person ? <EntryLink id={r.person}>{r.name}</EntryLink> : r.name}</span>
                  {r.note && <p className="text-[13px] text-stone mt-1">{r.note}</p>}
                </div>
                <DateTag range={r.dates} />
              </li>
            ))}
          </ol>
        </section>
      )}

      {p.sections.map((s, i) => <EditorialSection key={i} s={s} dropcap={i === 0} />)}

      {artefacts.length > 0 && (
        <section>
          <p className="rubric mb-2">Material culture</p>
          <h2 className="h3 mb-5">Important artefacts</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {artefacts.map((a) => <EntryCard key={a.id} e={a} />)}
          </div>
        </section>
      )}

      {p.sections.length === 0 && (
        <p className="text-stone italic font-display text-xl">A fuller account of this entity is in preparation. The connected entries below are already in the archive.</p>
      )}
    </DetailShell>
  );
}
