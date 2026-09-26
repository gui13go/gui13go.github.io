import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface StaticPageProps {
  pageName: string
}

export const StaticPage: React.FC<StaticPageProps> = ({ pageName }) => {
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Fetch the pre-rendered HTML for this page
    fetch(`/rendered_pages/${pageName}.html`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((html) => {
        if (isMounted) {
          // Normalize links to use local SPA routes
          const cleaned = html
            .replace(/https:\/\/gui13go\.github\.io\//g, '/')
            .replace(/http:\/\/localhost:1313\//g, '/')
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

  // Execute embedded scripts when HTML updates (enables interactive galleries, filters, tools)
  useEffect(() => {
    const container = containerRef.current
    if (!container || !htmlContent) return

    const scripts = Array.from(container.querySelectorAll('script'))
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      if (oldScript.src) {
        newScript.src = oldScript.src
      } else {
        newScript.textContent = oldScript.textContent
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [htmlContent])

  // Intercept clicks on internal links to use React Router navigation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      // Handle internal relative paths
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
