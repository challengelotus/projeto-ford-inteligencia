import { ArrowLeft, Download } from 'lucide-react'
import { ATRIBUTOS_TECNICOS, ATRIBUTOS_SENSACOES } from '../data/mockData'

export default function ResultadoIndividual({ resultado, onNovaPesquisa }) {
  const { marca, modelo, versao, specs } = resultado

  const specsTecnicos = Object.entries(specs).filter(([atributo]) =>
    ATRIBUTOS_TECNICOS.includes(atributo)
  )

  const specsSensacoes = Object.entries(specs).filter(([atributo]) =>
    ATRIBUTOS_SENSACOES.includes(atributo)
  )

  function TabelaSpecs({ dados }) {
    return (
      <div className="rounded-xl overflow-hidden border border-[#2a4070]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0f1f3d]">
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">Atributo</th>
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">Especificação</th>
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {dados.map(([atributo, valor]) => {
              const encontrado = valor !== 'Não disponível'
              return (
                <tr key={atributo} className="border-t border-[#1e3358]">
                  <td className="px-5 py-4 text-white font-semibold text-sm w-40">{atributo}</td>
                  <td className="px-5 py-4 text-slate-300 text-sm">{valor}</td>
                  <td className="px-5 py-4 w-32">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${encontrado ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                      {encontrado ? 'Encontrado' : 'Indisponível'}
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
      {/* Header */}
      <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-xl px-5 py-4 mb-5 text-base font-semibold text-white">
        {marca} · {modelo} · <span className="text-[#4a9eff]">{versao}</span>
      </div>

      {/* Técnicos */}
      {specsTecnicos.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#4a9eff]"></span>
            <p className="text-white text-sm font-semibold">Especificações Técnicas</p>
          </div>
          <TabelaSpecs dados={specsTecnicos} />
        </div>
      )}

      {/* Sensações */}
      {specsSensacoes.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <p className="text-white text-sm font-semibold">Experiência e Sensações</p>
            <span className="text-xs text-slate-500 ml-1">— baseado em reviews e opiniões</span>
          </div>
          <TabelaSpecs dados={specsSensacoes} />
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={onNovaPesquisa}
          className="flex-1 flex items-center justify-center gap-2 border border-[#2a4070] hover:border-[#4a9eff] text-white py-3 rounded-lg transition text-sm"
        >
          <ArrowLeft size={16} /> Nova Pesquisa
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#003478] hover:bg-[#004499] text-white py-3 rounded-lg transition text-sm">
          <Download size={16} /> Exportar CSV
        </button>
      </div>
    </div>
  )
}