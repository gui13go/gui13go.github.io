import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  Server,
  Cpu,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Radio,
  ShieldCheck,
  Zap,
  Terminal,
  Sparkles,
} from 'lucide-react'
import { useBackendHealth } from '../hooks/useBackendHealth'
import { API_BASE_URL } from '../config/api'

export const StatusPage: React.FC = () => {
  const { isOnline, isOllamaConnected, health, isFetching, refetch } = useBackendHealth()
  const [pingLatency, setPingLatency] = useState<number | null>(null)
  const [isPinging, setIsPinging] = useState(false)

  const handlePingTest = async () => {
    setIsPinging(true)
    const start = performance.now()
    try {
      const res = await fetch(`${API_BASE_URL}/health?t=${Date.now()}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(3000),
      })
      if (res.ok) {
        setPingLatency(Math.round(performance.now() - start))
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
    <main className="main" style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Header bar */}
      <header className="gallery-header" style={{ marginBottom: '28px' }}>
        <div className="gallery-breadcrumbs">
          <Link to="/">Home</Link> <span>/</span> <span>Diagnostics</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h1 className="gallery-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity style={{ width: '28px', height: '28px', color: 'var(--theme-accent)' }} />
              <span>Workstation & Gateway Diagnostics</span>
            </h1>
            <p className="gallery-subtitle">
              Real-time telemetry of your self-hosted Linux Mini PC, Cloudflare Tunnel link, and Ollama inference node.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePingTest}
              disabled={isPinging || isFetching}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'var(--tertiary)',
                border: '1px solid var(--theme-border)',
                color: 'var(--primary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
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
              <span>{isPinging ? 'Pinging...' : pingLatency !== null ? `${pingLatency}ms Ping` : 'Ping Latency'}</span>
            </button>

            <button
              onClick={() => refetch()}
              disabled={isFetching}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'var(--entry)',
                border: '1px solid var(--theme-border)',
                color: 'var(--primary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RefreshCw
                style={{
                  width: '14px',
                  height: '14px',
                  animation: isFetching ? 'spin 1s linear infinite' : 'none',
                }}
              />
              <span>{isFetching ? 'Probing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Architecture Topology Status Bar */}
      <section
        style={{
          background: 'var(--entry)',
          border: '1px solid var(--theme-border)',
          borderRadius: 'var(--theme-card-radius)',
          padding: '24px',
          marginBottom: '28px',
        }}
      >
        <h3 style={{ margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
          End-to-End System Topology
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
          }}
        >
          {/* Step 1: Static Edge CDN */}
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'var(--tertiary)',
              border: '1px solid var(--theme-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Frontend Edge CDN</span>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#34d399',
              }}
            >
              <CheckCircle2 style={{ width: '12px', height: '12px' }} />
              ACTIVE (GitHub Pages)
            </span>
            <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: 'var(--secondary)' }}>
              100% resilient fallback mode always available globally.
            </p>
          </div>

          {/* Step 2: Encrypted Cloudflare Tunnel */}
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'var(--tertiary)',
              border: '1px solid var(--theme-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck style={{ width: '16px', height: '16px', color: '#a78bfa' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Cloudflare Tunnel</span>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: isOnline ? '#34d399' : '#f43f5e',
              }}
            >
              {isOnline ? (
                <>
                  <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                  CONNECTED
                </>
              ) : (
                <>
                  <XCircle style={{ width: '12px', height: '12px' }} />
                  INACTIVE
                </>
              )}
            </span>
            <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: 'var(--secondary)' }}>
              Zero open inbound ports. Encrypted wireguard tunnel.
            </p>
          </div>

          {/* Step 3: Local FastAPI Gateway */}
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'var(--tertiary)',
              border: '1px solid var(--theme-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Server style={{ width: '16px', height: '16px', color: '#34d399' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Mini PC Gateway</span>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: isOnline ? '#34d399' : '#f43f5e',
              }}
            >
              {isOnline ? (
                <>
                  <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                  FASTAPI ONLINE
                </>
              ) : (
                <>
                  <XCircle style={{ width: '12px', height: '12px' }} />
                  OFFLINE
                </>
              )}
            </span>
            <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: 'var(--secondary)' }}>
              Dockerized FastAPI service with rate limiting & CORS.
            </p>
          </div>

          {/* Step 4: Ollama Local GPU Engine */}
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'var(--tertiary)',
              border: '1px solid var(--theme-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Cpu style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Ollama AI Engine</span>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: isOllamaConnected ? '#34d399' : isOnline ? '#f59e0b' : '#f43f5e',
              }}
            >
              {isOllamaConnected ? (
                <>
                  <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                  MODELS READY
                </>
              ) : isOnline ? (
                <>
                  <XCircle style={{ width: '12px', height: '12px' }} />
                  OLLAMA DOWN
                </>
              ) : (
                <>
                  <XCircle style={{ width: '12px', height: '12px' }} />
                  UNAVAILABLE
                </>
              )}
            </span>
            <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: 'var(--secondary)' }}>
              Self-hosted weights with local GPU offloading.
            </p>
          </div>
        </div>
      </section>

      {/* Main Diagnostic Telemetry Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Node Connectivity */}
        <div
          style={{
            background: 'var(--entry)',
            border: '1px solid var(--theme-border)',
            borderRadius: 'var(--theme-card-radius)',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server style={{ width: '20px', height: '20px', color: 'var(--theme-accent)' }} />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Gateway API Link</h3>
            </div>
            {isOnline ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: 'rgba(52, 211, 153, 0.12)',
                  color: '#34d399',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                }}
              >
                <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                ONLINE
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: 'rgba(244, 63, 94, 0.12)',
                  color: '#f43f5e',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                }}
              >
                <XCircle style={{ width: '12px', height: '12px' }} />
                OFFLINE
              </span>
            )}
          </div>

          <div style={{ fontSize: '0.82rem', fontFamily: 'var(--code-font)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--theme-border)' }}>
              <span style={{ color: 'var(--secondary)' }}>Target Endpoint:</span>
              <span style={{ color: 'var(--primary)' }}>{API_BASE_URL}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--theme-border)' }}>
              <span style={{ color: 'var(--secondary)' }}>Service:</span>
              <span style={{ color: 'var(--primary)' }}>{health?.service || 'FastAPI Workstation Gateway'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--theme-border)' }}>
              <span style={{ color: 'var(--secondary)' }}>Latency:</span>
              <span style={{ color: pingLatency ? '#34d399' : 'var(--secondary)' }}>
                {pingLatency ? `${pingLatency} ms` : isOnline ? 'Connected' : 'Unreachable'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: 'var(--secondary)' }}>Last Telemetry:</span>
              <span style={{ color: 'var(--primary)' }}>
                {health?.timestamp ? new Date(health.timestamp * 1000).toLocaleTimeString() : 'Awaiting node link'}
              </span>
            </div>
          </div>
        </div>

        {/* Ollama LLM Engine */}
        <div
          style={{
            background: 'var(--entry)',
            border: '1px solid var(--theme-border)',
            borderRadius: 'var(--theme-card-radius)',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu style={{ width: '20px', height: '20px', color: '#a78bfa' }} />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Local Ollama Engine</h3>
            </div>
            {isOllamaConnected ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: 'rgba(52, 211, 153, 0.12)',
                  color: '#34d399',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                }}
              >
                <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                READY
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                }}
              >
                <XCircle style={{ width: '12px', height: '12px' }} />
                UNAVAILABLE
              </span>
            )}
          </div>

          <div style={{ fontSize: '0.82rem', fontFamily: 'var(--code-font)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--theme-border)' }}>
              <span style={{ color: 'var(--secondary)' }}>GPU Acceleration:</span>
              <span style={{ color: 'var(--primary)' }}>{health?.gpu ? 'CUDA / ROCm Active' : 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--theme-border)' }}>
              <span style={{ color: 'var(--secondary)' }}>Active Models:</span>
              <span style={{ color: 'var(--theme-accent)', fontWeight: 600 }}>
                {health?.models && health.models.length > 0 ? health.models.join(', ') : 'None loaded'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--theme-border)' }}>
              <span style={{ color: 'var(--secondary)' }}>Inference Protocol:</span>
              <span style={{ color: 'var(--primary)' }}>Server-Sent Events (SSE)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: 'var(--secondary)' }}>Health Check:</span>
              <span style={{ color: 'var(--primary)' }}>Automated every 30s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting and commands */}
      {(!isOnline || !isOllamaConnected) && (
        <section
          style={{
            background: 'var(--entry)',
            border: '1px dashed var(--theme-border)',
            borderRadius: 'var(--theme-card-radius)',
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>
            Powering on the local backend on your Linux Mini PC
          </h4>
          <p style={{ margin: '0 0 14px', fontSize: '0.84rem', color: 'var(--secondary)' }}>
            Execute the following commands on your local machine to spin up Ollama and the encrypted tunnel:
          </p>
          <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.82rem', fontFamily: 'var(--code-font)', lineHeight: 1.8, color: 'var(--secondary)' }}>
            <li>
              Start Ollama daemon:{' '}
              <code style={{ color: 'var(--theme-accent)', background: 'var(--tertiary)', padding: '2px 6px', borderRadius: '4px' }}>
                systemctl start ollama
              </code>
            </li>
            <li>
              Navigate to backend directory:{' '}
              <code style={{ color: 'var(--theme-accent)', background: 'var(--tertiary)', padding: '2px 6px', borderRadius: '4px' }}>
                cd backend/
              </code>
            </li>
            <li>
              Verify your Cloudflare token in <code style={{ color: 'var(--theme-accent)' }}>.env</code>: <code style={{ color: 'var(--secondary)' }}>TUNNEL_TOKEN=...</code>
            </li>
            <li>
              Launch containerized stack:{' '}
              <code style={{ color: 'var(--theme-accent)', background: 'var(--tertiary)', padding: '2px 6px', borderRadius: '4px' }}>
                docker compose up -d
              </code>
            </li>
          </ol>
        </section>
      )}

      {/* Quick Action Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <Link
          to="/ai-chat/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'var(--theme-accent-gradient)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
            boxShadow: '0 2px 12px var(--theme-accent-glow)',
          }}
        >
          <Sparkles style={{ width: '16px', height: '16px' }} />
          <span>Launch AI Inference Interface</span>
        </Link>
        <Link
          to="/blogs/locking-the-gate/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'var(--tertiary)',
            border: '1px solid var(--theme-border)',
            color: 'var(--primary)',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          <Terminal style={{ width: '16px', height: '16px' }} />
          <span>Read Zero-Trust Edge Bastion Architecture</span>
        </Link>
      </div>
    </main>
  )
}
