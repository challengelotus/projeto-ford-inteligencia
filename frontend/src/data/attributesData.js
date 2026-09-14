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