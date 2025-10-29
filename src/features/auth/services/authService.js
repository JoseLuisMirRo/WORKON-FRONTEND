// Mock data y servicios de autenticación

// Usuarios mock para desarrollo
const mockUsers = [
  {
    id: '1',
    email: 'freelancer@workon.com',
    password: 'password123',
    type: 'freelancer',
    profile: {
      name: 'Ana García',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'
    }
  },
  {
    id: '2',
    email: 'empleador@workon.com',
    password: 'password123',
    type: 'employer',
    profile: {
      name: 'TechCorp SA',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=TechCorp'
    }
  }
]

// Simular delay de red
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Iniciar sesión
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Usuario autenticado
 */
export const login = async (email, password) => {
  await delay()
  
  const user = mockUsers.find(u => u.email === email && u.password === password)
  
  if (!user) {
    throw new Error('Credenciales inválidas')
  }
  
  // Simular token JWT
  const token = `mock-jwt-token-${user.id}-${Date.now()}`
  
  // Guardar en localStorage
  localStorage.setItem('authToken', token)
  localStorage.setItem('userId', user.id)
  localStorage.setItem('userType', user.type)
  
  return {
    user: {
      id: user.id,
      email: user.email,
      type: user.type,
      profile: user.profile
    },
    token
  }
}

/**
 * Registrar nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>} Usuario registrado
 */
export const register = async (userData) => {
  await delay()
  
  // Verificar si el email ya existe
  const existingUser = mockUsers.find(u => u.email === userData.email)
  if (existingUser) {
    throw new Error('El email ya está registrado')
  }
  
  // Crear nuevo usuario
  const newUser = {
    id: `${Date.now()}`,
    email: userData.email,
    password: userData.password,
    type: userData.type,
    profile: {
      name: userData.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
    }
  }
  
  // En un sistema real, esto se guardaría en la BD
  mockUsers.push(newUser)
  
  // Simular token JWT
  const token = `mock-jwt-token-${newUser.id}-${Date.now()}`
  
  // Guardar en localStorage
  localStorage.setItem('authToken', token)
  localStorage.setItem('userId', newUser.id)
  localStorage.setItem('userType', newUser.type)
  
  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      type: newUser.type,
      profile: newUser.profile
    },
    token
  }
}

/**
 * Cerrar sesión
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await delay(300)
  
  localStorage.removeItem('authToken')
  localStorage.removeItem('userId')
  localStorage.removeItem('userType')
}

/**
 * Obtener usuario actual
 * @returns {Promise<Object|null>} Usuario autenticado o null
 */
export const getCurrentUser = async () => {
  await delay(300)
  
  const token = localStorage.getItem('authToken')
  const userId = localStorage.getItem('userId')
  const userType = localStorage.getItem('userType')
  
  if (!token || !userId) {
    return null
  }
  
  const user = mockUsers.find(u => u.id === userId)
  
  if (!user) {
    return null
  }
  
  return {
    user: {
      id: user.id,
      email: user.email,
      type: userType,
      profile: user.profile
    },
    token
  }
}

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken')
}

/**
 * Obtener tipo de usuario
 * @returns {string|null}
 */
export const getUserType = () => {
  return localStorage.getItem('userType')
}

/**
 * Restablecer contraseña
 * @param {string} email - Email del usuario
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  await delay()
  
  const user = mockUsers.find(u => u.email === email)
  
  if (!user) {
    throw new Error('No existe una cuenta con ese email')
  }
  
  // En un sistema real, aquí se enviaría un email
  console.log(`Email de recuperación enviado a: ${email}`)
  
  return {
    message: 'Se ha enviado un enlace de recuperación a tu email'
  }
}

