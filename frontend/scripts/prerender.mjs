/**
 * Ultra-fast, zero-dependency Static Site Pre-Renderer (SSG) for GitHub Pages.
 * Generates physical dist/<route>/index.html files for every page and article,
 * ensuring instant First Contentful Paint (FCP) and 100% crawlability for search
 * engines and social card bots without executing JavaScript.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const FRONTEND_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.join(FRONTEND_DIR, 'dist')
const PUBLIC_DIR = path.join(FRONTEND_DIR, 'public')

const SITE_NAME = 'Gui13go'
const SITE_BASE_URL = 'https://gui13go.github.io'
const DEFAULT_TITLE = 'Gui13go | Systems Engineering, Security & Architecture'
const DEFAULT_DESCRIPTION =
  'Personal technical portfolio and blog on GNU/Linux, Systems Engineering, Security, Virtualization, and Cloud Architecture.'
const DEFAULT_IMAGE = '/favicon.svg'

// Core section descriptions for top-level hubs
const HUB_META = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    image: '/favicon.svg',
  },
  '/about/': {
    title: 'About | Guilherme Viegas (Gui13go)',
    description:
      'About Guilherme Viegas (Gui13go) - Systems Engineer, Security Researcher, Linux Enthusiast, and Open Source Contributor.',
    image: '/photos/guigo_avatar_bg.png',
  },
  '/agents/': {
    title: 'AI Agents & Architectures | Gui13go',
    description:
      'Autonomous AI agents, multi-agent frameworks, telemetry models, and intelligent workflows.',
    image: '/favicon.svg',
  },
  '/publications/': {
    title: 'Publications & Research | Gui13go',
    description:
      'Academic publications, technical research papers, security advisories, and presentations by Guilherme Viegas.',
    image: '/favicon.svg',
  },
  '/blogs/': {
    title: 'Technical Blogs & Deep Dives | Gui13go',
    description:
      'In-depth technical articles on Linux kernel internals, OSINT, cybersecurity, performance tuning, and cloud infrastructure.',
    image: '/favicon.svg',
  },
  '/gallery/': {
    title: 'Interactive Gallery & Visual Showcase | Gui13go',
    description:
      'Interactive visual showcases, historical timelines, infographics, versus battles, and architectural diagrams.',
    image: '/favicon.svg',
  },
  '/tools/': {
    title: 'Developer Utilities & Interactive Tools | Gui13go',
    description:
      'Interactive utilities, focus timers, currency visualizers, and performance benchmarking tools.',
    image: '/favicon.svg',
  },
  '/geolayers/': {
    title: 'GeoLayers & Geospatial Intelligence | Gui13go',
    description:
      'Interactive geographic visualizations, global datasets, spatial normalization, and mapping intelligence layers.',
    image: '/favicon.svg',
  },
  '/search/': {
    title: 'Search Technical Index | Gui13go',
    description:
      'Full-text real-time search across all technical articles, tools, publications, and gallery showcases.',
    image: '/favicon.svg',
  },
  '/status/': {
    title: 'Hardware & Infrastructure Status | Gui13go',
    description:
      'Real-time edge node telemetry, local LLM daemon availability, and server resource metrics.',
    image: '/favicon.svg',
  },
}

const ALIASES = {
  'pomodoro-timer': 'pomodoro',
  'pomodoro-focus': 'pomodoro',
  'currency-charter': 'currency-chart',
  'egg-cooking': 'egg-cooking-timer',
  'egg-timer': 'egg-cooking-timer',
  'berlin-wall': 'berlin-wall-comparison',
  'ecosystems-world': 'ecosystems-of-the-world',
  'usa-nuked-greenland-1968': 'usa-dropped-nukes-on-greenland',
  'usa-nuked-spain-1966': 'usa-dropped-nukes-on-spain',
  'reveolution-os-review': 'revolution-os-review',
}

function escapeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function stripTags(html) {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&bull;/g, '•')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Upgrades raster <img> tags to HTML5 <picture> tags with AVIF and WebP sources
 */
function upgradeImagesToPicture(html) {
  if (!html) return ''
  return html.replace(
    /(<picture[^>]*>[\s\S]*?<\/picture>)|(<img\b([^>]*\bsrc=["']?((?:https?:\/\/[^/"'\s>]+)?\/(?:images|photos)\/[^"'\s>]+\.(?:jpg|jpeg|png))["']?[^>]*)>)/gi,
    (match, pictureTag, imgTag, _attrs, src) => {
      if (pictureTag) return pictureTag
      const avifSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.avif')
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      return `<picture><source type="image/avif" srcset="${avifSrc}"><source type="image/webp" srcset="${webpSrc}">${imgTag}</picture>`
    }
  )
}

/**
 * Renders the persistent header and footer navigation shell
 */
function renderLayoutShell({ currentPath, contentHtml }) {
  const navLinks = [
    { to: '/about/', label: 'About' },
    { to: '/agents/', label: 'Agents' },
    { to: '/publications/', label: 'Publications' },
    { to: '/geolayers/', label: 'GeoLayers' },
    { to: '/tools/', label: 'Tools' },
    { to: '/gallery/', label: 'Gallery' },
    { to: '/blogs/', label: 'Blogs' },
    { to: '/search/', label: 'Search' },
  ]

  const menuItems = navLinks
    .map((link) => {
      const isActive =
        currentPath === link.to ||
        (link.to !== '/' && currentPath.startsWith(link.to))
      const activeClass = isActive ? ' class="active"' : ''
      return `<li><a href="${link.to}" title="${link.label}"><span${activeClass}>${link.label}</span></a></li>`
    })
    .join('')

  const currentYear = new Date().getFullYear()

  return `
    <header class="header">
      <nav class="header-nav">
        <div class="logo">
          <a href="/" accesskey="h" title="Gui13go (Alt + H)">Gui13go</a>
          <div class="logo-switches">
            <button id="theme-toggle" class="theme-toggle" accesskey="t" title="(Alt + T)" aria-label="Toggle theme">
              <svg class="sun" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </button>
          </div>
        </div>
        <div class="header-search" id="header-search">
          <form class="header-search-form" action="/search/">
            <button type="submit" class="header-search-submit" aria-label="Submit search">
              <svg class="header-search-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <input type="search" name="q" class="header-search-input" placeholder="Search (Press / or Ctrl+K)..." autocomplete="off" aria-label="Search site" />
            <div class="header-search-badge" title="Press / to search">
              <kbd class="header-search-kbd">/</kbd>
            </div>
          </form>
        </div>
        <button id="menu-toggle" class="menu-toggle theme-toggle" aria-label="Toggle Menu" aria-expanded="false">
          <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <ul id="menu" class="menu">
          ${menuItems}
        </ul>
      </nav>
    </header>
    ${contentHtml}
    <footer class="footer site-footer">
      <div class="footer-inner" style="max-width: 1080px; margin: 0 auto; padding: 24px 20px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 0.88rem; color: var(--secondary); box-sizing: border-box; width: 100%;">
        <span>&copy; ${currentYear} Guilherme's Hub &bull; Open Code, Open Mind 🚀</span>
      </div>
    </footer>
  `
}

/**
 * Extracts metadata (title, description, image) from content HTML
 */
function extractMetadata(html, route, searchIndexMap) {
  // Check if predefined in HUB_META
  if (HUB_META[route]) {
    return { ...HUB_META[route] }
  }

  // Check search index map
  const cleanRoute = route.endsWith('/') ? route : route + '/'
  const indexed = searchIndexMap.get(cleanRoute)

  // 1. Extract Description (prefer explicit post-description in HTML over raw summary paragraph)
  let description = ''
  const postDescMatch = html.match(
    /<div[^>]+class=['"]?[^'">]*post-description[^'">]*['"]?[^>]*>([\s\S]*?)<\/div>/i
  )
  const gallerySubMatch = html.match(
    /<p[^>]+class=['"]?[^'">]*gallery-subtitle[^'">]*['"]?[^>]*>([\s\S]*?)<\/p>/i
  )
  const versusSubMatch = html.match(
    /<div[^>]+class=['"]?[^'">]*versus-modal-subtitle[^'">]*['"]?[^>]*>([\s\S]*?)<\/div>/i
  )

  if (postDescMatch) {
    description = stripTags(postDescMatch[1])
  } else if (versusSubMatch) {
    description = stripTags(versusSubMatch[1])
  } else if (gallerySubMatch) {
    description = stripTags(gallerySubMatch[1])
  } else if (indexed?.summary) {
    description = stripTags(indexed.summary)
  } else {
    description = DEFAULT_DESCRIPTION
  }

  // Truncate cleanly at word boundary
  if (description.length > 200) {
    const truncated = description.slice(0, 197)
    const lastSpace = truncated.lastIndexOf(' ')
    description = (lastSpace > 120 ? truncated.slice(0, lastSpace) : truncated) + '...'
  }

  // 2. Extract Title
  let title = ''
  const postTitleMatch = html.match(
    /<[^>]+class=['"]?[^'">]*post-title[^'">]*['"]?[^>]*>([\s\S]*?)<\/[^>]+>/i
  )
  const versusTitleMatch = html.match(
    /<h2[^>]+class=['"]?[^'">]*versus-modal-title[^'">]*['"]?[^>]*>([\s\S]*?)<\/h2>/i
  )
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)

  if (postTitleMatch) {
    title = stripTags(postTitleMatch[1])
  } else if (versusTitleMatch) {
    title = stripTags(versusTitleMatch[1]) + ' | Versus Battle'
  } else if (h1Match) {
    title = stripTags(h1Match[1])
  } else if (indexed?.title) {
    title = stripTags(indexed.title)
  } else {
    const parts = route.split('/').filter(Boolean)
    const last = parts[parts.length - 1] || 'Page'
    title = last
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')
  }

  // 3. Extract Cover Image
  let image = DEFAULT_IMAGE
  const coverMatch = html.match(
    /<figure[^>]*class=['"]?[^'">]*entry-cover[^'">]*['"]?[^>]*>[\s\S]*?<img[^>]*src=['"]?([^"'\s>]+)['"]?/i
  )
  const versusImgMatch =
    html.match(
      /<img[^>]+src=['"]?([^"'\s>]+)['"]?[^>]+class=['"]?[^'">]*versus-modal-hero-bg/i
    ) ||
    html.match(
      /<img[^>]+class=['"]?[^'">]*versus-modal-hero-bg[^'">]*['"]?[^>]+src=['"]?([^"'\s>]+)['"]?/i
    )

  if (coverMatch) {
    image = coverMatch[1]
  } else if (versusImgMatch) {
    image = versusImgMatch[1]
  }

  // Format full title
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  return {
    title: fullTitle,
    description,
    image,
  }
}

/**
 * Injects meta tags and pre-rendered DOM into dist/index.html
 */
function createPreRenderedPage(templateHtml, { route, contentHtml, metadata }) {
  const canonicalUrl = `${SITE_BASE_URL}${route.endsWith('/') ? route : route + '/'}`
  const imageUrl = metadata.image.startsWith('http')
    ? metadata.image
    : `${SITE_BASE_URL}${metadata.image}`

  const metaSnippet = `
    <title>${escapeHtml(metadata.title)}</title>
    <meta name="description" content="${escapeHtml(metadata.description)}" />
    <meta property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(metadata.title)}" />
    <meta name="twitter:description" content="${escapeHtml(metadata.description)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
  `.trim()

  // Strip any existing title, description, OG tags, twitter tags, and canonical link
  let output = templateHtml
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')

  // Inject fresh meta tags right before </head>
  output = output.replace(
    /<\/head>/i,
    `  ${metaSnippet}\n  </head>`
  )

  // Construct full layout shell
  const fullShellHtml = renderLayoutShell({
    currentPath: route,
    contentHtml,
  })

  // Clean empty lines in head
  output = output.replace(/\n\s*\n\s*\n/g, '\n')

  // Inject into root cleanly
  output = output.replace(
    '<div id="root"></div>',
    `<div id="root">\n${fullShellHtml}\n    </div>`
  )

  return output
}

/**
 * Main execution
 */
export async function prerenderAll() {
  const startTime = Date.now()
  console.log('⚡ [SSG Pre-Renderer] Starting complete site pre-rendering...')

  const templatePath = path.join(DIST_DIR, 'index.html')
  if (!fs.existsSync(templatePath)) {
    console.error(`❌ [SSG] Template not found: ${templatePath}. Run vite build first.`)
    process.exit(1)
  }

  // Load and sanitize base template so root is guaranteed to be clean <div id="root"></div>
  let baseTemplate = fs.readFileSync(templatePath, 'utf8')
  baseTemplate = baseTemplate.replace(
    /<div id="root">[\s\S]*<\/div>\s*<\/body>/i,
    '<div id="root"></div>\n  </body>'
  )

  // Load search index for metadata resolution
  const searchIndexMap = new Map()
  const indexJsonPath = path.join(PUBLIC_DIR, 'index.json')
  if (fs.existsSync(indexJsonPath)) {
    try {
      const indexData = JSON.parse(fs.readFileSync(indexJsonPath, 'utf8'))
      for (const item of indexData) {
        if (item.permalink) {
          try {
            const urlPath = new URL(item.permalink).pathname
            searchIndexMap.set(urlPath.endsWith('/') ? urlPath : urlPath + '/', item)
          } catch {
            searchIndexMap.set(item.permalink, item)
          }
        }
      }
    } catch (e) {
      console.warn('⚠️ Could not parse index.json for metadata:', e.message)
    }
  }

  const tasks = []

  // 1. Home Page (/)
  const homeMainPath = path.join(PUBLIC_DIR, 'home_main.html')
  if (fs.existsSync(homeMainPath)) {
    tasks.push({
      route: '/',
      filePath: homeMainPath,
      outPath: path.join(DIST_DIR, 'index.html'),
    })
  }

  // 2. Core Hub Pages (/about/, /agents/, etc.)
  const pagesDir = path.join(PUBLIC_DIR, 'rendered_pages')
  if (fs.existsSync(pagesDir)) {
    for (const file of fs.readdirSync(pagesDir)) {
      if (!file.endsWith('.html')) continue
      const name = path.basename(file, '.html')
      const route = `/${name}/`
      tasks.push({
        route,
        filePath: path.join(pagesDir, file),
        outPath: path.join(DIST_DIR, name, 'index.html'),
      })
    }
  }

  // 3. Dynamic Section Collections
  const sectionConfigs = [
    { dir: 'rendered_blogs', prefix: '/blogs/' },
    { dir: 'rendered_tools', prefix: '/tools/' },
    { dir: 'rendered_gallery', prefix: '/gallery/' },
    { dir: 'rendered_geolayers', prefix: '/geolayers/' },
    { dir: 'rendered_publications', prefix: '/publications/' },
    { dir: 'rendered_versus', prefix: '/gallery/versus/' },
  ]

  for (const { dir, prefix } of sectionConfigs) {
    const fullDir = path.join(PUBLIC_DIR, dir)
    if (!fs.existsSync(fullDir)) continue

    for (const file of fs.readdirSync(fullDir)) {
      if (!file.endsWith('.html')) continue
      const slug = path.basename(file, '.html')
      const route = `${prefix}${slug}/`
      const outDir = path.join(DIST_DIR, ...prefix.split('/').filter(Boolean), slug)

      tasks.push({
        route,
        filePath: path.join(fullDir, file),
        outPath: path.join(outDir, 'index.html'),
      })
    }
  }

  // 4. Aliases
  for (const [aliasSlug, targetSlug] of Object.entries(ALIASES)) {
    // Check in tools, geolayers, blogs
    const candidateSections = [
      { prefix: '/tools/', dir: 'rendered_tools' },
      { prefix: '/geolayers/', dir: 'rendered_geolayers' },
      { prefix: '/blogs/', dir: 'rendered_blogs' },
    ]
    for (const { prefix, dir } of candidateSections) {
      const targetFile = path.join(PUBLIC_DIR, dir, `${targetSlug}.html`)
      if (fs.existsSync(targetFile)) {
        const route = `${prefix}${aliasSlug}/`
        const outDir = path.join(DIST_DIR, ...prefix.split('/').filter(Boolean), aliasSlug)
        tasks.push({
          route,
          filePath: targetFile,
          outPath: path.join(outDir, 'index.html'),
        })
      }
    }
  }

  // 5. Diagnostics & Status (/status/)
  tasks.push({
    route: '/status/',
    content: `
      <main class="main" style="max-width: 960px; margin: 0 auto; padding: 24px 20px 80px;">
        <header class="gallery-header" style="margin-bottom: 28px;">
          <div class="gallery-breadcrumbs">
            <a href="/">Home</a> <span>/</span> <span>Diagnostics</span>
          </div>
          <h1 class="gallery-title" style="display: flex; align-items: center; gap: 10px;">
            Hardware Telemetry &amp; Node Status
          </h1>
          <p class="gallery-subtitle">
            Real-time telemetry, GPU hardware sensors, and edge AI daemon status.
          </p>
        </header>
        <div style="padding: 40px; text-align: center; color: var(--secondary);">
          <span class="loading-spinner"></span> Connecting to node telemetry...
        </div>
      </main>
    `,
    outPath: path.join(DIST_DIR, 'status', 'index.html'),
  })

  console.log(`📦 Pre-rendering ${tasks.length} pages...`)

  let count = 0
  for (const task of tasks) {
    let rawContent = task.content || (task.filePath ? fs.readFileSync(task.filePath, 'utf8') : '')

    // Clean internal links to local relative paths
    rawContent = rawContent
      .replace(/https:\/\/gui13go\.github\.io\//g, '/')
      .replace(/http:\/\/localhost:1313\//g, '/')

    // Upgrade image tags to <picture>
    const upgradedContent = upgradeImagesToPicture(rawContent)

    // Extract metadata
    const metadata = extractMetadata(upgradedContent, task.route, searchIndexMap)

    // Create page HTML
    const pageHtml = createPreRenderedPage(baseTemplate, {
      route: task.route,
      contentHtml: upgradedContent,
      metadata,
    })

    // Ensure output directory exists and write
    fs.mkdirSync(path.dirname(task.outPath), { recursive: true })
    fs.writeFileSync(task.outPath, pageHtml, 'utf8')
    count++
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`✅ [SSG Pre-Renderer] Successfully generated ${count} static HTML pages in ${duration}s!`)
}

// Execute directly if run as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  prerenderAll().catch((err) => {
    console.error('❌ [SSG Pre-Renderer] Error:', err)
    process.exit(1)
  })
}
