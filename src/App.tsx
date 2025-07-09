import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import EventsPreview from './components/EventsPreview'


export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventos" element={<EventsPreview />} />
        <Route path="/proyectos" element={<div className="p-8">Proyectos…</div>} />
        <Route path="/blog" element={<div className="p-8">Blog…</div>} />
      </Routes>
    </BrowserRouter>
  )
}
