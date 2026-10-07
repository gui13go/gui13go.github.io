import json

json_path = '../frontend/public/data/personalities.json'
with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

for p in personalities:
    if p['name'] == 'Martin Luther':
        p['image'] = '/images/personalities/martin_luther_portrait.jpg'
        p['zoomSrc'] = '/images/personalities/martin_luther_portrait.jpg'
    elif p['name'] == 'Abraham':
        p['image'] = '/images/personalities/abraham_portrait.jpg'
        p['zoomSrc'] = '/images/personalities/abraham_portrait.jpg'
    elif p['name'] == 'Euclid':
        p['image'] = '/images/personalities/euclid_portrait.jpg'
        p['zoomSrc'] = '/images/personalities/euclid_portrait.jpg'

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(personalities, f, indent=2, ensure_ascii=False)
