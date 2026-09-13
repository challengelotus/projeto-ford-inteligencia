import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CompararVeiculos from '../components/CompararVeiculos'
import { salvarNoHistorico } from '../utils/historico'

export default function Duelo() {
  const location = useLocation()
  const itemHistorico = location.state?.itemHistorico?.tipo === 'comparacao'
    ? location.state.itemHistorico
    : null

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <CompararVeiculos aoSalvar={salvarNoHistorico} itemHistorico={itemHistorico} />
      </div>
    </div>
  )
}