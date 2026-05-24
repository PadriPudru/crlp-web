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
        <img src="/logo_crlp.png" className="logo" alt="CRLP" />
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
