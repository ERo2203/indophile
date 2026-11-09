/**
 * Hero backdrop: a restrained contour-and-graticule plate, like the margin of a
 * survey sheet. Deterministic (no random), pure SVG, no image weight.
 */
export function HeroTerrain({ className = "" }: { className?: string }) {
  // Deterministic contour rings around two "massifs"
  const rings = (cx: number, cy: number, n: number, rx: number, ry: number, wob: number, seed: number) =>
    Array.from({ length: n }, (_, i) => {
      const k = i + 1;
      const pts = Array.from({ length: 48 }, (_, j) => {
        const a = (j / 48) * Math.PI * 2;
        const r = 1 + Math.sin(a * 3 + seed + k * 0.4) * wob * 0.5 + Math.cos(a * 5 + seed * 2) * wob * 0.3;
        return [cx + Math.cos(a) * rx * k * r, cy + Math.sin(a) * ry * k * r];
      });
      return "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join("L") + "Z";
    });
  const a = rings(930, 260, 14, 34, 22, 0.18, 1.3);
  const b = rings(1180, 520, 9, 30, 20, 0.22, 4.1);
  return (
    <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="fade" x1="0" x2="1">
          <stop offset="0" stopColor="#F3EFE6" stopOpacity="1" />
          <stop offset="0.38" stopColor="#F3EFE6" stopOpacity="0.85" />
          <stop offset="1" stopColor="#F3EFE6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* graticule */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * 120} y1="0" x2={i * 120 - 40} y2="800" stroke="#24231F" strokeOpacity="0.06" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 110 + 30} x2="1440" y2={i * 110 + 10} stroke="#24231F" strokeOpacity="0.06" />
      ))}
      {a.map((d, i) => (
        <path key={`a${i}`} d={d} fill="none" stroke={i % 5 === 4 ? "#A65D43" : "#4E5B45"} strokeOpacity={i % 5 === 4 ? 0.35 : 0.22} strokeWidth={i % 5 === 4 ? 1.2 : 0.8} />
      ))}
      {b.map((d, i) => (
        <path key={`b${i}`} d={d} fill="none" stroke="#4E5B45" strokeOpacity="0.18" strokeWidth="0.8" />
      ))}
      {/* a river */}
      <path d="M760 40 C 820 180, 760 300, 840 420 S 900 640, 1010 800" fill="none" stroke="#7F8D6E" strokeOpacity="0.45" strokeWidth="2" />
      <path d="M1080 120 C 1060 220, 1120 300, 1090 420" fill="none" stroke="#7F8D6E" strokeOpacity="0.3" strokeWidth="1.2" />
      {/* site marks */}
      {[[848, 430, "27°19′N 68°08′E"], [1004, 214, "30°37′N 72°51′E"], [1238, 612, "23°53′N 70°12′E"]].map(([x, y, t]) => (
        <g key={String(t)}>
          <circle cx={+x} cy={+y} r="4" fill="#A65D43" />
          <circle cx={+x} cy={+y} r="11" fill="none" stroke="#A65D43" strokeOpacity="0.4" />
          <text x={+x + 16} y={+y + 4} fontFamily="var(--font-plex-mono)" fontSize="11" fill="#77736A" letterSpacing="0.06em">{t}</text>
        </g>
      ))}
      <rect width="1440" height="800" fill="url(#fade)" />
    </svg>
  );
}
