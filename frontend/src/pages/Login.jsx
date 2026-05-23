import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { LogIn } from 'lucide-react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { login } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    const emailLimpo = email.trim()
    const senhaLimpa = senha.trim()

    if (!emailLimpo || !senhaLimpa) {
      setErro(t('login.erro_campos'))
      return
    }

    if (!EMAIL_REGEX.test(emailLimpo)) {
      setErro(t('login.erro_email'))
      return
    }

    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 800))

      const ok = await login(emailLimpo, senhaLimpa)
      console.log(ok)

      if (ok) {
        navigate('/')
      } else {
        setErro(t('login.erro_credenciais'))
      }
    } catch (error) {
      setErro(t('login.erro_credenciais'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Ford <span className="text-[#4a9eff]">CI</span>
          </h1>
          <p className="text-slate-400 mt-2">Inteligência Competitiva Automotiva</p>
        </div>

        <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-2xl p-8">
          <h2 className="text-white text-xl font-semibold mb-6">{t('login.titulo')}</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-sm">{t('login.email')}</label>
              <input
                type="email"
                placeholder={t('login.placeholder_email')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-[#0f1f3d] border border-[#2a4070] rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-[#4a9eff] transition"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-sm">{t('login.senha')}</label>
              <input
                type="password"
                placeholder={t('login.placeholder_senha')}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="bg-[#0f1f3d] border border-[#2a4070] rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-[#4a9eff] transition"
              />
            </div>

            {erro && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <span className="text-red-400">⚠</span>
                <p className="text-red-400 text-sm">{erro}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#003478] hover:bg-[#004499] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {loading ? t('login.entrando') : <><LogIn size={18} /> {t('login.btn_entrar')}</>}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">{t('login.demo')}</p>
      </div>
    </div>
  )
}