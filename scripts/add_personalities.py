import os
from bs4 import BeautifulSoup
import re

new_personalities = [
    {
        "name": "Gilberto Freyre",
        "dates": "1900-1987",
        "birth_year": "1900",
        "summary": "Brazilian sociologist, anthropologist, and historian, widely known for his book 'The Masters and the Slaves'.",
        "keywords": "sociology anthropology brazil",
        "works": "The Masters and the Slaves",
        "quotes": "",
        "img": "/images/personalities/gilberto_freyre_portrait.jpg"
    },
    {
        "name": "Guimarães Rosa",
        "dates": "1908-1967",
        "birth_year": "1908",
        "summary": "Brazilian novelist and diplomat, considered one of the greatest writers of 20th-century literature.",
        "keywords": "literature brazil novel",
        "works": "The Devil to Pay in the Backlands (Grande Sertão: Veredas)",
        "quotes": "",
        "img": "/images/personalities/guimaraes_rosa_portrait.jpg"
    },
    {
        "name": "Euclides da Cunha",
        "dates": "1866-1909",
        "birth_year": "1866",
        "summary": "Brazilian journalist, sociologist and engineer. Author of 'Os Sertões'.",
        "keywords": "journalism sociology brazil",
        "works": "Os Sertões (Rebellion in the Backlands)",
        "quotes": "",
        "img": "/images/personalities/euclides_da_cunha_portrait.jpg"
    },
    {
        "name": "Carlos Chagas",
        "dates": "1878-1934",
        "birth_year": "1878",
        "summary": "Brazilian sanitary physician, scientist, and bacteriologist who discovered Chagas disease.",
        "keywords": "medicine science biology brazil",
        "works": "Discovery of Chagas Disease",
        "quotes": "",
        "img": "/images/personalities/carlos_chagas_portrait.jpg"
    },
    {
        "name": "Oswaldo Cruz",
        "dates": "1872-1917",
        "birth_year": "1872",
        "summary": "Brazilian physician, bacteriologist, epidemiologist and public health officer.",
        "keywords": "medicine public health brazil",
        "works": "Eradication of Yellow Fever in Rio de Janeiro",
        "quotes": "",
        "img": "/images/personalities/oswaldo_cruz_portrait.jpg"
    },
    {
        "name": "Heitor Villa-Lobos",
        "dates": "1887-1959",
        "birth_year": "1887",
        "summary": "Brazilian composer, conductor, cellist, and classical guitarist described as 'the single most significant creative figure in 20th-century Brazilian art music'.",
        "keywords": "music classical brazil composer",
        "works": "Bachianas Brasileiras",
        "quotes": "",
        "img": "/images/personalities/heitor_villa_lobos_portrait.jpg"
    },
    {
        "name": "Chico Buarque",
        "dates": "1944-present",
        "birth_year": "1944",
        "summary": "Brazilian singer-songwriter, guitarist, composer, playwright, writer, and poet.",
        "keywords": "music mpb brazil literature",
        "works": "Construção",
        "quotes": "",
        "img": "/images/personalities/chico_buarque_portrait.jpg"
    },
    {
        "name": "Caetano Veloso",
        "dates": "1942-present",
        "birth_year": "1942",
        "summary": "Brazilian composer, singer, guitarist, writer, and political activist. Pioneer of the Tropicália movement.",
        "keywords": "music tropicalia brazil",
        "works": "Tropicália",
        "quotes": "",
        "img": "/images/personalities/caetano_veloso_portrait.jpg"
    },
    {
        "name": "Gilberto Gil",
        "dates": "1942-present",
        "birth_year": "1942",
        "summary": "Brazilian singer, guitarist, and songwriter, known for both his musical innovation and political commitment.",
        "keywords": "music tropicalia brazil",
        "works": "Expresso 2222",
        "quotes": "",
        "img": "/images/personalities/gilberto_gil_portrait.jpg"
    },
    {
        "name": "Pedro Alvares Cabral",
        "dates": "c. 1467-c. 1520",
        "birth_year": "1467",
        "summary": "Portuguese nobleman, military commander, navigator and explorer regarded as the European discoverer of Brazil.",
        "keywords": "exploration portugal brazil",
        "works": "Discovery of Brazil (1500)",
        "quotes": "",
        "img": "/images/personalities/pedro_alvares_cabral_portrait.jpg"
    },
    {
        "name": "António de Oliveira Salazar",
        "dates": "1889-1970",
        "birth_year": "1889",
        "summary": "Portuguese dictator who served as President of the Council of Ministers, heading the Estado Novo regime.",
        "keywords": "politics portugal estado novo",
        "works": "Estado Novo",
        "quotes": "",
        "img": "/images/personalities/salazar_portrait.jpg"
    },
    {
        "name": "Erasmus of Rotterdam",
        "dates": "1466-1536",
        "birth_year": "1466",
        "summary": "Dutch philosopher and Christian scholar who is widely considered to have been one of the greatest scholars of the northern Renaissance.",
        "keywords": "philosophy renaissance humanism",
        "works": "The Praise of Folly",
        "quotes": "",
        "img": "/images/personalities/erasmus_portrait.jpg"
    },
    {
        "name": "Maximilien Robespierre",
        "dates": "1758-1794",
        "birth_year": "1758",
        "summary": "French lawyer and statesman who became one of the best-known, influential and controversial figures of the French Revolution.",
        "keywords": "french revolution politics",
        "works": "Reign of Terror",
        "quotes": "",
        "img": "/images/personalities/robespierre_portrait.jpg"
    },
    {
        "name": "Jacques Pierre Brissot",
        "dates": "1754-1793",
        "birth_year": "1754",
        "summary": "Leading member of the Girondins during the French Revolution and founder of the abolitionist Society of the Friends of the Blacks.",
        "keywords": "french revolution girondin politics",
        "works": "Le Patriote français",
        "quotes": "",
        "img": "/images/personalities/brissot_portrait.jpg"
    }
]

def add_personalities():
    file_path = 'public/rendered_gallery/personalities.html'
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    grid = soup.find('div', id='personalitiesGrid')
    
    if not grid:
        print("Could not find grid")
        return

    for p in new_personalities:
        # Check if already exists
        if soup.find(attrs={"data-name": p["name"].lower()}):
            print(f"Skipping {p['name']}, already exists.")
            continue
            
        card_html = f'''
    <article class="personality-card" 
             data-birth-year="{p['birth_year']}" 
             data-name="{p['name'].lower()}" 
             data-dates="{p['dates']}" 
             data-summary="{p['summary'].lower()}" 
             data-keywords="{p['keywords']}" 
             data-works="{p['works']}">
      
      <div class="personality-img-wrapper gallery-zoomable" 
           title="Click to view full portrait"
           data-zoom-src="{p['img']}"
           data-zoom-title="{p['name']}"
           data-zoom-caption="{p['dates']} • {p['summary']}">
        <img src="{p['img']}" alt="{p['name']}" loading="lazy" onerror="this.onerror=null;this.src='/images/placeholder-avatar.png';">
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
        
        <div class="personality-meta">
          <div class="meta-section">
            <span class="meta-label">KEY WORKS/IDEAS</span>
            <div class="meta-tags">
              <span class="meta-tag">{p['works']}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
'''
        card_soup = BeautifulSoup(card_html, 'html.parser')
        grid.append(card_soup)
        print(f"Added {p['name']}")
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))

add_personalities()
