/**
 * Global mean sea level relative to present, in metres, by age in thousands of
 * calendar years before 1950 (ka BP). Columns: [ka, level, 1-sigma error].
 *
 * Source: Spratt, R. M. & Lisiecki, L. E. (2016), "A Late Pleistocene sea level
 * stack", Climate of the Past 12: 1079-1092 — column SeaLev_shortPC1 (first
 * principal component of seven records, 0-430 ka) and its
 * 1-sigma error, as archived by NOAA NCEI Paleoclimatology (spratt2016.txt).
 * Values copied unchanged for 0-55 ka.
 *
 * The stack is built from ocean-sediment records and is coarse for the last
 * few thousand years (it reads several metres above today for 0-4 ka, which
 * coral and shoreline records do not support), so the atlas never floods land
 * above the present coastline: positive values are treated as 0.
 */
export const SEA_LEVEL_SOURCE = "spratt-lisiecki-2016";

export const SEA_LEVEL: [number, number, number][] = [
  [0, 8.49, 5.23],
  [1, 7.63, 4.87],
  [2, 4.01, 4.83],
  [3, 4.35, 4.72],
  [4, 3.13, 4.74],
  [5, 0.0, 4.57],
  [6, -4.01, 5.04],
  [7, -6.11, 5.9],
  [8, -9.09, 6.79],
  [9, -15.83, 8.3],
  [10, -24.59, 10.3],
  [11, -35.85, 11.93],
  [12, -51.05, 12.3],
  [13, -66.3, 12.38],
  [14, -76.64, 12.35],
  [15, -86.57, 12.34],
  [16, -98.06, 12.28],
  [17, -107.3, 11.96],
  [18, -113.01, 11.16],
  [19, -116.68, 10.61],
  [20, -117.56, 10.08],
  [21, -120.01, 9.14],
  [22, -125.82, 7.66],
  [23, -128.72, 5.27],
  [24, -130.0, 4.38],
  [25, -126.89, 4.5],
  [26, -122.4, 5.15],
  [27, -118.28, 5.44],
  [28, -115.19, 5.74],
  [29, -110.87, 5.64],
  [30, -105.78, 5.72],
  [31, -103.5, 5.81],
  [32, -100.63, 6.14],
  [33, -97.48, 6.4],
  [34, -97.37, 6.64],
  [35, -98.83, 6.67],
  [36, -99.39, 6.81],
  [37, -95.27, 6.54],
  [38, -93.1, 6.16],
  [39, -90.3, 5.66],
  [40, -85.9, 5.74],
  [41, -79.76, 5.67],
  [42, -75.76, 5.2],
  [43, -73.91, 4.72],
  [44, -76.18, 4.8],
  [45, -74.49, 4.75],
  [46, -75.78, 5.1],
  [47, -73.7, 5.05],
  [48, -76.71, 5.49],
  [49, -73.75, 6.04],
  [50, -68.3, 6.49],
  [51, -63.11, 6.1],
  [52, -67.88, 6.37],
  [53, -68.85, 6.73],
  [54, -70.05, 7.18],
  [55, -72.26, 7.5],
];

/** Sea level (m, ≤ 0) and its 1-sigma error for a calendar year (negative = BCE). */
export function seaLevelAt(year: number): { level: number; err: number } {
  const ka = (1950 - year) / 1000;
  const last = SEA_LEVEL[SEA_LEVEL.length - 1];
  if (ka <= 0) return { level: 0, err: SEA_LEVEL[0][2] };
  if (ka >= last[0]) return { level: Math.min(0, last[1]), err: last[2] };
  const i = Math.floor(ka);
  const [a0, l0, e0] = SEA_LEVEL[i], [, l1, e1] = SEA_LEVEL[i + 1];
  const t = ka - a0;
  return { level: Math.min(0, l0 + (l1 - l0) * t), err: e0 + (e1 - e0) * t };
}
