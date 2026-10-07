import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Redireciona para /login quem não está autenticado, guardando a rota de origem
export default function ProtectedRoute({ children }) {
  const { autenticado } = useAuth()
  const location = useLocation()

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}
