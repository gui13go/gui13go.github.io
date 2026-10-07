import json
import os

json_path = '../frontend/public/data/personalities.json'
img_dir = '../frontend/public/images/personalities'

with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

available_files = set(os.listdir(img_dir))

used_files = set()
for p in personalities:
    img_name = p['image'].split('/')[-1]
    used_files.add(img_name)

orphans = [f for f in available_files if f not in used_files and '_portrait' in f]
print(f"Total images: {len(available_files)}")
print(f"Used images in JSON: {len(used_files)}")
print(f"Orphaned images: {len(orphans)}")

with open('orphans.txt', 'w') as f:
    for o in orphans:
        f.write(o + '\n')
