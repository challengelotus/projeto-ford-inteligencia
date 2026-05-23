import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Search, History, LogOut, Menu, X } from 'lucide-react'

const IDIOMAS = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAberto, setMenuAberto] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const navBtn = (path, icon, label) => (
    <button
      onClick={() => { navigate(path); setMenuAberto(false) }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
        ${location.pathname === path
          ? 'bg-[#003478] text-white'
          : 'text-slate-400 hover:text-white hover:bg-[#0f1f3d]'
        }`}
    >
      {icon}
      {label}
    </button>
  )

  return (
    <nav className="bg-[#1a2f5e] border-b border-[#2a4070] px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <h1 className="text-xl font-bold text-white shrink-0">
          Ford <span className="text-[#4a9eff]">CI</span>
        </h1>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {navBtn('/', <Search size={16} />, t('nav.pesquisa'))}
          {navBtn('/historico', <History size={16} />, t('nav.historico'))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1 border border-[#2a4070] rounded-lg p-1">
            {IDIOMAS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => i18n.changeLanguage(code)}
                className={`px-2 py-1 rounded text-xs font-semibold transition
                  ${i18n.language === code
                    ? 'bg-[#003478] text-white'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <span className="text-slate-400 text-sm truncate max-w-[160px]">{user?.email}</span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition text-sm"
          >
            <LogOut size={16} />
            {t('nav.sair')}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="md:hidden text-slate-400 hover:text-white transition"
        >
          {menuAberto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuAberto && (
        <div className="md:hidden mt-3 border-t border-[#2a4070] pt-3 flex flex-col gap-2 px-1">
          {navBtn('/', <Search size={16} />, t('nav.pesquisa'))}
          {navBtn('/historico', <History size={16} />, t('nav.historico'))}

          <div className="flex items-center justify-between mt-1 pt-3 border-t border-[#2a4070]">
            <div className="flex items-center gap-1 border border-[#2a4070] rounded-lg p-1">
              {IDIOMAS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => i18n.changeLanguage(code)}
                  className={`px-2 py-1 rounded text-xs font-semibold transition
                    ${i18n.language === code
                      ? 'bg-[#003478] text-white'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <span className="text-slate-400 text-xs truncate max-w-[140px]">{user?.email}</span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition text-sm"
            >
              <LogOut size={15} />
              {t('nav.sair')}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}