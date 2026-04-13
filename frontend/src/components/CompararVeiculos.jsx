import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GitCompare } from 'lucide-react'
import { getMockSpecs } from '../data/mockData'
import { useAtributos } from '../context/AtributosContext'
import { useHistorico } from '../context/HistoricoContext'
import ResultadoComparacao from './ResultadoComparacao'

export default function CompararVeiculos({ itemHistorico }) {
  const { t } = useTranslation()
  const { adicionarPesquisa } = useHistorico()
  const { atributosTecnicos, atributosSensacoes } = useAtributos()

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
    itemHistorico?.atributos ||
    ['Motor', 'Potência', 'Câmbio', 'Tração', 'Suspensão', 'Rodas e Pneus', 'Faróis', 'Modos de condução']
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

  async function handleComparar() {
    setErro('')

    const veiculo1 = { marca: v1.marca.trim(), modelo: v1.modelo.trim(), versao: v1.versao.trim() }
    const veiculo2 = { marca: v2.marca.trim(), modelo: v2.modelo.trim(), versao: v2.versao.trim() }

    if (!veiculo1.marca || !veiculo1.modelo || !veiculo1.versao) {
      setErro(t('pesquisa.erro_veiculo1'))
      return
    }

    if (!veiculo2.marca || !veiculo2.modelo || !veiculo2.versao) {
      setErro(t('pesquisa.erro_veiculo2'))
      return
    }

    const mesmoCarro =
      veiculo1.marca.toLowerCase() === veiculo2.marca.toLowerCase() &&
      veiculo1.modelo.toLowerCase() === veiculo2.modelo.toLowerCase() &&
      veiculo1.versao.toLowerCase() === veiculo2.versao.toLowerCase()

    if (mesmoCarro) {
      setErro(t('pesquisa.erro_iguais'))
      return
    }

    if (selecionados.length === 0) {
      setErro(t('pesquisa.erro_atributos'))
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))

    const raw1 = getMockSpecs(veiculo1.marca, veiculo1.modelo, veiculo1.versao)
    const raw2 = getMockSpecs(veiculo2.marca, veiculo2.modelo, veiculo2.versao)

    const specs1 = Object.fromEntries(selecionados.map(a => [a, raw1[a] || 'Não disponível']))
    const specs2 = Object.fromEntries(selecionados.map(a => [a, raw2[a] || 'Não disponível']))

    const pesquisa = {
      tipo: 'comparacao',
      veiculo1: { ...veiculo1, specs: specs1 },
      veiculo2: { ...veiculo2, specs: specs2 },
      atributos: selecionados,
    }

    adicionarPesquisa(pesquisa)
    setResultado(pesquisa)
    setLoading(false)
  }

  if (resultado) {
    return <ResultadoComparacao resultado={resultado} onNovaComparacao={() => setResultado(null)} />
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

  function CampoVeiculo({ label, state, setState }) {
    return (
      <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-2xl p-5">
        <p className="text-white font-semibold mb-4">{label}</p>
        {[
          { field: 'marca', label: t('pesquisa.marca'), ph: t('pesquisa.placeholder_marca') },
          { field: 'modelo', label: t('pesquisa.modelo'), ph: t('pesquisa.placeholder_modelo') },
          { field: 'versao', label: t('pesquisa.versao'), ph: t('pesquisa.placeholder_versao') },
        ].map(({ field, label, ph }) => (
          <div key={field} className="flex flex-col gap-2 mb-3">
            <label className="text-slate-400 text-sm">{label}</label>
            <input
              placeholder={ph}
              value={state[field]}
              onChange={e => setState(prev => ({ ...prev, [field]: e.target.value }))}
              className="bg-[#0f1f3d] border border-[#2a4070] rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-[#4a9eff] transition"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <CampoVeiculo label={t('pesquisa.veiculo1')} state={v1} setState={setV1} />
        <CampoVeiculo label={t('pesquisa.veiculo2')} state={v2} setState={setV2} />
      </div>

      <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-2xl p-5">

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

        <div className="mb-5">
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
          onClick={handleComparar}
          disabled={loading}
          className="w-full bg-[#003478] hover:bg-[#004499] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          {loading ? t('pesquisa.comparando') : <><GitCompare size={18} /> {t('pesquisa.btn_comparar')}</>}
        </button>
      </div>
    </div>
  )
}