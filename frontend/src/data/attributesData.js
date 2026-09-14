// Agrupamento dos atributos técnicos, usado pelos presets e pelo "ajuste fino".
// As strings são as mesmas já usadas em mock.js / specs do backend, então funciona
// sem precisar mudar mais nada na integração com a API.

export const GRUPOS_ATRIBUTOS = {
  motorizacao: ['Motor', 'Potência', 'Torque', 'Câmbio', 'Número de Marchas', 'Tração', 'Propulsão', 'Tipo de Combustível'],
  chassi: ['Suspensão', 'Freios', 'Rodas e Pneus', 'Faróis', 'Modos de Condução'],
  dimensoes: [
    'Comprimento', 'Largura', 'Altura', 'Capacidade do Tanque', 'Peso',
    'Aceleração 0-100 km/h', 'Velocidade Máxima', 'Consumo Urbano', 'Consumo Rodoviário', 'Preço',
  ],
}

export const ATRIBUTOS = Object.values(GRUPOS_ATRIBUTOS).flat() // 23 atributos, na ordem dos grupos

export const PRESETS = {
  essencial: ['Motor', 'Potência', 'Câmbio', 'Preço'],
  performance: ['Motor', 'Potência', 'Torque', 'Câmbio', 'Tração', 'Aceleração 0-100 km/h', 'Velocidade Máxima'],
  offroad: ['Tração', 'Suspensão', 'Freios', 'Rodas e Pneus', 'Modos de Condução'],
  tudo: ATRIBUTOS,
}

export const PRESET_IDS = ['essencial', 'performance', 'offroad', 'tudo']

// Atributos com comparação numérica possível no Duelo (dá pra calcular vantagem).
// Os demais (texto/categórico, ex: Motor, Câmbio, Tração) são "qualitativos" — mostrados
// lado a lado sem vencedor. maiorMelhor: false = o menor valor é que vence (ex: preço, aceleração).
export const COMPARAVEIS_DUELO = {
  'Potência': { maiorMelhor: true },
  'Torque': { maiorMelhor: true },
  'Número de Marchas': { maiorMelhor: true },
  'Aceleração 0-100 km/h': { maiorMelhor: false },
  'Velocidade Máxima': { maiorMelhor: true },
  'Consumo Urbano': { maiorMelhor: true },
  'Consumo Rodoviário': { maiorMelhor: true },
  'Capacidade do Tanque': { maiorMelhor: true },
  'Peso': { maiorMelhor: false },
  'Preço': { maiorMelhor: false },
}