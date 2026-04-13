import { ArrowLeft, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ATRIBUTOS_TECNICOS, ATRIBUTOS_SENSACOES } from '../data/mockData'

export default function ResultadoComparacao({ resultado, onNovaComparacao }) {
  const { t } = useTranslation()
  const { veiculo1, veiculo2, atributos } = resultado

  const tecnicos = atributos.filter(a => ATRIBUTOS_TECNICOS.includes(a))
  const sensacoes = atributos.filter(a => ATRIBUTOS_SENSACOES.includes(a))
  const destaques = atributos.filter(a =>
    veiculo1.specs[a] !== 'Não disponível' && veiculo2.specs[a] === 'Não disponível'
  )

  function exportarCSV() {
    const linhas = [
      ['', `${veiculo1.marca} ${veiculo1.modelo} ${veiculo1.versao}`, `${veiculo2.marca} ${veiculo2.modelo} ${veiculo2.versao}`],
      [''],
      ['Atributo', `${veiculo1.marca} ${veiculo1.modelo}`, `${veiculo2.marca} ${veiculo2.modelo}`],
      ...atributos.map(a => [a, veiculo1.specs[a] || 'Não disponível', veiculo2.specs[a] || 'Não disponível'])
    ]
    const csv = linhas.map(l => l.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comparacao-${veiculo1.modelo}-vs-${veiculo2.modelo}.csv`.replace(/\s+/g, '-')
    a.click()
    URL.revokeObjectURL(url)
  }

  function Tabela({ dados }) {
    return (
      <div className="rounded-xl overflow-hidden border border-[#2a4070]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0f1f3d]">
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">{t('resultado.atributo')}</th>
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">{veiculo1.marca} {veiculo1.modelo}</th>
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">{veiculo2.marca} {veiculo2.modelo}</th>
            </tr>
          </thead>
          <tbody>
            {dados.map(atributo => {
              const val1 = veiculo1.specs[atributo]
              const val2 = veiculo2.specs[atributo]
              const destaque1 = val1 !== 'Não disponível' && val2 === 'Não disponível'
              const destaque2 = val2 !== 'Não disponível' && val1 === 'Não disponível'

              const celula = (val, destaque) => (
                val === 'Não disponível'
                  ? <span className="flex items-center gap-2 text-slate-500">
                      {t('resultado.nao_disponivel')}
                      <span className="px-2 py-0.5 bg-red-900/50 text-red-400 rounded-full text-xs">{t('resultado.indisponivel')}</span>
                    </span>
                  : val
              )

              return (
                <tr key={atributo} className="border-t border-[#1e3358]">
                  <td className="px-5 py-4 text-white font-semibold text-sm w-40">{atributo}</td>
                  <td className={`px-5 py-4 text-sm ${destaque1 ? 'bg-green-900/20 text-green-300' : 'text-slate-300'}`}>
                    {celula(val1, destaque1)}
                  </td>
                  <td className={`px-5 py-4 text-sm ${destaque2 ? 'bg-green-900/20 text-green-300' : 'text-slate-300'}`}>
                    {celula(val2, destaque2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {[veiculo1, veiculo2].map((v, i) => (
          <div key={i} className="bg-[#1a2f5e] border border-[#2a4070] rounded-xl px-5 py-4">
            <small className="text-slate-400 text-xs">{t(`pesquisa.veiculo${i + 1}`)}</small>
            <p className="text-white font-semibold mt-1">
              {v.marca} {v.modelo} <span className="text-[#4a9eff]">{v.versao}</span>
            </p>
          </div>
        ))}
      </div>

      {tecnicos.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#4a9eff]" />
            <p className="text-white text-sm font-semibold">{t('pesquisa.especificacoes_tecnicas')}</p>
          </div>
          <Tabela dados={tecnicos} />
        </div>
      )}

      {sensacoes.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <p className="text-white text-sm font-semibold">{t('pesquisa.experiencia')}</p>
            <span className="text-xs text-slate-500 ml-1">{t('pesquisa.experiencia_sub')}</span>
          </div>
          <Tabela dados={sensacoes} />
        </div>
      )}

      {destaques.length > 0 && (
        <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-xl p-5 mt-2 mb-5">
          <h3 className="text-white font-semibold mb-3">
            🏆 {veiculo1.marca} {veiculo1.modelo} se destaca em {destaques.length} {destaques.length === 1 ? 'atributo' : 'atributos'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {destaques.map(a => (
              <span key={a} className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-xs font-semibold">{a}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onNovaComparacao}
          className="flex-1 flex items-center justify-center gap-2 border border-[#2a4070] hover:border-[#4a9eff] text-white py-3 rounded-lg transition text-sm"
        >
          <ArrowLeft size={16} /> {t('resultado.nova_comparacao')}
        </button>
        <button
          onClick={exportarCSV}
          className="flex-1 flex items-center justify-center gap-2 bg-[#003478] hover:bg-[#004499] text-white py-3 rounded-lg transition text-sm"
        >
          <Download size={16} /> {t('resultado.exportar')}
        </button>
      </div>
    </div>
  )
}