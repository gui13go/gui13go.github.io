#!/usr/bin/env python3
"""
Applies all battle enrichments to:
1. frontend/public/data/versus.json
2. frontend/public/rendered_gallery/versus.html
3. frontend/public/rendered_versus/<slug>.html

Ensures:
- Birth / death dates and key eras appear in entityA.dates and entityB.dates
- Descriptions are comprehensive, rich, and historically contextualized
- Differences are expanded and informative
- Common ground and verdict/outcomes are elevated
- fighter-name rendering in both modal and dedicated pages includes the dates badge:
  <h3 class="fighter-name">Name <span class="fighter-dates">Dates</span></h3>
"""

import json
import re
import html
import os

from scripts.versus_enrichment_data import BATTLE_ENRICHMENTS as E1
from scripts.versus_enrichment_data_2 import MORE_ENRICHMENTS as E2
from scripts.versus_enrichment_data_3 import EVEN_MORE_ENRICHMENTS as E3
from scripts.versus_enrichment_data_4 import TECH_ENRICHMENTS as E4

ALL_ENRICHMENTS = {**E1, **E2, **E3, **E4}

def escape_html(s):
    if not s:
        return ""
    return html.escape(str(s))

def update_versus_json():
    filepath = "frontend/public/data/versus.json"
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    for item in data:
        slug = item["dataset"].get("data-id")
        if not slug or slug not in ALL_ENRICHMENTS:
            continue

        enr = ALL_ENRICHMENTS[slug]

        # Extract current payload from item['html']
        m = re.search(r'<script class="versus-data-payload"[^>]*>(.*?)</script>', item["html"])
        if not m:
            continue

        payload = json.loads(m.group(1))

        # Update dates if present
        if "datesA" in enr:
            payload["entityA"]["dates"] = enr["datesA"]
        if "datesB" in enr:
            payload["entityB"]["dates"] = enr["datesB"]

        # Update descriptions
        if "descA" in enr:
            payload["entityA"]["description"] = enr["descA"]
            item["dataset"]["data-desc-a"] = enr["descA"].lower()
        if "descB" in enr:
            payload["entityB"]["description"] = enr["descB"]
            item["dataset"]["data-desc-b"] = enr["descB"].lower()

        # Update differences
        if "differences" in enr:
            payload["differences"] = enr["differences"]
            item["dataset"]["data-differences"] = " ".join(enr["differences"]).lower()

        # Update common ground
        if "commonGround" in enr:
            payload["commonGround"] = enr["commonGround"]
            item["dataset"]["data-commonground"] = enr["commonGround"].lower()

        # Update winner
        if "winner" in enr:
            payload["winner"] = enr["winner"]
            item["dataset"]["data-winner"] = enr["winner"].lower()

        # Replace payload in item['html']
        new_payload_json = json.dumps(payload, ensure_ascii=False)
        item["html"] = re.sub(
            r'<script class="versus-data-payload"[^>]*>.*?</script>',
            f'<script class="versus-data-payload" type="application/json">{new_payload_json}</script>',
            item["html"]
        )

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Updated {filepath} successfully.")
    return data

def update_rendered_gallery(data_list):
    filepath = "frontend/public/rendered_gallery/versus.html"
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    # 1. Update the JS openModal function so it renders dates if present:
    # Look for modalNameA / modalNameB handling
    old_modal_code_a = 'if (modalNameA) modalNameA.textContent = eA.name || "Side A";'
    new_modal_code_a = 'if (modalNameA) { if (eA.dates) { modalNameA.innerHTML = escapeHtml(eA.name || "Side A") + \' <span class="fighter-dates">\' + escapeHtml(eA.dates) + \'</span>\'; } else { modalNameA.textContent = eA.name || "Side A"; } }'

    old_modal_code_b = 'if (modalNameB) modalNameB.textContent = eB.name || "Side B";'
    new_modal_code_b = 'if (modalNameB) { if (eB.dates) { modalNameB.innerHTML = escapeHtml(eB.name || "Side B") + \' <span class="fighter-dates">\' + escapeHtml(eB.dates) + \'</span>\'; } else { modalNameB.textContent = eB.name || "Side B"; } }'

    if old_modal_code_a in text:
        text = text.replace(old_modal_code_a, new_modal_code_a)
    if old_modal_code_b in text:
        text = text.replace(old_modal_code_b, new_modal_code_b)

    # 2. Update embedded articles in gridContainer fallback
    for item in data_list:
        slug = item["dataset"].get("data-id")
        if not slug or slug not in ALL_ENRICHMENTS:
            continue

        # Find the article element with id="<slug>"
        # Pattern: <article [^>]*id="slug"[^>]*>.*?</article>
        pattern = rf'<article\b[^>]*\bid="{re.escape(slug)}"[^>]*>.*?</article>'
        m = re.search(pattern, text, re.DOTALL)
        if m:
            # Reconstruct article tag
            ds_str = " ".join([f'{k}="{escape_html(v)}"' for k, v in item["dataset"].items()])
            title = item.get("title") or item["dataset"].get("data-title", slug)
            art_open = f'<article aria-haspopup="dialog" aria-label="View battle: {escape_html(title)}" class="versus-card" {ds_str} id="{slug}" role="button" tabindex="0">'
            art_body = item["html"]
            art_full = f'{art_open}{art_body}</article>'
            text = text[:m.start()] + art_full + text[m.end():]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"Updated {filepath} successfully.")

def update_dedicated_pages(data_list):
    dirpath = "frontend/public/rendered_versus"
    updated_count = 0

    for item in data_list:
        slug = item["dataset"].get("data-id")
        if not slug or slug not in ALL_ENRICHMENTS:
            continue

        file_path = os.path.join(dirpath, f"{slug}.html")
        if not os.path.exists(file_path):
            continue

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        enr = ALL_ENRICHMENTS[slug]

        # Extract payload from item['html']
        m_payload = re.search(r'<script class="versus-data-payload"[^>]*>(.*?)</script>', item["html"])
        if not m_payload:
            continue
        payload = json.loads(m_payload.group(1))

        nameA = payload["entityA"]["name"]
        datesA = payload["entityA"].get("dates")
        descA = payload["entityA"]["description"]

        nameB = payload["entityB"]["name"]
        datesB = payload["entityB"].get("dates")
        descB = payload["entityB"]["description"]

        # Build nameA html with badge if dates exist
        if datesA:
            nameA_html = f'{escape_html(nameA)} <span class="fighter-dates">{escape_html(datesA)}</span>'
        else:
            nameA_html = escape_html(nameA)

        if datesB:
            nameB_html = f'{escape_html(nameB)} <span class="fighter-dates">{escape_html(datesB)}</span>'
        else:
            nameB_html = escape_html(nameB)

        # Replace fighter cards in content:
        # Side A
        side_a_regex = r'<div class="versus-fighter-card side-a"><div class="fighter-header"><span class="fighter-tag fighter-tag-a">Corner A</span><h3 class="fighter-name">.*?</h3></div><p class="fighter-desc">.*?</p></div>'
        side_a_replacement = f'<div class="versus-fighter-card side-a"><div class="fighter-header"><span class="fighter-tag fighter-tag-a">Corner A</span><h3 class="fighter-name">{nameA_html}</h3></div><p class="fighter-desc">{escape_html(descA)}</p></div>'
        content = re.sub(side_a_regex, side_a_replacement, content, flags=re.DOTALL)

        # Side B
        side_b_regex = r'<div class="versus-fighter-card side-b"><div class="fighter-header"><span class="fighter-tag fighter-tag-b">Corner B</span><h3 class="fighter-name">.*?</h3></div><p class="fighter-desc">.*?</p></div>'
        side_b_replacement = f'<div class="versus-fighter-card side-b"><div class="fighter-header"><span class="fighter-tag fighter-tag-b">Corner B</span><h3 class="fighter-name">{nameB_html}</h3></div><p class="fighter-desc">{escape_html(descB)}</p></div>'
        content = re.sub(side_b_regex, side_b_replacement, content, flags=re.DOTALL)

        # Replace differences
        diffs = payload.get("differences", [])
        diff_items = []
        for d in diffs:
            parts = re.split(r'\s+vs\.?\s+', d, flags=re.IGNORECASE)
            if len(parts) == 2:
                diff_items.append(f'<li class="versus-diff-item"><span class="diff-bullet"></span><span class="diff-content"><strong class="diff-part-a">{escape_html(parts[0])}</strong> <span class="diff-versus-tag">VS</span> <strong class="diff-part-b">{escape_html(parts[1])}</strong></span></li>')
            else:
                diff_items.append(f'<li class="versus-diff-item"><span class="diff-bullet"></span><span class="diff-content">{escape_html(d)}</span></li>')
        diffs_html = "".join(diff_items)

        diffs_regex = r'<ul class="versus-differences-list">.*?</ul>'
        diffs_replacement = f'<ul class="versus-differences-list">{diffs_html}</ul>'
        content = re.sub(diffs_regex, diffs_replacement, content, flags=re.DOTALL)

        # Replace common ground
        common = payload.get("commonGround", "")
        common_regex = r'<div class="versus-insight-card common-ground-card"><h4 class="insight-title">.*?</h4><p class="insight-text">.*?</p></div>'
        common_replacement = f'<div class="versus-insight-card common-ground-card"><h4 class="insight-title"><svg fill="none" height="18" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="18"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3.0 014 10 15.3 15.3.0 01-4 10A15.3 15.3.0 018 12a15.3 15.3.0 014-10z"></path></svg>\nCommon Ground</h4><p class="insight-text">{escape_html(common)}</p></div>'
        content = re.sub(common_regex, common_replacement, content, flags=re.DOTALL)

        # Replace winner
        winner = payload.get("winner", "")
        winner_regex = r'<div class="versus-insight-card winner-card"><h4 class="insight-title">.*?</h4><p class="insight-text verdict-text">.*?</p></div>'
        winner_replacement = f'<div class="versus-insight-card winner-card"><h4 class="insight-title"><svg fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="18"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>\nThe Verdict / Outcome</h4><p class="insight-text verdict-text">“{escape_html(winner)}”</p></div>'
        content = re.sub(winner_regex, winner_replacement, content, flags=re.DOTALL)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

        updated_count += 1

    print(f"Updated {updated_count} dedicated pages in {dirpath}.")

if __name__ == "__main__":
    data_list = update_versus_json()
    update_rendered_gallery(data_list)
    update_dedicated_pages(data_list)
    print("ALL VERSUS ENRICHMENTS APPLIED SUCCESSFULLY!")
