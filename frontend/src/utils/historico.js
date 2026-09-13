const CHAVE = 'ford-ci-dev-historico'

export function obterHistorico() {
  const salvo = localStorage.getItem(CHAVE)
  return salvo ? JSON.parse(salvo) : []
}

export function salvarNoHistorico(pesquisa) {
  const historico = obterHistorico()
  historico.unshift({ ...pesquisa, id: Date.now(), data: new Date().toLocaleString('pt-BR') })
  localStorage.setItem(CHAVE, JSON.stringify(historico))
}

export function removerDoHistorico(id) {
  const historico = obterHistorico().filter(item => item.id !== id)
  localStorage.setItem(CHAVE, JSON.stringify(historico))
  return historico
}

export function limparHistorico() {
  localStorage.removeItem(CHAVE)
}