import Image from "next/image";
import Link from "next/link";
import type { Citation, DateRange, Entry, Evidence, ImageRef, Section, Source } from "@/lib/types";
import { EVIDENCE, PRECISION, citeLabel, formatRange } from "@/lib/format";
import { TYPE_LABEL, getEntry, getImage, getSource, hrefFor } from "@/lib/db";

/* ——— Evidence & dating */

const EVIDENCE_STYLE: Record<Evidence, string> = {
  established: "bg-sage-strong text-paper border-sage-deep",
  "well-supported": "bg-sage-pale text-sage-deep border-sage/40",
  debated: "bg-transparent text-terracotta-deep border-terracotta/50",
  hypothesis: "bg-transparent text-stone border-dashed border-stone/60",
  unverified: "bg-transparent text-stone-light border-dotted border-stone-light",
};

export function EvidenceBadge({ level, compact = false }: { level?: Evidence; compact?: boolean }) {
  if (!level) return null;
  const e = EVIDENCE[level];
  return (
    <span
      title={`${e.label}: ${e.note}`}
      className={`inline-flex items-center gap-1.5 border px-2 py-[3px] data text-[11px] uppercase tracking-[0.12em] whitespace-nowrap ${EVIDENCE_STYLE[level]}`}
    >
      <EvidenceGlyph level={level} />
      {!compact && e.label}
    </span>
  );
}

export function EvidenceGlyph({ level }: { level: Evidence }) {
  const fill = { established: 4, "well-supported": 3, debated: 2, hypothesis: 1, unverified: 0 }[level];
  return (
    <span className="inline-flex gap-[2px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={`block w-[3px] h-[8px] ${i < fill ? "bg-current" : "bg-current opacity-25"}`} />
      ))}
    </span>
  );
}

const PRECISION_MARK: Record<DateRange["precision"], string> = {
  secure: "●",
  conventional: "◐",
  approximate: "○",
  debated: "◌",
};

export function DateTag({ range, className = "" }: { range?: DateRange; className?: string }) {
  if (!range) return null;
  const p = PRECISION[range.precision];
  return (
    <span className={`data inline-flex items-center gap-1.5 text-stone ${className}`} title={`${p.label}: ${p.note}${range.note ? " — " + range.note : ""}`}>
      <span className="text-terracotta" aria-hidden>{PRECISION_MARK[range.precision]}</span>
      <span>{formatRange(range)}</span>
      <span className="sr-only">({p.label})</span>
    </span>
  );
}

export function PrecisionLegend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 data text-stone">
      {(Object.keys(PRECISION) as DateRange["precision"][]).map((k) => (
        <li key={k} className="flex items-center gap-1.5" title={PRECISION[k].note}>
          <span className="text-terracotta">{PRECISION_MARK[k]}</span>
          {PRECISION[k].label}
        </li>
      ))}
    </ul>
  );
}

export function EvidenceLegend() {
  return (
    <ul className="flex flex-wrap gap-2">
      {(Object.keys(EVIDENCE) as Evidence[]).map((k) => (
        <li key={k}><EvidenceBadge level={k} /></li>
      ))}
    </ul>
  );
}

/* ——— Imagery */

export function Plate({
  image,
  className = "",
  aspect = "aspect-[4/3]",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  showCaption = true,
  dark = false,
}: {
  image?: ImageRef;
  className?: string;
  aspect?: string;
  priority?: boolean;
  sizes?: string;
  showCaption?: boolean;
  dark?: boolean;
}) {
  const rec = getImage(image?.id);
  if (!image || !rec) {
    return (
      <div className={`${aspect} ${className} bg-sage-pale/60 border rule flex items-end p-4`}>
        <span className="data text-stone">Image pending rights clearance</span>
      </div>
    );
  }
  return (
    <figure className={className}>
      <div className={`plate relative overflow-hidden ${aspect} bg-sage-pale`}>
        <Image src={rec.src} alt={image.caption} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      {showCaption && (
        <figcaption className={`mt-2.5 flex flex-col gap-0.5 text-[0.8rem] leading-snug ${dark ? "text-paper/70" : "text-stone"}`}>
          <span>{image.caption}</span>
          <Credit id={image.id} dark={dark} />
        </figcaption>
      )}
    </figure>
  );
}

export function Credit({ id, dark = false }: { id: string; dark?: boolean }) {
  const rec = getImage(id);
  if (!rec) return null;
  return (
    <span className={`data text-[11px] ${dark ? "text-paper/45" : "text-stone-light"}`}>
      Photo: {rec.artist || "Unknown"} ·{" "}
      <a href={rec.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-terracotta">
        {rec.license} via Wikimedia Commons
      </a>
    </span>
  );
}

/* ——— Structural */

export function Breadcrumbs({ trail }: { trail: [string, string?][] }) {
  return (
    <nav aria-label="Breadcrumb" className="data text-stone">
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map(([label, href], i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-stone-light">/</span>}
            {href ? <Link href={href} className="hover:text-terracotta">{label}</Link> : <span className="text-ink">{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SectionHead({ eyebrow, title, intro, action }: { eyebrow?: string; title: string; intro?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="h2">{title}</h2>
        {intro && <p className="mt-4 text-stone leading-relaxed">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-terracotta ${className}`}>
      <span className="link-ind">{children}</span>
      <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
    </Link>
  );
}

export function FactTable({ rows }: { rows: [string, React.ReactNode][] }) {
  const shown = rows.filter(([, v]) => v !== undefined && v !== null && v !== "" && v !== false);
  return (
    <dl className="divide-y rule border-y rule">
      {shown.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3 text-sm">
          <dt className="eyebrow pt-0.5">{k}</dt>
          <dd className="text-ink leading-relaxed">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ——— Editorial sections with rubrics */

const RUBRIC: Record<NonNullable<Section["kind"]>, { label: string; tag: string } | null> = {
  "map-check": { label: "The Map Check", tag: "Where did this happen?" },
  trenches: { label: "From the Trenches", tag: "What does the archaeological evidence reveal?" },
  dna: { label: "What the DNA Says", tag: "What archaeogenetics can tell us — and its limits" },
  faces: { label: "Faces from the Past", tag: "Historically grounded reconstructions" },
  record: { label: "The Historical Record", tag: "Inscriptions, texts, coins and other primary sources" },
  unknown: { label: "What We Still Don't Know", tag: "Unresolved questions and competing interpretations" },
  plain: null,
};

export function EditorialSection({ s, index, dropcap = false, children }: { s: Section; index?: number; dropcap?: boolean; children?: React.ReactNode }) {
  const r = s.kind ? RUBRIC[s.kind] : null;
  const isUnknown = s.kind === "unknown";
  return (
    <section
      id={s.heading.toLowerCase().replace(/[^a-z]+/g, "-")}
      className={`scroll-mt-24 ${isUnknown ? "bg-night text-paper/85 -mx-4 sm:mx-0 px-6 sm:px-10 py-10" : ""} ${s.kind === "dna" ? "border-l-2 border-sage pl-6 sm:pl-8" : ""}`}
    >
      <header className="mb-5">
        {r && <p className={`rubric mb-2 ${isUnknown ? "!text-gold" : ""}`}>{index !== undefined ? `${String(index + 1).padStart(2, "0")} · ` : ""}{r.label}</p>}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h2 className={`h3 ${isUnknown ? "text-paper" : ""}`}>{s.heading}</h2>
          <EvidenceBadge level={s.evidence} />
        </div>
        {r && <p className={`mt-1 text-sm italic font-display ${isUnknown ? "text-paper/50" : "text-stone"}`}>{r.tag}</p>}
      </header>
      <div className={`prose-ind ${isUnknown ? "!text-paper/80" : ""}`}>
        {s.body.map((para, i) => (
          <p key={i} className={dropcap && i === 0 ? "dropcap" : ""}>{para}</p>
        ))}
      </div>
      {children}
      {s.cite && s.cite.length > 0 && <InlineCites cites={s.cite} dark={isUnknown} />}
    </section>
  );
}

export function InlineCites({ cites, dark = false }: { cites: Citation[]; dark?: boolean }) {
  return (
    <p className={`mt-4 data text-[11px] ${dark ? "text-paper/45" : "text-stone"}`}>
      <span className="uppercase tracking-[0.14em] mr-2">Sources</span>
      {cites.map((c, i) => {
        const s = getSource(c.sourceId);
        if (!s) return null;
        return (
          <span key={i}>
            {i > 0 && "; "}
            <a href={`#src-${s.id}`} className="underline decoration-dotted underline-offset-2 hover:text-terracotta">
              {citeLabel(s.authors, s.year)}
            </a>
            {c.locus && `, ${c.locus}`}
          </span>
        );
      })}
    </p>
  );
}

export function SourceList({ sources, title = "Sources & further reading" }: { sources: Source[]; title?: string }) {
  if (!sources.length) return null;
  return (
    <section id="sources" className="scroll-mt-24">
      <p className="rubric mb-2">Sources & Further Reading</p>
      <h2 className="h3 mb-6">{title}</h2>
      <ol className="space-y-4">
        {sources.map((s) => (
          <li key={s.id} id={`src-${s.id}`} className="grid grid-cols-[auto_1fr] gap-4 text-sm leading-relaxed scroll-mt-28 target:bg-gold/15">
            <span className="data text-[11px] uppercase tracking-wider text-stone pt-1 w-24">{s.kind.replace(/-/g, " ")}</span>
            <span>
              {s.authors} ({s.year}). <em className="font-display text-[1.05rem]">{s.title}</em>
              {s.container && <>. {s.container}</>}
              {s.publisher && <>. {s.publisher}</>}.
              {s.doi && (
                <> <a className="data text-terracotta hover:underline" href={`https://doi.org/${s.doi}`} target="_blank" rel="noopener noreferrer">doi:{s.doi}</a></>
              )}
              {s.url && (
                <> <a className="data text-terracotta hover:underline" href={s.url} target="_blank" rel="noopener noreferrer">{s.url.replace(/^https?:\/\//, "")}</a></>
              )}
              {!s.verified && <span className="ml-2 data text-[11px] text-terracotta border border-terracotta/40 px-1">record unverified</span>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ——— Cards */

export function EntryCard({ e, showImage = true, note }: { e: Entry; showImage?: boolean; note?: string }) {
  const hasImg = showImage && e.image && getImage(e.image.id);
  return (
    <Link href={hrefFor(e)} className="group card-ind flex flex-col h-full">
      {hasImg && <Plate image={e.image} aspect="aspect-[16/10]" showCaption={false} sizes="(min-width:1024px) 25vw, 50vw" />}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow">{TYPE_LABEL[e.type]}</span>
          <EvidenceBadge level={e.evidence} compact />
        </div>
        <h3 className="font-display text-[1.45rem] leading-tight group-hover:text-terracotta transition-colors">{e.title}</h3>
        {note ? <p className="text-sm text-stone leading-relaxed italic font-display text-[1.02rem]">{note}</p> : <p className="text-sm text-stone leading-relaxed line-clamp-3">{e.summary}</p>}
        <div className="mt-auto pt-3"><DateTag range={e.dates} /></div>
      </div>
    </Link>
  );
}

export function CompactRow({ e }: { e: Entry }) {
  return (
    <Link href={hrefFor(e)} className="group grid grid-cols-[1fr_auto] items-baseline gap-4 py-3 border-b rule">
      <span>
        <span className="font-display text-lg group-hover:text-terracotta">{e.title}</span>
        <span className="eyebrow ml-3">{TYPE_LABEL[e.type]}</span>
      </span>
      <DateTag range={e.dates} />
    </Link>
  );
}

export function RelatedRail({ title, entries, eyebrow = "Connected entries" }: { title: string; entries: Entry[]; eyebrow?: string }) {
  if (!entries.length) return null;
  return (
    <section>
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h2 className="h3 mb-6">{title}</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {entries.slice(0, 8).map((e) => <EntryCard key={e.id} e={e} />)}
      </div>
    </section>
  );
}

export function LinkList({ entries, title }: { entries: Entry[]; title: string }) {
  if (!entries.length) return null;
  return (
    <div>
      <h3 className="eyebrow mb-3">{title}</h3>
      <ul className="space-y-1.5">
        {entries.map((e) => (
          <li key={e.id}>
            <Link href={hrefFor(e)} className="text-sm hover:text-terracotta link-ind">{e.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EntryLink({ id, children }: { id: string; children?: React.ReactNode }) {
  const e = getEntry(id);
  if (!e) return <>{children ?? id}</>;
  return <Link href={hrefFor(e)} className="text-terracotta-deep hover:underline underline-offset-2">{children ?? e.title}</Link>;
}
