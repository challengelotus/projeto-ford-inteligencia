import { ArrowLeft, Download } from 'lucide-react'

export default function ResultadoIndividual({ resultado, onNova }) {
  const { marca, modelo, versao, specs } = resultado

  function exportarCSV() {
    const linhas = [
      ['Veículo', `${marca} ${modelo} ${versao}`],
      [''],
      ['Atributo', 'Valor', 'Status'],
      ...Object.entries(specs).map(([atributo, valor]) => [
        atributo,
        valor,
        valor !== 'Não disponível' ? 'Encontrado' : 'Indisponível'
      ])
    ]

    const csv = linhas.map(l => l.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${marca}-${modelo}-${versao}.csv`.replace(/\s+/g, '-')
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-xl px-5 py-4 mb-5 font-semibold text-white">
        {marca} · {modelo} · <span className="text-[#4a9eff]">{versao}</span>
      </div>

      <div className="rounded-xl overflow-x-auto border border-[#2a4070]">
        <table className="w-full border-collapse min-w-[400px]">
          <thead>
            <tr className="bg-[#0f1f3d]">
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">Atributo</th>
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">Valor</th>
              <th className="text-left px-5 py-3 text-xs text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(specs).map(([atributo, valor]) => {
              const encontrado = valor !== 'Não disponível'
              return (
                <tr key={atributo} className="border-t border-[#1e3358]">
                  <td className="px-5 py-4 text-white font-semibold text-sm">{atributo}</td>
                  <td className="px-5 py-4 text-slate-300 text-sm">{valor}</td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
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

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <button
          onClick={onNova}
          className="flex-1 flex items-center justify-center gap-2 border border-[#2a4070] hover:border-[#4a9eff] text-white py-3 rounded-lg transition text-sm"
        >
          <ArrowLeft size={16} /> Nova Pesquisa
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