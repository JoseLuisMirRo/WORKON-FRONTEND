// Servicio de autenticación con Supabase
import { supabase } from '../../../lib/supabaseClient'

/**
 * Iniciar sesión
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Usuario autenticado
 */
export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Obtener el perfil del usuario desde la tabla profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.warn('No se pudo obtener el perfil:', profileError)
    }

    // Guardar información en localStorage para compatibilidad
    localStorage.setItem('authToken', data.session.access_token)
    localStorage.setItem('userId', data.user.id)
    localStorage.setItem('userRole', profile?.role || 'freelancer')

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role || 'freelancer',
        profile: profile || {
          full_name: data.user.user_metadata?.name || data.user.email,
          email: data.user.email,
          avatar_url: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
        },
      },
      token: data.session.access_token,
    }
  } catch (error) {
    console.error('Error en login:', error)
    throw new Error(error.message || 'Error al iniciar sesión')
  }
}

/**
 * Registrar nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>} Usuario registrado
 */
export const register = async (userData) => {
  try {
    // Registrar usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.name,
          role: userData.role,
        },
      },
    })

    if (error) throw error

    // Crear perfil en la tabla profiles
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: userData.email,
          full_name: userData.name,
          role: userData.role,
          wallet_address: userData.wallet_address || null,
        },
      ])

      if (profileError) {
        console.error('Error al crear perfil:', profileError)
      }
    }

    // Guardar información en localStorage
    if (data.session) {
      localStorage.setItem('authToken', data.session.access_token)
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('userRole', userData.role)
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userData.role,
        profile: {
          full_name: userData.name,
          email: userData.email,
        },
      },
      token: data.session?.access_token,
    }
  } catch (error) {
    console.error('Error en register:', error)
    throw new Error(error.message || 'Error al registrar usuario')
  }
}

/**
 * Cerrar sesión
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
  } catch (error) {
    console.error('Error en logout:', error)
    throw new Error(error.message || 'Error al cerrar sesión')
  }
}

/**
 * Obtener usuario actual
 * @returns {Promise<Object|null>} Usuario autenticado o null
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) return null

    // Obtener el perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.warn('No se pudo obtener el perfil:', profileError)
    }

    // Obtener la sesión actual
    const { data: { session } } = await supabase.auth.getSession()

    return {
      user: {
        id: user.id,
        email: user.email,
        role: profile?.role || localStorage.getItem('userRole') || 'freelancer',
        profile: profile || {
          full_name: user.user_metadata?.full_name || user.email,
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        },
      },
      token: session?.access_token,
    }
  } catch (error) {
    console.error('Error al obtener usuario actual:', error)
    return null
  }
}

/**
 * Verificar si el usuario está autenticado
 * @returns {Promise<boolean>}
 */
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

/**
 * Obtener rol de usuario (síncrono para compatibilidad)
 * @returns {string|null}
 */
export const getUserRole = () => {
  return localStorage.getItem('userRole')
}

/**
 * Restablecer contraseña
 * @param {string} email - Email del usuario
 * @returns {Promise<Object>}
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error

    return {
      message: 'Se ha enviado un enlace de recuperación a tu email',
    }
  } catch (error) {
    console.error('Error en resetPassword:', error)
    throw new Error(error.message || 'Error al restablecer contraseña')
  }
}

/**
 * Actualizar contraseña
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<Object>}
 */
export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    return {
      message: 'Contraseña actualizada exitosamente',
    }
  } catch (error) {
    console.error('Error al actualizar contraseña:', error)
    throw new Error(error.message || 'Error al actualizar contraseña')
  }
}

/**
 * Iniciar sesión con proveedor OAuth (Google, GitHub, etc.)
 * @param {string} provider - Nombre del proveedor ('google', 'github', etc.)
 * @returns {Promise<Object>}
 */
export const signInWithProvider = async (provider) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error en signInWithProvider:', error)
    throw new Error(error.message || 'Error al iniciar sesión con proveedor')
  }
}
