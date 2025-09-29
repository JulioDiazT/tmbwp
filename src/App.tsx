// File: src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import VolunteeringPage from "./pages/VolunteeringPage";
import CycleStacks from "./pages/CycleStacks";
import { VolunteeringFormPage } from "./pages/VolunteeringFormPage";
import Footer from "./components/Footer";
import MemoriesPage from "./pages/Memories";
import CycleStackBookDetails from "./pages/CycleStackBookDetails";
import CycleStackContribute from "./pages/CycleStackContribute";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Cicloteca (usa minúsculas) */}
        <Route path="/cyclestacks" element={<CycleStacks />} />
        <Route path="/cyclestacks/:id" element={<CycleStackBookDetails />} />
        <Route path="/cyclestacks/contribute" element={<CycleStackContribute />} />

        {/* Otras páginas */}
        <Route path="/recuerdos" element={<MemoriesPage />} />
        <Route path="/voluntariado" element={<VolunteeringPage />} />
        <Route path="/voluntariado/formulario" element={<VolunteeringFormPage />} />
        <Route path="/blog" element={<div className="p-8">Blog…</div>} />

        {/* 404 opcional */}
        {/* <Route path="*" element={<div className="p-8">Página no encontrada</div>} /> */}
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
