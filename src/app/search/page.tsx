import type { Metadata } from "next";
import { SearchClient } from "@/components/SearchClient";
import { TYPE_LABEL, allEntries, entriesOfType, getPeriods, hrefFor } from "@/lib/db";
import { formatRange } from "@/lib/format";
import { toSearchDoc } from "@/lib/search";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  const docs = allEntries().map((e) => toSearchDoc(e, hrefFor(e), e.dates ? formatRange(e.dates) : undefined));
  return (
    <div className="container-ind py-14 min-h-[70vh]">
      <p className="rubric mb-6">Search the knowledge base</p>
      <SearchClient
        docs={docs}
        typeLabels={TYPE_LABEL}
        periods={getPeriods().map((p) => ({ id: p.id, title: p.title }))}
        subjects={entriesOfType("subject").map((s) => ({ id: s.id, title: s.title }))}
      />
    </div>
  );
}
