import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Terminal,
  Activity,
  ArrowRight,
  Bot,
  BookOpen,
  FileText,
  Compass,
  Wrench,
  Grid,
  Server
} from 'lucide-react'
import { useBackendHealth } from '../hooks/useBackendHealth'

interface FeaturedPost {
  title: string
  url: string
  date: string
  readingTime: string
  summary: string
  image: string
  tags: string[]
}

const FEATURED_POSTS: FeaturedPost[] = [
  {
    title: 'The OSINT Top 10: Key Concepts to Demystify Open-Source Intelligence',
    url: '/blogs/the-osint-top10/',
    date: 'Sep 21, 2026',
    readingTime: '18 min read',
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
    summary:
      'An exhaustive technical dissection of automated dictionary attacks, distributed password spraying, and offline cryptographic hash cracking. Analyzing how adversary botnets scan IPv4/IPv6 address spaces, probe network daemons (SSH, Web/APIs, Databases, FTP/Mail), weaponize GPU clusters against exfiltrated /etc/shadow hashes, and how systems engineers architect resilient defenses.',
    image: '/images/weaponizing-the-wordlist-automated-dictionary-attacks.jpg',
    tags: ['Security', 'Linux', 'Authentication'],
  },
]

const PORTFOLIO_PILLARS = [
  {
    to: '/agents/',
    title: 'Agents',
    icon: Bot,
    count: 'Reasoning Systems',
    desc: 'Autonomous agent architectures, cognitive pipelines, memory stores, and Model Context Protocol (MCP) integrations.',
    color: '#818cf8',
  },
  {
    to: '/blogs/',
    title: 'Blogs',
    icon: BookOpen,
    count: '20 Articles',
    desc: 'Technical investigations on GNU/Linux, virtualization, kernel security audits, incident response, and distributed systems.',
    color: '#60a5fa',
  },
  {
    to: '/publications/',
    title: 'Publications',
    icon: FileText,
    count: 'Research Papers',
    desc: 'Peer-reviewed academic research, reproducible computational pipelines, and technical posters (OSESC).',
    color: '#f59e0b',
  },
  {
    to: '/geolayers/',
    title: 'GeoLayers',
    icon: Compass,
    count: '10 Interactive Maps',
    desc: 'Geospatial intelligence, real-time solar terminators, global map projections, and spatial data science simulations.',
    color: '#34d399',
  },
  {
    to: '/tools/',
    title: 'Tools',
    icon: Wrench,
    count: '5 Simulators',
    desc: 'Interactive engineering simulators: Pomodoro flow state timer, currency exchange charter, and historical timelines.',
    color: '#a78bfa',
  },
  {
    to: '/gallery/',
    title: 'Gallery',
    icon: Grid,
    count: '12 Collections',
    desc: 'Curated technical reference collections: network protocols, computer languages, philosophies, and computing pioneers.',
    color: '#f472b6',
  },
]

export const HomePage: React.FC = () => {
  const { isOnline, isOllamaConnected, health } = useBackendHealth()

  return (
    <main className="main">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge" style={{ marginBottom: '18px' }}>
            <span
              className="badge-dot"
              style={{
                backgroundColor: isOnline ? (isOllamaConnected ? '#10b981' : '#f59e0b') : '#f43f5e',
                boxShadow: isOnline
                  ? isOllamaConnected
                    ? '0 0 10px #10b981'
                    : '0 0 10px #f59e0b'
                  : '0 0 10px #f43f5e',
              }}
            />
            <span>
              {isOnline
                ? isOllamaConnected
                  ? `Mini PC AI Online • ${health?.models?.[0] || 'Llama 3.2'} Ready`
                  : 'Mini PC Workstation Active'
                : 'Edge CDN Mode • Mini PC Offline'}
            </span>
          </div>

          <h1 className="hero-title">
            Hi, I'm <span className="gradient-text">Guilherme <span className="chinese-accent">威廉</span> Viegas</span>
          </h1>
          <p className="hero-subtitle">
            I engineer intelligent solutions that turn data into compelling digital narratives using creativity,
            technique, code, and AI.
          </p>

          {/* Quick Action Navigation CTAs */}
          <div className="hero-cta-group" style={{ marginTop: '28px' }}>
            <Link to="/ai-chat/" className="hero-btn primary">
              <Sparkles style={{ width: '16px', height: '16px' }} />
              <span>Launch Local AI</span>
            </Link>
            <Link to="/blogs/" className="hero-btn secondary">
              <Terminal style={{ width: '16px', height: '16px' }} />
              <span>Explore Research</span>
            </Link>
            <Link to="/status/" className="hero-btn secondary">
              <Activity style={{ width: '16px', height: '16px' }} />
              <span>Node Telemetry</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Portfolio Pillars Hub */}
      <section style={{ maxWidth: '960px', margin: '0 auto 56px', padding: '0 20px' }}>
        <div className="section-header" style={{ marginBottom: '24px' }}>
          <div className="section-title-wrap">
            <h2 className="section-heading">Engineering & Research Portfolio</h2>
            <p className="section-desc">Explore technical collections, interactive systems, and spatial intelligence.</p>
          </div>
        </div>

        <div className="gallery-hub-grid" style={{ marginTop: '0' }}>
          {PORTFOLIO_PILLARS.map((pillar) => {
            const Icon = pillar.icon
            return (
              <Link key={pillar.to} to={pillar.to} className="gallery-hub-card">
                <div className="gallery-hub-icon" style={{ color: pillar.color, background: `${pillar.color}15` }}>
                  <Icon style={{ width: '26px', height: '26px' }} />
                </div>
                <h2>{pillar.title}</h2>
                <p>{pillar.desc}</p>
                <div className="gallery-hub-meta" style={{ color: pillar.color }}>
                  <span>{pillar.count}</span>
                  <ArrowRight style={{ width: '14px', height: '14px', marginLeft: '4px' }} />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Highlighted Content */}
      <div className="home-posts-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-heading">Highlighted Content</h2>
            <p className="section-desc">Here are some of the best contents from this website.</p>
          </div>
          <Link to="/blogs/" className="section-all-link">
            <span>View all blogs</span>
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

        <div className="home-posts-grid">
          {FEATURED_POSTS.map((post, idx) => (
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
                  <time>{post.date}</time>
                  <span className="meta-dot">·</span>
                  <span>{post.readingTime}</span>
                </div>

                <h3 className="card-title">
                  <Link to={post.url}>{post.title}</Link>
                </h3>

                <p className="card-summary">{post.summary}</p>

                <div className="card-footer">
                  <div className="card-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="tag-pill">
                        #{tag}
                      </span>
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

      {/* Mini PC Architecture & Telemetry Section */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: isOnline ? 'rgba(52, 211, 153, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                color: isOnline ? '#34d399' : '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Server style={{ width: '24px', height: '24px' }} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                Hybrid Edge & Mini PC Infrastructure
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--secondary)' }}>
                {isOnline
                  ? `Active connection to private Linux compute node (${health?.models?.length || 0} models loaded)`
                  : 'Mini PC is currently powered off or disconnected. Static assets serve from GitHub Pages CDN.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/status/"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'var(--tertiary)',
                border: '1px solid var(--theme-border)',
                color: 'var(--primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Activity style={{ width: '14px', height: '14px' }} />
              <span>Diagnostics</span>
            </Link>
            <Link
              to="/ai-chat/"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'var(--theme-accent-gradient)',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 12px var(--theme-accent-glow)',
              }}
            >
              <Sparkles style={{ width: '14px', height: '14px' }} />
              <span>Open AI</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
