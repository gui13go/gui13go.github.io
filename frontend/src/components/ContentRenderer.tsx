import React, { useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

interface ContentRendererProps {
  htmlContent: string
  loading?: boolean
  error?: boolean
  errorMessage?: string
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  htmlContent,
  loading = false,
  error = false,
  errorMessage = 'The requested content could not be loaded.',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Automatically wrap local raster <img> elements in <picture> tags with AVIF and WebP sources
  const processedHtml = useMemo(() => {
    if (!htmlContent) return ''
    return htmlContent.replace(
      /(<picture[^>]*>[\s\S]*?<\/picture>)|(<img\b([^>]*\bsrc=["']((?:https?:\/\/[^/]+)?\/(?:images|photos)\/[^"']+\.(?:jpg|jpeg|png))["'][^>]*)>)/gi,
      (_match, pictureTag, imgTag, _attrs, src) => {
        if (pictureTag) return pictureTag
        const avifSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.avif')
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
        return `<picture><source type="image/avif" srcset="${avifSrc}"><source type="image/webp" srcset="${webpSrc}">${imgTag}</picture>`
      }
    )
  }, [htmlContent])

  // Execute embedded scripts when HTML updates (enables interactive charts, timers, map renders, audio)
  useEffect(() => {
    const container = containerRef.current
    if (!container || !processedHtml || loading || error) return

    const scripts = Array.from(container.querySelectorAll('script'))
    scripts.forEach((oldScript) => {
      // Ignore JSON data payloads (e.g. data configs)
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
        // Ensure DOMContentLoaded listeners execute properly in React SPA
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

    // Dispatch lifecycle events to trigger listeners
    const timer = setTimeout(() => {
      document.dispatchEvent(new Event('DOMContentLoaded'))
      window.dispatchEvent(new Event('DOMContentLoaded'))
      window.dispatchEvent(new Event('load'))
      window.dispatchEvent(new Event('resize'))
    }, 30)

    return () => clearTimeout(timer)
  }, [processedHtml, loading, error])

  // Intercept internal navigation to keep SPA navigation smooth
  useEffect(() => {
    const container = containerRef.current
    if (!container || loading || error) return

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
  }, [processedHtml, loading, error, navigate])

  if (loading) {
    return (
      <main
        className="main"
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: 'var(--secondary)',
            fontFamily: 'var(--code-font)',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span className="loading-spinner" />
          Loading content...
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="main" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Content Not Found</h1>
        <p style={{ color: 'var(--secondary)', marginTop: '10px', maxWidth: '480px', margin: '0 auto' }}>
          {errorMessage}
        </p>
        <button
          onClick={() => navigate('/')}
          className="read-more-link"
          style={{
            marginTop: '24px',
            padding: '8px 20px',
            background: 'var(--entry)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            cursor: 'pointer',
            color: 'var(--primary)',
            fontSize: '0.9rem',
          }}
        >
          Return Home
        </button>
      </main>
    )
  }

  return (
    <main
      className="main"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  )
}
