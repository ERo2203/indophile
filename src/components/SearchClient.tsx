"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { runSearch, type SearchDoc } from "@/lib/search";
import type { EntryType } from "@/lib/types";

const SUGGEST = ["Pataliputra", "Ashoka", "Harappan seals", "Keezhadi", "Tamil-Brahmi", "steppe ancestry", "Roman trade", "Mohenjodaro", "Takshashila", "Gupta inscriptions"];

export function SearchClient({
  docs,
  typeLabels,
  periods,
  subjects,
}: {
  docs: SearchDoc[];
  typeLabels: Record<EntryType, string>;
  periods: { id: string; title: string }[];
  subjects: { id: string; title: string }[];
}) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("");
  const [period, setPeriod] = useState("");
  const [country, setCountry] = useState("");
  const [subject, setSubject] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQ(initial);
    input.current?.focus();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, [q]);

  const raw = useMemo(() => runSearch(docs, q), [docs, q]);
  const hits = raw.filter(
    (h) =>
      (!type || h.doc.type === type) &&
      (!period || h.doc.periods.includes(period)) &&
      (!country || h.doc.country === country) &&
      (!subject || h.doc.subjects.includes(subject)),
  );

  const typeCounts = useMemo(() => {
    const c: Record<string, number> = {};
    raw.forEach((h) => (c[h.doc.type] = (c[h.doc.type] ?? 0) + 1));
    return c;
  }, [raw]);

  const countries = useMemo(() => [...new Set(docs.map((d) => d.country).filter(Boolean))] as string[], [docs]);

  // Autocomplete: top title matches
  const suggestions = q.length >= 2 ? raw.filter((h) => h.score >= 40).slice(0, 6) : [];
  const top = hits[0]?.score >= 40 ? hits[0] : undefined;
  const byId = useMemo(() => new Map(docs.map((d) => [d.id, d])), [docs]);
  const recs = top ? top.doc.related.map((id) => byId.get(id)).filter((d): d is SearchDoc => !!d && !hits.slice(0, 8).some((h) => h.doc.id === d.id)).slice(0, 4) : [];

  const select = "bg-ivory border rule px-3 py-2 text-sm focus:border-terracotta outline-none";

  return (
    <div>
      <div className="relative">
        <label htmlFor="q" className="sr-only">Search the knowledge base</label>
        <input
          id="q"
          ref={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search people, sites, kingdoms, scripts, studies…"
          className="w-full bg-transparent border-b-2 border-ink/80 font-display text-[clamp(1.8rem,4vw,3rem)] py-3 pr-12 outline-none placeholder:text-stone-light focus:border-terracotta"
          autoComplete="off"
          role="combobox"
          aria-expanded={suggestions.length > 0}
          aria-controls="q-suggest"
        />
        {q && <button onClick={() => setQ("")} className="absolute right-0 bottom-4 data text-stone hover:text-ink" aria-label="Clear search">✕</button>}
        {suggestions.length > 0 && (
          <ul id="q-suggest" role="listbox" className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <li key={s.doc.id} role="option" aria-selected={false}>
                <Link href={s.doc.href} className="inline-flex items-baseline gap-2 border rule bg-ivory px-3 py-1.5 text-sm hover:border-terracotta">
                  {s.doc.title}
                  <span className="data text-[10px] text-stone">{typeLabels[s.doc.type]}</span>
                  {s.via && !s.via.startsWith("related") && <span className="data text-[10px] text-terracotta">matched “{s.via}”</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        <select aria-label="Content type" className={select} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All content types</option>
          {(Object.keys(typeLabels) as EntryType[]).filter((t) => t !== "subject").map((t) => (
            <option key={t} value={t}>{typeLabels[t]}{q && typeCounts[t] ? ` (${typeCounts[t]})` : ""}</option>
          ))}
        </select>
        <select aria-label="Period" className={select} value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="">All periods</option>
          {periods.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <select aria-label="Country" className={select} value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries (present-day)</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="Subject" className={select} value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">All subjects</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </div>

      {!q && (
        <div className="mt-14">
          <p className="eyebrow mb-4">Try a search — alternate spellings and historical names work too</p>
          <div className="flex flex-wrap gap-2">
            {SUGGEST.map((s) => (
              <button key={s} onClick={() => setQ(s)} className="font-display text-xl border rule px-4 py-2 hover:border-terracotta hover:text-terracotta">{s}</button>
            ))}
          </div>
        </div>
      )}

      {q && (
        <div className="mt-12 grid lg:grid-cols-[1fr_300px] gap-12">
          <div>
            <p className="data text-stone mb-4" aria-live="polite">{hits.length} result{hits.length === 1 ? "" : "s"} for “{q}”</p>
            {hits.length === 0 && (
              <p className="font-display text-2xl text-stone">No entries match. Try a historical name, a modern place name, or fewer filters.</p>
            )}
            <ol className="border-t rule">
              {hits.map((h) => (
                <li key={h.doc.id}>
                  <Link href={h.doc.href} className="group block py-5 border-b rule">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="eyebrow">{typeLabels[h.doc.type]}</span>
                      {h.doc.dateLabel && <span className="data text-stone">{h.doc.dateLabel}</span>}
                      {h.doc.country && <span className="data text-stone">◇ {h.doc.country}</span>}
                      {h.via && <span className="data text-[10px] text-terracotta">{h.via.startsWith("related") ? h.via : `also known as “${h.via}”`}</span>}
                    </div>
                    <h2 className="font-display text-[1.65rem] leading-tight mt-1 group-hover:text-terracotta">{h.doc.title}</h2>
                    <p className="text-sm text-stone mt-1 line-clamp-2 max-w-3xl">{h.doc.summary}</p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          {recs.length > 0 && top && (
            <aside className="self-start lg:sticky lg:top-24 bg-sage-pale/60 border border-sage/30 p-6">
              <p className="eyebrow !text-sage-deep">Related to your exploration of</p>
              <p className="font-display text-2xl mt-1">{top.doc.title}</p>
              <ul className="mt-5 space-y-4">
                {recs.map((d) => (
                  <li key={d.id}>
                    <Link href={d.href} className="group block">
                      <span className="eyebrow">{typeLabels[d.type]}</span>
                      <span className="block font-display text-lg leading-tight group-hover:text-terracotta">{d.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
