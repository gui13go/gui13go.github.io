import re
from bs4 import BeautifulSoup

names = [
    "Gilberto Freyre",
    "Guimarães Rosa",
    "Euclides da Cunha",
    "Carlos Chagas",
    "Oswaldo Cruz",
    "Heitor Villa-Lobos",
    "Chico Buarque",
    "Caetano Veloso",
    "Gilberto Gil",
    "Pedro Alvares Cabral",
    "Salazar - Portugal president",
    "Erasmus",
    "Robespierre",
    "Brissot"
]

file_path = '../frontend/public/rendered_gallery/personalities.html'
with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()
    
soup = BeautifulSoup(html, 'html.parser')
grid = soup.find('div', id='personalitiesGrid')

count = 0
for name in names:
    if soup.find(attrs={"data-name": name.lower()}):
        continue
        
    img = f"/images/personalities/{name.lower().replace(' ', '_').replace('.', '').replace('(', '').replace(')', '')}_portrait.jpg"
    card_html = f'''
<article class="personality-card" 
         data-birth-year="" 
         data-name="{name.lower()}" 
         data-dates="" 
         data-summary="historical figure" 
         data-keywords="" 
         data-works="">
  
  <div class="personality-img-wrapper gallery-zoomable" 
       title="Click to view full portrait"
       data-zoom-src="{img}"
       data-zoom-title="{name}"
       data-zoom-caption="Historical figure">
    <img src="{img}" alt="{name}" loading="lazy" onerror="this.onerror=null;this.src='/images/placeholder-avatar.png';">
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
      <h2 class="personality-name">{name}</h2>
      <span class="personality-dates"></span>
    </div>
    <p class="personality-desc">Historical figure</p>
  </div>
</article>
'''
    card_soup = BeautifulSoup(card_html, 'html.parser')
    grid.append(card_soup)
    count += 1

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))

print(f"Added {count} missing personalities to HTML.")
