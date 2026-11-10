/**
 * The Indophile mark: an incised glyph — two cuts that rise from a crossed
 * tail into a pointed almond, with a short arm either side. Drawn as a groove
 * (a broad, faint channel under a narrow cut) so it reads as carved, not inked.
 */
const CUTS = [
  "M16 3.2C10.6 8 10.1 15.4 16 20.6S21.6 26.6 23.4 28.8",
  "M16 3.2C21.4 8 21.9 15.4 16 20.6S10.4 26.6 8.6 28.8",
  "M11.3 12.6 4.2 13.9",
  "M20.7 12.6 27.8 13.9",
];

export function Mark({ className = "w-7 h-7", accent = true }: { className?: string; accent?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {CUTS.map((d) => (
        <path key={`g${d}`} d={d} stroke="currentColor" strokeOpacity="0.18" strokeWidth="3.6" />
      ))}
      {CUTS.map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth="1.7" />
      ))}
      {accent && <circle cx="16" cy="20.6" r="1.25" style={{ fill: "var(--color-terracotta)" }} />}
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark />
      <span className="font-display text-[1.45rem] font-semibold tracking-[0.2em] leading-none">INDOPHILE</span>
    </span>
  );
}
