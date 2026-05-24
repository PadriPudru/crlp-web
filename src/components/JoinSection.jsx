import { useState, useEffect } from 'react'

const DEFAULTS = {
  join_title_pre:       '¿Te atreves con el',
  join_title_highlight: 'oval',
  join_title_post:      '?',
  join_description:     'No hace falta experiencia, solo ganas. Ven a un entreno, prueba sin compromiso y descubre por qué quien entra a esta familia no se quiere ir.',
  join_instagram:       'https://www.instagram.com/crlp.gc/',
}

export default function JoinSection() {
  const [cfg, setCfg] = useState(DEFAULTS)

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(data => setCfg(c => ({ ...c, ...data }))).catch(() => {})
  }, [])

  return (
    <section id="join">
      <svg className="join-svg" viewBox="0 0 200 200">
        <ellipse cx="100" cy="100" rx="55" ry="92" transform="rotate(40 100 100)" fill="#0a1a33"/>
        <path d="M55 100 L145 100" stroke="#eef1f5" strokeWidth="6"/>
      </svg>
      <div className="wrap join-box reveal">
        <h2>
          {cfg.join_title_pre} <span className="blue">{cfg.join_title_highlight}</span>{cfg.join_title_post}
        </h2>
        <p>{cfg.join_description}</p>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <a href={cfg.join_instagram} className="btn btn-primary">Escríbenos por Instagram</a>
          <a href="#agenda" className="btn btn-ghost" style={{ borderColor: 'rgba(10,26,51,.2)', color: 'var(--navy)' }}>Ver agenda</a>
        </div>
      </div>
    </section>
  )
}
