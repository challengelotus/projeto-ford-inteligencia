
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Pesquisa from './pages/Pesquisa'
import Historico from './pages/Historico'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pesquisa />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}