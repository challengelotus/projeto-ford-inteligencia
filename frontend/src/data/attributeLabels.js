export const ATRIBUTO_LABELS = {
  'Motor': { pt: 'Motor', en: 'Engine', es: 'Motor' },
  'Potência': { pt: 'Potência', en: 'Power', es: 'Potencia' },
  'Torque': { pt: 'Torque', en: 'Torque', es: 'Torque' },
  'Câmbio': { pt: 'Câmbio', en: 'Transmission', es: 'Transmisión' },
  'Número de Marchas': { pt: 'Número de Marchas', en: 'Number of Gears', es: 'Número de Marchas' },
  'Tração': { pt: 'Tração', en: 'Drivetrain', es: 'Tracción' },
  'Propulsão': { pt: 'Propulsão', en: 'Propulsion', es: 'Propulsión' },
  'Tipo de Combustível': { pt: 'Tipo de Combustível', en: 'Fuel Type', es: 'Tipo de Combustible' },
  'Suspensão': { pt: 'Suspensão', en: 'Suspension', es: 'Suspensión' },
  'Freios': { pt: 'Freios', en: 'Brakes', es: 'Frenos' },
  'Rodas e Pneus': { pt: 'Rodas e Pneus', en: 'Wheels and Tires', es: 'Ruedas y Neumáticos' },
  'Faróis': { pt: 'Faróis', en: 'Headlights', es: 'Faros' },
  'Modos de Condução': { pt: 'Modos de Condução', en: 'Drive Modes', es: 'Modos de Conducción' },
  'Comprimento': { pt: 'Comprimento', en: 'Length', es: 'Longitud' },
  'Largura': { pt: 'Largura', en: 'Width', es: 'Ancho' },
  'Altura': { pt: 'Altura', en: 'Height', es: 'Altura' },
  'Capacidade do Tanque': { pt: 'Capacidade do Tanque', en: 'Tank Capacity', es: 'Capacidad del Tanque' },
  'Peso': { pt: 'Peso', en: 'Weight', es: 'Peso' },
  'Aceleração 0-100 km/h': { pt: 'Aceleração 0-100 km/h', en: '0-100 km/h Acceleration', es: 'Aceleración 0-100 km/h' },
  'Velocidade Máxima': { pt: 'Velocidade Máxima', en: 'Top Speed', es: 'Velocidad Máxima' },
  'Consumo Urbano': { pt: 'Consumo Urbano', en: 'City Fuel Economy', es: 'Consumo Urbano' },
  'Consumo Rodoviário': { pt: 'Consumo Rodoviário', en: 'Highway Fuel Economy', es: 'Consumo en Carretera' },
  'Preço': { pt: 'Preço', en: 'Price', es: 'Precio' },
}

export function traduzirAtributo(nome, idioma) {
  return ATRIBUTO_LABELS[nome]?.[idioma] || nome
}