import { useState, useEffect } from 'react'
import * as profileService from '../services/profileService'

/**
 * Controller para manejar la lógica de perfiles
 * @param {string} profileType - 'freelancer' o 'employer'
 * @returns {Object} Estado y funciones
 */
export const useProfileController = (profileType = 'freelancer') => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [profileType])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = profileType === 'freelancer' 
        ? await profileService.fetchFreelancerProfile()
        : await profileService.fetchEmployerProfile()
      setProfile(data)
    } catch (error) {
      console.error('Error cargando perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      setSaving(true)
      const updatedProfile = profileType === 'freelancer'
        ? await profileService.updateFreelancerProfile(updates)
        : await profileService.updateEmployerProfile(updates)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      throw error
    } finally {
      setSaving(false)
    }
  }

  const uploadAvatar = async (file) => {
    try {
      const avatarUrl = await profileService.uploadAvatar(file)
      await updateProfile({ avatar: avatarUrl })
      return avatarUrl
    } catch (error) {
      console.error('Error subiendo avatar:', error)
      throw error
    }
  }

  const addSkill = async (skill) => {
    try {
      await profileService.addSkill(skill)
      const updatedSkills = [...(profile.skills || []), skill]
      setProfile({ ...profile, skills: updatedSkills })
    } catch (error) {
      console.error('Error agregando skill:', error)
      throw error
    }
  }

  const removeSkill = async (skillName) => {
    try {
      await profileService.removeSkill(skillName)
      const updatedSkills = profile.skills.filter(s => s.name !== skillName)
      setProfile({ ...profile, skills: updatedSkills })
    } catch (error) {
      console.error('Error eliminando skill:', error)
      throw error
    }
  }

  const addExperience = async (experience) => {
    try {
      const newExperience = await profileService.addExperience(experience)
      const updatedExperience = [...(profile.experience || []), newExperience]
      setProfile({ ...profile, experience: updatedExperience })
      return newExperience
    } catch (error) {
      console.error('Error agregando experiencia:', error)
      throw error
    }
  }

  const removeExperience = async (experienceId) => {
    try {
      await profileService.removeExperience(experienceId)
      const updatedExperience = profile.experience.filter(e => e.id !== experienceId)
      setProfile({ ...profile, experience: updatedExperience })
    } catch (error) {
      console.error('Error eliminando experiencia:', error)
      throw error
    }
  }

  const addEducation = async (education) => {
    try {
      const newEducation = await profileService.addEducation(education)
      const updatedEducation = [...(profile.education || []), newEducation]
      setProfile({ ...profile, education: updatedEducation })
      return newEducation
    } catch (error) {
      console.error('Error agregando educación:', error)
      throw error
    }
  }

  const removeEducation = async (educationId) => {
    try {
      await profileService.removeEducation(educationId)
      const updatedEducation = profile.education.filter(e => e.id !== educationId)
      setProfile({ ...profile, education: updatedEducation })
    } catch (error) {
      console.error('Error eliminando educación:', error)
      throw error
    }
  }

  return {
    profile,
    loading,
    saving,
    updateProfile,
    uploadAvatar,
    addSkill,
    removeSkill,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    loadProfile
  }
}

