import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import './admin.css'
import AdminEventos from './AdminEventos'
import AdminEquipos from './AdminEquipos'
import AdminValores from './AdminValores'
import AdminTextos  from './AdminTextos'

const TABS = [
  { to: 'eventos', label: 'Agenda'  },
  { to: 'equipos', label: 'Equipos' },
  { to: 'valores', label: 'Valores' },
  { to: 'textos',  label: 'Textos'  },
]

export default function Admin() {
  return (
    <div className="adm">
      <nav className="adm-nav">
        <a className="brand" href="/">← CRLP</a>
        <div className="adm-tabs">
          {TABS.map(t => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) => `adm-tab${isActive ? ' active' : ''}`}
            >
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="adm-body">
        <Routes>
          <Route index element={<Navigate to="eventos" replace/>}/>
          <Route path="eventos" element={<AdminEventos/>}/>
          <Route path="equipos" element={<AdminEquipos/>}/>
          <Route path="valores" element={<AdminValores/>}/>
          <Route path="textos"  element={<AdminTextos/>}/>
        </Routes>
      </div>
    </div>
  )
}
