import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
      <div className="brand">
        <svg className="logo" viewBox="0 0 48 48" fill="none">
          <ellipse cx="24" cy="24" rx="13" ry="21" transform="rotate(45 24 24)" fill="#ffd60a" stroke="#0a1a33" strokeWidth="2.5"/>
          <path d="M14 24 L34 24" stroke="#0a1a33" strokeWidth="2.5"/>
          <path d="M19 19 L29 29 M20.5 24 L27.5 24 M24 20.5 L24 27.5" stroke="#0a1a33" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span className="name">CRLP</span>
      </div>
      <div className="navlinks">
        <a href="#agenda">Agenda</a>
        <a href="#valores">Club</a>
        <a href="#equipos">Equipos</a>
        <a href="#join" className="nav-cta">Únete</a>
      </div>
    </nav>
  )
}
