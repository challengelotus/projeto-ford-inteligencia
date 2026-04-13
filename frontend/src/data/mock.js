export const ATRIBUTOS = [
  'Motor',
  'Potência',
  'Torque',
  'Câmbio',
  'Tração',
  'Suspensão',
  'Freios',
  'Rodas e Pneus',
  'Faróis',
  'Modos de condução',
  'Preço'
]

export const VEICULOS = {
  'ford-ranger-raptor-2025': {
    'Motor': '3.0L V6 Bi-Turbo Diesel',
    'Potência': '397 cv a 4.000 rpm',
    'Torque': '583 Nm a 3.500 rpm',
    'Câmbio': 'Automático de 10 velocidades',
    'Tração': '4x4 permanente com diferencial traseiro blocante',
    'Suspensão': 'Dianteira: Duplo A / Traseira: Multilink com amortecedores Fox',
    'Freios': 'Discos ventilados nas quatro rodas',
    'Rodas e Pneus': '17" liga leve com pneus BF Goodrich 285/70 R17 AT',
    'Faróis': 'Full LED com assinatura luminosa',
    'Modos de condução': 'Normal, Esporte, Lama, Areia, Pedra, Baja',
    'Preço': 'R$ 499.000',
  },
  'toyota-hilux-sr-2025': {
    'Motor': '2.8L Turbodiesel 4 cilindros',
    'Potência': '204 cv a 3.000 rpm',
    'Torque': '500 Nm a 1.600-2.800 rpm',
    'Câmbio': 'Automático de 6 velocidades',
    'Tração': '4x4 com reduzida',
    'Suspensão': 'Dianteira: Duplo A / Traseira: Feixe de molas',
    'Freios': 'Dianteiros: Disco ventilado / Traseiros: Tambor',
    'Rodas e Pneus': '17" aço com pneus 265/65 R17',
    'Faróis': 'Halógenos com DRL em LED',
    'Modos de condução': 'Não disponível',
    'Preço': 'R$ 264.990',
  },
}

export function buscarEspecificacoes(marca, modelo, versao, atributos) {
  const chave = `${marca}-${modelo}-${versao}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const veiculo = VEICULOS[chave] || {}

  const resultado = {}
  atributos.forEach(a => {
    resultado[a] = veiculo[a] || 'Não disponível'
  })
  return resultado
}