import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MiniMap } from "@/components/map/MiniMap";
import { SaveButton } from "@/components/SaveButton";
import { Breadcrumbs, DateTag, EvidenceBadge, Plate, SourceList } from "@/components/ui";
import { TYPE_LABEL, entriesOfType, getEntry, hrefFor, sourcesFor } from "@/lib/db";
import { pointsFor } from "@/lib/mapdata";
import type { Entry } from "@/lib/types";

export function generateStaticParams() {
  return entriesOfType("collection").map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = getEntry((await params).id);
  return e ? { title: e.title, description: e.summary } : {};
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getEntry(id);
  if (!c || c.type !== "collection") notFound();
  const items = c.items.map((i) => ({ ...i, e: getEntry(i.id) })).filter((i): i is typeof i & { e: Entry } => !!i.e);
  const points = pointsFor(items.map((i) => i.e.id));
  const sources = [...new Map(items.flatMap((i) => sourcesFor(i.e)).map((s) => [s.id, s])).values()];

  return (
    <div>
      <header className="container-ind pt-10 pb-14 grid lg:grid-cols-[1fr_1fr] gap-12 items-end">
        <div>
          <Breadcrumbs trail={[["Home", "/"], ["Collections", "/collections"], [c.title]]} />
          <p className="rubric mt-10">Curated collection · {items.length} entries</p>
          <h1 className="h1 mt-4">{c.title}</h1>
          <div className="mt-6 space-y-4 lede text-ink/75">{c.intro.map((p, i) => <p key={i}>{p}</p>)}</div>
          <p className="mt-6 data text-stone">Curated by {c.curator}</p>
          <div className="mt-5"><SaveButton item={{ id: c.id, title: c.title, href: hrefFor(c), type: "Collection" }} /></div>
        </div>
        <Plate image={c.image} aspect="aspect-[4/3]" priority />
      </header>

      <ol className="border-t rule">
        {items.map(({ e, note }, i) => (
          <li key={e.id} className="border-b rule">
            <Link href={hrefFor(e)} className="group container-ind grid md:grid-cols-[5rem_1fr_220px] gap-6 py-10 items-center">
              <span className="font-display text-6xl text-terracotta/40 group-hover:text-terracotta transition-colors leading-none">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="eyebrow">{TYPE_LABEL[e.type]}</span>
                  <DateTag range={e.dates} />
                  <EvidenceBadge level={e.evidence} compact />
                </div>
                <h2 className="font-display text-[2rem] leading-tight mt-2 group-hover:text-terracotta">{e.title}</h2>
                <p className="font-display italic text-xl text-ink/70 mt-1">{note}</p>
                <p className="text-sm text-stone mt-2 max-w-2xl">{e.summary}</p>
              </div>
              {e.image ? <Plate image={e.image} aspect="aspect-[4/3]" showCaption={false} sizes="220px" /> : <span />}
            </Link>
          </li>
        ))}
      </ol>

      {points.length > 1 && (
        <section className="container-ind py-16">
          <p className="rubric mb-2">The Map Check</p>
          <h2 className="h3 mb-5">Places in this collection</h2>
          <MiniMap points={points} className="h-[440px]" labels />
        </section>
      )}

      <div className="container-ind pb-20 max-w-4xl"><SourceList sources={sources} /></div>
    </div>
  );
}
