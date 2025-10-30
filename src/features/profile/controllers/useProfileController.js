import { useState, useEffect } from 'react'
import * as profileService from '../services/profileService'
import * as portfolioService from '../services/portfolioService'

/**
 * Controller para manejar la lógica de perfiles
 * @param {string} profileType - 'freelancer' o 'employer'
 * @returns {Object} Estado y funciones
 */
export const useProfileController = (profileType = 'freelancer') => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [portfolio, setPortfolio] = useState([])
  const [portfolioLoading, setPortfolioLoading] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [profileType])

  const loadProfile = async () => {
    try {
      setLoading(true)
      
      // Get authenticated user
      const user = await profileService.getCurrentUser()
      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }
      
      // Ensure profile exists in DB
      await profileService.ensureProfileExists(user.id)
      
      // Load deep profile with nested data (freelancer only for now)
      if (profileType === 'freelancer') {
        const res = await profileService.getMyFreelancerProfileDeep()
        
        if (!res.ok) {
          console.error('Error loading deep profile:', res.error)
          setProfile(null)
          setLoading(false)
          return
        }
        
        const p = res.data
        
        // Compute display fields
        const fullName = p.full_name || ''
        const email = p.email || ''
        const displayName = fullName.trim() || (email ? email.split('@')[0] : 'Usuario')
        const initials = profileService.getInitials(fullName, email)
        
        setProfile({
          id: p.id,
          type: 'freelancer',
          role: p.role,
          full_name: fullName,
          email,
          wallet_address: p.wallet_address,
          rating: p.rating,
          bio: p.bio,
          portfolio_summary: p.portfolio_summary,
          areas: p.areas || [],
          work_history: p.work_history || [],
          displayName,
          initials,
          // Empty arrays for UI compatibility (not in DB yet)
          skills: [],
          languages: [],
          experience: [],
          education: [],
          certifications: []
        })
        
        // Load portfolio with signed URLs
        await loadPortfolioFromDeepData(p.portfolio || [])
      } else {
        // Employer profile (use existing mock-based logic for now)
        const data = await profileService.fetchEmployerProfile()
        if (data) {
          const fullName = data.companyName || ''
          const email = data.email || ''
          const displayName = fullName.trim() || (email ? email.split('@')[0] : 'Usuario')
          const initials = profileService.getInitials(fullName, email)
          
          setProfile({
            ...data,
            displayName,
            initials,
          })
        } else {
          setProfile(null)
        }
      }
    } catch (error) {
      console.error('Error cargando perfil:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const loadPortfolioFromDeepData = async (portfolioData) => {
    if (!portfolioData || portfolioData.length === 0) {
      setPortfolio([])
      return
    }
    
    try {
      setPortfolioLoading(true)
      
      // Enrich with signed URLs for cover images
      const entries = await Promise.all(
        portfolioData.map(async (entry) => {
          let coverUrl = null
          
          if (entry.cover_path) {
            const urlRes = await profileService.getSignedUrlForFile(entry.cover_path)
            coverUrl = urlRes.ok ? urlRes.data : null
          }
          
          return {
            id: entry.id,
            title: entry.title,
            description: entry.description,
            image: coverUrl || '/placeholder.svg?height=300&width=400',
            files: entry.files || [],
            created_at: entry.created_at,
            tags: [] // Not in DB schema, empty for now
          }
        })
      )
      
      setPortfolio(entries)
    } catch (error) {
      console.error('Error loading portfolio from deep data:', error)
      setPortfolio([])
    } finally {
      setPortfolioLoading(false)
    }
  }

  const loadPortfolio = async (profileId) => {
    if (!profileId) return
    
    try {
      setPortfolioLoading(true)
      const res = await portfolioService.getMyPortfolio(profileId)
      
      if (!res.ok) {
        console.error('Error loading portfolio:', res.error)
        setPortfolio([])
        return
      }

      // Enrich entries with cover image URLs
      const entries = await Promise.all(res.data.map(async (entry) => {
        const files = entry.portfolio_files || []
        const imageFile = files.find(f => (f.mime_type || '').startsWith('image/'))
        
        let coverUrl = null
        if (imageFile?.storage_path) {
          const urlRes = await portfolioService.getSignedUrl(imageFile.storage_path)
          coverUrl = urlRes.ok ? urlRes.data : null
        }

        return {
          id: entry.id,
          title: entry.title,
          description: entry.description,
          image: coverUrl || '/placeholder.svg?height=300&width=400',
          files: files,
          created_at: entry.created_at,
          // Keep mock tags for now (not in DB schema)
          tags: []
        }
      }))

      setPortfolio(entries)
    } catch (error) {
      console.error('Error loading portfolio:', error)
      setPortfolio([])
    } finally {
      setPortfolioLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      setSaving(true)
      
      // Map UI fields to DB fields (only allowed fields)
      const dbUpdates = {}
      
      if (updates.full_name !== undefined) dbUpdates.full_name = updates.full_name
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio
      if (updates.wallet_address !== undefined) dbUpdates.wallet_address = updates.wallet_address
      if (updates.portfolio_summary !== undefined) dbUpdates.portfolio_summary = updates.portfolio_summary
      
      // Update in DB
      const updatedProfile = await profileService.updateMyProfile(dbUpdates)
      
      if (!updatedProfile) {
        throw new Error('Failed to update profile')
      }
      
      // Reload full profile to get updated data
      await loadProfile()
      
      return profile
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

  // Portfolio methods
  const createPortfolioEntry = async ({ title, description }) => {
    if (!profile?.id) throw new Error('No profile ID')
    
    try {
      const res = await portfolioService.createPortfolioEntry({
        profileId: profile.id,
        title,
        description
      })
      
      if (!res.ok) throw new Error(res.error.message)
      return res.data
    } catch (error) {
      console.error('Error creating portfolio entry:', error)
      throw error
    }
  }

  const uploadPortfolioFile = async ({ entryId, file }) => {
    if (!profile?.id) throw new Error('No profile ID')
    
    try {
      const res = await portfolioService.uploadPortfolioFile({
        profileId: profile.id,
        entryId,
        file
      })
      
      if (!res.ok) throw new Error(res.error.message)
      return res.data
    } catch (error) {
      console.error('Error uploading portfolio file:', error)
      throw error
    }
  }

  const deletePortfolioEntry = async (entryId) => {
    try {
      const res = await portfolioService.deletePortfolioEntry(entryId)
      if (!res.ok) throw new Error(res.error.message)
      
      // Refresh portfolio
      if (profile?.id) {
        await loadPortfolio(profile.id)
      }
    } catch (error) {
      console.error('Error deleting portfolio entry:', error)
      throw error
    }
  }

  const deletePortfolioFile = async (fileId, entryId) => {
    try {
      const res = await portfolioService.deletePortfolioFile(fileId)
      if (!res.ok) throw new Error(res.error.message)
      
      // Refresh portfolio
      if (profile?.id) {
        await loadPortfolio(profile.id)
      }
    } catch (error) {
      console.error('Error deleting portfolio file:', error)
      throw error
    }
  }

  const refreshPortfolio = async () => {
    if (profile?.id) {
      await loadPortfolio(profile.id)
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
    loadProfile,
    // Portfolio
    portfolio,
    portfolioLoading,
    createPortfolioEntry,
    uploadPortfolioFile,
    deletePortfolioEntry,
    deletePortfolioFile,
    refreshPortfolio
  }
}

