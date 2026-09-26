import React, { useState } from 'react'
import { Sparkles, X, Send, Bot, RefreshCw } from 'lucide-react'
import { useBackendHealth } from '../hooks/useBackendHealth'
import { useStreamingChat } from '../hooks/useStreamingChat'

export const FloatingAIWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const { isOnline, isOllamaConnected, refetch, isFetching } = useBackendHealth()
  const { messages, isStreaming, error, sendMessage, clearMessages } = useStreamingChat({
    systemPrompt:
      'You are a concise technical AI assistant running locally on Guilherme Viegas\'s self-hosted Linux Mini PC. Answer technical questions concisely.',
  })

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage(input.trim())
    setInput('')
  }

  const visibleMessages = messages.filter((m) => m.role !== 'system')

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Local AI Quick Chat"
        title="Open Local AI Assistant"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '76px',
          zIndex: 90,
          padding: '9px 16px',
          borderRadius: '9999px',
          background: 'var(--entry)',
          border: '1px solid var(--theme-border)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          fontFamily: 'var(--font-family)',
          fontSize: '0.85rem',
          fontWeight: 600,
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.borderColor = 'var(--theme-accent)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = 'var(--theme-border)'
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isOnline ? (isOllamaConnected ? '#10b981' : '#f59e0b') : '#f43f5e',
            boxShadow: isOnline
              ? isOllamaConnected
                ? '0 0 8px #10b981'
                : '0 0 8px #f59e0b'
              : '0 0 8px #f43f5e',
          }}
        />
        <Sparkles style={{ width: '15px', height: '15px', color: 'var(--theme-accent)' }} />
        <span>Ask AI</span>
      </button>

      {/* Quick Drawer / Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            width: 'min(380px, calc(100vw - 32px))',
            height: '460px',
            background: 'var(--entry)',
            border: '1px solid var(--theme-border)',
            borderRadius: '16px',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.35)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--theme-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot style={{ width: '18px', height: '18px', color: 'var(--theme-accent)' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Mini PC Local AI
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--secondary)' }}>
                  {isOnline
                    ? isOllamaConnected
                      ? 'Ollama GPU Stream Ready'
                      : 'Mini PC Online • Ollama Offline'
                    : 'Workstation Offline'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                style={{
                  padding: '4px',
                  color: 'var(--secondary)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>

          {/* Messages Log */}
          <div
            style={{
              flex: 1,
              padding: '12px 14px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.84rem',
            }}
          >
            {(!isOnline || !isOllamaConnected) && (
              <div
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fef3c7',
                  fontSize: '0.78rem',
                  lineHeight: 1.4,
                }}
              >
                <div>
                  <strong>Workstation is currently offline.</strong> Local AI inference is paused until the Mini PC is turned on.
                </div>
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  style={{
                    marginTop: '8px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'rgba(245, 158, 11, 0.25)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RefreshCw style={{ width: '12px', height: '12px' }} />
                  <span>{isFetching ? 'Pinging...' : 'Ping Node'}</span>
                </button>
              </div>
            )}

            {visibleMessages.length === 0 ? (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: 'var(--secondary)',
                  padding: '16px',
                }}
              >
                <Bot style={{ width: '32px', height: '32px', opacity: 0.4, marginBottom: '8px' }} />
                <p style={{ margin: 0, fontSize: '0.8rem' }}>
                  Ask questions about Linux kernels, system architecture, or papers on this site.
                </p>
              </div>
            ) : (
              visibleMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background:
                      msg.role === 'user' ? 'var(--theme-accent)' : 'var(--tertiary)',
                    color: msg.role === 'user' ? '#fff' : 'var(--primary)',
                    wordBreak: 'break-word',
                    lineHeight: 1.45,
                  }}
                >
                  {msg.content || (isStreaming ? 'Streaming...' : '')}
                </div>
              ))
            )}

            {error && (
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fda4af',
                  fontSize: '0.75rem',
                }}
              >
                {error}
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '10px 12px',
              borderTop: '1px solid var(--theme-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.05)',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!isOnline || !isOllamaConnected || isStreaming}
              placeholder={
                !isOnline || !isOllamaConnected
                  ? 'Workstation offline'
                  : 'Ask a quick question...'
              }
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--tertiary)',
                border: '1px solid var(--theme-border)',
                color: 'var(--primary)',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || !isOnline || !isOllamaConnected || isStreaming}
              aria-label="Send query"
              style={{
                padding: '8px',
                borderRadius: '8px',
                background: 'var(--theme-accent)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                opacity: !input.trim() || !isOnline || !isOllamaConnected || isStreaming ? 0.4 : 1,
              }}
            >
              <Send style={{ width: '14px', height: '14px' }} />
            </button>
            {visibleMessages.length > 0 && (
              <button
                type="button"
                onClick={clearMessages}
                title="Clear"
                style={{
                  padding: '4px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--secondary)',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                }}
              >
                Clear
              </button>
            )}
          </form>
        </div>
      )}
    </>
  )
}
