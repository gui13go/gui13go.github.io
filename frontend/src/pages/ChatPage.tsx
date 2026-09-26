import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Send,
  Square,
  Sparkles,
  AlertCircle,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Activity,
  ArrowRight,
} from 'lucide-react'
import { useStreamingChat } from '../hooks/useStreamingChat'
import { useBackendHealth } from '../hooks/useBackendHealth'

const SUGGESTED_PROMPTS = [
  'How do eBPF probes trace Linux kernel syscalls without patching code?',
  'Explain how Cloudflare Tunnel routes traffic without opening inbound firewall ports.',
  'What are the trade-offs between Monolithic and Microservice architectures?',
  'Summarize the key principles of the OSINT intelligence lifecycle.',
]

export const ChatPage: React.FC = () => {
  const [input, setInput] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { isOnline, isOllamaConnected, health } = useBackendHealth()
  const { messages, isStreaming, sendMessage, stopStreaming, clearMessages } =
    useStreamingChat({
      systemPrompt:
        "You are an intelligent AI assistant running locally on Guilherme Viegas's Linux Mini PC. You provide helpful, technical, concise, and accurate responses on Linux, systems engineering, security, and cloud architecture.",
    })

  const visibleMessages = messages.filter((m) => m.role !== 'system')

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleMessages, isStreaming])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    })
  }

  return (
    <main className="main" style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Header bar */}
      <header className="gallery-header" style={{ marginBottom: '20px' }}>
        <div className="gallery-breadcrumbs">
          <Link to="/">Home</Link> <span>/</span> <span>AI Gateway</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h1 className="gallery-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles style={{ width: '28px', height: '28px', color: 'var(--theme-accent)' }} />
              <span>Mini PC Local AI Inference</span>
            </h1>
            <p className="gallery-subtitle">
              Streaming inference from Ollama on your local Linux workstation via Cloudflare Tunnel.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/status/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'var(--tertiary)',
                border: '1px solid var(--theme-border)',
                color: 'var(--secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <Activity style={{ width: '13px', height: '13px' }} />
              <span>Node Telemetry</span>
            </Link>

            {visibleMessages.length > 0 && (
              <button
                onClick={clearMessages}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'var(--tertiary)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                title="Clear conversation"
              >
                <Trash2 style={{ width: '13px', height: '13px' }} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Offline Alert Box */}
      {(!isOnline || !isOllamaConnected) && (
        <div
          style={{
            background: 'rgba(217, 119, 6, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <AlertCircle style={{ width: '20px', height: '20px', color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
            <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '2px' }}>
              Mini PC Compute Node is Currently Offline
            </strong>
            <span style={{ color: 'var(--secondary)' }}>
              Inference requests require the local FastAPI service and Ollama to be running on your Linux workstation. The static portfolio and all cached articles remain 100% accessible via GitHub Pages!
            </span>
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      <div
        style={{
          background: 'var(--entry)',
          border: '1px solid var(--theme-border)',
          borderRadius: 'var(--theme-card-radius)',
          display: 'flex',
          flexDirection: 'column',
          height: '620px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Model Indicator Sub-header */}
        <div
          style={{
            padding: '10px 18px',
            borderBottom: '1px solid var(--theme-border)',
            background: 'var(--tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: 'var(--secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: isOnline && isOllamaConnected ? '#10b981' : '#f59e0b',
                display: 'inline-block',
                boxShadow: isOnline && isOllamaConnected ? '0 0 6px #10b981' : 'none',
              }}
            />
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
              {isOnline && isOllamaConnected
                ? `Active Node • ${health?.models?.[0] || 'Llama 3.2'}`
                : 'Demo Standby Mode'}
            </span>
          </div>
          <span style={{ fontFamily: 'var(--code-font)' }}>SSE Streaming · Zero-Trust WireGuard</span>
        </div>

        {/* Message Log */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {visibleMessages.length === 0 ? (
            <div
              style={{
                margin: 'auto',
                maxWidth: '520px',
                textAlign: 'center',
                padding: '30px 10px',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: 'var(--theme-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Bot style={{ width: '28px', height: '28px' }} />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 700 }}>
                Query Local AI Architecture
              </h3>
              <p style={{ margin: '0 0 20px', fontSize: '0.88rem', color: 'var(--secondary)', lineHeight: 1.5 }}>
                Ask questions about Linux systems, eBPF kernel tracing, incident post-mortems, or explore topics covered across the portfolio.
              </p>

              {/* Prompt Suggestions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Suggested queries:
                </span>
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(prompt)
                      inputRef.current?.focus()
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'var(--tertiary)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--primary)',
                      fontSize: '0.82rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease, transform 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--theme-accent)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--theme-border)'
                      e.currentTarget.style.transform = 'none'
                    }}
                  >
                    <span>{prompt}</span>
                    <ArrowRight style={{ width: '13px', height: '13px', color: 'var(--theme-accent)', flexShrink: 0, marginLeft: '8px' }} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            visibleMessages.map((msg, idx) => {
              const isUser = msg.role === 'user'
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    maxWidth: '85%',
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  {!isUser && (
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: 'var(--theme-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <Bot style={{ width: '18px', height: '18px' }} />
                    </div>
                  )}

                  <div
                    style={{
                      background: isUser ? 'var(--theme-accent)' : 'var(--tertiary)',
                      color: isUser ? '#fff' : 'var(--primary)',
                      padding: '12px 16px',
                      borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      border: isUser ? 'none' : '1px solid var(--theme-border)',
                      fontSize: '0.88rem',
                      lineHeight: 1.6,
                      wordBreak: 'break-word',
                      position: 'relative',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.content}

                    {!isUser && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          marginTop: '8px',
                          paddingTop: '6px',
                          borderTop: '1px solid var(--theme-border)',
                        }}
                      >
                        <button
                          onClick={() => handleCopy(msg.content, idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--secondary)',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: 0,
                          }}
                          title="Copy response"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check style={{ width: '12px', height: '12px', color: '#10b981' }} />
                              <span style={{ color: '#10b981' }}>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy style={{ width: '12px', height: '12px' }} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--tertiary)',
                        border: '1px solid var(--theme-border)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <User style={{ width: '18px', height: '18px' }} />
                    </div>
                  )}
                </div>
              )
            })
          )}
          {isStreaming && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--theme-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bot style={{ width: '18px', height: '18px' }} />
              </div>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'var(--tertiary)',
                  border: '1px solid var(--theme-border)',
                  fontSize: '0.82rem',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--theme-accent)',
                    animation: 'pulse 1s infinite',
                  }}
                />
                <span>Streaming from local GPU...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--theme-border)',
            background: 'var(--theme)',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end',
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder={
              isOnline && isOllamaConnected
                ? 'Type your query (Press Enter to send, Shift+Enter for newline)...'
                : 'Node is currently offline. Type to draft or test...'
            }
            style={{
              flex: 1,
              background: 'var(--entry)',
              border: '1px solid var(--theme-border)',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.88rem',
              color: 'var(--primary)',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'none',
              lineHeight: 1.4,
            }}
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={stopStreaming}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: '#f43f5e',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '42px',
              }}
            >
              <Square style={{ width: '14px', height: '14px' }} />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                background: input.trim() ? 'var(--theme-accent-gradient)' : 'var(--tertiary)',
                color: input.trim() ? '#fff' : 'var(--secondary)',
                border: '1px solid var(--theme-border)',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '42px',
                transition: 'all 0.2s ease',
                boxShadow: input.trim() ? '0 2px 10px var(--theme-accent-glow)' : 'none',
              }}
            >
              <Send style={{ width: '14px', height: '14px' }} />
              <span>Send</span>
            </button>
          )}
        </form>
      </div>
    </main>
  )
}
