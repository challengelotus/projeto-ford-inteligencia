const API_BASE = '/api'

export const ATRIBUTOS = [
  'Motor',
  'Potência',
  'Torque',
  'Câmbio',
  'Tração',
  'Comprimento',
  'Largura',
  'Altura',
  'Capacidade do Tanque',
  'Peso',
  'Número de Marchas',
  'Aceleração 0-100 km/h',
  'Velocidade Máxima',
  'Consumo Urbano',
  'Consumo Rodoviário',
]

export async function buscarEspecificacoes(marca, modelo, versao, atributos) {
  try {
    const response = await fetch(`${API_BASE}/especificacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marca, modelo, versao, atributos }),
    })

    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)

    const data = await response.json()

    const resultado = {}
    for (const atributo of atributos) {
      const chave = Object.keys(data).find(
        k => k.toLowerCase() === atributo.toLowerCase()
      )
      resultado[atributo] = chave && data[chave] ? String(data[chave]) : 'Não disponível'
    }

    return resultado
  } catch (error) {
    console.error('Erro ao buscar especificações:', error)
    return Object.fromEntries(atributos.map(a => [a, 'Não disponível']))
  }
}