import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailShell } from "@/components/DetailShell";
import { MiniMap } from "@/components/map/MiniMap";
import { ArrowLink, DateTag, FactTable, LinkList } from "@/components/ui";
import { entriesOfType, getEntry, related } from "@/lib/db";
import { pointsFor } from "@/lib/mapdata";
import { PRECISION } from "@/lib/format";
import type { PointFeature } from "@/lib/maptypes";

export function generateStaticParams() {
  return entriesOfType("event").map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const e = getEntry((await params).id);
  return e ? { title: e.title, description: e.summary } : {};
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ev = getEntry(id);
  if (!ev || ev.type !== "event") notFound();
  const sites = related(id, ["site"]);
  let points: PointFeature[] = pointsFor(sites.map((s) => s.id));
  if (!points.length && ev.place) {
    points = [{
      id: ev.id, title: ev.title, lat: ev.place.lat, lng: ev.place.lng, layers: ["archaeological"], start: 0, end: 0,
      dateLabel: "", precision: "", modern: ev.place.modern, country: ev.place.country, summary: ev.summary, href: "#",
      approximate: ev.place.approximate, periods: [], related: [],
    }];
  }
  return (
    <DetailShell
      e={ev}
      trail={[["Home", "/"], ["Timeline", "/timeline"], [ev.title]]}
      kicker={`Event · ${ev.category}`}
      facts={
        <div className="space-y-8">
          <FactTable
            rows={[
              ["Date", <DateTag key="d" range={ev.dates} />],
              ["Dating", ev.dates ? PRECISION[ev.dates.precision].note : undefined],
              ["Location", ev.place ? `${ev.place.modern}, ${ev.place.country}${ev.place.approximate ? " (approx.)" : ""}` : undefined],
              ["Category", ev.category],
            ]}
          />
          <LinkList title="Related personalities" entries={related(id, ["person"])} />
          <LinkList title="Related civilisations" entries={related(id, ["polity"])} />
          <ArrowLink href="/timeline">Back to the timeline</ArrowLink>
        </div>
      }
    >
      <section>
        <p className="rubric mb-2">Historical significance</p>
        <p className="lede max-w-3xl">{ev.significance}</p>
      </section>
      {points.length > 0 && (
        <section>
          <p className="rubric mb-2">The Map Check</p>
          <h2 className="h3 mb-5">Where it happened</h2>
          <MiniMap points={points} className="h-[340px]" />
        </section>
      )}
      {sites.length > 0 && (
        <section>
          <p className="rubric mb-2">Supporting evidence</p>
          <h2 className="h3 mb-4">Sites and finds</h2>
          <LinkList title="Archaeological evidence" entries={sites} />
        </section>
      )}
    </DetailShell>
  );
}
