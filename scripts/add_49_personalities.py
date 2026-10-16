import json
import os
import re
from bs4 import BeautifulSoup

def sanitize_filename(name):
    clean = name.lower()
    clean = re.sub(r'[àáâãäå]', 'a', clean)
    clean = re.sub(r'[èéêë]', 'e', clean)
    clean = re.sub(r'[ìíîï]', 'i', clean)
    clean = re.sub(r'[òóôõö]', 'o', clean)
    clean = re.sub(r'[ùúûü]', 'u', clean)
    clean = re.sub(r'[ç]', 'c', clean)
    clean = re.sub(r'[ñ]', 'n', clean)
    clean = re.sub(r'[^a-z0-9]+', '_', clean)
    clean = clean.strip('_')
    return f"{clean}_portrait.jpg"

new_entries = [
    # 1. José Bonifácio de Andrada e Silva
    {
        "name": "José Bonifácio de Andrada e Silva",
        "dates": "1763–1838",
        "birthYear": 1763,
        "summary": "Polymath, mineralogist, and 'Patriarch of Independence' who steered Dom Pedro I toward Brazilian sovereignty in 1822 and championed the abolition of slavery.",
        "quote": {
            "text": "Sem liberdade individual não há moralidade nem energia civil; sem ela não há verdadeira riqueza nacional.",
            "cite": "— Representação à Assembleia Geral Constituinte (1823)"
        },
        "keyWorks": ["Representação sobre a Escravatura", "Proclamação de Independência", "Memória Mineralógica"],
        "tags": ["Independência", "Mineralogia", "Abolicionismo", "Império do Brasil"]
    },
    # 2. Duque de Caxias
    {
        "name": "Duque de Caxias",
        "dates": "1803–1880",
        "birthYear": 1803,
        "summary": "Luís Alves de Lima e Silva, Patron of the Brazilian Army, military strategist, and Prime Minister who stabilized the Empire and commanded allied forces in the Paraguayan War.",
        "quote": {
            "text": "Sigam-me os que forem brasileiros!",
            "cite": "— Batalha de Itororó (1868)"
        },
        "keyWorks": ["Comando da Guerra do Paraguai", "Pacificação da Balaiada e Farroupilha", "Presidência do Conselho de Ministros"],
        "tags": ["Exército Brasileiro", "Guerra do Paraguai", "Império", "Militar"]
    },
    # 3. Barão do Rio Branco
    {
        "name": "Barão do Rio Branco",
        "dates": "1845–1912",
        "birthYear": 1845,
        "summary": "José Maria da Silva Paranhos Júnior, Patron of Brazilian Diplomacy, who peacefully defined and secured Brazil's definitive national borders including Acre.",
        "quote": {
            "text": "Em todas as questões de limites em que o Brasil tem tomado parte, o seu propósito constante tem sido buscar soluções pacíficas e honrosas.",
            "cite": "— Barão do Rio Branco"
        },
        "keyWorks": ["Tratado de Petrópolis (Anexação do Acre)", "Arbitramento de Palmas", "Tratado com o Peru e Guianas"],
        "tags": ["Diplomacia", "Itamaraty", "Geopolítica", "Fronteiras"]
    },
    # 4. Joaquim Nabuco
    {
        "name": "Joaquim Nabuco",
        "dates": "1849–1910",
        "birthYear": 1849,
        "summary": "Diplomat, historian, and preeminent parliamentary champion of Brazilian abolitionism, whose foundational writing exposed slavery as the nation's core moral wound.",
        "quote": {
            "text": "A escravidão permanecerá por muito tempo como a característica nacional do Brasil.",
            "cite": "— O Abolicionismo (1883)"
        },
        "keyWorks": ["O Abolicionismo", "Minha Formação", "Um Estadista do Império"],
        "tags": ["Abolicionismo", "Diplomacia", "Literatura", "História"]
    },
    # 5. Rui Barbosa
    {
        "name": "Rui Barbosa",
        "dates": "1849–1923",
        "birthYear": 1849,
        "summary": "Jurist, orator, writer, and 'Eagle of The Hague' who co-authored the 1891 Republican Constitution and defended the sovereign equality of nations at the 1907 Hague Conference.",
        "quote": {
            "text": "De tanto ver triunfar as nulidades, de tanto ver prosperar a desonra, o homem chega a desanimar-se da virtude, a rir-se da honra e a ter vergonha de ser honesto.",
            "cite": "— Discurso no Senado Federal (1914)"
        },
        "keyWorks": ["Constituição de 1891", "Discurso em Haia (Igualdade das Nações)", "Oração aos Moços"],
        "tags": ["Direito", "Constitucionalismo", "Oratória", "República"]
    },
    # 6. Antoni Gaudí
    {
        "name": "Antoni Gaudí",
        "dates": "1852–1926",
        "birthYear": 1852,
        "summary": "Catalan architect and supreme master of Modernisme, whose bio-morphic, organic architecture culminated in Barcelona's monumental Basílica de la Sagrada Família.",
        "quote": {
            "text": "The straight line belongs to men, the curved one to God.",
            "cite": "— Antoni Gaudí"
        },
        "keyWorks": ["Basílica de la Sagrada Família", "Park Güell", "Casa Batlló", "Casa Milà (La Pedrera)"],
        "tags": ["Architecture", "Modernisme", "Catalonia", "Organic Design"]
    },
    # 7. Prudente de Morais
    {
        "name": "Prudente de Morais",
        "dates": "1841–1902",
        "birthYear": 1841,
        "summary": "First civilian President of Brazil (1894–1898), who steered the nation from military dictatorship toward civilian constitutional governance through the War of Canudos.",
        "quote": {
            "text": "A ordem e o trabalho pacífico constituem a aspiração unânime da nação.",
            "cite": "— Mensagem Presidencial ao Congresso Nacional (1895)"
        },
        "keyWorks": ["Consolidação da República Civil", "Pacificação da Revolução Federalista", "Guerra de Canudos"],
        "tags": ["Primeira República", "Presidência", "Direito Constitucional", "Civilismo"]
    },
    # 8. Rodrigues Alves
    {
        "name": "Rodrigues Alves",
        "dates": "1848–1919",
        "birthYear": 1848,
        "summary": "Fifth President of Brazil, celebrated for modernizing Rio de Janeiro, expanding port infrastructure, and backing Oswaldo Cruz in eradicating yellow fever and smallpox.",
        "quote": {
            "text": "A regeneração higiênica e material da capital é a condição primeira para o progresso do Brasil.",
            "cite": "— Diretrizes Presidenciais (1902)"
        },
        "keyWorks": ["Reforma Urbana Pereira Passos", "Reforma Sanitária de Oswaldo Cruz", "Revolva da Vacina"],
        "tags": ["Primeira República", "Urbanismo", "Saúde Pública", "Modernização"]
    },
    # 9. Plínio Salgado
    {
        "name": "Plínio Salgado",
        "dates": "1895–1975",
        "birthYear": 1895,
        "summary": "Writer, journalist, and politician who founded Brazilian Integralism (AIB), leading the largest nationalist-corporatist movement in 1930s Latin America.",
        "quote": {
            "text": "Deus, Pátria e Família.",
            "cite": "— Lema da Ação Integralista Brasileira (1932)"
        },
        "keyWorks": ["Manifesto de Outubro (1932)", "O Estrangeiro", "Psicologia da Revolução"],
        "tags": ["Integralismo", "Nacionalismo", "Política", "Literatura"]
    },
    # 10. Luís Carlos Prestes
    {
        "name": "Luís Carlos Prestes",
        "dates": "1898–1990",
        "birthYear": 1898,
        "summary": "'The Knight of Hope', military rebel who led the 25,000-km march of the Prestes Column across Brazil, and longtime General Secretary of the Brazilian Communist Party (PCB).",
        "quote": {
            "text": "Não há força capaz de desviar a marcha da história quando os povos se levantam em defesa de seus direitos.",
            "cite": "— Luís Carlos Prestes"
        },
        "keyWorks": ["Coluna Prestes", "Intentona Comunista (1935)", "Liderança do Partido Comunista Brasileiro"],
        "tags": ["Comunismo", "Coluna Prestes", "Tenentismo", "Revolução"]
    },
    # 11. Carlos Lacerda
    {
        "name": "Carlos Lacerda",
        "dates": "1914–1977",
        "birthYear": 1914,
        "summary": "Journalist, orator, and Governor of Guanabara ('The Crow') whose fiery anti-communist rhetoric and UDN opposition precipitated Vargas's suicide and the 1964 coup.",
        "quote": {
            "text": "O senhor Getúlio Vargas não deve ser candidato. Se for, não deve ser eleito. Se eleito, não deve tomar posse. Se tomar posse, deve ser deposto.",
            "cite": "— Tribuna da Imprensa (1950)"
        },
        "keyWorks": ["Tribuna da Imprensa", "Governo da Guanabara (Aterro do Flamengo)", "Frente Ampla"],
        "tags": ["UDN", "Jornalismo", "Oratória", "Anticomunismo"]
    },
    # 12. Jânio Quadros
    {
        "name": "Jânio Quadros",
        "dates": "1917–1992",
        "birthYear": 1917,
        "summary": "Populist President of Brazil whose anti-corruption broom campaign, independent foreign policy, and dramatic resignation after seven months plunged the country into crisis.",
        "quote": {
            "text": "Forças terríveis levantam-se contra mim e me intrigam ou infamam.",
            "cite": "— Carta de Renúncia (25 de agosto de 1961)"
        },
        "keyWorks": ["Política Externa Independente", "Condecoração de Che Guevara", "Plano de Estabilização Financeira"],
        "tags": ["Populismo", "Presidência", "Política Externa", "Crise de 1961"]
    },
    # 13. João Goulart
    {
        "name": "João Goulart",
        "dates": "1919–1976",
        "birthYear": 1919,
        "summary": "'Jango', reformist President of Brazil whose proposed 'Reformas de Base' (agrarian, educational, and tax reforms) triggered his overthrow in the 1964 military coup.",
        "quote": {
            "text": "As reformas de base não são uma ameaça ao regime democrático; são a sua única garantia.",
            "cite": "— Comício da Central do Brasil (13 de março de 1964)"
        },
        "keyWorks": ["Reformas de Base", "Estatuto do Trabalhador Rural", "Comício da Central do Brasil"],
        "tags": ["Trabalhismo", "Reformas de Base", "Golpe de 1964", "PTB"]
    },
    # 14. Miguel Arraes
    {
        "name": "Miguel Arraes",
        "dates": "1916–2005",
        "birthYear": 1916,
        "summary": "Governor of Pernambuco and leftist icon who empowered rural workers through literacy programs, minimum wage enforcement, and socialist agrarian organizing.",
        "quote": {
            "text": "O povo pobre deste país não precisa de favor, precisa de justiça e oportunidade.",
            "cite": "— Miguel Arraes"
        },
        "keyWorks": ["Acordo do Campo", "Programa Chapéu de Palha", "Liderança do Partido Socialista Brasileiro (PSB)"],
        "tags": ["Socialismo", "Nordeste", "Trabalhadores Rurais", "Resistência"]
    },
    # 15. Carlos Marighella
    {
        "name": "Carlos Marighella",
        "dates": "1911–1969",
        "birthYear": 1911,
        "summary": "Revolutionary Marxist politician, writer, and guerrilla leader who founded the ALN to fight Brazil's military dictatorship and authored the 'Minimanual of the Urban Guerrilla'.",
        "quote": {
            "text": "Não tive tempo para ter medo.",
            "cite": "— Carlos Marighella"
        },
        "keyWorks": ["Minimanual of the Urban Guerrilla", "Ação Libertadora Nacional (ALN)", "Chamamento ao Povo Brasileiro"],
        "tags": ["Guerrilha Urbana", "Resistência", "Marxismo", "Ditadura Militar"]
    },
    # 16. Tancredo Neves
    {
        "name": "Tancredo Neves",
        "dates": "1910–1985",
        "birthYear": 1910,
        "summary": "Conciliatory statesman and Prime Minister who united the democratic opposition to end 21 years of military rule, elected first civilian President in 1985 before dying on the eve of inauguration.",
        "quote": {
            "text": "A primeira condição para que a democracia viva é que ela seja respeitada pelos democratas.",
            "cite": "— Discurso da Vitória (1985)"
        },
        "keyWorks": ["Aliança Democrática", "Transição Democrática Brasileira", "Primeiro-Ministro no Parlamentarismo (1961)"],
        "tags": ["Redemocratização", "Aliança Democrática", "PMDB", "Nova República"]
    },
    # 17. Ulysses Guimarães
    {
        "name": "Ulysses Guimarães",
        "dates": "1916–1992",
        "birthYear": 1916,
        "summary": "'Senhor Diretas' and President of the 1988 Constituent Assembly who mobilized millions for democratic elections and promulgated Brazil's democratic 'Citizen Constitution'.",
        "quote": {
            "text": "Traidor da Constituição é traidor da Pátria. Conhecemos o caminho do labirinto. Temos ódio à ditadura. Ódio e nojo.",
            "cite": "— Discurso de Promulgação da Constituição de 1988"
        },
        "keyWorks": ["Constituição Cidadã de 1988", "Comando das Diretas Já", "Presidência do PMDB"],
        "tags": ["Constituição de 1988", "Diretas Já", "Democracia", "Cidadania"]
    },
    # 18. Franco Montoro
    {
        "name": "Franco Montoro",
        "dates": "1916–1999",
        "birthYear": 1916,
        "summary": "Jurist, Governor of São Paulo, and founder of the PSDB who championed administrative decentralization, participatory democracy, and the Diretas Já campaign.",
        "quote": {
            "text": "O poder deve descer ao encontro do povo; a verdadeira democracia é a que se constrói no município.",
            "cite": "— Franco Montoro"
        },
        "keyWorks": ["Governo de São Paulo (1983-1987)", "Descentralização Municipal", "Criação do PSDB"],
        "tags": ["Descentralização", "Democracia Participativa", "Diretas Já", "PSDB"]
    },
    # 19. Mario Covas
    {
        "name": "Mario Covas",
        "dates": "1930–2001",
        "birthYear": 1930,
        "summary": "Civil engineer, Mayor and Governor of São Paulo, and stalwart of democratic redemocratization known for unwavering ethical integrity, fiscal rigor, and public investments.",
        "quote": {
            "text": "Não me curvo, não transijo com meus princípios e não fujo da luta.",
            "cite": "— Mario Covas"
        },
        "keyWorks": ["Constituinte de 1988", "Recuperação Financeira de São Paulo", "Fundação do PSDB"],
        "tags": ["Ética Pública", "São Paulo", "Constituinte", "PSDB"]
    },
    # 20. Itamar Franco
    {
        "name": "Itamar Franco",
        "dates": "1930–2011",
        "birthYear": 1930,
        "summary": "President of Brazil (1992–1995) who restored institutional stability following Collor's impeachment and appointed the economic team that designed and implemented the Plano Real.",
        "quote": {
            "text": "O compromisso deste governo é derrotar o dragão da inflação e restaurar a dignidade do salário brasileiro.",
            "cite": "— Itamar Franco"
        },
        "keyWorks": ["Lançamento do Plano Real (1994)", "Estabilização Pós-Impeachment", "Relançamento do Fusca"],
        "tags": ["Plano Real", "Presidência", "Estabilização", "Nova República"]
    },
    # 21. Fernando Henrique Cardoso
    {
        "name": "Fernando Henrique Cardoso",
        "dates": "1931–present",
        "birthYear": 1931,
        "summary": "'FHC', internationally renowned sociologist of Dependency Theory and two-term President of Brazil who ended hyperinflation with the Plano Real and modernized state institutions.",
        "quote": {
            "text": "Não há desenvolvimento autêntico sem estabilidade econômica e sem instituições democráticas sólidas.",
            "cite": "— Fernando Henrique Cardoso"
        },
        "keyWorks": ["Dependência e Desenvolvimento na América Latina", "Plano Real", "Lei de Responsabilidade Fiscal"],
        "tags": ["Sociologia", "Plano Real", "Presidência", "Globalização"]
    },
    # 22. Luiz Inácio Lula da Silva
    {
        "name": "Luiz Inácio Lula da Silva",
        "dates": "1945–present",
        "birthYear": 1945,
        "summary": "Metallurgical labor leader during the ABC strikes, co-founder of the Workers' Party (PT), and three-time President of Brazil recognized for pioneering anti-poverty programs.",
        "quote": {
            "text": "A esperança venceu o medo.",
            "cite": "— Discurso de Posse Presidencial (2003)"
        },
        "keyWorks": ["Programa Bolsa Família", "Fundação do Partido dos Trabalhadores (PT)", "Política Externa Sul-Sul"],
        "tags": ["Sindicalismo", "Programas Sociais", "Presidência", "Trabalhadores"]
    },
    # 23. Enéas Carneiro
    {
        "name": "Enéas Carneiro",
        "dates": "1938–2007",
        "birthYear": 1938,
        "summary": "Cardiologist, mathematician, and founder of PRONA, renowned for fiery 15-second television speeches defending national sovereignty, nuclear deterrence, and state-led industrialism.",
        "quote": {
            "text": "Meu nome é Enéas, 56!",
            "cite": "— Horário Gratuito de Propaganda Eleitoral"
        },
        "keyWorks": ["O Eletrocardiograma (Tratado Médico)", "Um Grande Projeto Nacional", "Fundação do PRONA"],
        "tags": ["Nacionalismo", "Medicina", "Soberania Nacional", "PRONA"]
    },
    # 24. Jorge Ben Jor
    {
        "name": "Jorge Ben Jor",
        "dates": "1939–present",
        "birthYear": 1939,
        "summary": "Musical visionary who fused samba, soul, funk, and bossa nova to invent samba-rock, composing foundational global anthems of Afro-Brazilian cultural pride.",
        "quote": {
            "text": "Moro num país tropical, abençoado por Deus e bonito por natureza.",
            "cite": "— País Tropical (1969)"
        },
        "keyWorks": ["Samba Esquema Novo (1963)", "A Tábua de Esmeralda (1974)", "África Brasil (1976)", "Mas que Nada"],
        "tags": ["Samba-Rock", "Música Brasileira", "Afro-Brasil", "Violão"]
    },
    # 25. Milton Nascimento
    {
        "name": "Milton Nascimento",
        "dates": "1942–present",
        "birthYear": 1942,
        "summary": "'Bituca', transcendent Brazilian vocalist and songwriter whose celestial falsetto and Clube da Esquina collective fused jazz, sacred folk, and Afro-Mineiro polyphony.",
        "quote": {
            "text": "Qualquer maneira de amor vale a pena, qualquer maneira de amor valerá.",
            "cite": "— Paula e Bebeto (1975)"
        },
        "keyWorks": ["Clube da Esquina (1972)", "Minas (1975)", "Geraes (1976)", "Travessia"],
        "tags": ["Clube da Esquina", "MPB", "Voz", "Minas Gerais"]
    },
    # 26. Nikita Khrushchev
    {
        "name": "Nikita Khrushchev",
        "dates": "1894–1971",
        "birthYear": 1894,
        "summary": "Soviet Premier who denounced Stalin's terror in the 'Secret Speech', initiated the cultural Thaw, backed the early Space Race triumphs, and resolved the Cuban Missile Crisis.",
        "quote": {
            "text": "Politicians are the same all over. They promise to build bridges even when there are no rivers.",
            "cite": "— Nikita Khrushchev"
        },
        "keyWorks": ["Secret Speech (On the Cult of Personality)", "Sputnik and Vostok Space Programs", "Cuban Missile Crisis Resolution"],
        "tags": ["Soviet Union", "Cold War", "De-Stalinization", "Space Race"]
    },
    # 27. Leonid Brezhnev
    {
        "name": "Leonid Brezhnev",
        "dates": "1906–1982",
        "birthYear": 1906,
        "summary": "General Secretary who ruled the USSR for 18 years, presiding over military expansion, superpower nuclear parity, the Brezhnev Doctrine, and the era of political stability and economic stagnation.",
        "quote": {
            "text": "When internal and external forces hostile to socialism seek to turn back the development of any socialist country, that becomes not only a problem of the country concerned, but a common problem.",
            "cite": "— The Brezhnev Doctrine (1968)"
        },
        "keyWorks": ["Brezhnev Doctrine", "SALT I and Helsinki Accords", "Superpower Nuclear Parity"],
        "tags": ["Soviet Union", "Cold War", "Brezhnev Doctrine", "Nuclear Strategy"]
    },
    # 28. Vyacheslav Molotov
    {
        "name": "Vyacheslav Molotov",
        "dates": "1890–1986",
        "birthYear": 1890,
        "summary": "Old Bolshevik and Stalin's premier diplomatic negotiator who signed the 1939 Molotov-Ribbentrop Pact and shaped Soviet post-WWII diplomacy, namesaked in the 'Molotov cocktail'.",
        "quote": {
            "text": "Our cause is just. The enemy will be defeated. Victory will be ours.",
            "cite": "— Radio Broadcast on the German Invasion of the USSR (June 22, 1941)"
        },
        "keyWorks": ["Molotov-Ribbentrop Pact (1939)", "Tehran and Yalta Conferences", "Post-War Soviet Diplomacy"],
        "tags": ["Soviet Union", "Diplomacy", "World War II", "Bolshevik"]
    },
    # 29. Lavrentiy Beria
    {
        "name": "Lavrentiy Beria",
        "dates": "1899–1953",
        "birthYear": 1899,
        "summary": "Chief of the Soviet secret police (NKVD) under Stalin who administered the vast Gulag forced-labor system and ruthlessly directed the Soviet atomic bomb project to completion.",
        "quote": {
            "text": "Show me the man and I will find you the crime.",
            "cite": "— Attributed to Lavrentiy Beria"
        },
        "keyWorks": ["Administration of the Soviet Atomic Project", "Leadership of the NKVD", "Post-Stalin Early Reforms"],
        "tags": ["Soviet Union", "NKVD", "Atomic Program", "Stalin Era"]
    },
    # 30. Mikhail Kalashnikov
    {
        "name": "Mikhail Kalashnikov",
        "dates": "1919–2013",
        "birthYear": 1919,
        "summary": "Legendary Russian small-arms designer who invented the AK-47 assault rifle, celebrated for its rugged mechanical simplicity, reliability, and worldwide military impact.",
        "quote": {
            "text": "All that is complex is not useful and all that is useful is simple. This has been my lifetime motto.",
            "cite": "— Mikhail Kalashnikov"
        },
        "keyWorks": ["AK-47 (Avtomat Kalashnikova 1947)", "AKM and AK-74", "PK Machine Gun Series"],
        "tags": ["Military Engineering", "Small Arms", "AK-47", "Soviet Union"]
    },
    # 31. Igor Kurchatov
    {
        "name": "Igor Kurchatov",
        "dates": "1903–1960",
        "birthYear": 1903,
        "summary": "'Father of the Soviet atomic bomb', nuclear physicist who directed the Soviet nuclear weapons project (RDS-1) and built the world's first civilian nuclear power plant at Obninsk.",
        "quote": {
            "text": "The atom should be a worker, not a soldier.",
            "cite": "— Igor Kurchatov"
        },
        "keyWorks": ["Soviet Atomic Bomb (RDS-1, 1949)", "Soviet Hydrogen Bomb (RDS-6s)", "First Civil Nuclear Power Station (Obninsk)"],
        "tags": ["Nuclear Physics", "Atomic Bomb", "Soviet Union", "Clean Energy"]
    },
    # 32. Andrei Sakharov
    {
        "name": "Andrei Sakharov",
        "dates": "1921–1989",
        "birthYear": 1921,
        "summary": "Brilliant theoretical physicist and designer of the Soviet thermonuclear bomb who transformed into an outspoken dissident, defender of human rights, and Nobel Peace laureate.",
        "quote": {
            "text": "Peace, progress, human rights — these three goals are indissolubly linked; it is impossible to achieve one of them if the others are ignored.",
            "cite": "— Nobel Peace Prize Lecture (1975)"
        },
        "keyWorks": ["Soviet Thermonuclear Bomb (Sloika / RDS-37)", "Progress, Coexistence, and Intellectual Freedom", "Nobel Peace Prize (1975)"],
        "tags": ["Nuclear Physics", "Human Rights", "Dissident", "Nobel Peace Prize"]
    },
    # 33. Sergei Korolev
    {
        "name": "Sergei Korolev",
        "dates": "1907–1966",
        "birthYear": 1907,
        "summary": "The anonymous 'Chief Designer' and mastermind of the Soviet space program who launched Sputnik 1, sent Yuri Gagarin into orbit, and inaugurated the human Space Age.",
        "quote": {
            "text": "The way to the stars is open.",
            "cite": "— On the launch of Yuri Gagarin (Vostok 1, 1961)"
        },
        "keyWorks": ["R-7 Semyorka Intercontinental Rocket", "Sputnik 1 (First Artificial Satellite)", "Vostok 1 (First Human in Space)"],
        "tags": ["Space Exploration", "Rocketry", "Sputnik", "Space Age"]
    },
    # 34. Wernher von Braun
    {
        "name": "Wernher von Braun",
        "dates": "1912–1977",
        "birthYear": 1912,
        "summary": "Aerospace engineer and architect of modern rocketry, developing the V-2 rocket in Germany and later designing NASA's Saturn V rocket that propelled humans to the Moon.",
        "quote": {
            "text": "Research is what I'm doing when I don't know what I'm doing.",
            "cite": "— Wernher von Braun"
        },
        "keyWorks": ["Saturn V Apollo Moon Rocket", "Explorer 1 (First US Satellite)", "V-2 Rocket"],
        "tags": ["Aerospace", "Apollo Program", "Moon Landing", "NASA"]
    },
    # 35. Jawaharlal Nehru
    {
        "name": "Jawaharlal Nehru",
        "dates": "1889–1964",
        "birthYear": 1889,
        "summary": "First Prime Minister of independent India, architect of modern Indian democracy, secularism, and public science, and co-founder of the global Non-Aligned Movement.",
        "quote": {
            "text": "At the stroke of the midnight hour, when the world sleeps, India will awake to life and freedom.",
            "cite": "— Tryst with Destiny (August 14, 1947)"
        },
        "keyWorks": ["The Discovery of India", "Glimpses of World History", "Establishment of IITs and Indian Atomic Energy Commission"],
        "tags": ["India", "Non-Aligned Movement", "Democracy", "Post-Colonialism"]
    },
    # 36. Gamal Abdel Nasser
    {
        "name": "Gamal Abdel Nasser",
        "dates": "1918–1970",
        "birthYear": 1918,
        "summary": "Second President of Egypt, charismatic icon of Pan-Arab nationalism and anti-imperialism who nationalized the Suez Canal and built the Aswan High Dam.",
        "quote": {
            "text": "We will not look to the West or the East; we will look forward.",
            "cite": "— Speech on the Nationalization of the Suez Canal (1956)"
        },
        "keyWorks": ["Nationalization of the Suez Canal (1956)", "Aswan High Dam", "Philosophy of the Revolution"],
        "tags": ["Pan-Arabism", "Egypt", "Anti-Imperialism", "Suez Crisis"]
    },
    # 37. Golda Meir
    {
        "name": "Golda Meir",
        "dates": "1898–1978",
        "birthYear": 1898,
        "summary": "Fourth Prime Minister of Israel ('Iron Lady of Israeli Politics') who co-signed Israel's Declaration of Independence and steered the nation through the 1973 Yom Kippur War.",
        "quote": {
            "text": "Peace will come when the Arabs love their children more than they hate us.",
            "cite": "— Attributed to Golda Meir"
        },
        "keyWorks": ["Signatory of the Israeli Declaration of Independence", "Leadership during Yom Kippur War (1973)", "My Life (Autobiography)"],
        "tags": ["Israel", "Middle East", "Diplomacy", "Prime Minister"]
    },
    # 38. Josip Broz Tito
    {
        "name": "Josip Broz Tito",
        "dates": "1892–1980",
        "birthYear": 1892,
        "summary": "Yugoslav communist revolutionary, anti-Nazi Partisan leader, and President who preserved Yugoslav unity and pioneered the Non-Aligned Movement after breaking with Stalin in 1948.",
        "quote": {
            "text": "Stop sending people to kill me! We've already captured five of them... If you don't stop sending killers, I'll send one to Moscow, and I won't have to send another.",
            "cite": "— Letter to Joseph Stalin (1948)"
        },
        "keyWorks": ["Tito-Stalin Split (1948)", "Founding of the Non-Aligned Movement (Belgrade, 1961)", "Worker Self-Management Model"],
        "tags": ["Yugoslavia", "Non-Aligned Movement", "Partisans", "Socialism"]
    },
    # 39. Haile Selassie
    {
        "name": "Haile Selassie",
        "dates": "1892–1975",
        "birthYear": 1892,
        "summary": "Emperor of Ethiopia who modernized his nation, defiantly appealed to the League of Nations against fascist Italian invasion, and became a revered figure in Rastafarianism and Pan-Africanism.",
        "quote": {
            "text": "Until the philosophy which holds one race superior and another inferior is finally and permanently discredited and abandoned, everywhere is war.",
            "cite": "— Address to the United Nations General Assembly (1963)"
        },
        "keyWorks": ["Appeal to the League of Nations (1936)", "Founding of the Organization of African Unity (OAU)", "1931 Constitution of Ethiopia"],
        "tags": ["Ethiopia", "Pan-Africanism", "Anti-Fascism", "Rastafari"]
    },
    # 40. Lech Wałęsa
    {
        "name": "Lech Wałęsa",
        "dates": "1943–present",
        "birthYear": 1943,
        "summary": "Polish shipyard electrician and trade unionist who co-founded Solidarity (Solidarność), spearheading the peaceful collapse of Soviet-backed communism in Eastern Europe.",
        "quote": {
            "text": "We want to build a world where truth and human dignity prevail over fear.",
            "cite": "— Nobel Peace Prize Acceptance Speech (1983)"
        },
        "keyWorks": ["Founding of Solidarność (1980)", "Gdańsk Shipyard Accord", "Presidency of Poland (1990–1995)"],
        "tags": ["Solidarity", "Poland", "Labor Movement", "Nobel Peace Prize"]
    },
    # 41. Paul Dirac
    {
        "name": "Paul Dirac",
        "dates": "1902–1984",
        "birthYear": 1902,
        "summary": "English theoretical physicist and Nobel laureate who united quantum mechanics with special relativity through the Dirac Equation, predicting antimatter and the positron.",
        "quote": {
            "text": "It is more important to have beauty in one's equations than to have them fit experiment.",
            "cite": "— The Evolution of the Physicist's Picture of Nature (1963)"
        },
        "keyWorks": ["The Dirac Equation (Relativistic Quantum Mechanics)", "Prediction of Antimatter (Positron)", "The Principles of Quantum Mechanics"],
        "tags": ["Quantum Mechanics", "Physics", "Antimatter", "Mathematics"]
    },
    # 42. Stephen Hawking
    {
        "name": "Stephen Hawking",
        "dates": "1942–2018",
        "birthYear": 1942,
        "summary": "Theoretical physicist and cosmologist who discovered black hole thermal radiation (Hawking Radiation) and popularized cosmological inquiry through 'A Brief History of Time'.",
        "quote": {
            "text": "Remember to look up at the stars and not down at your feet. However difficult life may seem, there is always something you can do and succeed at.",
            "cite": "— Stephen Hawking"
        },
        "keyWorks": ["Hawking Radiation Theory", "Penrose-Hawking Singularity Theorems", "A Brief History of Time"],
        "tags": ["Cosmology", "Black Holes", "General Relativity", "Quantum Gravity"]
    },
    # 43. Thomas Sowell
    {
        "name": "Thomas Sowell",
        "dates": "1930–present",
        "birthYear": 1930,
        "summary": "Economist, social theorist, and Chicago School scholar renowned for empirical critiques of state economic planning, affirmative action, and social engineering.",
        "quote": {
            "text": "There are no solutions, there are only trade-offs; and you can only try to get the best trade-off you can get.",
            "cite": "— A Conflict of Visions (1987)"
        },
        "keyWorks": ["Basic Economics", "A Conflict of Visions", "Knowledge and Decisions", "Race and Culture"],
        "tags": ["Economics", "Classical Liberalism", "Social Theory", "Chicago School"]
    },
    # 44. Vint Cerf
    {
        "name": "Vint Cerf",
        "dates": "1943–present",
        "birthYear": 1943,
        "summary": "'Father of the Internet', Turing Award laureate who co-designed the TCP/IP protocols and the basic fundamental architecture of the global Internet.",
        "quote": {
            "text": "The Internet is a reflection of our society, and that mirror reflects both the good and the bad.",
            "cite": "— Vint Cerf"
        },
        "keyWorks": ["TCP/IP Protocol Suite (with Bob Kahn)", "ARPANET Architecture", "Internet Governance and Standards"],
        "tags": ["Networking", "TCP/IP", "Internet", "Computer Science"]
    },
    # 45. Larry Page
    {
        "name": "Larry Page",
        "dates": "1973–present",
        "birthYear": 1973,
        "summary": "Computer scientist and entrepreneur who co-founded Google with Sergey Brin, inventing the PageRank algorithm that indexed human knowledge on the World Wide Web.",
        "quote": {
            "text": "Always deliver more than expected. If you're changing the world, you're working on important things.",
            "cite": "— Larry Page"
        },
        "keyWorks": ["PageRank Algorithm", "Founding of Google", "Alphabet Inc."],
        "tags": ["Search Engine", "Algorithms", "Google", "Tech Entrepreneurship"]
    },
    # 46. Sergey Brin
    {
        "name": "Sergey Brin",
        "dates": "1973–present",
        "birthYear": 1973,
        "summary": "Computer scientist and mathematician who co-founded Google with Larry Page, driving data mining, web search infrastructure, and groundbreaking technological moonshots.",
        "quote": {
            "text": "We want Google to be the third half of your brain.",
            "cite": "— Sergey Brin"
        },
        "keyWorks": ["The Anatomy of a Large-Scale Hypertextual Web Search Engine", "Google X Moonshot Division", "Founding of Google"],
        "tags": ["Data Mining", "Algorithms", "Google", "Tech Moonshots"]
    },
    # 47. Terry A. Davis
    {
        "name": "Terry A. Davis",
        "dates": "1969–2018",
        "birthYear": 1969,
        "summary": "Software developer who spent over a decade single-handedly writing TempleOS, an entire 64-bit non-preemptive operating system and compiler built as an homage to Solomon's Temple.",
        "quote": {
            "text": "An elephant is not a fly with more parts. TempleOS is a tiny, beautiful sanctuary.",
            "cite": "— Terry A. Davis"
        },
        "keyWorks": ["TempleOS Operating System (100,000+ lines)", "HolyC Programming Language", "RedSea File System"],
        "tags": ["TempleOS", "Operating Systems", "HolyC", "Systems Programming"]
    },
    # 48. Vitalik Buterin
    {
        "name": "Vitalik Buterin",
        "dates": "1994–present",
        "birthYear": 1994,
        "summary": "Programmer and cryptocurrency researcher who created Ethereum, introducing general-purpose Turing-complete smart contracts and decentralized applications to blockchain technology.",
        "quote": {
            "text": "Blockchain solves the problem of manipulating data. When you look at the cloud, you're trusting a company; when you look at Ethereum, you're trusting math.",
            "cite": "— Vitalik Buterin"
        },
        "keyWorks": ["Ethereum Whitepaper (2013)", "Ethereum Virtual Machine (EVM)", "Proof of Stake Transition (The Merge)"],
        "tags": ["Ethereum", "Smart Contracts", "Cryptocurrency", "Blockchain"]
    },
    # 49. Kurt Cobain
    {
        "name": "Kurt Cobain",
        "dates": "1967–1994",
        "birthYear": 1967,
        "summary": "Singer, guitarist, and primary songwriter of Nirvana, whose visceral melodies and raw angst catalyzed the grunge revolution and defined Generation X counterculture.",
        "quote": {
            "text": "I'd rather be hated for who I am, than loved for who I am not.",
            "cite": "— Kurt Cobain"
        },
        "keyWorks": ["Nevermind (1991)", "In Utero (1993)", "MTV Unplugged in New York", "Smells Like Teen Spirit"],
        "tags": ["Grunge", "Rock", "Alternative Music", "Nirvana"]
    }
]

# 1. Update personalities.json
json_path = 'frontend/public/data/personalities.json'
with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

existing_names = {p['name'].lower() for p in personalities}
added_count = 0

for p in new_entries:
    if p['name'].lower() not in existing_names:
        img_fn = sanitize_filename(p['name'])
        entry = {
            'name': p['name'],
            'dates': p['dates'],
            'birthYear': p['birthYear'],
            'summary': p['summary'],
            'image': f"/images/personalities/{img_fn}",
            'zoomSrc': f"/images/personalities/{img_fn}",
            'zoomTitle': p['name'],
            'zoomCaption': f"{p['dates']} • {p['summary']}",
            'quote': p['quote'],
            'keyWorks': p['keyWorks'],
            'tags': p['tags'],
            'keywords': ' '.join(t.lower() for t in p['tags']) + ' ' + p['name'].lower(),
            'quotes': [p['quote']]
        }
        personalities.append(entry)
        existing_names.add(p['name'].lower())
        added_count += 1

personalities.sort(key=lambda x: x.get('birthYear', 0))

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(personalities, f, indent=2, ensure_ascii=False)

print(f"Added {added_count} personalities to JSON (Total: {len(personalities)})")

# 2. Update personalities.html
html_path = 'frontend/public/rendered_gallery/personalities.html'
with open(html_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

grid = soup.find('div', id='personalitiesGrid')
html_added = 0

for p in new_entries:
    data_name = p['name'].lower()
    if not soup.find(attrs={'data-name': data_name}):
        img_fn = sanitize_filename(p['name'])
        img_base = os.path.splitext(img_fn)[0]
        card_html = f'''
<article class="personality-card" 
         data-birth-year="{p['birthYear']}" 
         data-name="{data_name}" 
         data-dates="{p['dates']}" 
         data-summary="{p['summary']}" 
         data-keywords="{','.join(p['tags'])}" 
         data-works="{','.join(p['keyWorks'])}">
  
  <div class="personality-img-wrapper gallery-zoomable" 
       title="Click to view full portrait"
       data-zoom-src="/images/personalities/{img_fn}"
       data-zoom-title="{p['name']}"
       data-zoom-caption="{p['summary']}">
    <picture>
      <source srcset="/images/personalities/{img_base}.avif" type="image/avif">
      <source srcset="/images/personalities/{img_base}.webp" type="image/webp">
      <img src="/images/personalities/{img_fn}" alt="{p['name']}" loading="lazy" onerror="this.onerror=null;this.src='/images/personalities/placeholder-avatar.png';">
    </picture>
    <div class="personality-img-overlay">
      <svg class="zoom-indicator-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="11" y1="8" x2="11" y2="14"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
      </svg>
    </div>
  </div>
  
  <div class="personality-info">
    <div class="personality-header">
      <h2 class="personality-name">{p['name']}</h2>
      <span class="personality-dates">{p['dates']}</span>
    </div>
    <p class="personality-desc">{p['summary']}</p>
  </div>
</article>
'''
        grid.append(BeautifulSoup(card_html, 'html.parser'))
        html_added += 1

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))

print(f"Added {html_added} cards to HTML!")
