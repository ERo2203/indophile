import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { DateTag } from "@/components/ui";
import { entriesOfType, hrefFor } from "@/lib/db";

export const metadata: Metadata = { title: "Historical Personalities", description: "Rulers, thinkers, travellers, scholars and archaeologists of the Indian subcontinent." };

export default function PeoplePage() {
  const people = entriesOfType("person").sort((a, b) => (a.dates?.start ?? 0) - (b.dates?.start ?? 0));
  const roles = [...new Set(people.flatMap((p) => p.roles))].sort();
  return (
    <div>
      <PageHero
        eyebrow="Historical personalities"
        title="People in the record."
        intro="Only what the sources support: no invented quotations, and dates marked by how well they are known. Archaeologists and decipherers appear alongside kings — they shaped what we know."
      >
        <ul className="mt-8 flex flex-wrap gap-2">{roles.map((r) => <li key={r} className="data text-[11px] border rule px-2.5 py-1">{r}</li>)}</ul>
      </PageHero>
      <ol className="container-ind pb-24 grid md:grid-cols-2 gap-x-12">
        {people.map((p) => (
          <li key={p.id} className="border-b rule">
            <Link href={hrefFor(p)} className="group block py-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">{p.roles.join(" · ")}</span>
                <DateTag range={p.dates} />
              </div>
              <h2 className="font-display text-[1.75rem] leading-tight mt-1 group-hover:text-terracotta">{p.title}</h2>
              <p className="text-sm text-stone mt-1">{p.summary}</p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
