import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Search, History, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-[#1a2f5e] border-b border-[#2a4070] px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <h1 className="text-xl font-bold text-white">
          Ford <span className="text-[#4a9eff]">CI</span>
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
              ${location.pathname === '/'
                ? 'bg-[#003478] text-white'
                : 'text-slate-400 hover:text-white hover:bg-[#0f1f3d]'
              }`}
          >
            <Search size={16} />
            Pesquisa
          </button>

          <button
            onClick={() => navigate('/historico')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
              ${location.pathname === '/historico'
                ? 'bg-[#003478] text-white'
                : 'text-slate-400 hover:text-white hover:bg-[#0f1f3d]'
              }`}
          >
            <History size={16} />
            Histórico
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition text-sm"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>

      </div>
    </nav>
  )
}