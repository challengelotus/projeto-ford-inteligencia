import { useNavigate, useLocation } from 'react-router-dom'
import { Search, History } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="bg-[#1a2f5e] border-b border-[#2a4070] px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">

        <h1 className="text-xl font-bold text-white">
          Ford <span className="text-[#4a9eff]">CI</span></h1>

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

      </div>
    </nav>
  )
}