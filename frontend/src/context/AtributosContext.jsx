import { createContext, useContext, useState, useEffect } from 'react'
import { ATRIBUTOS_TECNICOS, ATRIBUTOS_SENSACOES } from '../data/mockData'

const AtributosContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function AtributosProvider({ children }) {
  const [atributosTecnicos, setAtributosTecnicos] = useState(ATRIBUTOS_TECNICOS)
  const [atributosSensacoes, setAtributosSensacoes] = useState(ATRIBUTOS_SENSACOES)

  useEffect(() => {
    fetch(`${API_URL}/api/atributos`)
      .then(res => res.json())
      .then(data => {
        if (data.tecnicos) setAtributosTecnicos(data.tecnicos)
        if (data.sensacoes) setAtributosSensacoes(data.sensacoes)
      })
      .catch(() => {
        // api ainda não disponível, usando dados locais
      })
  }, [])

  return (
    <AtributosContext.Provider value={{ atributosTecnicos, atributosSensacoes }}>
      {children}
    </AtributosContext.Provider>
  )
}

export function useAtributos() {
  return useContext(AtributosContext)
}