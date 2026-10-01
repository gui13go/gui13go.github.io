import os
import re
import json
import shutil
from bs4 import BeautifulSoup

def process_all_galleries():
    public_gallery_dir = 'frontend/public/rendered_gallery'
    public_data_dir = 'frontend/public/data'
    dist_gallery_dir = 'frontend/dist/rendered_gallery'
    dist_data_dir = 'frontend/dist/data'

    os.makedirs(public_data_dir, exist_ok=True)
    os.makedirs(dist_data_dir, exist_ok=True)

    configs = {
        'operating-systems': {
            'gridId': 'osGrid',
            'cardClass': 'os-card',
            'searchId': 'osSearch',
            'clearId': 'clearOsSearch',
            'sortId': 'osSort',
            'storageKey': 'os-sort-order',
            'countId': 'visibleCount',
            'noResultsId': 'noResultsMsg',
            'searchAttrs': ['name', 'type', 'based', 'usecase', 'kernel', 'features', 'description'],
            'lightboxType': 'os', # src, title, meta, caption
        },
        'arts': {
            'gridId': 'artsGrid',
            'cardClass': 'art-card',
            'searchId': 'artSearch',
            'clearId': 'clearArtSearch',
            'sortId': 'artSort',
            'storageKey': 'arts-sort-order',
            'countId': 'visibleCount',
            'noResultsId': 'noResultsMsg',
            'searchAttrs': ['title', 'creator', 'year', 'summary'],
            'lightboxType': 'arts', # src, title, creator, year, caption
        },
        'books': {
            'gridId': 'booksGrid',
            'cardClass': 'book-card',
            'searchId': 'bookSearch',
            'clearId': 'clearBookSearch',
            'sortId': 'bookSort',
            'storageKey': 'books-sort-order',
            'countId': 'visibleCount',
            'noResultsId': 'noResultsMsg',
            'searchAttrs': ['title', 'authors', 'year', 'summary', 'keywords'],
            'lightboxType': 'books', # src, title, authors, year, caption
        },
        'computer-languages': {
            'gridId': 'languagesGrid',
            'cardClass': 'language-card',
            'searchId': 'langSearch',
            'clearId': 'clearLangSearch',
            'sortId': 'langSort',
            'storageKey': 'languages-sort-order',
            'countId': 'visibleCount',
            'noResultsId': 'noResultsMsg',
            'searchAttrs': ['name', 'creator', 'year', 'typing', 'compiled', 'paradigm', 'usage', 'description'],
            'lightboxType': 'none',
        },
        'network-protocols': {
            'gridId': 'protocolsGrid',
            'cardClass': 'protocol-card',
            'searchId': 'protocolSearch',
            'clearId': 'clearProtocolSearch',
            'sortId': 'protocolSort',
            'storageKey': 'protocols-sort-order',
            'countId': 'visibleCount',
            'noResultsId': 'noResultsMsg',
            'searchAttrs': ['name', 'creators', 'year', 'summary', 'keywords'],
            'lightboxType': 'protocols',
        },
        'quotes': {
            'gridId': 'quotesGrid',
            'cardClass': 'quote-card',
            'searchId': 'quoteSearch',
            'clearId': 'clearQuoteSearch',
            'sortId': 'quoteSort',
            'storageKey': 'quotes-sort-order',
            'countId': 'visibleCount',
            'noResultsId': 'noResultsMsg',
            'searchAttrs': ['text', 'author', 'origin', 'year'],
            'lightboxType': 'none',
        },
        'laws': {
            'gridId': 'lawsGrid',
            'cardClass': 'law-card',
            'searchId': 'lawSearch',
            'clearId': 'clearLawSearch',
            'sortId': 'lawSort',
            'storageKey': 'laws-sort-order',
            'countId': 'visibleCount',
            'noResultsId': 'noResultsMsg',
            'searchAttrs': ['title', 'author', 'location', 'quote', 'summary', 'tags'],
            'lightboxType': 'laws',
        },
        'facts': {
            'gridId': 'factsGrid',
            'cardClass': 'fact-card',
            'searchId': 'factSearch',
            'clearId': 'clearFactSearch',
            'sortId': 'factSort',
            'storageKey': 'facts-sort-order',
            'countId': 'visibleCount',
            'noResultsId': 'noResultsMsg',
            'searchAttrs': ['name', 'content', 'details', 'category'],
            'lightboxType': 'facts',
        },
        'jokes': {
            'gridId': 'jokesGrid',
            'cardClass': 'joke-card',
            'searchId': 'jokeSearch',
            'clearId': 'clearJokeSearch',
            'sortId': 'jokeSort',
            'storageKey': 'jokes-sort-order',
            'countId': 'visibleCount',
            'noResultsId': 'noResultsMsg',
            'searchAttrs': ['name', 'content', 'history', 'discipline'],
            'lightboxType': 'jokes',
        },
        'gadgets': {
            'gridId': 'gadgetsGrid',
            'cardClass': 'gadget-card',
            'searchId': 'gadgetSearch',
            'clearId': 'clearGadgetSearch',
            'sortId': 'gadgetSort',
            'storageKey': 'gadgets-sort-order',
            'countId': 'visibleCount',
            'noResultsId': 'noResultsMsg',
            'searchAttrs': ['name', 'developers', 'year', 'cost', 'systems', 'gpio', 'dimensions', 'legal', 'features', 'description', 'keywords'],
            'lightboxType': 'gadgets',
        },
        'versus': {
            'gridId': 'versusGrid',
            'cardClass': 'versus-card',
            'searchId': 'versusSearch',
            'clearId': 'clearVersusSearch',
            'sortId': 'versusSort',
            'storageKey': 'versus-sort-order',
            'countId': 'visibleCount',
            'noResultsId': 'noResultsMsg',
            'searchAttrs': ['title', 'subtitle', 'entityA', 'descA', 'entityB', 'descB', 'differences', 'commonground', 'winner'],
            'lightboxType': 'versus_modal',
        },
        'dictionary': {
            'gridId': 'dictionaryGrid',
            'cardClass': 'dict-card',
            'searchId': 'dictSearch',
            'clearId': 'clearDictSearch',
            'sortId': 'dictSort',
            'storageKey': 'dictionary-sort-order',
            'countId': 'visibleCount',
            'noResultsId': 'noResultsMsg',
            'searchAttrs': ['term', 'keywords', 'usecases', 'facts', 'definition'],
            'lightboxType': 'dictionary_actions',
        }
    }

    for slug, cfg in configs.items():
        html_file = os.path.join(public_gallery_dir, f'{slug}.html')
        if not os.path.exists(html_file):
            print(f'File not found: {html_file}')
            continue

        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()

        soup = BeautifulSoup(html_content, 'html.parser')
        cards = soup.select(f'.{cfg["cardClass"]}')
        total_cards = len(cards)

        # 1. Extract JSON data
        items = []
        for idx, c in enumerate(cards):
            attrs = dict(c.attrs)
            dataset = {k: v for k, v in attrs.items() if k.startswith('data-')}

            name = (
                attrs.get('data-name') or
                attrs.get('data-title') or
                attrs.get('data-term') or
                attrs.get('data-id')
            )
            if not name:
                title_el = c.select_one('[class*="name"], [class*="title"], [class*="term"], h2, h3')
                name = title_el.text.strip() if title_el else f'Item {idx+1}'

            # Extract year
            year_num = None
            raw_year = attrs.get('data-year') or attrs.get('data-clean-year') or attrs.get('data-birth-year')
            if raw_year:
                try:
                    year_num = int(float(raw_year))
                except:
                    pass

            if year_num is None:
                # check year badges
                for b in c.select('[class*="year"], [class*="date"], [class*="badge"]'):
                    m = re.search(r'\b(1[6789]\d\d|20\d\d)\b', b.text)
                    if m:
                        year_num = int(m.group(0))
                        break

            if year_num is None:
                m = re.search(r'\b(1[6789]\d\d|20\d\d)\b', c.text)
                if m:
                    year_num = int(m.group(0))

            sort_year = year_num if year_num is not None else (total_cards - idx)
            sort_name = name.lower().strip()

            img_el = c.select_one('img')
            img_src = img_el.get('src', '') if img_el else ''

            zoom_el = c.select_one('.gallery-zoomable, [data-zoom-src]')
            zoom_src = zoom_el.get('data-zoom-src', img_src) if zoom_el else img_src
            zoom_title = zoom_el.get('data-zoom-title', name) if zoom_el else name
            zoom_meta = zoom_el.get('data-zoom-meta', '') if zoom_el else ''
            zoom_caption = zoom_el.get('data-zoom-caption', '') if zoom_el else ''

            desc = (
                attrs.get('data-description') or
                attrs.get('data-summary') or
                attrs.get('data-content') or
                attrs.get('data-definition')
            )
            if not desc:
                desc_el = c.select_one('[class*="desc"], [class*="summary"], [class*="content"], [class*="definition"], p')
                desc = desc_el.text.strip() if desc_el else ''

            item_data = {
                'id': attrs.get('id') or attrs.get('data-id') or f'{slug}-{idx+1}',
                'name': name,
                'title': name,
                'year': year_num,
                'sortYear': sort_year,
                'sortName': sort_name,
                'description': desc,
                'image': img_src,
                'zoomSrc': zoom_src,
                'zoomTitle': zoom_title,
                'zoomMeta': zoom_meta,
                'zoomCaption': zoom_caption,
                'dataset': dataset,
                'classes': attrs.get('class', []),
                'html': c.decode_contents().strip()
            }
            items.append(item_data)

        # Write public and dist JSON files
        json_path = os.path.join(public_data_dir, f'{slug}.json')
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(items, f, indent=2, ensure_ascii=False)

        dist_json_path = os.path.join(dist_data_dir, f'{slug}.json')
        with open(dist_json_path, 'w', encoding='utf-8') as f:
            json.dump(items, f, indent=2, ensure_ascii=False)

        print(f'Saved /data/{slug}.json ({len(items)} items, {round(os.path.getsize(json_path)/1024, 1)} KB)')

process_all_galleries()
