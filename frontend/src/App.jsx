import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { HistoricoProvider } from './context/HistoricoContext'
import Login from './pages/Login'
import Pesquisa from './pages/Pesquisa'
import Historico from './pages/Historico'

function RotaProtegida({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <RotaProtegida><Pesquisa /></RotaProtegida>
      } />
      <Route path="/historico" element={
        <RotaProtegida><Historico /></RotaProtegida>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <HistoricoProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </HistoricoProvider>
    </AuthProvider>
  )
}