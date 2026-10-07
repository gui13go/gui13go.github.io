import json

json_path = '../frontend/public/data/personalities.json'
with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

false_positives = {
    'Martin Luther': '/images/personalities/martin_luther_portrait.jpg',
    'Abraham': '/images/personalities/abraham_portrait.jpg',
    'Job': '/images/personalities/job_portrait.jpg',
    'Pope Leo XIII': '/images/personalities/pope_leo_xiii_portrait.jpg',
    'Pope Leo I': '/images/personalities/pope_leo_i_portrait.jpg',
    'Euclid': '/images/personalities/euclid_portrait.jpg',
}

for p in personalities:
    if p['name'] in false_positives:
        p['image'] = false_positives[p['name']]
        p['zoomSrc'] = false_positives[p['name']]

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(personalities, f, indent=2, ensure_ascii=False)
