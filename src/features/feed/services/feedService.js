// Mock data para el feed de trabajos
const mockJobFeed = [
  {
    id: "1",
    company: "TechCorp SA",
    companyLogo: "/tech-company-logo.jpg",
    companySize: "50-200 empleados",
    title: "Desarrollador Full Stack Senior",
    description:
      "Buscamos un desarrollador full stack con experiencia en Next.js, React y Node.js para proyecto de 3 meses. El proyecto incluye desarrollo de plataforma e-commerce con integración de pagos.",
    budget: "1,200 USDC",
    budgetType: "Proyecto completo",
    location: "Remoto",
    timePosted: "Hace 2 horas",
    category: "Desarrollo Web",
    skills: ["Next.js", "React", "Node.js", "TypeScript", "PostgreSQL"],
    applicants: 12,
    likes: 24,
    comments: 8,
    verified: true,
  },
  {
    id: "2",
    company: "DesignHub Studio",
    companyLogo: "/design-studio-logo.png",
    companySize: "10-50 empleados",
    title: "Diseñador UI/UX para App Mobile",
    description:
      "Necesitamos diseñador con experiencia en aplicaciones móviles para crear el diseño completo de una app de fitness. Incluye wireframes, prototipos y sistema de diseño.",
    budget: "800 USDC",
    budgetType: "Proyecto completo",
    location: "Remoto",
    timePosted: "Hace 5 horas",
    category: "Diseño",
    skills: ["Figma", "UI/UX", "Mobile Design", "Prototyping"],
    applicants: 18,
    likes: 31,
    comments: 5,
    verified: true,
  },
  {
    id: "3",
    company: "StartupXYZ",
    companyLogo: "/abstract-startup-logo.png",
    companySize: "1-10 empleados",
    title: "Desarrollador Blockchain Soroban",
    description:
      "Startup busca desarrollador con experiencia en Stellar/Soroban para implementar smart contracts de marketplace. Proyecto innovador con potencial de largo plazo.",
    budget: "2,000 USDC",
    budgetType: "Proyecto completo",
    location: "Remoto",
    timePosted: "Hace 1 día",
    category: "Blockchain",
    skills: ["Soroban", "Rust", "Stellar", "Smart Contracts"],
    applicants: 7,
    likes: 45,
    comments: 12,
    verified: false,
  },
  {
    id: "4",
    company: "Marketing Pro Agency",
    companyLogo: "/marketing-agency-logo.png",
    companySize: "50-200 empleados",
    title: "Content Writer & SEO Specialist",
    description:
      "Agencia de marketing busca redactor de contenido con conocimientos de SEO para crear artículos de blog, landing pages y contenido para redes sociales.",
    budget: "600 USDC",
    budgetType: "Mensual",
    location: "Remoto",
    timePosted: "Hace 1 día",
    category: "Marketing",
    skills: ["SEO", "Content Writing", "Copywriting", "WordPress"],
    applicants: 23,
    likes: 19,
    comments: 4,
    verified: true,
  },
  {
    id: "5",
    company: "DataTech Solutions",
    companyLogo: "/data-company-logo.png",
    companySize: "200+ empleados",
    title: "Data Scientist - Machine Learning",
    description:
      "Empresa líder en análisis de datos busca científico de datos para proyecto de predicción de ventas usando ML. Experiencia con Python, TensorFlow y análisis estadístico.",
    budget: "1,500 USDC",
    budgetType: "Proyecto completo",
    location: "Híbrido - Buenos Aires",
    timePosted: "Hace 2 días",
    category: "Data Science",
    skills: ["Python", "TensorFlow", "Machine Learning", "Statistics"],
    applicants: 9,
    likes: 38,
    comments: 15,
    verified: true,
  },
];

const trendingSkills = [
  "Next.js",
  "React",
  "Figma",
  "Soroban",
  "Python",
];

const suggestedCompanies = [
  { name: "TechCorp SA", jobs: 5 },
  { name: "DesignHub Studio", jobs: 3 },
  { name: "DataTech Solutions", jobs: 7 },
];

/**
 * Simula una llamada a la API para obtener trabajos
 * @param {Object} filters - Filtros para aplicar
 * @returns {Promise<Array>} Lista de trabajos
 */
export const fetchJobs = async (filters = {}) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let jobs = [...mockJobFeed];
  
  // Aplicar filtros
  if (filters.category && filters.category !== 'todas') {
    jobs = jobs.filter(job => 
      job.category.toLowerCase().includes(filters.category.toLowerCase())
    );
  }
  
  if (filters.location && filters.location !== 'todas') {
    jobs = jobs.filter(job => 
      job.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  if (filters.verifiedOnly) {
    jobs = jobs.filter(job => job.verified);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    jobs = jobs.filter(job => 
      job.title.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  }
  
  // Ordenar
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'recientes':
        // Ya está ordenado por más reciente
        break;
      case 'presupuesto':
        jobs.sort((a, b) => {
          const budgetA = parseInt(a.budget.replace(/[^\d]/g, ''));
          const budgetB = parseInt(b.budget.replace(/[^\d]/g, ''));
          return budgetB - budgetA;
        });
        break;
      case 'aplicantes':
        jobs.sort((a, b) => a.applicants - b.applicants);
        break;
      default:
        break;
    }
  }
  
  return jobs;
};

/**
 * Obtiene las skills en tendencia
 * @returns {Promise<Array>} Lista de skills
 */
export const fetchTrendingSkills = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return trendingSkills;
};

/**
 * Obtiene empresas sugeridas
 * @returns {Promise<Array>} Lista de empresas
 */
export const fetchSuggestedCompanies = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return suggestedCompanies;
};

/**
 * Da like a un trabajo
 * @param {string} jobId - ID del trabajo
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const likeJob = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`Like dado al trabajo ${jobId}`);
  return true;
};

/**
 * Quita el like de un trabajo
 * @param {string} jobId - ID del trabajo
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const unlikeJob = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`Like removido del trabajo ${jobId}`);
  return true;
};

/**
 * Guarda un trabajo
 * @param {string} jobId - ID del trabajo
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const saveJob = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`Trabajo ${jobId} guardado`);
  return true;
};

/**
 * Quita un trabajo de guardados
 * @param {string} jobId - ID del trabajo
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const unsaveJob = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`Trabajo ${jobId} removido de guardados`);
  return true;
};

/**
 * Aplica a un trabajo
 * @param {string} jobId - ID del trabajo
 * @returns {Promise<boolean>} Éxito de la operación
 */
export const applyToJob = async (jobId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Aplicación enviada al trabajo ${jobId}`);
  return true;
};

/**
 * Obtiene estadísticas del usuario
 * @returns {Promise<Object>} Estadísticas
 */
export const fetchUserStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    applicationsSubmitted: 12,
    savedJobs: 5,
    profileViews: 48,
  };
};

