/**
 * Editorial conclusions per period: what the evidence supports, what remains
 * open. Each line restates material already sourced in the period's entries.
 */
export const CONCLUSIONS: Record<string, { known: string[]; open: string[] }> = {
  prehistory: {
    known: [
      "Toolmakers were in South India by around 1.5 million years ago, and Acheulian technology persisted for over a million years.",
      "People lived across the subcontinent through the Toba eruption of about 74,000 years ago, on the evidence of Jwalapuram and Dhaba.",
      "By the early Holocene, foragers in the Ganga plain were burying their dead in lakeside camps, and rock art flourished at Bhimbetka.",
    ],
    open: ["Which hominin species made the oldest tools; when modern humans arrived; the age and species of the Narmada skull cap."],
  },
  "neolithic-chalcolithic": {
    known: [
      "Farming and herding are documented at Mehrgarh from about 7000 BCE, including zebu cattle.",
      "Neolithic and Chalcolithic farming emerged in several regions in different forms and at different times — Kashmir, the Ganga plain, the Deccan, the south.",
    ],
    open: ["Whether wheat and barley were domesticated locally; how far farming spread by migration versus adoption."],
  },
  indus: {
    known: [
      "Planned cities with drainage, standard weights and seals flourished from about 2600 to 1900 BCE across a larger area than any contemporary civilisation.",
      "Indus-associated genomes show ancestry related to Iranian-plateau groups and AASI, without steppe-related ancestry.",
      "Cities declined gradually after 1900 BCE; there is no evidence of a violent invasion.",
    ],
    open: ["The script and language; how the cities were governed; the relative roles of climate, rivers and trade in deurbanisation."],
  },
  "vedic-iron-age": {
    known: [
      "Steppe-related ancestry is present in the northwest by the late 2nd millennium BCE, consistent with the arrival of Indo-Aryan speakers.",
      "Iron and Painted Grey Ware spread across the Ganga plain; megalithic burial spread across the peninsula.",
    ],
    open: ["Absolute dates for the Vedic texts; how texts relate to archaeological cultures; the start of iron in the south."],
  },
  mahajanapadas: {
    known: [
      "Kingdoms and assembly-governed republics coexisted in the Ganga valley, alongside coinage, fortified cities and new religious movements.",
      "Magadha grew to dominate the region by the 4th century BCE.",
    ],
    open: ["The dates of the Buddha and Mahavira; the extent and nature of early state control."],
  },
  mauryan: {
    known: [
      "The Mauryan Empire stretched from Kandahar to Karnataka, as Ashoka's inscriptions show.",
      "Ashoka's edicts are the earliest securely dated writing after the Indus script, in Prakrit, Greek and Aramaic.",
    ],
    open: ["How centrally the empire was governed; how much the Arthashastra reflects Mauryan practice."],
  },
  "post-mauryan": {
    known: [
      "Indo-Greek, Saka, Parthian and Kushan rulers governed the northwest; the Satavahanas held the Deccan; the Tamil kingdoms ruled the south.",
      "Monsoon trade linked South Indian ports with the Roman world, and Tamil-Brahmi writing appears.",
    ],
    open: ["The chronology of the Satavahanas and Kushans; the earliest date of Tamil-Brahmi."],
  },
  "gupta-classical": {
    known: [
      "Gupta kings dominated north India from the 4th to the 6th century; Sanskrit became the main language of royal inscriptions.",
      "Free-standing stone temples, the Aryabhatiya and Nalanda date from this period.",
    ],
    open: ["How far the 'golden age' label reflects the evidence rather than later historiography."],
  },
  "early-medieval": {
    known: ["Regional kingdoms multiplied, recorded in thousands of copper-plate land grants.", "Devotional movements and temple-centred agrarian society spread."],
    open: ["Whether the period saw political 'fragmentation' or the growth of regional state formation."],
  },
  "regional-kingdoms": {
    known: ["Large regional states — Cholas, Rashtrakutas, Palas, later Vijayanagara — built monumental temples and, in the Cholas' case, sent naval expeditions overseas."],
    open: ["The degree of central control in states often described as 'segmentary'."],
  },
  "delhi-sultanate": {
    known: ["Five successive dynasties ruled from Delhi, reaching the far south under the Tughluqs before regional sultanates broke away."],
    open: ["The social and economic effects of sultanate rule, which historians interpret very differently."],
  },
  mughal: {
    known: ["From 1526 the Mughals built one of the largest early-modern states, with a documented revenue and rank system."],
    open: ["The causes of 18th-century decline: imperial crisis or regional growth."],
  },
  "regional-powers": {
    known: ["Successor states, the Marathas and the Sikh Empire rose as Mughal authority fragmented, while the East India Company became a territorial power after 1757."],
    open: ["How far the 18th century was a time of economic decline or of regional prosperity."],
  },
  "british-colonial": {
    known: ["Crown rule from 1858 combined direct administration with princely states; the colonial state also founded the institutions that study the past."],
    open: ["The long-term economic effects of colonial rule, which remain intensely debated."],
  },
  "independence-partition": {
    known: ["Independence in 1947 came with partition and one of the largest forced migrations in recorded history."],
    open: ["The number of people killed, for which estimates vary widely."],
  },
  "modern-south-asia": {
    known: ["The nation-states of South Asia now administer the region's archaeological heritage."],
    open: ["How cross-border sites and collections should be researched and shared."],
  },
};
