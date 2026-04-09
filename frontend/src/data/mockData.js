export const ATRIBUTOS = [
  'Motor', 'Potência', 'Torque', 'Câmbio',
  'Tração', 'Suspensão', 'Freios', 'Rodas e Pneus',
  'Faróis', 'Modos de condução', 'Preço'
]

export const MOCK_VEICULOS = {
  default: {
    'Motor': 'Não disponível',
    'Potência': 'Não disponível',
    'Torque': 'Não disponível',
    'Câmbio': 'Não disponível',
    'Tração': 'Não disponível',
    'Suspensão': 'Não disponível',
    'Freios': 'Não disponível',
    'Rodas e Pneus': 'Não disponível',
    'Faróis': 'Não disponível',
    'Modos de condução': 'Não disponível',
    'Preço': 'Não disponível',
  },
  'ford-ranger-raptor-2025': {
    'Motor': '3.0L V6 Bi-Turbo Diesel',
    'Potência': '397 cv a 4.000 rpm',
    'Torque': '583 Nm a 3.500 rpm',
    'Câmbio': 'Automático de 10 velocidades',
    'Tração': '4x4 permanente com diferencial traseiro blocante',
    'Suspensão': 'Dianteira: Duplo A / Traseira: Multilink com amortecedores Fox',
    'Freios': 'Discos ventilados nas quatro rodas',
    'Rodas e Pneus': 'Rodas de liga leve 17" com pneus BF Goodrich 285/70 R17 AT',
    'Faróis': 'Full LED com assinatura luminosa em LED',
    'Modos de condução': 'Normal, Esporte, Escorregadio, Lama, Areia, Pedra, Baja',
    'Preço': 'R$ 499.000',
  },
  'toyota-hilux-sr-2025': {
    'Motor': '2.8L Turbodiesel 4 cilindros em linha',
    'Potência': '204 cv a 3.000 rpm',
    'Torque': '500 Nm a 1.600-2.800 rpm',
    'Câmbio': 'Automático de 6 velocidades',
    'Tração': '4x4 com reduzida',
    'Suspensão': 'Dianteira: Duplo A / Traseira: Feixe de molas com monotubo',
    'Freios': 'Dianteiros: Disco ventilado / Traseiros: Tambor',
    'Rodas e Pneus': 'Rodas de aço 17" com pneus 265/65 R17',
    'Faróis': 'Halógenos com DRL em LED',
    'Modos de condução': 'Não disponível',
    'Preço': 'R$ 264.990 (tabela FIPE estimada)',
  },
  'toyota-hilux-grs-2025': {
    'Motor': '2.8L Turbodiesel 4 cilindros em linha',
    'Potência': '224 cv a 3.000 rpm',
    'Torque': '550 Nm a 1.600-2.800 rpm',
    'Câmbio': 'Automático de 6 velocidades',
    'Tração': '4x4 com reduzida',
    'Suspensão': 'Dianteira: Duplo A / Traseira: Feixe de molas com monotubo',
    'Freios': 'Discos ventilados nas quatro rodas',
    'Rodas e Pneus': 'Rodas de liga leve 18" com pneus 265/60 R18',
    'Faróis': 'LED com DRL em LED',
    'Modos de condução': 'Não disponível',
    'Preço': 'R$ 339.990 (tabela FIPE estimada)',
  },
}

export function getMockSpecs(marca, modelo, versao) {
  const chave = `${marca}-${modelo}-${versao}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  return MOCK_VEICULOS[chave] || MOCK_VEICULOS['default']
}