// Mock data para mis trabajos
const mockMyJobs = [
  {
    id: "1",
    title: "Desarrollador Full Stack Senior",
    client: {
      name: "TechCorp SA",
      avatar: "/placeholder.svg?height=48&width=48",
      verified: true
    },
    amount: 1200,
    status: "en-progreso",
    progress: 65,
    startDate: "20 Ene 2025",
    deadline: "28 Feb 2025",
    description: "Desarrollo de plataforma e-commerce con integración de pagos.",
    skills: ["Next.js", "React", "Node.js", "TypeScript"],
  },
  {
    id: "2",
    title: "Diseñador UI/UX para App Mobile",
    client: {
      name: "DesignHub Studio",
      avatar: "/placeholder.svg?height=48&width=48",
      verified: true
    },
    amount: 800,
    status: "completado",
    progress: 100,
    startDate: "08 Ene 2025",
    deadline: "25 Ene 2025",
    description: "Diseño completo de una app de fitness.",
    skills: ["Figma", "UI/UX", "Mobile Design"],
  },
  {
    id: "3",
    title: "Desarrollador Blockchain Soroban",
    client: {
      name: "StartupXYZ",
      avatar: "/placeholder.svg?height=48&width=48",
      verified: false
    },
    amount: 2000,
    status: "revision",
    progress: 90,
    startDate: "15 Ene 2025",
    deadline: "15 Feb 2025",
    description: "Implementar smart contracts de marketplace.",
    skills: ["Soroban", "Rust", "Stellar"],
  },
  {
    id: "4",
    title: "Content Writer & SEO Specialist",
    client: {
      name: "Marketing Pro Agency",
      avatar: "/placeholder.svg?height=48&width=48",
      verified: true
    },
    amount: 600,
    status: "en-progreso",
    progress: 30,
    startDate: "15 Ene 2025",
    deadline: "15 Mar 2025",
    description: "Crear contenido y optimizar SEO.",
    skills: ["SEO", "Content Writing", "Copywriting"],
  },
]

const statusLabels = {
  "en-progreso": "En Progreso",
  "completado": "Completado",
  "revision": "En Revisión",
  "cancelado": "Cancelado",
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
  
  const completedJobs = mockMyJobs.filter(j => j.status === 'completado')
  const inProgressJobs = mockMyJobs.filter(j => j.status === 'en-progreso')
  const inReviewJobs = mockMyJobs.filter(j => j.status === 'revision')
  
  // Calcular ganancias mensuales
  const monthlyEarnings = completedJobs.reduce((sum, job) => {
    return sum + job.amount
  }, 0)
  
  return {
    total: mockMyJobs.length,
    inProgress: inProgressJobs.length,
    completed: completedJobs.length,
    inReview: inReviewJobs.length,
    monthlyEarnings: monthlyEarnings,
    totalEarned: "3,600 USDC",
    avgRating: 4.8,
  }
}

export { statusLabels }

