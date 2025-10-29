import { useState } from 'react'
import { useFeedController } from '../controllers/useFeedController'
import { useAuth } from '../../../contexts/AuthContext'
import { Loading } from './Loading'
import { SearchBar } from './SearchBar'
import { JobCard } from './JobCard'
import { FeedFilters } from './FeedFilters'
import { FeedStats } from './FeedStats'
import { JobApplicationModal } from './JobApplicationModal'
import { Card, CardContent } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { CheckCircle2 } from '../../../components/ui/Icons'

export const FeedPage = () => {
  const { user } = useAuth()
  const {
    jobs,
    loading,
    likedJobs,
    savedJobs,
    trendingSkills,
    suggestedCompanies,
    userStats,
    filters,
    toggleLike,
    toggleSave,
    applyToJob,
    updateFilter,
    resetFilters,
    searchJobs,
    loadMoreJobs,
  } = useFeedController()

  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)

  if (loading) {
    return <Loading />
  }

  const handleApplyClick = (job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleConfirmApplication = async (applicationData) => {
    try {
      // Agregar el freelancerId del usuario autenticado
      const dataToSend = {
        ...applicationData,
        freelancerId: user.id
      }
      
      await applyToJob(dataToSend)
      console.log('Aplicación enviada:', dataToSend)
      
      // Mostrar notificación de éxito
      setApplicationSuccess(true)
      setTimeout(() => setApplicationSuccess(false), 5000)
      
    } catch (error) {
      console.error('Error al aplicar:', error)
      throw error // Re-throw para que el modal lo maneje
    }
  }

  const handleSkillClick = (skill) => {
    searchJobs(skill)
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto py-6 px-4">
        {/* Mensaje de éxito */}
        {applicationSuccess && (
          <Card className="mb-6 border-accent/30 bg-accent/5 animate-in slide-in-from-top">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium">¡Aplicación enviada con éxito!</p>
                <p className="text-xs text-muted-foreground">El empleador revisará tu propuesta pronto.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Sidebar - Filters */}
          <aside className="hidden lg:block lg:col-span-3">
            <FeedFilters
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
            />
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                value={filters.search}
                onSearch={searchJobs}
              />
            </div>

            {/* Job Feed */}
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <Card className="p-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">No se encontraron trabajos</h3>
                  <p className="text-muted-foreground">Intenta ajustar tus filtros de búsqueda</p>
                </Card>
              ) : (
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isLiked={likedJobs.has(job.id)}
                    isSaved={savedJobs.has(job.id)}
                    onLike={toggleLike}
                    onSave={toggleSave}
                    onApply={handleApplyClick}
                  />
                ))
              )}
            </div>

            {/* Load More */}
            {jobs.length > 0 && (
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent"
                  onClick={loadMoreJobs}
                >
                  Cargar más trabajos
                </Button>
              </div>
            )}
          </main>

          {/* Right Sidebar - Stats */}
          <aside className="hidden lg:block lg:col-span-3">
            <FeedStats
              userStats={userStats}
              savedJobsCount={savedJobs.size}
              suggestedCompanies={suggestedCompanies}
            />
          </aside>
        </div>
      </div>

      {/* Modal de aplicación */}
      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
        onConfirm={handleConfirmApplication}
      />
    </div>
  )
}
