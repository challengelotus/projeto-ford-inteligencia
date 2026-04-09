import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

    async function handleLogin(e) {
        e.preventDefault()
        setErro('')

        const emailLimpo = email.trim()
        const senhaLimpa = senha.trim()

        if (!emailLimpo || !senhaLimpa) {
        setErro('Preencha todos os campos.')
        return
        }

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)
        if (!emailValido) {
        setErro('Digite um e-mail válido.')
        return
        }

        setLoading(true)
        await new Promise(r => setTimeout(r, 800))

        const sucesso = login(emailLimpo, senhaLimpa)
        setLoading(false)

        if (sucesso) {
        navigate('/')
        } else {
        setErro('E-mail ou senha incorretos.')
        }
    }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Ford <span className="text-[#4a9eff]">CI</span>
          </h1>
          <p className="text-slate-400 mt-2">Inteligência Competitiva Automotiva</p>
        </div>

        {/* Card */}
        <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-2xl p-8">
          <h2 className="text-white text-xl font-semibold mb-6">Entrar</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4" >

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-sm">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-[#0f1f3d] border border-[#2a4070] rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-[#4a9eff] transition"
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-sm">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="bg-[#0f1f3d] border border-[#2a4070] rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-[#4a9eff] transition"
              />
            </div>

            {/* Erro */}
            {erro && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <span className="text-red-400 text-lg">⚠</span>
                <p className="text-red-400 text-sm">{erro}</p>
             </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#003478] hover:bg-[#004499] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {loading ? 'Entrando...' : (
                <><LogIn size={18} /> Entrar</>
              )}
            </button>

            

          </form>
        </div>

        {/* Credenciais mock */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Demo: ford@ci.com / ford123
        </p>

      </div>
    </div>
  )
}