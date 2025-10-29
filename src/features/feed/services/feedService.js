import { supabase } from '../../../lib/supabaseClient';

/**
 * Verifica si existe un perfil, si no lo crea
 * @param {string} userId - ID del usuario
 * @returns {Promise<boolean>} True si el perfil existe o fue creado
 */
const ensureProfileExists = async (userId) => {
  try {
    // Verificar si existe el perfil
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (existingProfile) {
      return true; // El perfil ya existe
    }
    
    // Si no existe, obtener datos del usuario de auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error obteniendo usuario:', userError);
      return false;
    }
    
    // Crear el perfil
    const { error: createError } = await supabase
      .from('profiles')
      .insert([{
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email,
        role: user.user_metadata?.role || 'freelancer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
    
    if (createError) {
      console.error('Error creando perfil:', createError);
      return false;
    }
    
    console.log('✅ Perfil creado exitosamente para:', user.email);
    return true;
    
  } catch (error) {
    console.error('Error en ensureProfileExists:', error);
    return false;
  }
};

// Mock data para el feed de trabajos (fallback)
const mockJobFeed = [
  {
    id: "1",
    company: "TechCorp SA",
    companyLogo: "/tech-company-logo.jpg",
    companySize: "50-200 empleados",
    title: "Desarrollador Full Stack Senior",
    description:
      "Buscamos un desarrollador full stack con experiencia en Next.js, React y Node.js para proyecto de 3 meses. El proyecto incluye desarrollo de plataforma e-commerce con integración de pagos.",
    budget: 1200,
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
    budget: 800,
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
    budget: 2000,
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
    budget: 600,
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
    budget: 1500,
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
 * Transform proposal from Supabase to job format
 * @param {Object} proposal - Proposal from Supabase
 * @returns {Object} Job formatted for the feed
 */
const transformProposalToJob = (proposal) => {
  // Extract tags/skills from jsonb
  const skills = Array.isArray(proposal.tags) ? proposal.tags : [];
  
  // Calculate time posted
  const createdAt = new Date(proposal.created_at);
  const now = new Date();
  const diffMs = now - createdAt;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  let timePosted;
  if (diffHours < 1) {
    timePosted = 'Hace menos de 1 hora';
  } else if (diffHours < 24) {
    timePosted = `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  } else {
    timePosted = `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  }
  
  return {
    id: proposal.id.toString(),
    title: proposal.title,
    description: proposal.description || 'Sin descripción',
    budget: parseFloat(proposal.total_payment), // Solo el número, sin "USDC"
    budgetType: 'Proyecto completo',
    budgetRaw: parseFloat(proposal.total_payment),
    status: proposal.status,
    skills: skills,
    timePosted: timePosted,
    createdAt: proposal.created_at,
    updatedAt: proposal.updated_at,
    employerId: proposal.employer_id,
    selectedFreelancerId: proposal.selected_freelancer_id,
    // Default values for UI (can be enhanced with joins to other tables)
    company: 'Empleador',
    companyLogo: '/placeholder-company.png',
    companySize: 'Sin especificar',
    location: 'Remoto',
    category: skills.length > 0 ? skills[0] : 'General',
    applicants: 0, // TODO: Join with applications table
    likes: 0, // TODO: Join with likes table
    comments: 0, // TODO: Join with comments table
    verified: false, // TODO: Check employer verification
  };
};

/**
 * Fetches proposals from Supabase and applies filters
 * @param {Object} filters - Filters to apply
 * @returns {Promise<Array>} List of jobs
 */
export const fetchJobs = async (filters = {}) => {
  try {
    // Build query
    let query = supabase
      .from('proposals')
      .select('*');
    
    // Filter by status - only show published proposals by default
    if (!filters.includeAll) {
      query = query.eq('status', 'publicada');
    }
    
    // Apply search filter in the query if provided
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    // Order by created_at descending (most recent first)
    query = query.order('created_at', { ascending: false });
    
    // Execute query
    const { data: proposals, error } = await query;
    
    if (error) {
      console.error('Error fetching proposals from Supabase:', error);
      // Fallback to mock data
      return mockJobFeed;
    }
    
    if (!proposals || proposals.length === 0) {
      console.log('No proposals found in Supabase, using mock data');
      return mockJobFeed;
    }
    
    // Transform proposals to job format
    let jobs = proposals.map(transformProposalToJob);
    
    // Apply client-side filters
    if (filters.category && filters.category !== 'todas') {
      jobs = jobs.filter(job => 
        job.category.toLowerCase().includes(filters.category.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(filters.category.toLowerCase()))
      );
    }
    
    if (filters.location && filters.location !== 'todas') {
      jobs = jobs.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.budget && filters.budget !== 'todos') {
      jobs = jobs.filter(job => {
        const budget = job.budgetRaw;
        switch (filters.budget) {
          case 'bajo':
            return budget < 500;
          case 'medio':
            return budget >= 500 && budget <= 1500;
          case 'alto':
            return budget > 1500;
          default:
            return true;
        }
      });
    }
    
    if (filters.verifiedOnly) {
      jobs = jobs.filter(job => job.verified);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'recientes':
          // Already sorted by created_at desc in query
          break;
        case 'presupuesto':
          jobs.sort((a, b) => b.budgetRaw - a.budgetRaw);
          break;
        case 'aplicantes':
          jobs.sort((a, b) => a.applicants - b.applicants);
          break;
        default:
          break;
      }
    }
    
    return jobs;
    
  } catch (error) {
    console.error('Error in fetchJobs:', error);
    // Return mock data as fallback
    return mockJobFeed;
  }
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
 * Guarda un trabajo en saved_proposals
 * @param {string} jobId - ID del trabajo (proposal_id)
 * @param {string} profileId - ID del perfil del usuario
 * @returns {Promise<Object>} Resultado de la operación
 */
export const saveJob = async (jobId, profileId) => {
  try {
    const { data, error } = await supabase
      .from('saved_proposals')
      .insert([
        {
          profile_id: profileId,
          proposal_id: parseInt(jobId)
        }
      ])
      .select();
    
    if (error) {
      // Si ya existe, no es realmente un error
      if (error.code === '23505') {
        console.log('Trabajo ya guardado previamente');
        return { success: true, alreadyExists: true };
      }
      throw error;
    }
    
    console.log('Trabajo guardado exitosamente:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error al guardar trabajo:', error);
    throw new Error(error.message || 'Error al guardar el trabajo');
  }
};

/**
 * Quita un trabajo de guardados
 * @param {string} jobId - ID del trabajo (proposal_id)
 * @param {string} profileId - ID del perfil del usuario
 * @returns {Promise<Object>} Resultado de la operación
 */
export const unsaveJob = async (jobId, profileId) => {
  try {
    const { error } = await supabase
      .from('saved_proposals')
      .delete()
      .eq('profile_id', profileId)
      .eq('proposal_id', parseInt(jobId));
    
    if (error) throw error;
    
    console.log('Trabajo removido de guardados');
    return { success: true };
  } catch (error) {
    console.error('Error al remover trabajo guardado:', error);
    throw new Error(error.message || 'Error al remover trabajo de guardados');
  }
};

/**
 * Verifica si el usuario ya aplicó a una propuesta
 * @param {string} jobId - ID del trabajo (proposal_id)
 * @param {string} freelancerId - ID del freelancer
 * @returns {Promise<boolean>} True si ya aplicó
 */
export const hasAppliedToJob = async (jobId, freelancerId) => {
  try {
    const { data, error } = await supabase
      .from('proposal_applicants')
      .select('*')
      .eq('proposal_id', parseInt(jobId))
      .eq('freelancer_id', freelancerId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error verificando aplicación:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error verificando aplicación:', error);
    return false;
  }
};

/**
 * Aplica a un trabajo (crea registro en proposal_applicants)
 * @param {Object} applicationData - Datos de la aplicación
 * @param {string} applicationData.jobId - ID del trabajo (proposal_id)
 * @param {string} applicationData.freelancerId - ID del freelancer
 * @param {string} applicationData.coverLetter - Carta de presentación
 * @returns {Promise<Object>} Resultado de la operación
 */
export const applyToJob = async (applicationData) => {
  try {
    const { jobId, freelancerId, coverLetter } = applicationData;
    
    // Validar datos requeridos
    if (!jobId || !freelancerId) {
      throw new Error('JobId y FreelancerId son requeridos');
    }
    
    if (!coverLetter || coverLetter.trim().length < 50) {
      throw new Error('La carta de presentación debe tener al menos 50 caracteres');
    }
    
    // IMPORTANTE: Verificar/crear perfil antes de aplicar
    const profileExists = await ensureProfileExists(freelancerId);
    if (!profileExists) {
      throw new Error('No se pudo verificar tu perfil. Por favor intenta cerrar sesión y volver a entrar.');
    }
    
    // Verificar si ya aplicó antes
    const alreadyApplied = await hasAppliedToJob(jobId, freelancerId);
    if (alreadyApplied) {
      throw new Error('Ya has aplicado a esta propuesta anteriormente');
    }
    
    // Insertar aplicación
    const { data, error } = await supabase
      .from('proposal_applicants')
      .insert([
        {
          proposal_id: parseInt(jobId),
          freelancer_id: freelancerId,
          cover_letter: coverLetter.trim(),
          status: 'postulado'
        }
      ])
      .select();
    
    if (error) {
      // Mejorar mensaje de error
      if (error.code === '23503') {
        throw new Error('Tu perfil no está completamente configurado. Por favor completa tu perfil antes de aplicar.');
      }
      throw error;
    }
    
    console.log('Aplicación enviada exitosamente:', data);
    return { 
      success: true, 
      data: data[0],
      message: '¡Aplicación enviada con éxito!' 
    };
    
  } catch (error) {
    console.error('Error al aplicar al trabajo:', error);
    throw new Error(error.message || 'Error al enviar la aplicación');
  }
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

