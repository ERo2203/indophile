import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailShell } from "@/components/DetailShell";
import { MiniMap } from "@/components/map/MiniMap";
import { FactTable, LinkList } from "@/components/ui";
import { entriesOfType, getEntry, related } from "@/lib/db";
import type { PointFeature } from "@/lib/maptypes";

export function generateStaticParams() {
  return entriesOfType("study").map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = getEntry((await params).id);
  return e ? { title: e.title, description: e.summary } : {};
}

const EV_LABEL = {
  "direct-ancient-dna": "Direct ancient DNA",
  "modern-dna-modelling": "Modelling of present-day DNA",
  mixed: "Ancient DNA with statistical modelling",
};

export default async function StudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getEntry(id);
  if (!s || s.type !== "study") notFound();
  const points: PointFeature[] = (s.samples ?? []).map((x, i) => ({
    id: `${s.id}-${i}`, title: x.label, lat: x.lat, lng: x.lng, layers: ["archaeological"], start: 0, end: 0,
    dateLabel: x.date, precision: "approximate", modern: x.label, country: "", summary: x.note ?? "", href: "#", periods: [], related: [],
  }));

  const block = (title: string, items: string[] | undefined, tone: "plain" | "warn" = "plain", rubric?: string) =>
    items && items.length > 0 ? (
      <section className={tone === "warn" ? "bg-night text-paper/85 px-6 sm:px-10 py-10" : ""}>
        {rubric && <p className={`rubric mb-2 ${tone === "warn" ? "!text-gold" : ""}`}>{rubric}</p>}
        <h2 className={`h3 mb-5 ${tone === "warn" ? "text-paper" : ""}`}>{title}</h2>
        <ol className="space-y-4">
          {items.map((t, i) => (
            <li key={i} className="grid grid-cols-[2rem_1fr] gap-2 leading-relaxed">
              <span className={`data ${tone === "warn" ? "text-gold" : "text-terracotta"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </section>
    ) : null;

  return (
    <DetailShell
      e={s}
      trail={[["Home", "/"], ["Ancient DNA", "/genetics"], [`${s.authors.split(",")[0]} ${s.year}`]]}
      kicker={`Genetic study · ${s.journal} ${s.year}`}
      facts={
        <div className="space-y-8">
          <FactTable
            rows={[
              ["Authors", s.authors],
              ["Year", String(s.year)],
              ["Journal", <em key="j">{s.journal}</em>],
              ["DOI", s.doi ? <a key="doi" className="data text-terracotta hover:underline break-all" href={`https://doi.org/${s.doi}`} target="_blank" rel="noopener noreferrer">{s.doi} ↗</a> : undefined],
              ["Institutions", s.institutions?.join("; ")],
              ["Region", s.region],
              ["Sample dates", s.sampleDates],
              ["Individuals", s.individuals],
              ["Evidence type", EV_LABEL[s.evidenceType]],
            ]}
          />
          <LinkList title="Related studies & concepts" entries={related(id, ["study", "concept"])} />
          <LinkList title="Archaeological context" entries={related(id, ["site", "polity"])} />
        </div>
      }
    >
      <div className="border-l-2 border-sage bg-sage-pale/40 p-5 text-sm leading-relaxed">
        <p className="eyebrow !text-sage-deep mb-1">Reading note</p>
        Genetic ancestry described here refers to statistical relationships between sampled genomes. It does not map onto any present-day ethnic, linguistic, religious, caste or national identity.
      </div>
      {block("Research methodology", s.method, "plain", "Method")}
      {block("Main findings", s.findings, "plain", "What the DNA says")}
      {block("Limitations", s.limitations, "warn", "What we still don't know")}
      {block("Subsequent research and competing interpretations", s.laterWork, "plain", "After publication")}
      {points.length > 0 && (
        <section>
          <p className="rubric mb-2">Geographic distribution</p>
          <h2 className="h3 mb-5">Sampled individuals</h2>
          <MiniMap points={points} className="h-[360px]" labels />
        </section>
      )}
    </DetailShell>
  );
}
