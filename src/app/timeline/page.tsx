import type { Metadata } from "next";
import { TimelineExplorer } from "@/components/TimelineExplorer";
import { PrecisionLegend } from "@/components/ui";
import { buildTimeline } from "@/lib/timeline";

export const metadata: Metadata = {
  title: "Timeline",
  description: "From the first toolmakers to modern South Asia: periods, polities, battles, discoveries, inscriptions and population movements, with dating confidence shown for every entry.",
};

export default function TimelinePage() {
  const { items, bands } = buildTimeline();
  return (
    <div className="pt-12">
      <div className="container-ind grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-12">
        <div className="max-w-3xl">
          <p className="rubric">The Historical Timeline</p>
          <h1 className="display mt-4 !text-[clamp(2.75rem,6vw,5.5rem)]">A million years, read in order.</h1>
          <p className="lede mt-6 text-ink/75">
            Filter by kind of evidence and by era. Every date carries its own confidence — a dated inscription is not the same as a radiocarbon range or a traditional chronology.
          </p>
        </div>
        <div className="border rule bg-ivory p-5">
          <p className="eyebrow mb-3">Dating confidence</p>
          <PrecisionLegend />
        </div>
      </div>
      <TimelineExplorer items={items} bands={bands} />
    </div>
  );
}
