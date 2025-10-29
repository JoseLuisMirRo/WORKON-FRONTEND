import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const PublicRoute = ({ children, redirectTo = '/feed' }) => {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  // Si está autenticado, redirige según el tipo de usuario
  if (isAuthenticated) {
    if (user?.type === 'employer') {
      return <Navigate to="/empleador" replace />
    }
    return <Navigate to={redirectTo} replace />
  }

  return children
}

