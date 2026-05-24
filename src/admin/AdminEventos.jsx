import { useState, useEffect } from 'react'
import { useToast } from './useToast.jsx'

const EMPTY = { type: 'partido', day: '', month: '', title: '', place: '', note: '', time: '' }
const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const TYPES = [
  { value: 'partido', label: 'Partido' },
  { value: 'playa',   label: 'Rugby Playa' },
  { value: 'social',  label: 'Evento / Colegio' },
]

function EventoForm({ ev, onSave, onDelete, isNew }) {
  const [form, setForm] = useState(ev)
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    setSaving(true)
    const url = isNew ? '/api/eventos' : `/api/eventos/${ev.id}`
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const saved = await res.json()
    onSave(saved, isNew)
    setSaving(false)
  }

  return (
    <div className="adm-card">
      <div className="adm-card-header">
        <h3>{isNew ? '+ Nuevo evento' : form.title || 'Evento'}</h3>
        <span className={`adm-badge ${form.type}`}>{TYPES.find(t => t.value === form.type)?.label}</span>
      </div>
      <div className="adm-grid">
        <div className="adm-field full">
          <label className="adm-label">Tipo</label>
          <select className="adm-select" value={form.type} onChange={set('type')}>
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="adm-field full">
          <label className="adm-label">Título del evento</label>
          <input className="adm-input" value={form.title} onChange={set('title')} placeholder="CRLP vs Rival"/>
        </div>
        <div className="adm-field">
          <label className="adm-label">Día</label>
          <input className="adm-input" value={form.day} onChange={set('day')} placeholder="31" maxLength={2}/>
        </div>
        <div className="adm-field">
          <label className="adm-label">Mes</label>
          <select className="adm-select" value={form.month} onChange={set('month')}>
            <option value="">— mes —</option>
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="adm-field">
          <label className="adm-label">Hora</label>
          <input className="adm-input" value={form.time} onChange={set('time')} placeholder="12:00"/>
        </div>
        <div className="adm-field">
          <label className="adm-label">Lugar</label>
          <input className="adm-input" value={form.place} onChange={set('place')} placeholder="Campo de las Rehoyas"/>
        </div>
        <div className="adm-field full">
          <label className="adm-label">Nota / descripción corta</label>
          <input className="adm-input" value={form.note} onChange={set('note')} placeholder="Jornada de Liga"/>
        </div>
      </div>
      <div className="adm-actions">
        {!isNew && onDelete && (
          <button className="btn-del" onClick={() => onDelete(ev.id)}>Eliminar</button>
        )}
        <button className="btn-save" onClick={save} disabled={saving}>
          {saving ? 'Guardando…' : isNew ? 'Añadir evento' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}

export default function AdminEventos() {
  const [eventos, setEventos] = useState([])
  const [showNew, setShowNew] = useState(false)
  const { toast, Toast } = useToast()

  useEffect(() => {
    fetch('/api/eventos').then(r => r.json()).then(setEventos)
  }, [])

  const handleSave = (saved, isNew) => {
    if (isNew) {
      setEventos(prev => [...prev, saved])
      setShowNew(false)
    } else {
      setEventos(prev => prev.map(e => e.id === saved.id ? saved : e))
    }
    toast('✓ Guardado')
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este evento?')) return
    await fetch(`/api/eventos/${id}`, { method: 'DELETE' })
    setEventos(prev => prev.filter(e => e.id !== id))
    toast('Evento eliminado')
  }

  return (
    <div>
      <h2 className="adm-section-title">Agenda · Próximos eventos</h2>
      {eventos.map(ev => (
        <EventoForm key={ev.id} ev={ev} onSave={handleSave} onDelete={handleDelete} isNew={false}/>
      ))}
      {showNew
        ? <EventoForm ev={EMPTY} onSave={handleSave} isNew={true}/>
        : <button className="btn-add" onClick={() => setShowNew(true)}>+ Añadir nuevo evento</button>
      }
      {Toast}
    </div>
  )
}
