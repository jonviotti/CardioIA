import { createContext, useContext, useEffect, useReducer } from 'react'
import { lerJSON, salvarJSON } from '../services/storage'

const STORAGE_KEY = 'cardioia_consultas'
const AppointmentsContext = createContext(null)

export const ACOES = {
  AGENDAR: 'AGENDAR',
  CANCELAR: 'CANCELAR',
  CONCLUIR: 'CONCLUIR',
}

export function consultasReducer(estado, acao) {
  switch (acao.type) {
    case ACOES.AGENDAR:
      return [...estado, { ...acao.payload, id: crypto.randomUUID(), status: 'agendada' }]
    case ACOES.CANCELAR:
      return estado.map((c) => (c.id === acao.id ? { ...c, status: 'cancelada' } : c))
    case ACOES.CONCLUIR:
      return estado.map((c) => (c.id === acao.id ? { ...c, status: 'concluida' } : c))
    default:
      throw new Error(`Ação desconhecida: ${acao.type}`)
  }
}

export function AppointmentsProvider({ children }) {
  // O terceiro argumento (init) carrega as consultas salvas no localStorage
  const [consultas, dispatch] = useReducer(consultasReducer, [], () => lerJSON(STORAGE_KEY, []))

  useEffect(() => {
    salvarJSON(STORAGE_KEY, consultas)
  }, [consultas])

  return (
    <AppointmentsContext.Provider value={{ consultas, dispatch }}>
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext)
  if (!ctx) throw new Error('useAppointments deve ser usado dentro de <AppointmentsProvider>')
  return ctx
}
