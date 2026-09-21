import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NAV_ITEMS = [
  { path: '/', match: ['/'], labelKey: 'nav.pesquisa' },
  { path: '/duelo', match: ['/duelo'], labelKey: 'nav.duelo' },
  { path: '/historico', match: ['/historico'], labelKey: 'nav.historico' },
]

export default function BottomNav() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 flex gap-1 p-1.5 rounded-full z-40"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
        background: 'rgba(8,14,26,.82)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(120,160,220,.18)',
        boxShadow: '0 18px 40px -14px rgba(0,0,0,.9)',
      }}
    >
      {NAV_ITEMS.map(({ path, match, labelKey }) => {
        const ativo = match.includes(location.pathname)
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-[7px] py-[11px] px-[18px] rounded-full transition-all duration-200"
            style={{ background: ativo ? 'rgba(30,107,255,.16)' : 'transparent', color: ativo ? '#fff' : '#5d6b82' }}
          >
            <span
              className="h-[3px] rounded-full transition-all duration-300"
              style={{ width: ativo ? 18 : 6, background: ativo ? '#1e6bff' : 'rgba(120,160,220,.3)' }}
            />
            <span className="font-mono font-semibold text-[10.5px] tracking-[.06em]">{t(labelKey)}</span>
          </button>
        )
      })}
    </div>
  )
}