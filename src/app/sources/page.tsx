import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { allSources, citingEntries, hrefFor } from "@/lib/db";
import type { SourceKind } from "@/lib/types";

export const metadata: Metadata = { title: "Sources & Bibliography" };

const KIND_LABEL: Record<SourceKind, string> = {
  "journal-article": "Peer-reviewed articles",
  book: "Books & syntheses",
  "excavation-report": "Excavation reports",
  "primary-source": "Primary sources in translation",
  "inscription-corpus": "Inscription corpora",
  unesco: "UNESCO World Heritage records",
  "museum-record": "Museum records",
  institutional: "Institutional publications",
};

export default function SourcesPage() {
  const sources = allSources();
  const kinds = Object.keys(KIND_LABEL) as SourceKind[];
  return (
    <div>
      <PageHero eyebrow="Sources & bibliography" title="The shelf behind the site." intro={`${sources.length} records, each reused across every entry that relies on it. Select a record to see what cites it.`}>
        <nav className="mt-8 flex flex-wrap gap-2">
          {kinds.filter((k) => sources.some((s) => s.kind === k)).map((k) => (
            <a key={k} href={`#${k}`} className="data text-[11px] border rule px-2.5 py-1 hover:border-terracotta">{KIND_LABEL[k]}</a>
          ))}
        </nav>
      </PageHero>
      <div className="container-ind pb-24 space-y-16">
        {kinds.map((k) => {
          const list = sources.filter((s) => s.kind === k);
          if (!list.length) return null;
          return (
            <section key={k} id={k} className="scroll-mt-24">
              <h2 className="h3 border-b-2 border-ink pb-3">{KIND_LABEL[k]} <span className="data text-stone text-sm ml-2">{list.length}</span></h2>
              <ol>
                {list.map((s) => {
                  const cited = citingEntries(s.id);
                  return (
                    <li key={s.id} id={`src-${s.id}`} className="grid lg:grid-cols-[1fr_320px] gap-4 lg:gap-10 py-5 border-b rule scroll-mt-24">
                      <p className="leading-relaxed">
                        {s.authors} ({s.year}). <em className="font-display text-[1.1rem]">{s.title}</em>
                        {s.container && <>. {s.container}</>}{s.publisher && <>. {s.publisher}</>}.
                        {s.doi && <> <a href={`https://doi.org/${s.doi}`} className="data text-terracotta hover:underline" target="_blank" rel="noopener noreferrer">doi:{s.doi}</a></>}
                        {s.url && <> <a href={s.url} className="data text-terracotta hover:underline" target="_blank" rel="noopener noreferrer">{s.url.replace(/^https?:\/\//, "")}</a></>}
                        {!s.verified && <span className="ml-2 data text-[11px] text-terracotta border border-terracotta/40 px-1">record unverified</span>}
                      </p>
                      <details className="text-[13px]">
                        <summary className="cursor-pointer data text-stone hover:text-ink">Cited by {cited.length} entr{cited.length === 1 ? "y" : "ies"}</summary>
                        <ul className="mt-2 space-y-1">
                          {cited.map((e) => <li key={e.id}><Link href={hrefFor(e)} className="hover:text-terracotta link-ind">{e.title}</Link></li>)}
                        </ul>
                      </details>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
