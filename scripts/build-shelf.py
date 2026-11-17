"""Build public/geo/shelf.json: land outlines for lowered sea levels.

Usage:
  python3 scripts/build-shelf.py data-raw/etopo_sa.csv public/geo/shelf.json

Input: NOAA NCEI ETOPO 2022, 60 arc-second ice-surface grid, subset via ERDDAP
(dataset ETOPO_2022_v1_60s) to 2S-40N, 55-105E with a stride of 3 (3 arc-minutes):
  https://oceanwatch.pifsc.noaa.gov/erddap/griddap/ETOPO_2022_v1_60s.csv?z[(-2.0):3:(40.0)][(55.0):3:(105.0)]

For each level L (metres below present sea level) the output holds the rings of
the area where today's surface is higher than L. Drawn under present land with
the even-odd fill rule, the band between the two is the shelf exposed at that
sea level. This is a bathtub model: it ignores isostatic adjustment, tectonics,
and sediment laid down or eroded since (the Bengal and Indus deltas especially).
"""
import json
import sys

import numpy as np
from skimage.measure import approximate_polygon, find_contours

src, out = sys.argv[1], sys.argv[2]
raw = np.genfromtxt(src, delimiter=",", skip_header=2)
lats, lngs = np.unique(raw[:, 0]), np.unique(raw[:, 1])
grid = np.full((len(lats), len(lngs)), np.nan)
grid[np.searchsorted(lats, raw[:, 0]), np.searchsorted(lngs, raw[:, 1])] = raw[:, 2]
dlat, dlng = lats[1] - lats[0], lngs[1] - lngs[0]

LEVELS = list(range(-130, 0, 5))  # -130 ... -5 m
TOL = 0.6  # simplification tolerance in grid cells (~3.6 km)
MIN_CELLS = 6  # drop specks smaller than about six grid cells


def ring_area(r):
    x, y = r[:, 1], r[:, 0]
    return 0.5 * abs(np.dot(x, np.roll(y, 1)) - np.dot(y, np.roll(x, 1)))


levels = []
for L in LEVELS:
    mask = np.where(np.isnan(grid), 0.0, (grid > L).astype(float))
    padded = np.pad(mask, 1, constant_values=0.0)  # close rings at the frame
    rings = []
    for c in find_contours(padded, 0.5):
        if ring_area(c) < MIN_CELLS:
            continue
        c = approximate_polygon(c, TOL)
        if len(c) < 4:
            continue
        ring = [[round(float(lngs[0] + (x - 1) * dlng), 2), round(float(lats[0] + (y - 1) * dlat), 2)] for y, x in c]
        if ring[0] != ring[-1]:
            ring.append(ring[0])
        rings.append(ring)
    levels.append({"level": L, "rings": rings})
    print(L, len(rings), sum(len(r) for r in rings))

json.dump(
    {
        "source": "NOAA NCEI ETOPO 2022 (60 arc-second, subset at 3 arc-minutes). Bathtub model by Indophile.",
        "levels": levels,
    },
    open(out, "w"),
    separators=(",", ":"),
)
