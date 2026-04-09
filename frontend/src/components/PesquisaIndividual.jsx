import { useState } from 'react'
import { Search } from 'lucide-react'
import { ATRIBUTOS, getMockSpecs } from '../data/mockData'
import { useHistorico } from '../context/HistoricoContext'
import ResultadoIndividual from './ResultadoIndividual'

export default function PesquisaIndividual({ itemHistorico }) {
  const { adicionarPesquisa } = useHistorico()
  const [marca, setMarca] = useState(itemHistorico?.marca || '')
  const [modelo, setModelo] = useState(itemHistorico?.modelo || '')
  const [versao, setVersao] = useState(itemHistorico?.versao || '')
  const [atributosSelecionados, setAtributosSelecionados] = useState(
    itemHistorico ? Object.keys(itemHistorico.specs) :
    ['Motor', 'Torque', 'Câmbio', 'Tração', 'Freios', 'Rodas e Pneus', 'Faróis', 'Preço']
  )
  const [resultado, setResultado] = useState(itemHistorico || null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  function toggleAtributo(atributo) {
    setAtributosSelecionados(prev =>
      prev.includes(atributo)
        ? prev.filter(a => a !== atributo)
        : [...prev, atributo]
    )
  }

  async function handleBuscar() {
    setErro('')

    if (!marca || !modelo || !versao) {
      setErro('Preencha todos os campos antes de buscar.')
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const specs = getMockSpecs(marca, modelo, versao)
    const filtrado = {}
    atributosSelecionados.forEach(a => {
      filtrado[a] = specs[a] || 'Não disponível'
    })
    const pesquisa = { tipo: 'individual', marca, modelo, versao, specs: filtrado }
    adicionarPesquisa(pesquisa)
    setResultado(pesquisa)
    setLoading(false)
  }

  if (resultado) {
    return <ResultadoIndividual resultado={resultado} onNovaPesquisa={() => setResultado(null)} />
  }

  return (
    <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-2xl p-6">
      <div className="flex gap-4 mb-6">
        {[
          { label: 'Marca', value: marca, set: setMarca, placeholder: 'ex: Toyota' },
          { label: 'Modelo', value: modelo, set: setModelo, placeholder: 'ex: Hilux' },
          { label: 'Versão', value: versao, set: setVersao, placeholder: 'ex: SR 2025' },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label} className="flex flex-col gap-2 flex-1">
            <label className="text-slate-400 text-sm">{label}</label>
            <input
              placeholder={placeholder}
              value={value}
              onChange={e => set(e.target.value)}
              className="bg-[#0f1f3d] border border-[#2a4070] rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-[#4a9eff] transition"
            />
          </div>
        ))}
      </div>

      <p className="text-slate-400 text-sm mb-3">Atributos Técnicos</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {ATRIBUTOS.map(atributo => {
          const selecionado = atributosSelecionados.includes(atributo)
          return (
            <button
              key={atributo}
              onClick={() => toggleAtributo(atributo)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition
                ${selecionado
                  ? 'border-[#4a9eff] bg-[#1a3a6e] text-white'
                  : 'border-[#2a4070] bg-[#0f1f3d] text-slate-400 hover:border-slate-500'
                }`}
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center text-xs
                ${selecionado ? 'bg-[#4a9eff]' : 'border border-[#2a4070]'}`}>
                {selecionado && '✓'}
              </span>
              {atributo}
            </button>
          )
        })}
      </div>

      {erro && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
          <span className="text-red-400 text-lg">⚠</span>
          <p className="text-red-400 text-sm">{erro}</p>
        </div>
)}

      <button
        onClick={handleBuscar}
        disabled={loading}
        className="w-full bg-[#003478] hover:bg-[#004499] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60"
      >
        {loading ? 'Buscando...' : <><Search size={18} /> Buscar Especificações</>}
      </button>
    </div>
  )
}