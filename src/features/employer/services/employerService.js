// Mock data para empleador
const mockEmployerProfile = {
  id: "emp-1",
  name: "TechCorp SA",
  avatar: "/placeholder.svg?height=128&width=128",
  verified: true,
  companySize: "50-200",
  industry: "Tecnología",
  founded: "2018",
  location: "Ciudad de México, México",
  website: "https://techcorp.example.com",
  description: "Somos una empresa de desarrollo de software especializada en soluciones blockchain y aplicaciones descentralizadas.",
  rating: 4.8,
  reviewsCount: 156,
  jobsPosted: 48,
  jobsCompleted: 42,
  successRate: 87.5,
  totalSpent: 156000,
  memberSince: "2020",
  socialLinks: {
    linkedin: "https://linkedin.com/company/techcorp",
    twitter: "https://twitter.com/techcorp",
    github: "https://github.com/techcorp"
  }
}

const mockPostedJobs = [
  {
    id: "job-1",
    title: "Desarrollador Full Stack Senior",
    description: "Buscamos un desarrollador full stack con experiencia en React y Node.js para proyecto de 3 meses.",
    category: "Desarrollo",
    budget: 3500,
    urgency: "alta",
    status: "activo", // activo, cerrado, completado, cancelado
    applicants: 12,
    views: 234,
    createdAt: "2025-01-20T10:00:00",
    deadline: "2025-04-20",
    skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    proposals: [
      {
        id: "prop-1",
        freelancerId: "fr-1",
        freelancerName: "Juan Pérez",
        freelancerAvatar: "/placeholder.svg",
        freelancerRating: 4.9,
        proposedBudget: 3200,
        estimatedDays: 90,
        coverLetter: "Hola, tengo más de 5 años de experiencia...",
        status: "pendiente" // pendiente, aceptada, rechazada
      }
    ]
  },
  {
    id: "job-2",
    title: "Diseñador UI/UX",
    description: "Necesitamos diseñar la interfaz completa de una aplicación móvil de finanzas.",
    category: "Diseño",
    budget: 1800,
    urgency: "media",
    status: "activo",
    applicants: 8,
    views: 156,
    createdAt: "2025-01-25T14:30:00",
    deadline: "2025-03-15",
    skills: ["Figma", "UI/UX", "Mobile Design", "Prototyping"]
  }
]

/**
 * Obtiene el perfil del empleador
 * @returns {Promise<Object>} Perfil del empleador
 */
export const fetchEmployerProfile = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockEmployerProfile
}

/**
 * Actualiza el perfil del empleador
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<Object>} Perfil actualizado
 */
export const updateEmployerProfile = async (updates) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('Perfil actualizado:', updates)
  return { ...mockEmployerProfile, ...updates }
}

/**
 * Obtiene los trabajos publicados por el empleador
 * @param {string} status - Filtro por estado
 * @returns {Promise<Array>} Lista de trabajos
 */
export const fetchPostedJobs = async (status = 'all') => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (status === 'all') {
    return mockPostedJobs
  }
  
  return mockPostedJobs.filter(job => job.status === status)
}

/**
 * Crea un nuevo trabajo
 * @param {Object} jobData - Datos del trabajo
 * @returns {Promise<Object>} Trabajo creado
 */
export const createJob = async (jobData) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const newJob = {
    id: `job-${Date.now()}`,
    ...jobData,
    status: 'activo',
    applicants: 0,
    views: 0,
    createdAt: new Date().toISOString(),
    proposals: []
  }
  
  console.log('Trabajo creado:', newJob)
  return newJob
}

/**
 * Actualiza un trabajo existente
 * @param {string} jobId - ID del trabajo
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<Object>} Trabajo actualizado
 */
export const updateJob = async (jobId, updates) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log(`Trabajo ${jobId} actualizado:`, updates)
  return { id: jobId, ...updates }
}

/**
 * Elimina un trabajo
 * @param {string} jobId - ID del trabajo
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const deleteJob = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log(`Trabajo ${jobId} eliminado`)
  return true
}

/**
 * Obtiene las propuestas de un trabajo
 * @param {string} jobId - ID del trabajo
 * @returns {Promise<Array>} Lista de propuestas
 */
export const fetchJobProposals = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const job = mockPostedJobs.find(j => j.id === jobId)
  return job?.proposals || []
}

/**
 * Acepta una propuesta
 * @param {string} jobId - ID del trabajo
 * @param {string} proposalId - ID de la propuesta
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const acceptProposal = async (jobId, proposalId) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log(`Propuesta ${proposalId} del trabajo ${jobId} aceptada`)
  return true
}

/**
 * Rechaza una propuesta
 * @param {string} jobId - ID del trabajo
 * @param {string} proposalId - ID de la propuesta
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const rejectProposal = async (jobId, proposalId) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log(`Propuesta ${proposalId} del trabajo ${jobId} rechazada`)
  return true
}

/**
 * Obtiene estadísticas del empleador
 * @returns {Promise<Object>} Estadísticas
 */
export const fetchEmployerStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    activeJobs: mockPostedJobs.filter(j => j.status === 'activo').length,
    totalApplicants: mockPostedJobs.reduce((sum, job) => sum + job.applicants, 0),
    completedJobs: mockPostedJobs.filter(j => j.status === 'completado').length,
    totalSpent: mockEmployerProfile.totalSpent,
    avgResponseTime: "2 horas",
    successRate: mockEmployerProfile.successRate
  }
}

