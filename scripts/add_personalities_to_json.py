import json

with open('../NOTES.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_personalities = []
for line in lines[39:510]:
    line = line.strip()
    if not line: continue
    
    name = ""
    summary = ""
    if "—" in line:
        parts = line.split("—", 1)
        name = parts[0].strip()
        summary = parts[1].strip()
    elif "-" in line:
        parts = line.split("-", 1)
        name = parts[0].strip()
        summary = parts[1].strip()
    else:
        name = line
        summary = "Historical figure"

    if name:
        new_personalities.append({
            "name": name,
            "dates": "",
            "birthYear": None,
            "summary": summary,
            "image": f"/images/personalities/{name.lower().replace(' ', '_').replace('.', '').replace('(', '').replace(')', '')}_portrait.jpg",
            "zoomSrc": f"/images/personalities/{name.lower().replace(' ', '_').replace('.', '').replace('(', '').replace(')', '')}_portrait.jpg",
            "zoomTitle": name,
            "zoomCaption": summary,
            "quote": {"text": "", "cite": ""},
            "keyWorks": [],
            "tags": []
        })

file_path = '../frontend/public/data/personalities.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

existing_names = {p.get("name", "").lower() for p in data}

count = 0
for p in new_personalities:
    if p["name"].lower() not in existing_names:
        data.append(p)
        count += 1

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Added {count} new personalities to JSON.")
