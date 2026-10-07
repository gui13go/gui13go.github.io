import json
import os
import glob
import re

json_path = '../frontend/public/data/personalities.json'
img_dir = '../frontend/public/images/personalities'

with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

available_images = os.listdir(img_dir)

import unicodedata

def slugify(name):
    s = name.lower()
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('ascii')
    s = re.sub(r'[^a-z0-9]', '_', s)
    s = re.sub(r'_+', '_', s)
    return s.strip('_')

updated_count = 0

for p in personalities:
    current_img = p['image'].split('/')[-1]
    
    if os.path.exists(os.path.join(img_dir, current_img)):
        continue
        
    slug = slugify(p['name'])
    
    match = None
    for ext in ['.webp', '.avif', '.jpg', '.png']:
        for img in available_images:
            if img.endswith(ext) and img.startswith(slug):
                match = img
                break
        if match:
            break
            
    if match:
        print(f"Matched {p['name']} -> {match}")
        p['image'] = f"/images/personalities/{match}"
        p['zoomSrc'] = f"/images/personalities/{match}"
        updated_count += 1

if updated_count > 0:
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(personalities, f, indent=2, ensure_ascii=False)
    print(f"Updated {updated_count} personalities in JSON.")
