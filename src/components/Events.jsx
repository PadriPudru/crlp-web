import { useState, useEffect } from 'react'

const LABEL = { partido: 'Partido', playa: 'Rugby Playa', social: 'Evento' }

const ICON = {
  partido: (
    <svg className="ev-icon" viewBox="0 0 64 64">
      <ellipse cx="32" cy="32" rx="16" ry="26" transform="rotate(45 32 32)" fill="#1f5fd6"/>
      <path d="M20 32 L44 32" stroke="#fff" strokeWidth="3"/>
      <path d="M26 26 L38 38 M27 32 L37 32 M32 27 L32 37" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  ),
  playa: (
    <svg className="ev-icon" viewBox="0 0 64 64">
      <path d="M6 46 Q20 38 32 46 T58 46 V58 H6 Z" fill="#0fa3a3"/>
      <circle cx="46" cy="20" r="9" fill="#ffd60a"/>
      <path d="M12 40 q8 -22 30 -14" stroke="#0a1a33" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  social: (
    <svg className="ev-icon" viewBox="0 0 64 64">
      <path d="M32 12 L56 24 L32 36 L8 24 Z" fill="#ffd60a" stroke="#0a1a33" strokeWidth="2"/>
      <path d="M20 30 V42 q12 8 24 0 V30" fill="none" stroke="#0a1a33" strokeWidth="3"/>
      <path d="M56 24 V40" stroke="#0a1a33" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
}

const FILTERS = [
  { key: 'all',     label: 'Todo' },
  { key: 'partido', label: 'Partidos' },
  { key: 'playa',   label: 'Rugby Playa' },
  { key: 'social',  label: 'Colegios y eventos' },
]

function EventCard({ ev, index }) {
  return (
    <div className="ev reveal" data-type={ev.type} style={{ transitionDelay: `${index * 0.05}s` }}>
      <div className="ev-date">
        <div className="d">{ev.day}</div>
        <div className="m">{ev.month}</div>
      </div>
      {ICON[ev.type]}
      <div className="ev-main">
        <span className={`badge ${ev.type}`}>{LABEL[ev.type]}</span>
        <h3>{ev.title}</h3>
        <p>
          <span>📍 {ev.place}</span>
          <span>· {ev.note}</span>
        </p>
      </div>
      <div className="ev-time">{ev.time}</div>
    </div>
  )
}

export default function Events() {
  const [eventos, setEventos] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    fetch('/api/eventos').then(r => r.json()).then(setEventos).catch(() => {})
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target) } }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [activeFilter, eventos])

  const filtered = activeFilter === 'all' ? eventos : eventos.filter(e => e.type === activeFilter)

  return (
    <section id="agenda">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="sec-tag kicker" style={{ color: 'var(--blue)' }}>Lo que viene</span>
          <h2 className="sec-title display">Próximos eventos</h2>
        </div>
        <div className="filters reveal">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`chip${activeFilter === f.key ? ' active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="events">
          {filtered.map((ev, i) => (
            <EventCard key={ev.id} ev={ev} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
