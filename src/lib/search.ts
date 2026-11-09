/**
 * Search. The index is built server-side from the knowledge graph and shipped
 * to the client as a compact array; at the current scale (hundreds to low
 * thousands of entries) in-memory matching is instant and needs no service.
 * When the corpus outgrows this, the same `SearchDoc` shape maps onto
 * PostgreSQL full-text search with a trigram index for fuzzy spelling.
 */
import type { Entry, EntryType } from "./types";

export interface SearchDoc {
  id: string;
  type: EntryType;
  title: string;
  aliases: string[];
  summary: string;
  href: string;
  periods: string[];
  subjects: string[];
  country?: string;
  related: string[];
  dateLabel?: string;
  /** Pre-normalised haystacks */
  k: { title: string; aliases: string[]; body: string };
}

/**
 * Normalise for spelling-tolerant matching across transliteration
 * conventions: strips diacritics and punctuation and folds common variants
 * (sh/s, aa/a, ee/i, oo/u, w/v, ph/f, z/l for ழ in Keezhadi/Keeladi is
 * handled by aliases instead).
 */
export function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/sh/g, "s")
    .replace(/aa/g, "a")
    .replace(/ee/g, "i")
    .replace(/oo/g, "u")
    .replace(/ph/g, "f")
    .replace(/w/g, "v")
    .replace(/\s+/g, " ")
    .trim();
}

const squash = (s: string) => norm(s).replace(/ /g, "");

export function toSearchDoc(e: Entry, href: string, dateLabel?: string): SearchDoc {
  const country = e.type === "site" ? e.place.country : undefined;
  const extra =
    e.type === "site" ? `${e.place.modern} ${e.place.country} ${e.culture ?? ""}` :
    e.type === "study" ? `${e.authors} ${e.journal} ${e.region}` :
    e.type === "person" ? e.roles.join(" ") : "";
  return {
    id: e.id,
    type: e.type,
    title: e.title,
    aliases: e.aliases ?? [],
    summary: e.summary,
    href,
    periods: e.periods ?? [],
    subjects: e.subjects ?? [],
    country,
    related: e.related ?? [],
    dateLabel,
    k: {
      title: squash(e.title),
      aliases: (e.aliases ?? []).map(squash),
      body: norm(`${e.summary} ${extra}`),
    },
  };
}

export interface Hit {
  doc: SearchDoc;
  score: number;
  via?: string;
}

export function runSearch(docs: SearchDoc[], q: string): Hit[] {
  const nq = norm(q);
  if (!nq) return [];
  const sq = nq.replace(/ /g, "");
  const terms = nq.split(" ").filter((t) => t.length > 1);
  const hits: Hit[] = [];
  for (const doc of docs) {
    let score = 0;
    let via: string | undefined;
    if (doc.k.title === sq) score += 100;
    else if (doc.k.title.startsWith(sq)) score += 60;
    else if (doc.k.title.includes(sq)) score += 40;
    doc.k.aliases.forEach((a, i) => {
      if (a === sq) { score += 80; via = doc.aliases[i]; }
      else if (a.startsWith(sq) && sq.length > 2) { score += 45; via ??= doc.aliases[i]; }
    });
    for (const t of terms) {
      if (doc.k.body.includes(t)) score += 6;
      if (doc.k.title.includes(t)) score += 10;
    }
    if (score > 0) hits.push({ doc, score, via });
  }
  // Pull in direct neighbours of strong matches (e.g. "Pataliputra" -> Mauryan Empire)
  const strong = hits.filter((h) => h.score >= 60);
  const byId = new Map(docs.map((d) => [d.id, d]));
  const have = new Set(hits.map((h) => h.doc.id));
  for (const h of strong) {
    for (const rid of h.doc.related) {
      const d = byId.get(rid);
      if (d && !have.has(rid)) {
        hits.push({ doc: d, score: 5, via: `related to ${h.doc.title}` });
        have.add(rid);
      }
    }
  }
  return hits.sort((a, b) => b.score - a.score);
}
