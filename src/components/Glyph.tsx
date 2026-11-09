/** Line glyphs for subjects — drawn in a single, consistent hand. */
const PATHS: Record<string, React.ReactNode> = {
  trowel: <><path d="M6 26 18 14" /><path d="m16 8 8 8-6 6-8-8z" /><path d="M5 27l2-2" /></>,
  helix: <><path d="M10 4c0 8 12 8 12 16s-12 8-12 8" /><path d="M22 4c0 8-12 8-12 16s12 8 12 8" /><path d="M12 9h8M11 16h10M12 23h8" /></>,
  city: <><path d="M4 28h24" /><path d="M7 28V14h6v14M13 28V8h8v20M21 28V17h5v11" /><path d="M16 12h2M16 16h2M16 20h2" /></>,
  crown: <><path d="M5 23 4 10l7 6 5-9 5 9 7-6-1 13z" /><path d="M6 27h20" /></>,
  contour: <><ellipse cx="16" cy="16" rx="12" ry="8" /><ellipse cx="17" cy="15" rx="7.5" ry="5" /><ellipse cx="18" cy="14.5" rx="3.5" ry="2.2" /></>,
  arrows: <><path d="M4 22c6-10 14-12 24-12" /><path d="m24 6 4 4-4 4" /><path d="M4 28c5-5 10-6 16-6" /><path d="m17 19 3 3-3 3" /></>,
  script: <><path d="M6 8h20M6 8v6M16 8v14M26 8v4" /><path d="M10 20c2 3 4 3 6 2" /><path d="M20 18h6v8" /></>,
  lotus: <><path d="M16 26c-6 0-11-4-12-9 4 0 8 2 12 9z" /><path d="M16 26c6 0 11-4 12-9-4 0-8 2-12 9z" /><path d="M16 26c-3-4-4-9 0-16 4 7 3 12 0 16z" /></>,
  arch: <><path d="M5 28V14a11 11 0 0 1 22 0v14" /><path d="M10 28V15a6 6 0 0 1 12 0v13" /><path d="M3 28h26" /></>,
  ship: <><path d="M4 21h24l-4 6H8z" /><path d="M16 21V4" /><path d="M16 5c5 3 7 8 7 13h-7" /><path d="M16 8c-4 3-5 6-5 10h5" /></>,
  gear: <><circle cx="16" cy="16" r="4" /><path d="M16 4v4M16 24v4M4 16h4M24 16h4M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M7.5 24.5l2.8-2.8M21.7 10.3l2.8-2.8" /></>,
  bust: <><circle cx="16" cy="11" r="5" /><path d="M7 28c0-6 4-10 9-10s9 4 9 10" /><path d="M5 28h22" /></>,
};

export function Glyph({ name, className = "w-8 h-8" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name] ?? PATHS.contour}
    </svg>
  );
}
