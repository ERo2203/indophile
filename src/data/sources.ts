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

  // ——— Medieval to modern (bibliographic details not yet checked against the volumes)
  { id: "plofker-2009", kind: "book", authors: "Plofker, K.", year: 2009, title: "Mathematics in India", publisher: "Princeton University Press", verified: false },
  { id: "sachau-1888", kind: "book", authors: "Sachau, E. C. (trans.)", year: 1888, title: "Alberuni's India: An Account of the Religion, Philosophy, Literature, Geography, Chronology, Astronomy, Customs, Laws and Astrology of India about A.D. 1030", publisher: "Trübner & Co.", verified: false },
  { id: "dunn-1986", kind: "book", authors: "Dunn, R. E.", year: 1986, title: "The Adventures of Ibn Battuta: A Muslim Traveler of the 14th Century", publisher: "University of California Press", verified: false },
  { id: "jackson-1999", kind: "book", authors: "Jackson, P.", year: 1999, title: "The Delhi Sultanate: A Political and Military History", publisher: "Cambridge University Press", verified: false },
  { id: "bayly-1988", kind: "book", authors: "Bayly, C. A.", year: 1988, title: "Indian Society and the Making of the British Empire", container: "The New Cambridge History of India II.1", publisher: "Cambridge University Press", verified: false },
  { id: "bose-jalal-2004", kind: "book", authors: "Bose, S. & Jalal, A.", year: 2004, title: "Modern South Asia: History, Culture, Political Economy (2nd edition)", publisher: "Routledge", verified: false },

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

  // ——— Deep time: geology, fossils and early hominins
  { id: "jain-1975", kind: "journal-article", authors: "Jain, S. L., Kutty, T. S., Roy-Chowdhury, T. & Chatterjee, S.", year: 1975, title: "The sauropod dinosaur from the Lower Jurassic Kota Formation of India", container: "Proceedings of the Royal Society of London B 188(1091): 221–228", doi: "10.1098/rspb.1975.0014", verified: true },
  { id: "lydekker-1877", kind: "journal-article", authors: "Lydekker, R.", year: 1877, title: "Notices of new and other Vertebrata from Indian Tertiary and Secondary rocks", container: "Records of the Geological Survey of India 10(1): 30–43", verified: false },
  { id: "wilson-2003", kind: "journal-article", authors: "Wilson, J. A., Sereno, P. C., Srivastava, S., Bhatt, D. K., Khosla, A. & Sahni, A.", year: 2003, title: "A new abelisaurid (Dinosauria, Theropoda) from the Lameta Formation (Cretaceous, Maastrichtian) of India", container: "Contributions from the Museum of Paleontology, University of Michigan 31(1): 1–42", verified: true },
  { id: "dhiman-2023", kind: "journal-article", authors: "Dhiman, H., Verma, V., Singh, L. R., Miglani, V., Jha, D. K., Sanyal, P., Tandon, S. K. & Prasad, G. V. R.", year: 2023, title: "New Late Cretaceous titanosaur sauropod dinosaur egg clutches from lower Narmada valley, India: Palaeobiology and taphonomy", container: "PLOS ONE 18(1): e0278242", doi: "10.1371/journal.pone.0278242", verified: true },
  { id: "mohabey-1984", kind: "journal-article", authors: "Mohabey, D. M.", year: 1984, title: "The study of dinosaurian eggs from infratrappean limestone in Kheda District, Gujarat", container: "Journal of the Geological Society of India 25(6): 329–337", doi: "10.17491/jgsi/1984/250601", verified: true },
  { id: "schoene-2019", kind: "journal-article", authors: "Schoene, B. et al.", year: 2019, title: "U-Pb constraints on pulsed eruption of the Deccan Traps across the end-Cretaceous mass extinction", container: "Science 363(6429): 862–866", doi: "10.1126/science.aau2422", verified: true },
  { id: "sprain-2019", kind: "journal-article", authors: "Sprain, C. J. et al.", year: 2019, title: "The eruptive tempo of Deccan volcanism in relation to the Cretaceous-Paleogene boundary", container: "Science 363(6429): 866–870", doi: "10.1126/science.aav1446", verified: true },
  { id: "gingerich-1983", kind: "journal-article", authors: "Gingerich, P. D., Wells, N. A., Russell, D. E. & Shah, S. M. I.", year: 1983, title: "Origin of whales in epicontinental remnant seas: new evidence from the early Eocene of Pakistan", container: "Science 220(4595): 403–406", doi: "10.1126/science.220.4595.403", verified: true },
  { id: "thewissen-2007", kind: "journal-article", authors: "Thewissen, J. G. M., Cooper, L. N., Clementz, M. T., Bajpai, S. & Tiwari, B. N.", year: 2007, title: "Whales originated from aquatic artiodactyls in the Eocene epoch of India", container: "Nature 450: 1190–1194", doi: "10.1038/nature06343", verified: true },
  { id: "pilbeam-1982", kind: "journal-article", authors: "Pilbeam, D.", year: 1982, title: "New hominoid skull material from the Miocene of Pakistan", container: "Nature 295: 232–234", doi: "10.1038/295232a0", verified: true },
  { id: "malasse-2016", kind: "journal-article", authors: "Dambricourt Malassé, A. et al.", year: 2016, title: "Intentional cut marks on bovid from the Quranwala zone, 2.6 Ma, Siwalik Frontal Range, northwestern India", container: "Comptes Rendus Palevol 15(3–4): 317–339", doi: "10.1016/j.crpv.2015.09.019", verified: true },
  { id: "soni-2017", kind: "journal-article", authors: "Soni, V. S. & Soni, A. S.", year: 2017, title: "On the Late Pliocene stone tools of the Quranwala Zone, north-west sub-Himalayas, India", container: "Antiquity 91(357) (Project Gallery)", doi: "10.15184/aqy.2017.43", verified: true },
  { id: "dennell-1988", kind: "journal-article", authors: "Dennell, R. W., Rendell, H. & Hailwood, E.", year: 1988, title: "Early tool-making in Asia: two-million-year-old artefacts in Pakistan", container: "Antiquity 62(234): 98–106", doi: "10.1017/S0003598X00073555", verified: true },
  { id: "paddayya-2002", kind: "journal-article", authors: "Paddayya, K., Blackwell, B. A. B., Jhaldiyal, R., Petraglia, M. D. et al.", year: 2002, title: "Recent findings on the Acheulian of the Hunsgi and Baichbal valleys, Karnataka, with special reference to the Isampur excavation and its dating", container: "Current Science 83(5): 641–647", verified: true },
  { id: "sonakia-1985", kind: "journal-article", authors: "Sonakia, A. & Kennedy, K. A. R.", year: 1985, title: "Skull cap of an early man from the Narmada valley alluvium (Pleistocene) of central India", container: "American Anthropologist 87(3): 612–616", doi: "10.1525/aa.1985.87.3.02a00060", verified: true },
  { id: "patnaik-2009", kind: "journal-article", authors: "Patnaik, R., Chauhan, P. R., Rao, M. R., Blackwell, B. A. B., Skinner, A. R., Sahni, A., Chauhan, M. S. & Khan, H. S.", year: 2009, title: "New geochronological, paleoclimatological, and archaeological data from the Narmada Valley hominin locality, central India", container: "Journal of Human Evolution 56(2): 114–133", doi: "10.1016/j.jhevol.2008.08.023", verified: true },
  { id: "cameron-2004", kind: "journal-article", authors: "Cameron, D., Patnaik, R. & Sahni, A.", year: 2004, title: "The phylogenetic significance of the Middle Pleistocene Narmada hominin cranium from central India", container: "International Journal of Osteoarchaeology 14(6): 419–447", doi: "10.1002/oa.725", verified: true },
  { id: "kennedy-1991", kind: "journal-article", authors: "Kennedy, K. A. R., Sonakia, A., Chiment, J. & Verma, K. K.", year: 1991, title: "Is the Narmada hominid an Indian Homo erectus?", container: "American Journal of Physical Anthropology 86(4): 475–496", doi: "10.1002/ajpa.1330860404", verified: true },
  { id: "petraglia-2007", kind: "journal-article", authors: "Petraglia, M. et al.", year: 2007, title: "Middle Paleolithic assemblages from the Indian subcontinent before and after the Toba super-eruption", container: "Science 317(5834): 114–116", doi: "10.1126/science.1141564", verified: true },
  { id: "clarkson-2020", kind: "journal-article", authors: "Clarkson, C. et al.", year: 2020, title: "Human occupation of northern India spans the Toba super-eruption ~74,000 years ago", container: "Nature Communications 11: 961", doi: "10.1038/s41467-020-14668-4", verified: true },

  // ——— Historical atlases and regional histories (territorial extents)
  { id: "cliopatria-2025", kind: "journal-article", authors: "Cioni, C., Reddish, J., Zsambok, J., Levine, J., Cook, C. J., Francois, P., Hoyer, D. & Turchin, P.", year: 2025, title: "Cliopatria – A geospatial database of world-wide political entities from 3400BCE to 2024CE", container: "Scientific Data 12: 247 (dataset v0.2.1, CC BY 4.0)", doi: "10.1038/s41597-025-04516-9", url: "https://github.com/Seshat-Global-History-Databank/cliopatria", verified: true },
  { id: "schwartzberg-1978", kind: "book", authors: "Schwartzberg, J. E. (ed.)", year: 1978, title: "A Historical Atlas of South Asia", publisher: "University of Chicago Press", verified: true },
  { id: "sastri-1955", kind: "book", authors: "Sastri, K. A. Nilakanta", year: 1955, title: "A History of South India from Prehistoric Times to the Fall of Vijayanagar", publisher: "Oxford University Press", verified: true },
  { id: "kulke-rothermund-2016", kind: "book", authors: "Kulke, H. & Rothermund, D.", year: 2016, title: "A History of India (6th edition)", publisher: "Routledge", verified: true },
  { id: "asher-talbot-2006", kind: "book", authors: "Asher, C. B. & Talbot, C.", year: 2006, title: "India Before Europe", publisher: "Cambridge University Press", verified: true },
  { id: "talbot-2001", kind: "book", authors: "Talbot, C.", year: 2001, title: "Precolonial India in Practice: Society, Region, and Identity in Medieval Andhra", publisher: "Oxford University Press", verified: true },
  { id: "eaton-2005", kind: "book", authors: "Eaton, R. M.", year: 2005, title: "A Social History of the Deccan, 1300–1761: Eight Indian Lives", container: "The New Cambridge History of India I.8", publisher: "Cambridge University Press", verified: true },
  { id: "eaton-2019", kind: "book", authors: "Eaton, R. M.", year: 2019, title: "India in the Persianate Age, 1000–1765", publisher: "Allen Lane", verified: true },
  { id: "chandra-2004", kind: "book", authors: "Chandra, S.", year: 2004, title: "Medieval India: From Sultanat to the Mughals. Part One: Delhi Sultanat (1206–1526)", publisher: "Har-Anand", verified: false },
  { id: "richards-1993", kind: "book", authors: "Richards, J. F.", year: 1993, title: "The Mughal Empire", container: "The New Cambridge History of India I.5", publisher: "Cambridge University Press", verified: true },
  { id: "gordon-1993", kind: "book", authors: "Gordon, S.", year: 1993, title: "The Marathas 1600–1818", container: "The New Cambridge History of India II.4", publisher: "Cambridge University Press", verified: true },
  { id: "grewal-1990", kind: "book", authors: "Grewal, J. S.", year: 1990, title: "The Sikhs of the Punjab", container: "The New Cambridge History of India II.3", publisher: "Cambridge University Press", verified: true },
  { id: "desilva-1981", kind: "book", authors: "De Silva, K. M.", year: 1981, title: "A History of Sri Lanka", publisher: "C. Hurst / University of California Press", verified: true },
  { id: "geiger-1912", kind: "primary-source", authors: "Geiger, W. (trans.)", year: 1912, title: "The Mahāvaṃsa or the Great Chronicle of Ceylon", publisher: "Pali Text Society / Oxford University Press", verified: true },

  // ——— Prehistory additions
  { id: "kennedy-2000", kind: "book", authors: "Kennedy, K. A. R.", year: 2000, title: "God-Apes and Fossil Men: Paleoanthropology of South Asia", publisher: "University of Michigan Press", verified: true },
  { id: "sharma-1980", kind: "excavation-report", authors: "Sharma, G. R., Misra, V. D., Mandal, D., Misra, B. B. & Pal, J. N.", year: 1980, title: "Beginnings of Agriculture: Epi-Palaeolithic to Neolithic — Excavations at Chopani-Mando, Mahadaha and Mahagara", publisher: "Abinash Prakashan, Allahabad", verified: false },
  { id: "deraniyagala-1992", kind: "book", authors: "Deraniyagala, S. U.", year: 1992, title: "The Prehistory of Sri Lanka: An Ecological Perspective", publisher: "Department of Archaeological Survey, Colombo", verified: true },
  { id: "wedage-2019", kind: "journal-article", authors: "Wedage, O. et al.", year: 2019, title: "Specialized rainforest hunting by Homo sapiens ~45,000 years ago", container: "Nature Communications 10: 739", doi: "10.1038/s41467-019-08623-1", verified: true },
  { id: "roberts-2015", kind: "journal-article", authors: "Roberts, P. et al.", year: 2015, title: "Direct evidence for human reliance on rainforest resources in late Pleistocene Sri Lanka", container: "Science 347(6227): 1246–1249", doi: "10.1126/science.aaa1230", verified: true },

  // ——— South Indian Iron Age / Megalithic
  { id: "leshnik-1974", kind: "book", authors: "Leshnik, L. S.", year: 1974, title: "South Indian 'Megalithic' Burials: The Pandukal Complex", publisher: "Franz Steiner", verified: false },
  { id: "moorti-1994", kind: "book", authors: "Moorti, U. S.", year: 1994, title: "Megalithic Culture of South India: Socio-economic Perspectives", publisher: "Ganga Kaveri Publishing House", verified: false },
  { id: "rajan-2013", kind: "journal-article", authors: "Rajan, K. & Yatheeskumar, V. P.", year: 2013, title: "New evidences on scientific dates for Brāhmī script as revealed from Porunthal and Kodumanal excavations", container: "Prāgdhārā 21–22: 279–295", verified: false },
  { id: "tnsda-2025", kind: "institutional", authors: "Tamil Nadu State Department of Archaeology", year: 2025, title: "Antiquity of Iron: Recent Radiometric Dates from Tamil Nadu", publisher: "Government of Tamil Nadu", verified: false },

  // ——— Rock-cut architecture
  { id: "spink-2005", kind: "book", authors: "Spink, W. M.", year: 2005, title: "Ajanta: History and Development, Volume 1 — The End of the Golden Age", publisher: "Brill", verified: true },

  // ——— Migrations and language history
  { id: "anthony-2007", kind: "book", authors: "Anthony, D. W.", year: 2007, title: "The Horse, the Wheel, and Language: How Bronze-Age Riders from the Eurasian Steppes Shaped the Modern World", publisher: "Princeton University Press", verified: true },
  { id: "bryant-2001", kind: "book", authors: "Bryant, E.", year: 2001, title: "The Quest for the Origins of Vedic Culture: The Indo-Aryan Migration Debate", publisher: "Oxford University Press", verified: true },
  { id: "parpola-2015", kind: "book", authors: "Parpola, A.", year: 2015, title: "The Roots of Hinduism: The Early Aryans and the Indus Civilization", publisher: "Oxford University Press", verified: true },
  { id: "parpola-2020", kind: "journal-article", authors: "Parpola, A.", year: 2020, title: "Royal 'Chariot' Burials of Sanauli near Delhi and Archaeological Correlates of Prehistoric Indo-Iranian Languages", container: "Studia Orientalia Electronica 8(1): 176–195", verified: false },
  { id: "stacul-1987", kind: "excavation-report", authors: "Stacul, G.", year: 1987, title: "Prehistoric and Protohistoric Swāt, Pakistan (c. 3000–1400 B.C.)", publisher: "IsMEO", verified: false },
  { id: "chaubey-2011", kind: "journal-article", authors: "Chaubey, G. et al.", year: 2011, title: "Population genetic structure in Indian Austroasiatic speakers: the role of landscape barriers and sex-specific admixture", container: "Molecular Biology and Evolution 28(2): 1013–1024", doi: "10.1093/molbev/msq288", verified: true },
  { id: "tatte-2019", kind: "journal-article", authors: "Tätte, K. et al.", year: 2019, title: "The genetic legacy of continental scale admixture in Indian Austroasiatic speakers", container: "Scientific Reports 9: 3818", doi: "10.1038/s41598-019-40399-8", verified: false },
  { id: "hoogervorst-2013", kind: "book", authors: "Hoogervorst, T.", year: 2013, title: "Southeast Asia in the Ancient Indian Ocean World", container: "BAR International Series 2580", publisher: "Archaeopress", verified: true },
  { id: "fuller-2011", kind: "journal-article", authors: "Fuller, D. Q., Boivin, N., Hoogervorst, T. & Allaby, R.", year: 2011, title: "Across the Indian Ocean: the prehistoric movement of plants and animals", container: "Antiquity 85(328): 544–558", verified: true },
  { id: "pierron-2017", kind: "journal-article", authors: "Pierron, D. et al.", year: 2017, title: "Genetic history of Madagascar", container: "Proceedings of the National Academy of Sciences 114(32): E6498–E6506", doi: "10.1073/pnas.1704906114", verified: false },

  // ——— UNESCO World Heritage listings
  { id: "unesco-243", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1983, title: "Ellora Caves (List no. 243)", url: "https://whc.unesco.org/en/list/243", verified: true },
  { id: "unesco-239", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1987, title: "Group of Monuments at Pattadakal (List no. 239)", url: "https://whc.unesco.org/en/list/239", verified: true },
  { id: "unesco-240", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1986, title: "Khajuraho Group of Monuments (List no. 240)", url: "https://whc.unesco.org/en/list/240", verified: false },
  { id: "unesco-246", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1984, title: "Sun Temple, Konârak (List no. 246)", url: "https://whc.unesco.org/en/list/246", verified: false },
  { id: "unesco-249", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1984, title: "Group of Monuments at Mahabalipuram (List no. 249)", url: "https://whc.unesco.org/en/list/249", verified: false },
  { id: "unesco-233", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1993, title: "Qutb Minar and its Monuments, Delhi (List no. 233)", url: "https://whc.unesco.org/en/list/233", verified: false },
  { id: "unesco-255", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1986, title: "Fatehpur Sikri (List no. 255)", url: "https://whc.unesco.org/en/list/255", verified: false },
  { id: "unesco-234", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1986, title: "Churches and Convents of Goa (List no. 234)", url: "https://whc.unesco.org/en/list/234", verified: false },
  { id: "unesco-322", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1985, title: "Ruins of the Buddhist Vihara at Paharpur (List no. 322)", url: "https://whc.unesco.org/en/list/322", verified: false },
  { id: "unesco-321", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1985, title: "Historic Mosque City of Bagerhat (List no. 321)", url: "https://whc.unesco.org/en/list/321", verified: false },
  { id: "unesco-201", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1982, title: "Ancient City of Polonnaruwa (List no. 201)", url: "https://whc.unesco.org/en/list/201", verified: true },
  { id: "unesco-202", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1982, title: "Ancient City of Sigiriya (List no. 202)", url: "https://whc.unesco.org/en/list/202", verified: true },
  { id: "unesco-450", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1988, title: "Sacred City of Kandy (List no. 450)", url: "https://whc.unesco.org/en/list/450", verified: true },
  { id: "unesco-1570", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 2021, title: "Kakatiya Rudreshwara (Ramappa) Temple, Telangana", url: "https://whc.unesco.org/en/list/1570", verified: false },
  { id: "unesco-1670", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 2023, title: "Sacred Ensembles of the Hoysalas", url: "https://whc.unesco.org/en/list/1670", verified: false },
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
  // World Heritage records added in the atlas expansion. The UNESCO site could not be fetched to confirm them, so they are unverified.
  { id: "unesco-208", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 2003, title: "Cultural Landscape and Archaeological Remains of the Bamiyan Valley (List no. 208)", url: "https://whc.unesco.org/en/list/208", verified: false },
  { id: "unesco-211", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 2002, title: "Minaret and Archaeological Remains of Jam (List no. 211)", url: "https://whc.unesco.org/en/list/211", verified: false },
  { id: "unesco-244", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1987, title: "Elephanta Caves (List no. 244)", url: "https://whc.unesco.org/en/list/244", verified: false },
  { id: "unesco-561", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1991, title: "Rangiri Dambulla Cave Temple (List no. 561)", url: "https://whc.unesco.org/en/list/561", verified: false },
  { id: "unesco-1101", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 2004, title: "Champaner-Pavagadh Archaeological Park (List no. 1101)", url: "https://whc.unesco.org/en/list/1101", verified: false },
  { id: "unesco-171", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1981, title: "Fort and Shalamar Gardens in Lahore (List no. 171)", url: "https://whc.unesco.org/en/list/171", verified: false },
  { id: "unesco-586", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1997, title: "Rohtas Fort (List no. 586)", url: "https://whc.unesco.org/en/list/586", verified: false },
  { id: "unesco-251", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1983, title: "Agra Fort (List no. 251)", url: "https://whc.unesco.org/en/list/251", verified: false },
  { id: "unesco-231", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 2007, title: "Red Fort Complex (List no. 231)", url: "https://whc.unesco.org/en/list/231", verified: false },
  { id: "unesco-247", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 2013, title: "Hill Forts of Rajasthan (List no. 247)", url: "https://whc.unesco.org/en/list/247", verified: false },
  { id: "unesco-451", kind: "unesco", authors: "UNESCO World Heritage Centre", year: 1988, title: "Old Town of Galle and its Fortifications (List no. 451)", url: "https://whc.unesco.org/en/list/451", verified: false },
];
