import type { Country, DatePrecision, MapLayer, SiteEntry, Tradition } from "@/lib/types";
import { c, d, UPDATED, SEED_EDITOR } from "./helpers";

const base = { type: "site" as const, status: "published" as const, updated: UPDATED, editor: SEED_EDITOR };

type Row = [
  id: string, title: string, lat: number, lng: number, modern: string, country: Country,
  tradition: Tradition[], start: number, end: number | undefined, precision: DatePrecision, label: string,
  summary: string, cite: string[], extraLayers?: MapLayer[],
];

/**
 * Religious sites, dated from their earliest securely attested phase. Used by
 * the Religion theme to show how sacred geography shifts over time. Traditional
 * foundation dates are labelled as such.
 */
const RELIGIOUS: Row[] = [
  // Buddhist
  ["vikramashila", "Vikramashila", 25.32, 87.28, "Bhagalpur district, Bihar", "India", ["buddhist"], 780, 1200, "approximate", "c. 780 – 1200 CE", "A great Buddhist monastery founded under the Pala king Dharmapala.", ["singh-2008"], ["hotspot"]],
  ["somapura", "Somapura Mahavihara (Paharpur)", 25.03, 88.98, "Naogaon District", "Bangladesh", ["buddhist"], 780, 1150, "approximate", "c. late 8th – 12th century CE", "One of the largest monasteries south of the Himalaya, built under the Palas.", ["unesco-322"]],
  ["ratnagiri-odisha", "Ratnagiri (Odisha)", 20.64, 86.33, "Jajpur district, Odisha", "India", ["buddhist"], 500, 1200, "approximate", "c. 5th – 13th century CE", "A Buddhist monastic complex with fine stone sculpture.", ["singh-2008"]],
  ["tabo", "Tabo Monastery", 32.09, 78.38, "Lahaul and Spiti, Himachal Pradesh", "India", ["buddhist"], 996, 2026, "conventional", "Founded 996 CE (tradition and inscription)", "A Himalayan monastery associated with the translator Rinchen Zangpo.", ["singh-2008"]],
  ["bharhut", "Bharhut", 24.45, 80.88, "Satna district, Madhya Pradesh", "India", ["buddhist"], -150, -50, "approximate", "c. 2nd – 1st century BCE", "A stupa whose carved railing, now largely in Kolkata, carries labelled narrative reliefs.", ["singh-2008"]],
  ["karla", "Karla chaitya", 18.78, 73.47, "Pune district, Maharashtra", "India", ["buddhist"], -50, 150, "approximate", "c. 1st century BCE – 2nd century CE", "The largest rock-cut Buddhist chaitya hall in South Asia.", ["singh-2008"]],
  ["nagarjunakonda", "Nagarjunakonda", 16.52, 79.24, "Palnadu district, Andhra Pradesh", "India", ["buddhist"], 225, 340, "approximate", "c. 3rd – 4th century CE", "Monasteries and stupas of the Ikshvaku capital Vijayapuri, now largely submerged by a reservoir.", ["singh-2008"]],
  ["kanaganahalli", "Kanaganahalli", 16.88, 76.97, "Kalaburagi district, Karnataka", "India", ["buddhist"], -100, 300, "approximate", "c. 1st century BCE – 3rd century CE", "A stupa site with a rare inscribed portrait labelled as Ashoka.", ["singh-2008"]],
  ["barabar", "Barabar caves", 25.0, 85.06, "Jehanabad district, Bihar", "India", ["ajivika"], -260, -230, "conventional", "Dedicated under Ashoka, 3rd century BCE", "Polished rock-cut chambers dedicated by Ashoka to the Ajivika ascetics.", ["hultzsch-1925"], ["inscription"]],
  // Jain
  ["shravanabelagola", "Shravanabelagola", 12.86, 76.49, "Hassan district, Karnataka", "India", ["jain"], 600, 2026, "approximate", "Inscriptions from c. 7th century CE", "A major Jain centre; tradition links Chandragupta Maurya with it, and the Gommateshvara colossus dates to c. 983.", ["sastri-1955"], ["inscription"]],
  ["udayagiri-khandagiri", "Udayagiri and Khandagiri caves", 20.26, 85.78, "Khordha district, Odisha", "India", ["jain"], -100, 100, "debated", "c. 1st century BCE (debated)", "Jain rock-cut cells, including the Hathigumpha cave with Kharavela's inscription.", ["salomon-1998"], ["inscription"]],
  ["dilwara", "Dilwara temples, Mount Abu", 24.59, 72.71, "Sirohi district, Rajasthan", "India", ["jain"], 1031, 2026, "secure", "From 1031 CE", "Marble Jain temples built by ministers of the Chaulukya kings.", ["singh-2008"]],
  ["palitana", "Shatrunjaya (Palitana)", 21.48, 71.8, "Bhavnagar district, Gujarat", "India", ["jain"], 1100, 2026, "approximate", "Temples largely rebuilt from the 16th century", "A hill of hundreds of Jain temples, one of the most sacred Jain pilgrimage sites.", ["singh-2008"]],
  ["sittanavasal", "Sittanavasal", 10.45, 78.72, "Pudukkottai district, Tamil Nadu", "India", ["jain"], -200, 900, "approximate", "Tamil-Brahmi beds; paintings c. 9th century CE", "A Jain cave with early inscribed rock beds and later painted ceilings.", ["mahadevan-2003"], ["inscription"]],
  ["moodbidri", "Moodabidri", 13.07, 74.99, "Dakshina Kannada, Karnataka", "India", ["jain"], 1430, 2026, "approximate", "Saavira Kambada Basadi, 1430 CE", "A Jain centre of coastal Karnataka known for its 'thousand-pillared' temple.", ["asher-talbot-2006"]],
  // Hindu
  ["deogarh", "Deogarh (Dashavatara temple)", 24.53, 78.24, "Lalitpur district, Uttar Pradesh", "India", ["hindu"], 500, 2026, "approximate", "c. early 6th century CE", "One of the earliest surviving stone temples of north India.", ["singh-2008"]],
  ["bhitargaon", "Bhitargaon brick temple", 26.21, 80.27, "Kanpur district, Uttar Pradesh", "India", ["hindu"], 450, 2026, "approximate", "c. 5th century CE", "A rare surviving early brick temple with terracotta panels.", ["singh-2008"]],
  ["mahabalipuram", "Mamallapuram", 12.62, 80.19, "Chengalpattu district, Tamil Nadu", "India", ["hindu"], 630, 2026, "approximate", "c. 7th – 8th century CE", "Pallava rock-cut shrines, monolithic rathas, the 'Descent of the Ganga' relief and the Shore Temple.", ["unesco-249", "sastri-1955"]],
  ["lingaraja", "Lingaraja temple, Bhubaneswar", 20.24, 85.83, "Khordha district, Odisha", "India", ["hindu"], 1050, 2026, "approximate", "c. 11th century CE", "The largest temple of Bhubaneswar's temple city.", ["singh-2008"]],
  ["konark", "Konark Sun Temple", 19.89, 86.09, "Puri district, Odisha", "India", ["hindu"], 1250, 2026, "approximate", "c. 1250 CE", "A temple conceived as the chariot of the Sun, built under Narasimhadeva I of the Eastern Gangas.", ["unesco-246"]],
  ["puri-jagannatha", "Jagannatha temple, Puri", 19.805, 85.818, "Puri district, Odisha", "India", ["hindu"], 1135, 2026, "approximate", "Begun c. 12th century CE", "The great temple of Jagannatha, begun under Anantavarman Chodaganga.", ["singh-2008"]],
  ["khajuraho", "Khajuraho", 24.85, 79.93, "Chhatarpur district, Madhya Pradesh", "India", ["hindu", "jain"], 950, 2026, "approximate", "c. 950 – 1050 CE", "Hindu and Jain temples of the Chandelas.", ["unesco-240"]],
  ["meenakshi", "Meenakshi temple, Madurai", 9.919, 78.119, "Madurai, Tamil Nadu", "India", ["hindu"], 1200, 2026, "approximate", "Ancient foundation; present complex largely 16th–17th century", "A vast temple complex largely rebuilt under the Nayakas of Madurai.", ["asher-talbot-2006"]],
  ["srirangam", "Srirangam", 10.86, 78.69, "Tiruchirappalli, Tamil Nadu", "India", ["hindu"], 900, 2026, "approximate", "Chola-period inscriptions onward", "A major Vaishnava temple-town with seven concentric enclosures.", ["sastri-1955"], ["inscription"]],
  ["somnath", "Somnath", 20.89, 70.4, "Gir Somnath district, Gujarat", "India", ["hindu"], 1000, 2026, "approximate", "Raided 1026; rebuilt repeatedly; present temple 1951", "A Shiva temple whose repeated destruction and rebuilding became a charged historical symbol.", ["eaton-2019"]],
  ["kashi-vishwanath", "Kashi Vishwanath, Varanasi", 25.311, 83.011, "Varanasi, Uttar Pradesh", "India", ["hindu"], 1780, 2026, "secure", "Present temple 1780 CE", "The present temple was built by Ahilyabai Holkar; earlier temples on or near the site were destroyed and rebuilt.", ["eaton-2019"]],
  ["tirumala", "Tirumala Venkateswara", 13.683, 79.347, "Tirupati district, Andhra Pradesh", "India", ["hindu"], 830, 2026, "approximate", "Inscriptions from c. 9th century CE", "A hill temple heavily patronised under Vijayanagara.", ["sastri-1955"], ["inscription"]],
  ["martand", "Martand Sun Temple", 33.75, 75.22, "Anantnag district, Jammu and Kashmir", "India", ["hindu"], 740, 1400, "approximate", "c. 8th century CE; ruined", "A Sun temple attributed to Lalitaditya Muktapida of the Karkota dynasty.", ["singh-2008"]],
  ["ramappa", "Ramappa (Rudreshwara) temple", 18.26, 79.94, "Mulugu district, Telangana", "India", ["hindu"], 1213, 2026, "secure", "1213 CE", "A Kakatiya-period temple built by the general Recherla Rudra, famous for its floating bricks and bracket figures.", ["unesco-1570", "talbot-2001"], ["inscription"]],
  ["chidambaram", "Chidambaram Nataraja", 11.4, 79.69, "Cuddalore district, Tamil Nadu", "India", ["hindu"], 1000, 2026, "approximate", "Chola-period patronage onward", "The temple of Shiva as Nataraja, lord of the dance.", ["sastri-1955"]],
  ["kamakhya", "Kamakhya", 26.17, 91.71, "Guwahati, Assam", "India", ["hindu"], 1565, 2026, "conventional", "Rebuilt 1565 CE", "A major Shakta temple on Nilachal hill, rebuilt under the Koch king Naranarayana.", ["kulke-rothermund-2016"]],
  ["pashupatinath", "Pashupatinath", 27.71, 85.35, "Kathmandu", "Nepal", ["hindu"], 450, 2026, "approximate", "Licchavi-period inscriptions; present temple later", "The principal Shiva temple of the Kathmandu valley.", ["singh-2008"]],
  // Islamic
  ["banbhore", "Banbhore mosque", 24.75, 67.52, "Thatta District, Sindh", "Pakistan", ["islamic"], 727, 1250, "secure", "Inscription of 727 CE", "Among the earliest known mosques in South Asia, at the port identified with Daybul.", ["eaton-2019"], ["inscription"]],
  ["cheraman", "Cheraman Juma Masjid", 10.22, 76.2, "Thrissur district, Kerala", "India", ["islamic"], 1200, 2026, "debated", "Tradition: 7th century; surviving fabric much later", "Kerala tradition makes this the first mosque in India; its earliest dates are not independently established.", ["asher-talbot-2006"]],
  ["qutb", "Qutb complex", 28.524, 77.185, "Delhi", "India", ["islamic"], 1192, 2026, "secure", "From 1192/1199 CE", "The Quwwat al-Islam mosque and Qutb Minar, begun after the Ghurid conquest.", ["unesco-233"], ["inscription"]],
  ["ajmer-dargah", "Dargah of Muinuddin Chishti, Ajmer", 26.456, 74.628, "Ajmer, Rajasthan", "India", ["islamic"], 1236, 2026, "secure", "Shrine from 1236 CE", "The shrine of the founder of the Chishti Sufi order in South Asia.", ["eaton-2019"]],
  ["nizamuddin", "Dargah of Nizamuddin Auliya, Delhi", 28.591, 77.242, "Delhi", "India", ["islamic"], 1325, 2026, "secure", "From 1325 CE", "Shrine of the Chishti saint Nizamuddin; the poet Amir Khusrau is buried nearby.", ["eaton-2019"]],
  ["data-darbar", "Data Darbar, Lahore", 31.579, 74.305, "Lahore, Punjab", "Pakistan", ["islamic"], 1072, 2026, "approximate", "Shrine from the late 11th century", "Shrine of Ali Hujwiri, author of the Kashf al-Mahjub, one of the earliest Persian Sufi treatises.", ["eaton-2019"]],
  ["shah-jalal", "Shrine of Shah Jalal, Sylhet", 24.9, 91.87, "Sylhet", "Bangladesh", ["islamic"], 1346, 2026, "approximate", "14th century CE", "Shrine of the saint associated by tradition with the conquest of Sylhet.", ["eaton-2019"]],
  ["sixty-dome", "Sixty Dome Mosque, Bagerhat", 22.674, 89.742, "Bagerhat District", "Bangladesh", ["islamic"], 1450, 2026, "approximate", "15th century CE", "The great mosque of Khan Jahan's settlement in the Sundarbans fringe.", ["unesco-321"]],
  ["jama-ahmedabad", "Jama Masjid, Ahmedabad", 23.025, 72.59, "Ahmedabad, Gujarat", "India", ["islamic"], 1424, 2026, "secure", "1424 CE", "The congregational mosque of the Gujarat sultans.", ["eaton-2019"]],
  ["gol-gumbaz", "Gol Gumbaz, Bijapur", 16.83, 75.736, "Vijayapura, Karnataka", "India", ["islamic"], 1656, 2026, "secure", "Completed 1656 CE", "The tomb of Muhammad Adil Shah, crowned by one of the largest domes of the pre-modern world.", ["eaton-2005"]],
  ["jama-delhi", "Jama Masjid, Delhi", 28.651, 77.233, "Delhi", "India", ["islamic"], 1656, 2026, "secure", "1656 CE", "Shah Jahan's congregational mosque in Shahjahanabad.", ["richards-1993"]],
  ["badshahi", "Badshahi Mosque, Lahore", 31.588, 74.31, "Lahore, Punjab", "Pakistan", ["islamic"], 1673, 2026, "secure", "1673 CE", "Aurangzeb's great mosque facing the Lahore fort.", ["richards-1993"]],
  ["charminar", "Charminar, Hyderabad", 17.361, 78.475, "Hyderabad, Telangana", "India", ["islamic"], 1591, 2026, "secure", "1591 CE", "The monumental gateway-mosque at the heart of the Qutb Shahi city of Hyderabad.", ["eaton-2005"]],
  // Sikh
  ["nankana", "Nankana Sahib", 31.45, 73.71, "Nankana Sahib District, Punjab", "Pakistan", ["sikh"], 1469, 2026, "secure", "Birthplace of Guru Nanak, 1469 CE", "The birthplace of Guru Nanak, founder of Sikhism.", ["grewal-1990"]],
  ["kartarpur", "Kartarpur Sahib", 32.09, 75.02, "Narowal District, Punjab", "Pakistan", ["sikh"], 1521, 2026, "approximate", "Settled by Guru Nanak, c. 1520s", "The settlement where Guru Nanak spent his last years and the first Sikh community took shape.", ["grewal-1990"]],
  ["harmandir", "Harmandir Sahib, Amritsar", 31.62, 74.877, "Amritsar, Punjab", "India", ["sikh"], 1589, 2026, "conventional", "Built 1589 – 1604 CE", "The central Sikh shrine, where the Adi Granth was installed in 1604.", ["grewal-1990"]],
  ["anandpur", "Anandpur Sahib", 31.24, 76.5, "Rupnagar district, Punjab", "India", ["sikh"], 1665, 2026, "secure", "Founded 1665; Khalsa 1699", "Where Guru Gobind Singh inaugurated the Khalsa in 1699.", ["grewal-1990"]],
  ["patna-sahib", "Takht Sri Patna Sahib", 25.59, 85.23, "Patna, Bihar", "India", ["sikh"], 1666, 2026, "secure", "Birthplace of Guru Gobind Singh, 1666", "Birthplace of the tenth Sikh Guru.", ["grewal-1990"]],
  // Christian, Zoroastrian, Jewish
  ["bom-jesus", "Basilica of Bom Jesus, Goa", 15.501, 73.912, "Old Goa", "India", ["christian"], 1605, 2026, "secure", "1605 CE", "A Jesuit church of Portuguese Goa holding the relics of Francis Xavier.", ["unesco-234"]],
  ["st-francis-kochi", "St Francis Church, Kochi", 9.966, 76.242, "Fort Kochi, Kerala", "India", ["christian"], 1503, 2026, "secure", "1503 CE", "One of the oldest European-built churches in India; Vasco da Gama was first buried here.", ["asher-talbot-2006"]],
  ["kodungallur-thomas", "St Thomas tradition, Kodungallur", 10.23, 76.2, "Thrissur district, Kerala", "India", ["christian"], 52, 2026, "debated", "Tradition: arrival of St Thomas, 52 CE", "Kerala's Syrian Christians trace their church to the apostle Thomas; the tradition is not independently attested, but Christian communities in Kerala are documented by the 9th century (Tharisapalli plates).", ["sastri-1955"]],
  ["sanjan", "Sanjan", 20.2, 72.8, "Valsad district, Gujarat", "India", ["zoroastrian"], 900, 2026, "debated", "Parsi arrival, 8th–10th century (debated)", "Where, according to the Qissa-i Sanjan, Zoroastrian refugees from Iran first settled.", ["eaton-2019"]],
  ["udvada", "Iranshah Atash Behram, Udvada", 20.49, 72.87, "Valsad district, Gujarat", "India", ["zoroastrian"], 1742, 2026, "secure", "Installed at Udvada 1742 CE", "The oldest continuously burning Zoroastrian sacred fire in India.", ["eaton-2019"]],
  ["paradesi", "Paradesi Synagogue, Kochi", 9.957, 76.259, "Kochi, Kerala", "India", ["jewish"], 1568, 2026, "secure", "1568 CE", "The synagogue of the 'Paradesi' Jews of Cochin.", ["asher-talbot-2006"]],
];

/** Traditions for existing site records. */
export const TRADITIONS: Record<string, Tradition[]> = {
  sanchi: ["buddhist"], sarnath: ["buddhist"], "bodh-gaya": ["buddhist"], nalanda: ["buddhist"], ajanta: ["buddhist"],
  ellora: ["buddhist", "hindu", "jain"], amaravati: ["buddhist"], lumbini: ["buddhist"], anuradhapura: ["buddhist"],
  mihintale: ["buddhist"], polonnaruwa: ["buddhist", "hindu"], thanjavur: ["hindu"], hampi: ["hindu"], kandy: ["buddhist"],
  udayagiri: ["hindu"], taxila: ["buddhist"], mathura: ["buddhist", "jain", "hindu"], rajgir: ["buddhist", "jain"],
  vaishali: ["buddhist", "jain"], shravasti: ["buddhist"], mangulam: ["jain"],
};

/** Centres of learning, literature, art and court culture. */
const HOTSPOTS: Row[] = [
  ["varanasi", "Varanasi (Kashi)", 25.32, 83.01, "Varanasi, Uttar Pradesh", "India", ["hindu", "buddhist"], -800, 2026, "approximate", "Continuous from the 1st millennium BCE", "A sacred city and long-standing centre of Sanskrit learning.", ["singh-2008"], ["religious"]],
  ["kanchipuram", "Kanchipuram", 12.83, 79.7, "Kanchipuram, Tamil Nadu", "India", ["hindu", "buddhist", "jain"], 300, 2026, "approximate", "Pallava capital from c. 4th century CE", "Pallava capital, temple city and centre of learning visited by Xuanzang.", ["sastri-1955", "beal-1884"], ["religious"]],
  ["madurai-city", "Madurai", 9.92, 78.12, "Madurai, Tamil Nadu", "India", ["hindu", "jain"], -300, 2026, "approximate", "Early Historic onward", "Pandya capital and, in Tamil tradition, the seat of the Sangam literary academies.", ["sastri-1955"]],
  ["valabhi-city", "Valabhi", 21.89, 71.88, "Bhavnagar district, Gujarat", "India", ["buddhist", "jain"], 475, 776, "approximate", "c. 475 – 776 CE", "Maitraka capital and a famed monastic centre of learning; a Jain council was held here.", ["beal-1884"]],
  ["mithila", "Mithila (Darbhanga)", 26.15, 85.9, "Darbhanga district, Bihar", "India", ["hindu"], 1300, 1700, "approximate", "c. 14th – 17th century CE", "Centre of the Navya-Nyaya school of logic and Maithili literature (Vidyapati).", ["eaton-2019"]],
  ["nabadwip", "Nabadwip", 23.4, 88.37, "Nadia district, West Bengal", "India", ["hindu"], 1450, 1800, "approximate", "15th – 18th century CE", "Seat of Navya-Nyaya scholarship and birthplace of the Vaishnava saint Chaitanya.", ["eaton-2019"]],
  ["fatehpur-sikri", "Fatehpur Sikri", 27.094, 77.661, "Agra district, Uttar Pradesh", "India", ["islamic"], 1571, 1585, "secure", "Capital 1571 – 1585 CE", "Akbar's capital, setting of the Ibadat Khana debates among representatives of many religions.", ["unesco-255", "richards-1993"]],
  ["bijapur-court", "Bijapur court", 16.83, 75.71, "Vijayapura, Karnataka", "India", ["islamic"], 1490, 1686, "secure", "1490 – 1686 CE", "Adil Shahi court culture: painting, music and Dakhni literature.", ["eaton-2005"]],
  ["murshidabad", "Murshidabad", 24.18, 88.27, "Murshidabad district, West Bengal", "India", ["islamic"], 1704, 1790, "approximate", "c. 1704 – 1790 CE", "Capital of the Bengal Nawabs and a centre of painting and silk.", ["richards-1993"]],
  ["lucknow", "Lucknow", 26.85, 80.95, "Lucknow, Uttar Pradesh", "India", ["islamic"], 1775, 1856, "secure", "Capital 1775 – 1856 CE", "The Awadh court: Urdu poetry, music and architecture.", ["kulke-rothermund-2016"]],
  ["sharada-peeth", "Sharada Peeth", 34.79, 74.19, "Neelum valley, Azad Kashmir", "Pakistan", ["hindu", "buddhist"], 700, 1400, "debated", "Dates debated", "A temple and centre of learning in Kashmir, giving its name to the Sharada script.", ["singh-2008"], ["religious"]],
];

/** First securely attested written use of each language in the region. */
const ATTESTATIONS: Row[] = [
  ["lang-prakrit", "Prakrit — Ashokan edicts", 21.527, 70.48, "Junagadh, Gujarat", "India", [], -257, undefined, "conventional", "c. 3rd century BCE", "Middle Indo-Aryan Prakrits in Brahmi and Kharoshthi: the earliest securely dated writing after the Indus script.", ["hultzsch-1925", "salomon-1998"]],
  ["lang-greek-aramaic", "Greek and Aramaic — Kandahar", 31.62, 65.69, "Kandahar", "Afghanistan", [], -260, undefined, "conventional", "c. 3rd century BCE", "Ashoka's edicts in Greek and Aramaic for the empire's northwestern subjects.", ["salomon-1998"]],
  ["lang-sinhala-prakrit", "Sinhala Prakrit — early Brahmi caves", 8.35, 80.5, "Mihintale", "Sri Lanka", [], -250, undefined, "approximate", "c. 3rd century BCE", "Donative cave inscriptions in an early form of Sinhala Prakrit.", ["desilva-1981"]],
  ["lang-tamil", "Tamil — Tamil-Brahmi", 10.07, 78.2, "Mangulam, Madurai district", "India", [], -200, undefined, "debated", "c. 2nd century BCE (earlier dates debated)", "Earliest written Tamil, in caves and on pottery.", ["mahadevan-2003"]],
  ["lang-sanskrit", "Sanskrit — Junagadh inscription of Rudradaman", 21.527, 70.47, "Junagadh, Gujarat", "India", [], 150, undefined, "secure", "c. 150 CE", "The earliest long royal inscription in Sanskrit.", ["salomon-1998"]],
  ["lang-kannada", "Kannada — Halmidi inscription", 13.05, 75.98, "Hassan district, Karnataka", "India", [], 450, undefined, "debated", "c. 450 CE (debated)", "Often cited as the earliest Kannada inscription; its date has been questioned.", ["sastri-1955"]],
  ["lang-telugu", "Telugu — Kalamalla inscription", 14.58, 78.62, "Kadapa district, Andhra Pradesh", "India", [], 575, undefined, "approximate", "c. 575 CE", "Inscription of the Renati Chodas, usually cited as the earliest wholly Telugu inscription.", ["talbot-2001"]],
  ["lang-arabic", "Arabic — Banbhore mosque", 24.75, 67.52, "Thatta District, Sindh", "Pakistan", [], 727, undefined, "secure", "727 CE", "Arabic building inscription at the port of Daybul.", ["eaton-2019"]],
  ["lang-malayalam", "Malayalam — Vazhappally copper plate", 9.45, 76.54, "Kottayam district, Kerala", "India", [], 830, undefined, "approximate", "c. 830 CE", "Copper plate of the Chera Perumal period, the earliest Malayalam record.", ["sastri-1955"]],
  ["lang-marathi", "Marathi — Akshi inscription", 18.64, 72.88, "Raigad district, Maharashtra", "India", [], 1012, undefined, "approximate", "c. 1012 CE", "A Shilahara-period stone inscription, the earliest dated Marathi.", ["eaton-2005"]],
  ["lang-odia", "Odia — Urajam inscription", 18.3, 83.9, "Srikakulam district, Andhra Pradesh", "India", [], 1051, undefined, "approximate", "c. 1051 CE", "An Eastern Ganga record often cited as the earliest Odia inscription.", ["singh-2008"]],
  ["lang-persian", "Persian — court and inscriptions in Delhi", 28.524, 77.185, "Delhi", "India", [], 1200, undefined, "approximate", "From c. 1200 CE", "Persian becomes the language of administration and high culture under the Delhi Sultanate and Mughals.", ["eaton-2019"]],
  ["lang-punjabi", "Punjabi — Adi Granth", 31.62, 74.877, "Amritsar, Punjab", "India", [], 1604, undefined, "secure", "1604 CE", "The Sikh scripture compiled in Gurmukhi script.", ["grewal-1990"]],
];

const toSites = (rows: Row[], layers: MapLayer[], subject: string): SiteEntry[] =>
  rows.map(([id, title, lat, lng, modern, country, tradition, start, end, precision, label, summary, cite, extra]) => ({
    ...base,
    id,
    title,
    summary,
    place: { lat, lng, modern, country },
    dates: d(start, end, precision, label),
    layers: [...layers, ...(extra ?? [])],
    tradition: tradition.length ? tradition : undefined,
    subjects: [subject],
    evidence: precision === "debated" ? "debated" : "well-supported",
    cite: cite.map((x) => c(x)),
  }));

export const religiousSites = toSites(RELIGIOUS, ["religious", "temple"], "religion-philosophy").map((s) =>
  s.tradition?.includes("islamic") || s.tradition?.includes("sikh") || s.tradition?.includes("christian") || s.tradition?.includes("jewish") || s.tradition?.includes("zoroastrian")
    ? { ...s, layers: s.layers.map((l) => (l === "temple" ? ("religious" as const) : l)) }
    : s,
);
export const hotspotSites = toSites(HOTSPOTS, ["hotspot"], "art-architecture");
export const attestationSites = toSites(ATTESTATIONS, ["language"], "languages-scripts");

/** Existing sites that are also cultural hotspots. */
export const HOTSPOT_IDS = ["taxila", "nalanda", "ujjayini", "pataliputra", "hampi", "thanjavur", "keeladi", "mathura", "anuradhapura", "vikramashila"];

export const TRADITION_META: Record<Tradition, { label: string; color: string }> = {
  vedic: { label: "Vedic", color: "#B07A2A" },
  buddhist: { label: "Buddhist", color: "#D1A23B" },
  jain: { label: "Jain", color: "#5E8C4A" },
  ajivika: { label: "Ajivika", color: "#8C6B3A" },
  hindu: { label: "Hindu", color: "#C0613F" },
  islamic: { label: "Islamic", color: "#2F7A5A" },
  sikh: { label: "Sikh", color: "#3F6FA0" },
  christian: { label: "Christian", color: "#6E5AA6" },
  zoroastrian: { label: "Zoroastrian", color: "#A8402F" },
  jewish: { label: "Jewish", color: "#4E7F9E" },
};

/**
 * Approximate present-day majority-language areas, as reference points for
 * a filled language map. Minority languages, bilingual zones and dialect
 * continua are not shown. Historical distributions differed and are far less
 * certain; they are not drawn.
 */
export interface LanguagePoint { lang: string; family: string; lat: number; lng: number }

export const LANGUAGE_POINTS: LanguagePoint[] = [
  // Indo-Aryan
  ...[["Punjabi", 31.5, 74.3], ["Punjabi", 30.9, 75.85], ["Saraiki", 30.2, 71.5], ["Sindhi", 25.4, 68.4], ["Sindhi", 27.6, 68.2], ["Hindi–Urdu", 28.6, 77.2], ["Hindi–Urdu", 26.8, 80.9], ["Hindi–Urdu", 23.25, 77.4], ["Hindi–Urdu", 25.45, 78.6], ["Bihari (Bhojpuri, Magahi, Maithili)", 25.6, 85.1], ["Bihari (Bhojpuri, Magahi, Maithili)", 26.1, 86.6], ["Rajasthani", 26.3, 73.0], ["Rajasthani", 26.9, 75.8], ["Gujarati", 23.0, 72.6], ["Gujarati", 22.3, 70.8], ["Marathi", 18.5, 73.9], ["Marathi", 21.1, 79.1], ["Marathi", 19.9, 75.3], ["Konkani", 15.5, 73.8], ["Bengali", 22.6, 88.4], ["Bengali", 23.7, 90.4], ["Bengali", 24.4, 88.6], ["Bengali", 22.3, 91.8], ["Odia", 20.5, 85.9], ["Odia", 21.5, 84.0], ["Assamese", 26.1, 91.7], ["Assamese", 26.75, 94.2], ["Nepali", 27.7, 85.3], ["Nepali", 28.2, 84.0], ["Nepali", 28.7, 80.6], ["Kashmiri", 34.1, 74.8], ["Dogri", 32.7, 74.9], ["Pahari (Garhwali, Kumaoni)", 30.3, 78.6], ["Chhattisgarhi", 21.25, 81.6], ["Sinhala", 6.9, 79.9], ["Sinhala", 7.3, 80.6], ["Sinhala", 8.3, 80.4], ["Dhivehi", 4.17, 73.5]].map(([lang, lat, lng]) => ({ lang: lang as string, family: "Indo-Aryan", lat: lat as number, lng: lng as number })),
  // Dravidian
  ...[["Tamil", 13.1, 80.3], ["Tamil", 9.9, 78.1], ["Tamil", 11.0, 77.0], ["Tamil", 10.8, 79.1], ["Tamil", 9.7, 80.0], ["Tamil", 8.6, 81.2], ["Malayalam", 9.9, 76.3], ["Malayalam", 11.25, 75.8], ["Malayalam", 8.5, 76.9], ["Kannada", 13.0, 77.6], ["Kannada", 15.4, 75.1], ["Kannada", 12.3, 76.6], ["Kannada", 16.8, 75.7], ["Tulu", 12.9, 74.85], ["Telugu", 17.4, 78.5], ["Telugu", 16.5, 80.6], ["Telugu", 17.7, 83.3], ["Telugu", 13.6, 79.4], ["Telugu", 15.8, 78.0], ["Telugu", 18.7, 79.0], ["Gondi", 19.1, 82.0], ["Gondi", 19.95, 79.3], ["Brahui", 29.0, 66.6]].map(([lang, lat, lng]) => ({ lang: lang as string, family: "Dravidian", lat: lat as number, lng: lng as number })),
  // Austroasiatic
  ...[["Santali", 24.27, 87.25], ["Mundari and Ho", 22.6, 85.5], ["Khasi", 25.57, 91.88], ["Sora", 19.2, 84.1]].map(([lang, lat, lng]) => ({ lang: lang as string, family: "Austroasiatic", lat: lat as number, lng: lng as number })),
  // Tibeto-Burman
  ...[["Meitei (Manipuri)", 24.8, 93.9], ["Naga languages", 25.67, 94.1], ["Mizo", 23.73, 92.72], ["Bodo", 26.4, 90.27], ["Kokborok", 23.83, 91.28], ["Garo", 25.5, 90.2], ["Ladakhi", 34.16, 77.58], ["Balti", 35.3, 75.6], ["Dzongkha", 27.47, 89.64], ["Sikkimese and Lepcha", 27.33, 88.6], ["Adi and Nyishi", 27.9, 94.0], ["Tibetan", 29.6, 91.1]].map(([lang, lat, lng]) => ({ lang: lang as string, family: "Tibeto-Burman", lat: lat as number, lng: lng as number })),
  // Iranian
  ...[["Pashto", 34.0, 71.6], ["Pashto", 31.6, 65.7], ["Pashto", 30.2, 67.0], ["Balochi", 26.0, 63.05], ["Balochi", 27.0, 64.1], ["Dari Persian", 34.5, 69.2], ["Dari Persian", 34.35, 62.2]].map(([lang, lat, lng]) => ({ lang: lang as string, family: "Iranian", lat: lat as number, lng: lng as number })),
  // Isolates and other families
  ...[["Burushaski", 36.32, 74.67], ["Shina and Khowar (Dardic)", 35.9, 72.8]].map(([lang, lat, lng]) => ({ lang: lang as string, family: lang === "Burushaski" ? "Isolate" : "Indo-Aryan", lat: lat as number, lng: lng as number })),
];

export const FAMILY_COLORS: Record<string, string[]> = {
  "Indo-Aryan": ["#C0613F", "#D17A4E", "#B5543A", "#E08A5C", "#A84A30", "#CF6E4A", "#E29A6A", "#B8623E", "#D98B5F", "#C47450"],
  Dravidian: ["#5E8C4A", "#4E7A3E", "#6FA05A", "#3F6E35", "#7EAD62", "#58965A", "#467F4B"],
  Austroasiatic: ["#D1A23B", "#C08A1E", "#E0B656", "#B88A2A"],
  "Tibeto-Burman": ["#3F6FA0", "#5A86B5", "#2F5F8F", "#6D96C2", "#4C79A8", "#3A6895", "#5B8DBF", "#4570A0", "#6A8FB8", "#3D6A9A", "#5480AD", "#2F5A86"],
  Iranian: ["#7E5A9E", "#9B4F7A", "#6E5AA6"],
  Isolate: ["#777777"],
};

export const LANGUAGE_SOURCES = ["kulke-rothermund-2016", "witzel-1995", "chaubey-2011"];
