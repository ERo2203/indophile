import type { Metadata } from "next";
import Link from "next/link";
import { Glyph } from "@/components/Glyph";
import { PageHero } from "@/components/PageHero";
import { DateTag, SectionHead } from "@/components/ui";
import { entriesOfType, getPeriods, hrefFor, inSubject } from "@/lib/db";

export const metadata: Metadata = { title: "Explore", description: "Explore the Indian subcontinent's history by period and by subject." };

export default function ExplorePage() {
  const subjects = entriesOfType("subject");
  const periods = getPeriods();
  return (
    <div>
      <PageHero eyebrow="Explore" title="Many doors, one archive." intro="Every subject and every period opens onto the same connected knowledge base — the sites, people, inscriptions and studies are shared between them." />
      <section className="container-ind pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-rule)] border rule">
          {subjects.map((s) => {
            const n = inSubject(s.id).length;
            return (
              <Link key={s.id} href={hrefFor(s)} className="group bg-parchment hover:bg-ivory p-8 flex gap-6">
                <Glyph name={s.glyph} className="w-10 h-10 shrink-0 text-sage-deep group-hover:text-terracotta" />
                <div>
                  <h2 className="font-display text-[1.7rem] leading-tight group-hover:text-terracotta">{s.title}</h2>
                  <p className="text-sm text-stone mt-1">{s.summary}</p>
                  <p className="data text-[11px] text-stone-light mt-3">{n} entries</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="container-ind pb-16">
        <Link href="/deep-time" className="group flex flex-col md:flex-row md:items-center justify-between gap-4 bg-night text-paper p-8">
          <div>
            <p className="eyebrow !text-gold">Deep time</p>
            <p className="font-display text-3xl mt-1 group-hover:text-gold">Dinosaurs, the Deccan Traps, the first whales and the Narmada skull cap</p>
          </div>
          <span className="data text-paper/70">190 million years ago → 40,000 years ago →</span>
        </Link>
      </section>
      <section className="bg-marble border-y rule py-20">
        <div className="container-ind">
          <SectionHead eyebrow="By period" title="Travel through time" />
          <ol className="grid md:grid-cols-2 gap-x-12">
            {periods.map((p) => (
              <li key={p.id} className="border-b rule">
                <Link href={hrefFor(p)} className="group grid grid-cols-[3rem_1fr] gap-4 py-5">
                  <span className="data text-terracotta pt-1.5">{String(p.order).padStart(2, "0")}</span>
                  <span>
                    <span className="font-display text-2xl group-hover:text-terracotta">{p.title}</span>
                    <span className="block mt-1"><DateTag range={p.dates} /></span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
