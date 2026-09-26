import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { useBackendHealth } from '../hooks/useBackendHealth'

export const Layout: React.FC = () => {
  const { isOnline, isOllamaConnected, refetch, isFetching } = useBackendHealth()

  return (
    <>
      {/* Offline resilience banner with graceful notification */}
      {(!isOnline || !isOllamaConnected) && (
        <div className="resilience-banner" role="alert">
          <div>
            <strong>Workstation API is currently offline.</strong> AI features are unavailable.
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? 'Probing...' : 'Check Status'}
          </button>
        </div>
      )}

      {/* Header with Site Brand, Instant Search, Theme Toggle, and Navigation Tabs */}
      <Header />

      {/* Main Outlet */}
      <Outlet />

      {/* Footer */}
      <Footer />
    </>
  )
}
