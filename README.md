# INDOPHILE

*Discover the stories beneath our civilisation.*

An interactive historical atlas of the Indian subcontinent: archaeology, archaeogenetics, polities, scripts, trade and material culture, built as one interconnected, evidence-driven knowledge base.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build — fails if a published entry is unsupported
```

The editorial dashboard (`/admin`) is open in development. In production it returns 404 unless `ADMIN_USER` and `ADMIN_PASSWORD` are set, in which case it requires HTTP Basic auth.

## What's here

| Template | Route |
|---|---|
| Homepage | `/` |
| Historical timeline | `/timeline` |
| Interactive atlas (layers, time slider, info panels, deep links) | `/atlas?year=-250&layers=inscription,polity&focus=girnar` |
| Period overview | `/periods/[id]` |
| Civilisation / kingdom / empire / republic | `/civilisations`, `/civilisations/[id]` |
| Archaeology archive & site detail | `/archaeology`, `/sites/[id]` |
| Artefact | `/artefacts/[id]` |
| Ancient DNA archive & study | `/genetics`, `/genetics/[id]` |
| Personality | `/people`, `/people/[id]` |
| Historical event | `/events/[id]` |
| Languages & scripts | `/languages` |
| Architecture & material culture | `/architecture` |
| Trade & migration maps | `/trade` |
| Editorial article | `/articles/[id]` |
| Curated collection | `/collections`, `/collections/[id]` |
| Search (aliases, historical names, filters) | `/search?q=Pataliputra` |
| About · Methodology · Bibliography | `/about`, `/methodology`, `/sources` |
| Subject discovery | `/explore`, `/explore/[id]` |
| Reading list (browser-local) | `/reading-list` |
| Editorial dashboard | `/admin` |

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for the stack, data model, and the migration path to PostgreSQL/PostGIS.

## Content status

The seed dataset covers Phase 2 periods (prehistory → Gupta) in depth and frames later periods. Facts were written conservatively from standard works, with dates marked by precision and contested claims flagged; **every bibliographic record and entry still needs review by a subject editor before public launch.** Photographs come from Wikimedia Commons and are credited on every plate with their licences (mostly CC BY-SA — keep attribution when reusing).

## Adding content

1. Add or edit a record in `src/data/*.ts` (types in `src/lib/types.ts`).
2. Cite sources by id from `src/data/sources.ts` — add a new source record if needed.
3. Link related entries by id (`related: [...]`); reverse links appear automatically.
4. For a polity's territory, list evidence find-spots in `extent.evidence` — never draw a boundary.
5. Check `/admin` for validation issues; the build will refuse unsupported published entries.
