import { useTranslation } from 'react-i18next'
import { ATRIBUTOS } from '../data/attributesData'

export default function ResumoConsulta({ marca, modelo, versao, ano, selecionados, onExtrair, disabled }) {
  const { t } = useTranslation()

  const titulo = [marca, modelo, versao].filter(Boolean).join(' ') || t('resumo.sem_nome')

  const linhas = [
    { k: t('resumo.ano'), v: ano || '—' },
    { k: t('resumo.atributos'), v: `${selecionados.length} / ${ATRIBUTOS.length}` },
    { k: t('resumo.fontes'), v: t('resumo.fontes_valor') },
    { k: t('resumo.tempo'), v: '~6s' },
  ]

  return (
    <div
      className="rounded-[22px] p-6 lg:sticky lg:top-6 h-fit"
      style={{ background: 'linear-gradient(180deg,rgba(10,42,107,.5),rgba(9,16,29,.95))', border: '1px solid rgba(30,107,255,.24)' }}
    >
      <div className="font-mono font-semibold text-[10px] tracking-[.14em] text-[#8fb6ff] uppercase">{t('resumo.titulo')}</div>
      <div className="font-sans font-extrabold text-white text-[26px] leading-[1.15] tracking-[-.02em] mt-3.5">{titulo}</div>

      <div className="flex flex-col gap-[11px] mt-5 pt-[18px] border-t border-[rgba(120,160,220,.14)]">
        {linhas.map(({ k, v }) => (
          <div key={k} className="flex items-baseline justify-between gap-3.5">
            <span className="font-mono text-[11px] text-[#7e90ac]">{k}</span>
            <span className="font-sans font-semibold text-[13px] text-[#e8eef8] text-right">{v}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onExtrair}
        disabled={disabled}
        className="w-full mt-[22px] rounded-2xl h-14 px-5 font-bold text-[15px] flex items-center justify-between transition disabled:cursor-not-allowed"
        style={disabled
          ? { background: 'rgba(120,160,220,.1)', color: '#5d6b82' }
          : { background: '#1e6bff', color: '#fff', boxShadow: '0 14px 34px -14px rgba(30,107,255,.95)' }}
      >
        <span>{t('resumo.extrair')}</span>
        <span
          className="font-mono font-bold text-[11px] px-[9px] py-1.5 rounded-[7px]"
          style={{ background: disabled ? 'rgba(120,160,220,.12)' : 'rgba(255,255,255,.16)' }}
        >
          {selecionados.length} ATRIB
        </span>
      </button>

      {disabled && (
        <p className="text-center font-mono text-[11px] text-[#7e90ac] mt-2.5">{t('resumo.aviso')}</p>
      )}
    </div>
  )
}