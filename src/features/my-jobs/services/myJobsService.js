// Mock data para mis trabajos
const mockMyJobs = [
  {
    id: "1",
    title: "Desarrollador Full Stack Senior",
    company: "TechCorp SA",
    companyLogo: "/tech-company-logo.jpg",
    budget: "1,200 USDC",
    status: "in_progress", // applied, in_progress, completed, cancelled
    progress: 65,
    appliedDate: "2025-01-15",
    startDate: "2025-01-20",
    deadline: "2025-02-28",
    description: "Desarrollo de plataforma e-commerce con integración de pagos.",
    deliverables: [
      { id: 1, name: "Diseño de arquitectura", completed: true },
      { id: 2, name: "Backend API", completed: true },
      { id: 3, name: "Frontend UI", completed: false },
      { id: 4, name: "Integración de pagos", completed: false },
    ],
    skills: ["Next.js", "React", "Node.js", "TypeScript"],
    messages: 12,
  },
  {
    id: "2",
    title: "Diseñador UI/UX para App Mobile",
    company: "DesignHub Studio",
    companyLogo: "/design-studio-logo.png",
    budget: "800 USDC",
    status: "completed",
    progress: 100,
    appliedDate: "2025-01-05",
    startDate: "2025-01-08",
    completedDate: "2025-01-25",
    deadline: "2025-01-30",
    description: "Diseño completo de una app de fitness.",
    rating: 5,
    review: "Excelente trabajo, muy profesional y cumplió con todos los requerimientos.",
    skills: ["Figma", "UI/UX", "Mobile Design"],
    messages: 8,
  },
  {
    id: "3",
    title: "Desarrollador Blockchain Soroban",
    company: "StartupXYZ",
    companyLogo: "/abstract-startup-logo.png",
    budget: "2,000 USDC",
    status: "applied",
    progress: 0,
    appliedDate: "2025-01-28",
    description: "Implementar smart contracts de marketplace.",
    skills: ["Soroban", "Rust", "Stellar"],
    messages: 2,
  },
  {
    id: "4",
    title: "Content Writer & SEO Specialist",
    company: "Marketing Pro Agency",
    companyLogo: "/marketing-agency-logo.png",
    budget: "600 USDC",
    status: "in_progress",
    progress: 30,
    appliedDate: "2025-01-10",
    startDate: "2025-01-15",
    deadline: "2025-03-15",
    description: "Crear contenido y optimizar SEO.",
    deliverables: [
      { id: 1, name: "Artículos de blog (10)", completed: true },
      { id: 2, name: "Landing pages (5)", completed: false },
      { id: 3, name: "Estrategia SEO", completed: false },
    ],
    skills: ["SEO", "Content Writing", "Copywriting"],
    messages: 5,
  },
]

const statusLabels = {
  applied: "Aplicado",
  in_progress: "En Progreso",
  completed: "Completado",
  cancelled: "Cancelado",
}

/**
 * Obtiene todos los trabajos del usuario
 * @param {string} filter - Filtro por status
 * @returns {Promise<Array>} Lista de trabajos
 */
export const fetchMyJobs = async (filter = 'all') => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (filter === 'all') {
    return mockMyJobs
  }
  
  return mockMyJobs.filter(job => job.status === filter)
}

/**
 * Obtiene un trabajo específico por ID
 * @param {string} jobId - ID del trabajo
 * @returns {Promise<Object>} Detalles del trabajo
 */
export const fetchJobDetails = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockMyJobs.find(job => job.id === jobId)
}

/**
 * Actualiza el progreso de un deliverable
 * @param {string} jobId - ID del trabajo
 * @param {number} deliverableId - ID del deliverable
 * @param {boolean} completed - Estado completado
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const updateDeliverable = async (jobId, deliverableId, completed) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log(`Deliverable ${deliverableId} del trabajo ${jobId} marcado como ${completed ? 'completado' : 'pendiente'}`)
  return true
}

/**
 * Obtiene estadísticas del usuario
 * @returns {Promise<Object>} Estadísticas
 */
export const fetchJobStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return {
    total: mockMyJobs.length,
    applied: mockMyJobs.filter(j => j.status === 'applied').length,
    inProgress: mockMyJobs.filter(j => j.status === 'in_progress').length,
    completed: mockMyJobs.filter(j => j.status === 'completed').length,
    totalEarned: "3,600 USDC",
    avgRating: 4.8,
  }
}

export { statusLabels }

