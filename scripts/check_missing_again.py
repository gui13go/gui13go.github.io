import json
import os

json_path = '../frontend/public/data/personalities.json'
img_dir = '../frontend/public/images/personalities'
artifact_path = '/home/guigo/.gemini/antigravity-ide/brain/ba8270b4-0790-4a1e-9c31-f9593833a9cf/missing_personalities.md'

with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

available_files = set(os.listdir(img_dir))

missing = []
found_but_mismatched = []

for p in personalities:
    img_name = p['image'].split('/')[-1]
    
    if img_name in available_files:
        continue
        
    # Check if there is a file matching the basic name
    base_name = p['name'].lower().replace(' ', '_').replace('.', '').replace('(', '').replace(')', '').replace('-', '_') + '_portrait.jpg'
    
    match = None
    for f in available_files:
        if f.startswith(base_name.replace('_portrait.jpg', '')):
            match = f
            break
            
    if match:
        found_but_mismatched.append((p['name'], img_name, match))
        p['image'] = f'/images/personalities/{match}'
        p['zoomSrc'] = f'/images/personalities/{match}'
    else:
        missing.append(p['name'])

print(f"Missing: {len(missing)}")
print(f"Found mismatched: {len(found_but_mismatched)}")
for fm in found_but_mismatched:
    print(f" - {fm[0]}: {fm[1]} -> {fm[2]}")
    
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(personalities, f, indent=2, ensure_ascii=False)

with open(artifact_path, 'w', encoding='utf-8') as f:
    f.write('# Missing Personalities\n\n')
    f.write(f'There are {len(missing)} personalities still missing their portrait images:\n\n')
    for m in missing:
        f.write(f'- {m}\n')
