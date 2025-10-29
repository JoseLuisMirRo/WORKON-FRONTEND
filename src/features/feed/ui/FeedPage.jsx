import { useFeedController } from '../controllers/useFeedController'
import { Loading } from './Loading'
import { SearchBar } from './SearchBar'
import { JobCard } from './JobCard'
import { FeedFilters } from './FeedFilters'
import { FeedStats } from './FeedStats'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'

export const FeedPage = () => {
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
    searchJobs,
    loadMoreJobs,
  } = useFeedController()

  if (loading) {
    return <Loading />
  }

  const handleApply = (jobId) => {
    applyToJob(jobId)
    alert('¡Aplicación enviada con éxito!')
  }

  const handleSkillClick = (skill) => {
    searchJobs(skill)
  }

  return (
    <div className="bg-background">

      <div className="container mx-auto py-6 px-4">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Sidebar - Filters */}
          <aside className="hidden lg:block lg:col-span-3">
            <FeedFilters
              filters={filters}
              onFilterChange={updateFilter}
              trendingSkills={trendingSkills}
              onSkillClick={handleSkillClick}
            />
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6">
            {/* Search and Sort */}
            <div className="mb-6">
              <SearchBar
                onSearch={searchJobs}
                sortBy={filters.sortBy}
                onSortChange={(value) => updateFilter('sortBy', value)}
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
                    onApply={handleApply}
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
    </div>
  )
}
