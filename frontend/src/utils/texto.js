// Capitaliza a primeira letra de cada palavra, sem mexer no resto —
// assim "ford ranger raptor" vira "Ford Ranger Raptor" sem estragar
// siglas que o usuário já tenha digitado certo (ex: "GT" continua "GT").
export function capitalizarPalavras(texto) {
  if (!texto) return texto
  return texto.replace(/\b\p{L}/gu, c => c.toUpperCase())
}