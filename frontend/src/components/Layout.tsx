import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'
import { ReadingProgressBar } from './ReadingProgressBar'
import { FloatingAIWidget } from './FloatingAIWidget'
import { useBackendHealth } from '../hooks/useBackendHealth'

export const Layout: React.FC = () => {
  const { isOnline, isOllamaConnected, refetch, isFetching } = useBackendHealth()
  const [dismissedKey, setDismissedKey] = React.useState<string | null>(null)

  const isHealthy = Boolean(isOnline && isOllamaConnected)
  const offlineStateKey = `${!isOnline}-${!isOllamaConnected}`
  const showBanner = !isHealthy && dismissedKey !== offlineStateKey

  return (
    <>
      {/* Top Reading Progress Indicator */}
      <ReadingProgressBar />

      {/* Offline resilience banner with graceful notification and dismiss button */}
      {showBanner && (
        <div className="resilience-banner" role="alert">
          <div className="resilience-banner-content">
            <strong>Backend is currently offline.</strong> AI features are unavailable.
          </div>
          <div className="resilience-banner-actions">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="resilience-check-btn"
            >
              {isFetching ? 'Probing...' : 'Check Status'}
            </button>
            <button
              onClick={() => setDismissedKey(offlineStateKey)}
              className="resilience-close-btn"
              aria-label="Dismiss offline warning"
              title="Close notification"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header with Site Brand, Instant Search, Theme Toggle, and Navigation Tabs */}
      <Header />

      {/* Main Outlet with Suspense for lazy route chunks */}
      <React.Suspense
        fallback={
          <main
            className="main"
            style={{
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                color: 'var(--secondary)',
                fontFamily: 'var(--code-font)',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span className="loading-spinner" />
              Loading...
            </div>
          </main>
        }
      >
        <Outlet />
      </React.Suspense>

      {/* Floating Utilities */}
      <ScrollToTop />
      <FloatingAIWidget />

      {/* Footer */}
      <Footer />
    </>
  )
}
