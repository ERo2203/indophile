"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readList, writeList, type SavedItem } from "@/components/SaveButton";

export default function ReadingListPage() {
  const [items, setItems] = useState<SavedItem[] | null>(null);
  useEffect(() => {
    const sync = () => setItems(readList());
    sync();
    window.addEventListener("indophile:list", sync);
    return () => window.removeEventListener("indophile:list", sync);
  }, []);

  return (
    <div className="container-ind py-14 min-h-[60vh]">
      <p className="rubric">Your reading list</p>
      <h1 className="h1 mt-4">Saved for later</h1>
      <p className="text-stone mt-3 max-w-xl">Saved in this browser only. Accounts and shareable collections are planned for a later phase.</p>
      {items === null ? null : items.length === 0 ? (
        <p className="mt-12 font-display text-2xl text-stone">Nothing saved yet. Use the <span className="text-ink">Save</span> button on any entry or article.</p>
      ) : (
        <ol className="mt-10 border-t rule">
          {items.map((i) => (
            <li key={i.id} className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-5 border-b rule">
              <Link href={i.href} className="group">
                <span className="eyebrow">{i.type}</span>
                <span className="block font-display text-2xl group-hover:text-terracotta">{i.title}</span>
              </Link>
              <button onClick={() => writeList(items.filter((x) => x.id !== i.id))} className="data text-[11px] text-stone hover:text-terracotta">Remove</button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
