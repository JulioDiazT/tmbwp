// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import EventsPreview from './components/EventsPreview'
import VolunteeringPage from './pages/VolunteeringPage'
import {VolunteeringFormPage} from './pages/VolunteeringFormPage'
import Footer from './components/Footer'
import MemoriesPage from './pages/Memories'

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventos" element={<EventsPreview />} />
 <Route path="/recuerdos" element={<MemoriesPage/>} />
         <Route path="/voluntariado" element={<VolunteeringPage />} />
        <Route path="/voluntariado/formulario" element={<VolunteeringFormPage />} />
        <Route path="/blog" element={<div className="p-8">Blog…</div>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
