import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { EntryCard, Plate, SectionHead } from "@/components/ui";
import { entriesOfType, hrefFor } from "@/lib/db";

export const metadata: Metadata = { title: "Collections", description: "Curated reading paths and long-form articles." };

export default function CollectionsPage() {
  const collections = entriesOfType("collection");
  const articles = entriesOfType("article");
  return (
    <div>
      <PageHero eyebrow="Themed editorial collections" title="Curated, not generated." intro="Collections are assembled by editors from articles, sites, studies, artefacts and timeline entries — reading paths through the archive." />
      <section className="container-ind pb-20 grid md:grid-cols-2 gap-8">
        {collections.map((c) => (
          <Link key={c.id} href={hrefFor(c)} className="group grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 border-t rule pt-6">
            <Plate image={c.image} aspect="aspect-[4/5]" showCaption={false} sizes="25vw" />
            <div>
              <p className="eyebrow">{c.items.length} entries</p>
              <h2 className="font-display text-[1.9rem] leading-tight mt-2 group-hover:text-terracotta">{c.title}</h2>
              <p className="text-sm text-stone mt-3">{c.summary}</p>
              <p className="data text-[11px] text-stone-light mt-4">Curated by {c.curator}</p>
            </div>
          </Link>
        ))}
      </section>
      <section className="bg-marble border-t rule py-20">
        <div className="container-ind">
          <SectionHead eyebrow="Articles" title="Long reads" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">{articles.map((a) => <EntryCard key={a.id} e={a} />)}</div>
        </div>
      </section>
    </div>
  );
}
