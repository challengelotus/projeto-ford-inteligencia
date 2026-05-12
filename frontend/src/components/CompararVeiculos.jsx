import { useState } from 'react'
import { GitCompare } from 'lucide-react'
import { ATRIBUTOS, buscarEspecificacoes } from '../data/mock'
import ResultadoComparacao from './ResultadoComparacao'

export default function CompararVeiculos({ aoSalvar, itemHistorico }) {
  const [v1, setV1] = useState({
    marca: itemHistorico?.veiculo1?.marca || '',
    modelo: itemHistorico?.veiculo1?.modelo || '',
    versao: itemHistorico?.veiculo1?.versao || '',
  })
  const [v2, setV2] = useState({
    marca: itemHistorico?.veiculo2?.marca || '',
    modelo: itemHistorico?.veiculo2?.modelo || '',
    versao: itemHistorico?.veiculo2?.versao || '',
  })
  const [selecionados, setSelecionados] = useState(
    itemHistorico ? itemHistorico.atributos : ATRIBUTOS
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

  function selecionarTodos() { setSelecionados(ATRIBUTOS) }
  function limparTodos() { setSelecionados([]) }

  async function handleComparar() {
    setErro('')

    const veiculo1 = { marca: v1.marca.trim(), modelo: v1.modelo.trim(), versao: v1.versao.trim() }
    const veiculo2 = { marca: v2.marca.trim(), modelo: v2.modelo.trim(), versao: v2.versao.trim() }

    if (!veiculo1.marca || !veiculo1.modelo || !veiculo1.versao) {
      setErro('Preencha todos os campos do Veículo 1.')
      return
    }

    if (!veiculo2.marca || !veiculo2.modelo || !veiculo2.versao) {
      setErro('Preencha todos os campos do Veículo 2.')
      return
    }

    if (
      veiculo1.marca.toLowerCase() === veiculo2.marca.toLowerCase() &&
      veiculo1.modelo.toLowerCase() === veiculo2.modelo.toLowerCase() &&
      veiculo1.versao.toLowerCase() === veiculo2.versao.toLowerCase()
    ) {
      setErro('Os dois veículos não podem ser iguais.')
      return
    }

    if (selecionados.length === 0) {
      setErro('Selecione pelo menos um atributo.')
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))

    const [specs1, specs2] = await Promise.all([
      buscarEspecificacoes(veiculo1.marca, veiculo1.modelo, veiculo1.versao, selecionados),
      buscarEspecificacoes(veiculo2.marca, veiculo2.modelo, veiculo2.versao, selecionados),
    ])

    const pesquisa = {
      tipo: 'comparacao',
      veiculo1: { ...veiculo1, specs: specs1 },
      veiculo2: { ...veiculo2, specs: specs2 },
      atributos: selecionados,
    }

    aoSalvar(pesquisa)
    setResultado(pesquisa)
    setLoading(false)
  }

  if (resultado) {
    return <ResultadoComparacao resultado={resultado} onNova={() => setResultado(null)} />
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[
          { label: 'Veículo 1', state: v1, setState: setV1 },
          { label: 'Veículo 2', state: v2, setState: setV2 },
        ].map(({ label, state, setState }) => (
          <div key={label} className="bg-[#1a2f5e] border border-[#2a4070] rounded-2xl p-5">
            <p className="text-white font-semibold mb-4">{label}</p>
            {[
              { field: 'marca', placeholder: 'ex: Ford' },
              { field: 'modelo', placeholder: 'ex: Ranger' },
              { field: 'versao', placeholder: 'ex: Raptor 2025' },
            ].map(({ field, placeholder }) => (
              <div key={field} className="flex flex-col gap-2 mb-3">
                <label className="text-slate-400 text-sm capitalize">
                  {field === 'versao' ? 'Versão' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  placeholder={placeholder}
                  value={state[field]}
                  onChange={e => setState(prev => ({ ...prev, [field]: e.target.value }))}
                  className="bg-[#0f1f3d] border border-[#2a4070] rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-[#4a9eff] transition"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-2xl p-5">
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

        <div className="flex flex-wrap gap-2 mb-5">
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
          onClick={handleComparar}
          disabled={loading}
          className="w-full bg-[#003478] hover:bg-[#004499] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          {loading ? 'Comparando...' : <><GitCompare size={18} /> Comparar</>}
        </button>
      </div>
    </div>
  )
}