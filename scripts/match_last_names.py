import json
import os
import re

json_path = '../frontend/public/data/personalities.json'
img_dir = '../frontend/public/images/personalities'
artifact_path = '/home/guigo/.gemini/antigravity-ide/brain/ba8270b4-0790-4a1e-9c31-f9593833a9cf/missing_personalities.md'

with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

available_files = set(os.listdir(img_dir))

def simplify(text):
    import unicodedata
    text = ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', text.lower())

available_bases = {}
for f in available_files:
    if '_portrait' in f:
        base = f.split('_portrait')[0]
        # Store a simplified version for last name matching
        base_simple = base.split('_')[-1] # Usually the last token is the last name
        available_bases[f] = (base, base_simple, base.replace('_', ''))

updated = 0
missing = []

for p in personalities:
    img_name = p['image'].split('/')[-1]
    if img_name in available_files:
        continue
        
    p_name = p['name']
    name_tokens = [simplify(t) for t in p_name.split() if simplify(t)]
    
    if not name_tokens:
        missing.append(p['name'])
        continue
        
    last_name = name_tokens[-1]
    
    # Try to find a match
    best_match = None
    
    # Check if we have an exact match for the last token in the filename tokens
    for f, (base, base_simple, base_flat) in available_bases.items():
        if last_name == base_simple:
            # Let's check if the whole filename is reasonable.
            # e.g. web_du_bois_portrait -> bois. "bois" matches.
            # gwf_hegel_portrait -> hegel. "hegel" matches.
            best_match = f
            break
            
        # Or if one of the name tokens is >= 5 chars and is in the base flat
        for t in name_tokens:
            if len(t) >= 5 and t in base_flat:
                # check if there's no conflict. Just a quick heuristic.
                best_match = f
                break
        
        if best_match:
            break
            
    if best_match:
        # Prefer webp/avif
        base_match = best_match.split('.')[0]
        for ext in ['.webp', '.avif', '.jpg', '.png']:
            cand = base_match + ext
            if cand in available_files:
                best_match = cand
                break
                
        print(f"Matched {p['name']} -> {best_match}")
        p['image'] = f"/images/personalities/{best_match}"
        p['zoomSrc'] = f"/images/personalities/{best_match}"
        updated += 1
    else:
        missing.append(p['name'])

if updated > 0:
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(personalities, f, indent=2, ensure_ascii=False)
    print(f"Updated {updated} entries.")

with open(artifact_path, 'w', encoding='utf-8') as f:
    f.write('# Missing Personalities\n\n')
    f.write(f'There are {len(missing)} personalities still missing their portrait images:\n\n')
    for m in missing:
        f.write(f'- {m}\n')
print(f"Still missing {len(missing)}")
