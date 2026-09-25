import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface DynamicItemProps {
  section: 'rendered_posts' | 'rendered_tools' | 'rendered_gallery' | 'rendered_geolayers' | 'rendered_publications'
}

export const DynamicItemPage: React.FC<DynamicItemProps> = ({ section }) => {
  const { slug } = useParams<{ slug: string }>()
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(false)

    fetch(`/${section}/${slug}.html`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((html) => {
        const cleaned = html.replace(/https:\/\/gui13go\.github\.io\//g, '/')
        setHtmlContent(cleaned)
        setLoading(false)
      })
      .catch((err) => {
        console.error(`Error loading item ${slug}:`, err)
        setError(true)
        setLoading(false)
      })
  }, [section, slug])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      if (href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault()
        navigate(href)
      } else if (href.startsWith('#')) {
        e.preventDefault()
        const el = document.getElementById(href.slice(1))
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    }

    container.addEventListener('click', handleLinkClick)
    return () => container.removeEventListener('click', handleLinkClick)
  }, [htmlContent, navigate])

  if (loading) {
    return (
      <main className="main" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--secondary)', fontFamily: 'var(--code-font)', fontSize: '0.875rem' }}>
          Loading article...
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="main" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1>Content Not Found</h1>
        <p style={{ color: 'var(--secondary)', marginTop: '10px' }}>
          The requested article or tool ({slug}) could not be loaded.
        </p>
        <button
          onClick={() => navigate('/')}
          className="read-more-link"
          style={{ marginTop: '20px', padding: '8px 16px', background: 'var(--entry)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}
        >
          Return Home
        </button>
      </main>
    )
  }

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
}
