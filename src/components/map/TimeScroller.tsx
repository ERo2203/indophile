"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { PeriodBand } from "@/lib/maptypes";
import { formatYear } from "@/lib/format";

/**
 * A horizontal time ribbon with a fixed needle in the centre. Scrolling,
 * dragging, the wheel, the arrow keys, era buttons or "play" move history
 * under the needle; the year under the needle drives the map.
 */

// Piecewise scale: compress the deep past, give historical centuries room.
const SEG: [y0: number, y1: number, px: number][] = [
  [-50000, -10000, 320],
  [-10000, -3300, 560],
  [-3300, -1000, 1080],
  [-1000, 600, 1280],
  [600, 1950, 820],
];
export const MIN_YEAR = -50000;
export const MAX_YEAR = 1950;
const TOTAL = SEG.reduce((s, [, , w]) => s + w, 0);

export function yearToX(y: number): number {
  let x = 0;
  for (const [a, b, w] of SEG) {
    if (y <= b) return x + ((Math.max(y, a) - a) / (b - a)) * w;
    x += w;
  }
  return TOTAL;
}

export function xToYear(px: number): number {
  let x = 0;
  for (const [a, b, w] of SEG) {
    if (px <= x + w) return a + ((px - x) / w) * (b - a);
    x += w;
  }
  return MAX_YEAR;
}

/**
 * The atlas moves in fixed steps, coarser the further back we go:
 * 25 years from 600 CE, 50 years for the ancient period, 100 years for the
 * Bronze Age, 250 years for early farming and 1,000 years for deep prehistory.
 */
export function stepFor(y: number): number {
  return y >= 600 ? 25 : y >= -1000 ? 50 : y >= -3300 ? 100 : y >= -10000 ? 250 : 1000;
}

export function roundYear(y: number): number {
  const step = stepFor(y);
  const r = Math.round(y / step) * step;
  return r === 0 ? 1 : r;
}

/** Accepts "1350", "1350 CE", "AD 1350", "500 BCE", "500 BC", "-500", "12k BCE". */
export function parseYear(raw: string): number | null {
  const t = raw.trim().toLowerCase().replace(/,/g, "").replace(/^(ad|ce)\s*/, "");
  const m = t.match(/^(-)?\s*(\d+(?:\.\d+)?)\s*(k)?\s*(bce|bc|ce|ad)?$/);
  if (!m) return null;
  let n = parseFloat(m[2]);
  if (m[3]) n *= 1000;
  const neg = m[1] === "-" || m[4] === "bce" || m[4] === "bc";
  const y = Math.round(neg ? -n : n);
  if (y === 0) return 1;
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, y));
}

const SPEEDS = [1, 2, 4] as const;

const MAJOR = [-50000, -40000, -30000, -20000, -10000, -8000, -6000, -4000, -3000, -2500, -2000, -1500, -1000, -750, -500, -250, 1, 250, 500, 750, 1000, 1250, 1500, 1750, 1947];

function tickLabel(y: number) {
  if (y === 1) return "1 CE";
  if (y <= -10000) return `${-y / 1000}k BCE`;
  if (y < 0) return `${(-y).toLocaleString("en")} BCE`;
  return `${y}`;
}

export function TimeScroller({
  year,
  onYear,
  periods,
  allTime,
  onAllTime,
  activeCount,
  compact = false,
}: {
  year: number;
  onYear: (y: number) => void;
  periods: PeriodBand[];
  allTime: boolean;
  onAllTime: (v: boolean) => void;
  activeCount: number;
  compact?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [half, setHalf] = useState(400);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [jump, setJump] = useState("");
  const [jumpErr, setJumpErr] = useState(false);
  const playingRef = useRef(false);
  const speedRef = useRef(1);
  playingRef.current = playing;
  speedRef.current = speed;
  /** Last year we emitted from a user scroll — don't echo it back as a programmatic scroll. */
  const fromScroll = useRef<number | null>(null);
  /**
   * Only scrolls the person makes (wheel, drag, touch, keys, play) change the
   * year. Programmatic scrolls — resize, deep links, period clicks — never do.
   */
  const user = useRef(false);
  const dragging = useRef(false);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const yearRef = useRef(year);
  yearRef.current = year;
  const raf = useRef<number | null>(null);

  const markUser = useCallback(() => {
    user.current = true;
    if (idle.current) clearTimeout(idle.current);
    idle.current = setTimeout(() => {
      if (dragging.current) return;
      user.current = false;
      // Settle the needle exactly on the step the map is showing.
      if (!playingRef.current) {
        const el = scroller.current;
        const x = yearToX(yearRef.current);
        if (el && Math.abs(el.scrollLeft - x) > 1) el.scrollTo({ left: x, behavior: "smooth" });
      }
    }, 400);
  }, []);

  // Keep spacers equal to half the viewport so scrollLeft === x under the needle.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHalf(el.clientWidth / 2));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback((x: number, smooth: boolean) => {
    const el = scroller.current;
    if (!el) return;
    user.current = false;
    if (Math.abs(el.scrollLeft - x) < 1) return;
    el.scrollTo({ left: x, behavior: smooth ? "smooth" : "instant" });
  }, []);

  // When the ribbon's size changes, keep the current year under the needle.
  useLayoutEffect(() => {
    goTo(yearToX(yearRef.current), false);
  }, [half, goTo]);

  // External year changes (period clicks, era buttons, deep links) move the ribbon.
  useEffect(() => {
    if (fromScroll.current === year) return;
    goTo(yearToX(year), true);
  }, [year, goTo]);

  const cancelTarget = markUser;

  const onScroll = useCallback(() => {
    if (!user.current) return;
    markUser();
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      const el = scroller.current;
      if (!el) return;
      const y = roundYear(xToYear(el.scrollLeft));
      if (y === yearRef.current) return;
      fromScroll.current = y;
      onYear(y);
    });
  }, [onYear, markUser]);

  // Vertical wheel scrolls time horizontally; drag with the mouse.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      cancelTarget();
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    let dragX: number | null = null, start = 0;
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      cancelTarget();
      if (e.pointerType !== "mouse") return;
      dragX = e.clientX;
      dragging.current = true;
      start = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (dragX !== null) el.scrollLeft = start - (e.clientX - dragX);
    };
    const up = () => {
      dragX = null;
      dragging.current = false;
      el.style.cursor = "";
    };
    const touch = () => cancelTarget();
    el.addEventListener("touchstart", touch, { passive: true });
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("touchstart", touch);
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [cancelTarget]);

  // Play: drift forward through time.
  useEffect(() => {
    if (!playing) return;
    const el = scroller.current;
    if (!el) return;
    let id = 0;
    cancelTarget();
    const tick = () => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) return setPlaying(false);
      cancelTarget();
      el.scrollLeft += 1.2 * speedRef.current;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing, cancelTarget]);

  // Stack overlapping periods into rows.
  const bands = useMemo(() => {
    const rows: number[] = [];
    return [...periods]
      .sort((a, b) => a.start - b.start)
      .map((p) => {
        const s = Math.max(p.start, MIN_YEAR), e = Math.min(p.end, MAX_YEAR);
        const x0 = yearToX(s), x1 = Math.max(yearToX(e), x0 + 6);
        let row = rows.findIndex((r) => r <= x0 - 2);
        if (row === -1) row = rows.length;
        rows[row] = x1;
        return { ...p, x0, x1, row, mid: Math.round((s + e) / 2) };
      });
  }, [periods]);
  const rowCount = Math.max(...bands.map((b) => b.row)) + 1;

  const current = periods.filter((p) => p.start <= year && year <= p.end).map((p) => p.title);
  const step = (dir: -1 | 1, n = 1) => {
    setPlaying(false);
    onAllTime(false);
    let y = year;
    for (let i = 0; i < n; i++) {
      const base = y === 1 ? 0 : y;
      y = Math.min(MAX_YEAR, Math.max(MIN_YEAR, roundYear(base + dir * stepFor(dir === 1 ? base : base - 1))));
    }
    onYear(y);
  };
  const submitJump = () => {
    const y = parseYear(jump);
    if (y === null) return setJumpErr(true);
    setJumpErr(false);
    setPlaying(false);
    onAllTime(false);
    onYear(roundYear(y));
    setJump("");
  };

  const ROW_H = compact ? 20 : 24;

  return (
    <div className="bg-night/[0.93] backdrop-blur-md text-paper border-t border-paper/10 shadow-[0_-20px_50px_-30px_rgba(0,0,0,.6)]">
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Readout */}
        <div className={`shrink-0 flex flex-row sm:flex-col items-center sm:items-stretch justify-between sm:justify-center gap-x-3 border-b sm:border-b-0 sm:border-r border-paper/10 ${compact ? "sm:w-[170px] px-4 py-2.5 sm:py-3" : "sm:w-[250px] px-4 sm:px-5 py-2.5 sm:py-4"}`}>
          <div className="min-w-0">
          <p className="data text-[11px] uppercase tracking-[0.16em] text-gold">{allTime ? "Showing" : `${stepFor(year).toLocaleString("en")}-year steps`}</p>
          <p className={`font-display leading-none mt-1.5 tabular-nums text-[1.55rem] whitespace-nowrap ${compact ? "sm:text-[1.9rem]" : "sm:text-[2.5rem]"} ${allTime ? "text-paper/40" : ""}`} aria-live="polite">
            {allTime ? "All periods" : formatYear(year)}
          </p>
          {!compact && (
            <p className="hidden sm:block text-[12.5px] text-paper/70 mt-2 leading-snug line-clamp-2 min-h-[2.4em]">
              {allTime ? "Every dated entry at once" : current.length ? current.slice(0, 2).join(" · ") : "Between catalogued periods"}
            </p>
          )}
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 sm:mt-3 shrink-0">
            <IconBtn label="Step back" onClick={() => step(-1)} disabled={allTime}>‹</IconBtn>
            <IconBtn label={playing ? "Pause" : "Play through time"} onClick={() => { onAllTime(false); setPlaying((p) => !p); }} active={playing}>
              {playing ? "❚❚" : "▶"}
            </IconBtn>
            <IconBtn label="Step forward" onClick={() => step(1)} disabled={allTime}>›</IconBtn>
            <button
              onClick={() => setSpeed((v) => SPEEDS[(SPEEDS.indexOf(v) + 1) % SPEEDS.length])}
              aria-label={`Playback speed ${speed}×, click to change`}
              title="Playback speed"
              className="hidden sm:inline-block data text-[11px] px-1.5 h-9 sm:h-8 min-w-9 sm:min-w-8 border border-paper/25 text-paper/80 hover:text-paper hover:border-paper/50 tabular-nums"
            >
              {speed}×
            </button>
            <button
              onClick={() => { setPlaying(false); onAllTime(!allTime); }}
              aria-pressed={allTime}
              title="Show every dated entry at once"
              className={`data text-[11px] px-2 h-9 sm:h-8 border transition-colors ${allTime ? "bg-gold text-night border-gold" : "border-paper/25 text-paper/80 hover:text-paper hover:border-paper/50"}`}
            >
              All
            </button>
            <span className="ml-1 sm:ml-auto data text-[11px] text-paper/60 tabular-nums" title="Entries visible on the map">{activeCount}</span>
          </div>
          {!compact && (
            <form
              className="hidden sm:flex items-center gap-1.5 mt-3"
              onSubmit={(e) => { e.preventDefault(); submitJump(); }}
            >
              <label htmlFor="jump-year" className="sr-only">Go to year</label>
              <input
                id="jump-year"
                value={jump}
                onChange={(e) => { setJump(e.target.value); setJumpErr(false); }}
                placeholder="Go to year · 1350, 500 BCE"
                aria-invalid={jumpErr}
                aria-describedby={jumpErr ? "jump-err" : undefined}
                className={`min-w-0 flex-1 bg-paper/[0.06] border px-2 h-8 data text-[11.5px] text-paper placeholder:text-paper/50 outline-none focus:border-gold ${jumpErr ? "border-terracotta" : "border-paper/20"}`}
              />
              <button type="submit" className="data text-[11px] h-8 px-2 border border-paper/25 text-paper/80 hover:text-paper hover:border-paper/50">Go</button>
            </form>
          )}
          {jumpErr && <p id="jump-err" role="alert" className="hidden sm:block data text-[11px] text-terracotta-deep mt-1">Try a year like 1350 or 500 BCE</p>}
        </div>

        {/* Ribbon */}
        <div className="relative flex-1 min-w-0">
          <div
            ref={scroller}
            onScroll={onScroll}
            tabIndex={0}
            role="slider"
            aria-label="Scroll through time"
            aria-valuemin={MIN_YEAR}
            aria-valuemax={MAX_YEAR}
            aria-valuenow={year}
            aria-valuetext={formatYear(year)}
            aria-keyshortcuts="ArrowLeft ArrowRight Shift+ArrowLeft Shift+ArrowRight PageUp PageDown Home End"
            onKeyDown={(e) => {
              const big = e.shiftKey ? 10 : 1;
              if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); step(1, big); }
              else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); step(-1, big); }
              else if (e.key === "PageUp") { e.preventDefault(); step(1, 10); }
              else if (e.key === "PageDown") { e.preventDefault(); step(-1, 10); }
              else if (e.key === "Home") { e.preventDefault(); setPlaying(false); onAllTime(false); onYear(MIN_YEAR); }
              else if (e.key === "End") { e.preventDefault(); setPlaying(false); onAllTime(false); onYear(MAX_YEAR - (MAX_YEAR % 25)); }
              else if (e.key === " ") { e.preventDefault(); onAllTime(false); setPlaying((p) => !p); }
            }}
            style={{ touchAction: "pan-x" }}
            className={`no-scrollbar overflow-x-auto overflow-y-hidden cursor-grab select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold ${allTime ? "opacity-40" : ""}`}
          >
            <div className="relative" style={{ width: TOTAL + half * 2, height: (compact ? 28 : 36) + rowCount * ROW_H + 8 }}>
              <div className="absolute top-0 bottom-0" style={{ left: half, width: TOTAL }}>
                {/* ticks */}
                {MAJOR.map((y) => (
                  <div key={y} className="absolute top-0 h-full" style={{ left: yearToX(y) }}>
                    <div className="w-px h-2.5 bg-paper/50" />
                    <span className="absolute top-3 -translate-x-1/2 data text-[11px] text-paper/65 whitespace-nowrap">{tickLabel(y)}</span>
                  </div>
                ))}
                {/* minor ticks */}
                {Array.from({ length: Math.floor(TOTAL / 22) }, (_, i) => (
                  <div key={i} className="absolute top-0 w-px h-1 bg-paper/15" style={{ left: i * 22 }} />
                ))}
                {/* period bands */}
                <div className="absolute inset-x-0" style={{ top: compact ? 28 : 34 }}>
                  {bands.map((b) => {
                    const on = !allTime && b.start <= year && year <= b.end;
                    const w = b.x1 - b.x0;
                    return (
                      <button
                        key={b.id}
                        onClick={() => { setPlaying(false); onAllTime(false); onYear(b.mid); }}
                        title={`${b.title} — jump here`}
                        className={`absolute text-left overflow-hidden whitespace-nowrap border-l-2 px-2 transition-colors ${
                          on ? "bg-terracotta/85 border-gold text-paper" : "bg-paper/[0.08] border-paper/30 text-paper/75 hover:bg-paper/15 hover:text-paper"
                        } ${b.precision === "approximate" || b.precision === "debated" ? "[mask-image:linear-gradient(90deg,#000_85%,transparent)]" : ""}`}
                        style={{ left: b.x0, width: w, top: b.row * ROW_H, height: ROW_H - 4 }}
                      >
                        <span className={`font-display ${compact ? "text-[12.5px]" : "text-[14px]"} leading-none align-middle`}>{w > 40 ? b.title : ""}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/* Needle */}
          {!allTime && (
            <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="w-0 h-0 border-x-[7px] border-x-transparent border-t-[8px] border-t-gold" />
              <span className="flex-1 w-px bg-gold" />
            </div>
          )}
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-night/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-night/90 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function IconBtn({ label, onClick, children, disabled, active }: { label: string; onClick: () => void; children: React.ReactNode; disabled?: boolean; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center border text-[13px] transition-colors disabled:opacity-30 ${
        active ? "bg-paper text-night border-paper" : "border-paper/25 text-paper/80 hover:border-paper/60 hover:text-paper"
      }`}
    >
      {children}
    </button>
  );
}
