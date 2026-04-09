import { useState } from 'react'
import { GitCompare } from 'lucide-react'
import { ATRIBUTOS_TECNICOS, ATRIBUTOS_SENSACOES, getMockSpecs } from '../data/mockData'
import { useHistorico } from '../context/HistoricoContext'
import { useTranslation } from 'react-i18next'
import ResultadoComparacao from './ResultadoComparacao'

export default function CompararVeiculos({ itemHistorico }) {
  const { adicionarPesquisa } = useHistorico()
  const { t } = useTranslation()
  const [veiculo1, setVeiculo1] = useState({
    marca: itemHistorico?.veiculo1?.marca || '',
    modelo: itemHistorico?.veiculo1?.modelo || '',
    versao: itemHistorico?.veiculo1?.versao || '',
  })
  const [veiculo2, setVeiculo2] = useState({
    marca: itemHistorico?.veiculo2?.marca || '',
    modelo: itemHistorico?.veiculo2?.modelo || '',
    versao: itemHistorico?.veiculo2?.versao || '',
  })
  const [atributosSelecionados, setAtributosSelecionados] = useState(
    itemHistorico ? itemHistorico.atributos :
    ['Motor', 'Potência', 'Câmbio', 'Tração', 'Suspensão', 'Rodas e Pneus', 'Faróis', 'Modos de condução']
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

  async function handleComparar() {
    setErro('')

    if (!veiculo1.marca || !veiculo1.modelo || !veiculo1.versao) {
      setErro(t('pesquisa.erro_veiculo1'))
      return
    }

    if (!veiculo2.marca || !veiculo2.modelo || !veiculo2.versao) {
      setErro(t('pesquisa.erro_veiculo2'))
      return
    }

    if (
      veiculo1.marca.trim().toLowerCase() === veiculo2.marca.trim().toLowerCase() &&
      veiculo1.modelo.trim().toLowerCase() === veiculo2.modelo.trim().toLowerCase() &&
      veiculo1.versao.trim().toLowerCase() === veiculo2.versao.trim().toLowerCase()
    ) {
      setErro(t('pesquisa.erro_iguais'))
      return
    }

    if (atributosSelecionados.length === 0) {
      setErro(t('pesquisa.erro_atributos'))
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))

    const specs1 = getMockSpecs(veiculo1.marca, veiculo1.modelo, veiculo1.versao)
    const specs2 = getMockSpecs(veiculo2.marca, veiculo2.modelo, veiculo2.versao)
    const filtrado1 = {}
    const filtrado2 = {}
    atributosSelecionados.forEach(a => {
      filtrado1[a] = specs1[a] || 'Não disponível'
      filtrado2[a] = specs2[a] || 'Não disponível'
    })

    const pesquisa = {
      tipo: 'comparacao',
      veiculo1: { ...veiculo1, specs: filtrado1 },
      veiculo2: { ...veiculo2, specs: filtrado2 },
      atributos: atributosSelecionados,
    }
    adicionarPesquisa(pesquisa)
    setResultado(pesquisa)
    setLoading(false)
  }

  if (resultado) {
    return <ResultadoComparacao resultado={resultado} onNovaComparacao={() => setResultado(null)} />
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[
          { label: t('pesquisa.veiculo1'), state: veiculo1, setState: setVeiculo1 },
          { label: t('pesquisa.veiculo2'), state: veiculo2, setState: setVeiculo2 },
        ].map(({ label, state, setState }) => (
          <div key={label} className="bg-[#1a2f5e] border border-[#2a4070] rounded-2xl p-5">
            <p className="text-white font-semibold mb-4">{label}</p>
            {[
              { field: 'marca', label: t('pesquisa.marca'), placeholder: t('pesquisa.placeholder_marca') },
              { field: 'modelo', label: t('pesquisa.modelo'), placeholder: t('pesquisa.placeholder_modelo') },
              { field: 'versao', label: t('pesquisa.versao'), placeholder: t('pesquisa.placeholder_versao') },
            ].map(({ field, label, placeholder }) => (
              <div key={field} className="flex flex-col gap-2 mb-3">
                <label className="text-slate-400 text-sm">{label}</label>
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

        <div className="mb-5">
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