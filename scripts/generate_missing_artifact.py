import json
import os

with open('scripts/missing_personalities_detailed.json', 'r', encoding='utf-8') as f:
    personalities = json.load(f)

# Sort chronologically
personalities.sort(key=lambda x: (x.get('birthYear') if x.get('birthYear') is not None else 9999, x['name']))

def categorize(p):
    name = p['name']
    tags = set(p.get('tags', []))
    
    if any(t in tags for t in ['Computer Science', 'Cryptography', 'Algorithms', 'Software Engineering', 'Search Engine', 'Blockchain', 'Operating Systems', 'Systems Programming']) or name in ['Terry A. Davis', 'Larry Page', 'Sergey Brin', 'Vitalik Buterin', 'Robert Tappan Morris', 'Vint Cerf']:
        return 'Computer Science, Tech & Cybersecurity'
    if any(t in tags for t in ['MPB', 'Samba', 'Bossa Nova', 'Música Brasileira', 'Violão', 'Samba-Rock']) or name in ['Elis Regina', 'João Gilberto', 'Raul Seixas', 'Tim Maia', 'Milton Nascimento', 'Jorge Ben Jor', 'Cartola', 'Pixinguinha', 'Luiz Gonzaga', 'Elza Soares']:
        return 'Brazilian Music & Cultural Icons'
    if any(t in tags for t in ['Brazil', 'Brazilian Literature']) or any(k in tags for k in ['Império do Brasil', 'Primeira República', 'Nova República', 'Ditadura Militar', 'Diretas Já', 'Constituição de 1988', 'Abolicionismo', 'Redemocratização', 'Tenentismo']):
        return 'Brazilian Statesmen, Thinkers & Historical Figures'
    if any(t in tags for t in ['Pope', 'Papacy']) or name.startswith('Pope '):
        return 'Popes & Papal History'
    if any(t in tags for t in ['Religion', 'Theology', 'Christianity', 'Islam', 'Buddhism', 'Hinduism', 'Judaism', 'Spirituality', 'Biblical', 'Gnosticism', 'Mysticism', 'Sufism', 'Zen Buddhism', 'Prophet', 'Apostle', 'Monasticism']):
        return 'World Religions, Prophets, Saints & Biblical Figures'
    if any(t in tags for t in ['Physics', 'Chemistry', 'Biology', 'Medicine', 'Astronomy', 'Nuclear Physics', 'Biochemistry', 'Genetics', 'Primatology', 'Vaccines', 'Physiology', 'Women in STEM', 'Science']):
        return 'Natural Sciences, Physics, Medicine & Biology'
    if any(t in tags for t in ['Space Exploration', 'Cosmology', 'Space Race', 'Apollo Program', 'Moon Landing', 'NASA', 'Aerospace']) or name in ['Yuri Gagarin', 'Neil Armstrong', 'Valentina Tereshkova', 'Alexei Leonov', 'Sally Ride', 'Marcos Pontes']:
        return 'Astronauts, Space Pioneers & Aerospace'
    if any(t in tags for t in ['Mathematics', 'Geometry', 'Calculus', 'Number Theory', 'Mathematical Logic', 'Algebra', 'Foundations of Mathematics']):
        return 'Mathematics, Geometry & Mathematical Logic'
    if any(t in tags for t in ['Philosophy', 'Stoicism', 'Existentialism', 'Epistemology', 'Critical Theory', 'Sociology', 'Ethics', 'Phenomenology', 'Skepticism', 'Empiricism', 'Political Philosophy']):
        return 'Philosophy, Epistemology & Social Theory'
    if any(t in tags for t in ['Economics', 'Political Economy', 'Macroeconomics', 'Market Theory', 'Game Theory', 'Microeconomics', 'Finance']):
        return 'Economics, Political Economy & Market Theory'
    if any(t in tags for t in ['Literature', 'Poetry', 'Playwriting', 'Novel', 'Dramaturgy', 'Literary Realism', 'Epic Poetry', 'Tragedy']):
        return 'World Literature, Playwriting & Poetry'
    if any(t in tags for t in ['Art', 'Painting', 'Sculpture', 'Renaissance Art', 'Impressionism', 'Surrealism', 'Architecture', 'Modernisme', 'Baroque Art']):
        return 'Visual Arts, Painting & Architecture'
    if any(t in tags for t in ['Music', 'Classical Music', 'Opera', 'Jazz', 'Rock', 'Pop Music', 'Guitar', 'Composition']):
        return 'Music Legends (Classical, Jazz, Rock & Pop)'
    if any(t in tags for t in ['Cinema', 'Film Directing', 'Acting', 'Hollywood', 'Cinema History', 'Method Acting']):
        return 'Cinema, Film Directors & Iconic Actors'
    if any(t in tags for t in ['Exploration', 'Travel', 'Navigation', 'Circumnavigation', 'Silk Road', 'Age of Discovery', 'Antarctic Exploration']):
        return 'Explorers, Navigators & Geographers'
    if any(t in tags for t in ['Sports', 'Chess', 'Athletics', 'Football', 'Boxing', 'Basketball', 'Tennis', 'Track and Field']):
        return 'Sports Legends & World Chess Champions'
    if any(t in tags for t in ['True Crime', 'Organized Crime', 'Mafia', 'Serial Killers', 'Cults', 'Fraud', 'Ponzi Scheme', 'Outlaw', 'Cangaço']):
        return 'True Crime, Outlaws & Notorious Figures'
    if any(t in tags for t in ['Indigenous Rights', 'Native American', 'Civil Rights', 'Abolitionism', 'Feminism', 'Human Rights', 'Suffrage', 'Peace', 'Environmentalism', 'Ecology']):
        return 'Civil Rights, Indigenous Leaders & Humanitarian Activism'
    return 'World Monarchs, Emperors, Military Conquerors & Statesmen'

groups = {}
for p in personalities:
    cat = categorize(p)
    groups.setdefault(cat, []).append(p)

artifact_dir = '/home/guigo/.gemini/antigravity-ide/brain/115681db-faa2-49a6-b94c-e3f4583af52f'
os.makedirs(artifact_dir, exist_ok=True)
md_path = os.path.join(artifact_dir, 'missing_gallery_personalities.md')

lines = []
lines.append('# Gallery Personalities Missing Images')
lines.append('')
lines.append('> [!NOTE]')
lines.append('> Analysis of `http://localhost:5173/gallery/personalities/` (data source: `frontend/public/rendered_gallery/personalities.html` and `frontend/public/data/personalities.json`).')
lines.append('> Out of **736 total personalities**, **383** (52.0%) have valid portraits and **353** (48.0%) are missing image files on disk.')
lines.append('')
lines.append('## Summary Statistics')
lines.append('')
lines.append('| Metric | Count | Percentage |')
lines.append('| :--- | :--- | :--- |')
lines.append('| **Total Personalities in Gallery** | 736 | 100.0% |')
lines.append('| **Personalities with Portrait/Thumbnails** | 383 | 52.0% |')
lines.append('| **Personalities Missing Portrait Images** | 353 | 48.0% |')
lines.append('')
lines.append('---')
lines.append('')

category_order = [
    'Computer Science, Tech & Cybersecurity',
    'Natural Sciences, Physics, Medicine & Biology',
    'Mathematics, Geometry & Mathematical Logic',
    'Astronauts, Space Pioneers & Aerospace',
    'Philosophy, Epistemology & Social Theory',
    'Economics, Political Economy & Market Theory',
    'Brazilian Statesmen, Thinkers & Historical Figures',
    'Brazilian Music & Cultural Icons',
    'World Religions, Prophets, Saints & Biblical Figures',
    'Popes & Papal History',
    'World Monarchs, Emperors, Military Conquerors & Statesmen',
    'Civil Rights, Indigenous Leaders & Humanitarian Activism',
    'World Literature, Playwriting & Poetry',
    'Music Legends (Classical, Jazz, Rock & Pop)',
    'Cinema, Film Directors & Iconic Actors',
    'Visual Arts, Painting & Architecture',
    'Explorers, Navigators & Geographers',
    'Sports Legends & World Chess Champions',
    'True Crime, Outlaws & Notorious Figures'
]

for cat in category_order:
    items = groups.get(cat, [])
    if not items:
        continue
    lines.append(f'## {cat} ({len(items)})')
    lines.append('')
    lines.append('| Name | Era / Dates | Summary | Expected Image Path |')
    lines.append('| :--- | :--- | :--- | :--- |')
    for p in items:
        name = p['name']
        dates = p.get('dates') or '—'
        summary = (p.get('summary') or '—').replace('|', '&#124;')
        expected = p.get('expectedImage') or '—'
        lines.append(f'| **{name}** | {dates} | {summary} | `{expected}` |')
    lines.append('')

with open(md_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'Wrote artifact to {md_path} ({os.path.getsize(md_path)} bytes)')
