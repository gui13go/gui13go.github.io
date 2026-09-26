import React, { useState, useEffect } from 'react'

export const ReadingProgressBar: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100
        setScrollPercentage(Math.min(100, Math.max(0, currentProgress)))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (scrollPercentage === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '2.5px',
        width: `${scrollPercentage}%`,
        background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
        zIndex: 10000,
        transition: 'width 0.1s linear',
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
      }}
    />
  )
}
