import json

json_path = '../frontend/public/data/personalities.json'

with open(json_path, 'r', encoding='utf-8') as f:
    personalities = json.load(f)

matches = {
    'Niccolò Machiavelli': 'niccolo_machiavelli_portrait_1769566814010.webp',
    'Johann Wolfgang von Goethe': 'goethe_portrait_1769807625965.webp',
    'Simón Bolívar': 'simon_bolivar_portrait_1769849780270.avif',
    'Søren Kierkegaard': 'soren_kierkegaard_portrait_1769618784852.png',
    'Mário de Andrade': 'mario_de_andrade_portrait_1769931018775.avif',
    'Gabriel García Márquez': 'gabriel_garcia_marquez_portrait_1769849809008.avif',
    'José Mujica': 'jose_mujica_portrait_1769882702224.png',
    'Lélia Gonzalez': 'lelia_gonzalez_portrait_1769931053927.avif',
    'Slavoj Žižek': 'slavoj_zizek_portrait_1769566257509.webp',
    'Guimarães Rosa': 'guimaraes_rosa_portrait.webp',
    'William Edward Burghardt Du Bois': 'web_du_bois_portrait_1769566698742.webp',
    'Georg Wilhelm Friedrich Hegel': 'gwf_hegel_portrait_1769434211862.avif',
    'Rumi': 'rumi_portrait_1769807136444.webp',
    'Eva Perón (Evita)': 'eva_peron_portrait.webp',
    'John the Baptist': 'saint_john_the_baptist_portrait.webp'
}

updated = 0
for p in personalities:
    if p['name'] in matches:
        p['image'] = f"/images/personalities/{matches[p['name']]}"
        p['zoomSrc'] = f"/images/personalities/{matches[p['name']]}"
        updated += 1

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(personalities, f, indent=2, ensure_ascii=False)

print(f"Updated {updated} mappings.")
