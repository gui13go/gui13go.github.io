import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface StaticPageProps {
  pageName: string
  title?: string
}

export const StaticPage: React.FC<StaticPageProps> = ({ pageName }) => {
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    // Fetch the pre-rendered HTML for this page
    fetch(`/rendered_pages/${pageName}.html`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((html) => {
        if (isMounted) {
          // Replace absolute links like https://gui13go.github.io/blogs/... with relative /blogs/...
          const cleaned = html.replace(/https:\/\/gui13go\.github\.io\//g, '/')
          setHtmlContent(cleaned)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error(`Failed to load rendered page ${pageName}:`, err)
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [pageName])

  // Intercept clicks on internal links to use React Router navigation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      // If it is an internal anchor / route, navigate smoothly
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
          Loading content...
        </div>
      </main>
    )
  }

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
