import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { DateTag, EntryCard, Plate, SectionHead } from "@/components/ui";
import { getEntry, hrefFor, inSubject } from "@/lib/db";
import type { Entry } from "@/lib/types";

export const metadata: Metadata = {
  title: "Architecture, Art & Material Culture",
  description: "Rock art, stupas, cave architecture, temples, sculpture, coins and craft across the subcontinent.",
};

const CATEGORIES: { title: string; ids: string[]; note: string }[] = [
  { title: "Rock art", ids: ["bhimbetka"], note: "Painted shelters from the Mesolithic onward." },
  { title: "Urban architecture", ids: ["mohenjo-daro", "dholavira", "lothal"], note: "Baked brick, dressed stone and water engineering." },
  { title: "Pillars & capitals", ids: ["lion-capital", "lauriya-nandangarh", "prayagraj-pillar"], note: "Polished Mauryan sandstone and later reuse." },
  { title: "Stupas", ids: ["sanchi", "amaravati", "anuradhapura", "taxila"], note: "Relic mounds and their carved railings and gateways." },
  { title: "Cave architecture", ids: ["ajanta", "udayagiri"], note: "Rock-cut monasteries and shrines." },
  { title: "Monastic complexes", ids: ["nalanda", "bodh-gaya"], note: "Brick monasteries, temples and stucco." },
  { title: "Temples", ids: ["thanjavur", "hampi"], note: "From Gupta-period shrines to imperial Chola and Vijayanagara temples." },
  { title: "Sculpture & bronze", ids: ["priest-king", "dancing-girl"], note: "Steatite and lost-wax casting in the Bronze Age." },
  { title: "Seals & coins", ids: ["unicorn-seal", "gupta-coin", "roman-coins-india"], note: "Administration, trade and royal image-making." },
];

const COMPARE: { trad: string; id: string; material: string; form: string }[] = [
  { trad: "Harappan urban", id: "mohenjo-daro", material: "Standardised baked brick; dressed stone at Dholavira", form: "Grid-like streets, drains, wells, platforms" },
  { trad: "Mauryan", id: "maurya", material: "Polished Chunar sandstone; timber", form: "Free-standing pillars with animal capitals; rock-cut chambers" },
  { trad: "Early Buddhist (stupa)", id: "sanchi", material: "Brick core, stone casing, railings and toranas", form: "Hemispherical dome over relics, circumambulatory path" },
  { trad: "Deccan rock-cut", id: "ajanta", material: "Excavated basalt", form: "Chaitya halls and vihara monasteries" },
  { trad: "Chola temple", id: "thanjavur", material: "Granite", form: "Towering vimana over the sanctum; inscribed walls" },
];

export default function ArchitecturePage() {
  const extra = inSubject("art-architecture");
  return (
    <div>
      <PageHero
        eyebrow="Architecture, art & material culture"
        title="What people built, carved and cast."
        intro="Organised by form rather than by dynasty, so that traditions can be compared across regions and centuries. Patrons are named only where an inscription or reliable record establishes them."
        image={{ id: "amaravati", caption: "Relief from Amaravati depicting a stupa." }}
      />

      <section className="container-ind pb-20 space-y-16">
        {CATEGORIES.map((c) => {
          const list = c.ids.map((id) => getEntry(id)).filter((e): e is Entry => !!e);
          if (!list.length) return null;
          return (
            <div key={c.title} className="grid lg:grid-cols-[260px_1fr] gap-8 border-t rule pt-8">
              <div>
                <h2 className="font-display text-3xl">{c.title}</h2>
                <p className="text-sm text-stone mt-2">{c.note}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {list.map((e) => (
                  <Link key={e.id} href={hrefFor(e)} className="group">
                    <Plate image={e.image} aspect="aspect-[4/3]" showCaption={false} sizes="(min-width:1024px) 25vw, 50vw" />
                    <h3 className="font-display text-xl mt-3 group-hover:text-terracotta">{e.title}</h3>
                    <DateTag range={e.dates} />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="bg-night text-paper py-20">
        <div className="container-ind">
          <p className="eyebrow !text-gold mb-3">Comparing traditions</p>
          <h2 className="h2 text-paper mb-10">Materials and forms across periods</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="border-b border-paper/30 text-left">
                  {["Tradition", "Period", "Principal materials", "Characteristic forms"].map((h) => <th key={h} className="eyebrow !text-paper/50 py-3 pr-6">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => {
                  const e = getEntry(r.id);
                  return (
                    <tr key={r.trad} className="border-b border-paper/10 align-top">
                      <td className="py-4 pr-6 font-display text-xl">{e ? <Link href={hrefFor(e)} className="hover:text-gold">{r.trad}</Link> : r.trad}</td>
                      <td className="py-4 pr-6 data text-[12px] text-paper/70">{e?.dates ? <DateTag range={e.dates} className="!text-paper/70" /> : "—"}</td>
                      <td className="py-4 pr-6 text-paper/80">{r.material}</td>
                      <td className="py-4 text-paper/80">{r.form}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container-ind py-20">
        <SectionHead eyebrow="Everything tagged art & architecture" title="From the archive" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{extra.slice(0, 12).map((e) => <EntryCard key={e.id} e={e} />)}</div>
      </section>
    </div>
  );
}
