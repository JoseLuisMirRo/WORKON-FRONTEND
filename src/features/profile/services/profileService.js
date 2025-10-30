import { supabase } from '../../../lib/supabaseClient'

/**
 * Helper: Get initials from full name or email
 * @param {string} fullName - Full name
 * @param {string} email - Email address
 * @returns {string} Initials (e.g., "AB")
 */
export const getInitials = (fullName, email) => {
  const safe = (s) => (typeof s === 'string' ? s.trim() : '')
  const name = safe(fullName)
  
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    if (parts.length === 1 && parts[0].length >= 2) return (parts[0][0] + parts[0][1]).toUpperCase()
    if (parts.length === 1) return parts[0][0].toUpperCase()
  }
  
  const mail = safe(email)
  if (mail) {
    const local = mail.split('@')[0] || ''
    if (local.length >= 2) return (local[0] + local[1]).toUpperCase()
    if (local.length === 1) return local[0].toUpperCase()
  }
  
  return '??'
}

/**
 * Normalize profile data from database
 * @param {Object} row - Raw database row
 * @returns {Object} Normalized profile
 */
const normalizeProfile = (row) => {
  if (!row) return null
  
  return {
    id: row.id || '',
    role: row.role || 'freelancer',
    full_name: row.full_name || '',
    email: row.email || '',
    wallet_address: row.wallet_address || '',
    rating: typeof row.rating === 'number' ? row.rating : 0,
    bio: row.bio || '',
    portfolio_summary: row.portfolio_summary || '',
    created_at: row.created_at || '',
    updated_at: row.updated_at || '',
  }
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} Current user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Ensure profile exists for user, create if missing
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success
 */
export const ensureProfileExists = async (userId) => {
  try {
    const { data: existing, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (existing) return true
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('Error getting user for profile creation:', userError)
      return false
    }
    
    const { error: createError } = await supabase
      .from('profiles')
      .insert([{
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email,
        role: user.user_metadata?.role || 'freelancer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
    
    if (createError) {
      console.error('Error creating profile:', createError)
      return false
    }
    
    console.log('✅ Profile created for:', user.email)
    return true
  } catch (error) {
    console.error('Error in ensureProfileExists:', error)
    return false
  }
}

/**
 * Get my profile (current user)
 * @returns {Promise<Object|null>} Profile data
 */
export const getMyProfile = async () => {
  try {
    const user = await getCurrentUser()
    if (!user) return null
    
    await ensureProfileExists(user.id)
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, full_name, email, wallet_address, rating, bio, portfolio_summary, created_at, updated_at')
      .eq('id', user.id)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    
    return normalizeProfile(data)
  } catch (error) {
    console.error('Error in getMyProfile:', error)
    return null
  }
}

/**
 * Get complete freelancer profile with nested data (areas, portfolio, work history)
 * Uses PostgREST nested queries for efficient data fetching
 * @returns {Promise<{ok: boolean, data?: Object, error?: Object}>}
 */
export const getMyFreelancerProfileDeep = async () => {
  try {
    const user = await getCurrentUser()
    if (!user) return { ok: false, error: { code: 'NO_AUTH', message: 'Not authenticated' } }
    
    await ensureProfileExists(user.id)
    
    // Nested SELECT with joins (PostgREST syntax)
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, role, full_name, email, wallet_address, rating, bio, portfolio_summary, created_at, updated_at,

        profile_areas (
          area_id,
          areas ( id, name )
        ),

        portfolio_entries (
          id, title, description, created_at,
          portfolio_files ( id, storage_path, mime_type, uploaded_at )
        ),

        work_history (
          id, title, description, finished_at, project_status, proposal_id, created_at
        )
      `)
      .eq('id', user.id)
      .single()
    
    if (error) {
      console.error('Error fetching deep profile:', error)
      return { ok: false, error: { code: error.code, message: error.message } }
    }
    
    // Normalize nested data for UI
    const areas = (data.profile_areas || [])
      .map(pa => pa.areas?.name)
      .filter(Boolean)
    
    const portfolio = (data.portfolio_entries || []).map(entry => {
      const files = entry.portfolio_files || []
      const coverFile = files.find(f => (f.mime_type || '').startsWith('image/'))
      
      return {
        id: entry.id,
        title: entry.title,
        description: entry.description,
        created_at: entry.created_at,
        files,
        cover_path: coverFile?.storage_path || null
      }
    })
    
    return {
      ok: true,
      data: {
        id: data.id,
        role: data.role,
        full_name: data.full_name,
        email: data.email,
        wallet_address: data.wallet_address,
        rating: Number(data.rating ?? 0),
        bio: data.bio || '',
        portfolio_summary: data.portfolio_summary || '',
        created_at: data.created_at,
        updated_at: data.updated_at,
        areas,              // ['Web3', 'Data', ...]
        portfolio,          // entries with files and cover_path
        work_history: data.work_history || []
      }
    }
  } catch (e) {
    console.error('Error in getMyFreelancerProfileDeep:', e)
    return { ok: false, error: { code: 'UNKNOWN', message: String(e) } }
  }
}

/**
 * Get signed URL for storage file (if bucket is private)
 * @param {string} path - Storage path
 * @param {number} expiresIn - Expiration in seconds (default 3600)
 * @returns {Promise<{ok: boolean, data?: string, error?: Object}>}
 */
export const getSignedUrlForFile = async (path, expiresIn = 3600) => {
  try {
    if (!path) return { ok: true, data: null }
    
    const { data, error } = await supabase
      .storage
      .from('portfolios')
      .createSignedUrl(path, expiresIn)
    
    if (error) return { ok: false, error: { code: error.code, message: error.message } }
    return { ok: true, data: data?.signedUrl || null }
  } catch (e) {
    return { ok: false, error: { code: 'UNKNOWN', message: String(e) } }
  }
}

/**
 * Update my profile (allow-list: full_name, wallet_address, bio, portfolio_summary)
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} Updated profile
 */
export const updateMyProfile = async (updates) => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('No authenticated user')
    
    // Allow-list
    const allowedFields = ['full_name', 'wallet_address', 'bio', 'portfolio_summary']
    const safeUpdates = {}
    
    allowedFields.forEach(field => {
      if (updates.hasOwnProperty(field)) {
        safeUpdates[field] = updates[field]
      }
    })
    
    safeUpdates.updated_at = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('profiles')
      .update(safeUpdates)
      .eq('id', user.id)
      .select('id, role, full_name, email, wallet_address, rating, bio, portfolio_summary, created_at, updated_at')
      .single()
    
    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }
    
    console.log('✅ Profile updated:', safeUpdates)
    return normalizeProfile(data)
  } catch (error) {
    console.error('Error in updateMyProfile:', error)
    throw error
  }
}

// ============================================
// MOCK DATA (kept for backwards compatibility with sections that aren't migrated yet)
// ============================================

// Perfil de Freelancer (legacy mock)
const mockFreelancerProfile = {
  id: "fr-1",
  type: "freelancer",
  firstName: "Juan",
  lastName: "Desarrollador",
  email: "juan@ejemplo.com",
  phone: "+52 123 456 7890",
  avatar: "/placeholder.svg?height=200&width=200",
  title: "Full Stack Developer & Blockchain Specialist",
  bio: "Desarrollador full stack con más de 5 años de experiencia en React, Node.js y tecnologías blockchain. Especializado en crear aplicaciones descentralizadas y contratos inteligentes en Stellar.",
  location: "Ciudad de México, México",
  timezone: "UTC-6",
  hourlyRate: 45,
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado" }
  ],
  skills: [
    { name: "React", level: 95 },
    { name: "Node.js", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Solidity", level: 80 },
    { name: "Stellar", level: 75 },
    { name: "MongoDB", level: 85 },
    { name: "Docker", level: 70 }
  ],
  experience: [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      company: "TechCorp",
      location: "Remote",
      startDate: "2021-03",
      endDate: "Presente",
      description: "Desarrollo de aplicaciones web y móviles utilizando React, Node.js y tecnologías blockchain. Lideré un equipo de 5 desarrolladores en la implementación de soluciones DeFi en Stellar. Implementé arquitecturas escalables que mejoraron el rendimiento en un 60%.",
      skills: ["React", "Node.js", "Stellar", "Smart Contracts", "TypeScript", "MongoDB"]
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Ciudad de México",
      startDate: "2019-06",
      endDate: "2021-02",
      description: "Desarrollo de plataforma de e-commerce con integración de pagos. Implementé sistema de pagos con Stripe y PayPal, creé API RESTful para el backend y desarrollé el frontend con React.",
      skills: ["React", "Node.js", "Express", "PostgreSQL", "Stripe", "AWS"]
    }
  ],
  education: [
    {
      id: 1,
      degree: "Ingeniería en Sistemas Computacionales",
      institution: "Universidad Nacional",
      startDate: "2014",
      endDate: "2018"
    }
  ],
  certifications: [
    {
      id: 1,
      name: "Certified Blockchain Developer",
      issuer: "Blockchain Council",
      date: "2022-06"
    },
    {
      id: 2,
      name: "AWS Solutions Architect",
      issuer: "Amazon",
      date: "2021-09"
    }
  ],
  portfolio: [
    {
      id: 1,
      title: "DeFi Dashboard",
      description: "Dashboard para visualizar activos en múltiples blockchains",
      image: "/placeholder.svg?height=300&width=400",
      url: "https://example.com/project1",
      tags: ["React", "Web3", "Stellar"]
    },
    {
      id: 2,
      title: "NFT Marketplace",
      description: "Marketplace descentralizado para NFTs",
      image: "/placeholder.svg?height=300&width=400",
      url: "https://example.com/project2",
      tags: ["Next.js", "Solidity", "IPFS"]
    }
  ],
  socialLinks: {
    github: "https://github.com/juandev",
    linkedin: "https://linkedin.com/in/juandev",
    twitter: "https://twitter.com/juandev",
    website: "https://juandev.com"
  },
  workInterests: {
    categories: ['Desarrollo Web', 'Blockchain', 'Smart Contracts', 'DApps'],
    projectTypes: ['Proyecto Completo', 'Consultoría', 'Soporte Técnico'],
    workArrangement: ['Remoto', 'Tiempo Completo', 'Tiempo Parcial'],
    preferredIndustries: ['Fintech', 'Tecnología', 'Startups', 'Criptomonedas'],
    projectSize: 'Mediano a Grande',
    budgetRange: '$5,000 - $20,000',
    availability: '40 hrs/semana',
    commitment: 'Largo plazo preferido'
  },
  stats: {
    rating: 4.9,
    reviews: 87,
    jobsCompleted: 142,
    successRate: 98,
    responseTime: "2 horas",
    memberSince: "2020"
  },
  verified: true,
  available: true
}

// Perfil de Empleador
const mockEmployerProfile = {
  id: "emp-1",
  type: "employer",
  companyName: "TechCorp SA",
  email: "contact@techcorp.com",
  phone: "+52 555 123 4567",
  avatar: "/placeholder.svg?height=200&width=200",
  industry: "Tecnología",
  companySize: "50-200",
  founded: "2018",
  website: "https://techcorp.example.com",
  description: "Somos una empresa de desarrollo de software especializada en soluciones blockchain y aplicaciones descentralizadas. Ayudamos a empresas a transformar sus negocios con tecnología innovadora.",
  location: "Ciudad de México, México",
  headquarters: "Polanco, CDMX",
  socialLinks: {
    linkedin: "https://linkedin.com/company/techcorp",
    twitter: "https://twitter.com/techcorp",
    facebook: "https://facebook.com/techcorp",
    instagram: "https://instagram.com/techcorp"
  },
  benefits: [
    "Pagos puntuales",
    "Proyectos desafiantes",
    "Ambiente colaborativo",
    "Flexibilidad horaria",
    "Oportunidades de crecimiento"
  ],
  techStack: ["React", "Node.js", "Python", "AWS", "Stellar", "Docker"],
  stats: {
    rating: 4.8,
    reviews: 156,
    jobsPosted: 48,
    jobsCompleted: 42,
    successRate: 87.5,
    totalSpent: 156000,
    avgResponseTime: "2 horas",
    memberSince: "2020"
  },
  verified: true
}

/**
 * Obtiene el perfil del freelancer
 * @deprecated Use getMyFreelancerProfileDeep() instead for real data
 * @returns {Promise<Object>} Perfil del freelancer
 */
export const fetchFreelancerProfile = async () => {
  const dbProfile = await getMyProfile()
  if (!dbProfile) return null
  
  return {
    id: dbProfile.id,
    type: 'freelancer',
    role: dbProfile.role,
    email: dbProfile.email,
    full_name: dbProfile.full_name,
    bio: dbProfile.bio,
    wallet_address: dbProfile.wallet_address,
    rating: dbProfile.rating,
    portfolio_summary: dbProfile.portfolio_summary,
    created_at: dbProfile.created_at,
    updated_at: dbProfile.updated_at
  }
}

/**
 * Actualiza el perfil del freelancer
 * @deprecated Use updateMyProfile() directly
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<Object>} Perfil actualizado
 */
export const updateFreelancerProfile = async (updates) => {
  const dbUpdates = {}
  if (updates.full_name) dbUpdates.full_name = updates.full_name
  if (updates.bio) dbUpdates.bio = updates.bio
  if (updates.wallet_address) dbUpdates.wallet_address = updates.wallet_address
  if (updates.portfolio_summary) dbUpdates.portfolio_summary = updates.portfolio_summary
  
  const updated = await updateMyProfile(dbUpdates)
  return fetchFreelancerProfile()
}

/**
 * Obtiene el perfil del empleador (uses real Supabase data + mock extensions)
 * @returns {Promise<Object>} Perfil del empleador
 */
export const fetchEmployerProfile = async () => {
  const dbProfile = await getMyProfile()
  if (!dbProfile) return mockEmployerProfile
  
  // Merge DB data with mock data structure for UI compatibility
  return {
    ...mockEmployerProfile,
    id: dbProfile.id,
    type: 'employer',
    email: dbProfile.email,
    companyName: dbProfile.full_name,
    description: dbProfile.bio,
    wallet_address: dbProfile.wallet_address,
    rating: dbProfile.rating,
  }
}

/**
 * Actualiza el perfil del empleador
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<Object>} Perfil actualizado
 */
export const updateEmployerProfile = async (updates) => {
  const dbUpdates = {}
  if (updates.companyName) dbUpdates.full_name = updates.companyName
  if (updates.description) dbUpdates.bio = updates.description
  if (updates.industry) dbUpdates.portfolio_summary = updates.industry
  if (updates.wallet_address) dbUpdates.wallet_address = updates.wallet_address
  
  const updated = await updateMyProfile(dbUpdates)
  return fetchEmployerProfile()
}

/**
 * Sube una imagen de avatar
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} URL de la imagen
 */
export const uploadAvatar = async (file) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('Avatar subido:', file.name)
  // Simular URL de imagen subida
  return `/placeholder.svg?height=200&width=200&name=${file.name}`
}

/**
 * Agrega un skill al perfil
 * @param {Object} skill - Skill a agregar
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const addSkill = async (skill) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log('Skill agregado:', skill)
  return true
}

/**
 * Elimina un skill del perfil
 * @param {string} skillName - Nombre del skill a eliminar
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const removeSkill = async (skillName) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log('Skill eliminado:', skillName)
  return true
}

/**
 * Agrega experiencia laboral
 * @param {Object} experience - Experiencia a agregar
 * @returns {Promise<Object>} Experiencia agregada con ID
 */
export const addExperience = async (experience) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const newExperience = { ...experience, id: Date.now() }
  console.log('Experiencia agregada:', newExperience)
  return newExperience
}

/**
 * Elimina experiencia laboral
 * @param {number} experienceId - ID de la experiencia
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const removeExperience = async (experienceId) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log('Experiencia eliminada:', experienceId)
  return true
}

/**
 * Agrega educación
 * @param {Object} education - Educación a agregar
 * @returns {Promise<Object>} Educación agregada con ID
 */
export const addEducation = async (education) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const newEducation = { ...education, id: Date.now() }
  console.log('Educación agregada:', newEducation)
  return newEducation
}

/**
 * Elimina educación
 * @param {number} educationId - ID de la educación
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const removeEducation = async (educationId) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log('Educación eliminada:', educationId)
  return true
}

// ============================================================================
// EMPLOYER-SPECIFIC FUNCTIONS (Real Supabase Data)
// ============================================================================

const ok = (data) => ({ ok: true, data })
const fail = (error) => ({ 
  ok: false, 
  error: { 
    code: error?.code || 'UNKNOWN', 
    message: error?.message || String(error) 
  } 
})

const PROFILE_COLS = 'id, role, full_name, email, wallet_address, rating, bio, portfolio_summary, created_at, updated_at'

/**
 * Get employer profile by ID (for public/internal view)
 * @param {string} employerId - Employer UUID
 * @returns {Promise<{ok: boolean, data?: Object, error?: Object}>}
 */
export const getEmployerProfileById = async (employerId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_COLS)
      .eq('id', employerId)
      .eq('role', 'employer')
      .single()
    
    if (error) return fail(error)
    return ok(data)
  } catch (e) {
    return fail(e)
  }
}

/**
 * Get current authenticated user's employer profile
 * @returns {Promise<{ok: boolean, data?: Object, error?: Object}>}
 */
export const getMyEmployerProfile = async () => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      return fail(authError || new Error('Not authenticated'))
    }
    
    const userId = authData.user.id
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_COLS)
      .eq('id', userId)
      .eq('role', 'employer')
      .single()
    
    if (error) return fail(error)
    return ok(data)
  } catch (e) {
    return fail(e)
  }
}

/**
 * Fetch all proposals posted by an employer
 * @param {string} employerId - Employer UUID
 * @returns {Promise<{ok: boolean, data?: Array, error?: Object}>}
 */
export const fetchEmployerProposals = async (employerId) => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('id, title, description, total_payment, status, created_at, updated_at, tags')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false })
    
    if (error) return fail(error)
    return ok(data || [])
  } catch (e) {
    return fail(e)
  }
}

/**
 * Compute employer statistics from proposals table
 * @param {string} employerId - Employer UUID
 * @returns {Promise<{ok: boolean, data?: Object, error?: Object}>}
 */
export const computeEmployerStats = async (employerId) => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('status, total_payment')
      .eq('employer_id', employerId)
    
    if (error) return fail(error)
    
    const rows = data || []
    const total = rows.length
    const published = rows.filter(r => r.status === 'publicada').length
    const inProgress = rows.filter(r => 
      r.status === 'en_progreso' || r.status === 'in_progress'
    ).length
    const completed = rows.filter(r => 
      r.status === 'completada' || r.status === 'completed'
    ).length
    const totalSpent = rows
      .filter(r => r.status === 'completada' || r.status === 'completed')
      .reduce((sum, r) => sum + (Number(r.total_payment) || 0), 0)
    
    return ok({
      proposalsTotal: total,
      proposalsPublished: published,
      proposalsInProgress: inProgress,
      proposalsCompleted: completed,
      totalSpent
    })
  } catch (e) {
    return fail(e)
  }
}

