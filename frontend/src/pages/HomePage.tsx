import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Server,
  Radio,
  Clock,
  Calendar,
  Swords,
  BookOpen,
  Wrench,
  Bot,
  Compass,
  Sparkles,
} from 'lucide-react'
import { useBackendHealth } from '../hooks/useBackendHealth'
import { API_BASE_URL } from '../config/api'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Picture } from '../components/Picture'

type HighlightBadge = 'Versus' | 'Blog' | 'Tool' | 'Agents' | 'GeoLayer' | 'Gallery'

interface HighlightedItem {
  id: string
  title: string
  url: string
  badge: HighlightBadge
  metaLeft: string
  metaRight: string
  summary: string
  image: string
  tags: string[]
}

const FEATURED_ITEMS: HighlightedItem[] = [
  {
    id: 'versus-battles',
    title: 'Versus Battles & Historical Debates',
    url: '/gallery/versus/',
    badge: 'Versus',
    metaLeft: '116 Battles',
    metaRight: 'Interactive Comparison',
    image: '/images/versus_cover.webp',
    summary:
      'An interactive compendium of 116 historic and conceptual clashes: Linux vs. Windows, Vim vs. Emacs, Monolith vs. Microservices, Compiled vs. Interpreted, and classic philosophical and historical rivalries.',
    tags: ['Versus', 'Architecture', 'History', 'Debate'],
  },
  {
    id: 'osint-top-10',
    title: 'The OSINT Top 10: Key Concepts to Demystify Open-Source Intelligence',
    url: '/blogs/the-osint-top10/',
    badge: 'Blog',
    metaLeft: 'Sep 21, 2026',
    metaRight: '18 min read',
    image: '/images/osint-top-10-demystifying-intelligence.jpg',
    summary:
      'A comprehensive architectural guide demystifying Open-Source Intelligence (OSINT). Exploring intelligence lifecycles, reconnaissance taxonomy, pivotal tooling, strict operational security (OPSEC), sock puppet tradecraft, and legal boundaries for security analysts.',
    tags: ['OSINT', 'Security', 'Intelligence'],
  },
  {
    id: 'revolution-os-timeline',
    title: 'Revolution OS: 50-Year Historical Computing Timeline',
    url: '/tools/revolution-os-timeline/',
    badge: 'Tool',
    metaLeft: '35 Milestones',
    metaRight: 'Chronological Roadmap',
    image: '/images/revolution-os-timeline.webp',
    summary:
      'An interactive, chronological roadmap and simulator tracing the evolution of Unix, GNU, the Linux kernel, open-source licensing wars, and the ideological clash between the hacker movement and corporate monopolies.',
    tags: ['Linux', 'History', 'Open Source', 'Tool'],
  },
  {
    id: 'autonomous-agents',
    title: 'Autonomous AI Personas & Swarm Intelligence Chambers',
    url: '/agents/',
    badge: 'Agents',
    metaLeft: '79 Personas',
    metaRight: 'Multi-Agent Swarm',
    image: '/images/agents/chamber_boardroom_1767720727673.webp',
    summary:
      'A specialized portfolio of 79 autonomous AI personas, multi-agent coordination chambers (Agora, Boardroom, War Room), domain-expert reasoning workflows, and live LLM telemetry.',
    tags: ['AI', 'Agents', 'Multi-Agent', 'LLM'],
  },
  {
    id: 'cities-visited',
    title: 'Cities I Have Visited: Geospatial Travel Intelligence',
    url: '/geolayers/cities-i-have-visited/',
    badge: 'GeoLayer',
    metaLeft: 'Interactive Map',
    metaRight: 'Global Telemetry',
    image: '/images/geolayers/cities-i-have-visited.jpg',
    summary:
      'Interactive high-resolution cartographic visualization and spatial narrative tracking visited cities, flights, airport corridors, and geographic exploration across South America, Europe, Asia, and beyond.',
    tags: ['GeoLayers', 'Geospatial', 'Travel', 'Interactive'],
  },
  {
    id: 'thinkers-gallery',
    title: 'Thinkers, Scientists & Philosophers Gallery',
    url: '/gallery/personalities/',
    badge: 'Gallery',
    metaLeft: '266 Thinkers',
    metaRight: 'Biographical Archive',
    image: '/images/personalities/alan_turing_portrait_1769882603197.webp',
    summary:
      'A curated visual and intellectual archive of 266 thinkers, scientists, philosophers, and hackers who shaped human history, complete with verified quotes, notable treatises, and chronological timelines.',
    tags: ['Philosophy', 'Science', 'History', 'Personalities'],
  },
  {
    id: 'weaponizing-wordlist',
    title: 'Weaponizing the Wordlist: Automated Dictionary Attacks & Perimeter Defense',
    url: '/blogs/weaponizing-the-wordlist-how-automated-dictionary-attacks-probe-and-breach-authentication-endpoints/',
    badge: 'Blog',
    metaLeft: 'Sep 18, 2026',
    metaRight: '41 min read',
    image: '/images/weaponizing-the-wordlist-automated-dictionary-attacks.jpg',
    summary:
      'An exhaustive technical dissection of automated dictionary attacks, distributed password spraying, and offline hash cracking against authentication endpoints with resilient Linux defense architectures.',
    tags: ['Security', 'Linux', 'Authentication'],
  },
  {
    id: 'computer-languages',
    title: 'Computer Languages: Evolution, Compilers & Typing Systems',
    url: '/gallery/computer-languages/',
    badge: 'Gallery',
    metaLeft: '39 Languages',
    metaRight: 'Execution Paradigms',
    image: '/images/compiled_vs_interpreted_versus.webp',
    summary:
      'In-depth comparative analysis of 39 programming languages, ahead-of-time compilation, JIT runtimes, memory models, typing paradigms, and the historical lineage from C and Lisp to Rust and Go.',
    tags: ['Languages', 'Compilers', 'Computer Science'],
  },
]

const getBadgeConfig = (
  badge: HighlightBadge
): { bg: string; text: string; border: string; icon: React.ReactNode } => {
  switch (badge) {
    case 'Versus':
      return {
        bg: 'rgba(239, 68, 68, 0.12)',
        text: '#ef4444',
        border: 'rgba(239, 68, 68, 0.25)',
        icon: <Swords size={12} />,
      }
    case 'Blog':
      return {
        bg: 'rgba(59, 130, 246, 0.12)',
        text: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.25)',
        icon: <BookOpen size={12} />,
      }
    case 'Tool':
      return {
        bg: 'rgba(245, 158, 11, 0.12)',
        text: '#f59e0b',
        border: 'rgba(245, 158, 11, 0.25)',
        icon: <Wrench size={12} />,
      }
    case 'Agents':
      return {
        bg: 'rgba(168, 85, 247, 0.12)',
        text: '#a855f7',
        border: 'rgba(168, 85, 247, 0.25)',
        icon: <Bot size={12} />,
      }
    case 'GeoLayer':
      return {
        bg: 'rgba(16, 185, 129, 0.12)',
        text: '#10b981',
        border: 'rgba(16, 185, 129, 0.25)',
        icon: <Compass size={12} />,
      }
    case 'Gallery':
      return {
        bg: 'rgba(236, 72, 153, 0.12)',
        text: '#ec4899',
        border: 'rgba(236, 72, 153, 0.25)',
        icon: <Sparkles size={12} />,
      }
  }
}

export const HomePage: React.FC = () => {
  useDocumentMeta({
    title: 'Dashboard',
    description:
      'Personal technical portfolio and systems research dashboard on GNU/Linux, Systems Engineering, Security, Virtualization, and Cloud Architecture.',
  })

  const { isOnline, health, refetch, isFetching } = useBackendHealth()
  const [pingLatency, setPingLatency] = useState<number | null>(null)
  const [isPinging, setIsPinging] = useState(false)

  const handlePingTest = async () => {
    setIsPinging(true)
    const start = performance.now()
    try {
      const res = await fetch(`${API_BASE_URL}/health?ping=${Date.now()}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(3000),
      })
      if (res.ok) {
        const duration = Math.round(performance.now() - start)
        setPingLatency(duration)
        refetch()
      } else {
        setPingLatency(null)
      }
    } catch {
      setPingLatency(null)
    } finally {
      setIsPinging(false)
    }
  }

  return (
    <main className="main">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-glow"></div>
        <div className="hero-content">

          <h1 className="hero-title">
            Hi, I'm <span className="gradient-text">Guilherme</span>{' '}
            <span className="chinese-accent" lang="zh">威廉</span>{' '}
            <span className="gradient-text">Viegas</span>
          </h1>
          <p className="hero-subtitle">
            I engineer intelligent solutions that turn data into compelling digital narratives using creativity, technique, code, and AI.
          </p>

          {/* Elegant generous open space replacing the former action buttons */}
          <div className="hero-spacer" aria-hidden="true" />
        </div>
      </div>


      {/* Highlighted Content */}
      <div className="home-posts-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-heading">Highlighted Content</h2>
            <p className="section-desc">Curated flagship highlights across interactive battles, deep-dive blogs, developer tools, and geospatial showcases.</p>
          </div>
        </div>

        <div className="home-posts-grid">
          {FEATURED_ITEMS.map((item) => {
            const badgeConf = getBadgeConfig(item.badge)
            return (
              <article key={item.id} className="featured-card">
                <Link to={item.url} className="card-cover-link">
                  <div className="card-cover-wrapper">
                    <Picture
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="card-cover-img"
                    />
                    <div className="card-cover-gradient"></div>
                  </div>
                </Link>

                <div className="card-body">
                  <div className="card-meta" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        background: badgeConf.bg,
                        color: badgeConf.text,
                        border: `1px solid ${badgeConf.border}`,
                      }}
                    >
                      {badgeConf.icon}
                      <span>{item.badge}</span>
                    </span>

                    <span className="meta-dot">·</span>

                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {item.badge === 'Blog' ? (
                        <Calendar style={{ width: '13px', height: '13px' }} />
                      ) : null}
                      <span>{item.metaLeft}</span>
                    </span>

                    <span className="meta-dot">·</span>

                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {item.badge === 'Blog' ? (
                        <Clock style={{ width: '13px', height: '13px' }} />
                      ) : null}
                      <span>{item.metaRight}</span>
                    </span>
                  </div>

                  <h3 className="card-title">
                    <Link to={item.url}>{item.title}</Link>
                  </h3>

                  <p className="card-summary">{item.summary}</p>

                  <div className="card-footer">
                    <div className="card-tags">
                      {item.tags.map((tag) => (
                        <Link
                          key={tag}
                          to={`/tags/${tag.toLowerCase()}/`}
                          className="tag-pill"
                          style={{ textDecoration: 'none' }}
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>

                    <Link
                      to={item.url}
                      className="read-more-link"
                      aria-label={`Explore ${item.title}`}
                    >
                      <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>


      {/* Mini PC Architecture & Live Telemetry Card */}
      <section style={{ maxWidth: '960px', margin: '0 auto 40px', padding: '0 20px' }}>
        <div
          style={{
            background: 'var(--entry)',
            border: '1px solid var(--theme-border)',
            borderRadius: 'var(--theme-card-radius)',
            padding: '28px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', maxWidth: '600px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: isOnline ? 'rgba(52, 211, 153, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                color: isOnline ? '#34d399' : '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Server style={{ width: '26px', height: '26px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Hybrid Edge & Mini PC Node
                </h3>
                {pingLatency !== null && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--code-font)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(52, 211, 153, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                    }}
                  >
                    {pingLatency}ms
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--secondary)', lineHeight: 1.5 }}>
                {isOnline
                  ? `Active encrypted link via Cloudflare Tunnel. Ollama running on local GPU (${health?.models?.length || 0} models ready).`
                  : 'Mini PC is currently powered off. The frontend is operating in resilient CDN fallback mode via GitHub Pages.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePingTest}
              disabled={isPinging || isFetching}
              title="Ping Mini PC gateway latency"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'var(--tertiary)',
                border: '1px solid var(--theme-border)',
                color: 'var(--primary)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <Radio
                style={{
                  width: '14px',
                  height: '14px',
                  color: isOnline ? '#34d399' : '#f59e0b',
                  animation: isPinging ? 'spin 1s linear infinite' : 'none',
                }}
              />
              <span>{isPinging ? 'Pinging...' : pingLatency ? `${pingLatency}ms Ping` : 'Ping Node'}</span>
            </button>

            <Link
              to="/status/"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'var(--tertiary)',
                border: '1px solid var(--theme-border)',
                color: 'var(--primary)',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Activity style={{ width: '14px', height: '14px' }} />
              <span>Full Diagnostics</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
