import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useReveal } from './hooks/useReveal'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Events from './components/Events'
import Values from './components/Values'
import Teams from './components/Teams'
import JoinSection from './components/JoinSection'
import Footer from './components/Footer'
import Admin from './admin/Admin'

function Site() {
  useReveal([])
  return (
    <>
      <Nav />
      <Hero />
      <Events />
      <Values />
      <Teams />
      <JoinSection />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*"     element={<Site />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
