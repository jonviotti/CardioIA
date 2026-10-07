import pacientesLocais from '../data/pacientes.json'

const API_URL = 'https://jsonplaceholder.typicode.com/users'
const TIMEOUT_MS = 5000

// Busca usuários na API fake (JSONPlaceholder) e combina com os dados
// clínicos simulados da Fase 2 (relatos do Estetoscópio Digital).
// Se a API estiver fora do ar ou demorar mais de 5s, usa somente a base local.
export async function listarPacientes({ signal } = {}) {
  try {
    const resposta = await fetch(API_URL, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)].filter(Boolean)),
    })
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
    const usuarios = await resposta.json()

    const pacientes = pacientesLocais.map((clinico, i) => {
      const u = usuarios[i]
      if (!u) return clinico
      return {
        ...clinico,
        nome: u.name,
        email: u.email.toLowerCase(),
        telefone: u.phone.split(' ')[0],
        cidade: u.address?.city ?? clinico.cidade,
      }
    })
    return { pacientes, fonte: 'JSONPlaceholder + base clínica local' }
  } catch (erro) {
    // Cancelamento pelo componente: repassa. Timeout/erro de rede: fallback.
    if (signal?.aborted) throw erro
    return { pacientes: pacientesLocais, fonte: 'Base local (API indisponível)' }
  }
}
