// Mock data para perfiles

// Perfil de Freelancer
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
 * @returns {Promise<Object>} Perfil del freelancer
 */
export const fetchFreelancerProfile = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockFreelancerProfile
}

/**
 * Actualiza el perfil del freelancer
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<Object>} Perfil actualizado
 */
export const updateFreelancerProfile = async (updates) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('Perfil freelancer actualizado:', updates)
  return { ...mockFreelancerProfile, ...updates }
}

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
  console.log('Perfil empleador actualizado:', updates)
  return { ...mockEmployerProfile, ...updates }
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

