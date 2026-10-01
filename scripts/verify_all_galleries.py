import os
import json
import urllib.request
from bs4 import BeautifulSoup

galleries = [
    'personalities',
    'operating-systems',
    'arts',
    'books',
    'computer-languages',
    'gadgets',
    'network-protocols',
    'quotes',
    'laws',
    'facts',
    'jokes',
    'versus',
    'dictionary'
]

results = []

for slug in galleries:
    html_path = f'frontend/public/rendered_gallery/{slug}.html'
    json_path = f'frontend/public/data/{slug}.json'
    
    # Check JSON file
    if not os.path.exists(json_path):
        results.append({'slug': slug, 'error': f'Missing {json_path}'})
        continue
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Check HTML file
    if not os.path.exists(html_path):
        results.append({'slug': slug, 'error': f'Missing {html_path}'})
        continue
        
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    sort_select = soup.select_one('select[id*="Sort"], select[class*="sort"]')
    has_fetch = f'/data/{slug}.json' in html
    
    options = [opt.get('value') for opt in sort_select.select('option')] if sort_select else []
    default_opt = [opt.get('value') for opt in sort_select.select('option') if opt.has_attr('selected')] if sort_select else []
    
    # Check HTTP endpoint
    url = f'http://localhost:5173/data/{slug}.json'
    http_status = None
    try:
        req = urllib.request.urlopen(url)
        http_status = req.status
    except Exception as e:
        http_status = str(e)
        
    results.append({
        'slug': slug,
        'item_count': len(data),
        'sort_id': sort_select.get('id') if sort_select else None,
        'options': options,
        'default_option': default_opt,
        'has_fetch': has_fetch,
        'http_status': http_status
    })

print(json.dumps(results, indent=2))
