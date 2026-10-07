import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const salvo = authService.lerToken()
    return authService.tokenValido(salvo) ? salvo : null
  })

  const usuario = useMemo(() => (token ? authService.decodificarToken(token) : null), [token])

  const login = useCallback(async (email, senha) => {
    const novoToken = await authService.login(email, senha)
    setToken(novoToken)
  }, [])

  const logout = useCallback(() => {
    authService.removerToken()
    setToken(null)
  }, [])

  // Encerra a sessão automaticamente quando o JWT fake expira
  useEffect(() => {
    if (!usuario) return
    const restante = usuario.exp * 1000 - Date.now()
    const timer = setTimeout(logout, Math.max(restante, 0))
    return () => clearTimeout(timer)
  }, [usuario, logout])

  const valor = useMemo(
    () => ({ token, usuario, autenticado: Boolean(token), login, logout }),
    [token, usuario, login, logout],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
