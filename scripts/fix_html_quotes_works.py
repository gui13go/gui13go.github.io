import json
from bs4 import BeautifulSoup
import os

json_path = 'frontend/public/data/personalities.json'
html_path = 'frontend/public/rendered_gallery/personalities.html'

with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

with open(html_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

p_map = {p['name'].lower(): p for p in personalities}

for article in soup.find_all('article', class_='personality-card'):
    name_attr = article.get('data-name', '').strip()
    if name_attr in p_map:
        p = p_map[name_attr]
        info_div = article.find('div', class_='personality-info')
        if not info_div:
            info_div = article.find('div', class_='personality-content')
            
        if not info_div:
            # Fallback
            info_div = article

        # Check if quotes already exist
        quotes_box = article.find('div', class_='personality-quotes-box')
        if quotes_box:
            quotes_box.decompose()

        # Check if works already exist
        works_box = article.find('div', class_='personality-works')
        if works_box:
            works_box.decompose()

        # Check if tags already exist
        tags_box = article.find('div', class_='personality-tags')
        if tags_box:
            tags_box.decompose()

        # Rebuild quotes
        has_quotes = False
        quotes_html = '<div class="personality-quotes-box"><div class="personality-quotes-title"><svg fill="currentColor" height="14" viewbox="0 0 24 24" width="14"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path></svg><span>Memorable Quotes</span></div>'
        if isinstance(p.get('quote'), list):
            for q in p['quote']:
                if q.get('text'):
                    has_quotes = True
                    quotes_html += f'<div class="personality-quote-item"><blockquote class="personality-quote-text">“{q["text"]}”<cite class="personality-quote-cite">— {q.get("cite", "")}</cite></blockquote></div>'
        elif isinstance(p.get('quote'), dict):
            if p['quote'].get('text'):
                has_quotes = True
                quotes_html += f'<div class="personality-quote-item"><blockquote class="personality-quote-text">“{p["quote"]["text"]}”<cite class="personality-quote-cite">— {p["quote"].get("cite", "")}</cite></blockquote></div>'
        
        quotes_html += '</div>'
        
        # Rebuild works
        has_works = False
        works_html = '<div class="personality-works"><span class="personality-section-label">Key Works:</span><ul class="personality-works-list">'
        if isinstance(p.get('keyWorks'), list):
            for w in p['keyWorks']:
                title = w.get('title', w) if isinstance(w, dict) else w
                if title:
                    has_works = True
                    works_html += f'<li>{title}</li>'
        works_html += '</ul></div>'

        # Rebuild tags
        has_tags = False
        tags_html = '<div class="personality-tags">'
        if isinstance(p.get('tags'), list):
            for tag in p['tags']:
                if tag:
                    has_tags = True
                    tags_html += f'<span class="personality-tag">{tag}</span>'
        tags_html += '</div>'

        # Append to info_div
        if has_quotes:
            info_div.append(BeautifulSoup(quotes_html, 'html.parser'))
        if has_works:
            info_div.append(BeautifulSoup(works_html, 'html.parser'))
        if has_tags:
            info_div.append(BeautifulSoup(tags_html, 'html.parser'))


with open(html_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))

print("Fixed quotes and works in HTML.")
