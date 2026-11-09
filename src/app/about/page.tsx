import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ArrowLink, Plate } from "@/components/ui";
import { allEntries, allSources, getSites } from "@/lib/db";

export const metadata: Metadata = { title: "About Indophile" };

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About Indophile"
        title={<>Thousands of years. Countless stories. <em className="text-terracotta">One subcontinent.</em></>}
        intro="Indophile is a digital knowledge platform for the history, archaeology, archaeogenetics, geography, languages, religions and material culture of the Indian subcontinent — built as one interconnected, evidence-driven database."
        image={{ id: "bhimbetka", caption: "Painted rock surface, Bhimbetka." }}
      />
      <div className="container-ind pb-24 grid lg:grid-cols-[1fr_1fr] gap-16">
        <div className="prose-ind space-y-5">
          <p className="dropcap">
            Most of what we know about the deep past of South Asia comes not from chronicles but from evidence in the ground: a stone tool in a river terrace, a seal in a drain, an edict on a boulder, a genome from a cemetery. Indophile is built around that evidence.
          </p>
          <p>
            The atlas, the timeline, the encyclopedia and the research archive are not separate sections. They are different windows onto a single database in which a site knows its civilisation, an inscription knows its ruler, and a genetic study knows the excavation its samples came from.
          </p>
          <p>
            The platform covers present-day India, Pakistan, Bangladesh, Nepal, Bhutan, Sri Lanka and the Maldives, with the historical connections to Afghanistan and Central Asia that the evidence demands. Modern borders appear for orientation only.
          </p>
          <p>
            We aim to be neutral and evidence-driven: competing interpretations are presented as such, traditional accounts are respected and labelled, and nothing is invented to fill a gap.
          </p>
          <div className="flex flex-wrap gap-6 pt-4">
            <ArrowLink href="/methodology">Editorial standards</ArrowLink>
            <ArrowLink href="/sources">Bibliography</ArrowLink>
          </div>
        </div>
        <div className="space-y-10">
          <dl className="grid grid-cols-3 border-y rule divide-x rule">
            {[[allEntries().length, "Entries"], [getSites().length, "Places"], [allSources().length, "Sources"]].map(([n, l]) => (
              <div key={l as string} className="py-6 px-4"><dt className="eyebrow">{l}</dt><dd className="font-display text-4xl">{n}</dd></div>
            ))}
          </dl>
          <div>
            <p className="rubric mb-4">Build phases</p>
            <ol className="space-y-4">
              {[
                ["Phase 1 — Foundation", "Brand, homepage, navigation, timeline, atlas, article template, search, structured database.", true],
                ["Phase 2 — Historical content", "Prehistory; Indus civilisation; Iron Age and Mahajanapadas; Mauryan and classical period.", true],
                ["Phase 3 — Specialised knowledge", "Archaeogenetics database, migration visualisations, scripts, architecture, trade networks, artefact archive.", "partial"],
                ["Phase 4 — Expansion", "Medieval, early modern, colonial and modern history; advanced layers; user collections; community contributions.", false],
              ].map(([t, d, s]) => (
                <li key={t as string} className="grid grid-cols-[1.5rem_1fr] gap-3">
                  <span className={`mt-1.5 w-3 h-3 rounded-full border-2 ${s === true ? "bg-sage-deep border-sage-deep" : s === "partial" ? "border-sage-deep [background:linear-gradient(90deg,var(--color-sage-deep)_50%,transparent_50%)]" : "border-stone-light"}`} />
                  <div><p className="font-display text-xl">{t}</p><p className="text-sm text-stone">{d}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <Plate image={{ id: "girnar", caption: "The building that shelters the Junagadh rock, which carries Mauryan, Western Kshatrapa and Gupta inscriptions." }} aspect="aspect-[16/10]" />
          <p className="text-sm text-stone">Questions or corrections? Every entry shows its sources; corrections should cite evidence. See <Link className="underline" href="/methodology">how we classify evidence</Link>.</p>
        </div>
      </div>
    </div>
  );
}
