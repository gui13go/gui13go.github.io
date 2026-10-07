import json
import re
from bs4 import BeautifulSoup

data_updates = {
    "Gilberto Freyre": {
        "dates": "1900-1987",
        "birthYear": 1900,
        "summary": "Brazilian sociologist, anthropologist and writer, author of 'The Masters and the Slaves'.",
        "quote": {"text": "The past is never completely dead. It's not even past.", "cite": "Gilberto Freyre"},
        "keyWorks": ["The Masters and the Slaves", "The Mansions and the Shanties"],
        "tags": ["sociology", "anthropology", "brazil"]
    },
    "Guimarães Rosa": {
        "dates": "1908-1967",
        "birthYear": 1908,
        "summary": "Brazilian novelist, short story writer and diplomat. Widely regarded as one of the greatest Brazilian writers of the 20th century.",
        "quote": {"text": "Living is a very dangerous business.", "cite": "Guimarães Rosa"},
        "keyWorks": ["The Devil to Pay in the Backlands", "Sagarana"],
        "tags": ["literature", "brazil", "novel"]
    },
    "Euclides da Cunha": {
        "dates": "1866-1909",
        "birthYear": 1866,
        "summary": "Brazilian journalist, sociologist and engineer. His most important work is 'Os Sertões' (Rebellion in the Backlands).",
        "quote": {"text": "The backlander is above all a strong one.", "cite": "Euclides da Cunha"},
        "keyWorks": ["Os Sertões"],
        "tags": ["literature", "journalism", "brazil"]
    },
    "Carlos Chagas": {
        "dates": "1879-1934",
        "birthYear": 1879,
        "summary": "Brazilian sanitary physician, scientist, and bacteriologist who discovered Chagas disease.",
        "quote": {"text": "", "cite": ""},
        "keyWorks": ["Discovery of American trypanosomiasis"],
        "tags": ["medicine", "science", "brazil"]
    },
    "Oswaldo Cruz": {
        "dates": "1872-1917",
        "birthYear": 1872,
        "summary": "Brazilian physician, bacteriologist, epidemiologist and public health officer.",
        "quote": {"text": "", "cite": ""},
        "keyWorks": ["Eradication of yellow fever in Rio de Janeiro"],
        "tags": ["medicine", "public health", "brazil"]
    },
    "Heitor Villa-Lobos": {
        "dates": "1887-1959",
        "birthYear": 1887,
        "summary": "Brazilian composer, conductor, cellist, and classical guitarist described as the single most significant creative figure in 20th-century Brazilian art music.",
        "quote": {"text": "I consider my works as letters that I wrote to posterity without expecting an answer.", "cite": "Heitor Villa-Lobos"},
        "keyWorks": ["Bachianas Brasileiras", "Chôros"],
        "tags": ["music", "composer", "brazil"]
    },
    "Chico Buarque": {
        "dates": "1944-present",
        "birthYear": 1944,
        "summary": "Brazilian singer-songwriter, guitarist, composer, playwright, writer, and poet.",
        "quote": {"text": "To sing is to make life more beautiful.", "cite": "Chico Buarque"},
        "keyWorks": ["Construção", "A Banda", "Budapeste"],
        "tags": ["music", "literature", "brazil"]
    },
    "Caetano Veloso": {
        "dates": "1942-present",
        "birthYear": 1942,
        "summary": "Brazilian composer, singer, guitarist, writer, and political activist. A key figure in the Tropicália movement.",
        "quote": {"text": "I only care about what is not mine.", "cite": "Caetano Veloso"},
        "keyWorks": ["Tropicália", "Transa", "Verdade Tropical"],
        "tags": ["music", "tropicalia", "brazil"]
    },
    "Gilberto Gil": {
        "dates": "1942-present",
        "birthYear": 1942,
        "summary": "Brazilian singer, guitarist, and songwriter, known for both his musical innovation and political activism.",
        "quote": {"text": "Culture is the most profound expression of humanity.", "cite": "Gilberto Gil"},
        "keyWorks": ["Expresso 2222", "Kaya N'Gan Daya"],
        "tags": ["music", "politics", "brazil"]
    },
    "Pedro Alvares Cabral": {
        "dates": "c. 1467-c. 1520",
        "birthYear": 1467,
        "summary": "Portuguese nobleman, military commander, navigator and explorer regarded as the European discoverer of Brazil.",
        "quote": {"text": "", "cite": ""},
        "keyWorks": ["Discovery of Brazil (1500)"],
        "tags": ["exploration", "history", "portugal", "brazil"]
    },
    "Salazar - Portugal president": {
        "name": "António de Oliveira Salazar",
        "dates": "1889-1970",
        "birthYear": 1889,
        "summary": "Portuguese dictator who served as Prime Minister of Portugal from 1932 to 1968.",
        "quote": {"text": "Everything for the Nation, nothing against the Nation.", "cite": "António de Oliveira Salazar"},
        "keyWorks": ["Estado Novo"],
        "tags": ["politics", "history", "portugal"]
    },
    "Erasmus": {
        "dates": "1466-1536",
        "birthYear": 1466,
        "summary": "Dutch philosopher and Catholic theologian who is considered one of the greatest scholars of the northern Renaissance.",
        "quote": {"text": "When I have a little money, I buy books; and if I have any left, I buy food and clothes.", "cite": "Erasmus"},
        "keyWorks": ["The Praise of Folly", "Textus Receptus"],
        "tags": ["philosophy", "renaissance", "theology"]
    },
    "Robespierre": {
        "dates": "1758-1794",
        "birthYear": 1758,
        "summary": "French lawyer and statesman who became one of the best-known and most influential figures of the French Revolution.",
        "quote": {"text": "Terror is only justice prompt, severe and inflexible.", "cite": "Maximilien Robespierre"},
        "keyWorks": ["Reign of Terror", "Declaration of the Rights of Man"],
        "tags": ["politics", "french revolution", "history"]
    },
    "Brissot": {
        "dates": "1754-1793",
        "birthYear": 1754,
        "summary": "Leading member of the Girondist movement during the French Revolution.",
        "quote": {"text": "Property is theft.", "cite": "Jacques Pierre Brissot"},
        "keyWorks": ["Société des Amis des Noirs"],
        "tags": ["politics", "french revolution", "history"]
    },
    "Max Planck": {
        "dates": "1858-1947",
        "birthYear": 1858,
        "summary": "German theoretical physicist whose discovery of energy quanta won him the Nobel Prize in Physics in 1918.",
        "quote": {"text": "Science cannot solve the ultimate mystery of nature.", "cite": "Max Planck"},
        "keyWorks": ["Planck postulate", "Black-body radiation law"],
        "tags": ["physics", "quantum mechanics", "science"]
    },
    "Erwin Schrödinger": {
        "dates": "1887-1961",
        "birthYear": 1887,
        "summary": "Nobel Prize-winning Austrian-Irish physicist who developed a number of fundamental results in quantum theory.",
        "quote": {"text": "The task is not so much to see what no one has yet seen, but to think what nobody has yet thought, about that which everybody sees.", "cite": "Erwin Schrödinger"},
        "keyWorks": ["Schrödinger equation", "Schrödinger's cat"],
        "tags": ["physics", "quantum mechanics", "science"]
    },
    "Werner Heisenberg": {
        "dates": "1901-1976",
        "birthYear": 1901,
        "summary": "German theoretical physicist and one of the key pioneers of quantum mechanics.",
        "quote": {"text": "What we observe is not nature itself, but nature exposed to our method of questioning.", "cite": "Werner Heisenberg"},
        "keyWorks": ["Uncertainty principle", "Matrix mechanics"],
        "tags": ["physics", "quantum mechanics", "science"]
    },
    "James Clerk Maxwell": {
        "dates": "1831-1879",
        "birthYear": 1831,
        "summary": "Scottish mathematician and scientist responsible for the classical theory of electromagnetic radiation.",
        "quote": {"text": "Thoroughly conscious ignorance is the prelude to every real advance in science.", "cite": "James Clerk Maxwell"},
        "keyWorks": ["Maxwell's equations", "Kinetic theory of gases"],
        "tags": ["physics", "electromagnetism", "science"]
    },
    "Michael Faraday": {
        "dates": "1791-1867",
        "birthYear": 1791,
        "summary": "English scientist who contributed to the study of electromagnetism and electrochemistry.",
        "quote": {"text": "Nothing is too wonderful to be true, if it be consistent with the laws of nature.", "cite": "Michael Faraday"},
        "keyWorks": ["Electromagnetic induction", "Faraday's laws of electrolysis"],
        "tags": ["physics", "chemistry", "science"]
    }
}

json_path = '../frontend/public/data/personalities.json'
with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

for p in personalities:
    original_name = p['name']
    if original_name in data_updates:
        update = data_updates[original_name]
        if 'name' in update:
            p['name'] = update['name'] # Update name if mapped (like Salazar)
        p['dates'] = update['dates']
        p['birthYear'] = update['birthYear']
        p['summary'] = update['summary']
        p['zoomCaption'] = update['summary']
        p['quote'] = update['quote']
        p['keyWorks'] = update['keyWorks']
        p['tags'] = update['tags']
        
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(personalities, f, indent=2, ensure_ascii=False)


html_path = '../frontend/public/rendered_gallery/personalities.html'
with open(html_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

for article in soup.find_all('article', class_='personality-card'):
    name_attr = article.get('data-name', '')
    
    # Try to find match in updates
    matched_key = None
    for key in data_updates.keys():
        if key.lower() == name_attr or (name_attr == "salazar - portugal president" and key == "Salazar - Portugal president"):
            matched_key = key
            break
            
    if matched_key:
        update = data_updates[matched_key]
        article['data-birth-year'] = str(update['birthYear']) if update['birthYear'] else ""
        article['data-dates'] = update['dates']
        article['data-summary'] = update['summary']
        article['data-keywords'] = ",".join(update['tags'])
        article['data-works'] = ",".join(update['keyWorks'])
        
        # update inner html
        h2 = article.find('h2', class_='personality-name')
        if h2:
            h2.string = update.get('name', matched_key)
            
        span = article.find('span', class_='personality-dates')
        if span:
            span.string = update['dates']
            
        p = article.find('p', class_='personality-desc')
        if p:
            p.string = update['summary']
            
        wrapper = article.find('div', class_='personality-img-wrapper')
        if wrapper:
            wrapper['data-zoom-title'] = update.get('name', matched_key)
            wrapper['data-zoom-caption'] = update['summary']

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))

print("Personalities updated.")
