import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { MiniMap } from "@/components/map/MiniMap";
import { EditorialSection, EntryLink, EvidenceBadge, Plate, SourceList } from "@/components/ui";
import { entriesOfType, sourcesFor } from "@/lib/db";
import { pointsFor } from "@/lib/mapdata";

export const metadata: Metadata = {
  title: "Languages, Scripts & Literature",
  description: "The Indus script, Brahmi, Kharoshthi, Tamil-Brahmi, Prakrit and Sanskrit — attestations, geography and debates.",
};

const DECIPHER = { yes: "Deciphered", partly: "Partly deciphered", no: "Undeciphered" };

/** Shared horizontal scale for attestation spans (3000 BCE – 600 CE). */
const x = (y: number) => ((Math.min(Math.max(y, -3000), 600) + 3000) / 3600) * 100;

export default function LanguagesPage() {
  const scripts = entriesOfType("script");
  const allSources = [...new Map(scripts.flatMap(sourcesFor).map((s) => [s.id, s])).values()];
  return (
    <div>
      <PageHero
        eyebrow="Languages, scripts & literature"
        title="A thousand-year silence, then stone."
        intro="Between the end of the Indus script and Ashoka's edicts lies more than a millennium with no securely dated writing. What came after — Brahmi and its descendants — now writes much of Asia."
        image={{ id: "girnar-estampage", caption: "Ashokan Rock Edict V at Girnar, 19th-century facsimile (Cunningham & Hultzsch)." }}
      />

      <section className="container-ind pb-16">
        <p className="eyebrow mb-4">Attestation timeline</p>
        <div className="border-y rule py-6 space-y-4">
          {scripts.map((s) => {
            const st = s.dates?.start ?? 0, en = Math.min(s.dates?.end ?? st, 600);
            return (
              <a key={s.id} href={`#${s.id}`} className="group grid grid-cols-[9rem_1fr] sm:grid-cols-[12rem_1fr] items-center gap-4">
                <span className="font-display text-lg group-hover:text-terracotta">{s.title}</span>
                <span className="relative h-3 bg-ivory border rule">
                  <span className={`absolute inset-y-0 ${s.deciphered === "no" ? "bg-stone/50" : "bg-terracotta/70"} ${s.dates?.precision === "debated" ? "[mask-image:linear-gradient(90deg,transparent,#000_15%)]" : ""}`} style={{ left: `${x(st)}%`, width: `${Math.max(x(en) - x(st), 0.8)}%` }} />
                </span>
              </a>
            );
          })}
          <div className="grid grid-cols-[9rem_1fr] sm:grid-cols-[12rem_1fr] gap-4">
            <span />
            <span className="relative h-4 data text-[10px] text-stone">
              {[-3000, -2000, -1000, 1, 600].map((y) => (
                <span key={y} className="absolute -translate-x-1/2" style={{ left: `${x(y)}%` }}>{y < 0 ? `${-y} BCE` : `${y} CE`}</span>
              ))}
            </span>
          </div>
        </div>
      </section>

      <div className="container-ind pb-24 space-y-24">
        {scripts.map((s) => {
          const sitesWith = [...new Set(s.attestations.map((a) => a.site).filter(Boolean) as string[])];
          const pts = pointsFor(sitesWith);
          return (
            <section key={s.id} id={s.id} className="scroll-mt-24 grid lg:grid-cols-[1fr_380px] gap-12 border-t-2 border-ink pt-10">
              <div className="space-y-10">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`data text-[10px] px-2 py-0.5 ${s.deciphered === "no" ? "bg-night text-gold" : "bg-sage-pale text-sage-deep"}`}>{DECIPHER[s.deciphered]}</span>
                    <span className="eyebrow">{s.family}</span>
                    <EvidenceBadge level={s.evidence} />
                  </div>
                  <h2 className="h1 mt-4">{s.title}</h2>
                  <p className="lede mt-4 text-ink/75">{s.summary}</p>
                </div>
                {s.sections.map((sec, i) => <EditorialSection key={i} s={sec} />)}
              </div>
              <aside className="space-y-8">
                {s.image && <Plate image={s.image} aspect="aspect-[4/3]" />}
                <dl className="divide-y rule border-y rule text-sm">
                  {[["Direction", s.direction], ["Region", s.region]].filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[6rem_1fr] gap-3 py-2.5"><dt className="eyebrow pt-0.5">{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
                <div>
                  <p className="eyebrow mb-3">Key attestations</p>
                  <ul className="space-y-2.5 text-sm">
                    {s.attestations.map((a) => (
                      <li key={a.label} className="grid grid-cols-[1fr_auto] gap-3">
                        <span>{a.label}{a.site && <> — <EntryLink id={a.site} /></>}</span>
                        <span className="data text-[11px] text-stone">{a.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {pts.length > 0 && <MiniMap points={pts} className="h-[260px]" />}
              </aside>
            </section>
          );
        })}
        <div className="max-w-4xl"><SourceList sources={allSources} /></div>
      </div>
    </div>
  );
}
