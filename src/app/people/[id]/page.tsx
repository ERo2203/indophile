import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailShell } from "@/components/DetailShell";
import { MiniMap } from "@/components/map/MiniMap";
import { DateTag, FactTable, LinkList } from "@/components/ui";
import { entriesOfType, getEntry, related } from "@/lib/db";
import { pointsFor } from "@/lib/mapdata";

export function generateStaticParams() {
  return entriesOfType("person").map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = getEntry((await params).id);
  return e ? { title: e.title, description: e.summary } : {};
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getEntry(id);
  if (!p || p.type !== "person") notFound();
  const places = related(id, ["site"]);
  return (
    <DetailShell
      e={p}
      trail={[["Home", "/"], ["Personalities", "/people"], [p.title]]}
      kicker={p.roles.join(" · ")}
      facts={
        <div className="space-y-8">
          <FactTable rows={[["Roles", p.roles.join(", ")], ["Dates", <DateTag key="d" range={p.dates} />]]} />
          <LinkList title="Contemporary polities" entries={related(id, ["polity"])} />
          <LinkList title="Related people" entries={related(id, ["person"])} />
          <LinkList title="Related events" entries={related(id, ["event"])} />
        </div>
      }
    >
      <section>
        <p className="rubric mb-2">Biography</p>
        <div className="prose-ind max-w-3xl">
          {p.biography.map((b, i) => <p key={i} className={i === 0 ? "dropcap" : ""}>{b}</p>)}
        </div>
      </section>

      {p.contributions && (
        <section>
          <h2 className="h3 mb-4">Important contributions</h2>
          <ul className="space-y-2 list-disc pl-5 marker:text-terracotta">{p.contributions.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>
      )}

      {p.primarySources && (
        <section>
          <p className="rubric mb-2">The Historical Record</p>
          <h2 className="h3 mb-4">Primary sources</h2>
          <ul className="space-y-2 list-disc pl-5 marker:text-terracotta">{p.primarySources.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>
      )}

      {p.debates && (
        <section className="bg-night text-ivory/85 px-6 sm:px-10 py-10">
          <p className="rubric !text-gold mb-2">What We Still Don&apos;t Know</p>
          <h2 className="h3 text-ivory mb-4">Historical debates</h2>
          <ul className="space-y-3 list-disc pl-5 marker:text-gold">{p.debates.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>
      )}

      {places.length > 0 && (
        <section>
          <p className="rubric mb-2">The Map Check</p>
          <h2 className="h3 mb-5">Geographic associations</h2>
          <MiniMap points={pointsFor(places.map((x) => x.id))} className="h-[360px]" />
        </section>
      )}
    </DetailShell>
  );
}
