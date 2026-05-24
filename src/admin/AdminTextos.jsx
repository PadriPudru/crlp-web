import { useState, useEffect } from 'react'
import { useToast } from './useToast.jsx'

const FIELDS = [
  { key: 'hero_eyebrow',         label: 'Hero · Texto pequeño encima del título',  type: 'input'    },
  { key: 'hero_title1',          label: 'Hero · Línea 1 del título (blanca)',       type: 'input'    },
  { key: 'hero_title2',          label: 'Hero · Línea 2 del título (amarilla)',     type: 'input'    },
  { key: 'hero_subtitle',        label: 'Hero · Subtítulo / descripción',           type: 'textarea' },
  { key: 'join_title_pre',       label: 'Únete · Texto antes de la palabra clave',  type: 'input'    },
  { key: 'join_title_highlight', label: 'Únete · Palabra clave (en azul)',          type: 'input'    },
  { key: 'join_title_post',      label: 'Únete · Texto después de la palabra clave',type: 'input'    },
  { key: 'join_description',     label: 'Únete · Párrafo descriptivo',              type: 'textarea' },
  { key: 'join_instagram',       label: 'Únete · Enlace Instagram',                 type: 'input'    },
]

export default function AdminTextos() {
  const [cfg, setCfg] = useState({})
  const [saving, setSaving] = useState(false)
  const { toast, Toast } = useToast()

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(setCfg)
  }, [])

  const set = (k) => (e) => setCfg(c => ({ ...c, [k]: e.target.value }))

  const save = async () => {
    setSaving(true)
    await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg),
    })
    toast('✓ Guardado')
    setSaving(false)
  }

  const heroPreview = cfg.hero_title1 && (
    <div style={{ background: '#143f94', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
      <p style={{ fontSize: 12, opacity: .6, fontFamily: 'Saira Condensed', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
        {cfg.hero_eyebrow}
      </p>
      <p style={{ fontFamily: 'Saira Condensed', fontWeight: 900, fontSize: 32, textTransform: 'uppercase', lineHeight: .92, marginBottom: 12 }}>
        {cfg.hero_title1}<br/><span style={{ color: '#ffd60a' }}>{cfg.hero_title2}</span>
      </p>
      <p style={{ fontSize: 14, opacity: .8, lineHeight: 1.5 }}>{cfg.hero_subtitle}</p>
    </div>
  )

  const joinPreview = cfg.join_title_pre && (
    <div style={{ background: '#eef1f5', borderRadius: 8, padding: '20px 24px', marginBottom: 16, color: '#0a1a33' }}>
      <p style={{ fontFamily: 'Saira Condensed', fontWeight: 900, fontSize: 28, textTransform: 'uppercase', lineHeight: .92, marginBottom: 12 }}>
        {cfg.join_title_pre} <span style={{ color: '#1f5fd6' }}>{cfg.join_title_highlight}</span>{cfg.join_title_post}
      </p>
      <p style={{ fontSize: 14, lineHeight: 1.5, color: '#4a5a6b' }}>{cfg.join_description}</p>
    </div>
  )

  return (
    <div>
      <h2 className="adm-section-title">Textos generales</h2>

      <div className="adm-card">
        <div className="adm-card-header"><h3>Previsualización · Hero</h3></div>
        {heroPreview}
      </div>

      <div className="adm-card">
        <div className="adm-card-header"><h3>Previsualización · Únete</h3></div>
        {joinPreview}
      </div>

      <div className="adm-card">
        <div className="adm-grid">
          {FIELDS.map(f => (
            <div key={f.key} className="adm-field full">
              <label className="adm-label">{f.label}</label>
              {f.type === 'textarea'
                ? <textarea className="adm-textarea" value={cfg[f.key] || ''} onChange={set(f.key)}/>
                : <input className="adm-input" value={cfg[f.key] || ''} onChange={set(f.key)}/>
              }
            </div>
          ))}
        </div>
        <div className="adm-actions">
          <button className="btn-save" onClick={save} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar todos los textos'}
          </button>
        </div>
      </div>
      {Toast}
    </div>
  )
}
