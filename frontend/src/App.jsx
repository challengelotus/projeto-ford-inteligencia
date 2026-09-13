import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { HistoricoProvider } from './context/HistoricoContext'
import { AtributosProvider } from './context/AtributosContext'
import Login from './pages/Login'
import Pesquisa from './pages/Pesquisa'
import Duelo from './pages/Duelo'
import Historico from './pages/Historico'

function RotaProtegida({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return children
}

function Rotas() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RotaProtegida><Pesquisa /></RotaProtegida>} />
      <Route path="/duelo" element={<RotaProtegida><Duelo /></RotaProtegida>} />
      <Route path="/historico" element={<RotaProtegida><Historico /></RotaProtegida>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HistoricoProvider>
          <AtributosProvider>
            <Rotas />
          </AtributosProvider>
        </HistoricoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}