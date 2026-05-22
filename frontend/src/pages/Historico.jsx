import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Search, GitCompare, Trash2, Clock, X } from 'lucide-react'

const CHAVE = 'ford-ci-dev-historico'

export default function Historico() {
  const [historico, setHistorico] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo) setHistorico(JSON.parse(salvo))
  }, [])

  function remover(id) {
    const novo = historico.filter(item => item.id !== id)
    setHistorico(novo)
    localStorage.setItem(CHAVE, JSON.stringify(novo))
  }

  function limparTudo() {
    setHistorico([])
    localStorage.removeItem(CHAVE)
  }

  function abrir(item) {
    navigate('/', { state: { itemHistorico: item } })
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-semibold">Histórico de Pesquisas</h2>
            <p className="text-slate-400 text-sm mt-1">
              {historico.length} {historico.length !== 1 ? 'pesquisas realizadas' : 'pesquisa realizada'}
            </p>
          </div>
          {historico.length > 0 && (
            <button
              onClick={limparTudo}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/60 px-4 py-2 rounded-lg text-sm transition"
            >
              <Trash2 size={15} />
              Limpar tudo
            </button>
          )}
        </div>

        {historico.length === 0 && (
          <div className="bg-[#1a2f5e] border border-[#2a4070] rounded-2xl p-12 flex flex-col items-center gap-4">
            <Clock size={40} className="text-slate-600" />
            <p className="text-slate-400">Nenhuma pesquisa realizada ainda.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#003478] hover:bg-[#004499] text-white px-6 py-2 rounded-lg text-sm transition"
            >
              Fazer primeira pesquisa
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {historico.map(item => (
            <div
              key={item.id}
              onClick={() => abrir(item)}
              className="bg-[#1a2f5e] border border-[#2a4070] rounded-2xl p-5 cursor-pointer hover:border-[#4a9eff] transition relative"
            >
              <button
                onClick={e => { e.stopPropagation(); remover(item.id) }}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition"
              >
                <X size={16} />
              </button>

              <div className="flex items-center justify-between mb-4">
                <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
                  ${item.tipo === 'individual' ? 'bg-blue-900/50 text-blue-400' : 'bg-purple-900/50 text-purple-400'}`}>
                  {item.tipo === 'individual'
                    ? <><Search size={12} /> Pesquisa Individual</>
                    : <><GitCompare size={12} /> Comparação</>
                  }
                </span>
                <span className="text-slate-500 text-xs mr-6">{item.data}</span>
              </div>

              {item.tipo === 'individual' && (
                <div>
                  <p className="text-white font-semibold">
                    {item.marca} {item.modelo} <span className="text-[#4a9eff]">{item.versao}</span> · {item.ano}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(item.specs).slice(0, 5).map(([atributo, valor]) => (
                      <span key={atributo} className="bg-[#0f1f3d] border border-[#2a4070] px-3 py-1 rounded-lg text-xs text-slate-300">
                        <span className="text-slate-500">{atributo}:</span> {valor === 'Não disponível' ? '—' : valor}
                      </span>
                    ))}
                    {Object.keys(item.specs).length > 5 && (
                      <span className="bg-[#0f1f3d] border border-[#2a4070] px-3 py-1 rounded-lg text-xs text-slate-500">
                        +{Object.keys(item.specs).length - 5} atributos
                      </span>
                    )}
                  </div>
                </div>
              )}

              {item.tipo === 'comparacao' && (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 bg-[#0f1f3d] border border-[#2a4070] rounded-xl px-4 py-3">
                    <p className="text-xs text-slate-500 mb-1">Veículo 1</p>
                    <p className="text-white text-sm font-semibold">
                      {item.veiculo1.marca} {item.veiculo1.modelo} <span className="text-[#4a9eff]">{item.veiculo1.versao}</span> · {item.veiculo1.ano}
                    </p>
                  </div>
                  <span className="text-slate-500 font-bold">VS</span>
                  <div className="flex-1 bg-[#0f1f3d] border border-[#2a4070] rounded-xl px-4 py-3">
                    <p className="text-xs text-slate-500 mb-1">Veículo 2</p>
                    <p className="text-white text-sm font-semibold">
                      {item.veiculo2.marca} {item.veiculo2.modelo} <span className="text-[#4a9eff]">{item.veiculo2.versao}</span> · {item.veiculo2.ano}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}