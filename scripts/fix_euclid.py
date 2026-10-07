import json

json_path = '../frontend/public/data/personalities.json'
with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

for p in personalities:
    if p['name'] == 'Euclid':
        p['image'] = '/images/personalities/euclid_portrait.jpg'
        p['zoomSrc'] = '/images/personalities/euclid_portrait.jpg'

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(personalities, f, indent=2, ensure_ascii=False)
