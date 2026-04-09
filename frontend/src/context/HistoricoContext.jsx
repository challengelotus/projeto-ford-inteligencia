import { createContext, useContext, useState } from 'react'

const HistoricoContext = createContext(null)

export function HistoricoProvider({ children }) {
  const [historico, setHistorico] = useState([])

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