import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Glyph } from "@/components/Glyph";
import { MiniMap } from "@/components/map/MiniMap";
import { Breadcrumbs, EntryCard } from "@/components/ui";
import { TYPE_LABEL, entriesOfType, getEntry, inSubject } from "@/lib/db";
import { pointsFor } from "@/lib/mapdata";
import type { EntryType } from "@/lib/types";

export function generateStaticParams() {
  return entriesOfType("subject").map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = getEntry((await params).id);
  return e ? { title: e.title, description: e.summary } : {};
}

const ORDER: EntryType[] = ["article", "polity", "site", "artefact", "study", "concept", "script", "person", "event", "route", "collection"];

export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getEntry(id);
  if (!s || s.type !== "subject") notFound();
  const entries = inSubject(id);
  const groups = ORDER.map((t) => [t, entries.filter((e) => e.type === t)] as const).filter(([, l]) => l.length);
  const points = pointsFor(entries.filter((e) => e.type === "site").map((e) => e.id));

  return (
    <div>
      <header className="container-ind pt-10 pb-14">
        <Breadcrumbs trail={[["Home", "/"], ["Explore", "/explore"], [s.title]]} />
        <div className="mt-10 flex items-start gap-8">
          <Glyph name={s.glyph} className="hidden sm:block w-20 h-20 text-terracotta shrink-0" />
          <div className="max-w-3xl">
            <p className="rubric">Subject</p>
            <h1 className="display mt-4 !text-[clamp(2.6rem,6vw,5rem)]">{s.title}</h1>
            <p className="lede mt-5 text-ink/75">{s.summary}</p>
            <p className="mt-4 data text-stone">{entries.length} connected entries</p>
          </div>
        </div>
      </header>
      {points.length > 1 && (
        <div className="container-ind pb-12"><MiniMap points={points} className="h-[380px]" /></div>
      )}
      <div className="container-ind pb-24 space-y-16">
        {groups.map(([t, list]) => (
          <section key={t}>
            <h2 className="eyebrow mb-5 border-b rule pb-3">{TYPE_LABEL[t]}s · {list.length}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{list.map((e) => <EntryCard key={e.id} e={e} />)}</div>
          </section>
        ))}
        {groups.length === 0 && <p className="font-display text-2xl text-stone">Entries for this subject are in preparation.</p>}
      </div>
    </div>
  );
}
