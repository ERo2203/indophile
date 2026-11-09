import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { EvidenceBadge, PrecisionLegend } from "@/components/ui";
import { EVIDENCE, PRECISION } from "@/lib/format";
import type { DateRange, Evidence } from "@/lib/types";

export const metadata: Metadata = { title: "Editorial Standards & Methodology" };

const RULES: [string, string][] = [
  ["Every claim is traceable", "Entries and their individual sections cite records in a shared bibliography. An entry with no sources cannot be published — the build fails."],
  ["Kinds of evidence stay separate", "Archaeological evidence, inscriptions, later historical texts, oral traditions and mythology are distinguished. Traditional accounts are presented respectfully and labelled as traditions."],
  ["Nothing is invented", "No dates, discoveries, genetic results, quotations, references or boundaries are created to fill a gap. Gaps are shown as gaps."],
  ["Territories come from evidence", "Political extents are envelopes around the find-spots of dated evidence (inscriptions, excavated sites), marked as documented, estimated or disputed. None is hand-drawn."],
  ["No retroactive nations", "Modern borders appear only for orientation. Ancient polities are never described as belonging to present-day nation-states."],
  ["Neutrality", "We avoid nationalist, religious, ethnic and political framing, and present competing scholarly positions in their own terms."],
];

export default function MethodologyPage() {
  return (
    <div>
      <PageHero eyebrow="Editorial standards & methodology" title="How we know what we say." intro="Indophile is a knowledge platform, so its method is part of its content. These are the rules every entry is held to." />
      <div className="container-ind pb-24 space-y-24">
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-rule)] border rule">
          {RULES.map(([t, d], i) => (
            <div key={t} className="bg-parchment p-7">
              <p className="data text-terracotta">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="font-display text-2xl mt-2">{t}</h2>
              <p className="text-sm text-stone mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </section>

        <section id="evidence" className="grid lg:grid-cols-[320px_1fr] gap-12">
          <div>
            <p className="rubric">Evidence classification</p>
            <h2 className="h2 mt-3">Five levels of confidence</h2>
            <p className="text-stone mt-4 leading-relaxed">Applied to whole entries and to individual sections, so an established site can still carry a debated interpretation.</p>
          </div>
          <ol className="border-t rule">
            {(Object.keys(EVIDENCE) as Evidence[]).map((k) => (
              <li key={k} className="grid sm:grid-cols-[12rem_1fr] gap-4 py-5 border-b rule items-baseline">
                <EvidenceBadge level={k} />
                <p className="leading-relaxed">{EVIDENCE[k].note}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="dating" className="grid lg:grid-cols-[320px_1fr] gap-12">
          <div>
            <p className="rubric">Dating</p>
            <h2 className="h2 mt-3">Not every date is equal</h2>
            <p className="text-stone mt-4 leading-relaxed">Years are stored on a signed axis (BCE negative) with an explicit precision. Many events have no exact start or end — and the data model does not pretend otherwise.</p>
          </div>
          <div>
            <div className="border rule bg-ivory p-5 mb-6"><PrecisionLegend /></div>
            <dl className="border-t rule">
              {(Object.keys(PRECISION) as DateRange["precision"][]).map((k) => (
                <div key={k} className="grid sm:grid-cols-[12rem_1fr] gap-4 py-4 border-b rule">
                  <dt className="font-display text-xl">{PRECISION[k].label}</dt>
                  <dd className="text-stone">{PRECISION[k].note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="genetics" className="bg-night text-ivory/85 px-6 sm:px-12 py-14">
          <p className="rubric !text-gold">Archaeogenetics</p>
          <h2 className="h2 text-ivory mt-3">Rules for writing about ancient DNA</h2>
          <ul className="mt-8 grid md:grid-cols-2 gap-6 leading-relaxed">
            <li>Genetic ancestry is never presented as equivalent to ethnic, linguistic, religious, caste or national identity.</li>
            <li>No present-day community is described as the direct, unchanged descendant of a single ancient population.</li>
            <li>Direct ancient-DNA evidence, statistical modelling and indirect inference are labelled separately on every study and concept.</li>
            <li>Ancestry proportions are not re-plotted or rounded by us; readers are sent to the study, where the model behind the number is explained.</li>
          </ul>
        </section>

        <section className="grid lg:grid-cols-[320px_1fr] gap-12">
          <div>
            <p className="rubric">Images</p>
            <h2 className="h2 mt-3">Every plate is credited</h2>
          </div>
          <p className="leading-relaxed text-ink/80">
            Photographs are drawn from openly licensed collections (currently Wikimedia Commons), each stored with its author, licence and source link and shown on every plate. We prefer photographs of actual sites and objects over reconstructions; when reconstructions are added they will be labelled as such, with their basis.
          </p>
        </section>

        <section className="border-l-2 border-gold bg-ivory p-8">
          <p className="rubric !text-gold">Status of this dataset</p>
          <p className="mt-3 leading-relaxed">
            The current entries are a seed dataset prepared to demonstrate the platform&apos;s structure. Bibliographic records are drawn from standard works, but every record still requires verification by a subject editor before public launch. The <Link href="/admin" className="underline">editorial dashboard</Link> tracks this.
          </p>
        </section>
      </div>
    </div>
  );
}
