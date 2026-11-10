import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { MiniMap } from "@/components/map/MiniMap";
import { EntryCard, EvidenceBadge, SectionHead, SourceList } from "@/components/ui";
import { allEntries, getSource, hrefFor, sourcesFor } from "@/lib/db";
import { pointsFor } from "@/lib/mapdata";
import { citeLabel, formatYear } from "@/lib/format";
import type { Entry } from "@/lib/types";

export const metadata: Metadata = {
  title: "Deep Time",
  description: "From Jurassic dinosaurs and the Deccan Traps to the Narmada skull cap: the geological and palaeontological record of the Indian subcontinent.",
};

const ERAS: { label: string; from: number; to: number; note: string }[] = [
  { label: "Jurassic", from: -201_000_000, to: -145_000_000, note: "India is part of Gondwana" },
  { label: "Cretaceous", from: -145_000_000, to: -66_000_000, note: "India drifts north; dinosaurs nest in the Narmada region" },
  { label: "Paleogene", from: -66_000_000, to: -23_000_000, note: "Deccan Traps; India meets Asia; the first whales" },
  { label: "Neogene", from: -23_000_000, to: -2_600_000, note: "Himalayan foreland; Siwalik apes" },
  { label: "Pleistocene", from: -2_600_000, to: -11_700, note: "Stone tools, the Narmada hominin, Toba" },
];

function age(y: number) {
  return formatYear(y);
}

export default function DeepTimePage() {
  const all = allEntries();
  const deep = all
    .filter((e) => e.dates && e.dates.start <= -40_000 && (e.type === "site" || e.type === "event"))
    .sort((a, b) => a.dates!.start - b.dates!.start);
  const sites = deep.filter((e) => e.type === "site");
  const sources = [...new Map(deep.flatMap(sourcesFor).map((s) => [s.id, s])).values()];

  return (
    <div>
      <PageHero
        eyebrow="Deep time"
        title="Before history, the rocks."
        intro="The subcontinent's story begins long before people: a fragment of Gondwana carrying dinosaurs north across the ocean, the vast Deccan eruptions, the first whales on the shores of a vanished sea, apes in the Himalayan foreland — and, much later, the first stone tools and the Narmada skull cap."
        image={{ id: "bhimbetka-shelter", caption: "Rock shelters at Bhimbetka, in Vindhyan sandstone." }}
      />

      <section className="container-ind pb-16">
        <div className="grid grid-cols-5 border rule text-[12px]">
          {ERAS.map((e) => (
            <div key={e.label} className="p-4 border-r rule last:border-0 bg-ivory">
              <p className="font-display text-xl">{e.label}</p>
              <p className="data text-[11px] text-stone">{age(e.from)} – {age(e.to)}</p>
              <p className="mt-2 text-stone leading-snug hidden sm:block">{e.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-ind pb-20">
        <SectionHead eyebrow="The Map Check" title="Where the evidence lies" intro="Fossil and early stone-tool sites with published dates. Locations are approximate to the formation or valley." />
        <MiniMap points={pointsFor(sites.map((s) => s.id))} className="h-[480px]" />
      </section>

      <section className="container-ind pb-20">
        <SectionHead eyebrow="Chronology" title="Oldest to youngest" />
        <ol className="relative border-l rule ml-3">
          {deep.map((e) => <Row key={e.id} e={e} />)}
        </ol>
      </section>

      <section className="bg-marble border-y rule py-20">
        <div className="container-ind">
          <SectionHead eyebrow="Sites" title="Fossil and early archaeological sites" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{sites.map((s) => <EntryCard key={s.id} e={s} />)}</div>
        </div>
      </section>

      <section className="container-ind py-20 grid lg:grid-cols-[1fr_1fr] gap-12">
        <div>
          <p className="rubric mb-2">Conclusions</p>
          <h2 className="h2">What deep time tells us</h2>
          <ul className="mt-6 space-y-4 text-[15px] leading-relaxed list-disc pl-5 marker:text-terracotta">
            <li>India&apos;s rocks record a continent&apos;s journey from Gondwana to island and then to collision with Asia: Jurassic sauropods, Cretaceous nesting grounds and the Deccan eruptions at the end of the dinosaur age are all well documented.</li>
            <li>The earliest stages of whale evolution are known largely from Eocene rocks of Pakistan and Jammu.</li>
            <li>Acheulian toolmakers were present by about 1.5–1.2 million years ago (Attirampakkam, Isampur). Older claims from Masol and Riwat remain debated.</li>
            <li>The Narmada skull cap is the only fossil cranium of an archaic (pre-modern) human from South Asia; its age and species are still uncertain.</li>
            <li>Stone-tool sequences at Jwalapuram and Dhaba suggest people lived through the Toba eruption, but who they were — and how they relate to later modern humans — is unresolved.</li>
          </ul>
        </div>
        <div><SourceList sources={sources} /></div>
      </section>
    </div>
  );
}

function Row({ e }: { e: Entry }) {
  const src = e.cite[0] && getSource(e.cite[0].sourceId);
  return (
    <li className="pl-8 pb-8 relative">
      <span className={`absolute -left-[6px] top-2 w-[11px] h-[11px] rounded-full ${e.type === "event" ? "bg-terracotta" : "bg-sage-strong"}`} />
      <p className="data text-terracotta">{e.dates?.label ?? age(e.dates!.start)}</p>
      <Link href={hrefFor(e)} className="font-display text-2xl leading-tight hover:text-terracotta">{e.title}</Link>
      <p className="text-sm text-ink/80 mt-1 max-w-3xl">{e.summary}</p>
      <div className="mt-2 flex items-center gap-3">
        <EvidenceBadge level={e.evidence} />
        {src && <span className="data text-[11px] text-stone">{citeLabel(src.authors, src.year)}</span>}
      </div>
    </li>
  );
}
