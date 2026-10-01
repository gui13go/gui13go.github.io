#!/usr/bin/env python3
import json
import os
import re
import glob

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VERSUS_JSON_PATH = os.path.join(REPO_ROOT, "frontend/public/data/versus.json")
RENDERED_GALLERY_VERSUS_PATH = os.path.join(REPO_ROOT, "frontend/public/rendered_gallery/versus.html")
RENDERED_VERSUS_DIR = os.path.join(REPO_ROOT, "frontend/public/rendered_versus")

def fix_title(t):
    if not t or not isinstance(t, str):
        return t
    return re.sub(r'\s+vs\.?\s+', ' x ', t, flags=re.I)

def update_versus_json():
    print(f"Updating {VERSUS_JSON_PATH}...")
    with open(VERSUS_JSON_PATH, "r", encoding="utf-8") as f:
        items = json.load(f)

    for item in items:
        old_id = item["id"]
        new_id = old_id.replace("-vs-", "-x-")
        item["id"] = new_id

        # Update title fields
        for key in ["title", "name", "sortName", "zoomTitle"]:
            if key in item and isinstance(item[key], str):
                item[key] = fix_title(item[key])

        # Update dataset
        if "dataset" in item and isinstance(item["dataset"], dict):
            ds = item["dataset"]
            if "data-id" in ds:
                ds["data-id"] = ds["data-id"].replace("-vs-", "-x-")
            if "data-title" in ds:
                ds["data-title"] = fix_title(ds["data-title"])

        # Update payload
        if "payload" in item and isinstance(item["payload"], dict):
            p = item["payload"]
            if "id" in p:
                p["id"] = p["id"].replace("-vs-", "-x-")
            if "title" in p:
                p["title"] = fix_title(p["title"])

        # Update description first line if needed
        if "description" in item and isinstance(item["description"], str):
            lines = item["description"].split("\n")
            if len(lines) > 0:
                lines[0] = fix_title(lines[0])
                item["description"] = "\n".join(lines)

        # Update html field
        if "html" in item and isinstance(item["html"], str):
            h = item["html"]
            # Embedded payload script
            m_s = re.search(r'(<script class="versus-data-payload" type="application/json">)(.*?)(</script>)', h, re.DOTALL)
            if m_s:
                try:
                    pay = json.loads(m_s.group(2))
                    if "id" in pay:
                        pay["id"] = pay["id"].replace("-vs-", "-x-")
                    if "title" in pay:
                        pay["title"] = fix_title(pay["title"])
                    h = h[:m_s.start(0)] + m_s.group(1) + json.dumps(pay) + m_s.group(3) + h[m_s.end(0):]
                except Exception as e:
                    print(f"Error parsing script payload for {old_id}: {e}")
            # Update img alt
            h = re.sub(r'(<img\s+[^>]*alt=")([^"]+)(")', lambda m: m.group(1) + fix_title(m.group(2)) + m.group(3), h)
            item["html"] = h

    with open(VERSUS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
    print("versus.json updated successfully.")

def update_rendered_gallery_versus():
    print(f"Updating {RENDERED_GALLERY_VERSUS_PATH}...")
    with open(RENDERED_GALLERY_VERSUS_PATH, "r", encoding="utf-8") as f:
        text = f.read()

    def transform_article(m):
        card_html = m.group(0)

        # 1. Update payload script
        m_script = re.search(r'(<script class="versus-data-payload" type="application/json">)(.*?)(</script>)', card_html, re.DOTALL)
        if m_script:
            try:
                payload = json.loads(m_script.group(2))
                old_id = payload.get("id", "")
                payload["id"] = old_id.replace("-vs-", "-x-")
                if "title" in payload:
                    payload["title"] = fix_title(payload["title"])
                new_script = m_script.group(1) + json.dumps(payload) + m_script.group(3)
                card_html = card_html[:m_script.start(0)] + new_script + card_html[m_script.end(0):]
            except Exception as e:
                print(f"Error transforming article script: {e}")

        # 2. Update attributes in <article ...> tag
        m_open = re.match(r'<article\s+([^>]+)>', card_html)
        if m_open:
            open_tag = m_open.group(0)
            open_tag = re.sub(r'id="([^"]+)"', lambda m_id: f'id="{m_id.group(1).replace("-vs-", "-x-")}"', open_tag)
            open_tag = re.sub(r'data-id="([^"]+)"', lambda m_did: f'data-id="{m_did.group(1).replace("-vs-", "-x-")}"', open_tag)
            open_tag = re.sub(r'aria-label="View battle:\s*([^"]+)"', lambda m_al: f'aria-label="View battle: {fix_title(m_al.group(1))}"', open_tag)
            open_tag = re.sub(r'data-title="([^"]+)"', lambda m_dt: f'data-title="{fix_title(m_dt.group(1))}"', open_tag)
            card_html = open_tag + card_html[m_open.end(0):]

        # 3. Update img alt in card
        card_html = re.sub(r'(<img\s+[^>]*alt=")([^"]+)(")', lambda m_alt: m_alt.group(1) + fix_title(m_alt.group(2)) + m_alt.group(3), card_html)

        return card_html

    new_text = re.sub(r'<article\s+[^>]*class="versus-card"[^>]*>.*?</article>', transform_article, text, flags=re.DOTALL)

    # In checkDeepLink() fallback, support resolving old -vs- ids if someone pastes an old hash
    check_deep_link_old = 'targetId = window.location.hash.replace("#", "").trim();'
    check_deep_link_new = 'targetId = window.location.hash.replace("#", "").trim();\n        if (targetId && targetId.includes("-vs-")) targetId = targetId.replace(/-vs-/g, "-x-");'
    if check_deep_link_old in new_text and '-vs-' not in new_text[new_text.find(check_deep_link_old):new_text.find(check_deep_link_old)+200]:
        new_text = new_text.replace(check_deep_link_old, check_deep_link_new, 1)

    with open(RENDERED_GALLERY_VERSUS_PATH, "w", encoding="utf-8") as f:
        f.write(new_text)
    print("rendered_gallery/versus.html updated successfully.")

def update_rendered_versus_files():
    print(f"Renaming and updating files in {RENDERED_VERSUS_DIR}...")
    files = glob.glob(os.path.join(RENDERED_VERSUS_DIR, "*.html"))
    print(f"Found {len(files)} files.")

    for file_path in files:
        filename = os.path.basename(file_path)
        old_id = os.path.splitext(filename)[0]
        new_id = old_id.replace("-vs-", "-x-")

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Update breadcrumbs title
        content = re.sub(
            r'(<div class="gallery-breadcrumbs">.*?<span>)([^<]+)(</span></div>)',
            lambda m: m.group(1) + fix_title(m.group(2)) + m.group(3),
            content
        )
        # Update h1
        content = re.sub(
            r'(<h1 class="gallery-title">)([^<]+)(</h1>)',
            lambda m: m.group(1) + fix_title(m.group(2)) + m.group(3),
            content
        )
        # Update modal title h2
        content = re.sub(
            r'(<h2 class="versus-modal-title">)([^<]+)(</h2>)',
            lambda m: m.group(1) + fix_title(m.group(2)) + m.group(3),
            content
        )
        # Update hero alt
        content = re.sub(
            r'(<img alt=")([^"]+)(" class="versus-modal-hero-bg")',
            lambda m: m.group(1) + fix_title(m.group(2)) + m.group(3),
            content
        )

        # Update back button href
        content = content.replace(f'href="/gallery/versus/#{old_id}"', f'href="/gallery/versus/#{new_id}"')
        # Update share button data-url
        content = content.replace(f'/gallery/versus/{old_id}/', f'/gallery/versus/{new_id}/')
        # Update article id
        content = content.replace(f'<article class="versus-focus-box" id="{old_id}"', f'<article class="versus-focus-box" id="{new_id}"')

        # Target file path
        new_file_path = os.path.join(RENDERED_VERSUS_DIR, f"{new_id}.html")

        if new_file_path != file_path:
            os.remove(file_path)

        with open(new_file_path, "w", encoding="utf-8") as f:
            f.write(content)

    print("All rendered_versus files updated and renamed successfully.")

if __name__ == "__main__":
    update_versus_json()
    update_rendered_gallery_versus()
    update_rendered_versus_files()
