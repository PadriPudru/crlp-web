import { useState, useEffect } from 'react'
import { useToast } from './useToast.jsx'

function EquipoForm({ eq, onSave }) {
  const [form, setForm] = useState(eq)
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    setSaving(true)
    const res = await fetch(`/api/equipos/${eq.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    onSave(await res.json())
    setSaving(false)
  }

  return (
    <div className="adm-card">
      <div className="adm-card-header">
        <h3>{eq.name}</h3>
      </div>
      <div className="adm-grid">
        <div className="adm-field full">
          <label className="adm-label">Nombre del equipo</label>
          <input className="adm-input" value={form.name} onChange={set('name')}/>
        </div>
        <div className="adm-field">
          <label className="adm-label">Campo / Lugar</label>
          <input className="adm-input" value={form.place} onChange={set('place')}/>
        </div>
        <div className="adm-field">
          <label className="adm-label">Horario de entrenos</label>
          <input className="adm-input" value={form.training} onChange={set('training')} placeholder="mar y jue · 21:00"/>
        </div>
        <div className="adm-field full">
          <label className="adm-label">Descripción / liga</label>
          <input className="adm-input" value={form.extra} onChange={set('extra')} placeholder="Liga Territorial de Canarias"/>
        </div>
      </div>
      <div className="adm-actions">
        <button className="btn-save" onClick={save} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}

export default function AdminEquipos() {
  const [equipos, setEquipos] = useState([])
  const { toast, Toast } = useToast()

  useEffect(() => {
    fetch('/api/equipos').then(r => r.json()).then(setEquipos)
  }, [])

  const handleSave = (saved) => {
    setEquipos(prev => prev.map(e => e.id === saved.id ? saved : e))
    toast('✓ Guardado')
  }

  return (
    <div>
      <h2 className="adm-section-title">Equipos</h2>
      {equipos.map(eq => <EquipoForm key={eq.id} eq={eq} onSave={handleSave}/>)}
      {Toast}
    </div>
  )
}
