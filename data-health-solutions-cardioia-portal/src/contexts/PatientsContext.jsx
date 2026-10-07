import { createContext, useContext, useEffect, useState } from 'react'
import { listarPacientes } from '../services/patientService'

const PatientsContext = createContext(null)

export function PatientsProvider({ children }) {
  const [pacientes, setPacientes] = useState([])
  const [fonte, setFonte] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    listarPacientes({ signal: controller.signal })
      .then((resultado) => {
        setPacientes(resultado.pacientes)
        setFonte(resultado.fonte)
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setErro('Não foi possível carregar os pacientes.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false)
      })
    return () => controller.abort()
  }, [])

  return (
    <PatientsContext.Provider value={{ pacientes, fonte, carregando, erro }}>
      {children}
    </PatientsContext.Provider>
  )
}

export function usePatients() {
  const ctx = useContext(PatientsContext)
  if (!ctx) throw new Error('usePatients deve ser usado dentro de <PatientsProvider>')
  return ctx
}
