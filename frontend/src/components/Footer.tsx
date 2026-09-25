import React from 'react'
import { Link } from 'react-router-dom'

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <span>Guilherme's Hub</span>
      <span>
        Open Code, Open Mind 🚀
      </span>
      <span>
        <Link to="/status/" style={{ textDecoration: 'underline', opacity: 0.8 }}>
          Mini PC Workstation Status
        </Link>
      </span>
    </footer>
  )
}
