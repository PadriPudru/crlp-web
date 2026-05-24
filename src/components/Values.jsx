import { useState, useEffect } from 'react'

const ICONS = {
  companerismo: (
    <svg className="ico" viewBox="0 0 64 64" fill="none">
      <path d="M20 34c-6 0-10-4-10-10s4-9 9-9 8 4 8 9" stroke="#0a1a33" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M44 34c6 0 10-4 10-10s-4-9-9-9-8 4-8 9" stroke="#0a1a33" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M16 52V44c0-6 5-10 11-10h2c6 0 11 4 11 10v8" stroke="#0a1a33" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M40 52v-8c0-6 5-10 11-10" stroke="#0a1a33" strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
  ),
  energia: (
    <svg className="ico" viewBox="0 0 64 64" fill="none">
      <path d="M34 6 18 36h12l-4 22 22-34H34l4-18z" fill="#0a1a33"/>
    </svg>
  ),
  cantera: (
    <svg className="ico" viewBox="0 0 64 64" fill="none">
      <path d="M32 56V30" stroke="#0a1a33" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M32 34c-12 0-20-6-20-18 12 0 20 6 20 18z" fill="#0a1a33"/>
      <path d="M32 28c10 0 16-5 16-15-10 0-16 5-16 15z" fill="#0a1a33" opacity=".6"/>
    </svg>
  ),
}

function observe() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target) } }),
    { threshold: 0.12 }
  )
  document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
}

export default function Values() {
  const [valores, setValores] = useState([])

  useEffect(() => {
    fetch('/api/valores')
      .then(r => r.json())
      .then(data => { setValores(data); setTimeout(observe, 50) })
      .catch(() => {})
  }, [])

  return (
    <section id="valores">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="sec-tag kicker" style={{ color: 'var(--navy3)' }}>Nuestro ADN</span>
          <h2 className="sec-title display" style={{ color: 'var(--navy)' }}>Lo que nos une</h2>
        </div>
        <div className="values-grid">
          {valores.map(v => (
            <div key={v.id} className="val reveal">
              {ICONS[v.slug]}
              <h3>{v.title}</h3>
              <p>{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
