import { ArrowLeft, Download } from 'lucide-react'

export default function ResultadoComparacao({ resultado, onNova }) {
  const { veiculo1, veiculo2, atributos } = resultado

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
    const link = document.createElement('a')
    link.href = url
    link.download = `comparacao-${veiculo1.modelo}-vs-${veiculo2.modelo}.csv`.replace(/\s+/g, '-')
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {[veiculo1, veiculo2].map((v, i) => (
          <div key={i} className="bg-[#1a2f5e] border border-[#2a4070] rounded-xl px-5 py-4">
            <small className="text-slate-400 text-xs">Veículo {i + 1}</small>
            <p className="text-white font-semibold mt-1">
              {v.marca} {v.modelo} <span className="text-[#4a9eff]">{v.versao}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-x-auto border border-[#2a4070]">
        <table className="w-full border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-[#0f1f3d]">
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">Atributo</th>
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">
                <span className="block truncate max-w-[150px]">{veiculo1.marca} {veiculo1.modelo}</span>
              </th>
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">
                <span className="block truncate max-w-[150px]">{veiculo2.marca} {veiculo2.modelo}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {atributos.map(atributo => {
              const val1 = veiculo1.specs[atributo]
              const val2 = veiculo2.specs[atributo]
              const v1destaque = val1 !== 'Não disponível' && val2 === 'Não disponível'
              const v2destaque = val2 !== 'Não disponível' && val1 === 'Não disponível'

              return (
                <tr key={atributo} className="border-t border-[#1e3358]">
                  <td className="px-5 py-4 text-white font-semibold text-sm">{atributo}</td>
                  <td className={`px-5 py-4 text-sm ${v1destaque ? 'bg-green-900/20 text-green-300' : 'text-slate-300'}`}>
                    {val1 === 'Não disponível'
                      ? <span className="text-slate-500">Não disponível <span className="ml-1 px-2 py-0.5 bg-red-900/50 text-red-400 rounded-full text-xs whitespace-nowrap">Indisponível</span></span>
                      : val1}
                  </td>
                  <td className={`px-5 py-4 text-sm ${v2destaque ? 'bg-green-900/20 text-green-300' : 'text-slate-300'}`}>
                    {val2 === 'Não disponível'
                      ? <span className="text-slate-500">Não disponível <span className="ml-1 px-2 py-0.5 bg-red-900/50 text-red-400 rounded-full text-xs whitespace-nowrap">Indisponível</span></span>
                      : val2}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <button
          onClick={onNova}
          className="flex-1 flex items-center justify-center gap-2 border border-[#2a4070] hover:border-[#4a9eff] text-white py-3 rounded-lg transition text-sm"
        >
          <ArrowLeft size={16} /> Nova Comparação
        </button>
        <button
          onClick={exportarCSV}
          className="flex-1 flex items-center justify-center gap-2 bg-[#003478] hover:bg-[#004499] text-white py-3 rounded-lg transition text-sm"
        >
          <Download size={16} /> Exportar CSV
        </button>
      </div>
    </div>
  )
}