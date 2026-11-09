import Link from "next/link";
import { HeroTerrain } from "@/components/HeroTerrain";
import { Glyph } from "@/components/Glyph";
import { ArrowLink, DateTag, EvidenceBadge, Plate, SectionHead } from "@/components/ui";
import { AtlasExplorer } from "@/components/map/AtlasExplorer";
import { allEntries, allSources, entriesOfType, getEntry, getPeriods, getSites, getSource, hrefFor } from "@/lib/db";
import { mapPayload } from "@/lib/mapdata";
import { citeLabel } from "@/lib/format";
import type { Entry, ImageRef } from "@/lib/types";

const FEATURED: { id: string; kicker: string; image?: ImageRef }[] = [
  { id: "art-indus-water", kicker: "Ancient technology" },
  { id: "mehrgarh", kicker: "Earliest agriculture" },
  { id: "art-reading-ashoka", kicker: "Inscriptions" },
  { id: "tamil-brahmi", kicker: "Scripts" },
  { id: "art-rome-coromandel", kicker: "Maritime trade" },
  { id: "sanchi", kicker: "Early Buddhist monuments" },
  { id: "keeladi", kicker: "Early urban settlements" },
];

const RESEARCH: { id: string; kind: "Academic research" | "Institutional announcement" | "Excavation report" | "Editorial interpretation"; date: string }[] = [
  { id: "evt-dholavira-unesco", kind: "Institutional announcement", date: "July 2021" },
  { id: "shinde-2019-study", kind: "Academic research", date: "September 2019" },
  { id: "narasimhan-2019-study", kind: "Academic research", date: "September 2019" },
  { id: "keeladi", kind: "Excavation report", date: "2019" },
  { id: "art-rakhigarhi-genome", kind: "Editorial interpretation", date: "Indophile" },
];

const KIND_STYLE: Record<string, string> = {
  "Academic research": "bg-sage-deep text-ivory",
  "Institutional announcement": "bg-gold/25 text-ink",
  "Excavation report": "bg-terracotta/15 text-terracotta-deep",
  "Editorial interpretation": "border border-ink/30 text-ink",
};

function locationOf(e: Entry): string | undefined {
  if (e.type === "site") return `${e.place.modern}, ${e.place.country}`;
  if (e.type === "article") return e.region;
  if (e.type === "script") return e.region;
  return undefined;
}

export default function Home() {
  const periods = getPeriods();
  const subjects = entriesOfType("subject");
  const collections = entriesOfType("collection");
  const sites = getSites();
  const stats = [
    { n: allEntries().length, label: "Connected entries" },
    { n: sites.length, label: "Mapped places" },
    { n: allSources().length, label: "Cited sources" },
    { n: "1.5M", label: "Years of human presence" },
  ];
  const featured = FEATURED.map((f) => ({ ...f, e: getEntry(f.id)! })).filter((f) => f.e);
  const [lead, ...rest] = featured;

  return (
    <>
      {/* ——— HERO */}
      <section className="relative -mt-16 pt-16 overflow-hidden grain">
        <HeroTerrain className="absolute inset-0 w-full h-full" />
        <div className="container-ind relative grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 pt-14 sm:pt-20 lg:pt-28 pb-20 lg:pb-28">
          <div className="max-w-[44rem]">
            <p className="rubric rise">An interactive historical atlas of the Indian subcontinent</p>
            <h1 className="display mt-6 rise rise-2">
              History is written in the <em className="text-terracotta not-italic font-display italic">land</em> beneath our feet.
            </h1>
            <p className="lede mt-8 max-w-xl text-ink/80 rise rise-3">
              Explore the people, civilisations, migrations, discoveries and ideas that shaped the Indian subcontinent over thousands of years.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 rise rise-4">
              <Link href="/explore" className="inline-flex items-center gap-3 bg-ink text-ivory px-6 py-3.5 text-sm tracking-wide hover:bg-terracotta transition-colors">
                Explore History <span aria-hidden>→</span>
              </Link>
              <Link href="/atlas" className="inline-flex items-center gap-3 border border-ink/30 px-6 py-3.5 text-sm tracking-wide hover:border-ink hover:bg-ivory transition-colors">
                <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden><path d="M1.5 4.5 7 2l6 2.5 5.5-2.5v13.5L13 18l-6-2.5-5.5 2.5z" /><path d="M7 2v13.5M13 4.5V18" /></svg>
                Open Historical Atlas
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block min-h-[540px] rise rise-3">
            <div className="absolute right-0 top-0 w-[86%]">
              <Plate image={{ id: "mohenjo-daro", caption: "Mohenjo-daro, Sindh — the citadel mound and the Great Bath." }} aspect="aspect-[4/3]" priority sizes="(min-width:1024px) 40vw, 80vw" />
            </div>
            <div className="absolute left-0 bottom-0 w-[36%] border-[6px] border-parchment shadow-[0_30px_60px_-30px_rgba(36,35,31,.5)]">
              <Plate image={{ id: "unicorn-seal", caption: "Indus seal" }} aspect="aspect-square" showCaption={false} sizes="20vw" />
            </div>
            <p className="absolute left-0 top-6 data text-stone [writing-mode:vertical-rl] rotate-180 tracking-[0.2em]">PLATE I · MOHENJO-DARO · c. 2600–1900 BCE</p>
          </div>
        </div>

        {/* Scale strip */}
        <div className="relative border-y rule bg-ivory/70 backdrop-blur-sm">
          <dl className="container-ind grid grid-cols-2 md:grid-cols-4 divide-x rule">
            {stats.map((s) => (
              <div key={s.label} className="py-6 px-4 first:pl-0">
                <dt className="eyebrow">{s.label}</dt>
                <dd className="font-display text-4xl mt-1 tabular-nums">{s.n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ——— EXPLORE THROUGH TIME */}
      <section className="py-24" aria-labelledby="time-h">
        <div className="container-ind">
          <SectionHead
            eyebrow="Explore through time"
            title="Sixteen windows onto the past"
            intro="Period boundaries are conventions, not events. They overlap and differ from region to region; each is marked with how securely its dates are known."
            action={<ArrowLink href="/timeline">Open the full timeline</ArrowLink>}
          />
        </div>
        <div className="scroller flex gap-5 overflow-x-auto pb-6" style={{ paddingInline: "max(1rem, calc((100vw - 1360px) / 2 + 3rem))", scrollPaddingInline: "max(1rem, calc((100vw - 1360px) / 2 + 3rem))" }}>
          {periods.map((p) => (
            <article key={p.id} className="group shrink-0 w-[300px] sm:w-[340px] card-ind flex flex-col">
              <Link href={hrefFor(p)} className="block">
                {p.image ? (
                  <Plate image={p.image} aspect="aspect-[3/2]" showCaption={false} sizes="340px" />
                ) : (
                  <div className="aspect-[3/2] bg-night text-ivory/40 flex items-end p-5 relative overflow-hidden">
                    <span className="absolute -right-4 -top-6 font-display text-[9rem] leading-none text-ivory/[0.06]">{String(p.order).padStart(2, "0")}</span>
                    <span className="data text-[10px] tracking-[0.18em] uppercase">{p.phase === 4 ? "In preparation · Phase 4" : ""}</span>
                  </div>
                )}
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-col gap-1">
                  <span className="data text-terracotta">{String(p.order).padStart(2, "0")}</span>
                  <DateTag range={p.dates} />
                </div>
                <h3 className="font-display text-[1.55rem] leading-tight mt-2">
                  <Link href={hrefFor(p)} className="hover:text-terracotta">{p.title}</Link>
                </h3>
                <p className="text-sm text-stone leading-relaxed mt-2 line-clamp-3">{p.summary}</p>
                {p.developments.length > 0 && (
                  <div className="mt-4">
                    <p className="eyebrow mb-1.5">Political & cultural developments</p>
                    <ul className="text-[13px] text-ink/80 space-y-1">
                      {p.developments.slice(0, 2).map((d) => <li key={d} className="pl-3 relative before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-px before:bg-terracotta">{d}</li>)}
                    </ul>
                  </div>
                )}
                {p.keySites.length > 0 && (
                  <div className="mt-4">
                    <p className="eyebrow mb-1.5">Key sites</p>
                    <p className="text-[13px] leading-relaxed">
                      {p.keySites.slice(0, 4).map((id, i) => {
                        const s = getEntry(id);
                        return s ? <span key={id}>{i > 0 && " · "}<Link href={hrefFor(s)} className="hover:text-terracotta link-ind">{s.title}</Link></span> : null;
                      })}
                    </p>
                  </div>
                )}
                <div className="mt-auto pt-5"><ArrowLink href={hrefFor(p)}>Explore</ArrowLink></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ——— EXPLORE BY SUBJECT */}
      <section className="py-24 bg-marble border-y rule" aria-labelledby="subj-h">
        <div className="container-ind">
          <SectionHead eyebrow="Explore by subject" title="Every subject is a doorway into the same archive" intro="Choose a lens — the sites, people and evidence behind it are shared across the whole platform." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l rule">
            {subjects.map((s, i) => (
              <Link key={s.id} href={hrefFor(s)} className="group relative border-r border-b rule p-6 sm:p-7 min-h-[190px] flex flex-col bg-ivory/40 hover:bg-ivory transition-colors">
                <span className="data text-stone-light text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                <Glyph name={s.glyph} className="w-9 h-9 mt-3 text-sage-deep group-hover:text-terracotta transition-colors" />
                <h3 className="font-display text-[1.4rem] leading-tight mt-auto pt-6">{s.title}</h3>
                <p className="text-[13px] text-stone mt-1 leading-snug">{s.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ——— FEATURED DISCOVERIES */}
      <section className="py-24" aria-labelledby="disc-h">
        <div className="container-ind">
          <SectionHead eyebrow="Featured discoveries" title="Evidence that changed the story" action={<ArrowLink href="/archaeology">The archaeology archive</ArrowLink>} />
          <div className="grid lg:grid-cols-12 gap-8">
            {lead && (
              <Link href={hrefFor(lead.e)} className="group lg:col-span-7 flex flex-col">
                <Plate image={lead.e.image} aspect="aspect-[16/11]" showCaption={false} sizes="(min-width:1024px) 58vw, 100vw" />
                <div className="mt-6">
                  <p className="rubric">{lead.kicker}</p>
                  <h3 className="h1 mt-3 group-hover:text-terracotta transition-colors">{lead.e.title}</h3>
                  <p className="lede mt-4 text-ink/75">{lead.e.type === "article" ? lead.e.standfirst : lead.e.summary}</p>
                  <DiscoveryMeta e={lead.e} />
                </div>
              </Link>
            )}
            <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {rest.slice(0, 3).map(({ e, kicker }) => (
                <Link key={e.id} href={hrefFor(e)} className="group grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-5 pb-6 border-b rule">
                  <Plate image={e.image} aspect="aspect-square" showCaption={false} sizes="140px" />
                  <div>
                    <p className="rubric !text-[10px]">{kicker}</p>
                    <h3 className="font-display text-[1.4rem] leading-tight mt-1.5 group-hover:text-terracotta">{e.title}</h3>
                    <p className="text-[13px] text-stone mt-1.5 line-clamp-2">{e.summary}</p>
                    <DiscoveryMeta e={e} compact />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mt-12 pt-10 border-t rule">
            {rest.slice(3).map(({ e, kicker }) => (
              <Link key={e.id} href={hrefFor(e)} className="group">
                <Plate image={e.image} aspect="aspect-[3/2]" showCaption={false} sizes="(min-width:640px) 33vw, 100vw" />
                <p className="rubric !text-[10px] mt-4">{kicker}</p>
                <h3 className="font-display text-[1.5rem] leading-tight mt-1 group-hover:text-terracotta">{e.title}</h3>
                <p className="text-[13px] text-stone mt-1.5 line-clamp-2">{e.summary}</p>
                <DiscoveryMeta e={e} compact />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ——— MAP PREVIEW */}
      <section className="bg-night text-ivory pt-24" aria-labelledby="map-h">
        <div className="container-ind grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-10">
          <div className="max-w-2xl">
            <p className="eyebrow !text-gold mb-3">The Historical Atlas</p>
            <h2 id="map-h" className="h2 text-ivory">Move the slider. Watch the subcontinent change.</h2>
            <p className="mt-4 text-ivory/65 leading-relaxed">
              Archaeological sites, inscriptions, ports, trade routes and modelled population movements — every point drawn from a sourced record. Territories are estimated from the find-spots of dated evidence, never hand-drawn.
            </p>
          </div>
        </div>
        <div className="container-ind pb-24">
          <div className="border border-ivory/15 text-ink">
            <AtlasExplorer payload={mapPayload()} variant="preview" defaultYear={-250} />
          </div>
        </div>
      </section>

      {/* ——— LATEST RESEARCH */}
      <section className="py-24" aria-labelledby="res-h">
        <div className="container-ind grid lg:grid-cols-[1fr_2fr] gap-12">
          <div>
            <p className="eyebrow mb-3">Research & discoveries</p>
            <h2 id="res-h" className="h2">From the journals, the trenches and the museums</h2>
            <p className="mt-4 text-stone leading-relaxed">Every item is labelled by what it is. Peer-reviewed research, institutional announcements, excavation reports and our own editorial interpretation are never mixed together.</p>
            <ul className="mt-8 space-y-2">
              {Object.entries(KIND_STYLE).map(([k, cls]) => (
                <li key={k} className="flex items-center gap-3 text-sm"><span className={`data text-[10px] px-2 py-0.5 ${cls}`}>{k}</span></li>
              ))}
            </ul>
          </div>
          <ol className="border-t rule">
            {RESEARCH.map((r) => {
              const e = getEntry(r.id);
              if (!e) return null;
              const src = e.cite[0] && getSource(e.cite[0].sourceId);
              return (
                <li key={r.id}>
                  <Link href={hrefFor(e)} className="group grid sm:grid-cols-[10rem_1fr_auto] gap-x-6 gap-y-2 py-6 border-b rule items-baseline">
                    <span className={`data text-[10px] px-2 py-0.5 justify-self-start ${KIND_STYLE[r.kind]}`}>{r.kind}</span>
                    <span>
                      <span className="font-display text-[1.45rem] leading-tight group-hover:text-terracotta">{e.title}</span>
                      {src && <span className="block data text-stone mt-1">{citeLabel(src.authors, src.year)} · {src.container ?? src.publisher}</span>}
                    </span>
                    <span className="data text-stone">{r.date}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ——— COLLECTIONS */}
      <section className="py-24 bg-sage-pale/50 border-t rule" aria-labelledby="col-h">
        <div className="container-ind">
          <SectionHead eyebrow="Curated collections" title="Reading paths, assembled by editors" action={<ArrowLink href="/collections">All collections</ArrowLink>} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.slice(0, 6).map((c, i) => (
              <Link key={c.id} href={hrefFor(c)} className={`group card-ind flex flex-col ${i === 0 ? "lg:row-span-2" : ""}`}>
                <Plate image={c.image} aspect={i === 0 ? "aspect-[4/5]" : "aspect-[16/9]"} showCaption={false} sizes="(min-width:1024px) 33vw, 50vw" />
                <div className="p-6 flex flex-col flex-1">
                  <p className="eyebrow">{c.items.length} entries · {c.curator}</p>
                  <h3 className="font-display text-[1.6rem] leading-tight mt-2 group-hover:text-terracotta">{c.title}</h3>
                  <p className="text-sm text-stone mt-2">{c.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function DiscoveryMeta({ e, compact = false }: { e: Entry; compact?: boolean }) {
  const loc = locationOf(e);
  const srcs = e.cite.slice(0, compact ? 1 : 3).map((c) => getSource(c.sourceId)).filter(Boolean);
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 ${compact ? "mt-2.5" : "mt-5"}`}>
      <DateTag range={e.dates} />
      {loc && !compact && <span className="data text-stone">◇ {loc}</span>}
      {!compact && <EvidenceBadge level={e.evidence} />}
      {srcs.length > 0 && (
        <span className="data text-[10px] text-stone-light">
          {srcs.map((s) => citeLabel(s!.authors, s!.year)).join(" · ")}
        </span>
      )}
    </div>
  );
}
