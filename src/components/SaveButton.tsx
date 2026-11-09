"use client";

import { useEffect, useState } from "react";

export interface SavedItem {
  id: string;
  title: string;
  href: string;
  type: string;
  savedAt: number;
}

const KEY = "indophile:reading-list";

export function readList(): SavedItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function writeList(items: SavedItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("indophile:list"));
  } catch {
    /* storage unavailable — reading list is a convenience only */
  }
}

export function SaveButton({ item }: { item: Omit<SavedItem, "savedAt"> }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const sync = () => setSaved(readList().some((i) => i.id === item.id));
    sync();
    window.addEventListener("indophile:list", sync);
    return () => window.removeEventListener("indophile:list", sync);
  }, [item.id]);

  const toggle = () => {
    const list = readList();
    writeList(saved ? list.filter((i) => i.id !== item.id) : [{ ...item, savedAt: Date.now() }, ...list]);
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 border px-3.5 py-2 text-[13px] transition-colors ${
        saved ? "bg-ink text-ivory border-ink" : "rule hover:border-ink/50"
      }`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M6 3.5h12v17l-6-4-6 4z" strokeLinejoin="round" />
      </svg>
      {saved ? "Saved to reading list" : "Save"}
    </button>
  );
}
