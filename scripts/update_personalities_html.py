#!/usr/bin/env python3
import json
import html
import re
import os

def get_thumbnail_src(img_url):
    """
    Given an image URL like '/images/personalities/foo.jpg' or '.png' or '.webp',
    returns '/images/personalities_thumbs/foo.webp' if the thumbnail exists on disk,
    otherwise falls back to the original image URL or placeholder.
    """
    if not img_url:
        return "/images/personalities_thumbs/placeholder-avatar.webp"
    
    bname = os.path.splitext(os.path.basename(img_url))[0]
    thumb_rel = f"images/personalities_thumbs/{bname}.webp"
    thumb_full = os.path.join("frontend", "public", thumb_rel)
    if os.path.exists(thumb_full):
        return f"/{thumb_rel}"
    return img_url

def generate_card_html(p):
    name = html.escape(p.get('name') or '')
    slug = html.escape(p.get('slug') or re.sub(r'[^a-zA-Z0-9]+', '-', p.get('name') or '').lower().strip('-'))
    dates = html.escape(p.get('dates') or '')
    birth_year = p.get('birthYear') if p.get('birthYear') is not None else 9999
    summary = html.escape(p.get('summary') or '')
    image = p.get('image') or ''
    zoom_src = html.escape(p.get('zoomSrc') or image or '')
    zoom_title = html.escape(p.get('zoomTitle') or p.get('name') or '')
    zoom_caption = html.escape(p.get('zoomCaption') or f"{p.get('dates', '')} • {p.get('summary', '')}")
    keywords = html.escape(p.get('keywords') or '').lower()

    # Works
    works = p.get('keyWorks') or []
    norm_works = []
    for w in works:
        if isinstance(w, str) and w.strip():
            norm_works.append(w.strip())
        elif isinstance(w, dict) and (w.get('title') or w.get('name')):
            norm_works.append((w.get('title') or w.get('name')).strip())
    works_attr = html.escape(" ".join(norm_works)).lower()

    works_html = ""
    if norm_works:
        items = "".join([f"<li>{html.escape(w)}</li>" for w in norm_works])
        works_html = f"""<div class="personality-works"><span class="personality-section-label">Key Works:</span><ul class="personality-works-list">{items}</ul></div>"""

    # Tags
    tags = [t.strip() for t in p.get('tags') or [] if t and t.strip()]
    tags_html = ""
    if tags:
        items = "".join([f'<span class="personality-tag">#{html.escape(t)}</span>' for t in tags])
        tags_html = f"""<div class="personality-tags">{items}</div>"""

    # Quotes
    quotes = p.get('quotes') or []
    if not quotes and p.get('quote'):
        quotes = [p['quote']]

    quotes_attr_parts = []
    quotes_items = []
    for q in quotes:
        if isinstance(q, dict) and q.get('text') and q['text'].strip():
            text = q['text'].strip()
            cite = (q.get('cite') or '').strip()
            quotes_attr_parts.append(f"{text} {cite}")
            clean_text = re.sub(r'^[“"\'\s]+|[”"\'\s]+$', '', text)
            cite_clean = re.sub(r'^[-—\s]+', '', cite)
            cite_html = f'<cite class="personality-quote-cite">— {html.escape(cite_clean)}</cite>' if cite_clean else ''
            quotes_items.append(f"""<div class="personality-quote-item"><blockquote class="personality-quote-text">“{html.escape(clean_text)}”{cite_html}</blockquote></div>""")
        elif isinstance(q, str) and q.strip():
            text = q.strip()
            quotes_attr_parts.append(text)
            clean_text = re.sub(r'^[“"\'\s]+|[”"\'\s]+$', '', text)
            quotes_items.append(f"""<div class="personality-quote-item"><blockquote class="personality-quote-text">“{html.escape(clean_text)}”</blockquote></div>""")

    quotes_attr = html.escape(" ".join(quotes_attr_parts)).lower()

    quotes_box_html = ""
    if quotes_items:
        title_label = "Memorable Quotes" if len(quotes_items) > 1 else "Memorable Quote"
        items_str = "".join(quotes_items)
        quotes_box_html = f"""<div class="personality-quotes-box"><div class="personality-quotes-title"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg><span>{title_label}</span></div>{items_str}</div>"""

    data_name = html.escape((p.get('name') or '').lower())
    data_dates = html.escape((p.get('dates') or '').lower())
    data_summary = html.escape((p.get('summary') or '').lower())

    thumb_src = html.escape(get_thumbnail_src(image))

    return f"""<article class="personality-card" data-birth-year="{birth_year}" data-dates="{data_dates}" data-keywords="{keywords}" data-name="{data_name}" data-quotes="{quotes_attr}" data-summary="{data_summary}" data-works="{works_attr}">
<div class="personality-img-wrapper gallery-zoomable" data-slug="{slug}" data-zoom-caption="{zoom_caption}" data-zoom-src="{zoom_src}" data-zoom-title="{zoom_title}" title="Click to view full portrait">
<img alt="{name}" loading="lazy" onerror="this.onerror=null;this.src='/images/personalities_thumbs/placeholder-avatar.webp';" src="{thumb_src}"/>
<div class="personality-img-overlay">
<svg class="zoom-indicator-icon" fill="none" height="22" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="22">
<circle cx="11" cy="11" r="8"></circle>
<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
<line x1="11" y1="8" x2="11" y2="14"></line>
<line x1="8" y1="11" x2="14" y2="11"></line>
</svg>
</div>
</div>
<div class="personality-content">
<div class="personality-top-row">
<div class="personality-name-wrap">
<h2 class="personality-name">{name}</h2>
<a class="personality-ai-btn" href="/gallery/personalities/{slug}/" title="Talk with {name} (AI)" aria-label="Talk with {name} (AI)">
<svg class="personality-ai-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
<path d="M18 10h-.01c-.1-3.3-2.7-6-6-6-2.6 0-4.8 1.7-5.6 4.1C4.1 8.5 2 10.5 2 13c0 2.8 2.2 5 5 5h1v3l3.5-3H18c2.8 0 5-2.2 5-5s-2.2-5-5-5z"></path>
<circle cx="8" cy="13" r="1" fill="currentColor" stroke="none"></circle>
<circle cx="12" cy="13" r="1" fill="currentColor" stroke="none"></circle>
<circle cx="16" cy="13" r="1" fill="currentColor" stroke="none"></circle>
</svg>
</a>
</div>
<span class="personality-dates">{dates}</span>
</div>
<p class="personality-summary">{summary}</p>
{quotes_box_html}
{works_html}
{tags_html}
</div>
</article>"""

def main():
    with open('frontend/public/data/personalities.json', 'r', encoding='utf-8') as f:
        personalities = json.load(f)
    print(f"Loaded {len(personalities)} personalities.")

    with open('frontend/public/rendered_gallery/personalities.html', 'r', encoding='utf-8') as f:
        html_content = f.read()

    # 1. Update count badge
    old_badge_regex = r'<div class="gallery-count-badge">\s*Showing <span id="visibleCount">\d+</span> of \d+ personalities\s*</div>'
    new_badge = f'<div class="gallery-count-badge">\n      Showing <span id="visibleCount">{len(personalities)}</span> of <span id="totalCount">{len(personalities)}</span> personalities\n    </div>'
    html_content = re.sub(old_badge_regex, new_badge, html_content)

    # 2. Ensure embedded CSS has personality-ai-btn styles
    css_to_add = """
    .personality-name-wrap {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .personality-ai-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      min-width: 30px;
      min-height: 30px;
      border-radius: 50%;
      background: rgba(56, 189, 248, 0.12);
      border: 1.5px solid rgba(56, 189, 248, 0.4);
      color: #38bdf8;
      text-decoration: none;
      cursor: pointer;
      position: relative;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }
    .personality-ai-btn:hover {
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      border-color: #38bdf8;
      color: #ffffff;
      transform: translateY(-1.5px) scale(1.08);
      box-shadow: 0 4px 16px rgba(37, 99, 235, 0.5), 0 0 12px rgba(56, 189, 248, 0.45);
    }
    .personality-ai-btn:active {
      transform: translateY(0) scale(0.95);
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
    }
    .personality-ai-btn .personality-ai-icon {
      width: 16px;
      height: 16px;
      display: block;
      transition: transform 0.22s ease;
    }
    .personality-ai-btn:hover .personality-ai-icon {
      transform: scale(1.05);
    }
    html[data-theme="light"] .personality-ai-btn,
    :root:not(.dark) .personality-ai-btn {
      background: rgba(2, 132, 199, 0.1);
      border-color: rgba(2, 132, 199, 0.35);
      color: #0284c7;
      box-shadow: 0 2px 6px rgba(2, 132, 199, 0.12);
    }
    html[data-theme="light"] .personality-ai-btn:hover,
    :root:not(.dark) .personality-ai-btn:hover {
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      border-color: #0284c7;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
    }"""
    if '.personality-ai-btn' not in html_content:
        html_content = html_content.replace('</style>', css_to_add + '\n  </style>', 1)

    # 3. Update createCardElement in embedded JS
    old_top_row_js = """<div class="personality-top-row">
            <h2 class="personality-name">${escapeHtml(p.name)}</h2>
            <span class="personality-dates">${escapeHtml(p.dates)}</span>
          </div>"""
    new_top_row_js = """<div class="personality-top-row">
            <div class="personality-name-wrap">
              <h2 class="personality-name">${escapeHtml(p.name)}</h2>
              <a href="/gallery/personalities/${p.slug || slugify(p.name)}/" class="personality-ai-btn" title="Talk with ${escapeHtml(p.name)} (AI)" aria-label="Talk with ${escapeHtml(p.name)} (AI)">
                <svg class="personality-ai-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 10h-.01c-.1-3.3-2.7-6-6-6-2.6 0-4.8 1.7-5.6 4.1C4.1 8.5 2 10.5 2 13c0 2.8 2.2 5 5 5h1v3l3.5-3H18c2.8 0 5-2.2 5-5s-2.2-5-5-5z"></path>
                  <circle cx="8" cy="13" r="1" fill="currentColor" stroke="none"></circle>
                  <circle cx="12" cy="13" r="1" fill="currentColor" stroke="none"></circle>
                  <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none"></circle>
                </svg>
              </a>
            </div>
            <span class="personality-dates">${escapeHtml(p.dates)}</span>
          </div>"""
    html_content = html_content.replace(old_top_row_js, new_top_row_js)

    # 4. Generate cards HTML
    cards_html = "\n".join([generate_card_html(p) for p in personalities])

    # 5. Replace content inside personalitiesGrid
    grid_start_tag = '<div class="personalities-container" id="personalitiesGrid">'
    grid_start_idx = html_content.find(grid_start_tag)
    if grid_start_idx == -1:
        raise ValueError("Could not find grid start tag in personalities.html")
    
    empty_state_idx = html_content.find('<div class="gallery-empty-state" id="noResultsMsg"', grid_start_idx)
    if empty_state_idx == -1:
        raise ValueError("Could not find noResultsMsg in personalities.html")

    prefix = html_content[:grid_start_idx + len(grid_start_tag)]
    suffix = html_content[empty_state_idx:]

    new_html = prefix + "\n" + cards_html + "\n" + suffix

    with open('frontend/public/rendered_gallery/personalities.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Successfully updated frontend/public/rendered_gallery/personalities.html!")

if __name__ == '__main__':
    main()
