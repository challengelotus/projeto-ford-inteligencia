import { useState } from 'react'
import { Search } from 'lucide-react'
import { ATRIBUTOS, buscarEspecificacoes } from '../data/mock'
import ResultadoIndividual from './ResultadoIndividual'

export default function PesquisaIndividual({ aoSalvar, itemHistorico }) {
  const [marca, setMarca] = useState(itemHistorico?.marca || '')
  const [modelo, setModelo] = useState(itemHistorico?.modelo || '')
  const [versao, setVersao] = useState(itemHistorico?.versao || '')
  const [selecionados, setSelecionados] = useState(
    itemHistorico ? Object.keys(itemHistorico.specs) : ATRIBUTOS
  )
  const [resultado, setResultado] = useState(itemHistorico || null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  function toggle(atributo) {
    setSelecionados(prev =>
      prev.includes(atributo)
        ? prev.filter(a => a !== atributo)
        : [...prev, atributo]
    )
  }

  function selecionarTodos() {
    setSelecionados(ATRIBUTOS)
  }

  function limparTodos() {
    setSelecionados([])
  }

  async function handleBuscar() {
    setErro('')

    const m = marca.trim()
    const mo = modelo.trim()
    const v = versao.trim()

    if (!m || !mo || !v) {
      setErro('Preencha todos os campos antes de buscar.')
      return
    }

    if (selecionados.length === 0) {
      setErro('Selecione pelo menos um atributo.')
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))

    const specs = await buscarEspecificacoes(m, mo, v, selecionados)
    const pesquisa = { tipo: 'individual', marca: m, modelo: mo, versao: v, specs }

    aoSalvar(pesquisa)
    setResultado(pesquisa)
    setLoading(false)
  }

  if (resultado) {
    return <ResultadoIndividual resultado={resultado} onNova={() => setResultado(null)} />
  }

  return (
    <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-2xl p-6">

      <div className="flex flex-col md:flex-row gap-4 mb-6">
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

      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-400 text-sm">Atributos</p>
        <div className="flex gap-2">
          <button onClick={selecionarTodos} className="text-xs text-[#4a9eff] hover:text-white border border-[#2a4070] hover:border-[#4a9eff] px-3 py-1 rounded-lg transition">
            Selecionar tudo
          </button>
          <button onClick={limparTodos} className="text-xs text-slate-400 hover:text-white border border-[#2a4070] hover:border-slate-500 px-3 py-1 rounded-lg transition">
            Limpar tudo
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {ATRIBUTOS.map(atributo => {
          const ativo = selecionados.includes(atributo)
          return (
            <button
              key={atributo}
              onClick={() => toggle(atributo)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition
                ${ativo
                  ? 'border-[#4a9eff] bg-[#1a3a6e] text-white'
                  : 'border-[#2a4070] bg-[#0f1f3d] text-slate-400 hover:border-slate-500'
                }`}
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center text-xs
                ${ativo ? 'bg-[#4a9eff]' : 'border border-[#2a4070]'}`}>
                {ativo && '✓'}
              </span>
              {atributo}
            </button>
          )
        })}
      </div>

      {erro && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
          <span className="text-red-400">⚠</span>
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