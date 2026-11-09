import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailShell } from "@/components/DetailShell";
import { DateTag, EntryLink, FactTable } from "@/components/ui";
import { entriesOfType, getEntry } from "@/lib/db";

export function generateStaticParams() {
  return entriesOfType("artefact").map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = getEntry((await params).id);
  return e ? { title: e.title, description: e.summary } : {};
}

export default async function ArtefactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = getEntry(id);
  if (!a || a.type !== "artefact") notFound();
  return (
    <DetailShell
      e={a}
      trail={[["Home", "/"], ["Archaeology", "/archaeology"], ["Artefacts", "/archaeology#artefacts"], [a.title]]}
      kicker="Artefact"
      facts={
        <FactTable
          rows={[
            ["Material", a.material],
            ["Date", <DateTag key="d" range={a.dates} />],
            ["Found at", a.foundAt ? <EntryLink key="f" id={a.foundAt} /> : a.findspot],
            ["Findspot", a.foundAt ? a.findspot : undefined],
            ["Collection", a.collection],
            ["Dimensions", a.dimensions],
            ["Provenance", a.provenance],
          ]}
        />
      }
    >
      <section>
        <p className="rubric mb-2">Historical interpretation</p>
        <h2 className="h3 mb-5">What the object tells us — and what it doesn&apos;t</h2>
        <div className="prose-ind max-w-3xl">
          {a.interpretation.map((p, i) => <p key={i} className={i === 0 ? "dropcap" : ""}>{p}</p>)}
        </div>
      </section>
    </DetailShell>
  );
}
