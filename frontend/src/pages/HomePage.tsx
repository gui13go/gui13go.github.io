import React, { useState } from 'react'
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
  Server,
  Radio,
  MapPin,
  Clock,
  Calendar,
  Layers,
  Cpu,
  Flame,
  Globe,
  Timer,
  LineChart,
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
    image: '/images/blameless_by_design_cover.png',
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
    image: '/images/root_watch_cover.png',
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
    image: '/images/locking_the_gate_cover.png',
    tags: ['Linux', 'SSH', 'Firewall', 'Hardening'],
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
    count: '13 Collections',
    desc: 'Curated technical reference collections: network protocols, computer languages, 115 versus battles, and computing pioneers.',
    color: '#f472b6',
  },
]

const FEATURED_TOOLS = [
  {
    title: 'Pomodoro Flow State Timer',
    url: '/tools/pomodoro/',
    desc: 'Audio chime synthesis, custom interval sets, and visual progress ring for deep work cycles.',
    badge: 'Audio & Productivity',
    color: '#818cf8',
    icon: Timer,
  },
  {
    title: 'Currency Exchange Charter',
    url: '/tools/currency-chart/',
    desc: 'Interactive historical exchange rate analytics across 30+ fiat currencies with D3 SVG charts.',
    badge: 'Financial Analytics',
    color: '#34d399',
    icon: LineChart,
  },
  {
    title: 'Egg Cooking Thermodynamic Simulator',
    url: '/tools/egg-cooking-timer/',
    desc: 'Physics-based heat transfer equations determining yolk coagulation by egg mass and altitude.',
    badge: 'Thermodynamics',
    color: '#f59e0b',
    icon: Flame,
  },
  {
    title: 'Solar Terminator & Earth Shadows',
    url: '/geolayers/solar-terminator/',
    desc: 'Real-time D3 orthographic projection calculating the solar declination line and day/night boundary.',
    badge: 'Geospatial Cartography',
    color: '#60a5fa',
    icon: Globe,
  },
]

const FEATURED_VERSUS = [
  {
    title: 'Monolith vs Microservices',
    url: '/gallery/versus/monolith-vs-microservices/',
    category: 'Architecture Wars',
    sideA: 'Monolith',
    sideB: 'Microservices',
    summary: 'The Giant vs The Swarm. Operational simplicity vs independent scaling and deployment flexibility.',
    image: '/images/monolith_vs_microservices_versus_1768962234300.png',
  },
  {
    title: 'SQL vs NoSQL',
    url: '/gallery/versus/sql-vs-nosql/',
    category: 'Database Paradigms',
    sideA: 'SQL (Relational)',
    sideB: 'NoSQL (Non-Relational)',
    summary: 'Rigid schema & ACID integrity vs horizontal sharding & high-velocity document storage.',
    image: '/images/sql_nosql_versus_1768782039681.png',
  },
  {
    title: 'REST vs GraphQL',
    url: '/gallery/versus/rest-vs-graphql/',
    category: 'API Design',
    sideA: 'REST API',
    sideB: 'GraphQL',
    summary: 'Standard HTTP verbs & resource caching vs single-endpoint flexible query precision.',
    image: '/images/rest_graphql_versus_1768782054786.png',
  },
  {
    title: 'Edison vs Tesla',
    url: '/gallery/versus/edison-vs-tesla/',
    category: 'The War of Currents',
    sideA: 'Thomas Edison (DC)',
    sideB: 'Nikola Tesla (AC)',
    summary: 'Direct current patent monopolies vs alternating current long-distance electrical grid transformation.',
    image: '/images/edison_vs_tesla_versus_1769221673257.png',
  },
]

const POPULAR_TAGS = [
  'Linux',
  'Security',
  'OSINT',
  'Architecture',
  'Kernel',
  'eBPF',
  'SSH',
  'Kubernetes',
  'Incident Response',
  'Observability',
  'Productivity',
  'Data Science',
]

const FILTER_CATEGORIES = ['All', 'Security', 'Linux', 'OSINT', 'Architecture'] as const

export const HomePage: React.FC = () => {
  const { isOnline, isOllamaConnected, health, refetch, isFetching } = useBackendHealth()
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
          {/* Status Badge */}
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
            Systems Engineer & Strategic Data Architect bridging Linux systems, zero-trust cloud infrastructure,
            reproducible data science, and self-hosted AI compute.
          </p>

          {/* Bio Tags & Credentials */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '16px',
              fontSize: '0.85rem',
              color: 'var(--secondary)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <MapPin style={{ width: '14px', height: '14px', color: 'var(--theme-accent)' }} />
              Lisbon, Portugal
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Cpu style={{ width: '14px', height: '14px', color: '#a78bfa' }} />
              Linux & Virtualization
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Layers style={{ width: '14px', height: '14px', color: '#34d399' }} />
              Data Architecture & AI
            </span>
          </div>

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

      {/* Interactive Simulators & Engineering Tools */}
      <section style={{ maxWidth: '960px', margin: '0 auto 56px', padding: '0 20px' }}>
        <div className="section-header" style={{ marginBottom: '24px' }}>
          <div className="section-title-wrap">
            <h2 className="section-heading">Interactive Simulators & Engineering Tools</h2>
            <p className="section-desc">Zero-dependency client-side tools running audio synthesis, thermodynamics, and D3 math.</p>
          </div>
          <Link to="/tools/" className="section-all-link">
            <span>Explore all tools</span>
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {FEATURED_TOOLS.map((tool) => {
            const ToolIcon = tool.icon
            return (
              <Link
                key={tool.url}
                to={tool.url}
                className="featured-card"
                style={{
                  background: 'var(--entry)',
                  border: '1px solid var(--theme-border)',
                  borderRadius: 'var(--theme-card-radius)',
                  padding: '22px',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${tool.color}15`,
                        color: tool.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ToolIcon style={{ width: '20px', height: '20px' }} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'var(--tertiary)',
                        color: 'var(--secondary)',
                        border: '1px solid var(--theme-border)',
                      }}
                    >
                      {tool.badge}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {tool.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--secondary)', lineHeight: 1.5 }}>
                    {tool.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600, color: tool.color }}>
                  <span>Launch Simulator</span>
                  <ArrowRight style={{ width: '13px', height: '13px' }} />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Conceptual Clashes: Versus Battles */}
      <section style={{ maxWidth: '960px', margin: '0 auto 56px', padding: '0 20px' }}>
        <div className="section-header" style={{ marginBottom: '24px' }}>
          <div className="section-title-wrap">
            <h2 className="section-heading">Historical Clashes & Conceptual Versus Battles</h2>
            <p className="section-desc">Rigorous side-by-side trade-off analyses of ideas, architectures, and philosophies.</p>
          </div>
          <Link to="/gallery/versus/" className="section-all-link">
            <span>Explore all 115 battles</span>
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {FEATURED_VERSUS.map((battle) => (
            <Link
              key={battle.url}
              to={battle.url}
              className="featured-card"
              style={{
                background: 'var(--entry)',
                border: '1px solid var(--theme-border)',
                borderRadius: 'var(--theme-card-radius)',
                padding: '20px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#fb923c',
                    background: 'rgba(251, 146, 60, 0.12)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(251, 146, 60, 0.25)',
                  }}
                >
                  {battle.category}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--theme-accent)' }}>
                  VS
                </span>
              </div>

              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {battle.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--theme-accent)' }}>{battle.sideA}</span>
                  <span style={{ color: 'var(--secondary)', fontSize: '0.7rem' }}>vs</span>
                  <span style={{ color: '#f59e0b' }}>{battle.sideB}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--secondary)', lineHeight: 1.5 }}>
                  {battle.summary}
                </p>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--theme-border)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--secondary)' }}>Read breakdown</span>
                <ArrowRight style={{ width: '13px', height: '13px', color: 'var(--theme-accent)' }} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Highlighted Content with Interactive Category Filtering */}
      <div className="home-posts-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-heading">Highlighted Content</h2>
            <p className="section-desc">Deep-dive technical investigations, architecture reviews, and tutorials.</p>
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

      {/* Popular Research Tags Cloud */}
      <section style={{ maxWidth: '960px', margin: '0 auto 56px', padding: '0 20px' }}>
        <div
          style={{
            background: 'var(--entry)',
            border: '1px solid var(--theme-border)',
            borderRadius: 'var(--theme-card-radius)',
            padding: '24px 28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal style={{ width: '18px', height: '18px', color: 'var(--theme-accent)' }} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>
                Research & Engineering Topics
              </h3>
            </div>
            <Link
              to="/search/"
              style={{
                fontSize: '0.8rem',
                color: 'var(--theme-accent)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Full Search</span>
              <ArrowRight style={{ width: '12px', height: '12px' }} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {POPULAR_TAGS.map((tag) => (
              <Link
                key={tag}
                to={`/tags/${tag.toLowerCase()}/`}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  background: 'var(--tertiary)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--secondary)',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--theme-accent)'
                  e.currentTarget.style.borderColor = 'var(--theme-accent)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--secondary)'
                  e.currentTarget.style.borderColor = 'var(--theme-border)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

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
              <span>Diagnostics</span>
            </Link>

            <Link
              to="/ai-chat/"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'var(--theme-accent-gradient)',
                color: '#fff',
                fontSize: '0.84rem',
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
