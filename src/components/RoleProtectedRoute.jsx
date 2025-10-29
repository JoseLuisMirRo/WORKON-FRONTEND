import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Componente para proteger rutas según el rol del usuario
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar
 * @param {string[]} props.allowedRoles - Array de roles permitidos para esta ruta
 * @param {string} [props.redirectTo] - Ruta a la que redirigir si no tiene permiso (opcional)
 */
export const RoleProtectedRoute = ({ children, allowedRoles, redirectTo }) => {
  const { user, isAuthenticated, loading } = useAuth()

  // Mostrar loader mientras verifica autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si está autenticado, verificar el rol
  const userRole = user?.role

  // Si el rol del usuario no está en los roles permitidos
  if (!allowedRoles.includes(userRole)) {
    // Redirigir a la ruta especificada o a la ruta por defecto según el rol
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />
    }

    // Redirigir a la página principal según el rol del usuario
    const defaultRedirect = userRole === 'employer' ? '/empleador' : '/feed'
    return <Navigate to={defaultRedirect} replace />
  }

  // Si tiene el rol correcto, mostrar el contenido
  return children
}

