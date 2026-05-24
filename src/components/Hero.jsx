import { useState, useEffect } from 'react'

const DEFAULTS = {
  hero_eyebrow: 'Club de Rugby Las Palmas · Desde 1987',
  hero_title1:  'Inspirar y unir',
  hero_title2:  'a través del rugby',
  hero_subtitle: 'Más que un club, una manada. Rugby de verdad en Gran Canaria: partidos, rugby playa, torneos y rugby en los colegios. Todo lo que viene, aquí.',
}

export default function Hero() {
  const [cfg, setCfg] = useState(DEFAULTS)

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(data => setCfg(c => ({ ...c, ...data }))).catch(() => {})
  }, [])

  return (
    <header>
      <svg className="hero-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#143f94"/>
            <stop offset="1" stopColor="#0a1a33"/>
          </linearGradient>
          <radialGradient id="spot" cx="72%" cy="30%" r="55%">
            <stop offset="0" stopColor="#1f5fd6" stopOpacity=".55"/>
            <stop offset="1" stopColor="#1f5fd6" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#sky)"/>
        <rect width="1440" height="900" fill="url(#spot)"/>
        <g stroke="#eef1f5" strokeOpacity=".07" strokeWidth="2" fill="none">
          <path d="M-200 900 L640 360"/><path d="M200 900 L760 360"/><path d="M600 900 L880 360"/>
          <path d="M1000 900 L1000 360"/><path d="M1400 900 L1120 360"/><path d="M1800 900 L1240 360"/>
          <path d="M0 760 Q720 700 1440 760"/><path d="M0 620 Q720 580 1440 620"/><path d="M0 500 Q720 470 1440 500"/>
        </g>
        <g stroke="#eef1f5" strokeOpacity=".18" strokeWidth="6" strokeLinecap="round">
          <path d="M880 200 L880 470"/><path d="M970 200 L970 470"/><path d="M870 300 L980 300"/>
        </g>
        <g transform="translate(1180 230) rotate(28)">
          <ellipse cx="0" cy="0" rx="62" ry="100" fill="#ffd60a"/>
          <path d="M0 -86 L0 86" stroke="#0a1a33" strokeWidth="6"/>
          <g stroke="#0a1a33" strokeWidth="5" strokeLinecap="round">
            <path d="M-20 -40 L20 -40"/><path d="M-22 -15 L22 -15"/><path d="M-22 15 L22 15"/><path d="M-20 40 L20 40"/>
          </g>
        </g>
        <g transform="translate(250 300)">
          <path d="M120 120 q30 -40 70 -30 q35 9 35 50 q0 30 -25 45 l40 70 q15 30 -10 48 q-26 16 -45 -12 l-46 -78 l-70 30 q-30 12 -42 -16 q-10 -28 22 -40 l84 -35 z" fill="#11294f" stroke="#1f5fd6" strokeWidth="3"/>
          <path d="M150 250 l-30 110 q-8 30 -38 26 q-26 -6 -18 -36 l34 -120 z" fill="#11294f" stroke="#1f5fd6" strokeWidth="3"/>
          <path d="M205 235 l60 70 q22 26 -4 46 q-26 18 -46 -8 l-58 -78 z" fill="#0e2347" stroke="#1f5fd6" strokeWidth="3"/>
          <path d="M150 150 l-70 -10 q-30 -4 -28 -34 q3 -28 34 -22 l84 16 z" fill="#0e2347" stroke="#1f5fd6" strokeWidth="3"/>
          <circle cx="205" cy="95" r="30" fill="#11294f" stroke="#1f5fd6" strokeWidth="3"/>
          <g transform="translate(40 120) rotate(-25)">
            <ellipse cx="0" cy="0" rx="26" ry="42" fill="#ffd60a" stroke="#0a1a33" strokeWidth="3"/>
            <path d="M0 -34 L0 34" stroke="#0a1a33" strokeWidth="3"/>
          </g>
        </g>
      </svg>
      <div className="hero-overlay"></div>
      <div className="wrap hero-content">
        <span className="hero-eyebrow kicker reveal">
          <span className="ln"></span> {cfg.hero_eyebrow}
        </span>
        <h1 className="hero-title display reveal">
          {cfg.hero_title1}<br/>
          <span className="yellow">{cfg.hero_title2}</span>
        </h1>
        <p className="hero-sub reveal">{cfg.hero_subtitle}</p>
        <div className="hero-actions reveal">
          <a href="#join" className="btn btn-primary">Únete al club →</a>
          <a href="#agenda" className="btn btn-ghost">Ver agenda</a>
        </div>
      </div>
      <div className="slice bottom"></div>
    </header>
  )
}
