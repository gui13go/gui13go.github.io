# Part 1: Personalities 0 to 105
DATA_PART1 = {
    "Niels Bohr": {
        "dates": "1885–1962",
        "birthYear": 1885,
        "summary": "Danish physicist and Nobel laureate who revolutionized modern atomic theory and quantum mechanics with the Bohr model and principle of complementarity.",
        "keyWorks": ["Bohr Model of the Atom", "Principle of Complementarity", "Copenhagen Interpretation"],
        "quote": {"text": "An expert is a person who has made all the mistakes that can be made in a very narrow field.", "cite": "Niels Bohr"},
        "quotes": [
            {"text": "An expert is a person who has made all the mistakes that can be made in a very narrow field.", "cite": "Niels Bohr"},
            {"text": "How wonderful that we have met with a paradox. Now we have some hope of making progress.", "cite": "Niels Bohr"}
        ],
        "tags": ["Physics", "Quantum Mechanics", "Nobel Prize", "Denmark"]
    },
    "Max Planck": {
        "dates": "1858–1947",
        "birthYear": 1858,
        "summary": "German theoretical physicist and originator of quantum theory, introducing the quantum of action (Planck's constant) and winning the 1918 Nobel Prize in Physics.",
        "keyWorks": ["Planck Postulate", "Black-Body Radiation Law", "Planck's Constant"],
        "quote": {"text": "Science cannot solve the ultimate mystery of nature. And that is because, in the last analysis, we ourselves are a part of the mystery that we are trying to solve.", "cite": "Max Planck"},
        "quotes": [
            {"text": "Science cannot solve the ultimate mystery of nature.", "cite": "Max Planck"},
            {"text": "A new scientific truth does not triumph by convincing its opponents and making them see the light, but rather because its opponents eventually die.", "cite": "Scientific Autobiography"}
        ],
        "tags": ["Physics", "Quantum Theory", "Thermodynamics", "Nobel Prize"]
    },
    "Erwin Schrödinger": {
        "dates": "1887–1961",
        "birthYear": 1887,
        "summary": "Nobel Prize-winning Austrian-Irish physicist whose wave equation formed the foundation of wave mechanics, and author of the influential biological treatise 'What is Life?'.",
        "keyWorks": ["Schrödinger Wave Equation", "Schrödinger's Cat Thought Experiment", "What is Life?"],
        "quote": {"text": "The task is not so much to see what no one has yet seen, but to think what nobody has yet thought, about that which everybody sees.", "cite": "Erwin Schrödinger"},
        "quotes": [
            {"text": "The task is not so much to see what no one has yet seen, but to think what nobody has yet thought, about that which everybody sees.", "cite": "Erwin Schrödinger"}
        ],
        "tags": ["Physics", "Quantum Mechanics", "Wave Mechanics", "Nobel Prize"]
    },
    "Werner Heisenberg": {
        "dates": "1901–1976",
        "birthYear": 1901,
        "summary": "German theoretical physicist, Nobel laureate, and pioneer of quantum mechanics renowned for formulating the Uncertainty Principle and matrix mechanics.",
        "keyWorks": ["Uncertainty Principle", "Matrix Mechanics", "Physical Principles of the Quantum Theory"],
        "quote": {"text": "What we observe is not nature itself, but nature exposed to our method of questioning.", "cite": "Physics and Philosophy"},
        "quotes": [
            {"text": "What we observe is not nature itself, but nature exposed to our method of questioning.", "cite": "Physics and Philosophy"}
        ],
        "tags": ["Physics", "Quantum Mechanics", "Uncertainty Principle", "Nobel Prize"]
    },
    "James Clerk Maxwell": {
        "dates": "1831–1879",
        "birthYear": 1831,
        "summary": "Scottish mathematician and scientist who unified electricity, magnetism, and light into classical electromagnetism through Maxwell's equations.",
        "keyWorks": ["Maxwell's Equations", "A Treatise on Electricity and Magnetism", "Maxwell-Boltzmann Distribution"],
        "quote": {"text": "Thoroughly conscious ignorance is the prelude to every real advance in science.", "cite": "James Clerk Maxwell"},
        "quotes": [
            {"text": "Thoroughly conscious ignorance is the prelude to every real advance in science.", "cite": "James Clerk Maxwell"}
        ],
        "tags": ["Physics", "Electromagnetism", "Mathematics", "Thermodynamics"]
    },
    "Michael Faraday": {
        "dates": "1791–1867",
        "birthYear": 1791,
        "summary": "English experimental scientist who discovered electromagnetic induction, diamagnetism, and the laws of electrolysis, founding electric motor technology.",
        "keyWorks": ["Electromagnetic Induction", "Faraday's Laws of Electrolysis", "Faraday Cage"],
        "quote": {"text": "Nothing is too wonderful to be true if it be consistent with the laws of nature.", "cite": "Michael Faraday"},
        "quotes": [
            {"text": "Nothing is too wonderful to be true if it be consistent with the laws of nature.", "cite": "Michael Faraday"}
        ],
        "tags": ["Physics", "Chemistry", "Electromagnetism", "Invention"]
    },
    "Leonhard Euler": {
        "dates": "1707–1783",
        "birthYear": 1707,
        "summary": "Swiss polymath and one of the greatest mathematicians in history, founding graph theory and introducing modern mathematical notation and analysis.",
        "keyWorks": ["Euler's Formula (e^(iπ) + 1 = 0)", "Seven Bridges of Königsberg (Graph Theory)", "Introductio in analysin infinitorum"],
        "quote": {"text": "Mathematicians have tried in vain to this day to discover some order in the sequence of prime numbers, and we have reason to believe that it is a mystery into which the human mind will never penetrate.", "cite": "Leonhard Euler"},
        "quotes": [
            {"text": "Now I will have less distraction.", "cite": "Leonhard Euler (upon losing sight in his right eye)"}
        ],
        "tags": ["Mathematics", "Calculus", "Graph Theory", "Analysis"]
    },
    "Carl Friedrich Gauss": {
        "dates": "1777–1855",
        "birthYear": 1777,
        "summary": "German prodigy known as the 'Prince of Mathematicians', whose profound discoveries transformed number theory, differential geometry, statistics, and astronomy.",
        "keyWorks": ["Disquisitiones Arithmeticae", "Gaussian Distribution (Normal Distribution)", "Fundamental Theorem of Algebra"],
        "quote": {"text": "Mathematics is the queen of the sciences and number theory is the queen of mathematics.", "cite": "Carl Friedrich Gauss"},
        "quotes": [
            {"text": "Few, but ripe (Pauca sed matura).", "cite": "Motto"}
        ],
        "tags": ["Mathematics", "Number Theory", "Astronomy", "Statistics"]
    },
    "Kurt Gödel": {
        "dates": "1906–1978",
        "birthYear": 1906,
        "summary": "Austrian-American logician and mathematician whose Incompleteness Theorems proved that any consistent axiomatic system capable of arithmetic contains unprovable truths.",
        "keyWorks": ["Incompleteness Theorems (1931)", "Consistency of the Continuum Hypothesis", "Rotating Gödel Universe"],
        "quote": {"text": "Either mathematics is too big for the human mind, or the human mind is more than a machine.", "cite": "Kurt Gödel"},
        "quotes": [
            {"text": "Either mathematics is too big for the human mind, or the human mind is more than a machine.", "cite": "Kurt Gödel"}
        ],
        "tags": ["Logic", "Mathematics", "Philosophy", "Metamathematics"]
    },
    "Louis Pasteur": {
        "dates": "1822–1895",
        "birthYear": 1822,
        "summary": "French chemist and microbiologist renowned for establishing germ theory, inventing pasteurization, and developing lifesaving vaccines for rabies and anthrax.",
        "keyWorks": ["Germ Theory of Disease", "Pasteurization Process", "Rabies Vaccine"],
        "quote": {"text": "Chance favors only the prepared mind.", "cite": "Louis Pasteur"},
        "quotes": [
            {"text": "Chance favors only the prepared mind.", "cite": "Inaugural Lecture (1854)"}
        ],
        "tags": ["Microbiology", "Medicine", "Vaccines", "Chemistry"]
    },
    "Enrico Fermi": {
        "dates": "1901–1954",
        "birthYear": 1901,
        "summary": "Italian-American physicist and Nobel laureate called the 'architect of the nuclear age', creating the first nuclear reactor (Chicago Pile-1) and Fermi-Dirac statistics.",
        "keyWorks": ["Chicago Pile-1 (First Nuclear Reactor)", "Fermi-Dirac Statistics", "Fermi Paradox"],
        "quote": {"text": "There are two possible outcomes: if the result confirms the hypothesis, then you've made a measurement. If the result is contrary to the hypothesis, then you've made a discovery.", "cite": "Enrico Fermi"},
        "quotes": [
            {"text": "Where is everybody?", "cite": "The Fermi Paradox"}
        ],
        "tags": ["Physics", "Nuclear Physics", "Quantum Mechanics", "Nobel Prize"]
    },
    "Émile Durkheim": {
        "dates": "1858–1917",
        "birthYear": 1858,
        "summary": "French sociologist who formally established modern sociology as an academic discipline, pioneering quantitative social science and structural functionalism.",
        "keyWorks": ["The Division of Labour in Society", "Suicide: A Study in Sociology", "The Elementary Forms of Religious Life"],
        "quote": {"text": "Social phenomena are things and must be treated as things.", "cite": "The Rules of Sociological Method"},
        "quotes": [
            {"text": "Social phenomena are things and must be treated as things.", "cite": "The Rules of Sociological Method"}
        ],
        "tags": ["Sociology", "Social Science", "Functionalism", "Philosophy"]
    },
    "Ibn Khaldun": {
        "dates": "1332–1406",
        "birthYear": 1332,
        "summary": "14th-century Arab polymath regarded as a founding father of sociology, historiography, demography, and economics, famous for his concept of social cohesion (Asabiyyah).",
        "keyWorks": ["The Muqaddimah (Introduction to History)", "Kitab al-Ibar", "Concept of Asabiyyah (Social Cohesion)"],
        "quote": {"text": "He who finds a new path is a trailblazer, even if the trail is beaten by others later.", "cite": "The Muqaddimah"},
        "quotes": [
            {"text": "Throughout history many nations have suffered a physical defeat, but that has never marked the end of a nation. But when a nation has become the victim of a psychological defeat, then that marks the end of a nation.", "cite": "The Muqaddimah"}
        ],
        "tags": ["Sociology", "Historiography", "Economics", "Philosophy", "Islamic Golden Age"]
    },
    "Avicenna (Ibn Sina)": {
        "dates": "980–1037",
        "birthYear": 980,
        "summary": "Persian polymath of the Islamic Golden Age whose medical compendium 'The Canon of Medicine' served as the standard European and Islamic textbook for centuries.",
        "keyWorks": ["The Canon of Medicine (Al-Qanun fi al-Tibb)", "The Book of Healing (Kitab al-Shifa)", "Floating Man Thought Experiment"],
        "quote": {"text": "The knowledge of anything, since all things have causes, is not complete or even known unless we know it by its causes.", "cite": "Avicenna"},
        "quotes": [
            {"text": "Medicine is the science by which we learn the various states of the human body, in health, when not in health, and the means by which health is restored.", "cite": "The Canon of Medicine"}
        ],
        "tags": ["Medicine", "Philosophy", "Metaphysics", "Islamic Golden Age"]
    },
    "Thomas Sankara": {
        "dates": "1949–1987",
        "birthYear": 1949,
        "summary": "Burkinabé military officer, Marxist revolutionary, and Pan-Africanist President of Burkina Faso who led sweeping social, agrarian, and feminist anti-imperialist reforms.",
        "keyWorks": ["Renaming Upper Volta to Burkina Faso ('Land of Incorruptible People')", "Nationwide Literacy and Reforestation Campaigns", "Women's Liberation Policies"],
        "quote": {"text": "While revolutionaries as individuals can be murdered, you cannot kill ideas.", "cite": "Speech in Harlem (1984)"},
        "quotes": [
            {"text": "He who feeds you, controls you.", "cite": "Thomas Sankara"}
        ],
        "tags": ["Pan-Africanism", "Politics", "Anti-Imperialism", "Revolution", "Africa"]
    },
    "Kwame Nkrumah": {
        "dates": "1909–1972",
        "birthYear": 1909,
        "summary": "Ghanaian political leader who led the Gold Coast to independence as Ghana in 1957, serving as its first president and championing African unity and Pan-Africanism.",
        "keyWorks": ["Africa Must Unite", "Neo-Colonialism: The Last Stage of Imperialism", "Consciencism"],
        "quote": {"text": "We face neither East nor West; we face forward.", "cite": "Kwame Nkrumah"},
        "quotes": [
            {"text": "Divided we are weak; united, Africa could become one of the greatest forces for good in the world.", "cite": "Africa Must Unite"}
        ],
        "tags": ["Pan-Africanism", "Decolonization", "Politics", "Ghana", "Africa"]
    },
    "Cicero": {
        "dates": "106–43 BCE",
        "birthYear": -106,
        "summary": "Roman statesman, orator, lawyer, and philosopher whose speeches and rhetorical works defined Latin prose and deeply influenced the Renaissance and Enlightenment.",
        "keyWorks": ["De Re Publica (On the Republic)", "De Officiis (On Duties)", "Catiline Orations"],
        "quote": {"text": "If you have a garden and a library, you have everything you need.", "cite": "Letters to Friends"},
        "quotes": [
            {"text": "The safety of the people shall be the supreme law (Salus populi suprema lex esto).", "cite": "De Legibus"}
        ],
        "tags": ["Philosophy", "Rhetoric", "Roman Republic", "Law", "Politics"]
    },
    "Johann Sebastian Bach": {
        "dates": "1685–1750",
        "birthYear": 1685,
        "summary": "German Baroque composer and organist revered as one of the greatest masters of Western counterpoint, harmonic organization, and polyphonic sacred music.",
        "keyWorks": ["The Well-Tempered Clavier", "Mass in B Minor", "Brandenburg Concertos", "St Matthew Passion"],
        "quote": {"text": "There's nothing remarkable about it. All one has to do is hit the right keys at the right time and the instrument plays itself.", "cite": "J.S. Bach"},
        "quotes": [
            {"text": "The aim and final end of all music should be none other than the glory of God and the refreshment of the soul.", "cite": "J.S. Bach"}
        ],
        "tags": ["Music", "Baroque", "Composition", "Counterpoint", "Germany"]
    },
    "Ludwig van Beethoven": {
        "dates": "1770–1827",
        "birthYear": 1770,
        "summary": "German composer and pianist who bridged the Classical and Romantic eras, continuing to compose monumental symphonies, concertos, and quartets after losing his hearing.",
        "keyWorks": ["Symphony No. 9 (Choral / Ode to Joy)", "Symphony No. 5 in C Minor", "Moonlight Sonata (Op. 27, No. 2)"],
        "quote": {"text": "Music is a higher revelation than all wisdom and philosophy.", "cite": "Letter to Bettina von Arnim (1810)"},
        "quotes": [
            {"text": "To play a wrong note is insignificant; to play without passion is inexcusable.", "cite": "Ludwig van Beethoven"}
        ],
        "tags": ["Music", "Classical", "Romanticism", "Symphonies", "Germany"]
    },
    "Linus Torvalds": {
        "dates": "1969–present",
        "birthYear": 1969,
        "summary": "Finnish-American software engineer who created the Linux operating system kernel in 1991 and developed the Git distributed version control system.",
        "keyWorks": ["Linux Operating System Kernel", "Git Distributed Version Control System", "Subsurface Dive Log"],
        "quote": {"text": "Talk is cheap. Show me the code.", "cite": "LKML (2000)"},
        "quotes": [
            {"text": "Talk is cheap. Show me the code.", "cite": "Linux Kernel Mailing List (2000)"},
            {"text": "Most good programmers do programming not because they expect to get paid or get adulation by the public, but because it is fun to program.", "cite": "Just for Fun"}
        ],
        "tags": ["Computer Science", "Open Source", "Linux", "Git", "Software"]
    },
    "Dennis Ritchie": {
        "dates": "1941–2011",
        "birthYear": 1941,
        "summary": "American computer scientist who created the C programming language and co-developed the Unix operating system at Bell Labs, shaping modern computing foundations.",
        "keyWorks": ["C Programming Language", "Unix Operating System", "The C Programming Language (K&R C)"],
        "quote": {"text": "UNIX is basically a simple operating system, but you have to be a genius to understand the simplicity.", "cite": "Dennis Ritchie"},
        "quotes": [
            {"text": "UNIX is basically a simple operating system, but you have to be a genius to understand the simplicity.", "cite": "Dennis Ritchie"}
        ],
        "tags": ["Computer Science", "Programming Languages", "Unix", "C", "Turing Award"]
    },
    "Ken Thompson": {
        "dates": "1943–present",
        "birthYear": 1943,
        "summary": "American pioneer of computer science at Bell Labs who designed and implemented the original Unix operating system, the B language, UTF-8 encoding, and co-created Go.",
        "keyWorks": ["Unix Operating System", "B Programming Language & Bon", "UTF-8 Encoding", "Go Programming Language"],
        "quote": {"text": "You can't trust code that you did not totally create yourself.", "cite": "Reflections on Trusting Trust (Turing Award Lecture, 1984)"},
        "quotes": [
            {"text": "One of my most productive days was throwing away 1,000 lines of code.", "cite": "Ken Thompson"}
        ],
        "tags": ["Computer Science", "Unix", "Operating Systems", "Turing Award", "Go"]
    },
    "Donald Knuth": {
        "dates": "1938–present",
        "birthYear": 1938,
        "summary": "American computer scientist and mathematician celebrated as the 'father of the analysis of algorithms', author of 'The Art of Computer Programming', and creator of TeX.",
        "keyWorks": ["The Art of Computer Programming (Volumes 1-4)", "TeX Digital Typesetting System", "METAFONT Font Design System"],
        "quote": {"text": "Premature optimization is the root of all evil (or at least most of it) in programming.", "cite": "Structured Programming with go to Statements (1974)"},
        "quotes": [
            {"text": "Science is what we understand well enough to explain to a computer. Art is everything else we do.", "cite": "Donald Knuth"}
        ],
        "tags": ["Computer Science", "Algorithms", "TeX", "Typography", "Turing Award"]
    },
    "Richard Stallman": {
        "dates": "1953–present",
        "birthYear": 1953,
        "summary": "American free software movement activist and programmer who launched the GNU Project, founded the Free Software Foundation (FSF), and authored the GNU General Public License (GPL).",
        "keyWorks": ["GNU Project & Free Software Definition", "GNU Emacs Text Editor", "GNU Compiler Collection (GCC)", "GNU General Public License (GPL)"],
        "quote": {"text": "Free software is a matter of liberty, not price. To understand the concept, you should think of 'free' as in 'free speech', not as in 'free beer'.", "cite": "Free Software Foundation"},
        "quotes": [
            {"text": "Sharing is good, and with digital technology, sharing is easy.", "cite": "Richard Stallman"}
        ],
        "tags": ["Free Software", "Open Source", "GNU", "Copyleft", "Programming"]
    },
    "Grace Hopper": {
        "dates": "1906–1992",
        "birthYear": 1906,
        "summary": "American computer scientist and US Navy rear admiral who pioneered computer programming, created the first compiler (A-0), and led the development of COBOL.",
        "keyWorks": ["A-0 Compiler System", "COBOL Programming Language Standards", "Popularized the term 'computer bug'"],
        "quote": {"text": "The most dangerous phrase in the language is, 'We've always done it this way.'", "cite": "Grace Hopper"},
        "quotes": [
            {"text": "It's easier to ask forgiveness than it is to get permission.", "cite": "Grace Hopper"}
        ],
        "tags": ["Computer Science", "Compilers", "COBOL", "US Navy", "Women in STEM"]
    },
    "Tim Berners-Lee": {
        "dates": "1955–present",
        "birthYear": 1955,
        "summary": "English computer scientist who invented the World Wide Web in 1989, implementing HTTP, HTML, URL specifications, and the world's first web browser and web server.",
        "keyWorks": ["World Wide Web (WWW)", "Hypertext Transfer Protocol (HTTP)", "Hypertext Markup Language (HTML)", "W3C Standards"],
        "quote": {"text": "This is for everyone.", "cite": "Tweet during London 2012 Olympic Opening Ceremony"},
        "quotes": [
            {"text": "The Web does not just connect machines, it connects people.", "cite": "Tim Berners-Lee"}
        ],
        "tags": ["Computer Science", "World Wide Web", "Internet", "W3C", "Turing Award"]
    },
    "Edsger W. Dijkstra": {
        "dates": "1930–2002",
        "birthYear": 1930,
        "summary": "Dutch computer scientist who pioneered structured programming, invented the shortest path algorithm, semaphores for concurrent processing, and the THE multiprogramming system.",
        "keyWorks": ["Dijkstra's Shortest Path Algorithm", "Semaphores & Dining Philosophers Problem", "Go To Statement Considered Harmful"],
        "quote": {"text": "Computer science is no more about computers than astronomy is about telescopes.", "cite": "Attributed"},
        "quotes": [
            {"text": "Simplicity is prerequisite for reliability.", "cite": "EWD 498"}
        ],
        "tags": ["Computer Science", "Algorithms", "Concurrency", "Turing Award", "Mathematics"]
    },
    "Guido van Rossum": {
        "dates": "1956–present",
        "birthYear": 1956,
        "summary": "Dutch programmer best known as the creator of the Python programming language, serving as its Benevolent Dictator For Life (BDFL) until 2018.",
        "keyWorks": ["Python Programming Language", "The Zen of Python (Inspiration)", "CPython Reference Implementation"],
        "quote": {"text": "Python is an experiment in how much freedom programmers need. Too much freedom and nobody can read another's code; too little and expressiveness is endangered.", "cite": "Guido van Rossum"},
        "quotes": [
            {"text": "Code is read much more often than it is written.", "cite": "PEP 8 Style Guide"}
        ],
        "tags": ["Computer Science", "Python", "Programming Languages", "Open Source"]
    },
    "Brendan Eich": {
        "dates": "1961–present",
        "birthYear": 1961,
        "summary": "American technologist who created the JavaScript programming language in 10 days at Netscape, co-founded the Mozilla project, and founded the Brave web browser.",
        "keyWorks": ["JavaScript (LiveScript)", "Mozilla Project & Firefox Browser", "Brave Browser & Basic Attention Token"],
        "quote": {"text": "Always bet on JS.", "cite": "Brendan Eich (JSConf, 2011)"},
        "quotes": [
            {"text": "If JavaScript had not resembled Java, it wouldn't have been accepted by Netscape or Sun.", "cite": "Brendan Eich"}
        ],
        "tags": ["Computer Science", "JavaScript", "Web Development", "Browsers", "Open Source"]
    },
    "James Gosling": {
        "dates": "1955–present",
        "birthYear": 1955,
        "summary": "Canadian computer scientist known as the 'Father of Java', who created the original design of Java, its virtual machine (JVM), and its compiler at Sun Microsystems.",
        "keyWorks": ["Java Programming Language", "Java Virtual Machine (JVM)", "Gosling Emacs (Gosmacs)"],
        "quote": {"text": "If you want to write software that's completely secure, don't write software.", "cite": "James Gosling"},
        "quotes": [
            {"text": "Write once, run anywhere.", "cite": "Java Slogan"}
        ],
        "tags": ["Computer Science", "Java", "JVM", "Programming Languages", "Software"]
    },
    "Bjarne Stroustrup": {
        "dates": "1950–present",
        "birthYear": 1950,
        "summary": "Danish computer scientist who created and developed the C++ programming language at Bell Labs, unifying high-level object-oriented abstractions with low-level systems control.",
        "keyWorks": ["C++ Programming Language ('C with Classes')", "The C++ Programming Language Book", "RAII (Resource Acquisition Is Initialization)"],
        "quote": {"text": "There are only two kinds of languages: the ones people complain about and the ones nobody uses.", "cite": "The C++ Programming Language"},
        "quotes": [
            {"text": "C makes it easy to shoot yourself in the foot; C++ makes it harder, but when you do, it blows your whole leg off.", "cite": "Bjarne Stroustrup"}
        ],
        "tags": ["Computer Science", "C++", "Systems Programming", "OOP", "Software"]
    },
    "Anders Hejlsberg": {
        "dates": "1960–present",
        "birthYear": 1960,
        "summary": "Danish software engineer who designed Turbo Pascal, led the creation of Borland Delphi, and was the lead architect of C# and TypeScript at Microsoft.",
        "keyWorks": ["Turbo Pascal", "Borland Delphi", "C# Language Architecture", "TypeScript Open Source Language"],
        "quote": {"text": "Good code is its own best documentation. As you're about to add a comment, ask yourself, 'How can I improve the code so that this comment isn't needed?'", "cite": "Anders Hejlsberg"},
        "quotes": [
            {"text": "TypeScript enables JavaScript developers to use highly productive development tools and practices.", "cite": "Anders Hejlsberg"}
        ],
        "tags": ["Computer Science", "TypeScript", "C#", "Compilers", "Software Engineering"]
    },
    "John Carmack": {
        "dates": "1970–present",
        "birthYear": 1970,
        "summary": "American computer programmer, co-founder of id Software, and 3D graphics engine visionary behind Wolfenstein 3D, Doom, and Quake, as well as aerospace and VR pioneer.",
        "keyWorks": ["Doom & Quake Graphics Engines", "Binary Space Partitioning (BSP) in Games", "Fast Inverse Square Root Optimization"],
        "quote": {"text": "Focused, hard work is the real key to success. Keep your eyes on the goal, and just keep taking the next step towards completing it.", "cite": "John Carmack"},
        "quotes": [
            {"text": "Programming is not a zero-sum game. Teaching something to a fellow programmer doesn't take it away from you.", "cite": "John Carmack"}
        ],
        "tags": ["Computer Science", "Game Development", "3D Graphics", "id Software", "VR"]
    },
    "Fabrice Bellard": {
        "dates": "1972–present",
        "birthYear": 1972,
        "summary": "French virtuoso software programmer and mathematician who created FFmpeg, QEMU machine emulator, TinyCC compiler, and QuickJS engine in solitary tours de force.",
        "keyWorks": ["FFmpeg Multimedia Framework", "QEMU Processor Emulator and Virtualizer", "QuickJS Javascript Engine", "Tiny C Compiler (TCC)"],
        "quote": {"text": "I like to understand how things work under the hood, and the best way to understand is to implement it yourself.", "cite": "Fabrice Bellard"},
        "quotes": [
            {"text": "Simplicity and efficiency are the primary goals of my projects.", "cite": "Fabrice Bellard"}
        ],
        "tags": ["Computer Science", "Open Source", "FFmpeg", "QEMU", "Virtualization"]
    },
    "Margaret Hamilton": {
        "dates": "1936–present",
        "birthYear": 1936,
        "summary": "American computer scientist and systems engineer who directed the Software Engineering Division of the MIT Instrumentation Laboratory, developing flight software for the Apollo space program.",
        "keyWorks": ["Apollo On-Board Flight Software (Apollo 11)", "Coined the term 'Software Engineering'", "Asynchronous Executive Architecture"],
        "quote": {"text": "There was no second chance. We knew that. We had to be right.", "cite": "On Apollo 11 Software"},
        "quotes": [
            {"text": "Software was treated like a stepchild. I began to use the term 'software engineering' to give it the respect of any other engineering discipline.", "cite": "Margaret Hamilton"}
        ],
        "tags": ["Computer Science", "Apollo 11", "NASA", "Software Engineering", "Women in STEM"]
    },
    "Steve Wozniak": {
        "dates": "1950–present",
        "birthYear": 1950,
        "summary": "American electronics engineer and programmer who co-founded Apple Computer and single-handedly designed and built the Apple I and Apple II personal computers.",
        "keyWorks": ["Apple I Microcomputer", "Apple II Personal Computer Architecture", "Disk II Floppy Drive Controller"],
        "quote": {"text": "Never trust a computer you can't throw out a window.", "cite": "Steve Wozniak"},
        "quotes": [
            {"text": "Artists work best alone. Work alone.", "cite": "iWoz"}
        ],
        "tags": ["Hardware", "Personal Computing", "Apple", "Engineering", "Invention"]
    },
    "Leslie Lamport": {
        "dates": "1941–present",
        "birthYear": 1941,
        "summary": "American computer scientist and mathematician who formulated foundational theories of distributed computing, invented Lamport timestamps, the Paxos consensus algorithm, and LaTeX.",
        "keyWorks": ["Paxos Consensus Algorithm", "Lamport Logical Clocks (Time, Clocks, and the Ordering of Events)", "LaTeX Document Preparation System", "TLA+ Formal Specification Language"],
        "quote": {"text": "A distributed system is one in which the failure of a computer you didn't even know existed can render your own computer unusable.", "cite": "Leslie Lamport (1987)"},
        "quotes": [
            {"text": "If you don't start with a spec, every piece of code you write is a bug.", "cite": "Leslie Lamport"}
        ],
        "tags": ["Distributed Systems", "Computer Science", "LaTeX", "Turing Award", "Algorithms"]
    },
    "Barbara Liskov": {
        "dates": "1939–present",
        "birthYear": 1939,
        "summary": "American computer scientist and MIT institute professor whose pioneering work on data abstraction, modularity, and object subtyping established the Liskov Substitution Principle (LSP).",
        "keyWorks": ["Liskov Substitution Principle (LSP)", "CLU Programming Language (Abstract Data Types)", "Argus Distributed Programming Language"],
        "quote": {"text": "Subtypes must be substitutable for their base types without altering the correctness of the program.", "cite": "Liskov Substitution Principle (1987)"},
        "quotes": [
            {"text": "Modularity based on abstraction is the only way to build large, reliable software systems.", "cite": "Turing Award Lecture"}
        ],
        "tags": ["Computer Science", "Software Engineering", "Turing Award", "Women in STEM", "OOP"]
    },
    "Alan Kay": {
        "dates": "1940–present",
        "birthYear": 1940,
        "summary": "American computer scientist who pioneered Object-Oriented Programming, the Smalltalk language, graphical user interface (GUI) desktop environments, and the Dynabook concept.",
        "keyWorks": ["Smalltalk Programming Language", "Dynabook Laptop Concept (1968)", "Overlapping Windows GUI (Xerox PARC)"],
        "quote": {"text": "The best way to predict the future is to invent it.", "cite": "Xerox PARC meeting (1971)"},
        "quotes": [
            {"text": "Simple things should be simple, complex things should be possible.", "cite": "Alan Kay"}
        ],
        "tags": ["Computer Science", "GUI", "Object-Oriented Programming", "Turing Award", "Xerox PARC"]
    },
    "John McCarthy": {
        "dates": "1927–2011",
        "birthYear": 1927,
        "summary": "American computer scientist and cognitive scientist who coined the term 'Artificial Intelligence', created the Lisp programming language, and pioneered time-sharing systems.",
        "keyWorks": ["Lisp Programming Language (1958)", "Coined 'Artificial Intelligence' (1955)", "Garbage Collection & Time-Sharing"],
        "quote": {"text": "As soon as it works, no one calls it AI anymore.", "cite": "John McCarthy"},
        "quotes": [
            {"text": "Lisp is the greatest single programming language ever designed.", "cite": "John McCarthy"}
        ],
        "tags": ["Artificial Intelligence", "Lisp", "Computer Science", "Turing Award"]
    },
    "Aaron Swartz": {
        "dates": "1986–2013",
        "birthYear": 1986,
        "summary": "American programmer, digital rights activist, and writer who co-authored RSS 1.0, co-founded Reddit, built Markdown with John Gruber, and advocated for open access to knowledge.",
        "keyWorks": ["RSS 1.0 Specification", "Markdown Markup Format (Co-designer)", "Creative Commons Architecture", "Guerrilla Open Access Manifesto"],
        "quote": {"text": "Information is power. But like all power, there are those who want to keep it for themselves.", "cite": "Guerilla Open Access Manifesto (2008)"},
        "quotes": [
            {"text": "Be curious. Read widely. Try new things. What people call intelligence just boils down to curiosity.", "cite": "Aaron Swartz"}
        ],
        "tags": ["Open Access", "Internet Freedom", "Computer Science", "Reddit", "Activism"]
    },
    "Satoshi Nakamoto": {
        "dates": "Active 2008–2010",
        "birthYear": 1975,
        "summary": "Pseudonymous software developer who invented Bitcoin, authored the original whitepaper, deployed the first blockchain database, and pioneered decentralized peer-to-peer digital currency.",
        "keyWorks": ["Bitcoin: A Peer-to-Peer Electronic Cash System (Whitepaper)", "Original Bitcoin Core Reference Implementation", "Proof-of-Work Blockchain Consensus"],
        "quote": {"text": "The root problem with conventional currency is all the trust that's required to make it work.", "cite": "P2P Foundation Forum (2009)"},
        "quotes": [
            {"text": "If you don't believe me or don't get it, I don't have time to try to convince you, sorry.", "cite": "Bitcointalk Forum (2010)"}
        ],
        "tags": ["Cryptography", "Bitcoin", "Blockchain", "Economics", "Decentralization"]
    },
    "Jeff Dean": {
        "dates": "1968–present",
        "birthYear": 1968,
        "summary": "American computer scientist and software engineer who co-designed Google's core distributed computing systems, including MapReduce, Bigtable, Spanner, and TensorFlow.",
        "keyWorks": ["MapReduce: Simplified Data Processing on Large Clusters", "Bigtable: A Distributed Storage System for Structured Data", "Spanner: Google's Globally Distributed Database", "TensorFlow Machine Learning Platform"],
        "quote": {"text": "Design for 10x, implement for 5x, re-architect at 10x.", "cite": "Jeff Dean (Building Software Systems at Google)"},
        "quotes": [
            {"text": "Numbers every engineer should know: L1 cache reference (0.5 ns), main memory reference (100 ns), round trip within same datacenter (0.5 ms).", "cite": "Jeff Dean"}
        ],
        "tags": ["Distributed Systems", "Google", "Machine Learning", "Databases", "Cloud"]
    },
    "Alfred Marshall": {
        "dates": "1842–1924",
        "birthYear": 1842,
        "summary": "English economist who was one of the foremost founders of neoclassical economics, synthesizing supply and demand, marginal utility, and costs of production into a coherent framework.",
        "keyWorks": ["Principles of Economics (1890)", "Concept of Price Elasticity of Demand", "Consumer Surplus Theory"],
        "quote": {"text": "Economics is a study of mankind in the ordinary business of life.", "cite": "Principles of Economics"},
        "quotes": [
            {"text": "Nature does not make leaps (Natura non facit saltum).", "cite": "Principles of Economics Epigraph"}
        ],
        "tags": ["Economics", "Neoclassical Economics", "Microeconomics", "Supply & Demand"]
    },
    "Vilfredo Pareto": {
        "dates": "1848–1923",
        "birthYear": 1848,
        "summary": "Italian polymath, engineer, sociologist, and economist who formulated the Pareto efficiency concept in economics and discovered the 80/20 power-law wealth distribution rule (Pareto principle).",
        "keyWorks": ["Pareto Efficiency (Pareto Optimality)", "Pareto Distribution (80/20 Rule)", "Mind and Society (Trattato di sociologia generale)"],
        "quote": {"text": "For many events, roughly 80% of the effects come from 20% of the causes.", "cite": "Cours d'économie politique"},
        "quotes": [
            {"text": "Give me a fruitful error anytime, full of seeds, bursting with its own corrections.", "cite": "Vilfredo Pareto"}
        ],
        "tags": ["Economics", "Sociology", "Pareto Principle", "Optimization", "Italy"]
    },
    "Ronald Coase": {
        "dates": "1910–2013",
        "birthYear": 1910,
        "summary": "British economist and Nobel laureate who established the foundational theory of transaction costs and property rights, formulating the famous Coase Theorem.",
        "keyWorks": ["The Nature of the Firm (1937)", "The Problem of Social Cost (1960)", "Coase Theorem on Transaction Costs"],
        "quote": {"text": "If you torture the data enough, nature will always confess.", "cite": "How Should Economists Choose?"},
        "quotes": [
            {"text": "A firm will tend to expand until the costs of organizing an extra transaction within the firm become equal to the costs of carrying out the same transaction on the open market.", "cite": "The Nature of the Firm"}
        ],
        "tags": ["Economics", "Institutional Economics", "Nobel Prize", "Law and Economics"]
    },
    "Kenneth Arrow": {
        "dates": "1921–2017",
        "birthYear": 1921,
        "summary": "American economist and mathematician who shared the 1972 Nobel Prize, proving Arrow's Impossibility Theorem in social choice and developing General Equilibrium Theory.",
        "keyWorks": ["Social Choice and Individual Values (Arrow's Impossibility Theorem)", "Arrow-Debreu Model of General Equilibrium", "Economics of Information & Healthcare"],
        "quote": {"text": "Most individuals - even the most educated - have an incredible willingness to accept predictions from people who know no more than they do.", "cite": "Kenneth Arrow"},
        "quotes": [
            {"text": "There is no voting system that can convert the ranked preferences of individuals into a community-wide ranking while meeting basic fairness criteria.", "cite": "Arrow's Theorem"}
        ],
        "tags": ["Economics", "Social Choice Theory", "Game Theory", "Nobel Prize", "Mathematics"]
    },
    "Michał Kalecki": {
        "dates": "1899–1970",
        "birthYear": 1899,
        "summary": "Polish Marxist and macroeconomist who independently developed the core foundations of the principle of effective demand and business cycles before John Maynard Keynes.",
        "keyWorks": ["Theory of Economic Dynamics", "Essays in the Theory of Economic Fluctuations", "Political Aspects of Full Employment"],
        "quote": {"text": "Capitalists earn what they spend, and workers spend what they earn.", "cite": "Michał Kalecki"},
        "quotes": [
            {"text": "The discipline in the factories and the political stability would be undermined by continuous full employment.", "cite": "Political Aspects of Full Employment (1943)"}
        ],
        "tags": ["Economics", "Macroeconomics", "Political Economy", "Poland", "Keynesianism"]
    },
    "Ha-Joon Chang": {
        "dates": "1963–present",
        "birthYear": 1963,
        "summary": "South Korean heterodox institutional economist at SOAS University of London who critiques neoliberal free-market orthodoxy through historical economic policy analysis.",
        "keyWorks": ["Kicking Away the Ladder (2002)", "23 Things They Don't Tell You About Capitalism (2010)", "Economics: The User's Guide"],
        "quote": {"text": "95% of economics is common sense made complicated by professional jargon and unnecessary mathematics.", "cite": "Economics: The User's Guide"},
        "quotes": [
            {"text": "Developing countries should look at what rich countries did when they were developing, not what they tell them to do today.", "cite": "Kicking Away the Ladder"}
        ],
        "tags": ["Economics", "Development Economics", "Institutional Economics", "South Korea"]
    },
    "Mariana Mazzucato": {
        "dates": "1968–present",
        "birthYear": 1968,
        "summary": "Italian-American economist and UCL professor known for her groundbreaking theory of public investment and state-driven technological innovation.",
        "keyWorks": ["The Entrepreneurial State: Debunking Public vs. Private Sector Myths", "The Value of Everything: Making and Taking in the Global Economy", "Mission Economy: A Moonshot Guide to Changing Capitalism"],
        "quote": {"text": "From the Internet to biotech and even Siri, almost every major technology in our smartphones was funded by the state before the private sector commercialized it.", "cite": "The Entrepreneurial State"},
        "quotes": [
            {"text": "We must rethink the role of government from market fixer to market shaper.", "cite": "Mission Economy"}
        ],
        "tags": ["Economics", "Innovation", "Public Policy", "Technology", "Political Economy"]
    },
    "Yanis Varoufakis": {
        "dates": "1961–present",
        "birthYear": 1961,
        "summary": "Greek economist, author, game theorist, and former Minister of Finance who analyzes European debt crises, global capitalism, and the rise of cloud-based technofeudalism.",
        "keyWorks": ["Technofeudalism: What Killed Capitalism", "Adults in the Room: My Battle with Europe's Deep Establishment", "The Global Minotaur"],
        "quote": {"text": "Capitalism has mutated into technofeudalism, where cloud capital extract rents directly rather than relying on markets.", "cite": "Technofeudalism (2023)"},
        "quotes": [
            {"text": "I would rather have my arm cut off than sign an unviable bailout agreement.", "cite": "On Greek Debt Negotiations"}
        ],
        "tags": ["Economics", "Political Economy", "Technofeudalism", "Greece", "Game Theory"]
    },
    "David Graeber": {
        "dates": "1961–2020",
        "birthYear": 1961,
        "summary": "American anthropologist, anarchist activist, and author who challenged conventional narratives of money, work, and social hierarchy with seminal anthropological studies.",
        "keyWorks": ["Debt: The First 5,000 Years", "Bullshit Jobs: A Theory", "The Dawn of Everything: A New History of Humanity (with David Wengrow)"],
        "quote": {"text": "The ultimate, hidden truth of the world is that it is something that we make, and could just as easily make differently.", "cite": "The Utopia of Rules"},
        "quotes": [
            {"text": "Huge swathes of people spend their days performing tasks they secretly believe do not really need to be performed.", "cite": "Bullshit Jobs"}
        ],
        "tags": ["Anthropology", "Economics", "Anarchism", "Debt", "Philosophy"]
    },
    "Daron Acemoglu": {
        "dates": "1967–present",
        "birthYear": 1967,
        "summary": "Turkish-American MIT economist and 2024 Nobel laureate whose research demonstrates how inclusive vs extractive political institutions shape long-term national prosperity.",
        "keyWorks": ["Why Nations Fail: The Origins of Power, Prosperity, and Poverty", "Power and Progress: Our Thousand-Year Struggle Over Technology and Prosperity", "Economic Origins of Dictatorship and Democracy"],
        "quote": {"text": "Countries differ in their economic success because of their different institutions, the rules influencing how the economy works, and the incentives that motivate people.", "cite": "Why Nations Fail"},
        "quotes": [
            {"text": "Technological progress is not an inevitable tide that lifts all boats; its path and distribution of gains are shaped by power and choice.", "cite": "Power and Progress"}
        ],
        "tags": ["Economics", "Institutional Economics", "Nobel Prize", "Political Science"]
    },
    "Karl Popper": {
        "dates": "1902–1994",
        "birthYear": 1902,
        "summary": "Austrian-British philosopher of science and political philosopher who introduced empirical falsifiability as the criterion of scientific demarcation and defended liberal democracy.",
        "keyWorks": ["The Logic of Scientific Discovery (Falsificationism)", "The Open Society and Its Enemies", "Conjectures and Refutations"],
        "quote": {"text": "No matter how many instances of white swans we have observed, this does not justify the conclusion that all swans are white.", "cite": "The Logic of Scientific Discovery"},
        "quotes": [
            {"text": "Unlimited tolerance must lead to the disappearance of tolerance (The Paradox of Tolerance).", "cite": "The Open Society and Its Enemies"}
        ],
        "tags": ["Philosophy of Science", "Epistemology", "Political Philosophy", "Open Society"]
    },
    "Thomas Kuhn": {
        "dates": "1922–1996",
        "birthYear": 1922,
        "summary": "American historian and philosopher of science who coined the terms 'paradigm shift' and 'normal science', arguing that scientific progress proceeds via revolutionary ruptures.",
        "keyWorks": ["The Structure of Scientific Revolutions (1962)", "The Copernican Revolution", "The Essential Tension"],
        "quote": {"text": "When the profession can no longer evade anomalies that subvert the existing tradition of scientific practice, then begin the extraordinary investigations that lead the profession to a new set of commitments: a paradigm shift.", "cite": "The Structure of Scientific Revolutions"},
        "quotes": [
            {"text": "Science does not progress via linear accumulation of facts, but through episodic paradigm shifts.", "cite": "Thomas Kuhn"}
        ],
        "tags": ["Philosophy of Science", "History of Science", "Epistemology", "Paradigm Shift"]
    },
    "Paul Feyerabend": {
        "dates": "1924–1994",
        "birthYear": 1924,
        "summary": "Austrian-born philosopher of science renowned for his 'epistemological anarchism', arguing that scientific breakthrough requires methodological freedom ('anything goes').",
        "keyWorks": ["Against Method (1975)", "Science in a Free Society", "Farewell to Reason"],
        "quote": {"text": "The only principle that does not inhibit progress is: anything goes.", "cite": "Against Method"},
        "quotes": [
            {"text": "Science is an essentially anarchic enterprise: theoretical anarchism is more humanitarian and more likely to encourage progress than its law-and-order alternatives.", "cite": "Against Method"}
        ],
        "tags": ["Philosophy of Science", "Epistemology", "Epistemological Anarchism"]
    },
    "Gottlob Frege": {
        "dates": "1848–1925",
        "birthYear": 1848,
        "summary": "German mathematician, logician, and philosopher considered one of the founding fathers of modern mathematical logic and analytic philosophy.",
        "keyWorks": ["Begriffsschrift (Concept-Script, 1879)", "The Foundations of Arithmetic (Die Grundlagen der Arithmetik)", "On Sense and Reference (Über Sinn und Bedeutung)"],
        "quote": {"text": "A judgment is for me not the mere connecting of a subject with a predicate, but the recognition of the truth of a thought.", "cite": "Gottlob Frege"},
        "quotes": [
            {"text": "Never take a description as being the object itself.", "cite": "Gottlob Frege"}
        ],
        "tags": ["Logic", "Analytic Philosophy", "Mathematics", "Philosophy of Language"]
    },
    "Willard Van Orman Quine": {
        "dates": "1908–2000",
        "birthYear": 1908,
        "summary": "American analytic philosopher and logician who dismantled logical positivism with his critiques of the analytic-synthetic distinction and theory of indeterminacy of translation.",
        "keyWorks": ["Two Dogmas of Empiricism (1951)", "Word and Object (1960)", "Ontological Relativity"],
        "quote": {"text": "To be is to be the value of a bound variable.", "cite": "On What There Is (1948)"},
        "quotes": [
            {"text": "Our statements about the external world face the tribunal of sense experience not individually, but only as a corporate body.", "cite": "Two Dogmas of Empiricism"}
        ],
        "tags": ["Analytic Philosophy", "Logic", "Epistemology", "Ontology"]
    },
    "Jürgen Habermas": {
        "dates": "1929–present",
        "birthYear": 1929,
        "summary": "German Frankfurt School philosopher and sociologist celebrated for his theories of communicative rationality, discursive democracy, and the public sphere.",
        "keyWorks": ["The Structural Transformation of the Public Sphere", "The Theory of Communicative Action", "Between Facts and Norms"],
        "quote": {"text": "The unforced force of the better argument is the foundation of democratic legitimacy.", "cite": "The Theory of Communicative Action"},
        "quotes": [
            {"text": "Communicative action relies on a cooperative search for truth.", "cite": "Jürgen Habermas"}
        ],
        "tags": ["Critical Theory", "Frankfurt School", "Sociology", "Democracy", "Philosophy"]
    },
    "Louis Althusser": {
        "dates": "1918–1990",
        "birthYear": 1918,
        "summary": "French structural Marxist philosopher renowned for his theories of ideology, overdetermination, and Ideological State Apparatuses (ISAs).",
        "keyWorks": ["Ideology and Ideological State Apparatuses", "For Marx (Pour Marx)", "Reading Capital (Lire le Capital)"],
        "quote": {"text": "Ideology interpellates individuals as subjects.", "cite": "Ideology and Ideological State Apparatuses"},
        "quotes": [
            {"text": "Philosophy is, in the last instance, class struggle in the field of theory.", "cite": "Louis Althusser"}
        ],
        "tags": ["Marxism", "Structuralism", "Philosophy", "Political Theory", "France"]
    },
    "Giorgio Agamben": {
        "dates": "1942–present",
        "birthYear": 1942,
        "summary": "Italian philosopher whose influential political philosophy investigates the state of exception, biopolitics, and sovereign power over 'bare life' (homo sacer).",
        "keyWorks": ["Homo Sacer: Sovereign Power and Bare Life", "State of Exception", "Remnants of Auschwitz"],
        "quote": {"text": "The state of exception is not a dictatorship, but a space devoid of law, a zone of anomie in which all legal determinations are deactivated.", "cite": "State of Exception"},
        "quotes": [
            {"text": "The camp is the space that is opened when the state of exception begins to become the rule.", "cite": "Homo Sacer"}
        ],
        "tags": ["Philosophy", "Biopolitics", "Political Philosophy", "Italy"]
    },
    "Emmanuel Levinas": {
        "dates": "1906–1995",
        "birthYear": 1906,
        "summary": "Lithuanian-born French phenomenological philosopher who placed ethics as first philosophy, grounded in the immediate and asymmetrical encounter with the Face of the Other.",
        "keyWorks": ["Totality and Infinity: An Essay on Exteriority", "Otherwise than Being or Beyond Essence", "Time and the Other"],
        "quote": {"text": "The Face of the Other in its nakedness presents itself to me as an inescapable demand for responsibility.", "cite": "Totality and Infinity"},
        "quotes": [
            {"text": "Ethics is first philosophy.", "cite": "Emmanuel Levinas"}
        ],
        "tags": ["Ethics", "Phenomenology", "Philosophy", "France"]
    },
    "Augustine of Hippo": {
        "dates": "354–430",
        "birthYear": 354,
        "summary": "Early Christian theologian, philosopher, and bishop of Hippo Regius whose writings on grace, original sin, time, and the City of God shaped Western philosophy and theology.",
        "keyWorks": ["Confessions (Autobiography & Nature of Time)", "The City of God (De Civitate Dei)", "On Christian Doctrine (De Doctrina Christiana)"],
        "quote": {"text": "What then is time? If no one asks me, I know; if I wish to explain it to one who asks, I know not.", "cite": "Confessions (Book XI)"},
        "quotes": [
            {"text": "Thou hast made us for thyself, O Lord, and our heart is restless until it finds its rest in thee.", "cite": "Confessions"}
        ],
        "tags": ["Philosophy", "Theology", "Late Antiquity", "Christianity", "Ethics"]
    },
    "William of Ockham": {
        "dates": "c. 1287–1347",
        "birthYear": 1287,
        "summary": "English Franciscan friar, scholastic philosopher, and theologian whose methodological principle of parsimony ('Occam's Razor') laid foundational groundwork for modern scientific inquiry.",
        "keyWorks": ["Occam's Razor (Lex Parsimoniae)", "Summa Logicae", "Tractatus de Praedestinatione"],
        "quote": {"text": "Entities should not be multiplied beyond necessity.", "cite": "Formulation of Occam's Razor"},
        "quotes": [
            {"text": "It is futile to do with more things that which can be done with fewer.", "cite": "Summa Totius Logicae"}
        ],
        "tags": ["Philosophy", "Scholasticism", "Nominalism", "Logic", "Medieval"]
    },
    "Zhuangzi": {
        "dates": "c. 369–286 BCE",
        "birthYear": -369,
        "summary": "Influential Chinese Taoist philosopher of the Warring States period celebrated for his paradoxical parables, philosophical skepticism, and the butterfly dream paradox.",
        "keyWorks": ["The Zhuangzi (Inner Chapters)", "The Butterfly Dream (Zhuang Zhou Dreams of Being a Butterfly)", "The Butcher Ding Parable (Mastering Wu-Wei)"],
        "quote": {"text": "Once upon a time, I dreamt I was a butterfly, fluttering hither and thither. Suddenly I awoke and there I was, unmistakably Zhuang Zhou. Now I do not know whether I was then a man dreaming I was a butterfly, or whether I am now a butterfly, dreaming I am a man.", "cite": "The Zhuangzi (Chapter 2)"},
        "quotes": [
            {"text": "Happiness is the absence of the striving for happiness.", "cite": "The Zhuangzi"}
        ],
        "tags": ["Taoism", "Chinese Philosophy", "Epistemology", "Metaphysics"]
    },
    "Nagarjuna": {
        "dates": "c. 150–c. 250 CE",
        "birthYear": 150,
        "summary": "Indian Buddhist philosopher regarded as the founder of the Madhyamaka (Middle Way) school, articulating the doctrine of emptiness (Shunyata) and two truths.",
        "keyWorks": ["Mulamadhyamakakarika (Fundamental Verses on the Middle Way)", "Vigrahavyavartani (The Dispeller of Objections)", "Sunyata (Doctrine of Emptiness)"],
        "quote": {"text": "Whatever is dependently co-arisen, that is explained to be emptiness. That, being a dependent designation, is itself the middle way.", "cite": "Mulamadhyamakakarika (24.18)"},
        "quotes": [
            {"text": "Without relying upon the conventional, the ultimate truth cannot be taught.", "cite": "Mulamadhyamakakarika"}
        ],
        "tags": ["Buddhism", "Madhyamaka", "Indian Philosophy", "Epistemology", "Metaphysics"]
    },
    "Mahatma Gandhi": {
        "dates": "1869–1948",
        "birthYear": 1869,
        "summary": "Indian lawyer, anti-colonial nationalist, and political ethicist who led the nationwide campaign for Indian independence through nonviolent civil resistance (Satyagraha).",
        "keyWorks": ["Satyagraha Nonviolent Resistance Strategy", "The Story of My Experiments with Truth", "The Salt March (Dandi March, 1930)"],
        "quote": {"text": "An eye for an eye only ends up making the whole world blind.", "cite": "Attributed to Gandhi"},
        "quotes": [
            {"text": "Be the change that you wish to see in the world.", "cite": "Mahatma Gandhi"}
        ],
        "tags": ["Nonviolence", "Civil Rights", "Decolonization", "India", "Peace"]
    },
    "Julius Caesar": {
        "dates": "100–44 BCE",
        "birthYear": -100,
        "summary": "Roman general, statesman, and dictator whose conquests of Gaul and victory in civil war precipitated the fall of the Roman Republic and emergence of the Roman Empire.",
        "keyWorks": ["Commentarii de Bello Gallico (Gallic Wars)", "Crossing the Rubicon (Alea iacta est)", "Julian Calendar Reform"],
        "quote": {"text": "Veni, vidi, vici (I came, I saw, I conquered).", "cite": "Letter to the Roman Senate (47 BCE)"},
        "quotes": [
            {"text": "The die is cast (Alea iacta est).", "cite": "Crossing the Rubicon (49 BCE)"}
        ],
        "tags": ["Roman Republic", "Military Strategy", "History", "Leadership", "Rome"]
    },
    "Alexander the Great": {
        "dates": "356–323 BCE",
        "birthYear": -356,
        "summary": "King of Macedonia and undefeated military strategist who conquered the Persian Empire, creating an empire spanning three continents and ushering in the Hellenistic era.",
        "keyWorks": ["Conquest of the Achaemenid Persian Empire", "Founding of Alexandria in Egypt", "Battle of Gaugamela & Battle of Issus"],
        "quote": {"text": "There is nothing impossible to him who will try.", "cite": "Alexander the Great"},
        "quotes": [
            {"text": "I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.", "cite": "Alexander the Great"}
        ],
        "tags": ["Ancient Greece", "Military Strategy", "Hellenism", "History", "Macedonia"]
    },
    "Franklin D. Roosevelt": {
        "dates": "1882–1945",
        "birthYear": 1882,
        "summary": "32nd President of the United States who led the nation through the Great Depression with the New Deal reforms and to victory as Allied commander-in-chief in World War II.",
        "keyWorks": ["New Deal Social and Economic Programs", "Fireside Chats", "Four Freedoms Address (1941)"],
        "quote": {"text": "The only thing we have to fear is fear itself.", "cite": "First Inaugural Address (1933)"},
        "quotes": [
            {"text": "Human kindness has never weakened the stamina or softened the fiber of a free people.", "cite": "FDR"}
        ],
        "tags": ["US Presidents", "New Deal", "World War II", "Politics", "Leadership"]
    },
    "Otto von Bismarck": {
        "dates": "1815–1898",
        "birthYear": 1815,
        "summary": "Prussian statesman known as the 'Iron Chancellor' who orchestrated the unification of Germany in 1871 and pioneered modern Realpolitik and the welfare state.",
        "keyWorks": ["Unification of Germany (1871)", "Pioneered Modern Welfare State (Accident & Health Insurance)", "Diplomatic Balance of Power in Europe"],
        "quote": {"text": "The great questions of the day will not be settled by speeches and majority decisions, but by blood and iron.", "cite": "Blood and Iron Speech (1862)"},
        "quotes": [
            {"text": "Politics is the art of the possible, the science of the relative.", "cite": "Otto von Bismarck"}
        ],
        "tags": ["Politics", "Germany", "Realpolitik", "History", "Diplomacy"]
    },
    "Mustafa Kemal Atatürk": {
        "dates": "1881–1938",
        "birthYear": 1881,
        "summary": "Founding father and first President of the secular Republic of Turkey, who transformed a collapsed empire into a modern democratic nation-state through radical reforms.",
        "keyWorks": ["Founding of the Republic of Turkey (1923)", "Adoption of Latin Alphabet & Civil Code", "Universal Secular Education & Women's Suffrage"],
        "quote": {"text": "Peace at home, peace in the world (Yurtta sulh, cihanda sulh).", "cite": "Mustafa Kemal Atatürk (1931)"},
        "quotes": [
            {"text": "Teachers are the one and only people who save nations.", "cite": "Atatürk"}
        ],
        "tags": ["Turkey", "Secularism", "Modernization", "Statesmanship", "Leadership"]
    },
    "Patrice Lumumba": {
        "dates": "1925–1961",
        "birthYear": 1925,
        "summary": "Congolese anti-colonial hero and the first Prime Minister of the independent Democratic Republic of the Congo, whose vision of African self-determination inspired generations.",
        "keyWorks": ["Congolese Independence Speech (1960)", "Mouvement National Congolais Leadership", "Vision of Pan-African Economic Independence"],
        "quote": {"text": "Africa will write its own history, and it will be a history of glory and dignity.", "cite": "Letter to Pauline Lumumba (1961)"},
        "quotes": [
            {"text": "No brute force, cruelty, or torture has ever brought me to ask for mercy, for I prefer to die with my head held high, with unwavering faith and profound trust in the destiny of my country.", "cite": "Patrice Lumumba"}
        ],
        "tags": ["Decolonization", "Pan-Africanism", "Congo", "Anti-Imperialism", "Africa"]
    },
    "Cyrus the Great": {
        "dates": "c. 600–530 BCE",
        "birthYear": -600,
        "summary": "Founder of the Achaemenid Persian Empire whose governance pioneered cultural tolerance, local autonomy, and an early charter of human rights via the Cyrus Cylinder.",
        "keyWorks": ["The Cyrus Cylinder (Early Human Rights Charter)", "Liberation of the Jewish Exiles from Babylon", "Establishment of the Achaemenid Persian Empire"],
        "quote": {"text": "Diversity in counsel, unity in command.", "cite": "Cyropaedia (Xenophon)"},
        "quotes": [
            {"text": "I am Cyrus, king of the universe, the great king, the powerful king.", "cite": "The Cyrus Cylinder"}
        ],
        "tags": ["Persia", "Ancient History", "Human Rights", "Leadership", "Empire"]
    },
    "Michelangelo": {
        "dates": "1475–1564",
        "birthYear": 1475,
        "summary": "Italian High Renaissance master sculptor, painter, architect, and poet whose works, including David and the Sistine Chapel ceiling, represent the zenith of Western art.",
        "keyWorks": ["Statue of David (1504)", "Sistine Chapel Ceiling & The Last Judgment", "St. Peter's Basilica Dome Architecture", "Pietà"],
        "quote": {"text": "I saw the angel in the marble and carved until I set him free.", "cite": "Michelangelo"},
        "quotes": [
            {"text": "Genius is eternal patience.", "cite": "Michelangelo"}
        ],
        "tags": ["Art", "Renaissance", "Sculpture", "Painting", "Italy"]
    },
    "Pablo Picasso": {
        "dates": "1881–1973",
        "birthYear": 1881,
        "summary": "Spanish painter and sculptor who co-founded the Cubist movement, invented constructed sculpture, and redefined 20th-century visual art with works like Guernica.",
        "keyWorks": ["Guernica (Anti-War Masterpiece, 1937)", "Les Demoiselles d'Avignon (Birth of Cubism, 1907)", "Co-founding Analytical and Synthetic Cubism"],
        "quote": {"text": "Every child is an artist. The problem is how to remain an artist once we grow up.", "cite": "Pablo Picasso"},
        "quotes": [
            {"text": "Art washes away from the soul the dust of everyday life.", "cite": "Pablo Picasso"}
        ],
        "tags": ["Art", "Cubism", "Painting", "Modern Art", "Spain"]
    },
    "Vincent van Gogh": {
        "dates": "1853–1890",
        "birthYear": 1853,
        "summary": "Dutch Post-Impressionist painter whose emotionally expressive brushwork, vivid colors, and dramatic compositions laid the foundations of modern expressionism.",
        "keyWorks": ["The Starry Night (1889)", "Sunflowers Series", "Café Terrace at Night", "Self-Portrait with Bandaged Ear"],
        "quote": {"text": "I dream of painting and then I paint my dream.", "cite": "Letters to Theo van Gogh"},
        "quotes": [
            {"text": "There is nothing more truly artistic than to love people.", "cite": "Vincent van Gogh"}
        ],
        "tags": ["Art", "Post-Impressionism", "Painting", "Netherlands", "Expressionism"]
    },
    "Caravaggio": {
        "dates": "1571–1610",
        "birthYear": 1571,
        "summary": "Italian Baroque painter whose radical naturalism and revolutionary chiaroscuro (dramatic light and shadow) reshaped European painting.",
        "keyWorks": ["The Calling of Saint Matthew", "Judith Beheading Holofernes", "David with the Head of Goliath", "Chiaroscuro Master Technique"],
        "quote": {"text": "All works, no matter what or by whom painted, are nothing but bagatelles and childish trifles unless they are made and painted from life.", "cite": "Caravaggio"},
        "quotes": [
            {"text": "I paint directly from the flesh and the shadow.", "cite": "Caravaggio"}
        ],
        "tags": ["Art", "Baroque", "Chiaroscuro", "Painting", "Italy"]
    },
    "Claude Monet": {
        "dates": "1840–1926",
        "birthYear": 1840,
        "summary": "French painter and foundational master of Impressionism, devoted to capturing the fleeting perceptions of light, weather, and color in the natural landscape.",
        "keyWorks": ["Impression, Sunrise (Coined 'Impressionism', 1872)", "Water Lilies (Nymphéas Series)", "Haystacks & Rouen Cathedral Series"],
        "quote": {"text": "Color is my day-long obsession, joy and torment.", "cite": "Claude Monet"},
        "quotes": [
            {"text": "I would like to paint the way a bird sings.", "cite": "Claude Monet"}
        ],
        "tags": ["Art", "Impressionism", "Painting", "France", "Landscape"]
    },
    "Salvador Dalí": {
        "dates": "1904–1989",
        "birthYear": 1904,
        "summary": "Spanish Surrealist painter renowned for his technical virtuosity, dreamlike bizarre imagery, and iconic melting clocks in 'The Persistence of Memory'.",
        "keyWorks": ["The Persistence of Memory (1931)", "Paranoiac-Critical Method", "Swans Reflecting Elephants"],
        "quote": {"text": "There is only one difference between a madman and me. The madman thinks he is sane. I know I am mad.", "cite": "Diary of a Genius"},
        "quotes": [
            {"text": "Have no fear of perfection - you'll never reach it.", "cite": "Salvador Dalí"}
        ],
        "tags": ["Art", "Surrealism", "Painting", "Spain", "Avant-Garde"]
    },
    "Wolfgang Amadeus Mozart": {
        "dates": "1756–1791",
        "birthYear": 1756,
        "summary": "Austrian composer of the Classical era, widely recognized as one of the greatest musical prodigies in history, composing over 800 works across every musical genre.",
        "keyWorks": ["Requiem in D Minor (K. 626)", "The Marriage of Figaro (Le nozze di Figaro)", "Symphony No. 40 in G Minor", "Don Giovanni"],
        "quote": {"text": "The music is not in the notes, but in the silence between.", "cite": "Mozart"},
        "quotes": [
            {"text": "Neither a lofty degree of intelligence nor imagination nor both together go to the making of genius. Love, love, love, that is the soul of genius.", "cite": "Mozart"}
        ],
        "tags": ["Music", "Classical", "Opera", "Composition", "Austria"]
    },
    "Frédéric Chopin": {
        "dates": "1810–1849",
        "birthYear": 1810,
        "summary": "Polish composer and virtuoso pianist of the Romantic era, known as the 'poet of the piano' for his expressive nocturnes, ballades, polonaises, and études.",
        "keyWorks": ["Nocturnes (Op. 9, No. 2 in E-flat)", "Ballade No. 1 in G Minor (Op. 23)", "Heroic Polonaise in A-flat Major (Op. 53)", "24 Preludes (Op. 28)"],
        "quote": {"text": "Simplicity is the highest goal, achievable when you have overcome all difficulties.", "cite": "Frédéric Chopin"},
        "quotes": [
            {"text": "Time is the best censor, and patience a most excellent teacher.", "cite": "Frédéric Chopin"}
        ],
        "tags": ["Music", "Romanticism", "Piano", "Poland", "Composition"]
    },
    "Miles Davis": {
        "dates": "1926–1991",
        "birthYear": 1926,
        "summary": "American jazz trumpeter, bandleader, and composer who spearheaded nearly every major postwar jazz innovation, including cool jazz, hard bop, modal jazz, and jazz fusion.",
        "keyWorks": ["Kind of Blue (Best-Selling Jazz Album in History, 1959)", "Bitches Brew (Electric Jazz Fusion, 1970)", "Birth of the Cool"],
        "quote": {"text": "Don't play what's there, play what's not there.", "cite": "Miles Davis"},
        "quotes": [
            {"text": "Do not fear mistakes. There are none.", "cite": "Miles Davis"}
        ],
        "tags": ["Music", "Jazz", "Modal Jazz", "Fusion", "Trumpet"]
    },
    "Bob Marley": {
        "dates": "1945–1981",
        "birthYear": 1945,
        "summary": "Jamaican singer, songwriter, and musician who popularized reggae worldwide as a global ambassador for Rastafari, peace, and spiritual resistance against oppression.",
        "keyWorks": ["Exodus (Time Magazine Album of the Century)", "Redemption Song", "One Love / People Get Ready", "Catch a Fire"],
        "quote": {"text": "Emancipate yourselves from mental slavery, none but ourselves can free our minds.", "cite": "Redemption Song (1980)"},
        "quotes": [
            {"text": "One good thing about music, when it hits you, you feel no pain.", "cite": "Trenchtown Rock"}
        ],
        "tags": ["Music", "Reggae", "Pan-Africanism", "Jamaica", "Social Justice"]
    },
    "David Bowie": {
        "dates": "1947–2016",
        "birthYear": 1947,
        "summary": "English singer-songwriter, actor, and musical chameleon whose theatrical reinventions (Ziggy Stardust, Thin White Duke) transformed rock, glam, electronic, and pop culture.",
        "keyWorks": ["The Rise and Fall of Ziggy Stardust and the Spiders from Mars", "'Heroes' (Berlin Trilogy)", "Space Oddity", "Blackstar"],
        "quote": {"text": "Tomorrow belongs to those who can hear it coming.", "cite": "David Bowie"},
        "quotes": [
            {"text": "I don't know where I'm going from here, but I promise it won't be boring.", "cite": "David Bowie (1997)"}
        ],
        "tags": ["Music", "Art Rock", "Glam Rock", "Innovation", "Culture"]
    },
    "Jimi Hendrix": {
        "dates": "1942–1970",
        "birthYear": 1942,
        "summary": "American electric guitarist, singer, and songwriter celebrated as the greatest instrumentalist in the history of rock music, revolutionizing guitar tone and sonic feedback.",
        "keyWorks": ["Are You Experienced (1967)", "Electric Ladyland (1968)", "The Star-Spangled Banner (Live at Woodstock, 1969)"],
        "quote": {"text": "When the power of love overcomes the love of power the world will know peace.", "cite": "Jimi Hendrix"},
        "quotes": [
            {"text": "Music doesn't lie. If there is something to be changed in this world, then it can only happen through music.", "cite": "Jimi Hendrix"}
        ],
        "tags": ["Music", "Electric Guitar", "Psychedelic Rock", "Rock", "Blues"]
    },
    "Stanley Kubrick": {
        "dates": "1928–1999",
        "birthYear": 1928,
        "summary": "American cinematic auteur celebrated for his meticulous technical mastery, groundbreaking visual effects, dark satire, and philosophical inquiries into humanity.",
        "keyWorks": ["2001: A Space Odyssey (1968)", "Dr. Strangelove (1964)", "A Clockwork Orange (1971)", "The Shining (1980)"],
        "quote": {"text": "The most terrifying fact about the universe is not that it is hostile, but that it is indifferent.", "cite": "Interview with Playboy (1968)"},
        "quotes": [
            {"text": "If it can be written, or thought, it can be filmed.", "cite": "Stanley Kubrick"}
        ],
        "tags": ["Cinema", "Directing", "Sci-Fi", "Filmmaking", "Visual Arts"]
    },
    "Akira Kurosawa": {
        "dates": "1910–1998",
        "birthYear": 1910,
        "summary": "Master Japanese film director and screenwriter whose dynamic visual compositions, humanistic storytelling, and cinematic editing revolutionized world cinema.",
        "keyWorks": ["Seven Samurai (Shichinin no Samurai, 1954)", "Rashomon (The Rashomon Effect, 1950)", "Ran (King Lear Adaptation, 1985)", "Ikiru (1952)"],
        "quote": {"text": "In a mad world, only the mad are sane.", "cite": "Ran (1985)"},
        "quotes": [
            {"text": "To be an artist means never to avert one's eyes.", "cite": "Something Like an Autobiography"}
        ],
        "tags": ["Cinema", "Japan", "Filmmaking", "Directing", "Samurai"]
    },
    "Charlie Chaplin": {
        "dates": "1889–1977",
        "birthYear": 1889,
        "summary": "English comic actor, filmmaker, and composer who became a worldwide icon through his screen persona 'The Tramp', creating timeless masterworks of silent comedy and social satire.",
        "keyWorks": ["City Lights (1931)", "Modern Times (1936)", "The Great Dictator (1940 Speech for Humanity)", "The Kid (1921)"],
        "quote": {"text": "A day without laughter is a day wasted.", "cite": "Charlie Chaplin"},
        "quotes": [
            {"text": "You'll find that life is still worthwhile, if you just smile.", "cite": "Charlie Chaplin"}
        ],
        "tags": ["Cinema", "Comedy", "Silent Film", "Satire", "Acting"]
    },
    "Alfred Hitchcock": {
        "dates": "1899–1980",
        "birthYear": 1899,
        "summary": "English filmmaker known as the 'Master of Suspense' who pioneered psychological tension, subjective camera techniques, and cinematic editing in cinema history.",
        "keyWorks": ["Vertigo (1958)", "Psycho (1960)", "Rear Window (1954)", "North by Northwest (1959)"],
        "quote": {"text": "There is no terror in the bang, only in the anticipation of it.", "cite": "Alfred Hitchcock"},
        "quotes": [
            {"text": "Drama is life with the dull bits cut out.", "cite": "Alfred Hitchcock"}
        ],
        "tags": ["Cinema", "Suspense", "Psychological Thriller", "Directing", "Film"]
    },
    "Andrei Tarkovsky": {
        "dates": "1932–1986",
        "birthYear": 1932,
        "summary": "Russian Soviet filmmaker renowned for his poetic, metaphysical vision, long takes, spiritual inquiry, and philosophical approach to cinema as 'sculpting in time'.",
        "keyWorks": ["Stalker (1979)", "Solaris (1972)", "Mirror (Zerkalo, 1975)", "Sculpting in Time (Treatise on Cinema)"],
        "quote": {"text": "A book read by a thousand different people is a thousand different books.", "cite": "Sculpting in Time"},
        "quotes": [
            {"text": "The allocated time span for each scene must breathe with the rhythm of reality.", "cite": "Andrei Tarkovsky"}
        ],
        "tags": ["Cinema", "Soviet Union", "Poetic Cinema", "Philosophy", "Art"]
    },
    "Archimedes": {
        "dates": "c. 287–c. 212 BCE",
        "birthYear": -287,
        "summary": "Ancient Greek mathematician, physicist, engineer, and astronomer of Syracuse, regarded as the greatest scientist of antiquity (buoyancy principle, levers, pi calculation).",
        "keyWorks": ["Archimedes' Principle of Buoyancy", "Approximation of Pi (Method of Exhaustion)", "Archimedes' Screw and Law of the Lever"],
        "quote": {"text": "Give me a place to stand, and a lever long enough, and I will move the world.", "cite": "Archimedes (Pappus of Alexandria)"},
        "quotes": [
            {"text": "Eureka! (I have found it!)", "cite": "Vitruvius (De Architectura)"}
        ],
        "tags": ["Mathematics", "Physics", "Engineering", "Ancient Greece", "Invention"]
    },
    "Jacques Lacan": {
        "dates": "1901–1981",
        "birthYear": 1901,
        "summary": "French psychoanalyst and psychiatrist who reinterpreted Freud through structural linguistics, famous for the mirror stage and the tripartite order of Real, Symbolic, and Imaginary.",
        "keyWorks": ["The Mirror Stage as Formative of the I", "Écrits (1966)", "The Real, the Symbolic, and the Imaginary"],
        "quote": {"text": "The unconscious is structured like a language.", "cite": "The Four Fundamental Concepts of Psychoanalysis"},
        "quotes": [
            {"text": "Desire is the desire of the Other.", "cite": "Jacques Lacan"}
        ],
        "tags": ["Psychoanalysis", "Philosophy", "Structuralism", "Psychology", "France"]
    },
    "Yuri Gagarin": {
        "dates": "1934–1968",
        "birthYear": 1934,
        "summary": "Soviet cosmonaut who became the first human in outer space and the first to orbit the Earth on April 12, 1961 aboard Vostok 1.",
        "keyWorks": ["Vostok 1 Spaceflight (First Human in Space, April 12, 1961)", "First Orbital Spaceflight Around Earth"],
        "quote": {"text": "Poyekhali! (Off we go!)", "cite": "Launch of Vostok 1 (1961)"},
        "quotes": [
            {"text": "Orbiting Earth in the spaceship, I saw how beautiful our planet is. People, let us preserve and increase this beauty, not destroy it!", "cite": "Yuri Gagarin"}
        ],
        "tags": ["Space Exploration", "Aviation", "Cosmonaut", "Soviet Union", "History"]
    },
    "Neil Armstrong": {
        "dates": "1930–2012",
        "birthYear": 1930,
        "summary": "American astronaut and aeronautical engineer who became the first human to walk on the Moon as commander of Apollo 11 on July 20, 1969.",
        "keyWorks": ["Apollo 11 Moon Landing Commander", "First Lunar Surface Extravehicular Activity", "Gemini 8 Spaceflight Command"],
        "quote": {"text": "That's one small step for man, one giant leap for mankind.", "cite": "Stepping onto the Lunar Surface (July 20, 1969)"},
        "quotes": [
            {"text": "Mystery creates wonder and wonder is the basis of man's desire to understand.", "cite": "Neil Armstrong"}
        ],
        "tags": ["Space Exploration", "NASA", "Apollo 11", "Astronaut", "Moon Landing"]
    },
    "Valentina Tereshkova": {
        "dates": "1937–present",
        "birthYear": 1937,
        "summary": "Soviet cosmonaut and engineer who became the first woman to fly in space, piloting Vostok 6 on June 16, 1963 and completing 48 orbits of Earth.",
        "keyWorks": ["Vostok 6 Mission (First Woman in Space, June 16, 1963)", "Completed 48 Earth Orbits (Solo Spaceflight)"],
        "quote": {"text": "Hey sky, take off your hat, I'm on my way!", "cite": "Valentina Tereshkova (at Vostok 6 Launch)"},
        "quotes": [
            {"text": "A bird cannot fly with one wing only. Human space flight cannot develop any further without the active participation of women.", "cite": "Valentina Tereshkova"}
        ],
        "tags": ["Space Exploration", "Cosmonaut", "Women in STEM", "Soviet Union"]
    },
    "Alexei Leonov": {
        "dates": "1934–2019",
        "birthYear": 1934,
        "summary": "Soviet cosmonaut, Air Force general, and artist who conducted the first spacewalk (extravehicular activity) in human history during the Voskhod 2 mission in 1965.",
        "keyWorks": ["First Spacewalk in Human History (Voskhod 2, March 18, 1965)", "Apollo-Soyuz Test Project Commander (1975)"],
        "quote": {"text": "The stars were all around me, sun was blindingly bright, and below was our earth, radiant and serene.", "cite": "On the First Spacewalk"},
        "quotes": [
            {"text": "It was so quiet that I could hear my heart beating.", "cite": "Alexei Leonov"}
        ],
        "tags": ["Space Exploration", "Spacewalk", "Cosmonaut", "Soviet Union", "Aviation"]
    },
    "Sally Ride": {
        "dates": "1951–2012",
        "birthYear": 1951,
        "summary": "American physicist and astronaut who became the first American woman and third woman in space aboard Space Shuttle Challenger (STS-7) in 1983.",
        "keyWorks": ["STS-7 Space Shuttle Challenger Mission (1983)", "Sally Ride Science Education Foundation", "Investigation of Challenger and Columbia Disasters"],
        "quote": {"text": "I didn't feel pressure because I was a woman. The only pressure I felt was to do the job right.", "cite": "Sally Ride"},
        "quotes": [
            {"text": "For some reason, the stars seem brighter from orbit.", "cite": "Sally Ride"}
        ],
        "tags": ["Space Exploration", "NASA", "Physics", "Women in STEM", "Astronaut"]
    },
    "Marcos Pontes": {
        "dates": "1963–present",
        "birthYear": 1963,
        "summary": "Brazilian Air Force pilot and astronaut who became the first Brazilian and first South American in space during the Missão Centenário aboard Soyuz TMA-8 in 2006.",
        "keyWorks": ["Missão Centenário (First South American in Space, 2006)", "Soyuz TMA-8 / ISS Expedition 13", "Brazilian Space Agency & Aeronautics"],
        "quote": {"text": "From up here, there are no borders between countries, only one shared blue home.", "cite": "Marcos Pontes (aboard the ISS, 2006)"},
        "quotes": [
            {"text": "Education is the rocket engine of any society.", "cite": "Marcos Pontes"}
        ],
        "tags": ["Space Exploration", "Astronaut", "Brazil", "Aviation", "Engineering"]
    },
    "Cleopatra VII": {
        "dates": "69–30 BCE",
        "birthYear": -69,
        "summary": "Last active ruler of the Ptolemaic Kingdom of Egypt, renowned for her brilliant political acumen, multilingual diplomacy, and strategic alliances with Julius Caesar and Mark Antony.",
        "keyWorks": ["Preservation of Egyptian Independence against Rome", "Naval Command at the Battle of Actium", "Reorganization of Alexandrian Economy and Trade"],
        "quote": {"text": "I will not be triumphed over.", "cite": "Cleopatra VII"},
        "quotes": [
            {"text": "Age cannot wither her, nor custom stale her infinite variety.", "cite": "Shakespeare (Antony and Cleopatra)"}
        ],
        "tags": ["Ancient Egypt", "Leadership", "Diplomacy", "Hellenism", "History"]
    },
    "Harriet Tubman": {
        "dates": "c. 1822–1913",
        "birthYear": 1822,
        "summary": "American abolitionist, Underground Railroad conductor, Union scout, and suffragist who escaped slavery and courageously led dozens of enslaved people to freedom.",
        "keyWorks": ["Underground Railroad Conductor (Never Lost a Passenger)", "Combahee River Raid (Liberated Over 700 Enslaved People)", "Union Army Spy and Scout"],
        "quote": {"text": "I was the conductor of the Underground Railroad for eight years, and I can say what most conductors can't say — I never ran my train off the track and I never lost a passenger.", "cite": "Harriet Tubman (1896)"},
        "quotes": [
            {"text": "Every great dream begins with a dreamer. Always remember, you have within you the strength, the patience, and the passion to reach for the stars to change the world.", "cite": "Harriet Tubman"}
        ],
        "tags": ["Abolitionism", "Civil Rights", "Underground Railroad", "American History", "Courage"]
    },
    "Rosa Parks": {
        "dates": "1913–2005",
        "birthYear": 1913,
        "summary": "American civil rights activist whose courageous refusal to give up her bus seat in Montgomery, Alabama in 1955 ignited the Montgomery bus boycott and the modern civil rights movement.",
        "keyWorks": ["Montgomery Bus Protest (December 1, 1955)", "Secretary of the Montgomery NAACP Chapter", "Rosa and Raymond Parks Institute for Self Development"],
        "quote": {"text": "People always say that I didn't give up my seat because I was tired, but that isn't true. No, the only tired I was, was tired of giving in.", "cite": "Rosa Parks: My Story"},
        "quotes": [
            {"text": "Each person must live their life as a model for others.", "cite": "Rosa Parks"}
        ],
        "tags": ["Civil Rights", "Equality", "Activism", "American History", "Social Justice"]
    },
    "Rosalind Franklin": {
        "dates": "1920–1958",
        "birthYear": 1920,
        "summary": "English chemist and X-ray crystallographer whose famous 'Photo 51' was critical to uncovering the double-helix structure of DNA, alongside pioneering work on viruses and coal.",
        "keyWorks": ["Photo 51 (X-ray Diffraction Image of DNA)", "Discovery of DNA B-Form Helix", "Structure of Tobacco Mosaic Virus (TMV)"],
        "quote": {"text": "Science and everyday life cannot and should not be separated.", "cite": "Rosalind Franklin"},
        "quotes": [
            {"text": "In my view, all that is necessary for faith is the belief that by doing our best we shall come nearer to success and that success in our aim (the improvement of mankind) will be worth the effort.", "cite": "Letter to her father (1940)"}
        ],
        "tags": ["Biochemistry", "DNA", "X-ray Crystallography", "Women in STEM", "Genetics"]
    },
    "Dandara dos Palmares": {
        "dates": "c. 1654–1694",
        "birthYear": 1654,
        "summary": "Afro-Brazilian warrior and military strategist of Quilombo dos Palmares who fought fiercely against Portuguese colonial forces to defend freedom and autonomy for escaped enslaved people.",
        "keyWorks": ["Military Defense of Quilombo dos Palmares", "Rejection of the Conditional Treaty of Cucaú", "Icon of Afro-Brazilian Resistance and Feminism"],
        "quote": {"text": "Freedom is non-negotiable; suicide before enslavement.", "cite": "Oral Tradition of Palmares"},
        "quotes": [
            {"text": "She preferred death over the return to captivity, leaping to freedom at Serra da Barriga.", "cite": "Historical accounts of Palmares"}
        ],
        "tags": ["Brazil", "Quilombo dos Palmares", "Afro-Brazilian History", "Resistance", "Freedom"]
    },
    "Anita Garibaldi": {
        "dates": "1821–1849",
        "birthYear": 1821,
        "summary": "Brazilian revolutionary known as the 'Heroine of the Two Worlds', who fought alongside Giuseppe Garibaldi in the Ragamuffin War in southern Brazil and the battles for Italian unification.",
        "keyWorks": ["Ragamuffin War (Guerra dos Farrapos, Brazil)", "Defense of the Roman Republic (1849, Italy)", "Legendary Equestrian Fighter and Strategist"],
        "quote": {"text": "I was born to fight for liberty, and where there is freedom to be won, there is my homeland.", "cite": "Attributed to Anita Garibaldi"},
        "quotes": [
            {"text": "Heroine of the Two Worlds, fearless warrior across South America and Italy.", "cite": "Giuseppe Garibaldi's Memoirs"}
        ],
        "tags": ["Brazil", "Italy", "Revolution", "History", "Women in War"]
    }
}
