import { useState } from 'react'
import { Search } from 'lucide-react'
import { ATRIBUTOS_TECNICOS, ATRIBUTOS_SENSACOES, getMockSpecs } from '../data/mockData'
import { useHistorico } from '../context/HistoricoContext'
import { useTranslation } from 'react-i18next'
import ResultadoIndividual from './ResultadoIndividual'

export default function PesquisaIndividual({ itemHistorico }) {
  const { adicionarPesquisa } = useHistorico()
  const { t } = useTranslation()
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
      setErro(t('pesquisa.erro_campos'))
      return
    }

    if (atributosSelecionados.length === 0) {
      setErro(t('pesquisa.erro_atributos'))
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

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {[
          { label: t('pesquisa.marca'), value: marca, set: setMarca, placeholder: t('pesquisa.placeholder_marca') },
          { label: t('pesquisa.modelo'), value: modelo, set: setModelo, placeholder: t('pesquisa.placeholder_modelo') },
          { label: t('pesquisa.versao'), value: versao, set: setVersao, placeholder: t('pesquisa.placeholder_versao') },
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

      {/* Técnicos */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#4a9eff]"></span>
          <p className="text-white text-sm font-semibold">{t('pesquisa.especificacoes_tecnicas')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ATRIBUTOS_TECNICOS.map(atributo => {
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
      </div>

      {/* Sensações */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <p className="text-white text-sm font-semibold">{t('pesquisa.experiencia')}</p>
          <span className="text-xs text-slate-500 ml-1">{t('pesquisa.experiencia_sub')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ATRIBUTOS_SENSACOES.map(atributo => {
            const selecionado = atributosSelecionados.includes(atributo)
            return (
              <button
                key={atributo}
                onClick={() => toggleAtributo(atributo)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition
                  ${selecionado
                    ? 'border-purple-400 bg-purple-900/30 text-white'
                    : 'border-[#2a4070] bg-[#0f1f3d] text-slate-400 hover:border-slate-500'
                  }`}
              >
                <span className={`w-4 h-4 rounded flex items-center justify-center text-xs
                  ${selecionado ? 'bg-purple-400' : 'border border-[#2a4070]'}`}>
                  {selecionado && '✓'}
                </span>
                {atributo}
              </button>
            )
          })}
        </div>
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
        {loading ? t('pesquisa.buscando') : <><Search size={18} /> {t('pesquisa.btn_buscar')}</>}
      </button>
    </div>
  )
}