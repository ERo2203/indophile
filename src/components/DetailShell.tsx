import Link from "next/link";
import type { Entry } from "@/lib/types";
import { TYPE_LABEL, getEntry, hrefFor, related, sourcesFor } from "@/lib/db";
import { Breadcrumbs, DateTag, EvidenceBadge, Plate, RelatedRail, SourceList } from "./ui";
import { SaveButton } from "./SaveButton";

/**
 * The common frame for every entity page: header, hero plate, a sticky
 * fact column, the body, connected entries and the bibliography.
 */
export function DetailShell({
  e,
  trail,
  kicker,
  facts,
  children,
  aside,
  relatedTitle = "Continue exploring",
  heroWide = false,
}: {
  e: Entry;
  trail: [string, string?][];
  kicker?: React.ReactNode;
  facts?: React.ReactNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
  relatedTitle?: string;
  heroWide?: boolean;
}) {
  const periodLinks = (e.periods ?? []).map((id) => getEntry(id)).filter(Boolean) as Entry[];
  const rel = related(e.id).filter((r) => r.type !== "subject" && r.type !== "period");
  const sources = sourcesFor(e);

  return (
    <article>
      <header className="container-ind pt-10 pb-10">
        <Breadcrumbs trail={trail} />
        <div className={`mt-8 grid gap-10 ${e.image && !heroWide ? "lg:grid-cols-[1.15fr_1fr] items-end" : ""}`}>
          <div>
            <p className="rubric">{kicker ?? TYPE_LABEL[e.type]}</p>
            <h1 className="h1 mt-4">{e.title}</h1>
            {e.aliases && e.aliases.length > 0 && (
              <p className="mt-3 font-display italic text-lg text-stone">Also: {e.aliases.slice(0, 5).join(" · ")}</p>
            )}
            <p className="lede mt-6 text-ink/80 max-w-2xl">{e.summary}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <DateTag range={e.dates} className="border rule px-3 py-2 bg-ivory" />
              <EvidenceBadge level={e.evidence} />
              {periodLinks.map((p) => (
                <Link key={p.id} href={hrefFor(p)} className="data text-[11px] border rule px-2.5 py-1.5 hover:border-terracotta hover:text-terracotta">
                  {p.title}
                </Link>
              ))}
              <SaveButton item={{ id: e.id, title: e.title, href: hrefFor(e), type: TYPE_LABEL[e.type] }} />
            </div>
          </div>
          {e.image && !heroWide && <Plate image={e.image} priority aspect="aspect-[4/3]" />}
        </div>
        {e.image && heroWide && <Plate image={e.image} priority aspect="aspect-[21/9]" className="mt-10" sizes="100vw" />}
      </header>

      <div className="container-ind grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] pb-20 border-t rule pt-12">
        <div className="min-w-0 space-y-14">{children}</div>
        <aside className="space-y-10 lg:sticky lg:top-24 self-start">
          {facts}
          {aside}
          <p className="data text-[11px] text-stone-light leading-relaxed">
            Last revised {e.updated} · {e.editor}
            <br />
            <Link href="/methodology" className="underline decoration-dotted hover:text-terracotta">How we classify evidence</Link>
          </p>
        </aside>
      </div>

      {rel.length > 0 && (
        <div className="bg-marble border-y rule py-16">
          <div className="container-ind">
            <RelatedRail title={relatedTitle} entries={rel} eyebrow={`Connected to ${e.title}`} />
          </div>
        </div>
      )}

      {sources.length > 0 && (
        <div className="container-ind py-16">
          <div className="max-w-4xl"><SourceList sources={sources} /></div>
        </div>
      )}
    </article>
  );
}
