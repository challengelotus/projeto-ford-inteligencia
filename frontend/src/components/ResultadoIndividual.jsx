import { ArrowLeft, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ATRIBUTOS_TECNICOS, ATRIBUTOS_SENSACOES } from '../data/mockData'

export default function ResultadoIndividual({ resultado, onNovaPesquisa }) {
  const { t } = useTranslation()
  const { marca, modelo, versao, specs } = resultado

  const tecnicos = Object.entries(specs).filter(([a]) => ATRIBUTOS_TECNICOS.includes(a))
  const sensacoes = Object.entries(specs).filter(([a]) => ATRIBUTOS_SENSACOES.includes(a))

  function exportarCSV() {
    const linhas = [
      ['Veículo', `${marca} ${modelo} ${versao}`],
      [''],
      ['Atributo', 'Especificação', 'Status'],
      ...Object.entries(specs).map(([a, v]) => [a, v, v !== 'Não disponível' ? 'Encontrado' : 'Indisponível'])
    ]
    const csv = linhas.map(l => l.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${marca}-${modelo}-${versao}.csv`.replace(/\s+/g, '-')
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
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">{t('resultado.especificacao')}</th>
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">{t('resultado.status')}</th>
            </tr>
          </thead>
          <tbody>
            {dados.map(([atributo, valor]) => {
              const ok = valor !== 'Não disponível'
              return (
                <tr key={atributo} className="border-t border-[#1e3358]">
                  <td className="px-5 py-4 text-white font-semibold text-sm w-40">{atributo}</td>
                  <td className="px-5 py-4 text-slate-300 text-sm">{valor}</td>
                  <td className="px-5 py-4 w-32">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ok ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                      {ok ? t('resultado.encontrado') : t('resultado.indisponivel')}
                    </span>
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
      <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-xl px-5 py-4 mb-5 font-semibold text-white">
        {marca} · {modelo} · <span className="text-[#4a9eff]">{versao}</span>
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

      <div className="flex gap-3 mt-5">
        <button
          onClick={onNovaPesquisa}
          className="flex-1 flex items-center justify-center gap-2 border border-[#2a4070] hover:border-[#4a9eff] text-white py-3 rounded-lg transition text-sm"
        >
          <ArrowLeft size={16} /> {t('resultado.nova_pesquisa')}
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