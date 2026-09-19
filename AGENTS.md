# Project Style & Design Standards: Gui13go (Hugo / PaperMod)

This document defines the core architecture, design system, layout conventions, and rules for this repository (`gui13go.github.io`). Any AI assistant operating on this repository **must** strictly adhere to these standards.

---

## 1. Navigation Bar Standards

- **Active Navbar Menus** (defined in `hugo.toml` under `[menu.main]`):
  1. **Blogs** (`/blogs/`, weight 10)
  2. **Tools** (`/tools/`, weight 12)
  3. **GeoLayer** (`/geolayers/`, weight 13)
  4. **Publications** (`/publications/`, weight 14)
  5. **Gallery** (`/gallery/`, weight 15)
  6. **Search** (`/search/`, weight 40)
- **CRITICAL RULE**: **Tags** and **Categories** have been intentionally removed from the main navbar. **Do NOT re-add Tags or Categories to `menu.main` in `hugo.toml` or any navbar template.**

---

## 2. Standardized Section Header Pattern

All primary section/menu pages (**Blogs**, **Tools**, **GeoLayer**, **Publications**, **Gallery**, **Search**) MUST use the unified header layout:

```html
<header class="gallery-header">
  <div class="gallery-breadcrumbs">
    <a href="{{ site.BaseURL }}">Home</a> <span>/</span> <span>{{ [Menu-Name] }}</span>
  </div>
  <h1 class="gallery-title">{{ [Menu-Name] }}</h1>
  <p class="gallery-subtitle">{{ [Description] }}</p>
</header>
```

### Components Breakdown:
1. **Breadcrumbs (`.gallery-breadcrumbs`)**:
   - Always begins with a clickable link to Home: `<a href="{{ site.BaseURL }}">Home</a>`.
   - Separator is `<span>/</span>`.
   - Current page item is wrapped in `<span>[Menu-Name]</span>` without a link.
   - For subpages/child articles, include the parent section link:
     ```html
     <div class="gallery-breadcrumbs">
       <a href="{{ site.BaseURL }}">Home</a> <span>/</span> <a href="/tools/">Tools</a> <span>/</span> <span>Item Title</span>
     </div>
     ```

2. **Title (`.gallery-title`)**:
   - `<h1>` element with class `gallery-title`.
   - Styled with the primary blue/indigo gradient:
     ```css
     background: var(--theme-accent-gradient);
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
     ```
   - Must match the section's menu name exactly (e.g. `Blogs`, `Tools`, `GeoLayer`, `Publications`, `Gallery`, `Search`).

3. **Subtitle / Description (`.gallery-subtitle`)**:
   - `<p>` element with class `gallery-subtitle`.
   - Styled in secondary gray (`color: var(--secondary)`), max-width 720px, line-height 1.5.

4. **No Giant Hero Banners on Hub Pages**:
   - Hub list pages should start cleanly with `<header class="gallery-header">`, immediately followed by interactive toolbars, filter chips, and card grids.
   - Do not wrap hub page headers inside image hero banners or conceal descriptions inside tooltip modals.

---

## 3. Container & Spacing Standards

- **Page Containers**:
  - Main hub container classes: `.gallery-page-container`, `.geolayers-page-container`, `.publications-page-container`.
  - Max-width: between `1120px` and `1200px`.
  - Top padding must be uniform: `padding: 16px 20px 60px; margin: 0 auto;`.
- **Search & Filter Toolbars**:
  - Filter chips should use rounded pill styles (`.geo-filter-btn`, `.pub-filter-btn`, `.gallery-pill`).
  - Active filter state uses `.active` class with blue border/accent background.
  - Search inputs must have clear buttons (`&times;`) and match the themed border radius.

---

## 4. Theme & Color Tokens

All components must support dark and light modes through PaperMod and custom CSS tokens:
- `--theme-accent-gradient`: `linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #8b5cf6 100%)` (blue to purple-blue)
- `--theme-accent`: `#3b82f6`
- `--primary`: Main text color (auto-adjusts for light/dark)
- `--secondary`: Subtitle, breadcrumb, and meta text color (gray)
- `--tertiary`: Muted accents and subtle borders
- `--theme-border`: Subtle card borders (semi-transparent)
- `--theme-card-bg`: Card surface background
- `--theme-card-radius`: Default card corner radius (`14px` - `16px`)

---

## 5. Template Structure & Locations

When adding or modifying layouts in Hugo:
- **Blogs Hub**: `layouts/blogs/list.html`
- **Tools Hub**: `layouts/tools/list.html`
- **GeoLayers Hub**: `layouts/geolayers/list.html`
- **Publications Hub**: `layouts/publications/list.html`
- **Gallery Hub**: `layouts/gallery/list.html`
- **Search Page**: `layouts/search.html` and `layouts/_default/search.html` (markdown at `content/search.md`)
- **Custom CSS**: Always append or edit rules in `assets/css/extended/custom.css`.

---

## 6. Build & Verification Routine

Before completing any prompt or task modifying layouts or content:
1. Run `hugo --gc --minify` to ensure zero compilation or template syntax errors.
2. Ensure existing comments and docstrings remain intact.
3. Test dark mode and light mode contrast.
