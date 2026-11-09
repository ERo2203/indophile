import type { DatePrecision, DateRange, Evidence, PolityKind } from "./types";

export function formatYear(y: number): string {
  if (y <= -10000) {
    const ago = Math.abs(y); // deep time: the BCE/BP offset is below the precision of these dates
    if (ago >= 1_000_000) return `${(ago / 1_000_000).toLocaleString("en", { maximumFractionDigits: 1 })} million years ago`;
    return `${Math.round(ago / 1000).toLocaleString("en")},000 years ago`;
  }
  if (y < 0) return `${Math.abs(y).toLocaleString("en").replace(",", "")} BCE`;
  return `${y} CE`;
}

export function formatRange(r?: DateRange): string {
  if (!r) return "Undated";
  if (r.label) return r.label;
  const circa = r.precision === "approximate" || r.precision === "debated" ? "c. " : "";
  if (r.end === undefined || r.end === r.start) return circa + formatYear(r.start);
  const sameEra = (r.start < 0) === (r.end < 0) && r.start > -10000;
  if (sameEra) {
    const era = r.start < 0 ? "BCE" : "CE";
    return `${circa}${Math.abs(r.start)} – ${Math.abs(r.end)} ${era}`;
  }
  return `${circa}${formatYear(r.start)} – ${formatYear(r.end)}`;
}

export const PRECISION: Record<DatePrecision, { label: string; note: string }> = {
  secure: { label: "Secure date", note: "Fixed by independent evidence such as a dated inscription." },
  conventional: { label: "Conventional date", note: "The date scholars use by convention; may rest on a single tradition." },
  approximate: { label: "Approximate", note: "Estimated range — radiocarbon, stratigraphy or style." },
  debated: { label: "Debated", note: "Substantially different chronologies exist." },
};

export const EVIDENCE: Record<Evidence, { label: string; note: string }> = {
  established: { label: "Established", note: "Supported by strong archaeological, textual or scientific evidence." },
  "well-supported": { label: "Well supported", note: "Supported by multiple credible sources; some details uncertain." },
  debated: { label: "Debated", note: "Competing scholarly interpretations exist." },
  hypothesis: { label: "Hypothesis", note: "An interpretation requiring further evidence." },
  unverified: { label: "Unverified", note: "Insufficient evidence to support the claim." },
};

export const POLITY_KIND: Record<PolityKind, string> = {
  "archaeological-culture": "Archaeological culture",
  civilisation: "Civilisation",
  janapada: "Janapada",
  republic: "Gana-sangha / republic",
  kingdom: "Kingdom",
  empire: "Empire",
  sultanate: "Sultanate",
  confederacy: "Confederacy",
  colonial: "Colonial polity",
  "nation-state": "Nation-state",
};

/** Does a date range overlap a given year (with tolerance in years)? */
export function activeAt(r: DateRange | undefined, year: number, tolerance = 0): boolean {
  if (!r) return false;
  const end = r.end ?? r.start;
  return r.start - tolerance <= year && year <= end + tolerance;
}

export function citeLabel(authors: string, year: number): string {
  const first = authors.split(/[,&]/)[0].trim();
  const multi = /et al\.|&|,.*,/.test(authors);
  return `${first}${multi ? " et al." : ""} ${year}`.replace(" et al. et al.", " et al.");
}
