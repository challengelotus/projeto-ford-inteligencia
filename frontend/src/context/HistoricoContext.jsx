import { createContext, useContext, useState, useEffect } from 'react'

const HistoricoContext = createContext(null)

const CHAVE_STORAGE = 'ford-ci-historico'

export function HistoricoProvider({ children }) {
  const [historico, setHistorico] = useState(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE)
      return salvo ? JSON.parse(salvo) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(historico))
    } catch {
      console.log('Erro ao salvar histórico')
    }
  }, [historico])

  function adicionarPesquisa(pesquisa) {
    setHistorico(prev => [
      {
        ...pesquisa,
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
      },
      ...prev,
    ])
  }

  function removerPesquisa(id) {
    setHistorico(prev => prev.filter(item => item.id !== id))
  }

  function limparHistorico() {
    setHistorico([])
  }

  return (
    <HistoricoContext.Provider value={{ historico, adicionarPesquisa, removerPesquisa, limparHistorico }}>
      {children}
    </HistoricoContext.Provider>
  )
}

export function useHistorico() {
  return useContext(HistoricoContext)
}