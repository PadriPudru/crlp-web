import { useState, useEffect } from 'react'

const TEAM_STYLE = {
  masculino: {
    cls: 'team m',
    bg: (
      <svg className="bg" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice">
        <rect width="600" height="360" fill="#11294f"/>
        <g stroke="#1f5fd6" strokeOpacity=".4" strokeWidth="2" fill="none">
          <path d="M0 300 Q300 270 600 300"/>
          <path d="M0 230 Q300 205 600 230"/>
          <path d="M0 170 Q300 150 600 170"/>
        </g>
        <g transform="translate(420 70) rotate(20)">
          <ellipse rx="46" ry="74" fill="#1f5fd6" opacity=".5"/>
          <path d="M0 -64 L0 64" stroke="#0a1a33" strokeWidth="4"/>
        </g>
      </svg>
    ),
    emoji: '🏆',
  },
  femenino: {
    cls: 'team f',
    bg: (
      <svg className="bg" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice">
        <rect width="600" height="360" fill="#143f94"/>
        <g stroke="#ffd60a" strokeOpacity=".35" strokeWidth="2" fill="none">
          <path d="M0 300 Q300 270 600 300"/>
          <path d="M0 230 Q300 205 600 230"/>
          <path d="M0 170 Q300 150 600 170"/>
        </g>
        <g transform="translate(430 80) rotate(-18)">
          <ellipse rx="44" ry="70" fill="#ffd60a" opacity=".55"/>
          <path d="M0 -60 L0 60" stroke="#0a1a33" strokeWidth="4"/>
        </g>
      </svg>
    ),
    emoji: '💪',
  },
}

export default function Teams() {
  const [equipos, setEquipos] = useState([])

  useEffect(() => {
    fetch('/api/equipos').then(r => r.json()).then(setEquipos).catch(() => {})
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
