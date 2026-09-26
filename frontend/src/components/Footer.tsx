import React from 'react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer site-footer">
      <div
        className="footer-inner"
        style={{
          maxWidth: '1080px',
          margin: '0 auto',
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: '0.88rem',
          color: 'var(--secondary)',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <span>&copy; {currentYear} Guilherme's Hub &bull; Open Code, Open Mind 🚀</span>
      </div>
    </footer>
  )
}

