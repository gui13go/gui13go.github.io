import os
import re
from bs4 import BeautifulSoup

def update_operating_systems():
    for base_dir in ['frontend/public/rendered_gallery', 'frontend/dist/rendered_gallery']:
        fpath = os.path.join(base_dir, 'operating-systems.html')
        if not os.path.exists(fpath):
            continue
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        soup = BeautifulSoup(content, 'html.parser')

        # 1. Add sort box if not already present
        if not soup.select_one('#osSort'):
            toolbar = soup.select_one('.gallery-toolbar')
            if toolbar:
                count_badge = toolbar.select_one('.gallery-count-badge')
                sort_html = '''
    <div class="gallery-sort-box">
      <label for="osSort" class="gallery-sort-label">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
        <span>Sort:</span>
      </label>
      <select id="osSort" class="gallery-sort-select" aria-label="Sort operating systems">
        <option value="date-desc" selected>Newest to Oldest</option>
        <option value="date-asc">Oldest to Newest</option>
        <option value="name-asc">Name (A &rarr; Z)</option>
        <option value="name-desc">Name (Z &rarr; A)</option>
      </select>
    </div>'''
                sort_soup = BeautifulSoup(sort_html, 'html.parser')
                if count_badge:
                    count_badge.insert_before(sort_soup)
                else:
                    toolbar.append(sort_soup)

        # 2. Replace script
        new_script = '''
<script>
(function() {
  function initOS() {
    const gridContainer = document.getElementById('osGrid');
    const searchInput = document.getElementById('osSearch');
    const clearBtn = document.getElementById('clearOsSearch');
    const visibleCount = document.getElementById('visibleCount');
    const noResultsMsg = document.getElementById('noResultsMsg');
    const sortSelect = document.getElementById('osSort');

    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxMeta = document.getElementById('lightboxMeta');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.lightbox-close');
    const backdrop = document.querySelector('.lightbox-backdrop');

    if (!gridContainer) return;

    let osData = [];
    let currentSort = localStorage.getItem('os-sort-order') || 'date-desc';
    if (sortSelect) sortSelect.value = currentSort;

    function openLightbox(src, title, meta, caption) {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = src;
      lightboxImg.alt = title;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxMeta) lightboxMeta.textContent = meta || '';
      if (lightboxCaption) lightboxCaption.textContent = caption;
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

    function createCardElement(item) {
      const card = document.createElement('article');
      card.className = 'os-card';
      if (item.dataset) {
        Object.entries(item.dataset).forEach(([k, v]) => card.setAttribute(k, v));
      }
      card.dataset.sortYear = item.sortYear != null ? item.sortYear : 0;
      card.dataset.sortName = (item.sortName || item.name || '').toLowerCase();
      card.innerHTML = item.html;

      const zoom = card.querySelector('.gallery-zoomable');
      if (zoom) {
        zoom.addEventListener('click', function() {
          openLightbox(this.dataset.zoomSrc, this.dataset.zoomTitle, this.dataset.zoomMeta, this.dataset.zoomCaption);
        });
      }
      return card;
    }

    function sortList(list, mode) {
      return list.slice().sort((a, b) => {
        const yearA = a.sortYear != null ? a.sortYear : 0;
        const yearB = b.sortYear != null ? b.sortYear : 0;
        const nameA = (a.sortName || a.name || '').toLowerCase();
        const nameB = (b.sortName || b.name || '').toLowerCase();

        switch (mode) {
          case 'date-desc':
            return (yearB - yearA) || nameA.localeCompare(nameB);
          case 'date-asc':
            return (yearA - yearB) || nameA.localeCompare(nameB);
          case 'name-asc':
            return nameA.localeCompare(nameB);
          case 'name-desc':
            return nameB.localeCompare(nameA);
          default:
            return (yearB - yearA) || nameA.localeCompare(nameB);
        }
      });
    }

    function renderCards(list) {
      gridContainer.innerHTML = '';
      const fragment = document.createDocumentFragment();
      list.forEach(item => fragment.appendChild(createCardElement(item)));
      gridContainer.appendChild(fragment);
      filterCards();
    }

    function filterCards() {
      const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      if (clearBtn) clearBtn.style.display = q.length > 0 ? 'block' : 'none';
      const allCards = gridContainer.querySelectorAll('.os-card');
      let count = 0;

      allCards.forEach(card => {
        const name = card.dataset.name || '';
        const type = card.dataset.type || '';
        const based = card.dataset.based || '';
        const usecase = card.dataset.usecase || '';
        const kernel = card.dataset.kernel || '';
        const features = card.dataset.features || '';
        const description = card.dataset.description || '';

        const match = !q || name.includes(q) || type.includes(q) || based.includes(q) || usecase.includes(q) || kernel.includes(q) || features.includes(q) || description.includes(q);
        if (match) {
          card.style.display = '';
          count++;
        } else {
          card.style.display = 'none';
        }
      });

      if (visibleCount) visibleCount.textContent = count;
      if (noResultsMsg) noResultsMsg.style.display = count === 0 ? 'block' : 'none';
    }

    if (searchInput) searchInput.addEventListener('input', filterCards);
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        filterCards();
        searchInput.focus();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        localStorage.setItem('os-sort-order', currentSort);
        renderCards(sortList(osData, currentSort));
      });
    }

    fetch('/data/operating-systems.json')
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        osData = data;
        renderCards(sortList(osData, currentSort));
      })
      .catch(err => {
        console.warn('Could not fetch /data/operating-systems.json, using pre-rendered fallback:', err);
        gridContainer.querySelectorAll('.gallery-zoomable').forEach(zoom => {
          zoom.addEventListener('click', function() {
            openLightbox(this.dataset.zoomSrc, this.dataset.zoomTitle, this.dataset.zoomMeta, this.dataset.zoomCaption);
          });
        });
        filterCards();
      });
  }

  if (document.readyState !== 'loading') {
    initOS();
  } else {
    document.addEventListener('DOMContentLoaded', initOS);
  }
})();
</script>
'''
        # Replace existing inline script
        scripts = soup.select('script')
        for s in scripts:
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
        print(f'Updated {fpath}')

update_operating_systems()
