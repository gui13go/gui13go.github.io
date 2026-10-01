import os
import re
from bs4 import BeautifulSoup

def update_file(slug, sort_id, grid_id, card_class, search_id, clear_id, count_id, no_results_id, search_fields, lightbox_type, extra_sort_options="", extra_setup_js="", extra_card_js="", extra_filter_js=""):
    for base_dir in ['frontend/public/rendered_gallery', 'frontend/dist/rendered_gallery']:
        fpath = os.path.join(base_dir, f'{slug}.html')
        if not os.path.exists(fpath):
            continue

        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        soup = BeautifulSoup(content, 'html.parser')

        # 1. Sort box insertion
        if not soup.select_one(f'#{sort_id}'):
            toolbar = soup.select_one('.gallery-toolbar')
            if toolbar:
                count_badge = toolbar.select_one('.gallery-count-badge, .dict-toolbar-actions, .gadgets-toolbar-controls')
                sort_html = f'''
    <div class="gallery-sort-box">
      <label for="{sort_id}" class="gallery-sort-label">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
        <span>Sort:</span>
      </label>
      <select id="{sort_id}" class="gallery-sort-select" aria-label="Sort">
        <option value="date-desc" selected>Newest to Oldest</option>
        <option value="date-asc">Oldest to Newest</option>
        <option value="name-asc">A &rarr; Z</option>
        <option value="name-desc">Z &rarr; A</option>
        {extra_sort_options}
      </select>
    </div>'''
                sort_soup = BeautifulSoup(sort_html, 'html.parser')
                if count_badge:
                    count_badge.insert_before(sort_soup)
                else:
                    toolbar.append(sort_soup)

        # 2. Lightbox logic
        lightbox_js = ""
        lightbox_bind_js = ""
        lightbox_fallback_bind_js = ""

        if lightbox_type == 'standard':
            lightbox_js = '''
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxMeta = document.getElementById('lightboxMeta');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.lightbox-close');
    const backdrop = document.querySelector('.lightbox-backdrop');

    function openLightbox(src, title, meta, caption) {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = src;
      lightboxImg.alt = title;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxMeta) lightboxMeta.textContent = meta || '';
      if (lightboxCaption) lightboxCaption.textContent = caption || '';
      lightbox.classList.add('active');
      document.body.classList.add('modal-open');
    }

    function closeLightbox() {
      if (!lightbox || !lightboxImg) return;
      lightbox.classList.remove('active');
      document.body.classList.remove('modal-open');
      setTimeout(() => { lightboxImg.src = ''; }, 250);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
'''
            lightbox_bind_js = '''
      const zoom = card.querySelector('.gallery-zoomable');
      if (zoom) {
        zoom.addEventListener('click', function() {
          openLightbox(this.dataset.zoomSrc, this.dataset.zoomTitle, this.dataset.zoomMeta, this.dataset.zoomCaption);
        });
      }
'''
            lightbox_fallback_bind_js = '''
        gridContainer.querySelectorAll('.gallery-zoomable').forEach(zoom => {
          zoom.addEventListener('click', function() {
            openLightbox(this.dataset.zoomSrc, this.dataset.zoomTitle, this.dataset.zoomMeta, this.dataset.zoomCaption);
          });
        });
'''
        elif lightbox_type == 'arts_books':
            lightbox_js = '''
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxMeta = document.getElementById('lightboxMeta');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.lightbox-close');
    const backdrop = document.querySelector('.lightbox-backdrop');

    function openLightbox(src, title, metaAuthor, metaYear, caption) {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = src;
      lightboxImg.alt = title;
      if (lightboxTitle) lightboxTitle.textContent = title;
      const metaStr = metaAuthor + (metaYear ? ' (' + metaYear + ')' : '');
      if (lightboxMeta) lightboxMeta.textContent = metaStr;
      if (lightboxCaption) lightboxCaption.textContent = caption || '';
      lightbox.classList.add('active');
      document.body.classList.add('modal-open');
    }

    function closeLightbox() {
      if (!lightbox || !lightboxImg) return;
      lightbox.classList.remove('active');
      document.body.classList.remove('modal-open');
      setTimeout(() => { lightboxImg.src = ''; }, 250);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
'''
            lightbox_bind_js = '''
      const zoom = card.querySelector('.gallery-zoomable');
      if (zoom) {
        zoom.addEventListener('click', function() {
          const author = this.dataset.zoomCreator || this.dataset.zoomAuthors || '';
          const yr = this.dataset.zoomYear || '';
          openLightbox(this.dataset.zoomSrc, this.dataset.zoomTitle, author, yr, this.dataset.zoomCaption);
        });
      }
'''
            lightbox_fallback_bind_js = '''
        gridContainer.querySelectorAll('.gallery-zoomable').forEach(zoom => {
          zoom.addEventListener('click', function() {
            const author = this.dataset.zoomCreator || this.dataset.zoomAuthors || '';
            const yr = this.dataset.zoomYear || '';
            openLightbox(this.dataset.zoomSrc, this.dataset.zoomTitle, author, yr, this.dataset.zoomCaption);
          });
        });
'''

        # Generate search matching line
        field_checks = " || ".join([f"(card.dataset.{fld} || '').toLowerCase().includes(q)" for fld in search_fields])
        field_vars = "\n".join([f"        const {fld} = (card.dataset.{fld} || '').toLowerCase();" for fld in search_fields])
        var_checks = " || ".join([f"{fld}.includes(q)" for fld in search_fields])

        new_script = f'''
<script>
(function() {{
  function initGallery() {{
    const gridContainer = document.getElementById('{grid_id}');
    const searchInput = document.getElementById('{search_id}');
    const clearBtn = document.getElementById('{clear_id}');
    const visibleCount = document.getElementById('{count_id}');
    const noResultsMsg = document.getElementById('{no_results_id}');
    const sortSelect = document.getElementById('{sort_id}');

    if (!gridContainer) return;

    {lightbox_js}
    {extra_setup_js}

    let galleryData = [];
    let currentSort = localStorage.getItem('{slug}-sort-order') || 'date-desc';
    if (sortSelect) sortSelect.value = currentSort;

    function createCardElement(item) {{
      const card = document.createElement('article');
      card.className = '{card_class}';
      if (item.dataset) {{
        Object.entries(item.dataset).forEach(([k, v]) => card.setAttribute(k, v));
      }}
      card.dataset.sortYear = item.sortYear != null ? item.sortYear : 0;
      card.dataset.sortName = (item.sortName || item.name || item.title || '').toLowerCase();
      card.innerHTML = item.html;

      {lightbox_bind_js}
      {extra_card_js}

      return card;
    }}

    function sortList(list, mode) {{
      return list.slice().sort((a, b) => {{
        const yearA = a.sortYear != null ? a.sortYear : 0;
        const yearB = b.sortYear != null ? b.sortYear : 0;
        const nameA = (a.sortName || a.name || a.title || '').toLowerCase();
        const nameB = (b.sortName || b.name || b.title || '').toLowerCase();

        switch (mode) {{
          case 'date-desc':
          case 'year-desc':
            return (yearB - yearA) || nameA.localeCompare(nameB);
          case 'date-asc':
          case 'year-asc':
            return (yearA - yearB) || nameA.localeCompare(nameB);
          case 'name-asc':
            return nameA.localeCompare(nameB);
          case 'name-desc':
            return nameB.localeCompare(nameA);
          case 'price-asc':
            return ((parseFloat(a.dataset && a.dataset['data-numeric-cost']) || 0) - (parseFloat(b.dataset && b.dataset['data-numeric-cost']) || 0));
          case 'price-desc':
            return ((parseFloat(b.dataset && b.dataset['data-numeric-cost']) || 0) - (parseFloat(a.dataset && a.dataset['data-numeric-cost']) || 0));
          default:
            return (yearB - yearA) || nameA.localeCompare(nameB);
        }}
      }});
    }}

    function renderCards(list) {{
      gridContainer.innerHTML = '';
      const fragment = document.createDocumentFragment();
      list.forEach(item => fragment.appendChild(createCardElement(item)));
      gridContainer.appendChild(fragment);
      filterCards();
    }}

    function filterCards() {{
      const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      if (clearBtn) clearBtn.style.display = q.length > 0 ? 'block' : 'none';
      const allCards = gridContainer.querySelectorAll('.{card_class}');
      let count = 0;

      allCards.forEach(card => {{
{field_vars}
        const textMatch = !q || {var_checks};
        let match = textMatch;
        {extra_filter_js}

        if (match) {{
          card.style.display = '';
          count++;
        }} else {{
          card.style.display = 'none';
        }}
      }});

      if (visibleCount) visibleCount.textContent = count;
      if (noResultsMsg) noResultsMsg.style.display = count === 0 ? 'block' : 'none';
    }}

    if (searchInput) searchInput.addEventListener('input', filterCards);
    if (clearBtn) {{
      clearBtn.addEventListener('click', function() {{
        searchInput.value = '';
        filterCards();
        searchInput.focus();
      }});
    }}

    if (sortSelect) {{
      sortSelect.addEventListener('change', function() {{
        currentSort = this.value;
        localStorage.setItem('{slug}-sort-order', currentSort);
        renderCards(sortList(galleryData, currentSort));
      }});
    }}

    fetch('/data/{slug}.json')
      .then(res => {{
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      }})
      .then(data => {{
        galleryData = data;
        renderCards(sortList(galleryData, currentSort));
      }})
      .catch(err => {{
        console.warn('Could not fetch /data/{slug}.json, using pre-rendered fallback:', err);
        {lightbox_fallback_bind_js}
        filterCards();
      }});
  }}

  if (document.readyState !== 'loading') {{
    initGallery();
  }} else {{
    document.addEventListener('DOMContentLoaded', initGallery);
  }}
}})();
</script>
'''

        # Remove existing scripts that aren't JSON-LD
        for s in soup.select('script'):
            if not s.get('src') and 'ld+json' not in s.get('type', ''):
                s.decompose()

        new_script_soup = BeautifulSoup(new_script, 'html.parser')
        main_tag = soup.select_one('main')
        if main_tag:
            main_tag.append(new_script_soup)
        else:
            soup.append(new_script_soup)

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f'Successfully updated {fpath}')

# Now process arts, books, computer-languages, network-protocols, quotes, laws, facts, jokes
update_file(
    slug='arts',
    sort_id='artSort',
    grid_id='artsGrid',
    card_class='art-card',
    search_id='artSearch',
    clear_id='clearArtSearch',
    count_id='visibleCount',
    no_results_id='noResultsMsg',
    search_fields=['title', 'creator', 'year', 'summary'],
    lightbox_type='arts_books'
)

update_file(
    slug='books',
    sort_id='bookSort',
    grid_id='booksGrid',
    card_class='book-card',
    search_id='bookSearch',
    clear_id='clearBookSearch',
    count_id='visibleCount',
    no_results_id='noResultsMsg',
    search_fields=['title', 'authors', 'year', 'summary', 'keywords'],
    lightbox_type='arts_books'
)

update_file(
    slug='computer-languages',
    sort_id='langSort',
    grid_id='languagesGrid',
    card_class='language-card',
    search_id='langSearch',
    clear_id='clearLangSearch',
    count_id='visibleCount',
    no_results_id='noResultsMsg',
    search_fields=['name', 'creator', 'year', 'typing', 'compiled', 'paradigm', 'usage', 'description'],
    lightbox_type='none'
)

update_file(
    slug='network-protocols',
    sort_id='protocolSort',
    grid_id='protocolsGrid',
    card_class='protocol-card',
    search_id='protocolSearch',
    clear_id='clearProtocolSearch',
    count_id='visibleCount',
    no_results_id='noResultsMsg',
    search_fields=['name', 'creators', 'year', 'summary', 'keywords'],
    lightbox_type='standard'
)

update_file(
    slug='quotes',
    sort_id='quoteSort',
    grid_id='quotesGrid',
    card_class='quote-card',
    search_id='quoteSearch',
    clear_id='clearQuoteSearch',
    count_id='visibleCount',
    no_results_id='noResultsMsg',
    search_fields=['text', 'author', 'origin', 'year'],
    lightbox_type='none'
)

update_file(
    slug='laws',
    sort_id='lawSort',
    grid_id='lawsGrid',
    card_class='law-card',
    search_id='lawSearch',
    clear_id='clearLawSearch',
    count_id='visibleCount',
    no_results_id='noResultsMsg',
    search_fields=['title', 'author', 'location', 'quote', 'summary', 'tags'],
    lightbox_type='standard'
)

update_file(
    slug='facts',
    sort_id='factSort',
    grid_id='factsGrid',
    card_class='fact-card',
    search_id='factSearch',
    clear_id='clearFactSearch',
    count_id='visibleCount',
    no_results_id='noResultsMsg',
    search_fields=['name', 'content', 'details', 'category'],
    lightbox_type='standard'
)

update_file(
    slug='jokes',
    sort_id='jokeSort',
    grid_id='jokesGrid',
    card_class='joke-card',
    search_id='jokeSearch',
    clear_id='clearJokeSearch',
    count_id='visibleCount',
    no_results_id='noResultsMsg',
    search_fields=['name', 'content', 'history', 'discipline'],
    lightbox_type='standard'
)

