import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailShell } from "@/components/DetailShell";
import { MiniMap } from "@/components/map/MiniMap";
import { ArrowLink, DateTag, EditorialSection, EntryCard, FactTable, LinkList } from "@/components/ui";
import { getEntry, getSites, related } from "@/lib/db";
import { pointsFor } from "@/lib/mapdata";

export function generateStaticParams() {
  return getSites().map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = getEntry((await params).id);
  return e ? { title: e.title, description: e.summary } : {};
}

function dms(v: number, pos: string, neg: string) {
  const a = Math.abs(v), d = Math.floor(a), m = Math.round((a - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}′${v >= 0 ? pos : neg}`;
}

export default async function SitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getEntry(id);
  if (!s || s.type !== "site") notFound();

  const nearby = getSites()
    .filter((x) => x.id !== id)
    .map((x) => ({ x, d: Math.hypot(x.place.lat - s.place.lat, (x.place.lng - s.place.lng) * Math.cos((s.place.lat * Math.PI) / 180)) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 5)
    .map((o) => o.x);
  const artefacts = related(id, ["artefact"]);
  const polities = related(id, ["polity"]);
  const studies = related(id, ["study"]);
  const people = related(id, ["person"]);

  return (
    <DetailShell
      e={s}
      trail={[["Home", "/"], ["Archaeology", "/archaeology"], [s.title]]}
      kicker={s.layers.includes("battle") ? "Battle location" : s.layers.includes("inscription") && !s.layers.includes("archaeological") ? "Inscription site" : "Archaeological site"}
      relatedTitle="Connected to this site"
      facts={
        <div className="space-y-8">
          <FactTable
            rows={[
              ["Coordinates", (
                <span key="c" className="data inline-flex items-center gap-1.5">
                  {dms(s.place.lat, "N", "S")} {dms(s.place.lng, "E", "W")}{s.place.approximate ? " (approx.)" : ""}
                  <a
                    href={`https://www.google.com/maps/place/${s.place.lat},${s.place.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terracotta hover:opacity-70"
                    aria-label="Open in Google Maps"
                    title="Open in Google Maps"
                  >
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                  </a>
                </span>
              )],
              ["Present-day", `${s.place.modern}, ${s.place.country}`],
              ["Period", <DateTag key="d" range={s.dates} />],
              ["Culture", s.culture],
              ["Discovered", s.discovered ? [s.discovered.year, s.discovered.by].filter(Boolean).join(" — ") + (s.discovered.note ? `. ${s.discovered.note}` : "") : undefined],
              ["Dating methods", s.datingMethods?.join(", ")],
              ["UNESCO", s.unesco ? <a key="u" className="text-terracotta hover:underline" href={`https://whc.unesco.org/en/list/${s.unesco.id}`} target="_blank" rel="noopener noreferrer">World Heritage, {s.unesco.year} ↗</a> : undefined],
            ]}
          />
          <LinkList title="Associated civilisation / polity" entries={polities} />
          <LinkList title="People" entries={people} />
          <LinkList title="Genetic research" entries={studies} />
          <ArrowLink href={`/atlas?all=1&focus=${s.id}`}>Show on the atlas</ArrowLink>
        </div>
      }
    >
      <section>
        <p className="rubric mb-2">The Map Check</p>
        <h2 className="h3 mb-5">Location and neighbouring sites</h2>
        <MiniMap points={pointsFor([s.id, ...nearby.map((n) => n.id)])} highlight={s.id} className="h-[380px]" />
      </section>

      {s.excavations && s.excavations.length > 0 && (
        <section>
          <p className="rubric mb-2">From the Trenches</p>
          <h2 className="h3 mb-5">Excavation history</h2>
          <ol className="relative border-l rule ml-2">
            {s.excavations.map((x) => (
              <li key={x.years + x.by} className="pl-6 pb-6 relative">
                <span className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] bg-terracotta rounded-full" />
                <p className="data text-terracotta">{x.years}</p>
                <p className="font-display text-xl leading-snug">{x.by}</p>
                {x.institution && <p className="text-sm text-stone">{x.institution}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {s.findings && s.findings.length > 0 && (
        <section>
          <h2 className="h3 mb-5">Important findings</h2>
          <ul className="grid sm:grid-cols-2 gap-px bg-[var(--color-rule)] border rule">
            {s.findings.map((f) => <li key={f} className="bg-parchment p-4 text-[15px] leading-relaxed">{f}</li>)}
          </ul>
        </section>
      )}

      {(s.sections ?? []).map((sec, i) => <EditorialSection key={i} s={sec} />)}

      {artefacts.length > 0 && (
        <section>
          <p className="rubric mb-2">Artefacts</p>
          <h2 className="h3 mb-5">Finds from this site</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{artefacts.map((a) => <EntryCard key={a.id} e={a} />)}</div>
        </section>
      )}
    </DetailShell>
  );
}
