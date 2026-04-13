import { createContext, useContext, useState } from 'react'

const HistoricoContext = createContext(null)
const STORAGE_KEY = 'ford-ci-historico'

export function HistoricoProvider({ children }) {
  const [historico, setHistorico] = useState(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY)
      return salvo ? JSON.parse(salvo) : []
    } catch {
      return []
    }
  })

  function salvar(novoHistorico) {
    setHistorico(novoHistorico)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novoHistorico))
  }

  function adicionarPesquisa(pesquisa) {
    const nova = {
      ...pesquisa,
      id: Date.now(),
      data: new Date().toLocaleString('pt-BR'),
    }
    salvar([nova, ...historico])
  }

  function removerPesquisa(id) {
    salvar(historico.filter(item => item.id !== id))
  }

  function limparHistorico() {
    salvar([])
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