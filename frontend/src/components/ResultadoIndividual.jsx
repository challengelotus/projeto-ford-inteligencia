import { useTranslation } from 'react-i18next'

const PRIORIDADE_HERO = ['Potência', 'Torque', 'Aceleração 0-100 km/h']
const UNIDADES = { 'Potência': 'cv', 'Torque': 'Nm', 'Aceleração 0-100 km/h': 's' }

function extrairNumero(valor) {
  const m = String(valor).match(/[\d.,]+/)
  return m ? m[0] : valor
}

export default function ResultadoIndividual({ resultado, onNova }) {
  const { t } = useTranslation()
  const { marca, modelo, versao, ano, specs } = resultado

  const total = Object.keys(specs).length
  const encontradosCount = Object.values(specs).filter(v => v !== 'Não disponível').length

  const heroStats = PRIORIDADE_HERO
    .filter(attr => specs[attr] && specs[attr] !== 'Não disponível')
    .slice(0, 3)
    .map(attr => ({
      k: attr === 'Aceleração 0-100 km/h' ? '0-100' : attr,
      v: extrairNumero(specs[attr]),
      u: UNIDADES[attr],
    }))

  const watermark = heroStats[0]?.v

  function exportarCSV() {
    const linhas = [
      ['Veículo', `${marca} ${modelo} ${versao} ${ano}`],
      [''],
      [t('resultado.atributo'), t('resultado.especificacao'), t('resultado.status')],
      ...Object.entries(specs).map(([atributo, valor]) => [
        atributo,
        valor,
        valor !== 'Não disponível' ? t('resultado.encontrado') : t('resultado.nao_disponivel')
      ])
    ]

    const csv = linhas.map(l => l.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${marca}-${modelo}-${versao}-${ano}.csv`.replace(/\s+/g, '-')
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <button
        onClick={onNova}
        className="bg-transparent border-none text-[#7e90ac] hover:text-white font-mono font-semibold text-[11px] flex items-center gap-2 transition"
      >
        <span className="text-base">←</span> {t('resultado.nova_pesquisa')}
      </button>

      <div
        className="relative mt-4 rounded-[26px] overflow-hidden border border-[rgba(120,160,220,.16)]"
        style={{ background: 'linear-gradient(120deg,#0a2a6b,#081326 62%)' }}
      >
        {watermark && (
          <div
            className="absolute right-4 md:right-8 -top-2 md:-top-8 font-sans font-extrabold leading-none pointer-events-none select-none text-[90px] md:text-[200px]"
            style={{ fontStretch: '118%', letterSpacing: '-.06em', color: 'rgba(255,255,255,.05)' }}
          >
            {watermark}
          </div>
        )}
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
          <div>
            <div className="font-mono text-[11px] tracking-[.16em] text-[#8fb6ff] uppercase">{marca} · {ano}</div>
            <div
              className="font-sans font-extrabold text-white leading-none tracking-[-.04em] mt-3.5 text-[32px] md:text-[56px]"
              style={{ fontStretch: '110%' }}
            >
              {modelo} {versao}
            </div>
          </div>
          {heroStats.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {heroStats.map(({ k, v, u }) => (
                <div key={k} className="w-[calc(50%-6px)] sm:w-[150px] bg-[rgba(4,7,14,.5)] border border-[rgba(120,160,220,.14)] rounded-2xl px-[18px] py-4">
                  <div className="font-mono text-[9px] tracking-[.1em] text-[#7e90ac] uppercase">{k}</div>
                  <div className="font-sans font-extrabold text-white text-[30px] leading-none mt-2.5">
                    {v}<span className="font-mono font-semibold text-xs text-[#8fb6ff] ml-1">{u}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-8 mb-1">
        <span className="font-mono font-semibold text-[10px] tracking-[.14em] text-[#6f8099] uppercase">
          {t('resultado.ficha_tecnica')} · {total} {t('resultado.atributo')}
        </span>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] text-[#3ed598]">● {encontradosCount} {t('resultado.de_encontrados')}</span>
          <button
            onClick={exportarCSV}
            className="border border-[rgba(30,107,255,.4)] bg-[rgba(30,107,255,.16)] hover:bg-[rgba(30,107,255,.3)] hover:text-white rounded-[11px] px-4 py-[11px] text-[#8fb6ff] font-sans font-semibold text-xs transition"
          >
            {t('resultado.exportar')}
          </button>
        </div>
      </div>
      <p className="font-mono text-[10px] text-[#4c5a70] mb-4">{t('resultado.fonte_pipeline')}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(specs).map(([atributo, valor]) => {
          const encontrado = valor !== 'Não disponível'
          return (
            <div
              key={atributo}
              className="bg-[rgba(10,17,30,.9)] border border-[rgba(120,160,220,.12)] hover:border-[rgba(30,107,255,.4)] rounded-2xl p-5 transition"
            >
              <span className="font-mono font-semibold text-[11px] tracking-[.1em] text-[#6f8099] uppercase">{atributo}</span>
              <div className="font-sans font-bold text-[17px] leading-[1.35] text-[#e8eef8] mt-3 min-h-[46px]">{valor}</div>
              <div className="flex items-center gap-2.5 mt-3.5">
                <div className="flex-1 h-[3px] rounded-full bg-[rgba(120,160,220,.12)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: encontrado ? '100%' : '8%', background: encontrado ? '#3ed598' : '#5d6b82' }}
                  />
                </div>
                <span
                  className="font-mono font-semibold text-[9.5px] uppercase whitespace-nowrap"
                  style={{ color: encontrado ? '#3ed598' : '#5d6b82' }}
                >
                  {encontrado ? t('resultado.encontrado') : t('resultado.indisponivel')}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}