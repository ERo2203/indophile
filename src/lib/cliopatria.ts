/**
 * Political boundaries come from Cliopatria (Seshat Global History Databank),
 * v0.2.1, licensed CC BY 4.0:
 *   Cioni, Reddish, Zsambok, Levine, Cook, Francois, Hoyer & Turchin (2025),
 *   "Cliopatria – A geospatial database of world-wide political entities from
 *   3400BCE to 2024CE", Scientific Data 12: 247. doi:10.1038/s41597-025-04516-9
 * Indophile clips the data to South Asia and simplifies the outlines (changes
 * indicated, as the licence requires). Boundaries are drawn exactly as the
 * dataset gives them; Indophile does not generate or edit any border.
 */

export const CLIOPATRIA_CREDIT =
  'Boundaries: <a href="https://github.com/Seshat-Global-History-Databank/cliopatria" target="_blank" rel="noopener">Cliopatria</a> (Seshat), <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>, clipped and simplified';

export const HBM_CREDIT =
  'Gap-fill: <a href="https://github.com/aourednik/historical-basemaps" target="_blank" rel="noopener">historical-basemaps</a>, GPL-3.0';

export const HBM_CITATION = {
  text: "Ourednik, A. et al. historical-basemaps: world historical borders by time slice.",
  repo: "https://github.com/aourednik/historical-basemaps",
  license: "GPL-3.0",
};

export interface HbmFeature {
  type: "Feature";
  properties: { n: string; f: number; t: number; p: number; of: string | null };
  geometry: { type: "MultiPolygon"; coordinates: [number, number][][][] };
}

export interface ShownPolity {
  key: string;
  name: string;
  color: string;
  src: "cliopatria" | "hbm";
  from: number;
  to: number;
  polityId?: string;
}

export function parseHbmKey(key: string): { name: string; from: number } | null {
  if (!key.startsWith("hbm:")) return null;
  const i = key.lastIndexOf("|");
  return { name: key.slice(4, i), from: Number(key.slice(i + 1)) };
}

export const CLIOPATRIA_CITATION = {
  text: "Cioni, C. et al. (2025). Cliopatria – A geospatial database of world-wide political entities from 3400BCE to 2024CE. Scientific Data 12: 247.",
  doi: "10.1038/s41597-025-04516-9",
  repo: "https://github.com/Seshat-Global-History-Databank/cliopatria",
  version: "v0.2.1",
};

/** Cliopatria entity name → Indophile polity record. Only clear matches are listed. */
export const CLIO_TO_POLITY: Record<string, string> = {
  "Indus Valley Civilization": "indus-civilisation",
  "Janapada of Avanti": "avanti",
  "Janapada of Anga": "anga",
  "Janapada of Magadha": "magadha",
  "Magadha - Haryanka dynasty": "magadha",
  "Magadha - Shaishunaga dynasty": "magadha",
  "Janapada of Malla": "malla",
  "Janapada of Aśmaka": "assaka",
  "Janapada of Vajji": "vajji",
  "Janapada of Kuru": "kuru",
  "Janapada of Kosala": "kosala",
  "Janapada of Matsya": "matsya",
  "Janapada of Surasena": "surasena",
  "Janapada of Pañcāla": "panchala",
  "Janapada of Vatsa": "vatsa",
  "Janapada of Gandhāra": "gandhara-janapada",
  "Janapada of Kāśī": "kashi",
  "Maurya Empire": "maurya",
  "Early Cheras": "early-cheras",
  "Early Pandyas": "early-pandyas",
  "Early Cholas": "early-cholas",
  "Anurādhapura": "anuradhapura-kingdom",
  "Satavahana Dynasty": "satavahana",
  "Mahameghavahana Dynasty": "mahameghavahana",
  "Shunga Empire": "shunga",
  "Indo-Scythians": "indo-scythian",
  "Indo-Greeks": "indo-greek",
  "Indo-Parthians": "indo-parthian",
  "Kushan Empire": "kushan",
  "Western Satraps": "western-kshatrapas",
  "Vakataka Kingdom": "vakataka",
  "Late Pallava Empire": "pallava",
  "Yaudheya Republic": "yaudheya",
  "Gupta Empire": "gupta",
  "Kadamba Empire": "kadamba",
  "Kamarupa Kingdom": "kamarupa",
  "Maitraka Dynasty": "maitraka",
  "Chalukya Dynasty": "chalukya-badami",
  "Karkota Dynasty": "karkota",
  "Gauda Kingdom": "gauda-shashanka",
  "Harsha's Empire": "pushyabhuti",
  "Gurjara-Pratihara Dynasty": "gurjara-pratihara",
  "Pala Empire": "pala",
  "Rashtrakuta Dynasty": "rashtrakuta",
  "Chola Empire": "imperial-cholas",
  "Sind-Habbari Dynasty": "arab-sindh",
  "Chaulukya Dynasty": "chaulukya",
  "Chandela Kingdom": "chandela",
  "Utpala Dynasty": "kashmir-utpala-lohara",
  "Lohara Dynasty": "kashmir-utpala-lohara",
  "Ghaznavid Empire": "ghaznavid",
  "Western Chalukya Empire": "chalukya-kalyani",
  "Paramara Dynasty": "paramara",
  "Chauhan Dynasty": "chahamana",
  "Eastern Ganga Kingdom": "eastern-ganga",
  "Sena Dynasty": "sena",
  "Kingdom of Polonnaruwa": "polonnaruwa-kingdom",
  "Gahadavala Dynasty": "gahadavala",
  "Hoysala Kingdom": "hoysala",
  "Ghurid Dynasty": "ghurid",
  "Kakatiya Dynasty": "kakatiya",
  "Yadava Dynasty": "yadava-devagiri",
  "Mamluk Dynasty": "delhi-sultanate-polity",
  "Khalji Dynasty": "delhi-sultanate-polity",
  "Tughlaq Dynasty": "delhi-sultanate-polity",
  "Sayyid Dynasty": "delhi-sultanate-polity",
  "Lodi Dynasty": "delhi-sultanate-polity",
  "Pandya Empire": "later-pandyas",
  "Kingdom of Dambadeniya": "dambadeniya-gampola",
  "Kampili Kingdom": "kampili",
  "Jaffna kingdom": "jaffna-kingdom",
  "Kashmiri Sultanate": "kashmir-sultanate",
  "Sultanate of Bengal": "bengal-sultanate",
  "Sind-Samma Dynasty": "samma-sindh",
  "Vijayanagara Empire": "vijayanagara",
  "Bahmani Sultanate": "bahmani",
  "Jaunpur Sultanate": "jaunpur-sultanate",
  "Kingdom of Mrauk U": "mrauk-u",
  "Ahmadnagar Sultanate": "deccan-ahmadnagar",
  "Berar Sultanate": "deccan-berar",
  "Bijapur Sultanate": "deccan-bijapur",
  "Bidar Sultanate": "deccan-bidar",
  "Golconda Sultanate": "deccan-golconda",
  "Nayaks of Madurai": "madurai-nayaks",
  "Nayaks of Thanjavur": "thanjavur-nayaks",
  "Mughal Empire": "mughal-empire",
  "Sur Empire": "sur-empire",
  "Kingdom of Mysore": "mysore-kingdom",
  "Gorkha Kingdom": "gorkha-nepal",
  "Nepal": "gorkha-nepal",
  "Maratha Empire": "maratha-confederacy",
  "Dutch Ceylon": "dutch-ceylon",
  "Nawabs of Bengal": "bengal-nawabs",
  "Nawab of Awadh": "awadh",
  "Hyderabad State": "hyderabad-state",
  "Sikh Empire": "sikh-empire",
  "British Empire": "east-india-company",
  "Portuguese Colonies": "portuguese-india",
  // Linked in the atlas expansion (records in src/data/dynasties-atlas.ts).
  "Nanda Empire": "nanda",
  "Kalinga": "kalinga",
  "Greco-Bactrian Kingdom": "greco-bactrian",
  "Kanva Dynasty": "kanva",
  "Kidarites": "kidarite",
  "Maukhari Dynasty": "maukhari",
  "Kannauj-Varman Dynasty": "kannauj-varman",
  "Turk Shahis": "turk-shahi",
  "Pandya Dynasty": "pandya-early-medieval",
  "Chandra Dynasty": "chandra-bengal",
  "Kathmandu": "malla-nepal",
  "Timurid Empire": "timurid",
  "Portuguese Ceylon": "portuguese-ceylon",
  "Hussain Shahi Dynasty": "bengal-sultanate",
  "Kingdom of Bhutan": "bhutan",
  "Thanjavur Maratha Kingdom": "thanjavur-marathas",
  "Carnatic Sultanate": "carnatic",
  "Durrani Empire": "durrani",
  "Sikh Confederacy": "sikh-misls",
  "Danish India": "danish-india",
  "Talpur Dynasty": "talpur",
  "British Ceylon": "british-ceylon",
  "Kashmir and Jammu": "jammu-kashmir",
  "British Raj": "british-raj",
};

/** Inverse: Indophile polity → Cliopatria names. */
export const POLITY_TO_CLIO: Record<string, string[]> = Object.entries(CLIO_TO_POLITY).reduce(
  (acc, [n, id]) => ((acc[id] ??= []).push(n), acc),
  {} as Record<string, string[]>,
);

const PALETTE = ["#C9785A", "#7FA36A", "#D9B25A", "#6F93BF", "#B07799", "#E3A066", "#69A6A2", "#BF6A5A", "#9DAA58", "#8C7BC0", "#C8925E", "#5E9C7C", "#D07A92", "#7C9FBA", "#AD8C5C", "#7FBE90"];

export function clioColor(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export const clioKey = (name: string, from: number) => `clio:${name}|${from}`;

export function parseClioKey(key: string): { name: string; from: number } | null {
  if (!key.startsWith("clio:")) return null;
  const i = key.lastIndexOf("|");
  return { name: key.slice(5, i), from: Number(key.slice(i + 1)) };
}

export interface ClioFeature {
  type: "Feature";
  properties: { n: string; f: number; t: number; w: string | null; q: string | null; s: string | null };
  geometry: { type: "MultiPolygon"; coordinates: [number, number][][][] };
}
