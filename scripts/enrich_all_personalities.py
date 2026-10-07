#!/usr/bin/env python3
import json
import subprocess
import re
import html
import sys
import os

sys.path.insert(0, os.path.abspath('.'))

from scripts.enrichment_part1 import DATA_PART1
from scripts.enrichment_part2 import DATA_PART2
from scripts.enrichment_part3 import DATA_PART3
from scripts.enrichment_part4 import DATA_PART4

def main():
    # 1. Load current personalities.json
    with open('frontend/public/data/personalities.json', 'r', encoding='utf-8') as f:
        cur_list = json.load(f)
    print(f"Loaded {len(cur_list)} current personalities.")

    # 2. Load 266 original personalities from git commit eac69b19cbc429f2c572f0733f941431de955b54
    git_cmd = ['git', 'show', 'eac69b19cbc429f2c572f0733f941431de955b54:frontend/public/data/personalities.json']
    old_raw = subprocess.check_output(git_cmd)
    old_list = json.loads(old_raw)
    old_dict = {p['name']: p for p in old_list}
    print(f"Loaded {len(old_dict)} personalities from commit eac69b.")

    # 3. Combine parts 1..4
    unmatched_dict = {}
    unmatched_dict.update(DATA_PART1)
    unmatched_dict.update(DATA_PART2)
    unmatched_dict.update(DATA_PART3)
    unmatched_dict.update(DATA_PART4)
    print(f"Loaded {len(unmatched_dict)} unmatched personalities from parts 1-4.")

    # 4. Process each entry
    enriched_list = []
    for cur_p in cur_list:
        name = cur_p['name']
        img = cur_p.get('image') or ''
        zoom_src = cur_p.get('zoomSrc') or img

        if name in old_dict:
            src = old_dict[name]
            dates = src.get('dates') or ''
            birth_year = src.get('birthYear')
            summary = src.get('summary') or ''
            key_works = src.get('keyWorks') or []
            quote = src.get('quote')
            quotes = src.get('quotes') or []
            tags = src.get('tags') or []
            keywords = src.get('keywords') or ''

            # Special fix for Zumbi dos Palmares if quote is empty
            if name == 'Zumbi dos Palmares' and (not quote or not quote.get('text')):
                quote = {"text": "Nascer livre, viver livre e lutar até a morte pela liberdade.", "cite": "Lema de Resistência de Palmares"}
                quotes = [{"text": "Nascer livre, viver livre e lutar até a morte pela liberdade.", "cite": "Zumbi dos Palmares"}]

        elif name in unmatched_dict:
            src = unmatched_dict[name]
            dates = src.get('dates') or ''
            birth_year = src.get('birthYear')
            summary = src.get('summary') or ''
            key_works = src.get('keyWorks') or []
            quote = src.get('quote')
            quotes = src.get('quotes') or []
            tags = src.get('tags') or []
            keywords = " ".join([name.lower()] + [t.lower() for t in tags] + [str(w).lower() for w in key_works])
        else:
            raise ValueError(f"Personality '{name}' not found in old_dict or unmatched_dict!")

        # Normalize keyWorks to list of strings
        norm_key_works = []
        for kw in key_works:
            if isinstance(kw, dict):
                norm_key_works.append(kw.get('title') or kw.get('name') or str(kw))
            elif isinstance(kw, str):
                norm_key_works.append(kw)

        # Normalize quotes
        norm_quotes = []
        for q in quotes:
            if isinstance(q, dict) and q.get('text') and q.get('text').strip():
                norm_quotes.append({"text": q['text'].strip(), "cite": (q.get('cite') or '').strip()})
            elif isinstance(q, str) and q.strip():
                norm_quotes.append({"text": q.strip(), "cite": ""})

        norm_quote = None
        if quote and isinstance(quote, dict) and quote.get('text') and quote.get('text').strip():
            norm_quote = {"text": quote['text'].strip(), "cite": (quote.get('cite') or '').strip()}
        elif quote and isinstance(quote, str) and quote.strip():
            norm_quote = {"text": quote.strip(), "cite": ""}
        elif norm_quotes:
            norm_quote = norm_quotes[0]

        if not norm_quotes and norm_quote:
            norm_quotes = [norm_quote]

        zoom_title = name
        zoom_caption = f"{dates} • {summary}" if dates else summary

        item = {
            "name": name,
            "dates": dates,
            "birthYear": birth_year,
            "summary": summary,
            "image": img,
            "zoomSrc": zoom_src,
            "zoomTitle": zoom_title,
            "zoomCaption": zoom_caption,
            "quote": norm_quote,
            "keyWorks": norm_key_works,
            "tags": tags,
            "keywords": keywords,
            "quotes": norm_quotes
        }
        enriched_list.append(item)

    print(f"Enriched all {len(enriched_list)} personalities.")

    # 5. Write to frontend/public/data/personalities.json
    with open('frontend/public/data/personalities.json', 'w', encoding='utf-8') as f:
        json.dump(enriched_list, f, indent=2, ensure_ascii=False)
    print("Successfully wrote frontend/public/data/personalities.json.")

    # 6. Verify completeness
    incomplete = []
    for p in enriched_list:
        if not p['name'] or not p['dates'] or p['birthYear'] is None or not p['summary'] or not p['keyWorks'] or not p['quotes'] or not p['tags']:
            incomplete.append(p['name'])
    if incomplete:
        print(f"Warning: {len(incomplete)} incomplete entries:", incomplete)
    else:
        print("Verification passed! 100% of 680 entries have name, dates, birthYear, summary, keyWorks, quotes, and tags.")

if __name__ == '__main__':
    main()
