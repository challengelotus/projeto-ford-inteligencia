import { ArrowLeft, Download } from 'lucide-react'

export default function ResultadoComparacao({ resultado, onNovaComparacao }) {
  const { veiculo1, veiculo2, atributos } = resultado

  const vantagens = atributos.filter(a =>
    veiculo1.specs[a] !== 'Não disponível' &&
    veiculo2.specs[a] === 'Não disponível'
  )

  return (
    <div>
      {/* Header veículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {[veiculo1, veiculo2].map((v, i) => (
          <div key={i} className="bg-[#1a2f5e] border border-[#2a4070] rounded-xl px-5 py-4">
            <small className="text-slate-400 text-xs">Veículo {i + 1}</small>
            <p className="text-white font-semibold mt-1">
              {v.marca} {v.modelo} <span className="text-[#4a9eff]">{v.versao}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div className="rounded-xl overflow-hidden border border-[#2a4070]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0f1f3d]">
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">Atributo</th>
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">{veiculo1.marca} {veiculo1.modelo}</th>
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">{veiculo2.marca} {veiculo2.modelo}</th>
            </tr>
          </thead>
          <tbody>
            {atributos.map(atributo => {
              const val1 = veiculo1.specs[atributo]
              const val2 = veiculo2.specs[atributo]
              const v1vantagem = val1 !== 'Não disponível' && val2 === 'Não disponível'
              const v2vantagem = val2 !== 'Não disponível' && val1 === 'Não disponível'

              return (
                <tr key={atributo} className="border-t border-[#1e3358]">
                  <td className="px-5 py-4 text-white font-semibold text-sm">{atributo}</td>
                  <td className={`px-5 py-4 text-sm ${v1vantagem ? 'bg-green-900/20 text-green-300' : 'text-slate-300'}`}>
                    {val1 === 'Não disponível'
                      ? <span className="flex items-center gap-2 text-slate-500">
                          Não disponível
                          <span className="px-2 py-0.5 bg-red-900/50 text-red-400 rounded-full text-xs">Indisponível</span>
                        </span>
                      : val1}
                  </td>
                  <td className={`px-5 py-4 text-sm ${v2vantagem ? 'bg-green-900/20 text-green-300' : 'text-slate-300'}`}>
                    {val2 === 'Não disponível'
                      ? <span className="flex items-center gap-2 text-slate-500">
                          Não disponível
                          <span className="px-2 py-0.5 bg-red-900/50 text-red-400 rounded-full text-xs">Indisponível</span>
                        </span>
                      : val2}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Card resumo vantagens */}
      {vantagens.length > 0 && (
        <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-xl p-5 mt-5">
          <h3 className="text-white font-semibold mb-3">
            🏆 {veiculo1.marca} {veiculo1.modelo} se destaca em {vantagens.length} atributos
          </h3>
          <div className="flex flex-wrap gap-2">
            {vantagens.map(a => (
              <span key={a} className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-xs font-semibold">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={onNovaComparacao}
          className="flex-1 flex items-center justify-center gap-2 border border-[#2a4070] hover:border-[#4a9eff] text-white py-3 rounded-lg transition text-sm"
        >
          <ArrowLeft size={16} /> Nova Comparação
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#003478] hover:bg-[#004499] text-white py-3 rounded-lg transition text-sm">
          <Download size={16} /> Exportar CSV
        </button>
      </div>
    </div>
  )
}