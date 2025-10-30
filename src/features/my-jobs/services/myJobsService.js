import { supabase } from '../../../lib/supabaseClient';

// Mock data para mis trabajos (fallback)
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
  "pendiente": "Pendiente",
  "en_revision": "En Revisión",
  "liberado": "Liberado",
  "rechazado": "Rechazado",
  // Legacy statuses for backward compatibility
  "en-progreso": "En Progreso",
  "completado": "Completado",
  "revision": "En Revisión",
  "cancelado": "Cancelado",
}

/**
 * Transform work_history with proposal data to job format
 * @param {Object} workHistory - Work history entry with proposal data
 * @returns {Object} Job formatted for My Jobs
 */
const transformWorkHistoryToJob = (workHistory) => {
  // Get proposal data (joined from proposals table)
  const proposal = workHistory.proposals || {};
  
  // Extract tags/skills from proposal's jsonb
  const skills = Array.isArray(proposal.tags) ? proposal.tags : [];
  
  // Calculate progress based on work_history status
  let progress = 0;
  let displayStatus = workHistory.status || 'pendiente';
  
  switch (workHistory.status) {
    case 'pendiente':
      progress = 25;
      break;
    case 'en_revision':
      progress = 75;
      break;
    case 'liberado':
      progress = 100;
      displayStatus = 'completado'; // Map to UI status
      break;
    case 'rechazado':
      progress = 0;
      break;
    default:
      progress = 0;
  }
  
  // Format dates
  const startDate = new Date(workHistory.created_at).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  
  // Use finished_at if available, otherwise calculate deadline
  let deadline;
  if (workHistory.finished_at) {
    deadline = new Date(workHistory.finished_at).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } else {
    const deadlineDate = new Date(workHistory.created_at);
    deadlineDate.setDate(deadlineDate.getDate() + 30);
    deadline = deadlineDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
  
  return {
    id: workHistory.id.toString(),
    title: workHistory.title || proposal.title || 'Sin título',
    client: {
      name: 'Empleador', // TODO: Join with profiles table to get employer name
      avatar: '/placeholder.svg?height=48&width=48',
      verified: false, // TODO: Check employer verification
    },
    amount: proposal.total_payment ? parseFloat(proposal.total_payment) : 0,
    status: displayStatus,
    progress: progress,
    startDate: startDate,
    deadline: deadline,
    finishedAt: workHistory.finished_at,
    description: workHistory.description || proposal.description || 'Sin descripción',
    skills: skills,
    workHistoryId: workHistory.id,
    proposalId: workHistory.proposal_id,
    profileId: workHistory.profile_id,
    employerId: proposal.employer_id,
    createdAt: workHistory.created_at,
  };
};

/**
 * Obtiene todos los trabajos completados del usuario freelancer desde work_history
 * @param {string} filter - Filtro por status (pendiente, en_revision, liberado, rechazado, all)
 * @param {string} userId - ID del usuario freelancer
 * @returns {Promise<Array>} Lista de trabajos
 */
export const fetchMyJobs = async (filter = 'all', userId = null) => {
  try {
    // If no userId provided, try to get from localStorage or return mock data
    if (!userId) {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        console.warn('No user ID provided, using mock data');
        return filter === 'all' ? mockMyJobs : mockMyJobs.filter(job => job.status === filter);
      }
      userId = storedUserId;
    }
    
    // Build query to get work_history with proposal data joined
    let query = supabase
      .from('work_history')
      .select(`
        *,
        proposals (
          id,
          title,
          description,
          total_payment,
          employer_id,
          status,
          tags,
          created_at,
          updated_at
        )
      `)
      .eq('profile_id', userId);
    
    // Apply status filter if not 'all'
    if (filter !== 'all') {
      // Map UI filter to work_history status
      let dbStatus = filter;
      if (filter === 'completado') {
        dbStatus = 'liberado';
      } else if (filter === 'revision') {
        dbStatus = 'en_revision';
      }
      query = query.eq('status_project', dbStatus);
    }
    
    // Order by most recent first
    query = query.order('created_at', { ascending: false });
    
    // Execute query
    const { data: workHistoryData, error } = await query;
    
    if (error) {
      console.error('Error fetching work history from Supabase:', error);
      // Fallback to mock data
      return filter === 'all' ? mockMyJobs : mockMyJobs.filter(job => job.status === filter);
    }
    
    if (!workHistoryData || workHistoryData.length === 0) {
      console.log('No work history found for this freelancer');
      return [];
    }
    
    // Transform work_history to job format
    const jobs = workHistoryData.map(transformWorkHistoryToJob);
    
    return jobs;
    
  } catch (error) {
    console.error('Error in fetchMyJobs:', error);
    // Return mock data as fallback
    return filter === 'all' ? mockMyJobs : mockMyJobs.filter(job => job.status === filter);
  }
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
 * Obtiene estadísticas del usuario freelancer desde work_history
 * @param {string} userId - ID del usuario freelancer
 * @returns {Promise<Object>} Estadísticas
 */
export const fetchJobStats = async (userId = null) => {
  try {
    // If no userId provided, try to get from localStorage
    if (!userId) {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        console.warn('No user ID provided for stats, using mock data');
        // Return mock stats
        const completedJobs = mockMyJobs.filter(j => j.status === 'completado');
        const inProgressJobs = mockMyJobs.filter(j => j.status === 'en-progreso');
        const inReviewJobs = mockMyJobs.filter(j => j.status === 'revision');
        const monthlyEarnings = completedJobs.reduce((sum, job) => sum + job.amount, 0);
        
        return {
          total: mockMyJobs.length,
          inProgress: inProgressJobs.length,
          completed: completedJobs.length,
          inReview: inReviewJobs.length,
          monthlyEarnings: monthlyEarnings,
          totalEarned: "3,600 USDC",
          avgRating: 4.8,
        };
      }
      userId = storedUserId;
    }
    
    // Fetch all work_history with proposal data for this freelancer
    const { data: workHistoryData, error } = await supabase
      .from('work_history')
      .select(`
        project_status,
        finished_at,
        proposals (
          total_payment
        )
      `)
      .eq('profile_id', userId);
    
    if (error) {
      console.error('Error fetching work history stats:', error);
      // Return default stats
      return {
        total: 0,
        inProgress: 0,
        completed: 0,
        inReview: 0,
        monthlyEarnings: 0,
        totalEarned: "0 USDC",
        avgRating: 0,
      };
    }
    
    if (!workHistoryData || workHistoryData.length === 0) {
      return {
        total: 0,
        inProgress: 0,
        completed: 0,
        inReview: 0,
        monthlyEarnings: 0,
        totalEarned: "0 USDC",
        avgRating: 0,
      };
    }
    
    // Calculate stats based on work_history status
    console.log(workHistoryData)
    const completedJobs = workHistoryData.filter(wh => wh.project_status === 'liberado');
    const inProgressJobs = workHistoryData.filter(wh => wh.project_status === 'pendiente');
    const inReviewJobs = workHistoryData.filter(wh => wh.project_status === 'en_revision');
    
    // Calculate total earnings from completed (liberado) jobs
    const totalEarnings = completedJobs.reduce((sum, wh) => {
      const payment = wh.proposals?.total_payment || 0;
      return sum + parseFloat(payment);
    }, 0);
    
    // Calculate monthly earnings (completed jobs finished in current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyEarnings = completedJobs.reduce((sum, wh) => {
      if (wh.finished_at) {
        const finishedDate = new Date(wh.finished_at);
        if (finishedDate.getMonth() === currentMonth && finishedDate.getFullYear() === currentYear) {
          const payment = wh.proposals?.total_payment || 0;
          return sum + parseFloat(payment);
        }
      }
      return sum;
    }, 0);
    
    return {
      total: workHistoryData.length,
      inProgress: inProgressJobs.length,
      completed: completedJobs.length,
      inReview: inReviewJobs.length,
      monthlyEarnings: monthlyEarnings,
      totalEarned: `${totalEarnings.toLocaleString('es-AR')} USDC`,
      avgRating: 4.8, // TODO: Implement ratings system
    };
    
  } catch (error) {
    console.error('Error in fetchJobStats:', error);
    return {
      total: 0,
      inProgress: 0,
      completed: 0,
      inReview: 0,
      monthlyEarnings: 0,
      totalEarned: "0 USDC",
      avgRating: 0,
    };
  }
}

export { statusLabels }

