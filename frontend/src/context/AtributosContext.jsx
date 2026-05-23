import { createContext, useContext, useState, useEffect } from 'react'
import { ATRIBUTOS_TECNICOS, ATRIBUTOS_SENSACOES } from '../data/mockData'

const AtributosContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function AtributosProvider({ children }) {
  const [atributosTecnicos, setAtributosTecnicos] = useState(ATRIBUTOS_TECNICOS)
  const [atributosSensacoes, setAtributosSensacoes] = useState(ATRIBUTOS_SENSACOES)
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    async function buscarAtributos() {
      setCarregando(true)
      try {
        const response = await fetch(`${API_URL}/api/atributos`)
        if (response.ok) {
          const data = await response.json()
          if (data.tecnicos) setAtributosTecnicos(data.tecnicos)
          if (data.sensacoes) setAtributosSensacoes(data.sensacoes)
        }
      } catch {
        // backend ainda não disponível, usa mock como fallback
        console.log('Usando atributos do mock')
      } finally {
        setCarregando(false)
      }
    }

    buscarAtributos()
  }, [])

  return (
    <AtributosContext.Provider value={{ atributosTecnicos, atributosSensacoes, carregando }}>
      {children}
    </AtributosContext.Provider>
  )
}

export function useAtributos() {
  return useContext(AtributosContext)
}