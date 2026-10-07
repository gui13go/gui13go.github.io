import json

json_path = '../frontend/public/data/personalities.json'
with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

for p in personalities:
    # Always normalize the image path to be standard
    name = p['name']
    standard_filename = name.lower().replace(' ', '_').replace('.', '').replace('(', '').replace(')', '').replace('-', '_') + '_portrait.jpg'
    # Actually let's just do standard replacement:
    standard_filename = name.lower().replace(' ', '_') + '_portrait.jpg'
    # There are some weird chars, let's just do a basic one
    standard_filename = "".join(c if c.isalnum() else '_' for c in name.lower()) + '_portrait.jpg'
    
    # Wait, some are already correct. Let's just strip the timestamp if it matches `_17`
    img = p['image']
    if '_portrait_17' in img:
        new_img = img.split('_portrait_')[0] + '_portrait.jpg'
        p['image'] = new_img
        p['zoomSrc'] = new_img

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(personalities, f, indent=2, ensure_ascii=False)
