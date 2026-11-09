import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { DateTag, EvidenceBadge } from "@/components/ui";
import { entriesOfType, getPeriods, hrefFor } from "@/lib/db";
import { POLITY_KIND } from "@/lib/format";

export const metadata: Metadata = {
  title: "Civilisations, Kingdoms & Empires",
  description: "An encyclopedia of political and cultural entities of the Indian subcontinent — civilisations, archaeological cultures, janapadas, republics, kingdoms and empires.",
};

const GROUPS: { title: string; periods: string[] }[] = [
  { title: "Prehistory and the Bronze Age", periods: ["neolithic-chalcolithic", "indus"] },
  { title: "Ancient India", periods: ["vedic-iron-age", "mahajanapadas", "mauryan", "post-mauryan", "gupta-classical"] },
  { title: "Medieval and early modern", periods: ["early-medieval", "regional-kingdoms", "delhi-sultanate", "mughal", "regional-powers"] },
];

export default function CivilisationsPage() {
  const polities = entriesOfType("polity");
  const periods = getPeriods();
  const used = new Set<string>();
  return (
    <div>
      <PageHero
        eyebrow="Civilisations, kingdoms & empires"
        title="Not every society was a kingdom."
        intro="Archaeological cultures, urban civilisations, janapadas, assembly-governed republics, kingdoms, empires and sultanates — each described in its own terms, with its territory drawn from evidence rather than imagination."
        image={{ id: "sanchi", caption: "West gateway of Stupa 1, Sanchi." }}
      >
        <ul className="mt-8 flex flex-wrap gap-2">
          {Object.entries(POLITY_KIND).map(([k, v]) => {
            const n = polities.filter((p) => p.kind === k).length;
            return n ? <li key={k} className="data text-[11px] border rule px-2.5 py-1">{v} · {n}</li> : null;
          })}
        </ul>
      </PageHero>
      <div className="container-ind pb-24 space-y-20">
        {GROUPS.map((g) => {
          const list = polities
            .filter((p) => !used.has(p.id) && p.periods?.some((x) => g.periods.includes(x)))
            .sort((a, b) => (a.dates?.start ?? 0) - (b.dates?.start ?? 0));
          list.forEach((p) => used.add(p.id));
          return (
            <section key={g.title}>
              <h2 className="h2 border-b-2 border-ink pb-4 mb-2">{g.title}</h2>
              <ol>
                {list.map((p) => (
                  <li key={p.id} className="border-b rule">
                    <Link href={hrefFor(p)} className="group grid md:grid-cols-[1fr_14rem_10rem] gap-x-8 gap-y-2 py-6 items-baseline">
                      <div>
                        <h3 className="font-display text-[1.75rem] leading-tight group-hover:text-terracotta">{p.title}</h3>
                        <p className="text-sm text-stone mt-1 max-w-2xl">{p.summary}</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="eyebrow">{POLITY_KIND[p.kind]}</span>
                        <DateTag range={p.dates} />
                      </div>
                      <div className="flex md:justify-end items-center gap-2">
                        {p.extent && <span className="data text-[10px] text-terracotta-deep border border-terracotta/40 px-1.5 py-0.5" title="Has an evidence-derived territorial estimate">mapped</span>}
                        <EvidenceBadge level={p.evidence} compact />
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
        <p className="text-sm text-stone">
          Colonial and modern entities — trading companies, presidencies, princely states and nation-states — are planned for Phase 4. See the <Link href={hrefFor(periods[periods.length - 3])} className="underline">colonial period</Link> overview.
        </p>
      </div>
    </div>
  );
}
