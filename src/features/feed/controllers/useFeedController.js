import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import * as feedService from '../services/feedService';

/**
 * Controller para manejar la lógica del feed
 * @returns {Object} Estado y funciones del feed
 */
export const useFeedController = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedJobs, setLikedJobs] = useState(new Set());
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [suggestedCompanies, setSuggestedCompanies] = useState([]);
  const [userStats, setUserStats] = useState({
    applicationsSubmitted: 0,
    savedJobs: 0,
    profileViews: 0,
  });
  
  const [filters, setFilters] = useState({
    category: 'todas',
    budget: 'todos',
    location: 'todas',
    verifiedOnly: false,
    search: '',
    sortBy: 'recientes',
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Recargar trabajos cuando cambien los filtros
  useEffect(() => {
    loadJobs();
  }, [filters]);

  /**
   * Carga todos los datos iniciales
   */
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [jobsData, skills, companies, stats] = await Promise.all([
        feedService.fetchJobs(filters),
        feedService.fetchTrendingSkills(),
        feedService.fetchSuggestedCompanies(),
        feedService.fetchUserStats(),
      ]);
      
      setJobs(jobsData);
      setTrendingSkills(skills);
      setSuggestedCompanies(companies);
      setUserStats(stats);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga trabajos con los filtros actuales
   */
  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await feedService.fetchJobs(filters);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error cargando trabajos:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza un filtro específico
   */
  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  /**
   * Actualiza múltiples filtros a la vez
   */
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  };

  /**
   * Resetea todos los filtros
   */
  const resetFilters = () => {
    setFilters({
      category: 'todas',
      budget: 'todos',
      location: 'todas',
      verifiedOnly: false,
      search: '',
      sortBy: 'recientes',
    });
  };

  /**
   * Alterna el like de un trabajo
   */
  const toggleLike = async (jobId) => {
    const newLikedJobs = new Set(likedJobs);
    const isLiked = newLikedJobs.has(jobId);
    
    if (isLiked) {
      newLikedJobs.delete(jobId);
      await feedService.unlikeJob(jobId);
    } else {
      newLikedJobs.add(jobId);
      await feedService.likeJob(jobId);
    }
    
    setLikedJobs(newLikedJobs);
    
    // Actualizar el contador de likes en el trabajo
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId 
          ? { ...job, likes: job.likes + (isLiked ? -1 : 1) }
          : job
      )
    );
  };

  /**
   * Alterna el guardado de un trabajo
   */
  const toggleSave = async (jobId) => {
    if (!user?.id) {
      console.error('Usuario no autenticado');
      return;
    }
    
    const newSavedJobs = new Set(savedJobs);
    const isSaved = newSavedJobs.has(jobId);
    
    try {
      if (isSaved) {
        newSavedJobs.delete(jobId);
        await feedService.unsaveJob(jobId, user.id);
      } else {
        newSavedJobs.add(jobId);
        await feedService.saveJob(jobId, user.id);
      }
      
      setSavedJobs(newSavedJobs);
      
      // Actualizar stats
      setUserStats(prev => ({
        ...prev,
        savedJobs: newSavedJobs.size,
      }));
    } catch (error) {
      console.error('Error al guardar/remover trabajo:', error);
    }
  };

  /**
   * Aplica a un trabajo
   * @param {Object} applicationData - Datos de la aplicación (jobId, freelancerId, coverLetter)
   */
  const applyToJob = async (applicationData) => {
    try {
      const result = await feedService.applyToJob(applicationData);
      
      if (result.success) {
        // Actualizar stats
        setUserStats(prev => ({
          ...prev,
          applicationsSubmitted: prev.applicationsSubmitted + 1,
        }));
        
        // Actualizar el contador de aplicantes en el trabajo
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === applicationData.jobId 
              ? { ...job, applicants: job.applicants + 1 }
              : job
          )
        );
      }
      
      return result;
    } catch (error) {
      console.error('Error aplicando al trabajo:', error);
      throw error;
    }
  };

  /**
   * Busca trabajos
   */
  const searchJobs = (searchTerm) => {
    updateFilter('search', searchTerm);
  };

  /**
   * Carga más trabajos (paginación)
   */
  const loadMoreJobs = async () => {
    // En una implementación real, aquí se cargarían más trabajos
    console.log('Cargando más trabajos...');
  };

  return {
    // Estado
    jobs,
    loading,
    likedJobs,
    savedJobs,
    trendingSkills,
    suggestedCompanies,
    userStats,
    filters,
    
    // Acciones
    toggleLike,
    toggleSave,
    applyToJob,
    updateFilter,
    updateFilters,
    resetFilters,
    searchJobs,
    loadMoreJobs,
    loadJobs,
  };
};

