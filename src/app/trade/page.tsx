import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { AtlasExplorer } from "@/components/map/AtlasExplorer";
import { DateTag, EntryLink, EvidenceBadge, SectionHead } from "@/components/ui";
import { entriesOfType } from "@/lib/db";
import { mapPayload } from "@/lib/mapdata";

export const metadata: Metadata = {
  title: "Trade & Migration Maps",
  description: "Ports, inland routes, commodities and modelled population movements across the subcontinent and the Indian Ocean.",
};

export default function TradePage() {
  const routes = entriesOfType("route");
  const trade = routes.filter((r) => r.layer === "trade");
  const migration = routes.filter((r) => r.layer === "migration");
  return (
    <div>
      <PageHero
        eyebrow="Trade, economy & migration"
        title="Roads, winds and the movement of people."
        intro="Overland corridors, monsoon sailing routes and the ancestry flows reconstructed from ancient DNA. Waypoints are attested places; the lines between them are simplified, and migration arrows are models — not paths walked."
        image={{ id: "roman-coin-india", caption: "A Roman denarius of Tiberius found in India, an Indian copy, and a Kushan coin imitating Augustus." }}
      />
      <div className="container-ind pb-16">
        <div className="border rule">
          <AtlasExplorer payload={mapPayload()} variant="preview" defaultYear={50} defaultLayers={["trade", "migration", "port"]} />
        </div>
      </div>

      {[["Trade routes", trade], ["Population movements", migration]].map(([title, list]) => (
        <section key={title as string} className="container-ind py-12">
          <SectionHead eyebrow={title === "Trade routes" ? "Commercial networks" : "Archaeogenetic models"} title={title as string} />
          <div className="grid md:grid-cols-2 gap-x-12">
            {(list as typeof routes).map((r) => (
              <article key={r.id} id={r.id} className="scroll-mt-24 border-t rule py-7">
                <div className="flex flex-wrap items-center gap-3">
                  <DateTag range={r.dates} />
                  <EvidenceBadge level={r.evidence} compact />
                  <span className="data text-[10px] text-stone">{r.geometryBasis === "schematic" ? "schematic line" : "attested waypoints"}</span>
                </div>
                <h3 className="font-display text-[1.7rem] leading-tight mt-2">{r.title}</h3>
                <p className="text-sm text-ink/80 mt-2 leading-relaxed">{r.summary}</p>
                {r.commodities && <p className="mt-3 text-[13px]"><span className="eyebrow mr-2">Commodities</span>{r.commodities.join(" · ")}</p>}
                <p className="mt-3 text-[13px] flex flex-wrap gap-x-3 gap-y-1">
                  {(r.related ?? []).slice(0, 6).map((id) => <EntryLink key={id} id={id} />)}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
