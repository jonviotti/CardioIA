export function lerJSON(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave)
    return valor ? JSON.parse(valor) : padrao
  } catch {
    return padrao
  }
}

export function salvarJSON(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor))
}
