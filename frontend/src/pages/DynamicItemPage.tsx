import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface DynamicItemProps {
  section: 'rendered_posts' | 'rendered_tools' | 'rendered_gallery' | 'rendered_geolayers' | 'rendered_publications' | 'rendered_versus'
}

const ALIASES: Record<string, string> = {
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

export const DynamicItemPage: React.FC<DynamicItemProps> = ({ section }) => {
  const { slug } = useParams<{ slug: string }>()
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!slug) return
    const resolvedSlug = ALIASES[slug] || slug
    setLoading(true)
    setError(false)
    window.scrollTo({ top: 0, behavior: 'instant' })

    fetch(`/${section}/${resolvedSlug}.html`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((html) => {
        const cleaned = html
          .replace(/https:\/\/gui13go\.github\.io\//g, '/')
          .replace(/http:\/\/localhost:1313\//g, '/')
          
        const parser = new DOMParser()
        const doc = parser.parseFromString(cleaned, 'text/html')
        const mainElement = doc.querySelector('main')
        const contentToInject = mainElement ? mainElement.innerHTML : cleaned

        setHtmlContent(contentToInject)
        setLoading(false)
      })
      .catch((err) => {
        console.error(`Error loading item ${slug} (${resolvedSlug}):`, err)
        setError(true)
        setLoading(false)
      })
  }, [section, slug])

  // Execute embedded scripts when HTML updates (enables pomodoro, interactive timers, map renders, audio)
  useEffect(() => {
    const container = containerRef.current
    if (!container || !htmlContent) return

    const scripts = Array.from(container.querySelectorAll('script'))
    scripts.forEach((oldScript) => {
      if (oldScript.type && oldScript.type.includes('json')) {
        return
      }

      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      if (oldScript.src) {
        newScript.src = oldScript.src
      } else {
        let code = oldScript.textContent || ''
        // Ensure DOMContentLoaded listeners execute in React SPA
        code = code.replace(
          /document\.addEventListener\(\s*["']DOMContentLoaded["']\s*,\s*(function|\()/g,
          '(function(cb){ if(document.readyState !== "loading") { setTimeout(cb, 10); } else { document.addEventListener("DOMContentLoaded", cb); } })($1'
        )
        newScript.textContent = code
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })

    // Inject code copy buttons on code blocks
    const preBlocks = container.querySelectorAll('pre')
    preBlocks.forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return
      const button = document.createElement('button')
      button.className = 'code-copy-btn'
      button.textContent = 'Copy'
      button.setAttribute('aria-label', 'Copy code to clipboard')
      button.addEventListener('click', (e) => {
        e.stopPropagation()
        const code = pre.querySelector('code')?.innerText || pre.innerText
        navigator.clipboard.writeText(code).then(() => {
          button.textContent = 'Copied!'
          setTimeout(() => {
            button.textContent = 'Copy'
          }, 2000)
        })
      })
      pre.style.position = 'relative'
      pre.appendChild(button)
    })

    const timer = setTimeout(() => {
      document.dispatchEvent(new Event('DOMContentLoaded'))
      window.dispatchEvent(new Event('DOMContentLoaded'))
      window.dispatchEvent(new Event('load'))
      window.dispatchEvent(new Event('resize'))
    }, 30)

    return () => clearTimeout(timer)
  }, [htmlContent])

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

  return <main className="main" ref={containerRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
}
