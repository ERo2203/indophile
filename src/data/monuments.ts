import type { Country, DatePrecision, MapLayer, SiteEntry, Tradition } from "@/lib/types";
import { c, d, SEED_EDITOR, UPDATED } from "./helpers";

/**
 * Monasteries, temples, mosques, shrines, forts and early cities added in
 * the atlas expansion. Coordinates are the monument's own position to about
 * a kilometre. Dates are the foundation or main building phase; an end year
 * of 2026 marks a place still in use, no end year a monument that stands
 * but no longer serves its first purpose.
 *
 * Citations are to general surveys and World Heritage records without page
 * loci. World Heritage records added here are flagged unverified in
 * sources.ts and are always paired with a second source.
 */
type Row = [
  id: string,
  title: string,
  lat: number,
  lng: number,
  modern: string,
  country: Country,
  tradition: Tradition[],
  start: number,
  end: number | undefined,
  precision: DatePrecision,
  label: string,
  summary: string,
  cite: string[],
  extraLayers?: MapLayer[],
];

const base = { type: "site" as const, status: "published" as const, updated: UPDATED, editor: SEED_EDITOR };

const SACRED: Row[] = [
  // Buddhist
  ["kushinagar", "Kushinagar", 26.739, 83.888, "Kushinagar district, Uttar Pradesh", "India", ["buddhist"], -400, 2026, "debated", "From the 5th century BCE (date of the Buddha debated)", "Place of the Buddha's death in the Malla country, visited by Faxian and Xuanzang. The main stupa and the large reclining Buddha image belong to the Gupta period; the site was identified again in the 19th century.", ["singh-2008", "legge-1886", "beal-1884"]],
  ["piprahwa", "Piprahwa stupa", 27.443, 83.128, "Siddharthnagar district, Uttar Pradesh", "India", ["buddhist"], -400, 300, "approximate", "Stupa, last centuries BCE onward", "Brick stupa opened in 1898, which yielded a soapstone reliquary with a Brahmi inscription naming relics of the Buddha and the Shakyas. It is one of two candidates for ancient Kapilavastu; the other is Tilaurakot in Nepal.", ["singh-2008", "coningham-young-2015"], ["archaeological", "inscription"]],
  ["tilaurakot", "Tilaurakot", 27.576, 83.054, "Kapilvastu district, Lumbini province", "Nepal", ["buddhist"], -600, 300, "approximate", "Early historic", "Walled early historic town on the Banganga river, the Nepali candidate for Kapilavastu, the Shakya capital where the Buddha grew up. The identification is disputed with Piprahwa.", ["coningham-young-2015"], ["archaeological", "settlement"]],
  ["bhaja", "Bhaja caves", 18.729, 73.482, "Pune district, Maharashtra", "India", ["buddhist"], -200, 100, "approximate", "c. 2nd century BCE onward", "Early rock-cut monastery in the Western Ghats. Its apsidal prayer hall keeps timber ribs set into the stone vault, showing how such halls copied wooden buildings.", ["singh-2008"]],
  ["nasik-caves", "Nasik caves (Pandavleni)", 19.941, 73.749, "Nashik, Maharashtra", "India", ["buddhist"], -100, 300, "approximate", "1st century BCE – 3rd century CE", "Rock-cut monastery whose inscriptions record gifts by the Western Kshatrapa Nahapana's family and by the Satavahanas, including the eulogy of Gautamiputra Satakarni set up by his mother Gautami Balashri.", ["singh-2008", "salomon-1998"], ["inscription"]],
  ["kanheri", "Kanheri caves", 19.209, 72.906, "Mumbai, Maharashtra", "India", ["buddhist"], -100, 1000, "approximate", "1st century BCE – 10th century CE", "More than a hundred rock-cut cells, halls and cisterns on a basalt hill behind the old ports of the Konkan. Donors' inscriptions span roughly a thousand years of monastic life.", ["singh-2008"]],
  ["bamiyan", "Bamiyan", 34.832, 67.827, "Bamyan province", "Afghanistan", ["buddhist"], 550, 2001, "approximate", "c. 6th – 7th century CE; statues destroyed 2001", "Cliff of monastic caves on the road across the Hindu Kush, with two colossal standing Buddhas cut into the rock. Xuanzang described them around 630. The Taliban destroyed both statues in March 2001.", ["beal-1884", "unesco-208"], ["unesco"]],
  ["mainamati", "Mainamati (Shalban Vihara)", 23.426, 91.137, "Cumilla district", "Bangladesh", ["buddhist"], 650, 1200, "approximate", "7th – 12th century CE", "Low ridge of Buddhist monasteries and stupas in the old region of Samatata. Shalban Vihara, the largest, is a square of cells around a cruciform shrine.", ["singh-2008"], ["archaeological"]],
  ["dambulla", "Dambulla cave temple", 7.857, 80.649, "Matale district", "Sri Lanka", ["buddhist"], -100, 2026, "conventional", "From the 1st century BCE (by tradition)", "Five cave shrines under an overhanging rock, filled with Buddha images and painted ceilings. The chronicles credit King Vattagamani Abhaya with the foundation; most of the painting visible now was renewed in the Kandyan period.", ["desilva-1981", "unesco-561"], ["unesco"]],
  // Hindu
  ["elephanta", "Elephanta caves", 18.963, 72.931, "Raigad district, Maharashtra", "India", ["hindu"], 550, undefined, "approximate", "Mid-6th century CE", "Rock-cut Shiva temple on an island in Mumbai harbour, centred on a three-headed bust of Shiva some five metres high. It is usually dated to the mid-6th century; who paid for it is debated.", ["singh-2008", "unesco-244"], ["unesco"]],
  ["avantipur", "Avantipur temples", 33.923, 75.013, "Pulwama district, Jammu and Kashmir", "India", ["hindu"], 855, 883, "conventional", "c. 855 – 883 CE", "Two stone temples, one to Vishnu and one to Shiva, founded by Avantivarman, first king of the Utpala line of Kashmir, at his new town on the Jhelum.", ["singh-2008"]],
  ["uttaramerur", "Uttaramerur", 12.616, 79.753, "Kanchipuram district, Tamil Nadu", "India", ["hindu"], 919, 2026, "secure", "Inscriptions of 919 and 921 CE", "Brahmin village whose temple walls carry two inscriptions from the reign of Parantaka I Chola. They set out how the village assembly chose the members of its committees by drawing lots, and who was disqualified.", ["sastri-1955", "singh-2008"], ["inscription"]],
  ["gangaikondacholapuram", "Gangaikondacholapuram", 11.206, 79.449, "Ariyalur district, Tamil Nadu", "India", ["hindu"], 1035, 2026, "conventional", "c. 1035 CE", "Capital and great Shiva temple founded by Rajendra I Chola after his army's expedition to the Ganga, from which the city takes its name.", ["sastri-1955", "unesco-250"], ["unesco"]],
  ["bhojpur", "Bhojpur temple", 23.1, 77.579, "Raisen district, Madhya Pradesh", "India", ["hindu"], 1010, 1055, "conventional", "11th century CE (unfinished)", "Unfinished Shiva temple with a very large polished linga, attributed to the Paramara king Bhoja. Builders' drawings engraved on the nearby rock and an earthen ramp show how it was being raised.", ["singh-2008"]],
  ["somanathapura", "Keshava temple, Somanathapura", 12.276, 76.881, "Mysuru district, Karnataka", "India", ["hindu"], 1268, undefined, "conventional", "1268 CE", "Triple-shrined Vishnu temple on a star-shaped platform, built by Somanatha, a general of the Hoysala king Narasimha III. It is the most complete of the later Hoysala temples.", ["unesco-1670", "sastri-1955"], ["unesco"]],
  ["govind-dev", "Govind Dev temple, Vrindavan", 27.582, 77.7, "Mathura district, Uttar Pradesh", "India", ["hindu"], 1590, 2026, "conventional", "Completed 1590 CE", "Red sandstone Krishna temple built by Raja Man Singh of Amber, a leading noble of Akbar's court. Its vaulted hall uses the building methods of the imperial workshops.", ["asher-talbot-2006"]],
  // Islamic
  ["adhai-din", "Adhai Din ka Jhonpra", 26.455, 74.625, "Ajmer, Rajasthan", "India", ["islamic"], 1199, undefined, "conventional", "From c. 1199 CE", "Congregational mosque begun under Qutb-ud-din Aibak soon after the Ghurid conquest of Ajmer, reusing temple columns; Iltutmish added the arched screen with its Arabic inscriptions.", ["asher-talbot-2006", "jackson-1999"]],
  ["pakpattan", "Shrine of Baba Farid, Pakpattan", 30.343, 73.387, "Pakpattan district, Punjab", "Pakistan", ["islamic"], 1265, 2026, "conventional", "From 1265 CE", "Tomb of the Chishti shaikh Farid-ud-din Ganj-i Shakar at old Ajodhan on the Sutlej. The shrine tied the surrounding pastoral clans to it over centuries, and verses attributed to Farid are preserved in the Sikh scripture.", ["eaton-2019", "grewal-1990"]],
  ["gesu-daraz", "Dargah of Gisu Daraz", 17.345, 76.845, "Kalaburagi, Karnataka", "India", ["islamic"], 1422, 2026, "secure", "From 1422 CE", "Shrine of the Chishti shaikh Muhammad Husaini Gisu Daraz, who left Delhi at the time of Timur's invasion, settled in the Bahmani capital and died there in 1422.", ["eaton-2005"]],
  ["mandu-monuments", "Mandu", 22.336, 75.405, "Dhar district, Madhya Pradesh", "India", ["islamic"], 1401, 1562, "conventional", "Capital of Malwa, 15th – 16th century CE", "Hill-top capital of the Malwa sultans above the Narmada valley: the Jami mosque, the marble tomb of Hoshang Shah and the Jahaz Mahal palace set between two tanks.", ["asher-talbot-2006"]],
  ["gawan-madrasa", "Madrasa of Mahmud Gawan", 17.915, 77.527, "Bidar, Karnataka", "India", ["islamic"], 1472, undefined, "secure", "Built 1472 CE", "College founded by Mahmud Gawan, the Persian merchant who became chief minister of the Bahmani sultanate. Its plan and tiled front follow Iranian and Central Asian models.", ["eaton-2005"]],
  ["champaner", "Champaner–Pavagadh", 22.486, 73.537, "Panchmahal district, Gujarat", "India", ["islamic"], 1484, 1535, "conventional", "1484 – 1535 CE", "Mahmud Begada of Gujarat took the hill fort of Pavagadh in 1484 and built a new capital at its foot, with a large Jami mosque. Humayun sacked the city in 1535 and the court returned to Ahmedabad.", ["asher-talbot-2006", "unesco-1101"], ["unesco", "settlement"]],
  ["gaur-city", "Gaur (Lakhnauti)", 24.87, 88.13, "Malda district, West Bengal", "India", ["islamic"], 1420, 1575, "approximate", "Sultanate monuments, 15th – 16th century CE", "Ruined capital of the Bengal sultans on an old course of the Ganga, with brick gateways and mosques including the Bara Sona mosque of 1526. The city was abandoned in the later 16th century.", ["asher-talbot-2006", "eaton-2019"], ["settlement"]],
  ["sher-shah-tomb", "Tomb of Sher Shah, Sasaram", 24.948, 84.011, "Rohtas district, Bihar", "India", ["islamic"], 1545, undefined, "secure", "Completed 1545 CE", "Octagonal domed tomb of Sher Shah Sur, set on a stepped platform in the middle of an artificial lake.", ["asher-talbot-2006"]],
  ["sikandra", "Akbar's tomb, Sikandra", 27.22, 77.95, "Agra, Uttar Pradesh", "India", ["islamic"], 1605, undefined, "conventional", "Completed c. 1613 CE", "Tiered, open-topped tomb of Akbar in a walled four-part garden, finished under Jahangir.", ["asher-talbot-2006", "richards-1993"]],
  ["itimad-ud-daula", "Tomb of Itimad-ud-Daula", 27.193, 78.031, "Agra, Uttar Pradesh", "India", ["islamic"], 1622, undefined, "conventional", "1622 – 1628 CE", "Built by Nur Jahan for her father Mirza Ghiyas Beg, Jahangir's chief minister. It is faced in white marble inlaid with coloured stones, a technique carried further at the Taj Mahal.", ["asher-talbot-2006"]],
  ["shalimar-lahore", "Shalimar Gardens, Lahore", 31.586, 74.382, "Lahore, Punjab", "Pakistan", ["islamic"], 1641, undefined, "secure", "Laid out 1641 – 42 CE", "Mughal garden on three descending terraces with canals, cascades and pavilions, built for Shah Jahan.", ["asher-talbot-2006", "unesco-171"], ["unesco"]],
  ["bibi-ka-maqbara", "Bibi ka Maqbara", 19.901, 75.32, "Aurangabad, Maharashtra", "India", ["islamic"], 1660, undefined, "approximate", "c. 1660 CE", "Tomb of Dilras Banu Begum, wife of Aurangzeb, modelled on the Taj Mahal at a smaller scale.", ["asher-talbot-2006"]],
  ["minaret-of-jam", "Minaret of Jam", 34.396, 64.516, "Ghor province", "Afghanistan", ["islamic"], 1175, undefined, "approximate", "Late 12th century CE", "Brick minaret about 65 metres high in a remote valley of Ghur, bearing the name of the Ghurid sultan Ghiyas-ud-din Muhammad. It may mark the site of Firuzkuh, the Ghurid summer capital, from where the conquest of north India was launched.", ["unesco-211", "eaton-2019"], ["unesco"]],
  // Sikh
  ["goindwal", "Goindwal", 31.37, 75.15, "Tarn Taran district, Punjab", "India", ["sikh"], 1552, 2026, "approximate", "Mid-16th century CE", "Seat of Guru Amar Das, the third Guru, who had a stepped well dug here and organised the growing community into local seats.", ["grewal-1990"]],
  ["tarn-taran", "Tarn Taran", 31.451, 74.927, "Tarn Taran district, Punjab", "India", ["sikh"], 1590, 2026, "conventional", "Founded c. 1590 CE", "Town and large sacred tank founded by Guru Arjan in the Majha country south of Amritsar.", ["grewal-1990"]],
  ["damdama-sahib", "Damdama Sahib, Talwandi Sabo", 29.987, 75.083, "Bathinda district, Punjab", "India", ["sikh"], 1706, 2026, "secure", "From 1706 CE", "Where Guru Gobind Singh stayed for some months in 1706 after leaving Anandpur. It is one of the five takhts, the seats of authority of the Sikh community.", ["grewal-1990"]],
  ["hazur-sahib", "Hazur Sahib, Nanded", 19.153, 77.319, "Nanded, Maharashtra", "India", ["sikh"], 1708, 2026, "secure", "From 1708 CE", "Place on the Godavari where Guru Gobind Singh died in October 1708, having declared that the line of personal Gurus would end with him. One of the five takhts.", ["grewal-1990"]],
];

const FORTS: Row[] = [
  ["gwalior-fort", "Gwalior Fort", 26.23, 78.169, "Gwalior, Madhya Pradesh", "India", [], 876, undefined, "approximate", "Monuments from the 9th century CE", "Sandstone hill fort above Gwalior. A temple inscription of 876 CE here contains an early dated use of a written zero; the Sas-Bahu temples are dated to 1093; and Man Singh Tomar built the tiled Man Mandir palace around 1500. Under the Mughals it was a state prison.", ["asher-talbot-2006", "plofker-2009"], ["inscription"]],
  ["kalinjar", "Kalinjar Fort", 24.999, 80.485, "Banda district, Uttar Pradesh", "India", [], 950, 1545, "approximate", "10th century – 1545 CE", "Hill fort of the Chandelas on the edge of the Vindhyas. Qutb-ud-din Aibak took it in 1202–03, and Sher Shah Sur was fatally burned by an exploding gunpowder store while besieging it in 1545.", ["asher-talbot-2006", "jackson-1999"]],
  ["chittorgarh", "Chittorgarh", 24.887, 74.645, "Chittorgarh, Rajasthan", "India", [], 750, 1568, "approximate", "c. 8th century – 1568 CE", "Long table-topped hill fort, the old capital of Mewar. It was taken by Ala-ud-din Khalji in 1303, by Bahadur Shah of Gujarat in 1535 and by Akbar in 1568, after which the court stayed at Udaipur. The nine-storey Vijaya Stambha was raised by Rana Kumbha in the mid-15th century.", ["asher-talbot-2006", "unesco-247"], ["unesco"]],
  ["ranthambore", "Ranthambore Fort", 26.02, 76.455, "Sawai Madhopur district, Rajasthan", "India", [], 1200, 1569, "approximate", "Besieged 1301 and 1569 CE", "Chahamana stronghold in the eastern Aravallis. Ala-ud-din Khalji took it in 1301 after a long siege, and it surrendered to Akbar in 1569.", ["jackson-1999", "asher-talbot-2006", "unesco-247"], ["unesco"]],
  ["daulatabad-fort", "Daulatabad (Devagiri)", 19.943, 75.213, "Aurangabad district, Maharashtra", "India", [], 1190, 1700, "approximate", "12th – 17th century CE", "Rock citadel of Devagiri, capital of the Yadavas, with a moat cut into the hill. Muhammad bin Tughluq renamed it Daulatabad and in 1327 moved much of Delhi's elite here; the Chand Minar tower was added under the Bahmanis in 1445.", ["eaton-2005", "asher-talbot-2006"]],
  ["tughlaqabad", "Tughlaqabad", 28.512, 77.26, "Delhi", "India", [], 1321, 1330, "conventional", "Built from 1321 CE", "Walled city and citadel built by Ghiyas-ud-din Tughluq on a rocky ridge south of Delhi, with his own tomb in a fortified outwork. It was largely given up within a generation.", ["jackson-1999", "asher-talbot-2006"]],
  ["kumbhalgarh", "Kumbhalgarh", 25.149, 73.587, "Rajsamand district, Rajasthan", "India", [], 1443, undefined, "conventional", "Mid-15th century CE", "Mountain fort built by Rana Kumbha of Mewar on the crest of the Aravallis, ringed by a wall many kilometres long.", ["asher-talbot-2006", "unesco-247"], ["unesco"]],
  ["mehrangarh", "Mehrangarh, Jodhpur", 26.298, 73.018, "Jodhpur, Rajasthan", "India", [], 1459, undefined, "conventional", "Founded 1459 CE", "Citadel of Jodhpur, founded by Rao Jodha of the Rathors when he moved the capital of Marwar from Mandor.", ["asher-talbot-2006"]],
  ["golconda-fort", "Golconda Fort", 17.383, 78.401, "Hyderabad, Telangana", "India", [], 1518, 1687, "conventional", "1518 – 1687 CE", "Fortress capital of the Qutb Shahi sultans until Hyderabad was founded in 1591, and their last refuge. It fell to Aurangzeb in 1687 after a siege of eight months. The dynasty's domed tombs stand just to the north.", ["eaton-2005", "richards-1993"]],
  ["rohtas-fort", "Rohtas Fort", 32.965, 73.575, "Jhelum district, Punjab", "Pakistan", [], 1541, undefined, "secure", "Begun 1541 CE", "Built by Sher Shah Sur after he drove Humayun from India, to hold the road through the Salt Range and overawe the Gakkhar chiefs.", ["asher-talbot-2006", "unesco-586"], ["unesco"]],
  ["agra-fort", "Agra Fort", 27.179, 78.021, "Agra, Uttar Pradesh", "India", [], 1565, undefined, "conventional", "Rebuilt from 1565 CE", "Red sandstone fort rebuilt by Akbar from 1565. Shah Jahan replaced much of the interior with marble palaces and the Moti Masjid, and was later confined here by Aurangzeb.", ["richards-1993", "asher-talbot-2006", "unesco-251"], ["unesco"]],
  ["lahore-fort", "Lahore Fort", 31.588, 74.315, "Lahore, Punjab", "Pakistan", [], 1566, undefined, "conventional", "Rebuilt from c. 1566 CE", "Citadel rebuilt in brick under Akbar and enlarged by Jahangir, Shah Jahan, who added the mirrored Shish Mahal, and Aurangzeb, who added the Alamgiri Gate. It was later Ranjit Singh's seat.", ["asher-talbot-2006", "unesco-171"], ["unesco"]],
  ["red-fort", "Red Fort, Delhi", 28.656, 77.241, "Delhi", "India", [], 1639, undefined, "secure", "Built 1639 – 1648 CE", "Palace-fortress of Shahjahanabad, the new capital Shah Jahan built at Delhi. It remained the seat of the Mughal emperors until 1857.", ["asher-talbot-2006", "richards-1993", "unesco-231"], ["unesco"]],
  ["raigad-fort", "Raigad", 18.234, 73.447, "Raigad district, Maharashtra", "India", [], 1674, 1689, "secure", "Maratha capital 1674 – 1689 CE", "Hill fort in the Sahyadris where Shivaji was crowned Chhatrapati in June 1674 and where he died in 1680. The Mughals took it in 1689.", ["gordon-1993"]],
  ["diu-fort", "Diu Fort", 20.714, 70.996, "Diu", "India", [], 1535, 1961, "secure", "1535 – 1961 CE", "Portuguese sea fortress built in 1535 by agreement with Bahadur Shah of Gujarat. It withstood sieges in 1538 and 1546 and remained Portuguese until 1961.", ["asher-talbot-2006", "kulke-rothermund-2016"], ["port"]],
  ["bassein", "Bassein (Vasai) Fort", 19.33, 72.814, "Palghar district, Maharashtra", "India", [], 1534, 1739, "secure", "1534 – 1739 CE", "Walled Portuguese town north of Bombay, ceded by the sultan of Gujarat in 1534 and capital of their northern province. The Marathas under Chimaji Appa took it in 1739.", ["gordon-1993", "kulke-rothermund-2016"], ["port"]],
  ["galle-fort", "Galle Fort", 6.026, 80.217, "Galle, Southern province", "Sri Lanka", [], 1640, undefined, "conventional", "Dutch fort from 1640 CE", "Portuguese fort taken by the Dutch in 1640 and rebuilt with bastioned ramparts around a grid of streets. It is among the best preserved European fortified towns in South Asia.", ["desilva-1981", "unesco-451"], ["unesco", "port"]],
  ["fort-st-george", "Fort St George, Madras", 13.08, 80.287, "Chennai, Tamil Nadu", "India", [], 1640, undefined, "conventional", "Founded 1639 – 40 CE", "English East India Company fort built on a strip of the Coromandel coast granted in 1639. The city of Madras grew around it.", ["kulke-rothermund-2016", "bayly-1988"], ["port"]],
  ["fort-william", "Fort William, Calcutta", 22.554, 88.338, "Kolkata, West Bengal", "India", [], 1696, undefined, "conventional", "First fort begun 1696 CE", "The Company's first fort at Calcutta was begun in 1696 and taken by Siraj-ud-daula in 1756. After Plassey a far larger fort was built on a new site beside the Hugli.", ["kulke-rothermund-2016", "bayly-1988"], ["port"]],
];

const EARLY: Row[] = [
  ["sisupalgarh", "Sisupalgarh", 20.226, 85.853, "Bhubaneswar, Odisha", "India", [], -400, 350, "approximate", "Early historic, to c. 4th century CE", "Square walled city with eight evenly spaced gateways, one of the most regularly planned early historic towns in South Asia. B. B. Lal excavated it in 1948; work resumed in 2005.", ["singh-2008", "coningham-young-2015"], ["archaeological", "settlement"]],
  ["chandraketugarh", "Chandraketugarh", 22.697, 88.688, "North 24 Parganas, West Bengal", "India", [], -300, 500, "approximate", "Early historic", "Early historic town in the Ganga delta, known for finely moulded terracotta plaques. It is sometimes linked with the port of Gange named by Greek and Roman writers; that identification is not settled.", ["singh-2008"], ["archaeological", "settlement"]],
  ["kaveripattinam", "Kaveripattinam (Puhar)", 11.144, 79.849, "Mayiladuthurai district, Tamil Nadu", "India", [], -200, 500, "approximate", "Last centuries BCE – early centuries CE", "Chola port at the mouth of the Kaveri, praised in the Pattinappalai and the Silappadikaram. Excavation has found a brick wharf and the remains of a Buddhist monastery.", ["singh-2008", "sastri-1955"], ["archaeological", "port"]],
  ["heliodorus-pillar", "Heliodorus pillar, Besnagar", 23.549, 77.8, "Vidisha district, Madhya Pradesh", "India", ["hindu"], -110, undefined, "approximate", "c. 110 BCE", "Stone pillar set up in honour of Vasudeva by Heliodorus, ambassador of the Indo-Greek king Antialkidas of Taxila, who calls himself a Bhagavata. It is early dated evidence for the worship of Vasudeva-Krishna.", ["salomon-1998", "singh-2008"], ["inscription", "religious"]],
];

const sacredLayers = (t: Tradition[]): MapLayer[] =>
  t.some((x) => x === "buddhist" || x === "jain" || x === "hindu") ? ["religious", "temple"] : ["religious"];

const toSites = (rows: Row[], layersFor: (t: Tradition[]) => MapLayer[], subject: string): SiteEntry[] =>
  rows.map(([id, title, lat, lng, modern, country, tradition, start, end, precision, label, summary, cite, extra]) => ({
    ...base,
    id,
    title,
    summary,
    place: { lat, lng, modern, country },
    dates: d(start, end, precision, label),
    layers: [...new Set([...layersFor(tradition), ...(extra ?? [])])],
    tradition: tradition.length ? tradition : undefined,
    subjects: [subject],
    evidence: precision === "debated" ? ("debated" as const) : ("well-supported" as const),
    cite: cite.map((x) => c(x)),
  }));

export const monumentSites: SiteEntry[] = [
  ...toSites(SACRED, sacredLayers, "religion-philosophy"),
  ...toSites(FORTS, () => ["settlement"], "art-architecture"),
  ...toSites(EARLY, () => [], "archaeology"),
];
