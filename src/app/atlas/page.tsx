import type { Metadata } from "next";
import { AtlasExplorer } from "@/components/map/AtlasExplorer";
import { mapPayload } from "@/lib/mapdata";

export const metadata: Metadata = {
  title: "Historical Atlas",
  description: "Explore archaeological sites, inscriptions, ports, trade routes, population movements and estimated political territories of the Indian subcontinent through time.",
};

export default function AtlasPage() {
  return (
    <>
      <h1 className="sr-only">Historical Atlas of the Indian Subcontinent</h1>
      <AtlasExplorer payload={mapPayload()} variant="full" defaultYear={-250} />
    </>
  );
}
