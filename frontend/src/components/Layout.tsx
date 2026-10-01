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
  const [isDismissed, setIsDismissed] = React.useState(false)

  // Reset dismissal if status transitions to healthy
  React.useEffect(() => {
    if (isOnline && isOllamaConnected) {
      setIsDismissed(false)
    }
  }, [isOnline, isOllamaConnected])

  return (
    <>
      {/* Top Reading Progress Indicator */}
      <ReadingProgressBar />

      {/* Offline resilience banner with graceful notification and dismiss button */}
      {(!isOnline || !isOllamaConnected) && !isDismissed && (
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
              onClick={() => setIsDismissed(true)}
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

      {/* Main Outlet */}
      <Outlet />

      {/* Floating Utilities */}
      <ScrollToTop />
      <FloatingAIWidget />

      {/* Footer */}
      <Footer />
    </>
  )
}
