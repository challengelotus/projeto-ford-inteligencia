import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PesquisaIndividual from '../components/PesquisaIndividual'
import CompararVeiculos from '../components/CompararVeiculos'

export default function Pesquisa() {
  const location = useLocation()
  const itemHistorico = location.state?.itemHistorico || null

  const abaInicial = itemHistorico?.tipo === 'comparacao' ? 'comparar' : 'individual'
  const [aba, setAba] = useState(abaInicial)

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex justify-center mb-6">
          <div className="flex bg-[#1a2f5e] border border-[#2a4070] rounded-xl p-1">
            <button
              onClick={() => setAba('individual')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition
                ${aba === 'individual' ? 'bg-[#003478] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Pesquisa Individual
            </button>
            <button
              onClick={() => setAba('comparar')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition
                ${aba === 'comparar' ? 'bg-[#003478] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Comparar Veículos
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {aba === 'individual'
            ? <PesquisaIndividual itemHistorico={itemHistorico?.tipo === 'individual' ? itemHistorico : null} />
            : <CompararVeiculos itemHistorico={itemHistorico?.tipo === 'comparacao' ? itemHistorico : null} />
          }
        </div>

      </div>
    </div>
  )
}