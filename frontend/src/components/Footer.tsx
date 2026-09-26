import React from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  Rss,
  Server,
  Sparkles,
  Activity,
  ArrowUp,
} from 'lucide-react'
import { useBackendHealth } from '../hooks/useBackendHealth'

export const Footer: React.FC = () => {
  const { isOnline, isOllamaConnected, health } = useBackendHealth()
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer site-footer">
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '48px 24px 32px',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {/* Main 4-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '36px',
            marginBottom: '40px',
          }}
        >
          {/* Column 1: Identity & Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <Link
                to="/"
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  background: 'var(--theme-accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Gui13go
              </Link>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Guilherme</span>
                <span className="chinese-accent" lang="zh">
                  威廉
                </span>
                <span>Viegas</span>
              </div>
            </div>

            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--secondary)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Systems Engineer & Strategic Data Architect bridging Linux systems, zero-trust cloud infrastructure, reproducible research, and self-hosted AI compute.
            </p>

            {/* Social & Contact Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <a
                href="https://github.com/gui13go"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'var(--tertiary)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--secondary)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 0C5.37.0.0 5.37.0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57.0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925.0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18.0.0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225.0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22.0 1.605-.015 2.895-.015 3.3.0.315.225.69.825.57A12.02 12.02.0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com/in/guilherme-viegas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'var(--tertiary)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--secondary)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M19 0H5C2.239.0.0 2.239.0 5v14c0 2.761 2.239 5 5 5h14c2.762.0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966.0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
                </svg>
              </a>

              <a
                href="mailto:gui.viegas19@gmail.com"
                aria-label="Send Email"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'var(--tertiary)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--secondary)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <Mail style={{ width: '16px', height: '16px' }} />
              </a>

              <Link
                to="/search/"
                aria-label="Search Catalog"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'var(--tertiary)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--secondary)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <Rss style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>
          </div>

          {/* Column 2: Navigation & Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--primary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                margin: '0 0 4px',
              }}
            >
              Exploration
            </h4>
            <Link to="/about/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              About
            </Link>
            <Link to="/agents/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              Autonomous Agents
            </Link>
            <Link to="/blogs/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              Technical Blogs (20)
            </Link>
            <Link to="/publications/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              Publications & Research
            </Link>
            <Link to="/geolayers/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              GeoLayers Spatial Maps
            </Link>
            <Link to="/gallery/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              Reference Gallery
            </Link>
            <Link to="/search/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              Interactive Search
            </Link>
          </div>

          {/* Column 3: Interactive Simulators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--primary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                margin: '0 0 4px',
              }}
            >
              Simulators & Tools
            </h4>
            <Link to="/tools/pomodoro/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              Pomodoro Flow Timer
            </Link>
            <Link to="/tools/currency-chart/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              Currency Exchange Charter
            </Link>
            <Link to="/tools/egg-cooking-timer/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              Egg Cooking Thermodynamics
            </Link>
            <Link to="/geolayers/solar-terminator/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              Solar Terminator Projection
            </Link>
            <Link to="/gallery/versus/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              Versus Battles (115)
            </Link>
            <Link to="/gallery/dictionary/" style={{ fontSize: '0.85rem', color: 'var(--secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>
              Engineering Dictionary
            </Link>
          </div>

          {/* Column 4: Self-Hosted Node & Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--primary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                margin: '0 0 4px',
              }}
            >
              Self-Hosted Compute
            </h4>

            {/* Live Node Status Card */}
            <div
              style={{
                background: 'var(--tertiary)',
                border: '1px solid var(--theme-border)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Server style={{ width: '14px', height: '14px', color: 'var(--theme-accent)' }} />
                  <span>Mini PC Gateway</span>
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isOnline ? (isOllamaConnected ? '#10b981' : '#f59e0b') : '#f43f5e',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isOnline ? (isOllamaConnected ? '#10b981' : '#f59e0b') : '#f43f5e',
                      display: 'inline-block',
                      boxShadow: isOnline && isOllamaConnected ? '0 0 6px #10b981' : 'none',
                    }}
                  />
                  <span>
                    {isOnline ? (isOllamaConnected ? 'AI Online' : 'API Active') : 'Standby'}
                  </span>
                </span>
              </div>

              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--secondary)', lineHeight: 1.45 }}>
                {isOnline
                  ? isOllamaConnected
                    ? `Active WireGuard tunnel. Ollama ${health?.models?.[0] || 'Llama 3.2'} ready for SSE inference.`
                    : 'Active WireGuard link. Ollama inference engine standby.'
                  : 'Frontend operating in resilient CDN fallback mode via GitHub Pages.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <Link
                  to="/status/"
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'var(--entry)',
                    border: '1px solid var(--theme-border)',
                  }}
                >
                  <Activity style={{ width: '12px', height: '12px' }} />
                  <span>Diagnostics</span>
                </Link>

                <Link
                  to="/ai-chat/"
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: '#fff',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'var(--theme-accent-gradient)',
                    boxShadow: '0 2px 8px var(--theme-accent-glow)',
                  }}
                >
                  <Sparkles style={{ width: '12px', height: '12px' }} />
                  <span>Launch AI</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Footer / Divider */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid var(--theme-border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            fontSize: '0.8rem',
            color: 'var(--secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>&copy; {currentYear} Guilherme's Hub</span>
            <span>&bull;</span>
            <span style={{ color: 'var(--primary)', fontWeight: 500 }}>Open Code, Open Mind 🚀</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.78rem' }}>
              Built with Vite + React 19 + TypeScript
            </span>
            <button
              onClick={scrollToTop}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'var(--tertiary)',
                border: '1px solid var(--theme-border)',
                color: 'var(--primary)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title="Scroll to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp style={{ width: '12px', height: '12px' }} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
