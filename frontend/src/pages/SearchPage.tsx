import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, useParams, Link } from 'react-router-dom'
import {
  Search,
  Tag,
  BookOpen,
  Wrench,
  Compass,
  Grid,
  FileText,
  SlidersHorizontal,
  X,
  ArrowRight,
} from 'lucide-react'
import { useSearchIndex, type SearchItem } from '../hooks/useSearchIndex'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

type ContentCategory = 'All' | 'Blogs' | 'Tools' | 'GeoLayers' | 'Gallery' | 'Versus' | 'Publications'

const CATEGORIES: ContentCategory[] = [
  'All',
  'Blogs',
  'Tools',
  'GeoLayers',
  'Gallery',
  'Versus',
  'Publications',
]

const POPULAR_TAGS = [
  'Linux',
  'Security',
  'OSINT',
  'Architecture',
  'Kernel',
  'eBPF',
  'SSH',
  'Kubernetes',
  'Data Science',
  'Productivity',
  'Pomodoro',
  'Observability',
]

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { tag: routeTag } = useParams<{ tag?: string }>()

  const query = searchParams.get('q') || ''
  const activeTag = routeTag || searchParams.get('tag') || ''
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory>('All')
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: items = [], isLoading: loading } = useSearchIndex()

  useDocumentMeta({
    title: activeTag ? `Tag: ${activeTag}` : query ? `Search: ${query}` : 'Search',
    description: 'Explore technical articles, interactive tools, geo-layers, and research publications.',
  })

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Update query and sync to URL
  const handleQueryChange = (val: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (val.trim()) {
      newParams.set('q', val)
    } else {
      newParams.delete('q')
    }
    setSearchParams(newParams, { replace: true })
  }

  // Tag click handler
  const handleTagClick = (tag: string) => {
    const nextTag = activeTag.toLowerCase() === tag.toLowerCase() ? '' : tag
    const newParams = new URLSearchParams(searchParams)
    if (nextTag) {
      newParams.set('tag', nextTag)
    } else {
      newParams.delete('tag')
    }
    setSearchParams(newParams, { replace: true })
  }

  // Clear all filters
  const handleClearAll = () => {
    setSelectedCategory('All')
    setSearchParams({}, { replace: true })
    inputRef.current?.focus()
  }

  // Categorize item from permalink
  const getItemCategory = (permalink: string): ContentCategory => {
    if (permalink.includes('/gallery/versus/')) return 'Versus'
    if (permalink.includes('/blogs/')) return 'Blogs'
    if (permalink.includes('/tools/')) return 'Tools'
    if (permalink.includes('/geolayers/')) return 'GeoLayers'
    if (permalink.includes('/publications/')) return 'Publications'
    if (permalink.includes('/gallery/')) return 'Gallery'
    return 'All'
  }

  const getCategoryIcon = (cat: ContentCategory) => {
    switch (cat) {
      case 'Blogs':
        return <BookOpen style={{ width: '13px', height: '13px' }} />
      case 'Tools':
        return <Wrench style={{ width: '13px', height: '13px' }} />
      case 'GeoLayers':
        return <Compass style={{ width: '13px', height: '13px' }} />
      case 'Gallery':
        return <Grid style={{ width: '13px', height: '13px' }} />
      case 'Versus':
        return <SlidersHorizontal style={{ width: '13px', height: '13px' }} />
      case 'Publications':
        return <FileText style={{ width: '13px', height: '13px' }} />
      default:
        return <Tag style={{ width: '13px', height: '13px' }} />
    }
  }

  const getCategoryBadgeColor = (cat: ContentCategory) => {
    switch (cat) {
      case 'Blogs':
        return { bg: 'rgba(96, 165, 250, 0.12)', text: '#60a5fa', border: 'rgba(96, 165, 250, 0.25)' }
      case 'Tools':
        return { bg: 'rgba(167, 139, 250, 0.12)', text: '#a78bfa', border: 'rgba(167, 139, 250, 0.25)' }
      case 'GeoLayers':
        return { bg: 'rgba(52, 211, 153, 0.12)', text: '#34d399', border: 'rgba(52, 211, 153, 0.25)' }
      case 'Gallery':
        return { bg: 'rgba(244, 114, 182, 0.12)', text: '#f472b6', border: 'rgba(244, 114, 182, 0.25)' }
      case 'Versus':
        return { bg: 'rgba(251, 146, 60, 0.12)', text: '#fb923c', border: 'rgba(251, 146, 60, 0.25)' }
      case 'Publications':
        return { bg: 'rgba(245, 158, 11, 0.12)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.25)' }
      default:
        return { bg: 'rgba(148, 163, 184, 0.12)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.25)' }
    }
  }

  // Filtered and scored results
  const filteredResults = useMemo(() => {
    if (!items || items.length === 0) return []

    const q = query.trim().toLowerCase()
    const t = activeTag.trim().toLowerCase()
    const tokens = q ? q.split(/\s+/).filter(Boolean) : []

    const matched: { item: SearchItem; score: number; cat: ContentCategory }[] = []

    for (const item of items) {
      const cat = getItemCategory(item.permalink)

      // Category filter
      if (selectedCategory !== 'All' && cat !== selectedCategory) {
        continue
      }

      const title = (item.title || '').toLowerCase()
      const summary = (item.summary || '').toLowerCase()
      const content = (item.content || '').toLowerCase()
      const itemTags = (item.tags || []).map((x) => x.toLowerCase())

      // Tag filter
      if (t) {
        const matchesTag =
          itemTags.some((tagStr) => tagStr.includes(t)) ||
          title.includes(t) ||
          item.permalink.toLowerCase().includes(t)
        if (!matchesTag) continue
      }

      // Query filter & scoring
      let score = 1
      if (tokens.length > 0) {
        let allTokensFound = true
        let tokenScore = 0

        for (const token of tokens) {
          let found = false
          if (title.includes(token)) {
            tokenScore += title.startsWith(token) ? 35 : 15
            found = true
          }
          if (summary.includes(token)) {
            tokenScore += 8
            found = true
          }
          if (content.includes(token)) {
            tokenScore += 2
            found = true
          }
          if (itemTags.some((tagStr) => tagStr.includes(token))) {
            tokenScore += 12
            found = true
          }

          if (!found) {
            allTokensFound = false
            break
          }
        }

        if (!allTokensFound) continue
        score += tokenScore
      }

      matched.push({ item, score, cat })
    }

    // Sort by score descending
    matched.sort((a, b) => b.score - a.score)
    return matched
  }, [items, query, activeTag, selectedCategory])

  // Convert full URL to relative SPA path
  const formatUrl = (permalink: string) => {
    return permalink.replace(/^https?:\/\/[^/]+/, '')
  }

  // Helper for text highlighting
  const highlightMatch = (text: string, searchStr: string) => {
    if (!text || !searchStr.trim()) return text
    const words = searchStr.trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) return text

    const regex = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
            color: 'inherit',
            borderRadius: '2px',
            padding: '0 2px',
            fontWeight: 600,
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <main className="main" style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Header breadcrumb & title */}
      <header className="gallery-header" style={{ marginBottom: '28px' }}>
        <div className="gallery-breadcrumbs">
          <Link to="/">Home</Link> <span>/</span> <span>Search</span>
          {activeTag && (
            <>
              <span>/</span> <span>Tag: #{activeTag}</span>
            </>
          )}
        </div>
        <h1 className="gallery-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search style={{ width: '28px', height: '28px', color: 'var(--theme-accent)' }} />
          <span>Interactive Portfolio Search</span>
        </h1>
        <p className="gallery-subtitle">
          Search across 20+ technical blogs, interactive simulators, geospatial maps, and research archives.
        </p>
      </header>

      {/* Main Search Input Box */}
      <div
        style={{
          position: 'relative',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--entry)',
            border: '1px solid var(--theme-border)',
            borderRadius: '14px',
            padding: '6px 16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <Search style={{ width: '18px', height: '18px', color: 'var(--secondary)', marginRight: '12px', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search blogs, tools, technologies, concepts (e.g. Linux, Pomodoro, eBPF)..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--primary)',
              fontFamily: 'inherit',
              padding: '8px 0',
            }}
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--secondary)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Clear input"
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: isSelected ? 'var(--theme-accent)' : 'var(--theme-border)',
                background: isSelected ? 'var(--theme-accent)' : 'var(--entry)',
                color: isSelected ? '#fff' : 'var(--secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat !== 'All' && getCategoryIcon(cat)}
              <span>{cat}</span>
            </button>
          )
        })}
      </div>

      {/* Popular Tags Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '28px',
          fontSize: '0.8rem',
        }}
      >
        <span style={{ color: 'var(--secondary)', marginRight: '4px', fontWeight: 600 }}>Filter by Tag:</span>
        {POPULAR_TAGS.map((tag) => {
          const isActive = activeTag.toLowerCase() === tag.toLowerCase()
          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              style={{
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                border: '1px solid',
                borderColor: isActive ? 'var(--theme-accent)' : 'var(--theme-border)',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'var(--tertiary)',
                color: isActive ? 'var(--theme-accent)' : 'var(--secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              #{tag}
            </button>
          )
        })}
        {(query || activeTag || selectedCategory !== 'All') && (
          <button
            onClick={handleClearAll}
            style={{
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              border: '1px dashed var(--theme-border)',
              background: 'transparent',
              color: '#f87171',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Results Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '12px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--theme-border)',
          fontSize: '0.85rem',
          color: 'var(--secondary)',
        }}
      >
        <span>
          Showing <strong>{filteredResults.length}</strong> matching item
          {filteredResults.length === 1 ? '' : 's'}
          {activeTag && <span> under tag <strong>#{activeTag}</strong></span>}
          {query && <span> for &ldquo;<strong>{query}</strong>&rdquo;</span>}
        </span>
        {loading && <span style={{ fontFamily: 'var(--code-font)' }}>Indexing content...</span>}
      </div>

      {/* Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredResults.length === 0 && !loading ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: 'var(--entry)',
              borderRadius: 'var(--theme-card-radius)',
              border: '1px dashed var(--theme-border)',
            }}
          >
            <Search style={{ width: '36px', height: '36px', color: 'var(--secondary)', margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px', color: 'var(--primary)' }}>No matching content found</h3>
            <p style={{ margin: '0 0 16px', color: 'var(--secondary)', fontSize: '0.88rem' }}>
              Try searching for broader keywords, or reset active filters.
            </p>
            <button
              onClick={handleClearAll}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                background: 'var(--theme-accent)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear Search & Show All
            </button>
          </div>
        ) : (
          filteredResults.map(({ item, cat }, idx) => {
            const badgeStyle = getCategoryBadgeColor(cat)
            const cleanUrl = formatUrl(item.permalink)
            const cleanSummary = (item.summary || item.content || '')
              .replace(/<[^>]*>?/gm, '')
              .slice(0, 180)

            return (
              <article
                key={idx}
                style={{
                  background: 'var(--entry)',
                  border: '1px solid var(--theme-border)',
                  borderRadius: 'var(--theme-card-radius)',
                  padding: '20px 24px',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                  position: 'relative',
                }}
                className="featured-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: badgeStyle.bg,
                      color: badgeStyle.text,
                      border: `1px solid ${badgeStyle.border}`,
                    }}
                  >
                    {getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontFamily: 'var(--code-font)' }}>
                    {cleanUrl}
                  </span>
                </div>

                <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', fontWeight: 700 }}>
                  <Link
                    to={cleanUrl}
                    style={{ color: 'var(--primary)', textDecoration: 'none' }}
                  >
                    {highlightMatch(item.title, query)}
                  </Link>
                </h3>

                {cleanSummary && (
                  <p
                    style={{
                      margin: '0 0 14px',
                      color: 'var(--secondary)',
                      fontSize: '0.88rem',
                      lineHeight: 1.55,
                    }}
                  >
                    {highlightMatch(cleanSummary, query)}...
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(item.tags || []).slice(0, 4).map((tag) => (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.preventDefault()
                          handleTagClick(tag)
                        }}
                        style={{
                          background: 'var(--tertiary)',
                          border: '1px solid var(--theme-border)',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          color: 'var(--secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  <Link
                    to={cleanUrl}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--theme-accent)',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Open</span>
                    <ArrowRight style={{ width: '13px', height: '13px' }} />
                  </Link>
                </div>
              </article>
            )
          })
        )}
      </div>
    </main>
  )
}
