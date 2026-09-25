import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Terminal, Activity, ArrowRight } from 'lucide-react'
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

export const HugoHomePage: React.FC = () => {
  const { isOnline, isOllamaConnected } = useBackendHealth()

  return (
    <main className="main">
      {/* Home Hero matching Hugo */}
      <div className="home-hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge" style={{ marginBottom: '16px' }}>
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
                  ? 'Mini PC AI Inference Online'
                  : 'Mini PC Workstation Active'
                : 'Edge CDN Mode (Mini PC Offline)'}
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
              <span>Ask Local AI</span>
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

      {/* Highlighted Content matching Hugo */}
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
    </main>
  )
}
