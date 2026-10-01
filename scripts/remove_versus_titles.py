import os
import json
from bs4 import BeautifulSoup

def remove_versus_titles():
    # 1. Update versus.html files
    for base_dir in ['frontend/public/rendered_gallery', 'frontend/dist/rendered_gallery']:
        fpath = os.path.join(base_dir, 'versus.html')
        if not os.path.exists(fpath):
            continue
        with open(fpath, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')

        titles = soup.select('.versus-card-title')
        for t in titles:
            t.decompose()

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f'Removed {len(titles)} titles from {fpath}')

    # 2. Update versus.json files
    for data_dir in ['frontend/public/data', 'frontend/dist/data']:
        json_path = os.path.join(data_dir, 'versus.json')
        if not os.path.exists(json_path):
            continue
        with open(json_path, 'r', encoding='utf-8') as f:
            items = json.load(f)

        for item in items:
            if 'html' in item:
                card_soup = BeautifulSoup(item['html'], 'html.parser')
                for t in card_soup.select('.versus-card-title'):
                    t.decompose()
                item['html'] = str(card_soup).strip()

        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
        print(f'Updated {len(items)} items in {json_path}')

def fix_quotes_json():
    # Fix quotes.json so that name, sortName, and title have proper author and text instead of "Item 1"
    html_path = 'frontend/public/rendered_gallery/quotes.html'
    if not os.path.exists(html_path):
        return
    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    cards = soup.select('.quote-card')
    quotes_data = []
    total = len(cards)

    for idx, c in enumerate(cards):
        author_el = c.select_one('.quote-author')
        author = author_el.text.strip() if author_el else (c.get('data-author') or 'Unknown')
        
        text_el = c.select_one('.quote-text')
        text = text_el.text.strip() if text_el else (c.get('data-text') or '')
        
        origin_el = c.select_one('.quote-origin')
        origin = origin_el.text.strip() if origin_el else (c.get('data-origin') or '')
        
        year_el = c.select_one('.quote-year')
        raw_year = year_el.text.strip('() ') if year_el else (c.get('data-year') or '')
        try:
            year_num = int(raw_year)
        except:
            year_num = None
            
        sort_year = year_num if year_num is not None else (total - idx)
        
        quotes_data.append({
            'id': f'quotes-{idx+1}',
            'name': author,
            'title': text,
            'author': author,
            'origin': origin,
            'year': year_num,
            'sortYear': sort_year,
            'sortName': author.lower().strip(),
            'description': text,
            'image': '',
            'zoomSrc': '',
            'zoomTitle': author,
            'zoomMeta': f'{origin} ({year_num})' if year_num else origin,
            'zoomCaption': text,
            'dataset': dict(c.attrs),
            'classes': c.get('class', []),
            'html': c.decode_contents().strip()
        })

    for data_dir in ['frontend/public/data', 'frontend/dist/data']:
        json_path = os.path.join(data_dir, 'quotes.json')
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(quotes_data, f, indent=2, ensure_ascii=False)
        print(f'Fixed quotes.json in {json_path} ({len(quotes_data)} quotes)')

remove_versus_titles()
fix_quotes_json()
