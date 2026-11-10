/**
 * Indophile content model.
 *
 * Every piece of knowledge is a typed `Entry` in one graph. Entries reference
 * each other by id; reverse links are derived at query time, so a relationship
 * is only ever stored once. Sources live in their own table and are cited from
 * entries (and from individual claims) by id, so one bibliography record can
 * back many entries.
 *
 * The shapes here map 1:1 onto the relational schema described in
 * ARCHITECTURE.md (entry, entry_relation, source, citation, geometry,
 * revision), so the in-repo seed data can be migrated to PostgreSQL/PostGIS
 * without changing any page code.
 */

/** Year on a signed axis: negative = BCE, positive = CE. There is no year 0. */
export type Year = number;

/**
 * How securely a date is known.
 * - secure:       independently fixed (e.g. dated inscription, synchronism)
 * - conventional: the date scholars use by convention; may rest on one tradition
 * - approximate:  "c." — calibrated radiocarbon ranges, stratigraphic estimates
 * - debated:      substantially different chronologies are in the literature
 */
export type DatePrecision = "secure" | "conventional" | "approximate" | "debated";

export interface DateRange {
  start: Year;
  end?: Year;
  precision: DatePrecision;
  /** Optional human label that overrides the computed one, e.g. "3rd century BCE". */
  label?: string;
  note?: string;
}

/**
 * Evidence classification used across the platform (see /methodology).
 */
export type Evidence =
  | "established"
  | "well-supported"
  | "debated"
  | "hypothesis"
  | "unverified";

export type Status = "draft" | "in-review" | "published";

export type EntryType =
  | "period"
  | "polity"
  | "site"
  | "artefact"
  | "person"
  | "event"
  | "study"
  | "script"
  | "article"
  | "collection"
  | "route"
  | "subject"
  | "concept";

export type PolityKind =
  | "archaeological-culture"
  | "civilisation"
  | "janapada"
  | "republic"
  | "kingdom"
  | "empire"
  | "sultanate"
  | "confederacy"
  | "colonial"
  | "chiefdom"
  | "nation-state";

export type MapLayer =
  | "archaeological"
  | "settlement"
  | "polity"
  | "migration"
  | "trade"
  | "religious"
  | "battle"
  | "inscription"
  | "port"
  | "unesco"
  | "temple"
  | "hotspot"
  | "language"
  | "fossil";

export interface Citation {
  sourceId: string;
  /** Page/locus within the source. */
  locus?: string;
  /** The specific claim this citation supports, when not the whole entry. */
  supports?: string;
}

export interface ImageRef {
  /** Key into the image registry (public/images + attribution). */
  id: string;
  caption: string;
}

export interface Place {
  lat: number;
  lng: number;
  /** Present-day administrative location. */
  modern: string;
  country: Country;
  /** True when the precise location is itself uncertain. */
  approximate?: boolean;
}

export type Country =
  | "India"
  | "Pakistan"
  | "Bangladesh"
  | "Nepal"
  | "Bhutan"
  | "Sri Lanka"
  | "Afghanistan"
  | "Maldives"
  | "Beyond";

export interface Section {
  /** Optional editorial rubric, e.g. "FROM THE TRENCHES". */
  kind?:
    | "map-check"
    | "trenches"
    | "dna"
    | "faces"
    | "record"
    | "unknown"
    | "plain";
  heading: string;
  body: string[];
  evidence?: Evidence;
  cite?: Citation[];
}

interface BaseEntry {
  id: string;
  type: EntryType;
  title: string;
  /** Alternate spellings, historical names, modern names — fed to search. */
  aliases?: string[];
  summary: string;
  dates?: DateRange;
  /** Period ids this entry belongs to. */
  periods?: string[];
  /** Outgoing relationships; reverse links are computed. */
  related?: string[];
  subjects?: string[];
  cite: Citation[];
  evidence?: Evidence;
  image?: ImageRef;
  status: Status;
  updated: string;
  /** Editor or contributor responsible for the last revision. */
  editor?: string;
}

export interface PeriodEntry extends BaseEntry {
  type: "period";
  order: number;
  phase: 1 | 2 | 3 | 4;
  developments: string[];
  keySites: string[];
  sections?: Section[];
}

export interface PolityEntry extends BaseEntry {
  type: "polity";
  kind: PolityKind;
  capitals?: { name: string; place?: string; note?: string }[];
  rulers?: { name: string; person?: string; dates?: DateRange; note?: string }[];
  structure?: string;
  sections: Section[];
  /**
   * Territory is never drawn by hand. It is derived from the find-spots of
   * the listed evidence entries (inscriptions, sites, coins) — see
   * src/lib/geo.ts — and is always rendered as an estimate.
   */
  extent?: {
    /** Ids of sourced site entries whose find-spots attest the polity's reach. */
    evidence?: string[];
    /** Capitals, dated monuments and inscription find-spots given inline. */
    anchors?: Anchor[];
    /** Separate, non-contiguous holdings (e.g. colonial enclaves); each is enveloped on its own. */
    zones?: Anchor[][];
    /** Envelope radius around each anchor, in degrees (default 0.8). */
    radius?: number;
    basis: string;
    confidence: "documented" | "estimated" | "disputed";
    maxExtent?: DateRange;
  };
}

export interface Anchor {
  name: string;
  lat: number;
  lng: number;
  /** What attests the polity here: capital, inscription, monument, port… */
  role?: string;
  /** Years during which this place counts towards the polity's extent (conquest, loss, foundation). */
  from?: number;
  to?: number;
}

export interface SiteEntry extends BaseEntry {
  type: "site";
  place: Place;
  layers: MapLayer[];
  culture?: string;
  discovered?: { year?: number; by?: string; note?: string };
  excavations?: { years: string; by: string; institution?: string }[];
  findings?: string[];
  datingMethods?: string[];
  unesco?: { id: number; year: number };
  /** Religious tradition(s) of a sacred site, for the religion theme. */
  tradition?: Tradition[];
  sections?: Section[];
}

export type Tradition = "buddhist" | "jain" | "hindu" | "islamic" | "sikh" | "christian" | "zoroastrian" | "jewish" | "ajivika" | "vedic";

export interface ArtefactEntry extends BaseEntry {
  type: "artefact";
  material: string;
  foundAt?: string;
  findspot?: string;
  collection?: string;
  dimensions?: string;
  interpretation: string[];
  provenance?: string;
}

export interface PersonEntry extends BaseEntry {
  type: "person";
  roles: string[];
  biography: string[];
  contributions?: string[];
  debates?: string[];
  primarySources?: string[];
}

export interface EventEntry extends BaseEntry {
  type: "event";
  category:
    | "political"
    | "battle"
    | "discovery"
    | "inscription"
    | "religious"
    | "migration"
    | "technology"
    | "cultural"
    | "environmental";
  place?: Place;
  significance: string;
}

export interface StudyEntry extends BaseEntry {
  type: "study";
  authors: string;
  year: number;
  journal: string;
  doi?: string;
  institutions?: string[];
  region: string;
  sampleDates?: string;
  individuals?: string;
  method: string[];
  findings: string[];
  limitations: string[];
  laterWork?: string[];
  /** direct = ancient DNA from individuals; model = statistical inference on modern/ancient data. */
  evidenceType: "direct-ancient-dna" | "modern-dna-modelling" | "mixed";
  samples?: { label: string; lat: number; lng: number; date: string; note?: string }[];
}

export interface ScriptEntry extends BaseEntry {
  type: "script";
  family: string;
  direction?: string;
  deciphered: "yes" | "partly" | "no";
  region: string;
  attestations: { label: string; site?: string; date: string }[];
  sections: Section[];
}

export interface ArticleEntry extends BaseEntry {
  type: "article";
  standfirst: string;
  author: string;
  readingMinutes: number;
  region: string;
  sections: Section[];
  /** Entries whose coordinates appear on the article's MAP CHECK. */
  mapEntries?: string[];
}

export interface CollectionEntry extends BaseEntry {
  type: "collection";
  curator: string;
  intro: string[];
  items: { id: string; note: string }[];
}

export interface RouteEntry extends BaseEntry {
  type: "route";
  layer: "trade" | "migration";
  path: [number, number][];
  /** How the line should be read: attested route, or schematic model arrow. */
  geometryBasis: "attested-waypoints" | "schematic";
  commodities?: string[];
}

export interface SubjectEntry extends BaseEntry {
  type: "subject";
  blurb: string;
  glyph: string;
}

export interface ConceptEntry extends BaseEntry {
  type: "concept";
  domain: "genetics" | "geography" | "method";
  sections: Section[];
  /** For genetic ancestry concepts: is it observed directly in ancient genomes, or a modelled construct? */
  basis?: "direct-ancient-dna" | "statistical-model";
}

export type Entry =
  | ConceptEntry
  | PeriodEntry
  | PolityEntry
  | SiteEntry
  | ArtefactEntry
  | PersonEntry
  | EventEntry
  | StudyEntry
  | ScriptEntry
  | ArticleEntry
  | CollectionEntry
  | RouteEntry
  | SubjectEntry;

export type SourceKind =
  | "journal-article"
  | "book"
  | "excavation-report"
  | "primary-source"
  | "inscription-corpus"
  | "unesco"
  | "museum-record"
  | "institutional";

export interface Source {
  id: string;
  kind: SourceKind;
  authors: string;
  year: number;
  title: string;
  container?: string;
  publisher?: string;
  doi?: string;
  url?: string;
  /** Editorial verification of the bibliographic record itself. */
  verified: boolean;
}

export interface ImageRecord {
  src: string;
  width: number;
  height: number;
  artist: string;
  license: string;
  sourceUrl: string;
  title: string;
}
