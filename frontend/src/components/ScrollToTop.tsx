import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!visible) return null

  return (
    <button
      id="top-link"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 90,
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: 'var(--entry)',
        border: '1px solid var(--theme-border)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.borderColor = 'var(--theme-accent)'
        e.currentTarget.style.color = 'var(--theme-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--theme-border)'
        e.currentTarget.style.color = 'var(--primary)'
      }}
    >
      <ArrowUp style={{ width: '18px', height: '18px' }} />
    </button>
  )
}
