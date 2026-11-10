# Geographic data licences

- `land.json`, `lakes.json`, `rivers.json`, `borders.json` — Natural Earth 1:50m, public domain. Clipped and rounded.
- `polities.json` — Cliopatria v0.2.1, Seshat Global History Databank (Cioni et al. 2025, Scientific Data 12:247, doi:10.1038/s41597-025-04516-9). CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/. Changes: clipped to South Asia, simplified (Douglas–Peucker, 0.015°), properties renamed.
- `hbm.json` — historical-basemaps by André Ourednik and contributors, https://github.com/aourednik/historical-basemaps. GPL-3.0 — https://www.gnu.org/licenses/gpl-3.0.html. Changes: clipped to South Asia, simplified, time slices merged with validity ranges. Built with `scripts/build-hbm.mjs`; this file is distributed under GPL-3.0.
