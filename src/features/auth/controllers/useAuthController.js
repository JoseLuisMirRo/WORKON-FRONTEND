import { useState } from 'react'
import * as authService from '../services/authService'

/**
 * Controller para manejar la lógica de autenticación
 * @returns {Object} Estado y funciones
 */
export const useAuthController = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const result = await authService.login(email, password)
      setUser(result.user)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      const result = await authService.register(userData)
      setUser(result.user)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      await authService.logout()
      setUser(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async () => {
    try {
      setLoading(true)
      const result = await authService.getCurrentUser()
      if (result) {
        setUser(result.user)
      }
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)
      const result = await authService.resetPassword(email)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    checkAuth,
    handleResetPassword,
    isAuthenticated: authService.isAuthenticated(),
    userType: authService.getUserType()
  }
}

