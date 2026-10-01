#!/usr/bin/env python3
"""
Enrichment dictionary for Versus Battles.
Provides:
- Dates / Lifespans / Key eras for figures, inventors, leaders, brands, languages
- Rich, highly informative descriptions for Entity A and Entity B
- Detailed key differences and divergences
- Nuanced common ground and verdict/outcome
"""

BATTLE_ENRICHMENTS = {
    # ----------------------------------------------------
    # LITERATURE & PHILOSOPHY
    # ----------------------------------------------------
    "tolstoy-vs-dostoevsky": {
        "datesA": "1828–1910",
        "datesB": "1821–1881",
        "descA": "Count Lev Nikolayevich Tolstoy (1828–1910). The Olympian epic realist and aristocratic moralist of Yasnaya Polyana. Master of sweeping historical canvases, psychological clarity, and societal panoramas ('War and Peace', 'Anna Karenina'). Later renounced his wealth to preach Christian anarchism, pacifism, and non-violent resistance that deeply influenced Gandhi and MLK.",
        "descB": "Fyodor Mikhailovich Dostoevsky (1821–1881). The existential psychologist and prophet of the underground. Survivor of a mock execution and four years in Siberian hard labor (katorga). Master of manic internal dialogue, metaphysical crime, moral fever, and spiritual redemption through suffering ('Crime and Punishment', 'The Brothers Karamazov', 'Demons').",
        "differences": [
            "Scope: Broad historical & societal panoramas (Tolstoy) vs. Claustrophobic metaphysical & psychological depth (Dostoevsky).",
            "Philosophy: Rationalist Sermon on the Mount & pacifist moral striving vs. Mystical Eastern Orthodoxy & salvation through suffering.",
            "Style: Crystal-clear, aristocratic, polyphonic realism vs. Feverish, polyphonic suspense and existential desperation.",
            "View of Humanity: Humans are corrupted by false institutions vs. Humans are fundamentally torn between demonic pride and divine grace."
        ],
        "commonGround": "The twin titans of 19th-century Russian literature who redefined the psychological and philosophical possibilities of the global novel. Astonishingly, despite moving in identical intellectual circles in St. Petersburg and Moscow, they never met in person.",
        "winner": "Tolstoy achieved the architectural perfection and realism of the epic novel; Dostoevsky penetrated the darkest existential abysses of the 20th-century human psyche."
    },

    "hemingway-vs-faulkner": {
        "datesA": "1899–1961",
        "datesB": "1897–1962",
        "descA": "Ernest Hemingway (1899–1961). Nobel & Pulitzer laureate. Champion of the 'Iceberg Theory' (omission of 7/8ths of narrative context to create emotional resonance). Known for terse, stripped-down syntax, sensory immediacy, and the code of 'grace under pressure' across wartime Europe, bullfighting rings, and the Gulf Stream ('The Sun Also Rises', 'A Farewell to Arms', 'The Old Man and the Sea').",
        "descB": "William Faulkner (1897–1962). Nobel & two-time Pulitzer laureate. Mythmaker of Yoknapatawpha County, Mississippi. Master of dense, baroque, stream-of-consciousness prose, fractured chronology, multiple subjective narrators, and haunting explorations of the Southern racial and genealogical curse ('The Sound and the Fury', 'As I Lay Dying', 'Absalom, Absalom!').",
        "differences": [
            "Prose Style: Spartan, journalistic declarative sentences (Hemingway) vs. Labyrinthine, poly-syllabic, rolling rhythmic sentences spanning entire pages (Faulkner).",
            "Atmosphere: Clean, stoic international exile (Paris, Spain, Cuba, Africa) vs. Decaying, claustrophobic Southern Gothic memory and heritage.",
            "Famous Literary Jab: Faulkner noted Hemingway 'has never been known to use a word that might send a reader to the dictionary'; Hemingway replied, 'Poor Faulkner. Does he really think big emotions come from big words?'",
            "Theme: Dignity and survival in an indifferent modern universe vs. The inescapable generational trauma of history ('The past is never dead. It's not even past')."
        ],
        "commonGround": "The two foundational pillars of 20th-century American literary Modernism; both awarded the Nobel Prize in Literature (Faulkner in 1949, Hemingway in 1954).",
        "winner": "Hemingway forever transformed modern journalistic English syntax; Faulkner forged the deepest mythic landscape in the history of the American novel."
    },

    "plato-vs-aristotle": {
        "datesA": "428/427–348/347 BC",
        "datesB": "384–322 BC",
        "descA": "Plato of Athens (c. 428–348 BC). Founder of the Academy, student of Socrates, and author of foundational philosophical dialogues ('The Republic', 'Symposium', 'Phaedo'). Advocated the Theory of Forms: material reality is merely a transient, imperfect shadow cast by immutable, transcendent Forms existing in an intellectual realm.",
        "descB": "Aristotle of Stagira (384–322 BC). Plato's greatest pupil at the Academy for two decades, tutor to Alexander the Great, and founder of the Lyceum (Peripatetic school). Father of formal syllogistic logic, empirical biology, virtue ethics, and systematic categorization of the physical and natural world ('Nicomachean Ethics', 'Metaphysics', 'Politics').",
        "differences": [
            "Epistemology: Rationalist recollection of eternal transcendental Forms (Plato) vs. Empirical sensory observation and inductive reasoning (Aristotle).",
            "Cosmology: In Raphael's 'The School of Athens', Plato points upward toward the metaphysical heavens; Aristotle gestures flatly toward the empirical Earth.",
            "Ethics & Politics: Utopian philosopher-kings ruling an idealized Kallipolis vs. Pragmatic constitutional rule balanced by virtuous habit (the Golden Mean).",
            "Art & Poetry: Banished poets from the Republic as imitators of imitations vs. Defended tragedy as cathartic purification (Katharsis) of human pity and terror."
        ],
        "commonGround": "Laid the dual metaphysical, ethical, and epistemic foundations of Western philosophy; Alfred North Whitehead famously remarked that all Western philosophy is 'a series of footnotes to Plato'.",
        "winner": "A perennial philosophical dialectic: Plato ignited mystical, mathematical, and theological idealism; Aristotle founded empirical science, scientific taxonomy, and naturalism."
    },

    "locke-vs-hobbes": {
        "datesA": "1632–1704",
        "datesB": "1588–1679",
        "descA": "John Locke (1632–1704). English Enlightenment physician and philosopher, father of Liberalism and Empiricism ('Two Treatises of Government', 'An Essay Concerning Human Understanding'). Argued that human consciousness begins as a blank slate (Tabula Rasa) and that humans possess natural rights to Life, Liberty, and Property.",
        "descB": "Thomas Hobbes of Malmesbury (1588–1679). English materialist and political philosopher who witnessed the bloody chaos of the English Civil War. In 'Leviathan' (1651), he argued that without a sovereign authority, humanity exists in a state of nature where life is 'solitary, poor, nasty, brutish, and short' in a war of all against all.",
        "differences": [
            "State of Nature: Governed by natural moral law and mutual sociability (Locke) vs. Violent perpetual civil war and fear of violent death (Hobbes).",
            "Social Contract: Citizens conditionally delegate power to preserve natural rights (Locke) vs. Citizens irrevocably surrender absolute authority to the Leviathan in exchange for security (Hobbes).",
            "Right of Revolution: Legitimate when government violates the trust of the people (Locke) vs. Anarchy is infinitely worse than tyranny; rebellion is never justified (Hobbes).",
            "Legacy: Sparked the American and French Revolutions and constitutional democracy vs. Anticipated modern realism, state sovereignty, and international relations security dilemmas."
        ],
        "commonGround": "Both pioneered modern political philosophy by abandoning divine right of kings in favor of secular Social Contract theory rooted in human nature.",
        "winner": "Locke won the ideological battle for modern democratic constitutional governance; Hobbes remains unmatched in explaining realpolitik and state collapse."
    },

    "sartre-vs-camus": {
        "datesA": "1905–1980",
        "datesB": "1913–1960",
        "descA": "Jean-Paul Sartre (1905–1980). Forefather of French Existentialism ('Being and Nothingness', 'No Exit'). Insisted that 'existence precedes essence'—humans are radically free, self-defining, and 'condemned to be free'. Allied with Marxism and defended political violence as an inevitable vehicle for anti-colonial and socialist liberation.",
        "descB": "Albert Camus (1913–1960). Algerian-born French author and philosopher of the Absurd ('The Stranger', 'The Myth of Sisyphus', 'The Rebel'). Rejected existentialist labels; asserted that confronting the cold indifference of the cosmos requires defiant living and lucidity without surrender to dogmatic political terror.",
        "differences": [
            "Core Philosophy: Radical freedom requiring total political commitment (Existentialism) vs. Living authentically in revolt against cosmic meaninglessness (The Absurd).",
            "Political Ideology: Apologetics for Soviet Communism and revolutionary ends justifying means vs. Absolute rejection of revolutionary murder, terror, and concentration camps.",
            "The 1952 Breakup: Bitter public intellectual feud triggered when Sartre's journal 'Les Temps Modernes' trashed Camus's anti-totalitarian treatise 'The Rebel'.",
            "View of Sisyphus: Man must define his social essence through historical struggle vs. 'One must imagine Sisyphus happy' in his solitary, defiant dignity."
        ],
        "commonGround": "Both were Parisian Resistance writers during the Nazi occupation, cultural icons of post-WWII existential dread, and Nobel laureates in Literature (Camus 1957, Sartre 1964, though Sartre declined his).",
        "winner": "History vindicated Camus's moral condemnation of totalitarian terror, while Sartre remains the supreme theoretician of radical human subjective freedom."
    },

    "freud-vs-jung": {
        "datesA": "1856–1939",
        "datesB": "1875–1961",
        "descA": "Sigmund Freud (1856–1939). Viennese neurologist and father of Psychoanalysis ('The Interpretation of Dreams', 'The Ego and the Id'). Conceptualized the psyche as a battleground between the Id, Ego, and Superego, driven primarily by repressed sexual instincts (Libido) and early childhood psychosexual trauma.",
        "descB": "Carl Gustav Jung (1875–1961). Swiss psychiatrist and founder of Analytical Psychology ('Psychological Types', 'Man and His Symbols'). Former heir apparent to Freud who broke away to propose the Collective Unconscious, Archetypes (Shadow, Anima/Animus, Self), Synchronicity, and spiritual individuation.",
        "differences": [
            "The Unconscious: Individual repressed personal desires and trauma (Freud) vs. Deep transpersonal reservoir of shared human evolutionary mythology and archetypes (Jung).",
            "Libido: Primarily biological sexual drive (Freud) vs. Broad psychic life energy including spiritual, creative, and teleological growth (Jung).",
            "Religion & Myth: Wish-fulfilling neurotic illusions and neuroses (Freud) vs. Essential psychological symbols and mythic maps vital for human wholeness (Jung).",
            "Split: The 1912–1913 rupture when Jung published 'Symbols of Transformation', ending their personal and professional friendship forever."
        ],
        "commonGround": "Pioneered the exploration of the hidden depths of the human unconscious mind, revolutionizing modern psychiatry, literature, art, and 20th-century culture.",
        "winner": "Freud mapped the mechanisms of personal neurosis and psychological defense; Jung opened psychology to art, mythology, personality typology, and spiritual quest."
    },

    "keynes-vs-hayek": {
        "datesA": "1883–1946",
        "datesB": "1899–1992",
        "descA": "John Maynard Keynes, 1st Baron Keynes (1883–1946). British economist whose 'General Theory of Employment, Interest and Money' (1936) created modern macroeconomics. Argued that free markets suffer from insufficient aggregate demand, requiring government deficit spending and fiscal intervention during downturns to secure full employment.",
        "descB": "Friedrich August von Hayek (1899–1992). Austrian-British economist and political philosopher of the Austrian School ('The Road to Serfdom', 'The Constitution of Liberty', Nobel Memorial Prize 1974). Argued that markets are spontaneous discovery mechanisms coordinate by the price system, and that central economic planning inexorably leads to tyranny and inflation.",
        "differences": [
            "Business Cycle: Caused by volatile 'animal spirits' and demand shocks (Keynes) vs. Caused by central bank artificial credit expansion and malinvestment (Hayek).",
            "Government Role: Counter-cyclical fiscal stimulus, public works, and active intervention vs. Strictly limited government, free pricing, and sound money.",
            "Knowledge Problem: Technocratic macroeconomic steering by expert planners vs. Information is radically dispersed and only discoverable through spontaneous market pricing.",
            "Historical Peaks: Post-WWII Bretton Woods consensus (1945–1970s, Keynes) vs. 1980s Reagan-Thatcher neoliberal counter-revolution (Hayek)."
        ],
        "commonGround": "Both Cambridge colleagues and personal friends who fiercely sought the best economic defense of liberal democracy against 20th-century totalitarianism (Fascism and Soviet Communism).",
        "winner": "Governments turn to Keynes in every financial crisis and liquidity freeze; policymakers look to Hayek when confronting chronic inflation, bureaucracy, and over-regulation."
    },

    # ----------------------------------------------------
    # SCIENCE & DISCOVERY
    # ----------------------------------------------------
    "bohr-vs-einstein": {
        "datesA": "1885–1962",
        "datesB": "1879–1955",
        "descA": "Niels Bohr (1885–1962). Danish physicist, Nobel laureate (1922), and head of the Copenhagen Institute. Architect of the Copenhagen interpretation of quantum mechanics, introducing Complementarity and asserting that physical reality at the subatomic scale is fundamentally probabilistic until observed.",
        "descB": "Albert Einstein (1879–1955). German-born theoretical physicist, Nobel laureate (1921), and father of Special and General Relativity. Famously resisted quantum indeterminacy, insisting that objective reality exists independent of observation ('God does not play dice with the universe').",
        "differences": [
            "Nature of Reality: Wave-particle duality and observer-dependent probabilistic wavefunctions (Bohr) vs. Strict determinism and objective local realism (Einstein).",
            "Thought Experiments: Einstein's Photon Box and the 1935 EPR Paradox ('spooky action at a distance') were consistently defended and countered by Bohr at the Solvay Conferences.",
            "Completeness: Quantum mechanics is the complete description of atomic reality (Bohr) vs. Incomplete theory hiding 'local hidden variables' (Einstein).",
            "Experimental Test: John Stewart Bell (1964) and Alain Aspect (1982) proved experimentally that local realism is violated—Bohr's probabilistic quantum model was vindicated."
        ],
        "commonGround": "The two greatest minds of 20th-century physics; their legendary debates at the 1927 and 1930 Solvay Conferences represent the highest pinnacle of respectful scientific inquiry.",
        "winner": "Bohr won the empirical battle on quantum indeterminacy and non-locality; Einstein forced quantum mechanics to achieve absolute mathematical and conceptual rigor."
    },

    "newton-vs-leibniz": {
        "datesA": "1643–1727",
        "datesB": "1646–1716",
        "descA": "Sir Isaac Newton (1643–1727). English polymath, author of the 'Philosophiae Naturalis Principia Mathematica' (1687). Formulated universal gravitation, the three laws of classical mechanics, optics, and independently developed his method of 'fluxions' (infinitesimal calculus) around 1665–1666 without publishing it immediately.",
        "descB": "Gottfried Wilhelm Leibniz (1646–1716). German polymath, philosopher, and diplomat. Independently developed differential and integral calculus between 1673 and 1676, publishing his system in 1684. Created the modern mathematical notation (dx, dy, and the integral sign ∫) used universally by scientists today.",
        "differences": [
            "Notation: Newton's cumbersome dot notation (ẋ, ẍ) vs. Leibniz's intuitive, elegant differential notation (dx, dy, ∫).",
            "The Priority Dispute: Newton and his Royal Society allies accused Leibniz of outright plagiarism; Leibniz was subjected to a biased Royal Society tribunal ghost-written by Newton himself.",
            "Concept of Time & Space: Absolute, uniform sensorium of God (Newton) vs. Relational matrix of ordering objects and events (Leibniz).",
            "Modern Consensus: Both independently invented calculus; Newton developed it earlier in time, but Leibniz published first with vastly superior notation."
        ],
        "commonGround": "Simultaneously bestowed upon human civilization the single most potent mathematical engine for engineering, physics, astronomy, and technology.",
        "winner": "Leibniz won mathematically in notation and clarity; Newton won English political clout in his lifetime, but global science adopted Leibniz's system."
    },

    "darwin-vs-wallace": {
        "datesA": "1809–1882",
        "datesB": "1823–1913",
        "descA": "Charles Robert Darwin (1809–1882). English naturalist aboard HMS Beagle (1831–1836). Developed the theory of Evolution by Natural Selection over twenty quiet years of meticulous experimentation, dissecting barnacles, breeding pigeons, and drafting 'On the Origin of Species' (1859).",
        "descB": "Alfred Russel Wallace (1823–1913). British self-taught explorer, field biologist, and father of biogeography ('The Wallace Line'). Conceived the theory of natural selection during a feverish malaria fit in Ternate, Dutch East Indies in 1858 and mailed a brief manuscript directly to Darwin, prompting Darwin to finally publish.",
        "differences": [
            "Background: Wealthy, aristocratic gentleman naturalist (Darwin) vs. Working-class field collector funding expeditions by selling insect and bird specimens (Wallace).",
            "Human Consciousness: Natural selection explains all human physical and cognitive evolution (Darwin) vs. Insisted spiritual intervention was required for human intellect and morality (Wallace).",
            "Sexual Selection: Central pillar explaining beauty and courtship (Darwin) vs. Minimized sexual selection in favor of pure utilitarian environmental survival (Wallace).",
            "Credit: Joint presentation at the Linnean Society of London (July 1, 1858), yet Darwin's exhaustive 1859 book captured global historical legacy."
        ],
        "commonGround": "Co-discoverers of Natural Selection who exhibited astonishing grace, humility, and mutual collegiality without descent into bitter priority litigation.",
        "winner": "Darwin earned preeminent fame due to twenty years of monumental evidentiary documentation; Wallace remains science's greatest gentleman co-founder."
    },

    "edison-vs-tesla": {
        "datesA": "1847–1931",
        "datesB": "1856–1943",
        "descA": "Thomas Alva Edison (1847–1931). The 'Wizard of Menlo Park' holding 1,093 US patents (phonograph, incandescent bulb, motion picture camera). Ruthless industrialist champion of Direct Current (DC) electricity, backed by J.P. Morgan, who orchestrated sensational campaigns electrocuting animals to discredit competitor AC.",
        "descB": "Nikola Tesla (1856–1943). Serbian-American visionary inventor and electrical engineer. Patented the polyphase Alternating Current (AC) induction motor and transformer, partnered with George Westinghouse, and conceptualized radio, radar, and global wireless power transmission.",
        "differences": [
            "Current Transmission: Direct Current (DC), restricted to a 1-mile radius from power stations without high-voltage stepping (Edison) vs. Alternating Current (AC), stepped up with transformers for efficient long-distance transmission (Tesla).",
            "Methodology: Relentless empirical trial-and-error ('1% inspiration, 99% perspiration', Edison) vs. Eidetic, mathematical visualization and holistic mental design (Tesla).",
            "Business Acumen: Empire-builder who founded General Electric (Edison) vs. Tragic visionary who tore up his multi-million royalty contract to save Westinghouse and died penniless (Tesla).",
            "The 1893 Chicago World's Fair: Westinghouse & Tesla illuminated the entire Columbian Exposition with AC, proving its definitive supremacy."
        ],
        "commonGround": "The twin architects of the electrified modern world who illuminated the 20th century.",
        "winner": "Tesla's Alternating Current (AC) powers the global electrical grid; Edison created the modern industrial R&D laboratory and corporate tech monopoly."
    },

    "crick-watson-vs-pauling": {
        "datesA": "1916–2004 & 1928–2025",
        "datesB": "1901–1994",
        "descA": "Francis Crick (1916–2004) & James Watson (1928–2025). Cavendish Laboratory, Cambridge. Young, brash theoretical duo who combined chemistry, physics, and crucially Rosalind Franklin's Photo 51 Photo 51 X-ray diffraction data (via Maurice Wilkins) to deduce the antiparallel Double Helix structure of DNA in 1953 (Nobel Prize 1962).",
        "descB": "Linus Pauling (1901–1994). Caltech titan, two-time unshared Nobel laureate (Chemistry 1954, Peace 1962), and the world's undisputed premier molecular structural chemist. Discovered the protein alpha-helix, but famously erred in proposing a flawed triple-helix model for DNA with phosphate backbones on the inside.",
        "differences": [
            "DNA Model: Double helix with outward sugar-phosphate backbones and inward complementary hydrogen-bonded base pairs A-T / C-G (Watson & Crick) vs. Erroneous triple-helix with neutral phosphates inside (Pauling).",
            "Geopolitics: Pauling's US passport was temporarily revoked by the State Department during the Red Scare, barring him from visiting London to inspect Franklin's sharp X-ray photos.",
            "Work Style: Watson & Crick built physical wire-and-cardboard scale models; Pauling relied on structural intuition and chemical bond heuristics.",
            "The Mechanism: Watson and Crick's double helix immediately revealed the copying mechanism for genetic heredity ('It has not escaped our notice...')."
        ],
        "commonGround": "Pioneered structural molecular biology to crack the physical code of terrestrial life.",
        "winner": "Watson & Crick made the greatest biological discovery of the 20th century; Pauling remains one of history's supreme chemical theorists."
    },

    "salk-vs-sabin": {
        "datesA": "1914–1995",
        "datesB": "1906–1993",
        "descA": "Jonas Salk (1914–1995). American virologist at the University of Pittsburgh. Developed the Inactivated Polio Vaccine (IPV) using formalin-killed poliovirus, announced safe and effective on April 12, 1955. Famously refused to patent the vaccine ('Could you patent the sun?'), sacrificing billions to end childhood paralysis.",
        "descB": "Albert Sabin (1906–1993). Polish-American physician and virologist at the University of Cincinnati. Developed the Oral Polio Vaccine (OPV) using live-attenuated virus (licensed 1961), administered easily on sugar cubes. It stimulated gut mucosal immunity, blocked community transmission, and enabled global polio eradication campaigns.",
        "differences": [
            "Vaccine Mechanism: Injected killed-virus vaccine (IPV, Salk) vs. Orally administered live-attenuated virus vaccine (OPV, Sabin).",
            "Administration: Requires sterile hypodermic needles and trained personnel (Salk) vs. Inexpensive oral drops on a sugar cube (Sabin).",
            "Immunity Profile: Strong individual bloodstream immunity preventing paralysis (Salk) vs. Mucosal gut immunity interrupting wild virus transmission and shedding 'secondary immunity' to others (Sabin).",
            "Rivalry: Sabin dismissed Salk as a mere 'kitchen chemist', while Salk defended IPV's absolute zero-risk of vaccine-derived reversion."
        ],
        "commonGround": "Both gifted their lifesaving vaccines to humanity royalty-free, virtually eradicating one of the most terrifying crippling diseases in human history.",
        "winner": "Salk halted the 1950s American epidemic; Sabin's oral drops made worldwide global eradication possible."
    },

    "hooke-vs-newton": {
        "datesA": "1635–1703",
        "datesB": "1643–1727",
        "descA": "Robert Hooke (1635–1703). England's 'Leonardo da Vinci', Curator of Experiments for the Royal Society, and Chief Surveyor of London after the Great Fire of 1666. Author of 'Micrographia' (coined the biological term 'cell'), formulator of Hooke's Law of elasticity (F = -kx), and early proponent of the inverse-square law of gravity.",
        "descB": "Sir Isaac Newton (1643–1727). Lucasian Professor of Mathematics at Cambridge and President of the Royal Society. Author of the 'Principia', mathematically proving Keplerian planetary orbits and universal gravitation via rigorous infinitesimal geometry.",
        "differences": [
            "Scientific Stature: Brilliant experimentalist and intuitive polymath (Hooke) vs. Matchless mathematical theorist and geometer (Newton).",
            "The Gravity Priority Feud: Hooke suggested in a 1679 letter that gravity follows an inverse-square law; Newton proved it mathematically and refused to credit Hooke in the 'Principia'.",
            "The 'Giants' Letter: Newton's famous line ('standing on the shoulders of giants') is widely interpreted by historians as a veiled barb at Hooke's hunched, diminutive stature.",
            "Erasure: When Newton became Royal Society President in 1703 following Hooke's death, the Society's only portrait of Hooke mysteriously disappeared and was lost to history."
        ],
        "commonGround": "The two intellectual engines of the 17th-century British Scientific Revolution and pillars of the Royal Society.",
        "winner": "Newton attained supreme immortal fame; modern science has restored Hooke's reputation as one of history's most brilliant experimental inventors."
    },

    # ----------------------------------------------------
    # LEADERS, GENERALS & HISTORICAL SCHISMS
    # ----------------------------------------------------
    "caesar-vs-pompey": {
        "datesA": "100–44 BC",
        "datesB": "106–48 BC",
        "descA": "Gaius Julius Caesar (100–44 BC). Roman patrician general and leader of the Populares faction. Conqueror of Gaul, brilliant orator, and master of lightning mobility (celeritas). Crossed the Rubicon in 49 BC ('Alea iacta est'), defeated Pompey's senatorial legions, and became Dictator Perpetuo before his assassination on the Ides of March.",
        "descB": "Gnaeus Pompeius Magnus (Pompey the Great, 106–48 BC). Celebrated military conqueror of the East, rid the Mediterranean of piracy in three months, and champion of the senatorial Optimates. Allied with Caesar and Crassus in the First Triumvirate before becoming the champion of the conservative Roman Senate.",
        "differences": [
            "Faction: Reformist populist championing land distribution for veterans (Caesar) vs. Conservative defender of the senatorial aristocracy (Pompey).",
            "Military Strategy: Daring aggressive maneuver, high tactical risk, and supreme personal loyalty of veteran legions vs. Vast logistical depth, naval control, and defensive war of attrition.",
            "Decisive Clash: Battle of Pharsalus (48 BC) in Greece, where Caesar's outnumbered veteran legions outflanked Pompey's cavalry.",
            "Death: Caesar was assassinated by senators in the Theater of Pompey (44 BC); Pompey was betrayed and beheaded on the shores of Egypt by Ptolemy XIII (48 BC)."
        ],
        "commonGround": "Former close allies, political partners in the First Triumvirate, and family relatives (Caesar's beloved daughter Julia was married to Pompey) who dismantled the Roman Republic.",
        "winner": "Caesar triumphed decisively on the battlefield and founded the Julio-Claudian dynasty of the Roman Empire."
    },

    "alexander-vs-darius": {
        "datesA": "356–323 BC",
        "datesB": "c. 380–330 BC",
        "descA": "Alexander III of Macedon (Alexander the Great, 356–323 BC). Tutored by Aristotle, undefeated military conqueror of the Persian Empire, Egypt, and northwestern India. Master of the Macedonian sarissa phalanx and Companion cavalry shock tactics.",
        "descB": "Darius III (Artashata, c. 380–330 BC). The last King of Kings of the Achaemenid Empire of Persia. Commanded the vast multi-ethnic imperial army, immense treasury, and cavalry contingents of the largest empire the ancient world had yet known.",
        "differences": [
            "Command Style: Led personally from the vanguard cavalry charge (Alexander) vs. Commanded from the safety of an imperial royal chariot in the center (Darius).",
            "Decisive Battles: Issus (333 BC) and Gaugamela (331 BC)—in both clashes, Alexander pierced the Persian line directly aimed at Darius, forcing the Persian King to flee.",
            "Tactical Philosophy: Tight Macedonian combined-arms phalanx and decisive wedge cavalry vs. Vast imperial numbers, scythed chariots, and immortal guards.",
            "Endgame: Alexander conquered Persepolis and merged Greco-Persian culture; Darius was murdered by his own treacherous satrap Bessus."
        ],
        "commonGround": "The two monarchs who clashed in the greatest clash of empires of antiquity, birthing the Hellenistic Age.",
        "winner": "Alexander destroyed the Achaemenid Empire in five breathtaking years and created the largest empire in ancient history."
    },

    "scipio-vs-hannibal": {
        "datesA": "236–183 BC",
        "datesB": "247–183/181 BC",
        "descA": "Publius Cornelius Scipio Africanus (236–183 BC). Roman statesman and general. Studied Hannibal's tactical encirclements, conquered Carthaginian Iberia, trained a flexible Roman manipular legion, and invaded North Africa to force Hannibal to leave Italy.",
        "descB": "Hannibal Barca (247–183 BC). Legendary Carthaginian commander who marched war elephants across the Alps (218 BC) and annihilated Roman armies at Trebia, Lake Trasimene, and the Cannae tactical masterpiece (216 BC).",
        "differences": [
            "Grand Strategy: Hannibal sought to shatter Roman Italian confederate alliances; Scipio took the war directly to the Carthaginian homeland.",
            "The Battle of Zama (202 BC): Scipio countered Hannibal's 80 war elephants by creating open lanes between his maniples, neutralized Carthaginian cavalry with Massinissa's Numidians, and out-encircled the master of Cannae.",
            "Later Life: Both military legends were ultimately alienated, betrayed, and died in exile in the exact same year (c. 183 BC).",
            "Tactics: Hannibal pioneered the double-envelopment; Scipio perfected legionary tactical flexibility."
        ],
        "commonGround": "The two preeminent military strategists of the ancient Mediterranean who determined whether Rome or Carthage would rule the Western world.",
        "winner": "Scipio Africanus won at Zama, crushing Carthage and sealing Rome's undisputed Mediterranean hegemony."
    },

    "richard-vs-saladin": {
        "datesA": "1157–1199",
        "datesB": "1137–1193",
        "descA": "Richard I 'The Lionheart' (1157–1199). King of England, Duke of Normandy, and commander of the Third Crusade. Audacious battlefield tactician, chivalric warrior-king, and victor at the Siege of Acre and Battle of Arsuf (1191).",
        "descB": "Salah ad-Din Yusuf ibn Ayyub (Saladin, 1137–1193). First Sultan of Egypt and Syria and founder of the Ayyubid dynasty. Recaptured Jerusalem for Islam in 1187 following the Battle of Hattin; revered in both the Muslim world and Christian Europe for his magnanimity and chivalry.",
        "differences": [
            "Tactics: Heavily armored knight cavalry charges and coastal disciplined infantry lines (Richard) vs. Swift horse archer skirmishing, feigned retreats, and desert attrition (Saladin).",
            "Chivalric Diplomacy: When Richard fell ill with fever, Saladin sent gifts of snow from Mount Hermon and fresh fruit; when Richard's horse was killed at Jaffa, Saladin sent two fresh steeds.",
            "Outcome of the Third Crusade: The Treaty of Jaffa (1192) recognized Muslim control of Jerusalem while granting unarmed Christian pilgrims and merchants free access.",
            "Strategic Reality: Richard won tactical battlefield victories, but Saladin retained Jerusalem."
        ],
        "commonGround": "The two iconic chivalric legends of the Crusades whose mutual respect transcended holy war.",
        "winner": "A strategic equilibrium: Richard secured the coastal Crusader states; Saladin kept Jerusalem in Muslim hands."
    },

    "wellington-vs-napoleon": {
        "datesA": "1769–1852",
        "datesB": "1769–1821",
        "descA": "Arthur Wellesley, 1st Duke of Wellington (1769–1852). Anglo-Irish general and later British Prime Minister. Undefeated commander of the Peninsular War, master of defensive positioning, reverse-slope infantry deployment, and disciplined musket volleys.",
        "descB": "Napoleon Bonaparte (1769–1821). Emperor of the French and military genius who conquered continental Europe. Master of operational maneuver (corps d'armée), concentration of artillery at the decisive point, and author of the Napoleonic Code.",
        "differences": [
            "Birth: Both were born in the same year (1769)—Napoleon in Corsica, Wellington in Dublin.",
            "Command Doctrine: Methodical defensive preparation, logistics, and reverse slopes to shield troops from artillery (Wellington) vs. Rapid aggressive operational movement, shocking momentum, and battlefield intuition (Napoleon).",
            "Waterloo (June 18, 1815): Wellington held the ridge of Mont-Saint-Jean under brutal French cavalry and Imperial Guard assaults until Blücher's Prussian army arrived on the French right flank.",
            "Exile vs. State Funeral: Napoleon died exiled on the windswept island of Saint Helena (1821); Wellington received a monumental British state funeral in St. Paul's Cathedral (1852)."
        ],
        "commonGround": "The two supreme military commanders of the Napoleonic Wars whose sole head-to-head clash at Waterloo ended two decades of European warfare.",
        "winner": "Wellington (with Blücher's Prussian reinforcements) ended Napoleon's empire forever at the Battle of Waterloo."
    },

    "grant-vs-lee": {
        "datesA": "1822–1885",
        "datesB": "1807–1870",
        "descA": "Ulysses S. Grant (1822–1885). General of the Armies and 18th US President. Master of operational coordination, logistical warfare, and relentless strategic pressure (Overland Campaign, Siege of Vicksburg, Appomattox).",
        "descB": "Robert E. Lee (1807–1870). Commander of the Confederate Army of Northern Virginia. Aristocratic Virginian master of daring defensive-offensive maneuver and audacious battlefield risk (Chancellorsville, Second Manassas, Fredericksburg).",
        "differences": [
            "Strategic Vision: Integrated multi-theater continental attrition war against Southern infrastructure and armies (Grant) vs. Tactical battlefield brilliance aimed at breaking Northern political will (Lee).",
            "The Overland Campaign (1864): When previous Union generals retreated after bloody battles (Wilderness, Spotsylvania), Grant repeatedly sidestepped south, pinning Lee into a fatal siege at Petersburg.",
            "Surrender at Appomattox (April 9, 1865): Grant offered generous, magnanimous surrender terms, allowing Confederate soldiers to keep their horses and go home unmolested.",
            "Background: Son of an Ohio tanner (Grant) vs. Son of Revolutionary War hero 'Light-Horse Harry' Lee (Lee)."
        ],
        "commonGround": "Both West Point graduates and Mexican-American War veterans who respected each other's valor during the American Civil War.",
        "winner": "Grant's modern industrial, multi-theater grand strategy defeated Lee and preserved the American Union."
    },

    "montgomery-vs-rommel": {
        "datesA": "1887–1976",
        "datesB": "1891–1944",
        "descA": "Field Marshal Bernard Montgomery, 1st Viscount Montgomery of Alamein (1887–1976). Commander of the British Eighth Army. Methodical, cautious, supreme organizer of firepower, artillery, and morale who revitalized Allied forces in North Africa.",
        "descB": "Field Marshal Erwin Rommel, the 'Desert Fox' (1891–1944). Commander of the German Afrika Korps. Audacious master of armored blitzkrieg, rapid tactical improvisation, and frontline leadership in the Western Desert.",
        "differences": [
            "Command Philosophy: Meticulous preparation, overwhelming artillery barrage, and zero-risk execution (Montgomery) vs. Instinctive frontline reconnaissance, speed, and seizing sudden opportunities (Rommel).",
            "Second Battle of El Alamein (1942): Montgomery massed 200,000 men and 1,000 tanks against Rommel's starved supply lines, delivering the first major British land victory of WWII.",
            "Logistics: Montgomery insisted on vast stockpile superiority before attacking; Rommel outran his fuel lines and Axis shipping across the Mediterranean.",
            "Reputation: Montgomery was perceived as vain and abrasive; Rommel achieved mythic cross-belligerent tactical respect."
        ],
        "commonGround": "The two master desert warfare commanders of World War II whose clashes across Egypt and Libya decided the fate of the Mediterranean.",
        "winner": "Montgomery crushed Rommel's desert ambitions at El Alamein, turning the tide of the war in North Africa."
    },

    "churchill-vs-hitler": {
        "datesA": "1874–1965",
        "datesB": "1889–1945",
        "descA": "Sir Winston Churchill (1874–1965). British Prime Minister (1940–1945, 1951–1955), historian, and Nobel laureate. Stood virtually alone against Nazi Europe in 1940, mobilizing the English language and democratic resolve with defiance ('We shall fight on the beaches').",
        "descB": "Adolf Hitler (1889–1945). Führer of Nazi Germany and totalitarian dictator. Engineered the conquest of continental Europe, instituted the Holocaust (murder of six million Jews), and plunged the globe into the deadliest conflict in human history.",
        "differences": [
            "Core Ideology: Parliamentary democracy, individual liberty, and preservation of Western constitutional civilization (Churchill) vs. Genocidal racial supremacy, totalitarian dictatorship, and Lebensraum (Hitler).",
            "1940 Stand: Churchill rejected defeatism and compromise after the Fall of France; Hitler's Luftwaffe failed to subdue the RAF in the Battle of Britain.",
            "Command: Churchill deferred to professional military advice and forged the Grand Alliance (USA, USSR); Hitler increasingly micromanaged battles from his bunker, overruling his generals.",
            "Legacy: Churchill was voted Greatest Briton; Hitler's Third Reich ended in unconditional surrender and catastrophic ruin in 1945."
        ],
        "commonGround": "WWI trench veterans and master orators whose apocalyptic showdown decided the survival of Western civilization.",
        "winner": "Churchill's steadfast defiance and grand alliance crushed the Nazi regime completely in 1945."
    },

    "stalin-vs-trotsky": {
        "datesA": "1878–1953",
        "datesB": "1879–1940",
        "descA": "Joseph Vissarionovich Stalin (Ioseb Besarionis dze Jughashvili, 1878–1953). General Secretary of the Communist Party of the Soviet Union. Master bureaucrat who advocated 'Socialism in One Country', consolidated totalitarian power, enforced brutal industrialization and collectivization, and defeated Nazi Germany.",
        "descB": "Leon Trotsky (Lev Davidovich Bronstein, 1879–1940). Marxist theoretician, brilliant orator, and creator and commander of the Red Army during the Russian Civil War. Champion of 'Permanent Revolution'—believing the Soviet state could only survive if workers revolted worldwide.",
        "differences": [
            "Theoretical Strategy: Consolidate the Soviet industrial and military fortress ('Socialism in One Country', Stalin) vs. Spark continuous international working-class revolution abroad ('Permanent Revolution', Trotsky).",
            "Power Base: Ruthless party secretary controlling party apparatus, personnel appointments, and patronage (Stalin) vs. Intellectual orator and military commander isolated from backroom party machinery (Trotsky).",
            "Purges & Exile: Stalin outmaneuvered Trotsky, expelled him from the party (1927), exiled him from the USSR (1929), and erased him from official histories and photographs.",
            "The Assassination: Trotsky was assassinated in Coyoacán, Mexico in 1940 with an ice axe by NKVD agent Ramón Mercader on Stalin's direct orders."
        ],
        "commonGround": "Co-leaders of the 1917 Bolshevik October Revolution alongside Vladimir Lenin.",
        "winner": "Stalin won total control of the Soviet Union, building a totalitarian superpower; Trotsky became the tragic martyr of anti-Stalinist Marxism."
    },

    "hamilton-vs-jefferson": {
        "datesA": "1755/57–1804",
        "datesB": "1743–1826",
        "descA": "Alexander Hamilton (1755/57–1804). First US Secretary of the Treasury, principal author of 'The Federalist Papers', and leader of the Federalist Party. Championed a strong central government, the Bank of the United States, commercial manufacturing, and broad constitutional interpretation.",
        "descB": "Thomas Jefferson (1743–1826). Principal author of the Declaration of Independence, 3rd US President, and founder of the Democratic-Republican Party. Championed agrarian republicanism, states' rights, individual liberties, and strict constitutional construction.",
        "differences": [
            "Economic Vision: Modern industrial, banking, and commercial capitalist power (Hamilton) vs. Agrarian nation of independent yeoman farmers (Jefferson).",
            "Constitutional Interpretation: Loose constructionism utilizing the 'Necessary and Proper' clause (Hamilton) vs. Strict constructionism limiting federal reach (Jefferson).",
            "Foreign Alignment: Pro-British commercial ties and stability (Hamilton) vs. Pro-French revolutionary ideals of liberty and equality (Jefferson).",
            "The Capital Compromise: Hamilton secured federal assumption of state debts in exchange for placing the national capital on the Potomac (Washington, D.C.)."
        ],
        "commonGround": "American Founding Fathers who established the two-party political architecture that still defines American governance today.",
        "winner": "Jefferson won the presidency and political rhetoric of American liberty; America grew economically into Hamilton's industrialized financial powerhouse."
    },

    "lincoln-vs-douglas": {
        "datesA": "1809–1865",
        "datesB": "1813–1861",
        "descA": "Abraham Lincoln (1809–1865). 16th US President, frontier lawyer, and moral leader of the new Republican Party. Argued in the historic 1858 Senate debates that slavery was a moral wrong that must not spread into US territories, famously declaring 'A house divided against itself cannot stand'.",
        "descB": "Stephen Arnold Douglas (1813–1861). 'The Little Giant', powerful Illinois Senator and leader of the Northern Democrats. Architect of the Kansas-Nebraska Act of 1854, championing 'Popular Sovereignty'—letting local white territorial settlers vote on whether to allow slavery.",
        "differences": [
            "The Slavery Question: A fundamental moral evil violating the Declaration of Independence (Lincoln) vs. A political matter to be decided by territorial majority vote (Douglas).",
            "The Freeport Doctrine: Lincoln forced Douglas to reconcile Popular Sovereignty with the Supreme Court's Dred Scott decision; Douglas's response alienated Southern Democrats, fatally splitting his party for 1860.",
            "1858 vs. 1860: Douglas won the 1858 Illinois Senate race; Lincoln parlayed the debate fame into the 1860 Republican presidential nomination and victory.",
            "Final Unity: When the Civil War erupted, Douglas rallied Northern Democrats behind Lincoln to preserve the Union before dying of typhoid in 1861."
        ],
        "commonGround": "The greatest political debating rivals in American history, whose seven 1858 Illinois debates shaped the course of the American Republic.",
        "winner": "Lincoln lost the 1858 Senate seat but won the Presidency in 1860, emancipated enslaved Americans, and saved the Union."
    },

    "elizabeth-vs-mary": {
        "datesA": "1533–1603",
        "datesB": "1542–1587",
        "descA": "Elizabeth I of England (1533–1603). 'The Virgin Queen' and last Tudor monarch. Reigned for 44 golden years, established the Protestant Church of England via the Elizabethan Religious Settlement, defeated the Spanish Armada (1588), and fostered the English Renaissance.",
        "descB": "Mary Stuart, Queen of Scots (1542–1587). Catholic monarch of Scotland and heir presumptive to the English throne. Charismatic yet politically disastrous, she fled Scottish rebellion only to spend 19 years imprisoned by Elizabeth before being executed for treason.",
        "differences": [
            "Religion: Moderate Protestantism ('I would not open windows into men's souls', Elizabeth) vs. Devout Roman Catholicism backed by the Papacy and Spain (Mary).",
            "Political Pragmatism: Master of cautious, calculated survival and avoiding foreign marriages (Elizabeth) vs. Reckless romantic entanglements (Darnley, Bothwell) that caused her Scottish abdication (Mary).",
            "The Babington Plot: Mary's secret coded letters approving Elizabeth's assassination were intercepted and deciphered by spymaster Sir Francis Walsingham, leading to her beheading at Fotheringhay Castle (1587).",
            "Dynastic Irony: Elizabeth never married or bore children; Mary's son, James VI of Scotland, inherited Elizabeth's crown as James I of England, uniting the crowns."
        ],
        "commonGround": "Cousin queens whose royal rivalry embodied the bloody Reformation struggle for the soul of the British Isles.",
        "winner": "Elizabeth secured England's Protestant independence and cultural golden age; Mary's royal lineage ultimately inherited both thrones."
    },

    "lbj-vs-rfk": {
        "datesA": "1908–1973",
        "datesB": "1925–1968",
        "descA": "Lyndon Baines Johnson (LBJ, 1908–1973). 36th US President and master of Senate legislative arm-twisting (the 'Johnson Treatment'). Champion of the 'Great Society', signing the landmark Civil Rights Act of 1964 and Voting Rights Act of 1965, but broken by the escalation of the Vietnam War.",
        "descB": "Robert Francis Kennedy (RFK, 1925–1968). US Attorney General, New York Senator, and charismatic moral leader of 1960s American liberalism. Champion of racial justice, civil rights, and anti-poverty campaigns who ran against LBJ's Vietnam policy in 1968 before being assassinated.",
        "differences": [
            "Style: Texas raw political powerhouse, transactional deal-maker, and towering legislative arm-twister (LBJ) vs. Boston patrician, idealistic, passionate icon of the Kennedy legacy (RFK).",
            "Personal Animosity: Deep mutual visceral hatred stemming from the 1960 Democratic convention and RFK's contempt for Johnson during JFK's presidency.",
            "Vietnam: LBJ escalated US troop deployments to over 500,000; RFK broke with Johnson in 1968 to run on an anti-war, social justice platform.",
            "1968 Drama: Johnson announced he would not seek re-election on March 31, 1968; RFK's soaring campaign ended with his assassination in Los Angeles on June 5, 1968."
        ],
        "commonGround": "The two political giants of 1960s Democratic Party politics who drove the greatest civil rights transformation in modern American history.",
        "winner": "LBJ delivered the monumental civil rights and healthcare legislation (Medicare/Medicaid); RFK remains the tragic moral conscience of 1960s American liberalism."
    },

    "amundsen-vs-scott": {
        "datesA": "1872–1928",
        "datesB": "1868–1912",
        "descA": "Roald Engelbregt Gravning Amundsen (1872–1928). Norwegian polar explorer and master of Arctic survival. First person to traverse the Northwest Passage. Traveled with skilled cross-country skiers, 52 Greenland sled dogs, and Inuit fur clothing, methodically reaching the South Pole on December 14, 1911.",
        "descB": "Captain Robert Falcon Scott (1868–1912). British Royal Navy officer and explorer. Led the Terra Nova Expedition relying on ill-fated motorized sledges, Manchurian ponies, and grueling human man-hauling in wool garments, arriving at the Pole 34 days after Amundsen to find the Norwegian tent.",
        "differences": [
            "Logistics: Dog sleds and professional cross-country skiing (Amundsen) vs. Ponies, unproven motor sleds, and agonizing human man-hauling of sleds (Scott).",
            "Survival Preparation: Studied Inuit survival skills, wore sealskin and reindeer furs, meticulously marked depots with black flags (Amundsen) vs. Traditional British naval discipline, woolen clothing, and poor depot navigation (Scott).",
            "Outcome: Amundsen and his entire team returned safely with zero fatalities; Scott and his four companions (Wilson, Bowers, Oates, Evans) perished on their return journey in a blizzard.",
            "Legacy: Amundsen was hailed as the consummate polar professional; Scott became a mythic British national hero of heroic tragedy and stoic courage."
        ],
        "commonGround": "The Heroic Age of Antarctic Exploration's dramatic race to the coldest and most remote point on Planet Earth.",
        "winner": "Amundsen won through flawless preparation, Inuit wisdom, and dog sledding mastery."
    },

    # ----------------------------------------------------
    # ART & MUSIC
    # ----------------------------------------------------
    "michelangelo-vs-davinci": {
        "datesA": "1475–1564",
        "datesB": "1452–1519",
        "descA": "Michelangelo di Lodovico Buonarroti Simoni (1475–1564). Supreme sculptor, painter, and architect of the High Renaissance ('David', 'Pietà', Sistine Chapel ceiling, 'The Last Judgment'). Believed sculpture was the highest art form, freeing the divine human form trapped inside raw marble.",
        "descB": "Leonardo di ser Piero da Vinci (1452–1519). The quintessential 'Renaissance Man'—painter, anatomist, engineer, and scientist ('Mona Lisa', 'The Last Supper', 'Vitruvian Man'). Believed painting was supreme because it required scientific understanding of light, optics, shadow (sfumato), and nature.",
        "differences": [
            "Personality: Solitary, tempestuous, brooding, deeply pious, and tireless laborer (Michelangelo) vs. Urbane, charming, vegetarian courtier, polymath, and chronic non-finisher (Leonardo).",
            "The Battle of Anghiari vs. Cascina (1504): Florence commissioned both rivals to paint opposite walls in the Palazzo Vecchio—their bitter rivalry clashed publicly, though neither fresco was completed.",
            "Artistic Stance: The heroic muscular tension and spiritual agony of the human body (Michelangelo) vs. Enigmatic psychological subtlety, sfumato mist, and universal botanical/hydraulic laws (Leonardo).",
            "Mutual Contempt: Leonardo criticized excessive muscular anatomy as 'bags of walnuts'; Michelangelo publicly mocked Leonardo for failing to cast a bronze horse in Milan."
        ],
        "commonGround": "The two titan demi-gods of the Italian High Renaissance who redefined human creative capability.",
        "winner": "Michelangelo completed the grandest physical artistic monuments in Western history; Leonardo gave humanity the supreme symbol of artistic and scientific curiosity."
    },

    "picasso-vs-matisse": {
        "datesA": "1881–1973",
        "datesB": "1869–1954",
        "descA": "Pablo Ruiz y Picasso (1881–1973). Spanish painter, sculptor, and co-founder of Cubism ('Les Demoiselles d'Avignon', 'Guernica'). Restless, ferocious, revolutionary deconstructor of three-dimensional space, form, and perspective.",
        "descB": "Henri Émile Benoît Matisse (1869–1954). French master painter, draughtsman, and leader of Fauvism ('The Dance', 'Woman with a Hat', the cut-outs). Champion of pure, vibrant, decorative color, fluid contour, and serene visual harmony.",
        "differences": [
            "Artistic Core: Form, structure, spatial deconstruction, and visceral raw energy (Picasso) vs. Color, decorative harmony, joy, and emotional equilibrium (Matisse).",
            "Divergence in Words: Matisse described art as 'a soothing, calming influence on the mind, something like a good armchair'; Picasso viewed painting as 'an instrument of offensive and defensive war against the enemy'.",
            "The 1906 Meeting: Introduced by Gertrude Stein, they began a lifelong rivalry of creative one-upmanship—Matisse's 'Bonheur de Vivre' spurred Picasso to paint 'Les Demoiselles d'Avignon'.",
            "Late Life: Picasso paid deep homage to Matisse's cut-outs after Matisse's death, declaring: 'All things considered, there is only Matisse.'"
        ],
        "commonGround": "The two preeminent painters of the 20th century whose friendly duel established the vocabulary of modern visual art.",
        "winner": "A glorious tie: Picasso revolutionized pictorial form and politics; Matisse revolutionized modern chromatic expression and decorative joy."
    },

    "gauguin-vs-vangogh": {
        "datesA": "1848–1903",
        "datesB": "1853–1890",
        "descA": "Eugène Henri Paul Gauguin (1848–1903). French Post-Impressionist painter. Cynical, arrogant ex-stockbroker who abandoned his family to seek 'primitive' purity in Brittany and Tahiti. Painted from memory and imagination, pioneering Synthetism and Cloisonnism with flat planes of symbolic color.",
        "descB": "Vincent Willem van Gogh (1853–1890). Dutch Post-Impressionist painter. Fervent, emotional, tortured visionary who painted directly from nature with thick impasto, rhythmic swirling brushstrokes, and intense raw color ('The Starry Night', 'Sunflowers', 'Bedroom in Arles').",
        "differences": [
            "The Yellow House (Arles, 1888): Van Gogh invited Gauguin to found an artistic commune in the south of France; nine explosive weeks of heavy drinking, intense debate, and psychological tension.",
            "Technique: Paint from memory and abstract imagination (Gauguin) vs. Paint with intense feverish passion directly from nature (Van Gogh).",
            "The Ear Incident: Following a violent confrontation on December 23, 1888, Gauguin fled the Yellow House; Van Gogh experienced a severe psychotic breakdown and severed his left ear.",
            "Legacy: Gauguin influenced Symbolism and modern primitivism; Van Gogh became the supreme martyr and father of modern Expressionism."
        ],
        "commonGround": "Pioneers of Post-Impressionism who liberated art from photographic realism into psychological and emotional symbolism.",
        "winner": "Van Gogh's raw emotional honesty and brushwork created the most universally beloved paintings in human history."
    },

    "beatles-vs-stones": {
        "datesA": "Active 1960–1970",
        "datesB": "Formed 1962, Active",
        "descA": "The Beatles (1960–1970). John Lennon, Paul McCartney, George Harrison, Ringo Starr. Liverpool quartet that conquered the world with Beatlemania, then retired from touring to invent modern studio pop artistry, psychedelia, and conceptual albums ('Revolver', 'Sgt. Pepper', 'Abbey Road').",
        "descB": "The Rolling Stones (1962–Present). Mick Jagger, Keith Richards, Brian Jones, Charlie Watts, Bill Wyman. London blues purists turned enduring rock-and-roll outlaws, master of gritty guitar riffs, dangerous swagger, and legendary stadium live energy ('Exile on Main St.', 'Let It Bleed', 'Sticky Fingers').",
        "differences": [
            "Studio vs. Stage: Studio wizards who revolutionized music production in 7 years of studio isolation (The Beatles) vs. The greatest touring, surviving live rock & roll spectacle for over 60 years (The Stones).",
            "Musical DNA: Harmonic pop, avant-garde classical experimentation, Indian raga, music hall (The Beatles) vs. Raw Chicago blues, Chuck Berry riffs, dirty rock & roll, and country soul (The Stones).",
            "Marketing Myth: The clean-cut 'Mop Tops' (who were originally gritty Hamburg leather-clad rockers) vs. The bad-boy 'Would you let your daughter marry a Rolling Stone?' rebels.",
            "Catalog: The Beatles hold the record for most #1 hits (20 on Billboard Hot 100); The Stones hold the crown for rock's longest uninterrupted reign."
        ],
        "commonGround": "Leaders of the 1960s British Invasion who transformed popular rock music from teen dance craze into monumental global culture.",
        "winner": "The Beatles created the greatest creative studio discography in pop history; The Rolling Stones defined the immortal live soul of rock & roll."
    },

    "biggie-vs-tupac": {
        "datesA": "1972–1997",
        "datesB": "1971–1996",
        "descA": "The Notorious B.I.G. (Christopher Wallace / Biggie Smalls, 1972–1997). Brooklyn icon, flagship artist of Bad Boy Records. Unmatched technical flow, conversational cadence, intricate multi-syllabic rhyme schemes, and vivid cinematic Brooklyn street storytelling ('Ready to Die', 'Life After Death').",
        "descB": "Tupac Amaru Shakur (2Pac / Makaveli, 1971–1996). Death Row Records icon, poet, and son of Black Panther activists. Unrivaled emotional vulnerability, social consciousness, volcanic passion, and revolutionary fury ('Me Against the World', 'All Eyez on Me').",
        "differences": [
            "Lyrical Genius: Supreme technical rhyming mastery, effortless rhythm, dry wit, and mafioso storytelling (Biggie) vs. Raw charisma, political urgency, visceral pain, and prophetic poetry (Tupac).",
            "Coast Rivalry: East Coast (Bad Boy Records, NYC) vs. West Coast (Death Row Records, Los Angeles)—a tragic media-inflamed feud following the 1994 Quad Studios shooting in Manhattan.",
            "Death: Both hip-hop royalty were cut down in unsolved drive-by shootings six months apart (Tupac in Las Vegas on Sept 13, 1996; Biggie in Los Angeles on March 9, 1997).",
            "Cultural Impact: Biggie perfected the art of rap technique; Tupac became a global political icon of marginalized struggle and martyrdom."
        ],
        "commonGround": "Former close friends whose tragic feud marked the darkest hour and highest creative summit of Golden Age 1990s Hip-Hop.",
        "winner": "Biggie is the undisputed god of technical rap flow; Tupac is the immortal cultural prophet and soul of hip-hop."
    },

    # ----------------------------------------------------
    # ATHLETES & MODERN RIVALS
    # ----------------------------------------------------
    "senna-vs-prost": {
        "datesA": "1960–1994",
        "datesB": "b. 1955",
        "descA": "Ayrton Senna da Silva (1960–1994). Brazilian 3-time Formula One World Champion (1988, 1990, 1991). Pure raw speed, religious dedication, supernatural wet-weather mastery, and ruthless commitment to winning at any cost.",
        "descB": "Alain Prost (b. 1955). 'The Professor', French 4-time Formula One World Champion (1985, 1986, 1989, 1993). Smooth, clinical, intellectual racing tactician who preserved tires and brakes, calculating the exact minimum speed needed to win.",
        "differences": [
            "Driving Philosophy: Mystical intensity, pushing past limits, aggressive wheel-to-wheel overtaking (Senna) vs. Smooth, cerebral calculation, minimal mechanical strain, strategic points maximization (Prost).",
            "Suzuka Clashes: Teammates at McLaren who collided at the chicane in 1989 (crowning Prost) and at Turn 1 at 160 mph in 1990 (crowning Senna).",
            "Statistics: Senna earned 41 wins and 65 pole positions; Prost earned 51 wins and 4 World Championships.",
            "Reconciliation: Following Prost's 1993 retirement, the two bitter rivals reconciled; Prost was a pallbearer at Senna's funeral in São Paulo after his tragic death at Imola in 1994."
        ],
        "commonGround": "The greatest, most intense psychological rivalry in Formula 1 history, dominating the sport's turbo golden era.",
        "winner": "Prost holds more World Titles (4 to 3); Senna holds the immortal spiritual crown as the most mesmerizing driver ever to sit in a cockpit."
    },

    "messi-vs-ronaldo": {
        "datesA": "b. 1987",
        "datesB": "b. 1985",
        "descA": "Lionel Andrés Messi (b. 1987, Rosario, Argentina). Record 8-time Ballon d'Or winner and 2022 FIFA World Cup champion with Argentina. Natural genius with unmatched low center of gravity, surgical dribbling, supernatural vision, playmaking, and finishing.",
        "descB": "Cristiano Ronaldo dos Santos Aveiro (b. 1985, Madeira, Portugal). 5-time Ballon d'Or winner and all-time top international goalscorer (Euro 2016 champion). Monument to physical perfection, relentless work ethic, aerial dominance, clutch finishing, and athletic power.",
        "differences": [
            "Playstyle: Effortless playmaking maestro, dribbler, assister, and finisher in one (Messi) vs. Ruthless, explosive goalscoring powerhouse and physical supreme athlete (Ronaldo).",
            "El Clásico Era: For nine intense seasons (2009–2018), Messi's FC Barcelona and Ronaldo's Real Madrid turned Spanish football into the pinnacle of global sports entertainment.",
            "Career Accolades: Messi holds 8 Ballons d'Or and the 2022 World Cup trophy; Ronaldo holds 5 Ballons d'Or and 5 UEFA Champions League titles.",
            "The World Cup: Messi completed football by lifting the 2022 FIFA World Cup in Qatar, scoring 7 goals and winning the Golden Ball."
        ],
        "commonGround": "The greatest individual player rivalry in football history, shattering every domestic and European goalscoring record over two decades.",
        "winner": "Messi's 2022 World Cup triumph and 8 Ballons d'Or cemented his place as the definitive GOAT of world football."
    },

    "nadal-vs-federer": {
        "datesA": "b. 1986",
        "datesB": "b. 1981",
        "descA": "Rafael Nadal Parera (b. 1986). 'The King of Clay', 22-time Grand Slam champion (unprecedented 14 French Open titles). Unstoppable topspin heavy forehand, indomitable physical resilience, defensive mastery, and warrior spirit.",
        "descB": "Roger Federer (b. 1981). 20-time Grand Slam champion and Swiss maestro. The definition of tennis elegance—silky smooth footwork, effortless one-handed backhand, pinpoint serve, and grace under pressure.",
        "differences": [
            "Matchup Dynamic: Nadal's vicious, high-bouncing lefty topspin targeted Federer's one-handed backhand shoulder-high on slower clay and hard courts.",
            "The 2008 Wimbledon Final: Widely hailed as the greatest tennis match in history, Nadal defeated Federer in five epic sets (9-7 in the dark) to snap Roger's 5-year grass reign.",
            "Surface Dominance: Federer dominated grass (8 Wimbledon titles) and fast indoor courts; Nadal achieved absolute historical clay immortality (14 Roland Garros crowns).",
            "Head-to-Head: Nadal leads the head-to-head 24–16, including 10–4 in Grand Slams.",
            "Friendship: A fierce on-court rivalry blossomed into deep lifelong brotherhood, captured in their tearful joint farewell at the 2022 Laver Cup."
        ],
        "commonGround": "The classiest, most aesthetically balanced rivalry in sporting history, elevating men's tennis into High Art.",
        "winner": "Nadal holds the head-to-head advantage and 22 Grand Slams; Federer defined the universal gold standard of tennis beauty and global sportsmanship."
    },

    "jobs-vs-gates": {
        "datesA": "1955–2011",
        "datesB": "b. 1955",
        "descA": "Steven Paul Jobs (1955–2011). Co-founder and CEO of Apple (Apple II, Macintosh, iMac, iPod, iPhone, iPad). The perfectionist visionary of design, seamless end-to-end hardware-software integration, and user-friendly computing.",
        "descB": "William Henry Gates III (b. 1955). Co-founder of Microsoft and visionary of global software ubiquity (MS-DOS, Windows, Office). Astute business strategist who licensed software across hardware manufacturers to put 'a computer on every desk'.",
        "differences": [
            "Product Philosophy: Closed, tightly controlled, proprietary vertical integration of hardware and software (Jobs) vs. Open software licensing across thousands of PC hardware OEMs (Gates).",
            "Design Focus: Aesthetic beauty, typography, emotional resonance, and simplicity (Jobs) vs. Backward compatibility, enterprise features, scale, and market ubiquity (Gates).",
            "The 1997 Lifeline: When Apple faced near-bankruptcy in 1997, Jobs negotiated a $150 million investment from Microsoft to save Apple, leading to the greatest turnaround in corporate history.",
            "Second Acts: Jobs resurrected Apple into the most valuable consumer tech company on Earth; Gates built the world's largest private philanthropic foundation."
        ],
        "commonGround": "Born in the exact same year (1955), they launched the Personal Computer Revolution from garages and transformed human digital civilization.",
        "winner": "Gates won the 20th-century PC monopoly; Jobs won the 21st-century mobile smartphone revolution."
    },

    "bezos-vs-musk": {
        "datesA": "b. 1964",
        "datesB": "b. 1971",
        "descA": "Jeffrey Preston Bezos (b. 1964). Founder of Amazon and Blue Origin. Methodical corporate builder of logistics, e-commerce, and cloud computing (AWS). His aerospace vision ('Gradatim Ferociter') emphasizes rotating O'Neill orbital space colonies to move heavy industry off Earth.",
        "descB": "Elon Reeve Musk (b. 1971). Founder of SpaceX and CEO of Tesla. High-risk, rapid-iteration engineer-entrepreneur. Pioneered reusable orbital rockets (Falcon 9, Starship) with the singular existential mission of making humanity a multi-planetary species on Mars.",
        "differences": [
            "Space Architecture: Methodical, secretive, incremental development (Blue Origin) vs. Public, rapid hardware testing to failure and iteration (SpaceX).",
            "The Ultimate Destination: Vast space habitats orbiting Earth with millions living and working in space (Bezos) vs. Colonizing and terraforming Mars as a backup for human consciousness (Musk).",
            "Orbital Execution: SpaceX revolutionized orbital launch, Starlink satellite internet, and NASA crew flights; Blue Origin focused on suborbital tourism (New Shepard) before New Glenn.",
            "Clashes: Public feuds over NASA lunar lander contracts, patent fights for rocket landing barges, and Twitter barbs."
        ],
        "commonGround": "The two wealthiest entrepreneurs of the 21st century deploying vast personal fortunes to privatize space exploration and build an interplanetary economy.",
        "winner": "Musk and SpaceX achieved total orbital and commercial launch dominance; Bezos built the global infrastructure backbone of e-commerce and cloud computing."
    },

    "schwarzenegger-vs-stallone": {
        "datesA": "b. 1947",
        "datesB": "b. 1946",
        "descA": "Arnold Alois Schwarzenegger (b. 1947). 'The Austrian Oak', 7-time Mr. Olympia, Hollywood action superstar ('The Terminator', 'Predator', 'Total Recall'), and 38th Governor of California. Towering, unstoppable, machine-like presence with razor-sharp comedic timing and Austrian one-liners.",
        "descB": "Sylvester Gardenzio Stallone (b. 1946). 'Sly', Oscar-nominated screenwriter and director who created two of cinema's most iconic characters: Rocky Balboa and John Rambo ('Rocky', 'First Blood'). Emptied his soul into wounded, gritty, underdog working-class heroism.",
        "differences": [
            "Character Archetype: Invincible, superhuman, Austrian juggernaut who shrugs off bullets (Schwarzenegger) vs. Vulnerable, beaten, bleeding underdog who absorbs brutal punishment and refuses to quit (Stallone).",
            "The 1980s Escalation: A fierce body-count competition in cinema—bigger muscles, bigger machine guns, bigger explosions, and deliberate box-office sabotage (Arnold tricked Sly into taking 'Stop! Or My Mom Will Shoot').",
            "Creative Role: Bodybuilder turned movie star and political leader (Arnold) vs. Prolific screenwriter and director who wrote and directed his own franchise masterpieces (Sly).",
            "Later Friendship: Reconciled in the 1990s as Planet Hollywood business partners and co-starred in 'The Expendables' and 'Escape Plan'."
        ],
        "commonGround": "The two undisputed kings of 1980s and 1990s Hollywood action cinema who defined testosterone-fueled blockbuster entertainment.",
        "winner": "Arnold won the peak 1980s box office and global pop-culture celebrity; Stallone created the richer, Oscar-validated cinematic screenwriting mythology (Rocky)."
    },

    "kanye-vs-taylor": {
        "datesA": "b. 1977",
        "datesB": "b. 1989",
        "descA": "Kanye Omari West (Ye, b. 1977). Producer, rapper, fashion mogul (Yeezy), and 24-time Grammy winner. Restless artistic provocateur who reinvented hip-hop sonic architecture ('The College Dropout', 'My Beautiful Dark Twisted Fantasy', 'Yeezus') before erratic public controversies alienated corporate partners.",
        "descB": "Taylor Alison Swift (b. 1989). Singer-songwriter, businesswoman, and cultural phenomenon. 4-time Grammy Album of the Year winner and creator of the historic record-breaking Eras Tour. Master of autobiographical lyricism, industry maneuvering, and fan connection.",
        "differences": [
            "The 2009 VMAs Interruption: Kanye rushed the stage during 19-year-old Taylor's acceptance speech ('Imma let you finish, but Beyoncé had one of the best videos of all time!'), sparking a decade of pop culture warfare.",
            "The 2016 'Famous' Phone Call: Secretly recorded phone call released by Kim Kardashian triggered the #TaylorSwiftIsASnake social media storm, prompting Swift's venomous 'Reputation' album.",
            "Career Trajectory: Unfiltered self-destruction, loss of billionaire fashion deals, and radical chaotic artistry (Ye) vs. Meticulously calculated career reinvention, master ownership re-recordings (Taylor's Version), and trillion-dollar economic tour dominance (Taylor).",
            "Artistic Form: Genre-bending hip-hop production and sonic chaos vs. Master narrative pop, country, and indie-folk songwriting."
        ],
        "commonGround": "The two most dominant, scrutinized, and commercially defining musical forces of the 21st century whose careers are permanently linked.",
        "winner": "Taylor Swift became the supreme titan of the global music industry; Ye's early musical catalog remains immortal despite his self-demolished empire."
    }
}
