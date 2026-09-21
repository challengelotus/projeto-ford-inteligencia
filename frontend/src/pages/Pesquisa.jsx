import { useLocation } from 'react-router-dom'
import PesquisaIndividual from '../components/PesquisaIndividual'
import { salvarNoHistorico } from '../utils/historico'

export default function Pesquisa() {
  const location = useLocation()
  const itemHistorico = location.state?.itemHistorico?.tipo === 'individual'
    ? location.state.itemHistorico
    : null

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 lg:py-16">
      <PesquisaIndividual aoSalvar={salvarNoHistorico} itemHistorico={itemHistorico} />
    </div>
  )
}