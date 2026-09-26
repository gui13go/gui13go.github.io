import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer site-footer">
      <div
        className="footer-inner"
        style={{
          maxWidth: '1080px',
          margin: '0 auto',
          padding: '24px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          fontSize: '0.88rem',
          color: 'var(--secondary)',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>&copy; {currentYear} Guilherme's Hub &bull; Open Code, Open Mind 🚀</span>
        </div>

        <div>
          <Link
            to="/ai-chat/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'var(--tertiary)',
              border: '1px solid var(--theme-border)',
              color: 'var(--primary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--theme-accent)'
              e.currentTarget.style.color = 'var(--theme-accent)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--theme-border)'
              e.currentTarget.style.color = 'var(--primary)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <Sparkles style={{ width: '13px', height: '13px', color: 'var(--theme-accent)' }} />
            <span>Ask AI</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
