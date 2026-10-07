import json

names = [
    "Gilberto Freyre",
    "Guimarães Rosa",
    "Euclides da Cunha",
    "Carlos Chagas",
    "Oswaldo Cruz",
    "Heitor Villa-Lobos",
    "Chico Buarque",
    "Caetano Veloso",
    "Gilberto Gil",
    "Pedro Alvares Cabral",
    "Salazar - Portugal president",
    "Erasmus",
    "Robespierre",
    "Brissot"
]

new_personalities = []
for name in names:
    new_personalities.append({
        "name": name,
        "dates": "",
        "birthYear": None,
        "summary": "Historical figure",
        "image": f"/images/personalities/{name.lower().replace(' ', '_').replace('.', '').replace('(', '').replace(')', '')}_portrait.jpg",
        "zoomSrc": f"/images/personalities/{name.lower().replace(' ', '_').replace('.', '').replace('(', '').replace(')', '')}_portrait.jpg",
        "zoomTitle": name,
        "zoomCaption": "Historical figure",
        "quote": {"text": "", "cite": ""},
        "keyWorks": [],
        "tags": []
    })

file_path = '../frontend/public/data/personalities.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

existing_names = {p.get("name", "").lower() for p in data}
for p in new_personalities:
    if p["name"].lower() not in existing_names:
        data.append(p)

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
