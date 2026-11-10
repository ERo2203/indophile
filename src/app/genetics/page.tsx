import type { Metadata } from "next";
import Link from "next/link";
import { AncestryGraph } from "@/components/AncestryGraph";
import { MiniMap } from "@/components/map/MiniMap";
import { EditorialSection, EvidenceBadge, Plate, SectionHead } from "@/components/ui";
import { entriesOfType, hrefFor } from "@/lib/db";
import { routesFor, mapPayload } from "@/lib/mapdata";
import { AncestryCalculator } from "@/components/AncestryCalculator";
import { SPECIMENS } from "@/data/specimens";
import type { PointFeature } from "@/lib/maptypes";

export const metadata: Metadata = {
  title: "Ancient DNA",
  description: "How archaeogenetics contributes to South Asian population history — the studies, the concepts, and the limits of the evidence.",
};

const PRINCIPLES = [
  ["Ancestry is not identity", "Genetic ancestry is never equivalent to ethnic, linguistic, religious, caste or national identity."],
  ["No unchanged descendants", "No present-day community is the direct, unchanged descendant of a single ancient population."],
  ["Observed vs. modelled", "We mark whether a claim comes from sequenced ancient individuals or from statistical models."],
  ["No invented numbers", "We do not re-plot ancestry percentages. Proportions are model-dependent; we link to the study instead."],
];

export default function GeneticsPage() {
  const studies = entriesOfType("study").sort((a, b) => a.year - b.year);
  const concepts = entriesOfType("concept").filter((c) => c.domain === "genetics");
  const samples: PointFeature[] = studies.flatMap((s) =>
    (s.samples ?? []).map((x, i) => ({
      id: `${s.id}-${i}`, title: `${x.label} — ${s.authors.split(",")[0]} ${s.year}`, lat: x.lat, lng: x.lng, layers: ["archaeological"],
      start: 0, end: 0, dateLabel: x.date, precision: "approximate", modern: x.label, country: "", summary: x.note ?? "", href: hrefFor(s), periods: [], related: [],
    })),
  );

  return (
    <div>
      <header className="bg-night text-paper">
        <div className="container-ind grid lg:grid-cols-[1.2fr_1fr] gap-12 py-20 items-end">
          <div>
            <p className="rubric !text-gold">Archaeogenetics & Ancient DNA</p>
            <h1 className="display mt-5 text-paper !text-[clamp(2.75rem,6vw,5.5rem)]">What the DNA says — and what it cannot.</h1>
            <p className="lede mt-6 text-paper/70 max-w-2xl">
              Ancient genomes have transformed the study of South Asia&apos;s population history. They are also easy to misread. This section presents the evidence study by study, with its methods and limits in plain view.
            </p>
          </div>
          <Plate image={{ id: "rakhigarhi", caption: "A Mature Harappan burial at Rakhigarhi, the cemetery that produced the first published Indus-associated genome." }} aspect="aspect-[4/3]" dark />
        </div>
        <div className="border-t border-paper/10">
          <ul className="container-ind grid sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map(([t, d]) => (
              <li key={t} className="py-7 pr-6 sm:border-r border-paper/10 last:border-0">
                <p className="font-display text-xl text-gold">{t}</p>
                <p className="text-sm text-paper/60 mt-1.5 leading-relaxed">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="container-ind py-20">
        <SectionHead eyebrow="Interactive model" title="How published models combine ancestry" intro="A map of relationships, not proportions. Solid links are seen in sequenced ancient individuals; dashed links are statistical models." />
        <AncestryGraph />
      </section>

      <section id="specimens" className="container-ind pb-20 scroll-mt-24">
        <SectionHead
          eyebrow="Specimen database"
          title="Ancestry calculator"
          intro="Each ancient individual, published group or modelled population, with the ancestry models its study fitted and its physical profile. Every figure is transcribed from the publication with its location cited; where a source gives no number, none is shown."
        />
        <AncestryCalculator specimens={SPECIMENS} links={mapPayload().index} />
      </section>

      <section className="bg-marble border-y rule py-20">
        <div className="container-ind">
          <SectionHead eyebrow="Geography of the evidence" title="Where ancient individuals were sampled" intro="Most of the subcontinent has no published ancient genomes. The map shows how thin — and how geographically skewed — the direct evidence still is." />
          <MiniMap points={samples} routes={routesFor(["route-steppe", "route-indus-periphery", "route-asi-formation"])} className="h-[480px]" labels />
          <p className="mt-3 data text-[11px] text-stone">Points: published sampling locations. Dotted green lines: schematic ancestry flows (not migration paths). Selecting a point opens its study.</p>
        </div>
      </section>

      <section className="container-ind py-20">
        <SectionHead eyebrow="Research database" title="The studies" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                <th className="eyebrow py-3 pr-4">Year</th>
                <th className="eyebrow py-3 pr-4">Study</th>
                <th className="eyebrow py-3 pr-4">Evidence type</th>
                <th className="eyebrow py-3 pr-4">Sample</th>
                <th className="eyebrow py-3">Classification</th>
              </tr>
            </thead>
            <tbody>
              {studies.map((s) => (
                <tr key={s.id} className="border-b rule align-top hover:bg-ivory">
                  <td className="py-5 pr-4 data">{s.year}</td>
                  <td className="py-5 pr-4 max-w-md">
                    <Link href={hrefFor(s)} className="font-display text-xl leading-tight hover:text-terracotta">{s.title}</Link>
                    <p className="text-stone text-[13px] mt-1">{s.authors} · <em>{s.journal}</em></p>
                  </td>
                  <td className="py-5 pr-4">
                    <span className={`data text-[11px] px-2 py-0.5 ${s.evidenceType === "direct-ancient-dna" ? "bg-sage-strong text-paper" : s.evidenceType === "mixed" ? "bg-sage-pale text-sage-deep" : "border border-terracotta/50 text-terracotta-deep"}`}>
                      {s.evidenceType === "direct-ancient-dna" ? "Direct ancient DNA" : s.evidenceType === "mixed" ? "Ancient DNA + modelling" : "Present-day DNA modelling"}
                    </span>
                  </td>
                  <td className="py-5 pr-4 text-[13px] text-stone">{s.individuals ?? "—"}</td>
                  <td className="py-5"><EvidenceBadge level={s.evidence} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-sage-pale/40 border-t rule py-20">
        <div className="container-ind">
          <SectionHead eyebrow="Concepts" title="A careful glossary" />
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-14">
            {concepts.map((c) => (
              <div key={c.id} id={c.id} className="scroll-mt-24">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`data text-[11px] px-2 py-0.5 ${c.basis === "direct-ancient-dna" ? "bg-sage-strong text-paper" : "border border-dashed border-terracotta text-terracotta-deep"}`}>
                    {c.basis === "direct-ancient-dna" ? "Observed in ancient genomes" : "Statistical construct"}
                  </span>
                </div>
                <h3 className="h3">{c.title}</h3>
                <p className="text-ink/80 mt-2 leading-relaxed">{c.summary}</p>
                <div className="mt-5">{c.sections.map((s, i) => <EditorialSection key={i} s={s} />)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
