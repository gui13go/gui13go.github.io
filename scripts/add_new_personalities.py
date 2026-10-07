import json
from bs4 import BeautifulSoup

names = ["jackie chan", "gustavo kuerten"]
data = {
    "jackie chan": {
        "name": "Jackie Chan",
        "dates": "1954-present",
        "birthYear": 1954,
        "summary": "Hong Kong actor, director, martial artist, and stuntman known for his acrobatic fighting style and innovative stunts.",
        "quote": {"text": "I never wanted to be the next Bruce Lee. I just wanted to be the first Jackie Chan.", "cite": "Jackie Chan"},
        "keyWorks": ["Police Story", "Rush Hour", "Drunken Master"],
        "tags": ["cinema", "martial arts", "actor"]
    },
    "gustavo kuerten": {
        "name": "Gustavo Kuerten",
        "dates": "1976-present",
        "birthYear": 1976,
        "summary": "Brazilian former world No. 1 tennis player and three-time French Open champion.",
        "quote": {"text": "You can't play tennis if you're not having fun.", "cite": "Gustavo Kuerten"},
        "keyWorks": ["Three-time French Open champion", "World No. 1 (2000)"],
        "tags": ["sports", "tennis", "brazil"]
    }
}

json_path = '../frontend/public/data/personalities.json'
with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

for name in names:
    if not any(p['name'].lower() == name.lower() for p in personalities):
        p_data = data[name.lower()]
        img_filename = f"{name.lower().replace(' ', '_')}_portrait.jpg"
        new_p = {
            "name": p_data["name"],
            "dates": p_data["dates"],
            "birthYear": p_data["birthYear"],
            "summary": p_data["summary"],
            "image": f"/images/personalities/{img_filename}",
            "zoomSrc": f"/images/personalities/{img_filename}",
            "zoomTitle": p_data["name"],
            "zoomCaption": p_data["summary"],
            "quote": p_data["quote"],
            "keyWorks": p_data["keyWorks"],
            "tags": p_data["tags"]
        }
        personalities.append(new_p)

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(personalities, f, indent=2, ensure_ascii=False)


html_path = '../frontend/public/rendered_gallery/personalities.html'
with open(html_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

grid = soup.find('div', id='personalitiesGrid')
for name in names:
    if not soup.find(attrs={"data-name": name.lower()}):
        p_data = data[name.lower()]
        img_filename = f"{name.lower().replace(' ', '_')}_portrait.jpg"
        card_html = f'''
<article class="personality-card" 
         data-birth-year="{p_data['birthYear']}" 
         data-name="{name.lower()}" 
         data-dates="{p_data['dates']}" 
         data-summary="{p_data['summary']}" 
         data-keywords="{",".join(p_data['tags'])}" 
         data-works="{",".join(p_data['keyWorks'])}">
  
  <div class="personality-img-wrapper gallery-zoomable" 
       title="Click to view full portrait"
       data-zoom-src="/images/personalities/{img_filename}"
       data-zoom-title="{p_data['name']}"
       data-zoom-caption="{p_data['summary']}">
    <picture>
      <source srcset="/images/personalities/{img_filename.replace('.jpg', '.avif')}" type="image/avif">
      <source srcset="/images/personalities/{img_filename.replace('.jpg', '.webp')}" type="image/webp">
      <img src="/images/personalities/{img_filename}" alt="{p_data['name']}" loading="lazy" onerror="this.onerror=null;this.src='/images/placeholder-avatar.png';">
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
      <h2 class="personality-name">{p_data['name']}</h2>
      <span class="personality-dates">{p_data['dates']}</span>
    </div>
    <p class="personality-desc">{p_data['summary']}</p>
  </div>
</article>
'''
        card_soup = BeautifulSoup(card_html, 'html.parser')
        grid.append(card_soup)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))
