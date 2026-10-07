from bs4 import BeautifulSoup
import json
import os

html_path = '../frontend/public/rendered_gallery/personalities.html'
json_path = '../frontend/public/data/personalities.json'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()
    
soup = BeautifulSoup(html, 'html.parser')
cards = soup.find_all('article', class_='personality-card')

personalities = []
for card in cards:
    name_el = card.find('h2', class_='personality-name')
    name = name_el.text.strip() if name_el else "Unknown"
    
    dates_el = card.find('span', class_='personality-dates')
    dates = dates_el.text.strip() if dates_el else ""
    
    desc_el = card.find('p', class_='personality-desc')
    summary = desc_el.text.strip() if desc_el else "Historical figure"
    
    img_tag = card.find('img')
    img_src = img_tag['src'] if img_tag else ""
    
    wrapper = card.find('div', class_='gallery-zoomable')
    zoom_src = wrapper['data-zoom-src'] if wrapper else img_src
    
    keywords = card.get('data-keywords', '')
    works = card.get('data-works', '')
    
    tags = [k.strip() for k in keywords.split(',') if k.strip()]
    key_works = [{"title": w.strip()} for w in works.split(',') if w.strip()]
    
    # Check if this name is already in there
    if any(p['name'] == name for p in personalities):
        continue
        
    personalities.append({
        "name": name,
        "dates": dates,
        "birthYear": None,
        "summary": summary,
        "image": img_src,
        "zoomSrc": zoom_src,
        "zoomTitle": name,
        "zoomCaption": summary,
        "quote": {"text": "", "cite": ""},
        "keyWorks": key_works,
        "tags": tags
    })

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(personalities, f, indent=2, ensure_ascii=False)

print(f"Recovered {len(personalities)} personalities from HTML.")
