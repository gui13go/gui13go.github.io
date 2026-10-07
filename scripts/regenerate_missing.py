import json
import os

json_path = '../frontend/public/data/personalities.json'
img_dir = '../frontend/public/images/personalities'
artifact_path = '/home/guigo/.gemini/antigravity-ide/brain/ba8270b4-0790-4a1e-9c31-f9593833a9cf/missing_personalities.md'

with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

available_files = set(os.listdir(img_dir))

missing = []

for p in personalities:
    img_name = p['image'].split('/')[-1]
    if img_name not in available_files:
        missing.append(p['name'])

with open(artifact_path, 'w', encoding='utf-8') as f:
    f.write('# Missing Personalities\n\n')
    f.write(f'There are {len(missing)} personalities still missing their portrait images:\n\n')
    for m in missing:
        f.write(f'- {m}\n')

print(f"Missing reduced to: {len(missing)}")
