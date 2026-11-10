/**
 * Specimens: ancient individuals (or published groups of individuals) with
 * genetic and/or skeletal data.
 *
 * EDITORIAL RULE — numbers enter this file only by transcription from the
 * cited publication, with the table or page recorded in `locus`. A component
 * whose `proportion` is null is shown as "pending transcription", never
 * estimated. Physical traits are recorded only where the source measures or
 * describes them; "not reported" is a valid and common value.
 */

export interface AncestryComponent {
  /** Source population as named in the model, e.g. "Steppe_MLBA-related". */
  name: string;
  /** Point estimate 0–1, transcribed from the source; null = not given / not yet transcribed. */
  proportion: number | null;
  /** Standard error, if reported. */
  se?: number | null;
  /** Range across individuals, when the source reports a range rather than a point. */
  range?: [number, number];
  /** True when the source reports a minimum ("at least"). */
  atLeast?: boolean;
  /** True when the value is 1 minus the reported component(s) rather than reported directly. */
  derived?: boolean;
}

export interface AncestryModel {
  label: string;
  components: AncestryComponent[];
  /** Model fit as reported, e.g. "p = 0.103". */
  fit?: string;
  /** Exact location of the numbers in the source. */
  locus: string;
}

export interface Specimen {
  id: string;
  label: string;
  kind: "individual" | "group" | "model";
  siteId?: string;
  place: string;
  dates: string;
  dating: "direct radiocarbon" | "archaeological context" | "mixed";
  /** Studies (entry ids) reporting the data. */
  studies: string[];
  sources: string[];
  n?: string;
  sex?: string;
  genetic?: {
    coverage: string;
    mtDNA?: string;
    yDNA?: string;
    method: string;
    /** Alternative fitting models, as published. */
    models: AncestryModel[];
    /** Other quantitative findings (admixture dates, Y-chromosome shares…), transcribed. */
    findings?: { label: string; value: string; locus: string }[];
    note: string;
  };
  physical: {
    stature: { value: string | null; method?: string; locus?: string };
    build: string | null;
    boneDensity: string | null;
    dental: string | null;
    pathology: string | null;
    pigmentation: string | null;
    note?: string;
  };
}

export const SPECIMENS: Specimen[] = [
  {
    id: "i6113",
    label: "I6113 — Rakhigarhi",
    kind: "individual",
    siteId: "rakhigarhi",
    place: "Rakhigarhi cemetery, Haryana, India",
    dates: "c. 2800 – 2300 BCE (Mature Harappan cemetery; bone collagen too poorly preserved for direct dating)",
    dating: "archaeological context",
    studies: ["shinde-2019-study"],
    sources: ["shinde-2019"],
    sex: "Female — genetic determination, consistent with the anthropological one",
    genetic: {
      coverage: "31,760 SNPs covered at least once after filtering (208,111 before filtering); 108 libraries from 5 extractions of petrous bone",
      mtDNA: "U2b2",
      method: "Genome-wide in-solution capture; qpAdm two-way models",
      models: [
        {
          label: "Model A — Iranian-plateau herder-related + Andamanese hunter-gatherer proxy (for AASI)",
          components: [
            { name: "Iranian-related (western Zagros herder proxy)", proportion: 0.73, se: 0.06 },
            { name: "AASI-related (Andamanese hunter-gatherer proxy)", proportion: 0.27, se: 0.06, derived: true },
          ],
          fit: "p = 0.103",
          locus: "Shinde et al. 2019, Results (qpAdm modelling)",
        },
        {
          label: "Model B — Iranian-plateau herder-related + East Siberian hunter-gatherer proxy",
          components: [
            { name: "Iranian-related (western Zagros herder proxy)", proportion: 0.63, se: 0.06 },
            { name: "East Siberian hunter-gatherer-related proxy", proportion: 0.37, se: 0.06, derived: true },
          ],
          fit: "p = 0.24",
          locus: "Shinde et al. 2019, Results (qpAdm modelling)",
        },
      ],
      findings: [
        { label: "Steppe pastoralist-related ancestry", value: "Significantly depleted relative to present-day South Asians (p = 0.018, two-sided Z-test)", locus: "Shinde et al. 2019, Results" },
        { label: "Contamination screen", value: "Consistent with an uncontaminated female after filtering (Y/(X+Y) ratio 0.026)", locus: "Shinde et al. 2019, STAR Methods" },
      ],
      note: "Only these two two-way models fitted. The second source is a proxy for deeply diverged South/East Asian-related ancestry; the authors note the hunter-gatherer share is smaller than in present-day groups. With one low-coverage genome, the standard errors are wide.",
    },
    physical: {
      stature: { value: null, locus: "Not reported in the genetic study" },
      build: null,
      boneDensity: null,
      dental: null,
      pathology: null,
      pigmentation: "Not inferable at this coverage",
      note: "Burial RGR7.3, BR-01, HS-02, with Harappan grave goods. The genetic study reports no stature or other skeletal measurements; the excavators' cemetery report would be the source for these.",
    },
  },
  {
    id: "indus-periphery-group",
    label: "Indus Periphery individuals (Gonur, Shahr-i Sokhta)",
    kind: "group",
    siteId: "gonur",
    place: "Gonur Depe (Turkmenistan) and Shahr-i Sokhta (Iran)",
    dates: "c. 3rd millennium BCE",
    dating: "mixed",
    studies: ["narasimhan-2019-study"],
    sources: ["narasimhan-2019"],
    n: "11 individuals",
    genetic: {
      coverage: "Variable between individuals",
      method: "Genome-wide capture; qpAdm",
      models: [
        {
          label: "Range across the 11 individuals (Box 2)",
          components: [
            { name: "Iranian farmer-related", proportion: null, range: [0.45, 0.82] },
            { name: "AASI-related", proportion: null, range: [0.11, 0.5] },
          ],
          locus: "Narasimhan et al. 2019, Box 2, item 4",
        },
        {
          label: "Main-text formulation",
          components: [
            { name: "Iranian farmer- and West Siberian hunter-gatherer-related (combined)", proportion: null, range: [0.5, 0.89] },
            { name: "AASI-related", proportion: null, range: [0.11, 0.5] },
          ],
          locus: "Narasimhan et al. 2019, section 'An Ancestry Profile Widespread During the Indus Valley Civilization'",
        },
      ],
      findings: [
        { label: "Cline end-points", value: "From consistent with entirely AASI-related, to about 90% Iranian farmer-related and 10% West Siberian hunter-gatherer-related", locus: "Narasimhan et al. 2019, section 'Three Ancestry Clines…'" },
      ],
      note: "Genetic outliers in their burial communities, interpreted as migrants from the Indus world. Each individual sits at a different point on the cline, so the source reports ranges rather than one figure; no standard errors are given for the ranges.",
    },
    physical: {
      stature: { value: null },
      build: null,
      boneDensity: null,
      dental: null,
      pathology: null,
      pigmentation: "Not reported",
    },
  },
  {
    id: "swat-protohistoric",
    label: "Swat valley protohistoric individuals",
    kind: "group",
    siteId: "swat-graves",
    place: "Aligrama, Butkara, Katelai, Loebanr and other cemeteries, Swat, Pakistan",
    dates: "c. 1200 BCE – 1 CE",
    dating: "mixed",
    studies: ["narasimhan-2019-study"],
    sources: ["narasimhan-2019", "stacul-1987"],
    n: "Many individuals across several time-groups",
    genetic: {
      coverage: "Variable",
      method: "Genome-wide capture; qpAdm; admixture dating",
      models: [
        {
          label: "Late Bronze Age and Iron Age individuals — autosomal",
          components: [
            { name: "Steppe_MLBA-related", proportion: 0.2 },
            { name: "Indus Periphery Cline- and AASI-related (combined; split not given in the main text)", proportion: 0.8, derived: true },
          ],
          locus: "Narasimhan et al. 2019, section 'Steppe Ancestry in South Asia is Primarily from Males…' (autosomal figure)",
        },
      ],
      findings: [
        { label: "Steppe share on the Y chromosome", value: "Only 5% of 44 Y chromosomes were of the steppe-typical R1a-Z93 subtype, against 20% on the autosomes (Z = −3.9)", locus: "Narasimhan et al. 2019, same section, Fig. 4" },
        { label: "Date of steppe admixture", value: "On average 26 generations before they lived; 95% confidence interval c. 1900–1500 BCE", locus: "Narasimhan et al. 2019, section 'The ASI and ANI Arose…'" },
        { label: "Steppe Cline end-point", value: "About 41% Central_Steppe_MLBA and 59% from an Indus Periphery subgroup (all Steppe Cline individuals)", locus: "Narasimhan et al. 2019, Results" },
      ],
      note: "Steppe-related ancestry entered these communities largely through women in this sample — the opposite of the male bias seen in present-day South Asians.",
    },
    physical: {
      stature: { value: null },
      build: null,
      boneDensity: null,
      dental: null,
      pathology: null,
      pigmentation: "Not reported",
    },
  },
  {
    id: "asi-model",
    label: "ASI — Ancestral South Indian (model)",
    kind: "model",
    place: "Statistical construct; never sampled",
    dates: "Formed in the 2nd millennium BCE (modelled)",
    dating: "mixed",
    studies: ["narasimhan-2019-study", "reich-2009-study"],
    sources: ["narasimhan-2019", "reich-2009"],
    genetic: {
      coverage: "Inferred from ancient and present-day genomes",
      method: "qpAdm modelling",
      models: [
        {
          label: "Composition of the ASI source",
          components: [
            { name: "Indus Periphery Cline-related", proportion: 0.55, atLeast: true },
            { name: "AASI-related", proportion: null },
          ],
          locus: "Narasimhan et al. 2019, Box 2, item 2",
        },
      ],
      note: "The paper gives a minimum of about 55% Indus Periphery-related ancestry; the AASI share is the remainder and is not given separately.",
    },
    physical: { stature: { value: null }, build: null, boneDensity: null, dental: null, pathology: null, pigmentation: null, note: "A statistical construct, not people who can be measured." },
  },
  {
    id: "ani-model",
    label: "ANI — Ancestral North Indian (model)",
    kind: "model",
    place: "Statistical construct; never sampled",
    dates: "Formed in the 2nd millennium BCE (modelled)",
    dating: "mixed",
    studies: ["narasimhan-2019-study", "reich-2009-study"],
    sources: ["narasimhan-2019", "reich-2009"],
    genetic: {
      coverage: "Inferred from ancient and present-day genomes",
      method: "qpAdm modelling",
      models: [
        {
          label: "Composition of the ANI source",
          components: [
            { name: "Indus Periphery Cline-related", proportion: 0.7, atLeast: true },
            { name: "Steppe_MLBA-related", proportion: null },
          ],
          locus: "Narasimhan et al. 2019, Box 2, item 2",
        },
      ],
      findings: [{ label: "Steppe ancestry today", value: "Up to 30% of the ancestry of some present-day South Asian groups", locus: "Narasimhan et al. 2019, structured abstract" }],
      note: "A minimum of about 70% Indus Periphery-related ancestry; the steppe-related share is the remainder.",
    },
    physical: { stature: { value: null }, build: null, boneDensity: null, dental: null, pathology: null, pigmentation: null, note: "A statistical construct, not people who can be measured." },
  },
  {
    id: "sarai-nahar-rai-burials",
    label: "Sarai Nahar Rai burials",
    kind: "group",
    siteId: "sarai-nahar-rai",
    place: "Pratapgarh district, Uttar Pradesh, India",
    dates: "Early Holocene (debated)",
    dating: "archaeological context",
    studies: [],
    sources: ["kennedy-2000", "sharma-1980"],
    n: "Several extended burials",
    physical: {
      stature: { value: "Tall (described); numeric estimates pending transcription", method: "Long-bone regression", locus: "Kennedy 2000 — pending" },
      build: "Robust, heavily muscled (described)",
      boneDensity: "Not measured",
      dental: "Heavy occlusal wear consistent with a coarse, gritty diet (described)",
      pathology: null,
      pigmentation: "No DNA available",
      note: "No ancient genome has been published from this site, so no ancestry result exists.",
    },
  },
  {
    id: "mahadaha-damdama-burials",
    label: "Mahadaha and Damdama burials",
    kind: "group",
    siteId: "mahadaha",
    place: "Pratapgarh district, Uttar Pradesh, India",
    dates: "Early–middle Holocene (debated)",
    dating: "archaeological context",
    studies: [],
    sources: ["kennedy-2000", "sharma-1980"],
    n: "Dozens of individuals across the two sites",
    physical: {
      stature: { value: "Tall (described); numeric estimates pending transcription", method: "Long-bone regression", locus: "Kennedy 2000 — pending" },
      build: "Robust (described)",
      boneDensity: "Not measured",
      dental: "Heavy wear (described)",
      pathology: null,
      pigmentation: "No DNA available",
    },
  },
];
