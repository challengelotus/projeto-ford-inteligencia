import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { calcularVantagem, calcularDeltaPercentual } from '../utils/duelo'
import { traduzirAtributo } from '../data/attributeLabels'
import { capitalizarPalavras } from '../utils/texto'

function LinhaAtributo({ atributo, val1, val2, index, idioma }) {
  const [pronto, setPronto] = useState(false)
  const comp = calcularVantagem(atributo, val1, val2)

  useEffect(() => {
    const id = requestAnimationFrame(() => setPronto(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      style={{ animation: 'fcd-rise .4s ease both', animationDelay: `${Math.min(index * 35, 400)}ms` }}
      className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-4 py-4 px-2 border-b border-[rgba(120,160,220,.1)] last:border-0"
    >
      <div className="text-right min-w-0">
        <div className={`font-sans font-bold text-sm md:text-base truncate ${comp.vencedor === 1 ? 'text-[#f5a524]' : val1 === 'Não disponível' ? 'text-[#5d6b82]' : 'text-[#e8eef8]'}`}>
          {val1}
        </div>
        {comp.comparavel && (
          <div className="h-[3px] rounded-full bg-[rgba(120,160,220,.12)] mt-2 overflow-hidden">
            <div
              className="h-full ml-auto rounded-full transition-all duration-700 ease-out"
              style={{ width: pronto ? `${comp.p1}%` : '0%', background: comp.vencedor === 1 ? '#f5a524' : '#3d4a5e' }}
            />
          </div>
        )}
      </div>
      <div className="font-mono text-[9.5px] md:text-[10px] tracking-[.08em] text-[#6f8099] uppercase text-center px-1 min-w-[90px] md:min-w-[130px]">
        {traduzirAtributo(atributo, idioma)}
      </div>
      <div className="text-left min-w-0">
        <div className={`font-sans font-bold text-sm md:text-base truncate ${comp.vencedor === 2 ? 'text-[#f5a524]' : val2 === 'Não disponível' ? 'text-[#5d6b82]' : 'text-[#e8eef8]'}`}>
          {val2}
        </div>
        {comp.comparavel && (
          <div className="h-[3px] rounded-full bg-[rgba(120,160,220,.12)] mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: pronto ? `${comp.p2}%` : '0%', background: comp.vencedor === 2 ? '#f5a524' : '#3d4a5e' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function EspecMobileCard({ atributo, valorEste, valorOutro, index, idioma, t }) {
  const [pronto, setPronto] = useState(false)
  const comp = calcularVantagem(atributo, valorEste, valorOutro)
  const vence = comp.comparavel && !comp.empate && comp.vencedor === 1
  const delta = comp.comparavel ? calcularDeltaPercentual(valorEste, valorOutro) : null

  useEffect(() => {
    const id = requestAnimationFrame(() => setPronto(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const badge = !comp.comparavel
    ? { texto: t('duelo.qualitativo'), cor: '#5d6b82' }
    : comp.empate
      ? { texto: t('duelo.sem_vantagem'), cor: '#5d6b82' }
      : vence
        ? { texto: t('duelo.vantagem'), cor: '#f5a524' }
        : { texto: t('duelo.atras'), cor: '#5d6b82' }

  return (
    <div
      style={{ animation: 'fcd-rise .4s ease both', animationDelay: `${Math.min(index * 30, 350)}ms` }}
      className="bg-[rgba(10,17,30,.9)] border border-[rgba(120,160,220,.12)] rounded-2xl p-5"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono font-semibold text-[11px] tracking-[.1em] text-[#6f8099] uppercase">{traduzirAtributo(atributo, idioma)}</span>
        <span
          className="font-mono font-bold text-[9.5px] uppercase px-2 py-1 rounded-full"
          style={{ color: badge.cor, background: `${badge.cor}22` }}
        >
          {badge.texto}
        </span>
      </div>
      <div className="font-sans font-bold text-[22px] mt-2" style={{ color: vence ? '#f5a524' : '#e8eef8' }}>
        {valorEste}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="font-mono text-[11px] text-[#5d6b82]">{t('duelo.outro')}: {valorOutro}</span>
        {delta !== null && (
          <span className="font-mono font-bold text-[11px]" style={{ color: vence ? '#f5a524' : '#5d6b82' }}>
            {delta > 0 ? '+' : ''}{delta}%
          </span>
        )}
      </div>
      {comp.comparavel && (
        <div className="h-[4px] rounded-full bg-[rgba(120,160,220,.12)] mt-2.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: pronto ? `${comp.p1}%` : '0%', background: vence ? '#f5a524' : '#3d4a5e' }}
          />
        </div>
      )}
    </div>
  )
}

function DueloMobile({ veiculo1, veiculo2, vantagens1, vantagens2, atributos, idioma, t, onNova, onExportar }) {
  const scrollRef = useRef(null)
  const [ativo, setAtivo] = useState(0)

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    setAtivo(Math.round(el.scrollLeft / el.clientWidth))
  }

  const veiculos = [
    { v: veiculo1, outro: veiculo2, cor: '#8fb6ff', vantagens: vantagens1 },
    { v: veiculo2, outro: veiculo1, cor: '#f5a524', vantagens: vantagens2 },
  ]

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between mb-1">
        <button onClick={onNova} className="bg-transparent border-none text-[#7e90ac] font-mono font-semibold text-[11px] flex items-center gap-2">
          <span className="text-base">←</span> {t('duelo.ajustar_duelo')}
        </button>
        <button
          onClick={onExportar}
          className="border border-[rgba(30,107,255,.4)] bg-[rgba(30,107,255,.16)] rounded-[11px] px-3 py-2 text-[#8fb6ff] font-sans font-semibold text-xs"
        >
          {t('resultado.exportar')}
        </button>
      </div>
      <div className="text-right mb-3">
        <span className="font-mono text-[10px] text-[#5d6b82] uppercase tracking-[.08em]">{t('duelo.arraste')} →</span>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="no-scrollbar flex overflow-x-auto snap-x snap-mandatory"
      >
        {veiculos.map(({ v, cor, vantagens }, vi) => (
          <div key={vi} className="snap-center shrink-0 w-full">
            <div
              className="rounded-[22px] p-5"
              style={{ background: 'linear-gradient(120deg,#0a2a6b,#081326 62%)', border: '1px solid rgba(120,160,220,.16)' }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-[11px] tracking-[.14em]" style={{ color: cor }}>{t('duelo.veiculo_num', { n: vi + 1 })}</span>
                <span
                  className="font-mono font-bold text-[10px] uppercase px-2.5 py-1 rounded-full"
                  style={{ color: cor, background: `${cor}22` }}
                >
                  {t('duelo.vantagens_contagem', { n: vantagens })}
                </span>
              </div>
              <div className="font-sans font-extrabold text-white text-2xl mt-2">
                {capitalizarPalavras(v.marca)} {capitalizarPalavras(v.modelo)}
              </div>
              <div className="font-mono text-[11px] text-[#7e90ac] mt-1">{capitalizarPalavras(v.versao)} · {v.ano}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-3 mb-4">
        {veiculos.map((_, i) => (
          <span
            key={i}
            className="h-[3px] rounded-full transition-all duration-300"
            style={{ width: ativo === i ? 18 : 6, background: ativo === i ? '#1e6bff' : 'rgba(120,160,220,.3)' }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {atributos.map((atributo, index) => (
          <EspecMobileCard
            key={atributo}
            atributo={atributo}
            valorEste={veiculos[ativo].v.specs[atributo]}
            valorOutro={veiculos[ativo].outro.specs[atributo]}
            index={index}
            idioma={idioma}
            t={t}
          />
        ))}
      </div>
    </div>
  )
}

export default function ResultadoComparacao({ resultado, onNova }) {
  const { t, i18n } = useTranslation()
  const { veiculo1, veiculo2, atributos } = resultado

  const vantagens1 = atributos.filter(a => calcularVantagem(a, veiculo1.specs[a], veiculo2.specs[a]).vencedor === 1).length
  const vantagens2 = atributos.filter(a => calcularVantagem(a, veiculo1.specs[a], veiculo2.specs[a]).vencedor === 2).length

  function exportarCSV() {
    const linhas = [
      ['', `${capitalizarPalavras(veiculo1.marca)} ${capitalizarPalavras(veiculo1.modelo)} ${capitalizarPalavras(veiculo1.versao)} ${veiculo1.ano}`, `${capitalizarPalavras(veiculo2.marca)} ${capitalizarPalavras(veiculo2.modelo)} ${capitalizarPalavras(veiculo2.versao)} ${veiculo2.ano}`],
      [''],
      ['Atributo', `${capitalizarPalavras(veiculo1.marca)} ${capitalizarPalavras(veiculo1.modelo)}`, `${capitalizarPalavras(veiculo2.marca)} ${capitalizarPalavras(veiculo2.modelo)}`],
      ...atributos.map(a => [traduzirAtributo(a, i18n.language), veiculo1.specs[a] || 'Não disponível', veiculo2.specs[a] || 'Não disponível'])
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
      <DueloMobile
        veiculo1={veiculo1}
        veiculo2={veiculo2}
        vantagens1={vantagens1}
        vantagens2={vantagens2}
        atributos={atributos}
        idioma={i18n.language}
        t={t}
        onNova={onNova}
        onExportar={exportarCSV}
      />

      <div className="hidden md:block">
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
                {capitalizarPalavras(v.marca)} {capitalizarPalavras(v.modelo)} <span style={{ color: cor }}>{capitalizarPalavras(v.versao)}</span> · {v.ano}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl mt-4 p-2 md:p-4" style={{ background: 'rgba(9,16,29,.9)', border: '1px solid rgba(120,160,220,.14)' }}>
          {atributos.map((atributo, index) => (
            <LinhaAtributo
              key={atributo}
              atributo={atributo}
              val1={veiculo1.specs[atributo]}
              val2={veiculo2.specs[atributo]}
              index={index}
              idioma={i18n.language}
            />
          ))}
        </div>
      </div>
    </div>
  )
}