import json
import os
import re
from difflib import SequenceMatcher

json_path = '../frontend/public/data/personalities.json'
img_dir = '../frontend/public/images/personalities'
artifact_path = '/home/guigo/.gemini/antigravity-ide/brain/ba8270b4-0790-4a1e-9c31-f9593833a9cf/missing_personalities.md'

with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

available_files = set(os.listdir(img_dir))

def simplify(text):
    import unicodedata
    # Remove accents
    text = ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    # Remove non-alphanumeric, lowercase
    return re.sub(r'[^a-z0-9]', '', text.lower())

def similarity(a, b):
    return SequenceMatcher(None, a, b).ratio()

available_bases = {}
for f in available_files:
    if '_portrait' in f:
        # e.g. soren_kierkegaard_portrait_123.avif -> sorenkierkegaard
        base = f.split('_portrait')[0].replace('_', '')
        available_bases[base] = f

updated = 0
missing = []

for p in personalities:
    img_name = p['image'].split('/')[-1]
    
    if img_name in available_files:
        continue
        
    p_name_sim = simplify(p['name'])
    
    best_match = None
    best_score = 0
    
    for base, f in available_bases.items():
        # Check if base is a substring of p_name_sim or vice-versa
        if base in p_name_sim or p_name_sim in base:
            score = 1.0
        else:
            score = similarity(p_name_sim, base)
            
        if score > best_score:
            best_score = score
            best_match = f
            
    if best_score > 0.8 or (best_match and best_score == 1.0):
        print(f"Matched {p['name']} to {best_match} (score {best_score:.2f})")
        # Ensure we pick the .webp or .avif or .jpg (prefer webp or avif over png if multiple exist for the same base)
        # Actually best_match is just one of them. We'll just link it.
        # But wait, let's prefer .webp
        base_match = best_match.split('.')[0]
        # try to find webp
        for ext in ['.webp', '.avif', '.jpg', '.png']:
            cand = base_match + ext
            if cand in available_files:
                best_match = cand
                break
                
        p['image'] = f"/images/personalities/{best_match}"
        p['zoomSrc'] = f"/images/personalities/{best_match}"
        updated += 1
    else:
        missing.append(p['name'])

print(f"Updated {updated} entries.")
print(f"Still missing {len(missing)}")

if updated > 0:
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(personalities, f, indent=2, ensure_ascii=False)

with open(artifact_path, 'w', encoding='utf-8') as f:
    f.write('# Missing Personalities\n\n')
    f.write(f'There are {len(missing)} personalities still missing their portrait images:\n\n')
    for m in missing:
        f.write(f'- {m}\n')
