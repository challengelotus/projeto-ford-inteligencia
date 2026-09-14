import { useTranslation } from 'react-i18next'
import { calcularVantagem } from '../utils/duelo'

export default function ResultadoComparacao({ resultado, onNova }) {
  const { t } = useTranslation()
  const { veiculo1, veiculo2, atributos } = resultado

  const vantagens1 = atributos.filter(a => calcularVantagem(a, veiculo1.specs[a], veiculo2.specs[a]).vencedor === 1).length
  const vantagens2 = atributos.filter(a => calcularVantagem(a, veiculo1.specs[a], veiculo2.specs[a]).vencedor === 2).length

  function exportarCSV() {
    const linhas = [
      ['', `${veiculo1.marca} ${veiculo1.modelo} ${veiculo1.versao} ${veiculo1.ano}`, `${veiculo2.marca} ${veiculo2.modelo} ${veiculo2.versao} ${veiculo2.ano}`],
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
      <div className="flex items-center justify-between">
        <button
          onClick={onNova}
          className="bg-transparent border-none text-[#7e90ac] hover:text-white font-mono font-semibold text-[11px] flex items-center gap-2 transition"
        >
          <span className="text-base">←</span> {t('duelo.ajustar_duelo')}
        </button>
        <button
          onClick={exportarCSV}
          className="border border-[rgba(30,107,255,.4)] bg-[rgba(30,107,255,.16)] hover:bg-[rgba(30,107,255,.3)] hover:text-white rounded-[11px] px-4 py-[11px] text-[#8fb6ff] font-sans font-semibold text-xs transition"
        >
          {t('resultado.exportar')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
        {[
          { v: veiculo1, cor: '#8fb6ff', vantagens: vantagens1 },
          { v: veiculo2, cor: '#f5a524', vantagens: vantagens2 },
        ].map(({ v, cor, vantagens }, i) => (
          <div
            key={i}
            className="rounded-2xl p-5"
            style={{ background: 'linear-gradient(180deg,rgba(16,27,46,.95),rgba(9,16,29,.95))', border: '1px solid rgba(120,160,220,.14)', borderTop: `3px solid ${cor}` }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-extrabold text-[11px] tracking-[.14em]" style={{ color: cor }}>{t('duelo.veiculo_num', { n: i + 1 })}</span>
              <span className="font-mono font-bold text-[11px]" style={{ color: cor }}>{t('duelo.vantagens_contagem', { n: vantagens })}</span>
            </div>
            <div className="font-sans font-extrabold text-white text-xl mt-2.5">
              {v.marca} {v.modelo} <span style={{ color: cor }}>{v.versao}</span> · {v.ano}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl mt-4 p-2 md:p-4" style={{ background: 'rgba(9,16,29,.9)', border: '1px solid rgba(120,160,220,.14)' }}>
        {atributos.map(atributo => {
          const val1 = veiculo1.specs[atributo]
          const val2 = veiculo2.specs[atributo]
          const comp = calcularVantagem(atributo, val1, val2)

          return (
            <div key={atributo} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-4 py-4 px-2 border-b border-[rgba(120,160,220,.1)] last:border-0">
              <div className="text-right min-w-0">
                <div className={`font-sans font-bold text-sm md:text-base truncate ${comp.vencedor === 1 ? 'text-[#f5a524]' : val1 === 'Não disponível' ? 'text-[#5d6b82]' : 'text-[#e8eef8]'}`}>
                  {val1}
                </div>
                {comp.comparavel && (
                  <div className="h-[3px] rounded-full bg-[rgba(120,160,220,.12)] mt-2 overflow-hidden">
                    <div className="h-full ml-auto rounded-full transition-all" style={{ width: `${comp.p1}%`, background: comp.vencedor === 1 ? '#f5a524' : '#3d4a5e' }} />
                  </div>
                )}
              </div>
              <div className="font-mono text-[9.5px] md:text-[10px] tracking-[.08em] text-[#6f8099] uppercase text-center px-1 min-w-[90px] md:min-w-[130px]">
                {atributo}
              </div>
              <div className="text-left min-w-0">
                <div className={`font-sans font-bold text-sm md:text-base truncate ${comp.vencedor === 2 ? 'text-[#f5a524]' : val2 === 'Não disponível' ? 'text-[#5d6b82]' : 'text-[#e8eef8]'}`}>
                  {val2}
                </div>
                {comp.comparavel && (
                  <div className="h-[3px] rounded-full bg-[rgba(120,160,220,.12)] mt-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${comp.p2}%`, background: comp.vencedor === 2 ? '#f5a524' : '#3d4a5e' }} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}