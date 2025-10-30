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
  // Applicants (proposal_applicants) statuses
  "postulado": "Postulado",
  "seleccionado": "Seleccionado",
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
 * Transform a proposal_applicant row (joined with proposals) into a Job card
 * so it can be rendered together with work_history items
 */
const transformApplicantToJob = (appRow) => {
  const proposal = appRow.proposals || {};
  const skills = Array.isArray(proposal.tags) ? proposal.tags : [];

  // Map applicant status to UI
  // postulado → 10%, seleccionado → 50%, rechazado → 0%
  let progress = 10;
  let displayStatus = appRow.status || 'postulado';
  if (displayStatus === 'seleccionado') progress = 50;
  if (displayStatus === 'rechazado') progress = 0;

  const createdAt = appRow.created_at || proposal.created_at;

  return {
    id: `app-${appRow.proposal_id}-${appRow.freelancer_id}`,
    title: proposal.title || 'Sin título',
    client: {
      name: 'Empleador',
      avatar: '/placeholder.svg?height=48&width=48',
      verified: false,
    },
    amount: proposal.total_payment ? parseFloat(proposal.total_payment) : 0,
    status: displayStatus,
    progress: progress,
    startDate: createdAt ? new Date(createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    deadline: '',
    description: proposal.description || 'Sin descripción',
    skills: skills,
    // Keep references
    proposalId: proposal.id,
    application: {
      status: appRow.status,
      coverLetter: appRow.cover_letter,
      timeEstimation: appRow.time_estimation,
      proposedBudget: appRow.propossed_budget,
      createdAt: appRow.created_at,
    },
    createdAt: createdAt,
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
 * Fetch applications (proposal_applicants) made by the freelancer
 */
export const fetchMyApplications = async (filter = 'all', userId = null) => {
  try {
    if (!userId) {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) return [];
      userId = storedUserId;
    }

    let query = supabase
      .from('proposal_applicants')
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
      .eq('freelancer_id', userId);

    if (filter !== 'all') {
      // Only filter when it is one of the applicant statuses
      if (['postulado', 'seleccionado', 'rechazado'].includes(filter)) {
        query = query.eq('status', filter);
      }
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching applications:', error);
      return [];
    }

    return (data || []).map(transformApplicantToJob);
  } catch (error) {
    console.error('Error in fetchMyApplications:', error);
    return [];
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

// ============================================================================
// MILESTONES & DELIVERABLES (Real Supabase Data)
// ============================================================================

const ok = (data) => ({ ok: true, data })
const fail = (error) => ({ 
  ok: false, 
  error: { 
    code: error?.code || 'UNKNOWN', 
    message: error?.message || String(error) 
  } 
})

const PROPOSAL_COLS = 'id, title, description, total_payment, employer_id, selected_freelancer_id, status, created_at, updated_at, tags'
const MILESTONE_COLS = 'id, proposal_id, title, description, amount, sort_order, status, due_date, created_at'
const MF_COLS = 'id, milestone_id, storage_path, mime_type, uploaded_at'

/**
 * List proposals where current user is the selected freelancer and status is in progress
 * @returns {Promise<{ok: boolean, data?: Array, error?: Object}>}
 */
export async function listMyInProgressProposals() {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      return fail(authError || new Error('Not authenticated'))
    }
    
    const uid = authData.user.id
    const { data, error } = await supabase
      .from('proposals')
      .select(PROPOSAL_COLS)
      .eq('selected_freelancer_id', uid)
      .in('status', ['en_progreso', 'in_progress', 'asignada', 'assigned'])
      .order('created_at', { ascending: false })
    
    if (error) return fail(error)
    return ok(data || [])
  } catch (e) {
    return fail(e)
  }
}

/**
 * Get a single proposal by ID (with access guard)
 * @param {number} proposalId - Proposal ID
 * @returns {Promise<{ok: boolean, data?: Object, error?: Object}>}
 */
export async function getProposalById(proposalId) {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select(PROPOSAL_COLS)
      .eq('id', proposalId)
      .single()
    
    if (error) return fail(error)
    return ok(data)
  } catch (e) {
    return fail(e)
  }
}

/**
 * List milestones for a proposal
 * @param {number} proposalId - Proposal ID
 * @returns {Promise<{ok: boolean, data?: Array, error?: Object}>}
 */
export async function listMilestones(proposalId) {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .select(MILESTONE_COLS)
      .eq('proposal_id', proposalId)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true })
    
    if (error) return fail(error)
    return ok(data || [])
  } catch (e) {
    return fail(e)
  }
}

/**
 * List files for a milestone
 * @param {number} milestoneId - Milestone ID
 * @returns {Promise<{ok: boolean, data?: Array, error?: Object}>}
 */
export async function listMilestoneFiles(milestoneId) {
  try {
    const { data, error } = await supabase
      .from('milestone_files')
      .select(MF_COLS)
      .eq('milestone_id', milestoneId)
      .order('uploaded_at', { ascending: false })
    
    if (error) return fail(error)
    return ok(data || [])
  } catch (e) {
    return fail(e)
  }
}

/**
 * Upload files to a milestone (atomic via RPC)
 * @param {number} milestoneId - Milestone ID
 * @param {File[]} files - Files to upload
 * @returns {Promise<{ok: boolean, data?: Array, error?: Object}>}
 */
export async function uploadMilestoneFiles(milestoneId, files) {
  try {
    // Get proposal_id from milestone
    const { data: milestoneRow, error: milestoneError } = await supabase
      .from('milestones')
      .select('proposal_id')
      .eq('id', milestoneId)
      .single()
    
    if (milestoneError) return fail(milestoneError)
    
    const proposalId = milestoneRow.proposal_id
    const bucket = 'deliverables'
    const inserted = []

    for (const file of files) {
      // 1) Generate unique storage path
      const uuid = crypto.randomUUID()
      const sanitizedName = file.name.replace(/[^\w.\-]+/g, '_')
      const storagePath = `deliverables/${proposalId}/${milestoneId}/${uuid}-${sanitizedName}`
      
      // 2) Upload to Storage
      const { error: uploadError } = await supabase
        .storage
        .from(bucket)
        .upload(storagePath, file, { 
          upsert: true,
          contentType: file.type 
        })
      
      if (uploadError) return fail(uploadError)
      
      // 3) Atomic DB insert + milestone status update via RPC
      const { data: rpcData, error: rpcError } = await supabase.rpc('submit_milestone_deliverable', {
        p_milestone_id: milestoneId,
        p_storage_path: storagePath,
        p_mime_type: file.type || null
      })
      
      if (rpcError) return fail(rpcError)
      
      // RPC returns array with single row, normalize file_id -> id
      const rawRow = Array.isArray(rpcData) ? rpcData[0] : rpcData
      const fileRow = rawRow ? { ...rawRow, id: rawRow.file_id || rawRow.id } : rawRow
      inserted.push(fileRow)
    }
    
    return ok(inserted)
  } catch (e) {
    return fail(e)
  }
}

/**
 * Upload a single deliverable file (atomic via RPC)
 * @param {number} milestoneId - Milestone ID
 * @param {number} proposalId - Proposal ID
 * @param {File} file - File to upload
 * @returns {Promise<{ok: boolean, data?: Object, error?: Object}>}
 */
export async function uploadDeliverable(milestoneId, proposalId, file) {
  try {
    if (!milestoneId || !proposalId || !file) {
      return fail('milestoneId, proposalId and file are required')
    }

    // 1) Build deterministic storage key
    const uuid = crypto.randomUUID()
    const sanitizedName = file.name.replace(/[^\w.\-]+/g, '_')
    const key = `deliverables/${proposalId}/${milestoneId}/${uuid}-${sanitizedName}`

    // 2) Upload to Storage
    const { error: uploadError } = await supabase
      .storage
      .from('deliverables')
      .upload(key, file, { 
        upsert: true, 
        contentType: file.type 
      })

    if (uploadError) return fail(uploadError)

    // 3) Atomic DB insert + milestone status update via RPC
    const { data: rpcData, error: rpcError } = await supabase.rpc('submit_milestone_deliverable', {
      p_milestone_id: milestoneId,
      p_storage_path: key,
      p_mime_type: file.type || null
    })

    if (rpcError) return fail(rpcError)

    // Return inserted file row, normalize file_id -> id
    const rawRow = Array.isArray(rpcData) ? rpcData[0] : rpcData
    const fileRow = rawRow ? { ...rawRow, id: rawRow.file_id || rawRow.id } : rawRow
    return ok({ 
      fileRow, 
      storagePath: key 
    })
  } catch (e) {
    return fail(e)
  }
}

/**
 * Update milestone status
 * @param {number} milestoneId - Milestone ID
 * @param {string} status - New status
 * @returns {Promise<{ok: boolean, data?: Object, error?: Object}>}
 */
export async function setMilestoneStatus(milestoneId, status) {
  try {
    const { data, error } = await supabase
      .from('milestones')
      .update({ status })
      .eq('id', milestoneId)
      .select(MILESTONE_COLS)
      .single()
    
    if (error) return fail(error)
    return ok(data)
  } catch (e) {
    return fail(e)
  }
}

/**
 * Get signed URL for a deliverable file
 * @param {string} storagePath - Storage path
 * @param {number} expiresIn - Expiration in seconds (default 1 hour)
 * @returns {Promise<{ok: boolean, data?: string, error?: Object}>}
 */
export async function getSignedUrlForDeliverable(storagePath, expiresIn = 3600) {
  try {
    const { data, error } = await supabase
      .storage
      .from('deliverables')
      .createSignedUrl(storagePath, expiresIn)
    
    if (error) return fail(error)
    return ok(data?.signedUrl || null)
  } catch (e) {
    return fail(e)
  }
}

