import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Server,
  Radio,
  Clock,
  Calendar,
} from 'lucide-react'
import { useBackendHealth } from '../hooks/useBackendHealth'
import { API_BASE_URL } from '../config/api'

interface FeaturedPost {
  title: string
  url: string
  date: string
  readingTime: string
  summary: string
  image: string
  tags: string[]
  category: 'Security' | 'Linux' | 'OSINT' | 'Architecture'
}

const FEATURED_POSTS: FeaturedPost[] = [
  {
    title: 'The OSINT Top 10: Key Concepts to Demystify Open-Source Intelligence',
    url: '/blogs/the-osint-top10/',
    date: 'Sep 21, 2026',
    readingTime: '18 min read',
    category: 'OSINT',
    summary:
      'A comprehensive architectural guide demystifying Open-Source Intelligence (OSINT). Exploring intelligence lifecycles, reconnaissance taxonomy, pivotal tooling, strict operational security (OPSEC), sock puppet tradecraft, and legal boundaries for security analysts.',
    image: '/images/osint-top-10-demystifying-intelligence.jpg',
    tags: ['OSINT', 'Security', 'Intelligence'],
  },
  {
    title: 'Revolution OS: Documentary Review',
    url: '/blogs/revolution-os-review/',
    date: 'Sep 19, 2026',
    readingTime: '38 min read',
    category: 'Linux',
    summary:
      'A review and chronological dissection of 2001 documentary "Revolution OS". Exploring the 30-year collision between hacker ethics and corporate monopolies: Unix, Windows, GNU, the Linux Kernel, GNU Hurd, the FSF, the OSI, Red Hat, Debian, The Cathedral and the Bazaar, the GPL vs. MIT licenses, and the ideological clash between Richard Stallman, Linus Torvalds, Eric S. Raymond, and Bill Gates.',
    image: '/images/revolution-os-documentary-review.jpg',
    tags: ['Linux', 'Open Source', 'GNU'],
  },
  {
    title:
      'Weaponizing the Wordlist: How automated dictionary attacks probe and breach authentication endpoints.',
    url: '/blogs/weaponizing-the-wordlist-how-automated-dictionary-attacks-probe-and-breach-authentication-endpoints/',
    date: 'Sep 18, 2026',
    readingTime: '41 min read',
    category: 'Security',
    summary:
      'An exhaustive technical dissection of automated dictionary attacks, distributed password spraying, and offline cryptographic hash cracking. Analyzing how adversary botnets scan IPv4/IPv6 address spaces, probe network daemons (SSH, Web/APIs, Databases, FTP/Mail), weaponize GPU clusters against exfiltrated /etc/shadow hashes, and how systems engineers architect resilient defenses.',
    image: '/images/weaponizing-the-wordlist-automated-dictionary-attacks.jpg',
    tags: ['Security', 'Linux', 'Authentication'],
  },
  {
    title: 'Blameless by Design: A Pragmatic Guide to Incident Response and Post-Mortems',
    url: '/blogs/blameless-by-design-incident-response-post-mortems/',
    date: 'Sep 15, 2026',
    readingTime: '24 min read',
    category: 'Architecture',
    summary:
      'Building fault-tolerant systems and cultural resilience through blameless post-mortems, rigorous incident triage, root cause identification, and observability automation for cloud infrastructure.',
    image: '/images/blameless-incident-response-postmortems.jpg',
    tags: ['SRE', 'Observability', 'Resilience'],
  },
  {
    title: 'Root Watch: Monitoring Privilege, Identity, and Kernel Integrity',
    url: '/blogs/root-watch-monitoring-privilege-identity-kernel-integrity/',
    date: 'Sep 12, 2026',
    readingTime: '32 min read',
    category: 'Security',
    summary:
      'Low-level auditing of UID transitions, sudo privileges, PAM authentication pipelines, eBPF probe tracing, and real-time kernel integrity monitoring on enterprise Linux servers.',
    image: '/images/root-watch-server-auditing.jpg',
    tags: ['Kernel', 'Security', 'eBPF', 'Auditing'],
  },
  {
    title: 'Locking the Gate: Hardening Linux Bastions, SSH, and Firewall Perimeter',
    url: '/blogs/locking-the-gate/',
    date: 'Sep 05, 2026',
    readingTime: '28 min read',
    category: 'Linux',
    summary:
      'Step-by-step cryptographic hardening of OpenSSH daemon configurations, ED25519 key-only authentication, nftables packet filtering, and zero-trust port knocking on Linux edge bastions.',
    image: '/images/locking-the-gate-linux-hardening.jpg',
    tags: ['Linux', 'SSH', 'Firewall', 'Hardening'],
  },
]


const FILTER_CATEGORIES = ['All', 'Security', 'Linux', 'OSINT', 'Architecture'] as const

export const HomePage: React.FC = () => {
  const { isOnline, health, refetch, isFetching } = useBackendHealth()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
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

  const filteredPosts =
    selectedCategory === 'All'
      ? FEATURED_POSTS
      : FEATURED_POSTS.filter((p) => p.category === selectedCategory)

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


      {/* Highlighted Content with Interactive Category Filtering */}
      <div className="home-posts-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-heading">Highlighted Content</h2>
            <p className="section-desc">Here are some of the best contents from this website.</p>
          </div>
          <Link to="/blogs/" className="section-all-link">
            <span>View all 20 blogs</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--theme-accent)' : 'var(--theme-border)',
                background: selectedCategory === cat ? 'var(--theme-accent)' : 'var(--entry)',
                color: selectedCategory === cat ? '#fff' : 'var(--secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="home-posts-grid">
          {filteredPosts.map((post, idx) => (
            <article key={idx} className="featured-card">
              <Link to={post.url} className="card-cover-link">
                <div className="card-cover-wrapper">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="card-cover-img"
                  />
                  <div className="card-cover-gradient"></div>
                </div>
              </Link>

              <div className="card-body">
                <div className="card-meta">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar style={{ width: '13px', height: '13px' }} />
                    <time>{post.date}</time>
                  </span>
                  <span className="meta-dot">·</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock style={{ width: '13px', height: '13px' }} />
                    <span>{post.readingTime}</span>
                  </span>
                </div>

                <h3 className="card-title">
                  <Link to={post.url}>{post.title}</Link>
                </h3>

                <p className="card-summary">{post.summary}</p>

                <div className="card-footer">
                  <div className="card-tags">
                    {post.tags.map((tag) => (
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
                    to={post.url}
                    className="read-more-link"
                    aria-label={`Read ${post.title}`}
                  >
                    <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
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
