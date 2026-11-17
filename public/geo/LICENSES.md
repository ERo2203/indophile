# Geographic data licences

- `land.json`, `lakes.json`, `rivers.json`, `borders.json` — Natural Earth 1:50m, public domain. Clipped and rounded.
- `polities.json` — Cliopatria v0.2.1, Seshat Global History Databank (Cioni et al. 2025, Scientific Data 12:247, doi:10.1038/s41597-025-04516-9). CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/. Changes: clipped to South Asia, simplified (Douglas–Peucker, 0.015°), properties renamed.
- `hbm.json` — historical-basemaps by André Ourednik and contributors, https://github.com/aourednik/historical-basemaps. GPL-3.0 — https://www.gnu.org/licenses/gpl-3.0.html. Changes: clipped to South Asia, simplified, time slices merged with validity ranges. Built with `scripts/build-hbm.mjs`; this file is distributed under GPL-3.0.
- `shelf.json` — derived from NOAA NCEI ETOPO 2022 60 arc-second global relief model (doi:10.25921/fd45-gt74), subset to 2°S–40°N, 55–105°E at 3 arc-minutes. NOAA states the data may be used and redistributed for free. Changes: outlines of land above each sea level from −130 to −5 m in 5 m steps, simplified. Built with `scripts/build-shelf.py`.
- `src/data/sea-level.ts` — global sea level 0–55 ka from Spratt & Lisiecki (2016), Climate of the Past 12: 1079–1092, as archived by NOAA NCEI Paleoclimatology (public data). Values copied unchanged; positive values are drawn as today's coastline.
