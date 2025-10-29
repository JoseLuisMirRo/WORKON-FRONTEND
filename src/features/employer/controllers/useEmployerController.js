import { useState, useEffect } from 'react'
import * as employerService from '../services/employerService'

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
      const [profileData, statsData] = await Promise.all([
        employerService.fetchEmployerProfile(),
        employerService.fetchEmployerStats()
      ])
      setProfile(profileData)
      setStats(statsData)
    } catch (error) {
      console.error('Error cargando datos del empleador:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadJobs = async () => {
    try {
      const jobsData = await employerService.fetchPostedJobs(filter)
      setJobs(jobsData)
    } catch (error) {
      console.error('Error cargando trabajos:', error)
    }
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

  return {
    profile,
    jobs,
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

