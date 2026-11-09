import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SiteArchive } from "@/components/SiteArchive";
import { EntryCard, SectionHead } from "@/components/ui";
import { entriesOfType, getPeriods } from "@/lib/db";
import { mapPayload } from "@/lib/mapdata";

export const metadata: Metadata = {
  title: "Archaeology & Excavation Archive",
  description: "A searchable archaeological atlas of the Indian subcontinent: sites, excavations, dating and artefacts.",
};

export default function ArchaeologyPage() {
  const artefacts = entriesOfType("artefact");
  return (
    <div>
      <PageHero
        eyebrow="Archaeology & excavation archive"
        title="The trench is the archive."
        intro="Every site with its coordinates, excavators, dating methods and finds — searchable, filterable and mapped. Where a location or date is uncertain, the record says so."
        image={{ id: "great-bath", caption: "The Great Bath, Mohenjo-daro." }}
      />
      <section className="container-ind pb-20">
        <SiteArchive points={mapPayload().points} periods={getPeriods().map((p) => ({ id: p.id, title: p.title }))} />
      </section>
      <section id="artefacts" className="bg-marble border-y rule py-20 scroll-mt-16">
        <div className="container-ind">
          <SectionHead eyebrow="Artefact archive" title="Objects, one at a time" intro="Material, date, findspot, present collection and what the object can — and cannot — tell us." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{artefacts.map((a) => <EntryCard key={a.id} e={a} />)}</div>
        </div>
      </section>
    </div>
  );
}
