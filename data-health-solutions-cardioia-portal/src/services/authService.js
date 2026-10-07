import usuarios from '../data/usuarios.json'

const TOKEN_KEY = 'cardioia_token'
const UMA_HORA = 60 * 60

// Base64 "url-safe" que aceita acentos (o btoa puro só aceita Latin-1)
const toBase64Url = (obj) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(obj))))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

const fromBase64Url = (str) => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes))
}

// Gera um JWT FAKE (header.payload.assinatura) — sem validade criptográfica,
// serve apenas para simular o fluxo de autenticação no front-end.
export function gerarTokenFake(usuario) {
  const agora = Math.floor(Date.now() / 1000)
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    sub: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    iat: agora,
    exp: agora + UMA_HORA,
  }
  const assinatura = toBase64Url({ fake: 'cardioia-signature' })
  return `${toBase64Url(header)}.${toBase64Url(payload)}.${assinatura}`
}

export function decodificarToken(token) {
  try {
    const [, payload] = token.split('.')
    return fromBase64Url(payload)
  } catch {
    return null
  }
}

export function tokenValido(token) {
  const payload = token && decodificarToken(token)
  return Boolean(payload && payload.exp * 1000 > Date.now())
}

// Simula a latência de uma chamada POST /login
export function login(email, senha) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuario = usuarios.find(
        (u) => u.email === email.trim().toLowerCase() && u.senha === senha,
      )
      if (!usuario) return reject(new Error('E-mail ou senha inválidos.'))
      const token = gerarTokenFake(usuario)
      localStorage.setItem(TOKEN_KEY, token)
      resolve(token)
    }, 600)
  })
}

export const lerToken = () => localStorage.getItem(TOKEN_KEY)
export const removerToken = () => localStorage.removeItem(TOKEN_KEY)
