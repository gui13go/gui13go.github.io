import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface SearchItem {
  title: string
  permalink: string
  summary?: string
  content?: string
}

export const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('pref-theme') as 'dark' | 'light') || 'dark'
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchIndex, setSearchIndex] = useState<SearchItem[] | null>(null)
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('pref-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Load search index lazily
  const loadSearchIndex = async () => {
    if (searchIndex) return searchIndex
    try {
      const res = await fetch('/index.json')
      if (res.ok) {
        const data = await res.json()
        setSearchIndex(data)
        return data as SearchItem[]
      }
    } catch (e) {
      console.error('Failed to load search index:', e)
    }
    return null
  }

  // Handle Search input
  const handleSearchInput = async (val: string) => {
    setSearchQuery(val)
    if (!val.trim()) {
      setIsSearching(false)
      setSearchResults([])
      return
    }

    const index = await loadSearchIndex()
    if (!index) return

    const tokens = val.toLowerCase().split(/\s+/).filter(Boolean)
    const matches: { item: SearchItem; score: number }[] = []

    for (const item of index) {
      const title = (item.title || '').toLowerCase()
      const summary = (item.summary || '').toLowerCase()
      const content = (item.content || '').toLowerCase()
      let matched = true
      let score = 0

      for (const token of tokens) {
        let tokenScore = 0
        if (title.includes(token)) tokenScore += title.startsWith(token) ? 25 : 12
        if (summary.includes(token)) tokenScore += 4
        if (content.includes(token)) tokenScore += 1

        if (tokenScore === 0) {
          matched = false
          break
        }
        score += tokenScore
      }

      if (matched && score > 0) {
        matches.push({ item, score })
      }
    }

    matches.sort((a, b) => b.score - a.score)
    setSearchResults(matches.slice(0, 6).map((m) => m.item))
    setIsSearching(true)
    setSelectedIndex(-1)
  }

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(false)
      navigate(`/search/?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleResultClick = (permalink: string) => {
    setIsSearching(false)
    setSearchQuery('')
    // Convert full URL or relative URL to React Router path
    const path = permalink.replace(/^https?:\/\/[^\/]+/, '')
    navigate(path)
  }

  const searchInputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)

  // Automatically close mobile menu whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Global keyboard shortcuts (/ and Cmd+K / Ctrl+K for search, Escape for search and mobile menu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement ? document.activeElement.tagName : ''
      const isInput =
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable

      if (!isInput && (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) {
        e.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      } else if (e.key === 'Escape') {
        setIsSearching(false)
        setMobileMenuOpen(false)
        searchInputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close search and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearching(false)
      }
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        menuToggleRef.current &&
        !menuToggleRef.current.contains(target)
      ) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      if (searchResults.length > 0) {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % searchResults.length)
      }
    } else if (e.key === 'ArrowUp') {
      if (searchResults.length > 0) {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length)
      }
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        e.preventDefault()
        handleResultClick(searchResults[selectedIndex].permalink)
      }
    }
  }

  const navLinks = [
    { to: '/about/', label: 'About' },
    { to: '/agents/', label: 'Agents' },
    { to: '/blogs/', label: 'Blogs' },
    { to: '/publications/', label: 'Publications' },
    { to: '/geolayers/', label: 'GeoLayers' },
    { to: '/gallery/', label: 'Gallery' },
    { to: '/tools/', label: 'Tools' },
    { to: '/search/', label: 'Search' },
  ]

  const getItemType = (url: string) => {
    if (url.includes('/blogs/')) return 'Blog'
    if (url.includes('/tools/')) return 'Tool'
    if (url.includes('/geolayers/')) return 'GeoLayer'
    if (url.includes('/publications/')) return 'Publication'
    if (url.includes('/gallery/')) return 'Gallery'
    if (url.includes('/about/')) return 'About'
    return 'Page'
  }

  return (
    <header className="header">
      <nav className="header-nav">
        <div className="logo">
          <Link to="/" accessKey="h" title="Gui13go (Alt + H)">
            Gui13go
          </Link>
          <div className="logo-switches">
            <button
              id="theme-toggle"
              className="theme-toggle"
              accessKey="t"
              title="(Alt + T)"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <svg
                  className="sun"
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg
                  className="moon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Header Instant Search */}
        <div className="header-search" id="header-search" ref={searchRef}>
          <form className="header-search-form" onSubmit={handleSearchSubmit}>
            <button type="submit" className="header-search-submit" aria-label="Submit search">
              <svg
                className="header-search-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input
              ref={searchInputRef}
              type="search"
              name="q"
              className="header-search-input"
              placeholder="Search (Press / or Ctrl+K)..."
              autoComplete="off"
              aria-label="Search site"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onFocus={() => {
                loadSearchIndex()
                if (searchQuery.trim()) setIsSearching(true)
              }}
            />
            <div className="header-search-badge" title="Press / to search">
              <kbd className="header-search-kbd">/</kbd>
            </div>
            {searchQuery && (
              <button
                type="button"
                className="header-search-clear"
                onClick={() => {
                  setSearchQuery('')
                  setIsSearching(false)
                }}
              >
                &times;
              </button>
            )}
          </form>

          {/* Search Dropdown */}
          {isSearching && (
            <div className="header-search-dropdown" style={{ display: 'block' }}>
              <div className="header-search-header">
                <span className="header-search-count">
                  {searchResults.length} suggestion{searchResults.length === 1 ? '' : 's'}
                </span>
              </div>
              <ul className="header-search-results">
                {searchResults.length === 0 ? (
                  <li className="header-search-empty">
                    <div className="header-search-empty-text">
                      No suggestions found for "{searchQuery}"
                    </div>
                    <button
                      type="button"
                      className="header-search-empty-btn"
                      onClick={() => handleSearchSubmit()}
                    >
                      Search full site for "<strong>{searchQuery}</strong>" &rarr;
                    </button>
                  </li>
                ) : (
                  searchResults.map((item, idx) => {
                    const tagType = getItemType(item.permalink)
                    return (
                      <li
                        key={idx}
                        className={`header-search-item ${selectedIndex === idx ? 'active' : ''}`}
                        onClick={() => handleResultClick(item.permalink)}
                      >
                        <div>
                          <div className="header-search-item-title">
                            <div className="header-search-item-left">
                              <span className={`header-search-tag tag-${tagType.toLowerCase()}`}>
                                <span>{tagType}</span>
                              </span>
                              <span className="header-search-title-text">{item.title}</span>
                            </div>
                            <span className="header-search-item-arrow">&rarr;</span>
                          </div>
                          {item.summary && (
                            <div className="header-search-item-desc">
                              {item.summary.replace(/<[^>]*>?/gm, '').slice(0, 95)}...
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })
                )}
              </ul>
              {searchResults.length > 0 && (
                <div className="header-search-footer" style={{ display: 'block' }}>
                  <button
                    type="button"
                    onClick={() => handleSearchSubmit()}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}
                  >
                    <span>View all results for &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
                    <svg
                      className="header-search-arrow"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          id="menu-toggle"
          ref={menuToggleRef}
          className="menu-toggle theme-toggle"
          aria-label="Toggle Menu"
          aria-expanded={mobileMenuOpen}
          onClick={(e) => {
            e.stopPropagation()
            setMobileMenuOpen((prev) => !prev)
          }}
        >
          {mobileMenuOpen ? (
            <svg
              className="close-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              className="menu-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Primary navigation menu */}
        <ul
          id="menu"
          ref={menuRef}
          className={`menu ${mobileMenuOpen ? 'show show-menu' : ''}`}
        >
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.to ||
              (link.to !== '/' && location.pathname.startsWith(link.to))
            return (
              <li key={link.to}>
                <Link to={link.to} title={link.label} onClick={() => setMobileMenuOpen(false)}>
                  <span className={isActive ? 'active' : ''}>{link.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
