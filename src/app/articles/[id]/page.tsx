import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MiniMap } from "@/components/map/MiniMap";
import { SaveButton } from "@/components/SaveButton";
import { Breadcrumbs, DateTag, EditorialSection, EntryCard, EvidenceBadge, Plate, SourceList } from "@/components/ui";
import { entriesOfType, getEntry, hrefFor, related, sourcesFor } from "@/lib/db";
import { pointsFor } from "@/lib/mapdata";

export function generateStaticParams() {
  return entriesOfType("article").map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = getEntry((await params).id);
  return e && e.type === "article" ? { title: e.title, description: e.standfirst } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = getEntry(id);
  if (!a || a.type !== "article") notFound();
  const periods = (a.periods ?? []).map((p) => getEntry(p)).filter(Boolean);
  const rel = related(id).filter((r) => !["subject", "period", "collection"].includes(r.type));
  const evidenceEntries = rel.filter((r) => r.type === "artefact" || r.type === "site" || r.type === "event").slice(0, 6);
  const moreArticles = entriesOfType("article").filter((x) => x.id !== id).slice(0, 3);
  const points = pointsFor(a.mapEntries ?? []);

  return (
    <article>
      <header className="container-ind pt-10">
        <Breadcrumbs trail={[["Home", "/"], ["Collections", "/collections"], [a.title]]} />
        <div className="max-w-4xl mx-auto text-center mt-14">
          <p className="rubric">{a.subjects?.map((s) => getEntry(s)?.title).filter(Boolean).join(" · ")}</p>
          <h1 className="display mt-5 !text-[clamp(2.6rem,6.5vw,6rem)]">{a.title}</h1>
          <p className="lede mt-8 text-ink/75 max-w-3xl mx-auto">{a.standfirst}</p>
          <dl className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 data text-stone">
            <div><dt className="sr-only">Period</dt><dd><DateTag range={a.dates} /></dd></div>
            <div><dt className="sr-only">Location</dt><dd>◇ {a.region}</dd></div>
            <div><dt className="sr-only">Reading time</dt><dd>{a.readingMinutes} min read</dd></div>
            <div><dt className="sr-only">Author</dt><dd>{a.author}</dd></div>
            <div><dt className="sr-only">Evidence</dt><dd><EvidenceBadge level={a.evidence} /></dd></div>
          </dl>
          <div className="mt-6 flex justify-center"><SaveButton item={{ id: a.id, title: a.title, href: hrefFor(a), type: "Article" }} /></div>
        </div>
        <Plate image={a.image} priority aspect="aspect-[21/9]" className="mt-14" sizes="100vw" />
      </header>

      <div className="container-ind grid lg:grid-cols-[200px_minmax(0,1fr)_200px] gap-10 py-16">
        <nav aria-label="In this article" className="hidden lg:block self-start sticky top-24">
          <p className="eyebrow mb-3">In this article</p>
          <ol className="space-y-2 text-[13px]">
            {a.sections.map((s, i) => (
              <li key={i}><a href={`#${s.heading.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="text-stone hover:text-terracotta">{s.heading}</a></li>
            ))}
            <li><a href="#sources" className="text-stone hover:text-terracotta">Sources</a></li>
          </ol>
        </nav>

        <div className="max-w-[44rem] mx-auto w-full space-y-14">
          {a.sections.map((s, i) => (
            <EditorialSection key={i} s={s} dropcap={i === 0}>
              {s.kind === "map-check" && points.length > 0 && (
                <div className="mt-6">
                  <MiniMap points={points} className="h-[400px]" />
                  <p className="mt-2 data text-[10px] text-stone">Select a site to open its record.</p>
                </div>
              )}
            </EditorialSection>
          ))}

          {evidenceEntries.length > 0 && (
            <section>
              <p className="rubric mb-2">Archaeological evidence</p>
              <h2 className="h3 mb-6">Sites, artefacts and events in this story</h2>
              <div className="grid sm:grid-cols-2 gap-5">{evidenceEntries.map((e) => <EntryCard key={e.id} e={e} />)}</div>
            </section>
          )}

          <SourceList sources={sourcesFor(a)} />
        </div>

        <aside className="hidden lg:block self-start sticky top-24 space-y-6">
          {periods.length > 0 && (
            <div>
              <p className="eyebrow mb-2">Period</p>
              {periods.map((p) => <Link key={p!.id} href={hrefFor(p!)} className="block font-display text-lg hover:text-terracotta">{p!.title}</Link>)}
            </div>
          )}
          <div>
            <p className="eyebrow mb-2">Connected entries</p>
            <ul className="space-y-1.5 text-[13px]">
              {rel.slice(0, 10).map((r) => <li key={r.id}><Link href={hrefFor(r)} className="hover:text-terracotta link-ind">{r.title}</Link></li>)}
            </ul>
          </div>
        </aside>
      </div>

      <section className="bg-marble border-t rule py-16">
        <div className="container-ind">
          <p className="eyebrow mb-2">Keep reading</p>
          <h2 className="h3 mb-6">Related articles</h2>
          <div className="grid md:grid-cols-3 gap-6">{moreArticles.map((e) => <EntryCard key={e.id} e={e} />)}</div>
        </div>
      </section>
    </article>
  );
}
