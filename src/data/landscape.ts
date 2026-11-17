import type { SiteEntry } from "@/lib/types";
import { c, d, SEED_EDITOR, UPDATED } from "./helpers";

/**
 * Documented changes to the land itself: rivers that moved, a land link that
 * drowned. Each marker sits on the place the change is recorded, not on a
 * redrawn old course; no published dataset of old river courses has been
 * added, so none are drawn.
 */
const base = { type: "site" as const, status: "published" as const, updated: UPDATED, editor: SEED_EDITOR, layers: ["landscape" as const] };

export const landscapeSites: SiteEntry[] = [
  {
    ...base,
    id: "palk-land-link",
    title: "Land link between India and Sri Lanka",
    summary:
      "The sea between India and Sri Lanka is shallow; Adam's Bridge is a chain of shoals only a few metres deep. While sea level stood lower in the last ice age, the two were one landmass. In the coastline model used on this atlas, the link is cut once the sea rises to between about 10 and 5 metres below today, which the sea-level curve places roughly 8,000 to 6,500 years ago.",
    place: { lat: 9.12, lng: 79.52, modern: "Palk Strait, between India and Sri Lanka", country: "India" },
    dates: d(-48000, -4500, "approximate", "Dry land in the last ice age; drowned c. 6000 – 4500 BCE"),
    subjects: ["archaeology"],
    evidence: "well-supported",
    cite: [c("spratt-lisiecki-2016"), c("noaa-etopo-2022")],
  },
  {
    ...base,
    id: "ghaggar-sutlej",
    title: "The Sutlej leaves the Ghaggar-Hakra",
    summary:
      "The dry Ghaggar-Hakra channel was once a course of the Sutlej. Dating of its sands shows the Sutlej had shifted away shortly after about 8,000 years ago, long before the Harappan towns along it were built. Those towns grew along an abandoned Himalayan river valley, not beside an active Himalayan river.",
    place: { lat: 29.47, lng: 74.13, modern: "Ghaggar-Hakra palaeochannel near Kalibangan, Rajasthan", country: "India", approximate: true },
    dates: d(-6000, undefined, "approximate", "c. 6000 BCE"),
    subjects: ["archaeology"],
    evidence: "well-supported",
    cite: [c("singh-a-2017"), c("giosan-2012")],
  },
  {
    ...base,
    id: "kosi-shift",
    title: "The Kosi swings west across its fan",
    summary:
      "The Kosi, coming down from Nepal onto the plains of north Bihar, shifted its main channel about 110 kilometres westward across its sediment fan between the 18th and mid-20th centuries. Later work argues this was a series of sudden jumps rather than a steady one-way migration. Embankments built from the 1950s now confine it; a breach in August 2008 caused severe floods.",
    place: { lat: 26.2, lng: 86.75, modern: "Kosi fan, north Bihar", country: "India", approximate: true },
    dates: d(1700, 1960, "approximate", "18th – mid-20th century CE"),
    subjects: ["archaeology"],
    evidence: "debated",
    cite: [c("wells-dorr-1987"), c("chakraborty-2010")],
  },
  {
    ...base,
    id: "ganga-shifts-east",
    title: "The Ganga moves east into the Padma",
    summary:
      "Between the 13th and 17th centuries, and decisively in the late 16th, the main flow of the Ganga moved from the Bhagirathi-Hugli channels in the west of the delta to the Padma in the east. Western channels silted up, the old port of Satgaon declined, and new land opened for farming in eastern Bengal.",
    place: { lat: 22.96, lng: 88.39, modern: "Saptagram (Satgaon), Hooghly district, West Bengal", country: "India", approximate: true },
    dates: d(1200, 1700, "approximate", "c. 13th – 17th century CE"),
    subjects: ["archaeology"],
    evidence: "well-supported",
    cite: [c("eaton-1993")],
  },
];
