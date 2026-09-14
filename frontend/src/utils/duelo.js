import { COMPARAVEIS_DUELO } from '../data/attributesData'

export function extrairNumero(valor) {
  if (!valor || valor === 'Não disponível') return null
  const limpo = String(valor).replace(/\./g, '').replace(',', '.')
  const m = limpo.match(/-?\d+(\.\d+)?/)
  return m ? parseFloat(m[0]) : null
}

export function calcularVantagem(atributo, valor1, valor2) {
  const cfg = COMPARAVEIS_DUELO[atributo]
  if (!cfg) return { comparavel: false }
  const n1 = extrairNumero(valor1)
  const n2 = extrairNumero(valor2)
  if (n1 == null || n2 == null) return { comparavel: false }
  if (n1 === n2) return { comparavel: true, empate: true, p1: 50, p2: 50 }
  const vencedor = cfg.maiorMelhor ? (n1 > n2 ? 1 : 2) : (n1 < n2 ? 1 : 2)
  const base1 = cfg.maiorMelhor ? n1 : 1 / (n1 || 1)
  const base2 = cfg.maiorMelhor ? n2 : 1 / (n2 || 1)
  const soma = base1 + base2 || 1
  const p1 = Math.round((base1 / soma) * 100)
  return { comparavel: true, empate: false, vencedor, p1, p2: 100 - p1 }
}