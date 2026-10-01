import React from 'react'
import { Link } from 'react-router-dom'
import { AlertOctagon, Home, Search } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export const NotFoundPage: React.FC = () => {
  useDocumentMeta({
    title: '404 - Page Not Found',
    description: 'The requested resource or page could not be located on this server.',
  })

  return (
    <main
      className="main"
      style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ef4444',
          marginBottom: '20px',
        }}
      >
        <AlertOctagon size={36} />
      </div>

      <h1
        style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          color: 'var(--primary)',
          margin: '0 0 12px 0',
          letterSpacing: '-0.025em',
        }}
      >
        404 &mdash; Page Not Found
      </h1>

      <p
        style={{
          color: 'var(--secondary)',
          fontSize: '1rem',
          maxWidth: '520px',
          lineHeight: '1.6',
          margin: '0 0 32px 0',
        }}
      >
        The URL you navigated to does not exist or has been restructured. Use the navigation bar above or search across our technical articles and tools.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            background: 'var(--entry)',
            border: '1px solid var(--border)',
            color: 'var(--primary)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Home size={16} />
          <span>Return to Dashboard</span>
        </Link>
        <Link
          to="/search"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: 'rgb(129, 140, 248)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Search size={16} />
          <span>Search Index</span>
        </Link>
      </div>
    </main>
  )
}
