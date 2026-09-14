import { useLocation } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import CompararVeiculos from '../components/CompararVeiculos'
import { salvarNoHistorico } from '../utils/historico'

export default function Duelo() {
  const location = useLocation()
  const itemHistorico = location.state?.itemHistorico?.tipo === 'comparacao'
    ? location.state.itemHistorico
    : null

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-10 lg:py-16">
        <CompararVeiculos aoSalvar={salvarNoHistorico} itemHistorico={itemHistorico} />
      </div>
    </AppLayout>
  )
}