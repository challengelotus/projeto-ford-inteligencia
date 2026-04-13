import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { getMockSpecs } from '../data/mockData'
import { useAtributos } from '../context/AtributosContext'
import { useHistorico } from '../context/HistoricoContext'
import ResultadoIndividual from './ResultadoIndividual'

export default function PesquisaIndividual({ itemHistorico }) {
  const { t } = useTranslation()
  const { adicionarPesquisa } = useHistorico()
  const { atributosTecnicos, atributosSensacoes } = useAtributos()

  const [marca, setMarca] = useState(itemHistorico?.marca || '')
  const [modelo, setModelo] = useState(itemHistorico?.modelo || '')
  const [versao, setVersao] = useState(itemHistorico?.versao || '')
  const [selecionados, setSelecionados] = useState(
    itemHistorico ? Object.keys(itemHistorico.specs) :
    ['Motor', 'Torque', 'Câmbio', 'Tração', 'Freios', 'Rodas e Pneus', 'Faróis', 'Preço']
  )
  const [resultado, setResultado] = useState(itemHistorico || null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const todosAtributos = [...atributosTecnicos, ...atributosSensacoes]

  function toggle(atributo) {
    setSelecionados(prev =>
      prev.includes(atributo) ? prev.filter(a => a !== atributo) : [...prev, atributo]
    )
  }

  function selecionarGrupo(grupo) {
    const temTodos = grupo.every(a => selecionados.includes(a))
    if (temTodos) {
      setSelecionados(prev => prev.filter(a => !grupo.includes(a)))
    } else {
      setSelecionados(prev => [...new Set([...prev, ...grupo])])
    }
  }

  async function handleBuscar() {
    setErro('')

    const m = marca.trim()
    const mo = modelo.trim()
    const v = versao.trim()

    if (!m || !mo || !v) {
      setErro(t('pesquisa.erro_campos'))
      return
    }

    if (selecionados.length === 0) {
      setErro(t('pesquisa.erro_atributos'))
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))

    const specs = getMockSpecs(m, mo, v)
    const filtrado = Object.fromEntries(
      selecionados.map(a => [a, specs[a] || 'Não disponível'])
    )

    const pesquisa = { tipo: 'individual', marca: m, modelo: mo, versao: v, specs: filtrado }
    adicionarPesquisa(pesquisa)
    setResultado(pesquisa)
    setLoading(false)
  }

  if (resultado) {
    return <ResultadoIndividual resultado={resultado} onNovaPesquisa={() => setResultado(null)} />
  }

  function AtributoBtn({ atributo, ativo, cor }) {
    return (
      <button
        onClick={() => toggle(atributo)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition
          ${ativo
            ? cor === 'purple'
              ? 'border-purple-400 bg-purple-900/30 text-white'
              : 'border-[#4a9eff] bg-[#1a3a6e] text-white'
            : 'border-[#2a4070] bg-[#0f1f3d] text-slate-400 hover:border-slate-500'
          }`}
      >
        <span className={`w-4 h-4 rounded flex items-center justify-center text-xs
          ${ativo
            ? cor === 'purple' ? 'bg-purple-400' : 'bg-[#4a9eff]'
            : 'border border-[#2a4070]'
          }`}>
          {ativo && '✓'}
        </span>
        {atributo}
      </button>
    )
  }

  return (
    <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-2xl p-6">

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {[
          { label: t('pesquisa.marca'), value: marca, set: setMarca, ph: t('pesquisa.placeholder_marca') },
          { label: t('pesquisa.modelo'), value: modelo, set: setModelo, ph: t('pesquisa.placeholder_modelo') },
          { label: t('pesquisa.versao'), value: versao, set: setVersao, ph: t('pesquisa.placeholder_versao') },
        ].map(({ label, value, set, ph }) => (
          <div key={label} className="flex flex-col gap-2 flex-1">
            <label className="text-slate-400 text-sm">{label}</label>
            <input
              placeholder={ph}
              value={value}
              onChange={e => set(e.target.value)}
              className="bg-[#0f1f3d] border border-[#2a4070] rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-[#4a9eff] transition"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-slate-400 text-sm">Atributos</p>
        <div className="flex gap-2">
          <button
            onClick={() => setSelecionados(todosAtributos)}
            className="text-xs text-[#4a9eff] hover:text-white border border-[#2a4070] hover:border-[#4a9eff] px-3 py-1 rounded-lg transition"
          >
            Selecionar tudo
          </button>
          <button
            onClick={() => setSelecionados([])}
            className="text-xs text-slate-400 hover:text-white border border-[#2a4070] hover:border-slate-500 px-3 py-1 rounded-lg transition"
          >
            Limpar tudo
          </button>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4a9eff]" />
            <p className="text-white text-sm font-semibold">{t('pesquisa.especificacoes_tecnicas')}</p>
          </div>
          <button onClick={() => selecionarGrupo(atributosTecnicos)} className="text-xs text-slate-400 hover:text-[#4a9eff] transition">
            {atributosTecnicos.every(a => selecionados.includes(a)) ? 'Desmarcar grupo' : 'Selecionar grupo'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {atributosTecnicos.map(a => <AtributoBtn key={a} atributo={a} ativo={selecionados.includes(a)} cor="blue" />)}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <p className="text-white text-sm font-semibold">{t('pesquisa.experiencia')}</p>
            <span className="text-xs text-slate-500 ml-1">{t('pesquisa.experiencia_sub')}</span>
          </div>
          <button onClick={() => selecionarGrupo(atributosSensacoes)} className="text-xs text-slate-400 hover:text-purple-400 transition">
            {atributosSensacoes.every(a => selecionados.includes(a)) ? 'Desmarcar grupo' : 'Selecionar grupo'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {atributosSensacoes.map(a => <AtributoBtn key={a} atributo={a} ativo={selecionados.includes(a)} cor="purple" />)}
        </div>
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
        {loading ? t('pesquisa.buscando') : <><Search size={18} /> {t('pesquisa.btn_buscar')}</>}
      </button>
    </div>
  )
}