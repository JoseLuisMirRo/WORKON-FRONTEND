import { useState, useEffect } from 'react'
import * as myJobsService from '../services/myJobsService'

/**
 * Controller para manejar la lógica de mis trabajos
 * @returns {Object} Estado y funciones
 */
export const useMyJobsController = () => {
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [userId, setUserId] = useState(null)

  // Get user ID from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(storedUserId)
    }
  }, [])

  // Load data when filter or userId changes
  useEffect(() => {
    if (userId) {
      loadData()
    }
  }, [filter, userId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [jobsData, statsData] = await Promise.all([
        myJobsService.fetchMyJobs(filter, userId),
        myJobsService.fetchJobStats(userId),
      ])
      setJobs(jobsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error cargando trabajos:', error)
    } finally {
      setLoading(false)
    }
  }

  const changeFilter = (newFilter) => {
    setFilter(newFilter)
  }

  const toggleDeliverable = async (jobId, deliverableId, currentState) => {
    try {
      await myJobsService.updateDeliverable(jobId, deliverableId, !currentState)
      
      // Actualizar estado local
      setJobs(prevJobs => 
        prevJobs.map(job => {
          if (job.id === jobId && job.deliverables) {
            return {
              ...job,
              deliverables: job.deliverables.map(d => 
                d.id === deliverableId ? { ...d, completed: !currentState } : d
              ),
            }
          }
          return job
        })
      )
    } catch (error) {
      console.error('Error actualizando deliverable:', error)
    }
  }

  return {
    jobs,
    stats,
    loading,
    filter,
    changeFilter,
    toggleDeliverable,
    reloadJobs: loadData,
  }
}

