"use client";

import { useEffect, useState } from "react";

type Pref = "system" | "light" | "dark";
const KEY = "indophile:theme";
const ORDER: Pref[] = ["system", "light", "dark"];

/** Runs before paint (inlined in <head>) so a stored theme never flashes. */
export const THEME_BOOT = `(function(){try{var t=localStorage.getItem("${KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}})();`;

function apply(p: Pref) {
  const root = document.documentElement;
  if (p === "system") delete root.dataset.theme;
  else root.dataset.theme = p;
  try {
    if (p === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, p);
  } catch {
    /* storage unavailable: the choice lasts for this page only */
  }
  window.dispatchEvent(new Event("indophile:theme"));
}

export function ThemeToggle() {
  const [pref, setPref] = useState<Pref>("system");
  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    setPref(t === "light" || t === "dark" ? t : "system");
  }, []);

  const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
  const label = { system: "Theme: follows your system", light: "Theme: light", dark: "Theme: dark" }[pref];

  return (
    <button
      type="button"
      onClick={() => {
        apply(next);
        setPref(next);
      }}
      aria-label={`${label}. Switch to ${next}.`}
      title={`${label} — click for ${next}`}
      className="w-9 h-9 flex items-center justify-center rounded-full border rule text-stone hover:text-ink hover:border-ink/40 transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
        {pref === "light" && (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
          </>
        )}
        {pref === "dark" && <path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1Z" strokeLinejoin="round" />}
        {pref === "system" && (
          <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none" />
          </>
        )}
      </svg>
    </button>
  );
}
