import os
from bs4 import BeautifulSoup

def update_gadgets():
    for base_dir in ['frontend/public/rendered_gallery', 'frontend/dist/rendered_gallery']:
        fpath = os.path.join(base_dir, 'gadgets.html')
        if not os.path.exists(fpath):
            continue
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        soup = BeautifulSoup(content, 'html.parser')

        # 1. Update sort select options
        sort_select = soup.select_one('#gadgetSort')
        if sort_select:
            sort_select.clear()
            opts_html = '''<option value="year-desc" selected>Newest to Oldest</option>
<option value="year-asc">Oldest to Newest</option>
<option value="name-asc">Name (A &rarr; Z)</option>
<option value="name-desc">Name (Z &rarr; A)</option>
<option value="price-asc">Price (Low to High)</option>
<option value="price-desc">Price (High to Low)</option>'''
            sort_select.append(BeautifulSoup(opts_html, 'html.parser'))

        # 2. Update script
        new_script = '''
<script>
document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("gadgetSearch");
  const clearBtn = document.getElementById("clearGadgetSearch");
  const sortSelect = document.getElementById("gadgetSort");
  const categoryChips = document.querySelectorAll(".gadget-chip");
  const tagPills = document.querySelectorAll(".gadget-tag-pill");
  const gridContainer = document.getElementById("gadgetsGrid");
  const visibleCount = document.getElementById("visibleCount");
  const noResultsMsg = document.getElementById("noResultsMsg");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const randomBtn = document.getElementById("randomGadgetBtn");
  const activeTagBanner = document.getElementById("activeTagFilterBanner");
  const activeFilterName = document.getElementById("activeFilterName");
  const clearActiveFilterBtn = document.getElementById("clearActiveFilterBtn");

  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxMeta = document.getElementById("lightboxMeta");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.querySelector(".lightbox-close");
  const backdrop = document.querySelector(".lightbox-backdrop");

  let activeCategory = "ALL";
  let activeTag = "";
  let gadgetList = [];
  let currentSort = localStorage.getItem("gadgets-sort-order") || "year-desc";
  if (sortSelect) sortSelect.value = currentSort;

  const categoryMap = {
    sbc: ["sbc", "linux", "desktop"],
    microcontroller: ["microcontroller", "arduino", "esp32", "esp8266", "stm32", "rp2040", "attiny85", "nordic", "arm cortex-m"],
    pentesting: ["pentesting", "hacking", "auditing", "rf analysis", "deauther", "surveillance"],
    keystroke: ["badusb", "hid", "keystroke injection", "keystroke", "injection", "usb attack"],
    implant: ["implant", "lan tap", "packet capture", "sniffing", "network audit", "network implant", "mitm", "video interception"],
    rf: ["lora", "mesh", "sub-ghz", "rf analysis", "sdr", "radio", "wi-fi", "bluetooth", "ble", "nfc", "rfid"],
    iot: ["iot", "low power", "low cost", "diy", "maker", "micropython"]
  };

  function matchesCategory(card, cat) {
    if (cat === "ALL") return true;
    const keywords = categoryMap[cat] || [cat];
    const cardKeywords = card.dataset.keywords || "";
    const cardSystems = card.dataset.systems || "";
    const cardDesc = card.dataset.description || "";
    const cardName = card.dataset.name || "";
    const fullText = `${cardKeywords} ${cardSystems} ${cardDesc} ${cardName}`.toLowerCase();
    return keywords.some(k => fullText.includes(k));
  }

  function openLightbox(src, title, meta, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxMeta) lightboxMeta.innerHTML = meta || "";
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    lightbox.classList.add("active");
    document.body.classList.add("modal-open");
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("active");
    document.body.classList.remove("modal-open");
    setTimeout(() => { lightboxImg.src = ""; }, 250);
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (backdrop) backdrop.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });

  function createCardElement(item) {
    const card = document.createElement("article");
    card.className = "gadget-card";
    if (item.id) card.id = item.id;
    if (item.dataset) {
      Object.entries(item.dataset).forEach(([k, v]) => card.setAttribute(k, v));
    }
    card.dataset.sortYear = item.sortYear != null ? item.sortYear : 0;
    card.dataset.sortName = (item.sortName || item.name || "").toLowerCase();
    card.innerHTML = item.html;

    const zoom = card.querySelector(".gallery-zoomable");
    if (zoom) {
      zoom.addEventListener("click", function() {
        openLightbox(this.dataset.zoomSrc, this.dataset.zoomTitle, this.dataset.zoomMeta, this.dataset.zoomCaption);
      });
    }

    card.querySelectorAll(".gadget-tag-pill").forEach(pill => {
      pill.addEventListener("click", function(e) {
        e.stopPropagation();
        activeTag = this.dataset.tag || "";
        filterCards();
        gridContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    return card;
  }

  function sortList(list, mode) {
    return list.slice().sort((a, b) => {
      const yearA = a.sortYear != null ? a.sortYear : 0;
      const yearB = b.sortYear != null ? b.sortYear : 0;
      const nameA = (a.sortName || a.name || "").toLowerCase();
      const nameB = (b.sortName || b.name || "").toLowerCase();
      const costA = parseFloat(a.dataset && a.dataset["data-numeric-cost"]) || 0;
      const costB = parseFloat(b.dataset && b.dataset["data-numeric-cost"]) || 0;

      switch (mode) {
        case "year-desc":
        case "date-desc":
          return (yearB - yearA) || nameA.localeCompare(nameB);
        case "year-asc":
        case "date-asc":
          return (yearA - yearB) || nameA.localeCompare(nameB);
        case "name-asc":
          return nameA.localeCompare(nameB);
        case "name-desc":
          return nameB.localeCompare(nameA);
        case "price-asc":
          return (costA - costB) || nameA.localeCompare(nameB);
        case "price-desc":
          return (costB - costA) || nameA.localeCompare(nameB);
        default:
          return (yearB - yearA) || nameA.localeCompare(nameB);
      }
    });
  }

  function renderCards(list) {
    gridContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    list.forEach(item => fragment.appendChild(createCardElement(item)));
    gridContainer.appendChild(fragment);
    filterCards();
  }

  function filterCards() {
    const q = searchInput ? searchInput.value.trim().toLowerCase() : "";
    if (clearBtn) clearBtn.style.display = q.length > 0 ? "block" : "none";
    if (activeTag) {
      if (activeTagBanner) activeTagBanner.style.display = "flex";
      if (activeFilterName) activeFilterName.textContent = "#" + activeTag;
    } else {
      if (activeTagBanner) activeTagBanner.style.display = "none";
    }

    const cards = gridContainer.querySelectorAll(".gadget-card");
    let count = 0;

    cards.forEach(card => {
      const name = card.dataset.name || "";
      const developers = card.dataset.developers || "";
      const year = card.dataset.year || "";
      const cost = card.dataset.cost || "";
      const systems = card.dataset.systems || "";
      const gpio = card.dataset.gpio || "";
      const dimensions = card.dataset.dimensions || "";
      const legal = card.dataset.legal || "";
      const features = card.dataset.features || "";
      const description = card.dataset.description || "";
      const keywords = card.dataset.keywords || "";

      const textMatch = !q || name.includes(q) || developers.includes(q) || year.includes(q) ||
        cost.toLowerCase().includes(q) || systems.includes(q) || gpio.includes(q) ||
        dimensions.includes(q) || legal.includes(q) || features.includes(q) ||
        description.includes(q) || keywords.includes(q);

      const catMatch = matchesCategory(card, activeCategory);
      const tagMatch = !activeTag || keywords.includes(activeTag.toLowerCase());

      if (textMatch && catMatch && tagMatch) {
        card.style.display = "";
        count++;
      } else {
        card.style.display = "none";
      }
    });

    if (visibleCount) visibleCount.textContent = count;
    if (noResultsMsg) noResultsMsg.style.display = count === 0 ? "block" : "none";
  }

  if (searchInput) searchInput.addEventListener("input", filterCards);
  if (clearBtn) {
    clearBtn.addEventListener("click", function() {
      searchInput.value = "";
      filterCards();
      searchInput.focus();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function() {
      currentSort = this.value;
      localStorage.setItem("gadgets-sort-order", currentSort);
      renderCards(sortList(gadgetList, currentSort));
    });
  }

  categoryChips.forEach(chip => {
    chip.addEventListener("click", function() {
      categoryChips.forEach(c => c.classList.remove("active"));
      this.classList.add("active");
      activeCategory = this.dataset.category || "ALL";
      activeTag = "";
      filterCards();
    });
  });

  if (clearActiveFilterBtn) {
    clearActiveFilterBtn.addEventListener("click", function() {
      activeTag = "";
      filterCards();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", function() {
      if (searchInput) searchInput.value = "";
      activeCategory = "ALL";
      activeTag = "";
      categoryChips.forEach(c => c.classList.toggle("active", c.dataset.category === "ALL"));
      currentSort = "year-desc";
      if (sortSelect) sortSelect.value = "year-desc";
      localStorage.setItem("gadgets-sort-order", currentSort);
      renderCards(sortList(gadgetList, currentSort));
    });
  }

  if (randomBtn) {
    randomBtn.addEventListener("click", function() {
      const visible = Array.from(gridContainer.querySelectorAll(".gadget-card")).filter(c => c.style.display !== "none");
      if (visible.length === 0) return;
      const target = visible[Math.floor(Math.random() * visible.length)];
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.remove("gadget-highlight-pulse");
      void target.offsetWidth;
      target.classList.add("gadget-highlight-pulse");
      setTimeout(() => target.classList.remove("gadget-highlight-pulse"), 2500);
    });
  }

  document.addEventListener("keydown", function(e) {
    if (e.key === "/" && document.activeElement !== searchInput && !["input", "textarea"].includes((document.activeElement.tagName || "").toLowerCase())) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  fetch("/data/gadgets.json")
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(data => {
      gadgetList = data;
      renderCards(sortList(gadgetList, currentSort));
    })
    .catch(err => {
      console.warn("Could not fetch /data/gadgets.json, using pre-rendered fallback:", err);
      gridContainer.querySelectorAll(".gallery-zoomable").forEach(zoom => {
        zoom.addEventListener("click", function() {
          openLightbox(this.dataset.zoomSrc, this.dataset.zoomTitle, this.dataset.zoomMeta, this.dataset.zoomCaption);
        });
      });
      gridContainer.querySelectorAll(".gadget-tag-pill").forEach(pill => {
        pill.addEventListener("click", function(e) {
          e.stopPropagation();
          activeTag = this.dataset.tag || "";
          filterCards();
        });
      });
      filterCards();
    });
});
</script>
'''

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
        print(f'Updated {fpath}')

def update_versus():
    for base_dir in ['frontend/public/rendered_gallery', 'frontend/dist/rendered_gallery']:
        fpath = os.path.join(base_dir, 'versus.html')
        if not os.path.exists(fpath):
            continue
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        soup = BeautifulSoup(content, 'html.parser')

        # 1. Add sort box
        if not soup.select_one('#versusSort'):
            toolbar = soup.select_one('.gallery-toolbar')
            if toolbar:
                count_badge = toolbar.select_one('.gallery-count-badge')
                sort_html = '''
    <div class="gallery-sort-box">
      <label for="versusSort" class="gallery-sort-label">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
        <span>Sort:</span>
      </label>
      <select id="versusSort" class="gallery-sort-select" aria-label="Sort versus battles">
        <option value="date-desc" selected>Newest to Oldest</option>
        <option value="date-asc">Oldest to Newest</option>
        <option value="name-asc">A &rarr; Z</option>
        <option value="name-desc">Z &rarr; A</option>
      </select>
    </div>'''
                sort_soup = BeautifulSoup(sort_html, 'html.parser')
                if count_badge:
                    count_badge.insert_before(sort_soup)
                else:
                    toolbar.append(sort_soup)

        # 2. Update script
        new_script = '''
<script>
document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("versusSearch");
  const clearBtn = document.getElementById("clearVersusSearch");
  const gridContainer = document.getElementById("versusGrid");
  const visibleCount = document.getElementById("visibleCount");
  const noResultsMsg = document.getElementById("noResultsMsg");
  const sortSelect = document.getElementById("versusSort");

  const modal = document.getElementById("versusModal");
  const modalClose = document.querySelector(".versus-modal-close");
  const modalBackdrop = document.querySelector(".versus-modal-backdrop");
  const modalHeroImg = document.getElementById("modalHeroImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const modalNameA = document.getElementById("modalNameA");
  const modalDescA = document.getElementById("modalDescA");
  const modalNameB = document.getElementById("modalNameB");
  const modalDescB = document.getElementById("modalDescB");
  const modalDiffsList = document.getElementById("modalDifferencesList");
  const modalCommonCard = document.getElementById("modalCommonGroundCard");
  const modalCommon = document.getElementById("modalCommonGround");
  const modalWinnerCard = document.getElementById("modalWinnerCard");
  const modalWinner = document.getElementById("modalWinner");
  const modalDirectLink = document.getElementById("modalDirectLink");
  const modalCopyBtn = document.getElementById("modalCopyBtn");
  const modalCopyText = document.getElementById("modalCopyText");

  let currentBattleId = null;
  let versusData = [];
  let currentSort = localStorage.getItem("versus-sort-order") || "date-desc";
  if (sortSelect) sortSelect.value = currentSort;

  function escapeHtml(s) {
    return s ? s.replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c] || c)) : '';
  }

  function openModal(data, updateHistory = true) {
    if (!data || !modal) return;
    currentBattleId = data.id;
    if (modalHeroImg) {
      modalHeroImg.src = data.image || "";
      modalHeroImg.alt = data.title || "";
    }
    if (modalTitle) modalTitle.textContent = data.title || "";
    if (modalSubtitle) {
      modalSubtitle.innerHTML = data.subtitle ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" x2="19" y1="19" y2="13"></line><line x1="16" x2="20" y1="16" y2="20"></line><line x1="19" x2="21" y1="21" y2="19"></line><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"></polyline><line x1="5" x2="9" y1="14" y2="18"></line><line x1="7" x2="4" y1="17" y2="20"></line><line x1="3" x2="5" y1="19" y2="21"></line></svg><span>' + escapeHtml(data.subtitle) + '</span>' : '';
    }
    const eA = data.entityA || {};
    const eB = data.entityB || {};
    if (modalNameA) modalNameA.textContent = eA.name || "Side A";
    if (modalDescA) modalDescA.textContent = eA.description || "";
    if (modalNameB) modalNameB.textContent = eB.name || "Side B";
    if (modalDescB) modalDescB.textContent = eB.description || "";

    if (modalDirectLink) modalDirectLink.href = "/gallery/versus/" + data.id + "/";
    if (modalDiffsList) {
      modalDiffsList.innerHTML = "";
      const diffs = data.differences || [];
      if (diffs.length > 0) {
        diffs.forEach(d => {
          const li = document.createElement("li");
          li.className = "versus-diff-item";
          const parts = d.split(/\\s+vs\\.?\\s+/i);
          if (parts.length === 2) {
            li.innerHTML = '<span class="diff-bullet"></span><span class="diff-content"><strong class="diff-part-a">' + escapeHtml(parts[0]) + '</strong> <span class="diff-versus-tag">VS</span> <strong class="diff-part-b">' + escapeHtml(parts[1]) + '</strong></span>';
          } else {
            li.innerHTML = '<span class="diff-bullet"></span><span class="diff-content">' + escapeHtml(d) + '</span>';
          }
          modalDiffsList.appendChild(li);
        });
        const diffPanel = document.querySelector(".versus-differences-panel");
        if (diffPanel) diffPanel.style.display = "block";
      }
    }

    if (modalCommonCard && modalCommon) {
      if (data.commonGround && data.commonGround.trim()) {
        modalCommon.textContent = data.commonGround;
        modalCommonCard.style.display = "flex";
      } else {
        modalCommonCard.style.display = "none";
      }
    }

    if (modalWinnerCard && modalWinner) {
      if (data.winner && data.winner.trim()) {
        modalWinner.textContent = "“" + data.winner + "”";
        modalWinnerCard.style.display = "flex";
      } else {
        modalWinnerCard.style.display = "none";
      }
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (updateHistory && history.replaceState) {
      history.replaceState(null, "", "#" + data.id);
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    currentBattleId = null;
    if (history.replaceState) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    setTimeout(() => { if (modalHeroImg) modalHeroImg.src = ""; }, 250);
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeModal();
    }
  });

  if (modalCopyBtn) {
    modalCopyBtn.addEventListener("click", function() {
      if (!currentBattleId) return;
      const url = window.location.origin + "/gallery/versus/" + currentBattleId + "/";
      navigator.clipboard.writeText(url).then(() => {
        if (modalCopyText) modalCopyText.textContent = "Copied!";
        modalCopyBtn.classList.add("copied");
        setTimeout(() => {
          if (modalCopyText) modalCopyText.textContent = "Copy Link";
          modalCopyBtn.classList.remove("copied");
        }, 2200);
      }).catch(() => {
        prompt("Copy link to this battle:", url);
      });
    });
  }

  function createCardElement(item) {
    const card = document.createElement("article");
    card.className = "versus-card";
    if (item.id) card.id = item.id;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", "View battle: " + (item.title || item.name || ""));
    if (item.dataset) {
      Object.entries(item.dataset).forEach(([k, v]) => card.setAttribute(k, v));
    }
    card.dataset.sortYear = item.sortYear != null ? item.sortYear : 0;
    card.dataset.sortName = (item.sortName || item.name || item.title || "").toLowerCase();
    card.innerHTML = item.html;

    function handleCardClick() {
      const payloadScript = card.querySelector(".versus-data-payload");
      if (payloadScript) {
        try {
          const payload = JSON.parse(payloadScript.textContent);
          openModal(payload);
          return;
        } catch (e) {}
      }
      openModal(item);
    }

    card.addEventListener("click", handleCardClick);
    card.addEventListener("keydown", function(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardClick();
      }
    });

    return card;
  }

  function sortList(list, mode) {
    return list.slice().sort((a, b) => {
      const yearA = a.sortYear != null ? a.sortYear : 0;
      const yearB = b.sortYear != null ? b.sortYear : 0;
      const nameA = (a.sortName || a.name || a.title || "").toLowerCase();
      const nameB = (b.sortName || b.name || b.title || "").toLowerCase();

      switch (mode) {
        case "date-desc":
          return (yearB - yearA) || nameA.localeCompare(nameB);
        case "date-asc":
          return (yearA - yearB) || nameA.localeCompare(nameB);
        case "name-asc":
          return nameA.localeCompare(nameB);
        case "name-desc":
          return nameB.localeCompare(nameA);
        default:
          return (yearB - yearA) || nameA.localeCompare(nameB);
      }
    });
  }

  function renderCards(list) {
    gridContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    list.forEach(item => fragment.appendChild(createCardElement(item)));
    gridContainer.appendChild(fragment);
    filterCards();
  }

  function filterCards() {
    const q = searchInput ? searchInput.value.trim().toLowerCase() : "";
    if (clearBtn) clearBtn.style.display = q.length > 0 ? "block" : "none";
    const cards = gridContainer.querySelectorAll(".versus-card");
    let count = 0;

    cards.forEach(card => {
      const title = (card.dataset.title || "").toLowerCase();
      const subtitle = (card.dataset.subtitle || "").toLowerCase();
      const entityA = (card.dataset.entityA || "").toLowerCase();
      const descA = (card.dataset.descA || "").toLowerCase();
      const entityB = (card.dataset.entityB || "").toLowerCase();
      const descB = (card.dataset.descB || "").toLowerCase();
      const diffs = (card.dataset.differences || "").toLowerCase();
      const common = (card.dataset.commonground || "").toLowerCase();
      const winner = (card.dataset.winner || "").toLowerCase();

      const match = !q || title.includes(q) || subtitle.includes(q) || entityA.includes(q) ||
        descA.includes(q) || entityB.includes(q) || descB.includes(q) || diffs.includes(q) ||
        common.includes(q) || winner.includes(q);

      if (match) {
        card.style.display = "";
        count++;
      } else {
        card.style.display = "none";
      }
    });

    if (visibleCount) visibleCount.textContent = count;
    if (noResultsMsg) noResultsMsg.style.display = count === 0 ? "block" : "none";
  }

  if (searchInput) searchInput.addEventListener("input", filterCards);
  if (clearBtn) {
    clearBtn.addEventListener("click", function() {
      searchInput.value = "";
      filterCards();
      searchInput.focus();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function() {
      currentSort = this.value;
      localStorage.setItem("versus-sort-order", currentSort);
      renderCards(sortList(versusData, currentSort));
    });
  }

  function checkDeepLink() {
    let id = "";
    if (window.location.hash) {
      id = window.location.hash.replace("#", "").trim();
    } else {
      const params = new URLSearchParams(window.location.search);
      id = params.get("battle") || params.get("id") || "";
    }
    if (id) {
      const card = document.getElementById(id) || document.querySelector('[data-id="' + id + '"]');
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("focused-target");
        const payloadScript = card.querySelector(".versus-data-payload");
        if (payloadScript) {
          try {
            openModal(JSON.parse(payloadScript.textContent), false);
          } catch(e) {}
        }
      }
    }
  }

  fetch("/data/versus.json")
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(data => {
      versusData = data;
      renderCards(sortList(versusData, currentSort));
      checkDeepLink();
    })
    .catch(err => {
      console.warn("Could not fetch /data/versus.json, using pre-rendered fallback:", err);
      gridContainer.querySelectorAll(".versus-card").forEach(c => {
        c.addEventListener("click", function() {
          const payloadScript = this.querySelector(".versus-data-payload");
          if (payloadScript) {
            try {
              openModal(JSON.parse(payloadScript.textContent));
            } catch(e) {}
          }
        });
      });
      filterCards();
      checkDeepLink();
    });

  window.addEventListener("hashchange", checkDeepLink);
});
</script>
'''

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
        print(f'Updated {fpath}')

def update_dictionary():
    for base_dir in ['frontend/public/rendered_gallery', 'frontend/dist/rendered_gallery']:
        fpath = os.path.join(base_dir, 'dictionary.html')
        if not os.path.exists(fpath):
            continue
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        soup = BeautifulSoup(content, 'html.parser')

        # 1. Add sort box
        if not soup.select_one('#dictSort'):
            actions = soup.select_one('.dict-toolbar-actions')
            sort_html = '''
    <div class="gallery-sort-box dict-sort-box">
      <label for="dictSort" class="gallery-sort-label">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
        <span>Sort:</span>
      </label>
      <select id="dictSort" class="gallery-sort-select" aria-label="Sort dictionary terms">
        <option value="name-asc" selected>A &rarr; Z</option>
        <option value="name-desc">Z &rarr; A</option>
        <option value="date-desc">Newest to Oldest</option>
        <option value="date-asc">Oldest to Newest</option>
      </select>
    </div>'''
            sort_soup = BeautifulSoup(sort_html, 'html.parser')
            if actions:
                random_btn = actions.select_one('#randomTermBtn')
                if random_btn:
                    random_btn.insert_before(sort_soup)
                else:
                    actions.insert(0, sort_soup)

        # 2. Update script
        new_script = '''
<script>
document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("dictSearch");
  const clearBtn = document.getElementById("clearDictSearch");
  const gridContainer = document.getElementById("dictionaryGrid");
  const visibleCount = document.getElementById("visibleCount");
  const noResultsMsg = document.getElementById("noResultsMsg");
  const letterButtons = Array.from(document.querySelectorAll(".dict-letter-btn"));
  const topicChips = Array.from(document.querySelectorAll(".dict-chip"));
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const randomBtn = document.getElementById("randomTermBtn");
  const toast = document.getElementById("dictToast");
  const sortSelect = document.getElementById("dictSort");

  let activeLetter = "ALL";
  let activeTopic = "ALL";
  let dictData = [];
  let currentSort = localStorage.getItem("dictionary-sort-order") || "name-asc";
  if (sortSelect) sortSelect.value = currentSort;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("visible");
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.classList.remove("visible"); }, 2200);
  }

  function createCardElement(item) {
    const card = document.createElement("article");
    card.className = "dict-card";
    if (item.id) card.id = item.id;
    if (item.dataset) {
      Object.entries(item.dataset).forEach(([k, v]) => card.setAttribute(k, v));
    }
    card.dataset.sortYear = item.sortYear != null ? item.sortYear : 0;
    card.dataset.sortName = (item.sortName || item.name || item.term || "").toLowerCase();
    card.innerHTML = item.html;
    return card;
  }

  function sortList(list, mode) {
    return list.slice().sort((a, b) => {
      const yearA = a.sortYear != null ? a.sortYear : 0;
      const yearB = b.sortYear != null ? b.sortYear : 0;
      const nameA = (a.sortName || a.name || a.term || "").toLowerCase();
      const nameB = (b.sortName || b.name || b.term || "").toLowerCase();

      switch (mode) {
        case "name-asc":
          return nameA.localeCompare(nameB);
        case "name-desc":
          return nameB.localeCompare(nameA);
        case "date-desc":
          return (yearB - yearA) || nameA.localeCompare(nameB);
        case "date-asc":
          return (yearA - yearB) || nameA.localeCompare(nameB);
        default:
          return nameA.localeCompare(nameB);
      }
    });
  }

  function renderCards(list) {
    gridContainer.innerHTML = "";
    const fragment = document.createDocumentFragment();
    list.forEach(item => fragment.appendChild(createCardElement(item)));
    gridContainer.appendChild(fragment);
    filterCards();
  }

  function filterCards() {
    const q = searchInput ? searchInput.value.trim().toLowerCase() : "";
    if (clearBtn) clearBtn.style.display = q.length > 0 ? "block" : "none";
    const cards = gridContainer.querySelectorAll(".dict-card");
    let count = 0;

    cards.forEach(card => {
      const term = (card.dataset.term || "").toLowerCase();
      const letter = (card.dataset.letter || "").toUpperCase();
      const keywords = (card.dataset.keywords || "").toLowerCase();
      const usecases = (card.dataset.usecases || "").toLowerCase();
      const facts = (card.dataset.facts || "").toLowerCase();
      const def = (card.dataset.definition || "").toLowerCase();

      const letterMatch = activeLetter === "ALL" || letter === activeLetter;
      const topicMatch = activeTopic === "ALL" || keywords.includes(activeTopic) || term.includes(activeTopic);
      const textMatch = !q || term.includes(q) || def.includes(q) || keywords.includes(q) || usecases.includes(q) || facts.includes(q);

      if (letterMatch && topicMatch && textMatch) {
        card.style.display = "";
        count++;
      } else {
        card.style.display = "none";
      }
    });

    if (visibleCount) visibleCount.textContent = count;
    if (noResultsMsg) noResultsMsg.style.display = count === 0 ? "block" : "none";
  }

  if (searchInput) searchInput.addEventListener("input", filterCards);
  if (clearBtn) {
    clearBtn.addEventListener("click", function() {
      searchInput.value = "";
      filterCards();
      searchInput.focus();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function() {
      currentSort = this.value;
      localStorage.setItem("dictionary-sort-order", currentSort);
      renderCards(sortList(dictData, currentSort));
    });
  }

  letterButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      letterButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      activeLetter = this.dataset.letter || "ALL";
      filterCards();
    });
  });

  topicChips.forEach(chip => {
    chip.addEventListener("click", function() {
      topicChips.forEach(c => c.classList.remove("active"));
      this.classList.add("active");
      activeTopic = (this.dataset.topic || "ALL").toLowerCase();
      filterCards();
    });
  });

  document.addEventListener("click", function(e) {
    const kwBtn = e.target.closest(".dict-keyword-tag");
    if (kwBtn) {
      const kw = kwBtn.dataset.keyword;
      if (kw && searchInput) {
        searchInput.value = kw;
        activeLetter = "ALL";
        activeTopic = "ALL";
        letterButtons.forEach(b => b.classList.toggle("active", b.dataset.letter === "ALL"));
        topicChips.forEach(c => c.classList.toggle("active", c.dataset.topic === "ALL"));
        filterCards();
        window.scrollTo({ top: searchInput.getBoundingClientRect().top + window.pageYOffset - 100, behavior: "smooth" });
      }
    }

    const copyBtn = e.target.closest(".copy-link-btn");
    if (copyBtn) {
      const slug = copyBtn.dataset.slug;
      const url = window.location.origin + window.location.pathname + "#" + slug;
      navigator.clipboard.writeText(url).then(() => {
        showToast("Link copied: " + url);
      }).catch(() => {
        const inp = document.createElement("input");
        inp.value = url;
        document.body.appendChild(inp);
        inp.select();
        document.execCommand("copy");
        document.body.removeChild(inp);
        showToast("Link copied!");
      });
    }

    const speakBtn = e.target.closest(".speak-term-btn");
    if (speakBtn) {
      const speech = speakBtn.dataset.speech;
      if ("speechSynthesis" in window && speech) {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(speech);
        ut.rate = 1;
        ut.lang = "en-US";
        speakBtn.classList.add("speaking");
        ut.onend = () => speakBtn.classList.remove("speaking");
        ut.onerror = () => speakBtn.classList.remove("speaking");
        window.speechSynthesis.speak(ut);
      }
    }
  });

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", function() {
      if (searchInput) searchInput.value = "";
      activeLetter = "ALL";
      activeTopic = "ALL";
      letterButtons.forEach(b => b.classList.toggle("active", b.dataset.letter === "ALL"));
      topicChips.forEach(c => c.classList.toggle("active", c.dataset.topic === "ALL"));
      currentSort = "name-asc";
      if (sortSelect) sortSelect.value = "name-asc";
      localStorage.setItem("dictionary-sort-order", currentSort);
      renderCards(sortList(dictData, currentSort));
    });
  }

  if (randomBtn) {
    randomBtn.addEventListener("click", function() {
      const visible = Array.from(gridContainer.querySelectorAll(".dict-card")).filter(c => c.style.display !== "none");
      const list = visible.length > 0 ? visible : Array.from(gridContainer.querySelectorAll(".dict-card"));
      if (list.length === 0) return;
      const target = list[Math.floor(Math.random() * list.length)];
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.remove("dict-highlight");
        void target.offsetWidth;
        target.classList.add("dict-highlight");
        setTimeout(() => target.classList.remove("dict-highlight"), 3000);
      }
    });
  }

  document.addEventListener("keydown", function(e) {
    if (e.key === "/" && document.activeElement !== searchInput && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  function checkHash() {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const target = document.getElementById(id);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("dict-highlight");
          setTimeout(() => target.classList.remove("dict-highlight"), 3000);
        }, 300);
      }
    }
  }

  fetch("/data/dictionary.json")
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(data => {
      dictData = data;
      renderCards(sortList(dictData, currentSort));
      checkHash();
    })
    .catch(err => {
      console.warn("Could not fetch /data/dictionary.json, using pre-rendered fallback:", err);
      filterCards();
      checkHash();
    });
});
</script>
'''

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
        print(f'Updated {fpath}')

update_gadgets()
update_versus()
update_dictionary()
