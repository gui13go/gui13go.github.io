import re
from bs4 import BeautifulSoup
import os

with open('../NOTES.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_personalities = []
for line in lines[39:510]:
    line = line.strip()
    if not line: continue
    
    name = ""
    summary = ""
    if "—" in line:
        parts = line.split("—", 1)
        name = parts[0].strip()
        summary = parts[1].strip()
    elif "-" in line:
        parts = line.split("-", 1)
        name = parts[0].strip()
        summary = parts[1].strip()
    else:
        name = line
        summary = "Historical figure"

    if name:
        new_personalities.append({
            "name": name,
            "dates": "",
            "birth_year": "",
            "summary": summary,
            "keywords": "",
            "works": "",
            "img": f"/images/personalities/{name.lower().replace(' ', '_').replace('.', '').replace('(', '').replace(')', '')}_portrait.jpg"
        })

file_path = '../frontend/public/rendered_gallery/personalities.html'
with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()
    
soup = BeautifulSoup(html, 'html.parser')
grid = soup.find('div', id='personalitiesGrid')

count = 0
for p in new_personalities:
    if soup.find(attrs={"data-name": p["name"].lower()}):
        continue
        
    card_html = f'''
<article class="personality-card" 
         data-birth-year="" 
         data-name="{p['name'].lower()}" 
         data-dates="" 
         data-summary="{p['summary'].lower()}" 
         data-keywords="" 
         data-works="">
  
  <div class="personality-img-wrapper gallery-zoomable" 
       title="Click to view full portrait"
       data-zoom-src="{p['img']}"
       data-zoom-title="{p['name']}"
       data-zoom-caption="{p['summary']}">
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
      <span class="personality-dates"></span>
    </div>
    <p class="personality-desc">{p['summary']}</p>
  </div>
</article>
'''
    card_soup = BeautifulSoup(card_html, 'html.parser')
    grid.append(card_soup)
    count += 1

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))

print(f"Added {count} new personalities.")
