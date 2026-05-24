import { useState, useEffect } from 'react'

const TEAM_STYLE = {
  masculino: {
    cls: 'team m',
    bg: (
      <div className="bg" style={{ background: '#11294f' }}>
        <img src="/logo_crlp.png" className="team-logo-bg" alt="" aria-hidden="true" />
      </div>
    ),
    emoji: '🏆',
  },
  femenino: {
    cls: 'team f',
    bg: (
      <div className="bg" style={{ background: '#143f94' }}>
        <img src="/logo_crlp.png" className="team-logo-bg" alt="" aria-hidden="true" />
      </div>
    ),
    emoji: '💪',
  },
}

function observe() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target) } }),
    { threshold: 0.12 }
  )
  document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
}

export default function Teams() {
  const [equipos, setEquipos] = useState([])

  useEffect(() => {
    fetch('/api/equipos')
      .then(r => r.json())
      .then(data => { setEquipos(data); setTimeout(observe, 50) })
      .catch(() => {})
  }, [])

  return (
    <section id="equipos">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="sec-tag kicker">La manada</span>
          <h2 className="sec-title display">Nuestros equipos</h2>
        </div>
        <div className="teams">
          {equipos.map(eq => {
            const style = TEAM_STYLE[eq.slug] || TEAM_STYLE.masculino
            return (
              <div key={eq.id} className={`${style.cls} reveal`}>
                {style.bg}
                <div className="ov"></div>
                <div className="inner">
                  <h3>{eq.name}</h3>
                  <div className="meta">
                    <span>📍 {eq.place}</span>
                    <span>🗓️ Entrenos <b>{eq.training}</b></span>
                    <span>{style.emoji} {eq.extra}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
