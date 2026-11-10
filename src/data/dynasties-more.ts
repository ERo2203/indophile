import type { Anchor, PolityEntry } from "@/lib/types";
import { d } from "./helpers";
import { a, make } from "./dynasties";

/**
 * Additional polities and located places.
 *
 * Roles drive both the filled map (capitals reach furthest; inscriptions and
 * temples least) and the map's point layers: places whose role mentions an
 * inscription or a temple also appear on the Inscriptions and Temples layers.
 * Years on a place are the span during which it counted for that polity;
 * where only an approximate decade is known the role says so.
 */

export const MORE_ANCHORS: Record<string, Anchor[]> = {
  "delhi-sultanate-polity": [
    a("Qutb complex", 28.524, 77.185, "mosque and minar, inscriptions from 1199", 1199, 1526),
    a("Badaun", 28.03, 79.12, "province"),
    a("Kara", 25.69, 81.37, "province", 1206, 1394),
    a("Awadh (Ayodhya)", 26.8, 82.2, "province", 1226, 1394),
    a("Kannauj", 27.05, 79.92, "province", 1194, 1394),
    a("Gwalior", 26.23, 78.17, "fort", 1232, 1398),
    a("Ranthambhor", 26.02, 76.5, "fort", 1301, 1398),
    a("Anahilapataka (Patan)", 23.85, 72.12, "province of Gujarat", 1304, 1407),
    a("Dhar", 22.6, 75.3, "province of Malwa", 1305, 1392),
    a("Chanderi", 24.72, 78.14, "fort", 1305, 1392),
    a("Hansi", 29.1, 75.96, "fort"),
    a("Sirhind", 30.64, 76.39, "city", 1360, 1526),
    a("Bayana", 26.91, 77.29, "fort", 1196, 1526),
  ],
  bahmani: [
    a("Kalyani", 17.87, 76.95, "fort"),
    a("Sholapur", 17.66, 75.9, "fort"),
    a("Paithan", 19.48, 75.38, "city"),
    a("Dabhol", 17.59, 73.18, "port"),
    a("Chaul", 18.55, 72.93, "port"),
    a("Warangal", 17.96, 79.6, "annexed 1425", 1425, 1527),
    a("Belgaum", 15.85, 74.5, "fort, taken 1473", 1473, 1527),
    a("Mahur", 19.83, 77.92, "fort"),
  ],
  vijayanagara: [
    a("Virupaksha temple, Hampi", 15.335, 76.459, "temple", 1336, 1565),
    a("Gooty", 15.12, 77.63, "fort", 1340, 1600),
    a("Halebidu", 13.21, 75.99, "former Hoysala capital", 1346, 1600),
    a("Talakad", 12.18, 77.03, "town", 1346, 1600),
    a("Kolar", 13.14, 78.13, "province", 1350, 1600),
    a("Padaividu", 12.68, 79.12, "taken by Kumara Kampana c. 1360s", 1365, 1600),
    a("Kanchipuram", 12.83, 79.7, "province", 1365, 1646),
    a("Madurai", 9.92, 78.12, "taken from the Madurai Sultanate", 1378, 1565),
    a("Mangaluru", 12.87, 74.84, "port"),
    a("Bhatkal", 13.98, 74.56, "port", 1340, 1565),
    a("Tirumala temple", 13.68, 79.35, "temple patronage, inscriptions", 1400, 1646),
    a("Chandragiri", 13.58, 79.32, "fort", 1400, 1646),
  ],
  "reddi-kingdom": [a("Kondapalli", 16.62, 80.54, "fort"), a("Srisailam", 16.07, 78.87, "temple patronage")],
  padmanayaka: [a("Bhuvanagiri", 17.51, 78.89, "fort"), a("Nalgonda", 17.05, 79.27, "town")],
  "musunuri-nayakas": [a("Rekapalli", 17.52, 81.37, "early base"), a("Bhadrachalam", 17.67, 80.89, "town")],
  gajapati: [a("Rajamahendravaram", 17.0, 81.8, "fort", 1444, 1515), a("Kondapalli", 16.62, 80.54, "fort", 1454, 1515), a("Udayagiri (Nellore)", 14.87, 79.3, "fort", 1460, 1514), a("Srikurmam", 18.27, 84.0, "temple")],
  "eastern-ganga": [a("Srikurmam", 18.27, 84.0, "temple inscriptions"), a("Simhachalam", 17.77, 83.25, "temple, 13th century"), a("Draksharama", 16.79, 82.06, "temple inscriptions"), a("Bhubaneswar", 20.24, 85.83, "temples")],
  "bengal-sultanate": [a("Satgaon", 22.95, 88.38, "port"), a("Sylhet", 24.9, 91.87, "province"), a("Chittagong", 22.34, 91.82, "port", 1340, 1580), a("Adina Mosque, Pandua", 25.15, 88.16, "mosque, 1373", 1373, 1576)],
  "gujarat-sultanate": [a("Junagadh", 21.52, 70.46, "taken 1472", 1472, 1573), a("Bharuch", 21.7, 72.98, "port"), a("Diu", 20.71, 70.98, "port", 1407, 1535), a("Anahilapataka (Patan)", 23.85, 72.12, "town")],
  "malwa-sultanate": [a("Ujjain", 23.18, 75.78, "city"), a("Sarangpur", 23.57, 76.47, "town"), a("Raisen", 23.33, 77.79, "fort")],
  "jaunpur-sultanate": [a("Kara", 25.69, 81.37, "province"), a("Awadh (Ayodhya)", 26.8, 82.2, "province"), a("Atala Mosque", 25.75, 82.69, "mosque, 1408")],
  "kashmir-sultanate": [a("Anantnag", 33.73, 75.15, "town"), a("Baramulla", 34.2, 74.34, "town")],
  mewar: [a("Ranakpur", 25.12, 73.47, "Jain temple, 1437", 1437, 1818), a("Mandalgarh", 25.2, 75.07, "fort")],
  marwar: [a("Merta", 26.65, 74.03, "town"), a("Pali", 25.77, 73.32, "town")],
  "ahom-kingdom": [a("Jorhat", 26.75, 94.2, "capital, 1794", 1794, 1826), a("Kaliabor", 26.55, 92.98, "frontier post"), a("Rang Ghar, Sivasagar", 26.99, 94.63, "pavilion, 18th century")],
  "imperial-cholas": [a("Brihadisvara temple", 10.783, 79.132, "temple, c. 1010", 1010, 1279), a("Airavatesvara temple", 10.95, 79.36, "temple", 1150, 1279), a("Chidambaram", 11.4, 79.69, "temple patronage"), a("Srirangam", 10.86, 78.69, "temple inscriptions"), a("Tiruvarur", 10.77, 79.64, "temple")],
  hoysala: [a("Chennakeshava temple, Belur", 13.163, 75.86, "temple, 1117", 1117, 1343), a("Hoysaleswara temple, Halebidu", 13.21, 75.995, "temple", 1121, 1343), a("Shravanabelagola", 12.86, 76.49, "inscriptions"), a("Talakad", 12.18, 77.03, "taken 1116", 1116, 1343), a("Hassan", 13.0, 76.1, "town")],
  kakatiya: [a("Thousand Pillar Temple", 18.0, 79.57, "temple, 1163", 1163, 1323), a("Warangal Fort", 17.96, 79.6, "fort"), a("Tripurantakam", 15.99, 79.46, "temple inscriptions"), a("Kolanupaka", 17.7, 79.0, "temple"), a("Pakhal Lake", 17.95, 79.98, "reservoir")],
  "chalukya-kalyani": [a("Annigeri", 15.43, 75.43, "capital for a time"), a("Ittagi", 15.52, 75.97, "temple"), a("Balligavi", 14.36, 75.15, "temples and inscriptions"), a("Bijapur", 16.83, 75.71, "town")],
  rashtrakuta: [a("Kailasa temple, Ellora", 20.024, 75.179, "temple, c. 756–773"), a("Elapura", 20.03, 75.17, "royal centre"), a("Nashik", 19.94, 73.75, "town")],
  "chalukya-badami": [a("Aihole inscription", 16.02, 75.88, "inscription, 634 CE"), a("Mahakuta", 15.94, 75.73, "temples"), a("Badami cave temples", 15.918, 75.675, "cave temples, 578 CE inscription"), a("Pattadakal temples", 15.95, 75.82, "temples")],
  pallava: [a("Shore Temple", 12.617, 80.199, "temple, early 8th century"), a("Kailasanatha temple, Kanchi", 12.84, 79.69, "temple"), a("Tiruchirappalli rock-cut cave", 10.81, 78.7, "cave inscription"), a("Mahendravadi", 12.95, 79.6, "inscription")],
  pala: [a("Bodh Gaya", 24.696, 84.991, "inscriptions"), a("Gauda", 24.87, 88.13, "city"), a("Jagjivanpur", 25.0, 88.4, "monastery and copper plate"), a("Odantapuri (Bihar Sharif)", 25.2, 85.52, "monastery")],
  "gurjara-pratihara": [a("Kannauj", 27.05, 79.92, "capital"), a("Mandore", 26.35, 73.05, "early seat"), a("Bateshwar", 26.43, 78.2, "temple group"), a("Prayaga", 25.43, 81.88, "town")],
  chandela: [a("Kandariya Mahadeva temple", 24.853, 79.919, "temple, c. 1030"), a("Lakshmana temple, Khajuraho", 24.851, 79.922, "temple, inscription of 954", 954, 1315)],
  paramara: [a("Udaipur (Vidisha)", 23.9, 78.06, "Udayeshvara temple"), a("Bhojshala, Dhar", 22.6, 75.3, "inscribed hall")],
  chaulukya: [a("Rani ki Vav", 23.859, 72.102, "stepwell", 1063, 1244), a("Modhera Sun Temple", 23.583, 72.133, "temple, 1026", 1026, 1244), a("Siddhpur", 23.92, 72.37, "town")],
  "eastern-chalukya": [a("Biccavolu", 17.0, 82.07, "temples"), a("Draksharama", 16.79, 82.06, "temple")],
  "western-ganga": [a("Gommateshvara, Shravanabelagola", 12.854, 76.484, "colossus, c. 983", 983, 1000), a("Manne", 13.3, 77.47, "capital for a time")],
  kadamba: [a("Talagunda pillar", 14.42, 75.25, "inscription"), a("Halasi", 15.54, 74.58, "capital for a time")],
  "anuradhapura-kingdom": [a("Abhayagiri", 8.37, 80.4, "monastery"), a("Jetavana", 8.35, 80.4, "stupa"), a("Tissamaharama", 6.28, 81.29, "southern centre (Ruhuna)")],
  "polonnaruwa-kingdom": [a("Parakrama Samudra", 7.91, 80.97, "reservoir"), a("Gal Vihara", 7.966, 81.004, "rock-cut Buddhas")],
  "mughal-empire": [a("Humayun's tomb", 28.593, 77.25, "tomb, 1570", 1570, 1857), a("Taj Mahal", 27.175, 78.042, "mausoleum, 1632–1653", 1648, 1857), a("Allahabad", 25.43, 81.88, "provincial capital", 1583, 1765), a("Patna", 25.594, 85.137, "provincial capital", 1576, 1717), a("Multan", 30.2, 71.47, "province", 1556, 1752), a("Thatta", 24.75, 67.92, "province of Sindh", 1592, 1739), a("Srinagar", 34.08, 74.8, "province of Kashmir", 1586, 1752), a("Ajmer", 26.45, 74.64, "province", 1559, 1750)],
  "maratha-confederacy": [a("Sindhudurg", 16.04, 73.46, "sea fort", 1667, 1818), a("Jhansi", 25.45, 78.57, "fort", 1742, 1818), a("Cuttack", 20.46, 85.88, "Bhonsle province", 1751, 1803), a("Ahmedabad", 23.03, 72.58, "taken 1753", 1753, 1817)],
  "sikh-empire": [a("Kangra", 32.1, 76.27, "fort", 1809, 1849), a("Jammu", 32.73, 74.86, "Dogra feudatory", 1808, 1846)],
};

export const moreDynasties: PolityEntry[] = [
  // ——— Ancient
  make({ id: "indo-scythian", title: "Indo-Scythians (Sakas)", aliases: ["Saka", "Maues", "Northern Satraps"], kind: "kingdom", dates: d(-90, 30, "approximate", "c. 90 BCE – early 1st century CE"), region: "Northwest and Mathura", summary: "Saka rulers who displaced the Indo-Greeks in Gandhara under Maues and later governed Mathura through satraps.", anchors: [a("Taxila (Sirkap)", 33.755, 72.829), a("Mathura", 27.49, 77.67, "satrapal capital"), a("Mora", 27.6, 77.7, "inscription")], radius: 0.6, cite: ["singh-2008", "marshall-1951"], related: ["indo-greek", "kushan"] }),
  make({ id: "indo-parthian", title: "Indo-Parthians (Gondophares)", kind: "kingdom", dates: d(19, 100, "approximate", "c. 19 – 100 CE"), region: "Gandhara and Arachosia", summary: "Parthian rulers of the northwest, best known from Gondophares and the Takht-i-Bahi inscription.", anchors: [a("Takht-i-Bahi", 34.29, 71.95, "monastery and inscription"), a("Taxila", 33.755, 72.829), a("Kandahar", 31.62, 65.69, "city")], radius: 0.6, cite: ["singh-2008"], related: ["kushan", "indo-scythian"] }),
  make({ id: "yaudheya", title: "Yaudheya republic", kind: "republic", dates: d(-200, 350, "approximate", "c. 2nd century BCE – 4th century CE"), region: "Haryana and the Sutlej–Yamuna divide", summary: "A gana-sangha known from its coins and seals and named among the peoples who submitted to Samudragupta — a reminder that republics outlived the age of the Buddha.", anchors: [a("Rohtak (Khokrakot)", 28.9, 76.6, "coin moulds"), a("Sunet", 30.87, 75.85, "coin finds")], radius: 0.6, cite: ["singh-2008", "fleet-1888"], related: ["gupta"] }),
  make({ id: "vishnukundina", title: "Vishnukundinas", kind: "kingdom", dates: d(420, 624, "approximate", "c. 420 – 624 CE"), region: "Andhra", summary: "An Andhra dynasty, patrons of the Undavalli caves, displaced by the Eastern Chalukyas.", anchors: [a("Indrapalanagara", 17.26, 79.27, "capital"), a("Undavalli caves", 16.5, 80.58, "rock-cut caves"), a("Vinukonda", 16.05, 79.74, "fort")], radius: 0.55, cite: ["sastri-1955"], related: ["eastern-chalukya"] }),
  make({ id: "alchon-huns", title: "Alchon Huns (Hunas)", aliases: ["Toramana", "Mihirakula", "Huna"], kind: "kingdom", dates: d(480, 560, "approximate", "c. 480 – 560 CE"), region: "Northwest and central India", summary: "Central Asian rulers whose kings Toramana and Mihirakula left inscriptions at Eran and Gwalior; their incursions weakened the Gupta state.", anchors: [a("Sakala (Sialkot)", 32.49, 74.53, "capital"), a("Eran", 24.09, 78.17, "boar inscription of Toramana"), a("Gwalior", 26.23, 78.17, "inscription of Mihirakula")], radius: 0.5, cite: ["fleet-1888", "singh-2008"], related: ["gupta", "aulikara"] }),
  make({ id: "aulikara", title: "Aulikaras of Dashapura", aliases: ["Yashodharman"], kind: "kingdom", dates: d(400, 545, "approximate", "c. 5th – mid 6th century CE"), region: "Western Malwa", summary: "A Malwa dynasty whose Yashodharman claimed victory over the Huna Mihirakula in the Mandasor pillar inscriptions.", anchors: [a("Dashapura (Mandsaur)", 24.07, 75.07), a("Sondhni", 24.05, 75.1, "pillar inscriptions")], radius: 0.5, cite: ["fleet-1888"], related: ["alchon-huns"] }),
  make({ id: "gauda-shashanka", title: "Gauda kingdom of Shashanka", kind: "kingdom", dates: d(590, 625, "approximate", "c. 590 – 625 CE"), region: "Bengal", summary: "Shashanka's kingdom of Gauda, rival of Harsha, ruled from Karnasuvarna.", anchors: [a("Karnasuvarna", 24.08, 88.15)], radius: 0.6, cite: ["singh-2008"], related: ["pushyabhuti"] }),
  make({ id: "bhauma-kara", title: "Bhauma-Karas of Odisha", kind: "kingdom", dates: d(736, 940, "approximate", "c. 8th – 10th century CE"), region: "Coastal Odisha", summary: "A dynasty of Odisha known from copper plates, patrons of both Buddhist and Brahmanical institutions.", anchors: [a("Guhadeva-pataka (Jajpur)", 20.85, 86.33), a("Ratnagiri", 20.64, 86.33, "Buddhist monastery")], radius: 0.5, cite: ["singh-2008"] }),
  make({ id: "somavamshi", title: "Somavamshis of Odisha", kind: "kingdom", dates: d(882, 1110, "approximate", "c. 882 – 1110 CE"), region: "Odisha", summary: "Rulers of Odisha associated with the early temples of Bhubaneswar.", anchors: [a("Yayatinagara", 20.82, 84.73), a("Bhubaneswar", 20.24, 85.83, "temples")], radius: 0.55, cite: ["singh-2008"], related: ["eastern-ganga"] }),
  make({ id: "arab-sindh", title: "Arab Sindh (Umayyad–Abbasid province)", aliases: ["Mansura", "Habbari emirate", "Multan emirate"], kind: "kingdom", dates: d(712, 1026, "approximate", "712 – early 11th century CE"), region: "Sindh and southern Punjab", summary: "After Muhammad bin Qasim's conquest in 712, Sindh was a province of the caliphate, later ruled by local emirates at Mansura and Multan until the Ghaznavid period.", anchors: [a("Mansura", 25.88, 68.78, "capital"), a("Daybul (Banbhore)", 24.75, 67.52, "port; mosque inscription"), a("Multan", 30.2, 71.47, "emirate")], radius: 0.55, cite: ["eaton-2019", "kulke-rothermund-2016"] }),
  make({ id: "shilahara", title: "Shilaharas", kind: "kingdom", dates: d(800, 1265, "approximate", "c. 800 – 1265 CE"), region: "Konkan and Kolhapur", summary: "Branches of the Shilahara family ruled the northern and southern Konkan and Kolhapur, often as feudatories of larger Deccan powers.", anchors: [a("Sthanaka (Thane)", 19.2, 72.97), a("Kolhapur", 16.7, 74.24), a("Ambernath temple", 19.2, 73.19, "temple, 1060")], radius: 0.45, cite: ["sastri-1955"] }),
  make({ id: "goa-kadamba", title: "Kadambas of Goa", kind: "kingdom", dates: d(960, 1345, "approximate", "c. 960 – 1345 CE"), region: "Goa and the Konkan coast", summary: "A coastal dynasty ruling from Chandor and then Gopakapattana, a busy port.", anchors: [a("Chandrapura (Chandor)", 15.26, 74.04, "early capital"), a("Gopakapattana", 15.44, 73.86, "port capital")], radius: 0.35, cite: ["sastri-1955"] }),
  make({ id: "ghurid", title: "Ghurids (in India)", kind: "empire", dates: d(1175, 1206, "conventional", "1175 – 1206 CE"), region: "Afghanistan and North India", summary: "Muhammad of Ghur's campaigns took Lahore (1186), defeated Prithviraja at Tarain (1192) and reached Bihar and Bengal; his generals founded the Delhi Sultanate.", anchors: [a("Ghazni", 33.55, 68.42, "capital"), a("Lahore", 31.55, 74.34, "taken 1186", 1186, 1206), a("Delhi", 28.61, 77.21, "taken 1192", 1192, 1206), a("Ajmer", 26.45, 74.64, "taken 1192", 1192, 1206), a("Kannauj", 27.05, 79.92, "taken 1194", 1194, 1206), a("Lakhnauti", 24.87, 88.13, "taken c. 1204", 1204, 1206)], radius: 0.6, cite: ["eaton-2019", "chandra-2004"], related: ["delhi-sultanate-polity", "ghaznavid", "evt-tarain"] }),

  // ——— South, c. 1300–1500 (cf. the 1350 political map)
  make({ id: "kampili", title: "Kampili kingdom", kind: "kingdom", dates: d(1290, 1327, "approximate", "c. 1290 – 1327 CE"), region: "Tungabhadra valley", summary: "A short-lived kingdom on the Tungabhadra destroyed by Muhammad bin Tughluq; its former officers are traditionally linked to the founding of Vijayanagara.", anchors: [a("Kummata", 15.37, 76.37, "hill fort"), a("Hosadurga", 15.4, 76.5, "fort")], radius: 0.45, cite: ["eaton-2005", "sastri-1955"], related: ["vijayanagara"] }),
  make({ id: "madurai-sultanate", title: "Madurai Sultanate", aliases: ["Sultanate of Ma'bar"], kind: "sultanate", dates: d(1335, 1378, "conventional", "1335 – 1378 CE"), region: "Southern Tamil country", summary: "A sultanate founded by the Tughluq governor Jalaluddin Ahsan Khan, described by Ibn Battuta, and ended by Vijayanagara's Kumara Kampana.", anchors: [a("Madurai", 9.92, 78.12), a("Kayal", 8.57, 78.12, "port"), a("Ramanathapuram", 9.37, 78.83, "town")], radius: 0.55, cite: ["sastri-1955", "eaton-2005"], related: ["vijayanagara", "delhi-sultanate-polity"] }),
  make({ id: "sambuvarayar", title: "Sambuvarayars of Padaividu", aliases: ["Arcot", "Rajagambhira"], kind: "chiefdom", dates: d(1250, 1365, "debated", "c. 13th century – c. 1365 CE"), region: "Northern Tamil country (Arcot region)", summary: "A chiefly lineage of the Palar valley that asserted independence after the Chola decline and was subdued by Vijayanagara's Kumara Kampana.", anchors: [a("Padaividu", 12.68, 79.12, "seat"), a("Kanchipuram", 12.83, 79.7, "city"), a("Arcot", 12.9, 79.32, "town")], radius: 0.55, cite: ["sastri-1955"], related: ["vijayanagara"] }),
  make({ id: "venad", title: "Venad", aliases: ["Kingdom of Quilon", "Kupaka"], kind: "kingdom", dates: d(1124, 1729, "approximate", "c. 12th century – 1729 CE"), region: "South Kerala", summary: "The southern Kerala kingdom centred on Kollam that emerged after the Chera Perumals and was reorganised as Travancore by Marthanda Varma.", anchors: [a("Kollam (Quilon)", 8.89, 76.61), a("Thiruvananthapuram", 8.48, 76.94, "Padmanabhaswamy temple"), a("Kalkulam (Padmanabhapuram)", 8.25, 77.33, "fort")], radius: 0.45, cite: ["sastri-1955", "asher-talbot-2006"], related: ["travancore", "chera-perumals"] }),
  make({ id: "cochin-kingdom", title: "Kingdom of Cochin (Perumpadappu)", kind: "kingdom", dates: d(1405, 1949, "approximate", "c. 1405 – 1949 CE"), region: "Central Kerala", summary: "A Kerala kingdom that allied with the Portuguese against the Zamorin and later came under Dutch and British influence.", anchors: [a("Kochi", 9.97, 76.24), a("Thrissur", 10.52, 76.21, "town")], radius: 0.3, cite: ["asher-talbot-2006"] }),
  make({ id: "kolathunad", title: "Kolathunad", kind: "kingdom", dates: d(1100, 1766, "approximate", "c. 12th century – 1766 CE"), region: "North Kerala", summary: "The northern Malabar kingdom of the Kolathiris, centred near Kannur.", anchors: [a("Chirakkal", 11.9, 75.35), a("Ezhimala", 12.03, 75.21, "hill fort")], radius: 0.35, cite: ["asher-talbot-2006"] }),
  make({ id: "vanni", title: "Vanni chieftaincies", kind: "chiefdom", dates: d(1250, 1803, "approximate", "c. 13th century – 1803 CE"), region: "North-central Sri Lanka", summary: "Semi-independent chiefs (vanniyar) of the dry zone between the Jaffna kingdom and the Sinhala kingdoms, finally subdued by the British.", anchors: [a("Vavuniya", 8.75, 80.5, "region"), a("Mullaitivu", 9.27, 80.81, "region"), a("Panankamam", 9.1, 80.36, "seat")], radius: 0.4, cite: ["desilva-1981"], related: ["jaffna-kingdom"] }),
  make({ id: "gingee-nayaks", title: "Nayakas of Gingee", kind: "kingdom", dates: d(1509, 1649, "approximate", "c. 1509 – 1649 CE"), region: "Northern Tamil country", summary: "Vijayanagara Nayaka governors of the Gingee fortress, later taken by Bijapur and then the Marathas.", anchors: [a("Gingee", 12.25, 79.42), a("Tiruvannamalai", 12.23, 79.07, "temple")], radius: 0.4, cite: ["asher-talbot-2006"], related: ["vijayanagara", "maratha-confederacy"] }),

  // ——— North, east and northeast, c. 1350–1750
  make({ id: "samma-sindh", title: "Samma Sultanate of Sindh", kind: "sultanate", dates: d(1351, 1524, "conventional", "1351 – 1524 CE"), region: "Lower Sindh", summary: "A Sindhi dynasty ruling from Thatta; its royal necropolis on the Makli hills is a World Heritage site.", anchors: [a("Thatta", 24.75, 67.92), a("Makli necropolis", 24.76, 67.9, "tombs")], radius: 0.55, cite: ["eaton-2019"] }),
  make({ id: "langah-multan", title: "Langah Sultanate of Multan", kind: "sultanate", dates: d(1445, 1526, "conventional", "1445 – 1526 CE"), region: "Southern Punjab", summary: "An independent sultanate of Multan between the Delhi Sultanate's decline and the Mughal conquest.", anchors: [a("Multan", 30.2, 71.47), a("Uch", 29.24, 71.05, "Sufi shrines")], radius: 0.5, cite: ["chandra-2004"] }),
  make({ id: "khandesh", title: "Khandesh (Farooqi Sultanate)", kind: "sultanate", dates: d(1382, 1601, "conventional", "1382 – 1601 CE"), region: "Tapti valley", summary: "A sultanate of the Tapti valley whose fortress of Asirgarh fell to Akbar in 1601.", anchors: [a("Burhanpur", 21.31, 76.23), a("Asirgarh", 21.47, 76.29, "fortress"), a("Thalner", 21.25, 74.97, "fort")], radius: 0.45, cite: ["richards-1993", "chandra-2004"] }),
  make({ id: "garha-mandla", title: "Garha–Mandla (Gond kingdom)", aliases: ["Rani Durgavati"], kind: "kingdom", dates: d(1400, 1781, "approximate", "c. 15th century – 1781 CE"), region: "Upper Narmada (Gondwana)", summary: "A Gond kingdom of the upper Narmada; its queen Rani Durgavati died resisting the Mughals in 1564.", anchors: [a("Garha", 23.15, 79.9), a("Mandla", 22.6, 80.37, "later capital"), a("Singorgarh", 23.43, 79.71, "fort")], radius: 0.55, cite: ["richards-1993"] }),
  make({ id: "tripura-kingdom", title: "Tripura (Manikya dynasty)", kind: "kingdom", dates: d(1400, 1949, "approximate", "c. 15th century – 1949 CE"), region: "Tripura hills and plains", summary: "A kingdom of the Manikya rulers, chronicled in the Rajmala, that at times held much of eastern Bengal.", anchors: [a("Udaipur (Tripura)", 23.53, 91.48), a("Agartala", 23.83, 91.28, "later capital", 1760, 1949)], radius: 0.4, cite: ["kulke-rothermund-2016"] }),
  make({ id: "manipur-kingdom", title: "Manipur (Meitei kingdom)", kind: "kingdom", dates: d(1400, 1891, "approximate", "c. 15th century – 1891 CE"), region: "Imphal valley", summary: "The Meitei kingdom of the Imphal valley, recorded in the royal chronicle Cheitharol Kumbaba; it became a British protectorate after 1891.", anchors: [a("Kangla (Imphal)", 24.81, 93.94)], radius: 0.35, cite: ["kulke-rothermund-2016"] }),
  make({ id: "mrauk-u", title: "Mrauk U (Arakan)", kind: "kingdom", dates: d(1430, 1785, "conventional", "1430 – 1785 CE"), region: "Arakan coast and Chittagong", summary: "A coastal kingdom that held Chittagong for long periods and had close ties with the Bengal Sultanate.", anchors: [a("Mrauk U", 20.6, 93.19), a("Chittagong", 22.34, 91.82, "port", 1580, 1666)], radius: 0.5, cite: ["eaton-2019"], related: ["bengal-sultanate"] }),
  make({ id: "garhwal", title: "Garhwal kingdom", kind: "kingdom", dates: d(1400, 1804, "approximate", "c. 15th century – 1804 CE"), region: "Central Himalaya", summary: "A Himalayan kingdom of the upper Ganga, ruled from Srinagar (Garhwal) until the Gorkha conquest.", anchors: [a("Srinagar (Garhwal)", 30.22, 78.78), a("Devalgarh", 30.27, 78.82, "early seat")], radius: 0.35, cite: ["kulke-rothermund-2016"] }),
  make({ id: "kumaon", title: "Kumaon (Chand dynasty)", kind: "kingdom", dates: d(1400, 1790, "approximate", "c. 15th century – 1790 CE"), region: "Central Himalaya", summary: "The Chand kingdom of Kumaon, later ruled from Almora, conquered by the Gorkhas in 1790.", anchors: [a("Champawat", 29.34, 80.09, "early capital"), a("Almora", 29.6, 79.66, "capital from 1563", 1563, 1790)], radius: 0.35, cite: ["kulke-rothermund-2016"] }),
  make({ id: "gorkha-nepal", title: "Kingdom of Nepal (Gorkha)", kind: "kingdom", dates: d(1768, 2008, "secure", "1768 – 2008 CE"), region: "Himalaya", summary: "The kingdom unified by Prithvi Narayan Shah, who took the Kathmandu valley in 1768; it expanded across the central Himalaya until the Anglo-Nepalese war (1814–16).", anchors: [a("Kathmandu", 27.7, 85.32), a("Gorkha", 28.0, 84.63, "origin"), a("Almora", 29.6, 79.66, "conquered 1790", 1790, 1815), a("Srinagar (Garhwal)", 30.22, 78.78, "conquered 1804", 1804, 1815)], radius: 0.4, cite: ["kulke-rothermund-2016"] }),
  make({ id: "bundela", title: "Bundelas of Orchha", kind: "kingdom", dates: d(1531, 1783, "approximate", "1531 – 18th century CE"), region: "Bundelkhand", summary: "A Rajput dynasty whose capital Orchha preserves palaces and temples of the 16th–17th centuries.", anchors: [a("Orchha", 25.35, 78.64), a("Datia", 25.67, 78.46, "palace")], radius: 0.4, cite: ["richards-1993"] }),
  make({ id: "amber-jaipur", title: "Amber / Jaipur (Kachwahas)", kind: "kingdom", dates: d(1500, 1818, "approximate", "c. 1500 – 1818 CE"), region: "East Rajasthan", summary: "A Rajput kingdom closely allied to the Mughals; Jai Singh II founded Jaipur in 1727 and built its observatories.", anchors: [a("Amber", 26.99, 75.85, "capital to 1727", 1500, 1727), a("Jaipur", 26.92, 75.82, "capital from 1727", 1727, 1818), a("Jantar Mantar", 26.925, 75.824, "observatory", 1734, 1818)], radius: 0.45, cite: ["richards-1993"] }),
  make({ id: "bikaner", title: "Bikaner", kind: "kingdom", dates: d(1488, 1818, "conventional"), region: "North Rajasthan", summary: "A Rathore kingdom of the Thar desert founded by Rao Bika in 1488.", anchors: [a("Bikaner", 28.02, 73.31)], radius: 0.6, cite: ["richards-1993"] }),
  make({ id: "jaisalmer", title: "Jaisalmer", kind: "kingdom", dates: d(1156, 1818, "conventional"), region: "West Rajasthan", summary: "A Bhati Rajput kingdom on desert caravan routes, ruled from the hill fort founded in 1156.", anchors: [a("Jaisalmer", 26.91, 70.91)], radius: 0.6, cite: ["richards-1993"] }),
];

/** Present-day Indian Ocean context is drawn as Sri Lanka and Maldives only. */
export const MALDIVES: PolityEntry[] = [
  make({ id: "maldives-sultanate", title: "Maldives Sultanate", kind: "sultanate", dates: d(1153, 1968, "conventional", "1153 – 1968 CE"), region: "Maldive islands", summary: "The Maldives converted to Islam, by tradition in 1153, and remained a sultanate until 1968; Ibn Battuta served there as a judge.", anchors: [a("Malé", 4.17, 73.51)], radius: 0.6, cite: ["kulke-rothermund-2016"] }),
];
