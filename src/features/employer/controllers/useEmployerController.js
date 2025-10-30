import { useState, useEffect } from 'react'
import * as employerService from '../services/employerService'
import * as profileService from '../../profile/services/profileService'

/**
 * Controller para manejar la lógica del empleador
 * @returns {Object} Estado y funciones
 */
export const useEmployerController = () => {
  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadEmployerData()
  }, [])

  useEffect(() => {
    loadJobs()
  }, [filter])

  const loadEmployerData = async () => {
    try {
      setLoading(true)
      
      // Fetch real data from Supabase
      const profileRes = await profileService.getMyEmployerProfile()
      
      if (!profileRes.ok) {
        console.error('Error loading employer profile:', profileRes.error)
        setProfile(null)
        setStats({ activeJobs: 0, totalApplicants: 0, completedJobs: 0, totalSpent: 0 })
        return
      }
      
      const dbProfile = profileRes.data
      
      // Fetch stats and proposals in parallel
      const [statsRes, proposalsRes] = await Promise.all([
        profileService.computeEmployerStats(dbProfile.id),
        profileService.fetchEmployerProposals(dbProfile.id)
      ])
      
      // Map DB fields to UI shape
      const mappedProfile = {
        id: dbProfile.id,
        type: 'employer',
        name: dbProfile.full_name || 'Empresa Sin Nombre',
        email: dbProfile.email || '',
        wallet_address: dbProfile.wallet_address || '',
        description: dbProfile.bio || '',
        industry: dbProfile.portfolio_summary || 'No especificado',
        location: 'No especificado', // Not in DB
        rating: Number(dbProfile.rating) || 0,
        reviewsCount: 0, // TODO: compute from reviews table when available
        jobsPosted: statsRes.ok ? statsRes.data.proposalsTotal : 0,
        verified: false, // Not in DB
        memberSince: dbProfile.created_at ? new Date(dbProfile.created_at).getFullYear().toString() : '2025',
        avatar: null, // Not implemented yet
        // Generate initials for avatar fallback
        initials: profileService.getInitials(dbProfile.full_name, dbProfile.email)
      }
      
      // Map stats
      const mappedStats = statsRes.ok ? {
        activeJobs: statsRes.data.proposalsPublished,
        totalApplicants: 0, // TODO: compute from proposals_freelancers when available
        completedJobs: statsRes.data.proposalsCompleted,
        totalSpent: statsRes.data.totalSpent
      } : {
        activeJobs: 0,
        totalApplicants: 0,
        completedJobs: 0,
        totalSpent: 0
      }
      
      setProfile(mappedProfile)
      setStats(mappedStats)
      
      // Set jobs from proposals
      if (proposalsRes.ok) {
        const mappedJobs = proposalsRes.data.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          budget: Number(p.total_payment) || 0,
          status: p.status || 'activo',
          applicants: 0, // TODO: count from proposals_freelancers
          views: 0, // Not tracked yet
          createdAt: p.created_at,
          skills: Array.isArray(p.tags) ? p.tags : [],
          proposals: [] // TODO: fetch if needed
        }))
        setJobs(mappedJobs)
      }
      
    } catch (error) {
      console.error('Error cargando datos del empleador:', error)
      setProfile(null)
      setStats({ activeJobs: 0, totalApplicants: 0, completedJobs: 0, totalSpent: 0 })
    } finally {
      setLoading(false)
    }
  }

  const loadJobs = async () => {
    // Jobs are now loaded in loadEmployerData
    // This function kept for filter changes (filtering happens in render/useMemo)
    // No-op for now, filtering will be client-side
  }

  const createJob = async (jobData) => {
    try {
      const newJob = await employerService.createJob(jobData)
      setJobs(prev => [newJob, ...prev])
      
      // Actualizar stats
      if (stats) {
        setStats({
          ...stats,
          activeJobs: stats.activeJobs + 1
        })
      }
      
      return newJob
    } catch (error) {
      console.error('Error creando trabajo:', error)
      throw error
    }
  }

  const updateJob = async (jobId, updates) => {
    try {
      const updatedJob = await employerService.updateJob(jobId, updates)
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      ))
      return updatedJob
    } catch (error) {
      console.error('Error actualizando trabajo:', error)
      throw error
    }
  }

  const deleteJob = async (jobId) => {
    try {
      await employerService.deleteJob(jobId)
      setJobs(prev => prev.filter(job => job.id !== jobId))
      
      // Actualizar stats
      if (stats) {
        setStats({
          ...stats,
          activeJobs: Math.max(0, stats.activeJobs - 1)
        })
      }
    } catch (error) {
      console.error('Error eliminando trabajo:', error)
      throw error
    }
  }

  const updateProfile = async (updates) => {
    try {
      const updatedProfile = await employerService.updateEmployerProfile(updates)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      throw error
    }
  }

  const changeFilter = (newFilter) => {
    setFilter(newFilter)
  }

  // Compute filtered jobs based on current filter
  const getFilteredJobs = () => {
    if (filter === 'all') return jobs
    
    // Map filter values to DB status values
    const statusMap = {
      'activo': ['publicada', 'en_progreso', 'in_progress'],
      'cerrado': ['cerrada', 'closed'],
      'completado': ['completada', 'completed']
    }
    
    const allowedStatuses = statusMap[filter] || []
    return jobs.filter(job => allowedStatuses.includes(job.status))
  }

  const filteredJobs = getFilteredJobs()

  return {
    profile,
    jobs: filteredJobs, // Return filtered jobs
    stats,
    loading,
    filter,
    createJob,
    updateJob,
    deleteJob,
    updateProfile,
    changeFilter,
    loadJobs
  }
}

