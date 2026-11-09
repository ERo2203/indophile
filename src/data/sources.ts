import type { Source } from "@/lib/types";

/**
 * Reusable bibliography. One record per work; entries cite by id.
 * `verified` marks bibliographic records an editor has checked against the
 * publication itself. Unverified records are shown with a flag and block
 * publishing of entries that rely on them alone (see src/lib/validate.ts).
 */
export const sources: Source[] = [
  // ——— Syntheses
  { id: "coningham-young-2015", kind: "book", authors: "Coningham, R. & Young, R.", year: 2015, title: "The Archaeology of South Asia: From the Indus to Asoka, c. 6500 BCE–200 CE", publisher: "Cambridge University Press", verified: true },
  { id: "singh-2008", kind: "book", authors: "Singh, U.", year: 2008, title: "A History of Ancient and Early Medieval India: From the Stone Age to the 12th Century", publisher: "Pearson Longman", verified: true },
  { id: "thapar-2002", kind: "book", authors: "Thapar, R.", year: 2002, title: "Early India: From the Origins to AD 1300", publisher: "Allen Lane / University of California Press", verified: true },
  { id: "allchin-1982", kind: "book", authors: "Allchin, B. & Allchin, R.", year: 1982, title: "The Rise of Civilization in India and Pakistan", publisher: "Cambridge University Press", verified: true },
  { id: "chakrabarti-1999", kind: "book", authors: "Chakrabarti, D. K.", year: 1999, title: "India: An Archaeological History", publisher: "Oxford University Press", verified: true },
  { id: "ghosh-1989", kind: "book", authors: "Ghosh, A. (ed.)", year: 1989, title: "An Encyclopaedia of Indian Archaeology", publisher: "Munshiram Manoharlal", verified: true },

  // ——— Indus
  { id: "possehl-2002", kind: "book", authors: "Possehl, G. L.", year: 2002, title: "The Indus Civilization: A Contemporary Perspective", publisher: "AltaMira Press", verified: true },
  { id: "kenoyer-1998", kind: "book", authors: "Kenoyer, J. M.", year: 1998, title: "Ancient Cities of the Indus Valley Civilization", publisher: "Oxford University Press", verified: true },
  { id: "wright-2010", kind: "book", authors: "Wright, R. P.", year: 2010, title: "The Ancient Indus: Urbanism, Economy, and Society", publisher: "Cambridge University Press", verified: true },
  { id: "marshall-1931", kind: "excavation-report", authors: "Marshall, J. (ed.)", year: 1931, title: "Mohenjo-daro and the Indus Civilization", publisher: "Arthur Probsthain", verified: true },
  { id: "vats-1940", kind: "excavation-report", authors: "Vats, M. S.", year: 1940, title: "Excavations at Harappa", publisher: "Government of India Press", verified: true },
  { id: "meadow-1991", kind: "excavation-report", authors: "Meadow, R. H. (ed.)", year: 1991, title: "Harappa Excavations 1986–1990: A Multidisciplinary Approach to Third Millennium Urbanism", publisher: "Prehistory Press", verified: true },
  { id: "rao-1979", kind: "excavation-report", authors: "Rao, S. R.", year: 1979, title: "Lothal: A Harappan Port Town (1955–62), Vol. I", container: "Memoirs of the Archaeological Survey of India 78", publisher: "Archaeological Survey of India", verified: true },
  { id: "lal-2003", kind: "excavation-report", authors: "Lal, B. B. et al.", year: 2003, title: "Excavations at Kalibangan: The Early Harappans (1960–1969)", container: "Memoirs of the Archaeological Survey of India 98", publisher: "Archaeological Survey of India", verified: false },
  { id: "jarrige-1995", kind: "excavation-report", authors: "Jarrige, C., Jarrige, J.-F., Meadow, R. H. & Quivron, G. (eds.)", year: 1995, title: "Mehrgarh Field Reports 1974–1985: From Neolithic Times to the Indus Civilization", publisher: "Department of Culture and Tourism, Government of Sindh", verified: true },
  { id: "giosan-2012", kind: "journal-article", authors: "Giosan, L. et al.", year: 2012, title: "Fluvial landscapes of the Harappan civilization", container: "Proceedings of the National Academy of Sciences 109(26): E1688–E1694", doi: "10.1073/pnas.1112743109", verified: true },
  { id: "singh-a-2017", kind: "journal-article", authors: "Singh, A. et al.", year: 2017, title: "Counter-intuitive influence of Himalayan river morphodynamics on Indus Civilisation urban settlements", container: "Nature Communications 8: 1617", doi: "10.1038/s41467-017-01643-9", verified: true },
  { id: "dixit-2014", kind: "journal-article", authors: "Dixit, Y., Hodell, D. A. & Petrie, C. A.", year: 2014, title: "Abrupt weakening of the summer monsoon in northwest India ~4100 yr ago", container: "Geology 42(4): 339–342", doi: "10.1130/G35236.1", verified: true },
  { id: "parpola-1994", kind: "book", authors: "Parpola, A.", year: 1994, title: "Deciphering the Indus Script", publisher: "Cambridge University Press", verified: true },
  { id: "farmer-2004", kind: "journal-article", authors: "Farmer, S., Sproat, R. & Witzel, M.", year: 2004, title: "The Collapse of the Indus-Script Thesis: The Myth of a Literate Harappan Civilization", container: "Electronic Journal of Vedic Studies 11(2): 19–57", verified: true },
  { id: "rao-rpn-2009", kind: "journal-article", authors: "Rao, R. P. N. et al.", year: 2009, title: "Entropic evidence for linguistic structure in the Indus script", container: "Science 324(5931): 1165", doi: "10.1126/science.1170391", verified: true },

  // ——— Genetics
  { id: "reich-2009", kind: "journal-article", authors: "Reich, D., Thangaraj, K., Patterson, N., Price, A. L. & Singh, L.", year: 2009, title: "Reconstructing Indian population history", container: "Nature 461: 489–494", doi: "10.1038/nature08365", verified: true },
  { id: "moorjani-2013", kind: "journal-article", authors: "Moorjani, P. et al.", year: 2013, title: "Genetic evidence for recent population mixture in India", container: "American Journal of Human Genetics 93(3): 422–438", doi: "10.1016/j.ajhg.2013.07.006", verified: true },
  { id: "narasimhan-2019", kind: "journal-article", authors: "Narasimhan, V. M. et al.", year: 2019, title: "The formation of human populations in South and Central Asia", container: "Science 365(6457): eaat7487", doi: "10.1126/science.aat7487", verified: true },
  { id: "shinde-2019", kind: "journal-article", authors: "Shinde, V. et al.", year: 2019, title: "An Ancient Harappan Genome Lacks Ancestry from Steppe Pastoralists or Iranian Farmers", container: "Cell 179(3): 729–735", doi: "10.1016/j.cell.2019.08.048", verified: true },
  { id: "silva-2017", kind: "journal-article", authors: "Silva, M. et al.", year: 2017, title: "A genetic chronology for the Indian Subcontinent points to heavily sex-biased dispersals", container: "BMC Evolutionary Biology 17: 88", doi: "10.1186/s12862-017-0936-9", verified: true },

  // ——— Iron Age, Mauryan, Classical
  { id: "gaur-1983", kind: "excavation-report", authors: "Gaur, R. C.", year: 1983, title: "Excavations at Atranjikhera: Early Civilization of the Upper Ganga Basin", publisher: "Motilal Banarsidass", verified: true },
  { id: "erdosy-1995", kind: "book", authors: "Erdosy, G. (ed.)", year: 1995, title: "The Indo-Aryans of Ancient South Asia: Language, Material Culture and Ethnicity", publisher: "Walter de Gruyter", verified: true },
  { id: "witzel-1995", kind: "journal-article", authors: "Witzel, M.", year: 1995, title: "Early Sanskritization: Origins and Development of the Kuru State", container: "Electronic Journal of Vedic Studies 1(4)", verified: true },
  { id: "hultzsch-1925", kind: "inscription-corpus", authors: "Hultzsch, E.", year: 1925, title: "Inscriptions of Asoka", container: "Corpus Inscriptionum Indicarum, Vol. I (new edition)", publisher: "Clarendon Press", verified: true },
  { id: "lahiri-2015", kind: "book", authors: "Lahiri, N.", year: 2015, title: "Ashoka in Ancient India", publisher: "Harvard University Press", verified: true },
  { id: "olivelle-2013", kind: "primary-source", authors: "Olivelle, P. (trans.)", year: 2013, title: "King, Governance, and Law in Ancient India: Kauṭilya's Arthaśāstra", publisher: "Oxford University Press", verified: true },
  { id: "mccrindle-1877", kind: "primary-source", authors: "McCrindle, J. W. (trans.)", year: 1877, title: "Ancient India as Described by Megasthenês and Arrian", publisher: "Trübner & Co.", verified: true },
  { id: "fleet-1888", kind: "inscription-corpus", authors: "Fleet, J. F.", year: 1888, title: "Inscriptions of the Early Gupta Kings and their Successors", container: "Corpus Inscriptionum Indicarum, Vol. III", publisher: "Government of India", verified: true },
  { id: "legge-1886", kind: "primary-source", authors: "Legge, J. (trans.)", year: 1886, title: "A Record of Buddhistic Kingdoms: Being an Account by the Chinese Monk Fâ-Hien of his Travels in India and Ceylon (A.D. 399–414)", publisher: "Clarendon Press", verified: true },
  { id: "beal-1884", kind: "primary-source", authors: "Beal, S. (trans.)", year: 1884, title: "Si-Yu-Ki: Buddhist Records of the Western World", publisher: "Trübner & Co.", verified: true },
  { id: "marshall-1951", kind: "excavation-report", authors: "Marshall, J.", year: 1951, title: "Taxila: An Illustrated Account of Archaeological Excavations Carried Out at Taxila (3 vols.)", publisher: "Cambridge University Press", verified: true },
  { id: "salomon-1998", kind: "book", authors: "Salomon, R.", year: 1998, title: "Indian Epigraphy: A Guide to the Study of Inscriptions in Sanskrit, Prakrit, and the Other Indo-Aryan Languages", publisher: "Oxford University Press", verified: true },

  // ——— South India & Indian Ocean
  { id: "mahadevan-2003", kind: "inscription-corpus", authors: "Mahadevan, I.", year: 2003, title: "Early Tamil Epigraphy: From the Earliest Times to the Sixth Century A.D.", container: "Harvard Oriental Series 62", publisher: "Harvard University Press / Cre-A", verified: true },
  { id: "wheeler-1946", kind: "excavation-report", authors: "Wheeler, R. E. M., Ghosh, A. & Deva, K.", year: 1946, title: "Arikamedu: an Indo-Roman trading-station on the east coast of India", container: "Ancient India 2: 17–124", publisher: "Archaeological Survey of India", verified: true },
  { id: "begley-1991", kind: "book", authors: "Begley, V. & De Puma, R. D. (eds.)", year: 1991, title: "Rome and India: The Ancient Sea Trade", publisher: "University of Wisconsin Press", verified: true },
  { id: "casson-1989", kind: "primary-source", authors: "Casson, L. (ed. & trans.)", year: 1989, title: "The Periplus Maris Erythraei", publisher: "Princeton University Press", verified: true },
  { id: "tnsda-2019", kind: "excavation-report", authors: "Tamil Nadu State Department of Archaeology", year: 2019, title: "Keeladi: An Urban Settlement of Sangam Age on the Banks of River Vaigai", publisher: "Government of Tamil Nadu", verified: true },
  { id: "wheeler-1947", kind: "excavation-report", authors: "Wheeler, R. E. M.", year: 1947, title: "Brahmagiri and Chandravalli 1947: Megalithic and other cultures in Mysore State", container: "Ancient India 4: 180–310", publisher: "Archaeological Survey of India", verified: true },

  // ——— Prehistory
  { id: "mathpal-1984", kind: "book", authors: "Mathpal, Y.", year: 1984, title: "Prehistoric Rock Paintings of Bhimbetka, Central India", publisher: "Abhinav Publications", verified: true },

  { id: "pappu-2011", kind: "journal-article", authors: "Pappu, S. et al.", year: 2011, title: "Early Pleistocene presence of Acheulian hominins in South India", container: "Science 331(6024): 1596–1599", doi: "10.1126/science.1200183", verified: true },
  { id: "akhilesh-2018", kind: "journal-article", authors: "Akhilesh, K. et al.", year: 2018, title: "Early Middle Palaeolithic culture in India around 385–172 ka reframes Out of Africa models", container: "Nature 554: 97–101", doi: "10.1038/nature25444", verified: true },
  { id: "coppa-2006", kind: "journal-article", authors: "Coppa, A. et al.", year: 2006, title: "Early Neolithic tradition of dentistry", container: "Nature 440: 755–756", doi: "10.1038/440755a", verified: true },

  // ——— UNESCO World Heritage listings
  { id: "unesco-200", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1982, title: "Sacred City of Anuradhapura (List no. 200)", url: "https://whc.unesco.org/en/list/200", verified: true },
  { id: "unesco-242", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1983, title: "Ajanta Caves (List no. 242)", url: "https://whc.unesco.org/en/list/242", verified: true },
  { id: "unesco-250", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1987, title: "Great Living Chola Temples (List no. 250)", url: "https://whc.unesco.org/en/list/250", verified: true },
  { id: "unesco-138", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1980, title: "Archaeological Ruins at Moenjodaro (List no. 138)", url: "https://whc.unesco.org/en/list/138", verified: true },
  { id: "unesco-139", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1980, title: "Taxila (List no. 139)", url: "https://whc.unesco.org/en/list/139", verified: true },
  { id: "unesco-1645", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 2021, title: "Dholavira: a Harappan City (List no. 1645)", url: "https://whc.unesco.org/en/list/1645", verified: true },
  { id: "unesco-925", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 2003, title: "Rock Shelters of Bhimbetka (List no. 925)", url: "https://whc.unesco.org/en/list/925", verified: true },
  { id: "unesco-524", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1989, title: "Buddhist Monuments at Sanchi (List no. 524)", url: "https://whc.unesco.org/en/list/524", verified: true },
  { id: "unesco-1502", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 2016, title: "Archaeological Site of Nalanda Mahavihara at Nalanda, Bihar (List no. 1502)", url: "https://whc.unesco.org/en/list/1502", verified: true },
  { id: "unesco-241", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1986, title: "Group of Monuments at Hampi (List no. 241)", url: "https://whc.unesco.org/en/list/241", verified: true },
  { id: "unesco-1056", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 2002, title: "Mahabodhi Temple Complex at Bodh Gaya (List no. 1056)", url: "https://whc.unesco.org/en/list/1056", verified: true },
  { id: "unesco-666", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1997, title: "Lumbini, the Birthplace of the Lord Buddha (List no. 666)", url: "https://whc.unesco.org/en/list/666", verified: true },
];
