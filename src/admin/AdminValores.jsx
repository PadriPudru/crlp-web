import { useState, useEffect } from 'react'
import { useToast } from './useToast.jsx'

function ValorForm({ val, onSave }) {
  const [form, setForm] = useState(val)
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    setSaving(true)
    const res = await fetch(`/api/valores/${val.id}`, {
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
        <h3>{val.title}</h3>
      </div>
      <div className="adm-grid">
        <div className="adm-field full">
          <label className="adm-label">Título</label>
          <input className="adm-input" value={form.title} onChange={set('title')}/>
        </div>
        <div className="adm-field full">
          <label className="adm-label">Descripción</label>
          <textarea className="adm-textarea" value={form.description} onChange={set('description')}/>
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

export default function AdminValores() {
  const [valores, setValores] = useState([])
  const { toast, Toast } = useToast()

  useEffect(() => {
    fetch('/api/valores').then(r => r.json()).then(setValores)
  }, [])

  const handleSave = (saved) => {
    setValores(prev => prev.map(v => v.id === saved.id ? saved : v))
    toast('✓ Guardado')
  }

  return (
    <div>
      <h2 className="adm-section-title">Valores del club</h2>
      {valores.map(v => <ValorForm key={v.id} val={v} onSave={handleSave}/>)}
      {Toast}
    </div>
  )
}
