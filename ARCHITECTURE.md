# Indophile — Architecture

> Build the simplest architecture capable of supporting the full vision.

## 1. What the product actually needs

| Requirement | What it implies |
|---|---|
| ~12 entity types (periods, polities, sites, artefacts, people, events, studies, concepts, scripts, routes, articles, collections) that all reference each other | A **graph of typed records with relations** — relational, not document-per-page |
| BCE/CE dates, ranges, approximate and debated dates, overlapping periods | Signed integer years + an explicit **precision** field; no `Date` objects |
| Coordinates, routes, and *time-dependent, uncertain* territories with provenance | Geometry stored **separately** from prose; territories derived from evidence; GeoJSON-compatible |
| Every claim traceable; sources reused across entries | A **shared bibliography table** + citations at entry *and* section level |
| Drafts, review, publishing, "hard to publish unsupported claims" | Status field + **automated validation that blocks publishing** |
| Full-text search with alternate spellings and historical names | Alias lists + normalisation; full-text index later |
| Expected volume: hundreds → low tens of thousands of entries | Fits comfortably in one PostgreSQL database; no search cluster, no microservices |

## 2. Stack (and why each piece is there)

| Layer | Choice | Why it's necessary |
|---|---|---|
| Web framework | **Next.js (App Router), TypeScript** | Static generation of every entity page (fast loads, cheap hosting, good SEO) plus server components so heavy data never ships to the browser. Already the project's scaffold. |
| Styling | **Tailwind CSS v4** with a small token set | Design tokens (parchment, ivory, ink, terracotta, sage, gold) in one place; no component library to fight. |
| Maps | **Leaflet** (+ Esri World Terrain basemap, optional CARTO labels) | Mature, small, canvas renderer handles thousands of points; no API key; basemap is swappable. MapLibre/vector tiles only if we later need custom-styled vector basemaps. |
| Content store (Phase 1) | **Typed TypeScript seed files in `src/data/`** behind a data-access layer (`src/lib/db.ts`) | Version history and review come free from git + PRs; zero hosting cost; the compiler enforces the schema. |
| Content store (Phase 3+) | **PostgreSQL + PostGIS** | Relations, full-text search (`tsvector` + `pg_trgm` for fuzzy spelling), spatial queries, and temporal ranges in one boring, portable database. Pages don't change — only `db.ts` does. |
| Images | `public/images` + `next/image` (AVIF/WebP, lazy loading) with an attribution registry (`src/data/images.json`) | Every image carries author, licence and source URL. Move to object storage + CDN when the archive grows. |
| Search | In-memory index built from the graph (`src/lib/search.ts`) | Instant at current scale; no service to run. Same document shape maps onto Postgres FTS later. |
| Auth (editorial) | HTTP Basic via middleware, fail-closed in production | Adequate for a read-only dashboard; replaced by the CMS's session auth when editing moves into the app. |

**Deliberately not used:** separate search engine, GraphQL, headless-CMS SaaS, microservices, a client state library. Each can be added if a measured need appears.

## 3. Data model

```
entry (id, type, title, aliases[], summary, status, evidence, updated, editor,
       date_start, date_end, date_precision, date_label, payload jsonb)
entry_relation (from_id, to_id, kind)            -- stored once; reverse links computed
entry_period   (entry_id, period_id)
entry_subject  (entry_id, subject_id)
source         (id, kind, authors, year, title, container, publisher, doi, url, verified)
citation       (entry_id, section_key NULL, source_id, locus, supports)
geometry       (entry_id, geom geography, basis, approximate, valid_from, valid_to, confidence)
image          (id, path, width, height, artist, license, source_url)
revision       (entry_id, version, author, created_at, diff jsonb, review_status)
```

In the seed repository these tables are TypeScript arrays (`src/lib/types.ts` defines the shapes). Key decisions:

- **Relations are stored once.** `related: [...]` on one side; `db.related(id)` returns both directions.
- **Dates** are signed years (`-322` = 322 BCE) with `precision: secure | conventional | approximate | debated`. Ranges may be open (`end` omitted). Labels like "3rd century BCE" are optional overrides.
- **Borders come from a published dataset, never generated.** Political boundaries are Cliopatria v0.2.1 (Seshat Global History Databank; Cioni et al. 2025, *Scientific Data*; CC BY 4.0), clipped to South Asia and simplified into `public/geo/polities.json` (1,515 dated boundary versions). `src/lib/cliopatria.ts` links Cliopatria names to Indophile polity records and carries the required credit. Polities absent from Cliopatria are shown only by their located places (capitals, inscriptions, monuments in `extent.anchors`). To refresh: download a new Cliopatria release and rerun the clip/simplify step (see the comment at the top of `src/lib/cliopatria.ts`).
- **Routes** store attested waypoints and declare `geometryBasis: attested-waypoints | schematic`; migration routes are always schematic model arrows.
- **Genetics**: studies record `evidenceType` (direct ancient DNA / modelling / mixed); concepts record `basis` (observed / statistical construct). No ancestry percentages are stored.

## 4. Editorial integrity, enforced in code

`src/lib/validate.ts` checks every entry: sources present and known, sections marked *established* or *well supported* must cite something, periods and collection items must exist, images must have attribution records, relations must resolve. The admin dashboard shows the queue; **the production build fails** if any *published* entry has a blocking error (`assertPublishedValid` in the root layout). Drafts may be incomplete; published entries may not.

Public reads (`getEntry`, `entriesOfType`, `related`, search, map payloads) only ever return `status === "published"`.

## 5. Map pipeline

`src/lib/mapdata.ts` serialises published sites, routes and evidence-derived territories into a compact JSON payload; client components (`src/components/map/*`) filter by layer and year. Geographic data stays separate from editorial prose. For large datasets the next steps are: (1) serve the payload per viewport/period from an API backed by PostGIS, (2) cluster points at low zoom, (3) vector tiles for territories.

## 6. Migration path to PostgreSQL

1. Create the schema above (PostGIS for `geometry`).
2. One-off script: import `src/data/*.ts` → tables (the shapes map 1:1).
3. Re-implement the ~12 functions in `src/lib/db.ts` as SQL queries; keep their signatures.
4. Build the editor UI on top of the same validation rules (`validate.ts` runs server-side before any status change to `published`).
5. Nightly `pg_dump` to object storage; content and geodata remain exportable as JSON/GeoJSON at all times (no vendor lock-in).

## 7. Directory map

```
src/
  app/            routes (one folder per page template)
  components/     UI primitives, map, timeline, search, editorial blocks
  data/           seed dataset — sources, periods, polities, sites, people,
                  events, artefacts, genetics, scripts, routes, editorial
  lib/            types, db (data access), geo, mapdata, search, timeline,
                  validate, format
  middleware.ts   editorial dashboard protection
public/images/    credited photographs (see src/data/images.json)
```
